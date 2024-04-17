import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { User } from "../interfaces/user.interface";
import { StatusCodes } from "http-status-codes";
import { HttpException } from "../exceptions/HttpException";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { UserService } from "./user.service";
import { OrderInterface } from "../interfaces/order.interface";
import { CreateOrderDto } from "../dto/order.dto";
import { CartService } from "./cart.service";
import { OrderEntity } from "../entity/order.entity";
import { generateClientSecret, generatePaymentID, generateTrackingOrderID } from "../utils/util";
import { SelectQueryBuilder } from "typeorm";
import { ApiFeatures } from "../utils/api-feature";

export class OrderService  {
    public orders = OrderEntity;
    public userService = new UserService();
    public cartService = new CartService();
    public orderRepository = AppDataSource.getRepository(this.orders);

    async fakeStripeAPI(amount, currency) {
        const client_secret = generateClientSecret();
        return { client_secret, amount };
      };

    public async newOrder(createOrderDto:CreateOrderDto, req:AuthenticatedRequest) : Promise<OrderInterface> {
        createOrderDto.userId = req.user.id;
        const findUser:User = await this.userService.findById(createOrderDto.userId,req);
        if(!findUser) throw new HttpException(StatusCodes.NOT_FOUND, `User with id:${createOrderDto.userId} not found`);
        const { items:cartItems, shipping_fee } = req.body;
        if (!shipping_fee) throw new HttpException(StatusCodes.BAD_REQUEST, `Please provide the shipping fee`);

        if(!cartItems || cartItems.length === 0) throw new HttpException(StatusCodes.BAD_REQUEST,'Please provide cart items');

        let orderItems = [];
        let subTotal = 0;
        //const orderItems: SingleOrderItem[] = [];
        for (const item of cartItems) {
        const validCart = await this.cartService.getSingleCart(item.cartId, req);
        if (!validCart)
        throw new HttpException(StatusCodes.NOT_FOUND, `Cart with the given ID: ${item.cartId} not found`);
        
        const { price, quantity } = validCart;
        const singleOrderItem = {
        quantity: validCart.quantity,
        price: validCart.price,
        cartId: item.cartId,
        };
      console.log(singleOrderItem);

      orderItems = [...orderItems, singleOrderItem];
      subTotal += singleOrderItem.quantity * price;
      console.log(orderItems, subTotal)
    };

      req.body.user = req.user;
      const order = new OrderEntity();
      Object.assign(order, createOrderDto);
      order.tracking_id = generateTrackingOrderID();
      order.sub_total = subTotal;
      order.tax = 0.2 * order.sub_total;
      order.total = shipping_fee + order.sub_total + order.tax;
      order.orderItems = orderItems;

      const payment_intent = await this.fakeStripeAPI(order.total, 'usd');

      order.client_secret = payment_intent.client_secret;

      const savedOrder = await this.orderRepository.save(order);

      return savedOrder;
    };

    public async getSingleOrder(id: string, req: AuthenticatedRequest): Promise<OrderInterface> {
        const order = await this.orderRepository
            .createQueryBuilder("order")
            .leftJoinAndSelect("order.user", "user")
            .select(["order", "user.id", "user.full_name", "user.email", "user.home_address", "user.city"])
            .where("order.id = :id", { id })
            .getOne();
    
        if (!order) throw new HttpException(StatusCodes.NOT_FOUND, `Order with id:${id} not found`);
    
        const hasAdminRole = req.user?.role.includes('admin') || req.user?.role.includes('super-admin');
        console.log(order.user.id, req.user.id, hasAdminRole);
    
        if (order.user.id !== req.user.id && !hasAdminRole) throw new HttpException(StatusCodes.UNAUTHORIZED, 'You do not have permission to retrieve order details!!');
      return order;
    };

    public async getCurrentOrderUser(req: AuthenticatedRequest): Promise<OrderInterface[]> {
        const orders = await this.orderRepository
            .createQueryBuilder("order")
            .leftJoinAndSelect("order.user", "user")
            .select(["order", "user.id", "user.full_name", "user.email", "user.home_address", "user.city"])
            .where("user.id = :userId", { userId: req.user.id })
            .getMany();
    
        if (!orders || orders.length === 0) throw new HttpException(StatusCodes.NOT_FOUND, `No orders found for user with id:${req.user.id}`);
        return orders;
    };

    public async getAll(queryStr: any, req: AuthenticatedRequest): Promise<any> {
        const totalOrderCount = await this.orderRepository.count();
        const resultPerPage = parseInt(String(req.query.limit)) || totalOrderCount;
        const page = parseInt(String(req.query.page)) || 1;

      
        const query: SelectQueryBuilder<OrderEntity> = this.orderRepository.createQueryBuilder("order")
          .leftJoinAndSelect("order.user", "user")
          .select(["order", "user.full_name", 'user.email', "user.email", "user.home_address", "user.city"]);
      
        const apiFeatures = new ApiFeatures<OrderEntity>(query, queryStr);
      
        apiFeatures.search().filter().pagination(resultPerPage);
      
        const orders = await apiFeatures.executeQuery();
      
        const filteredOrderCount = orders.length;
      
        if (orders.length === 0) {
          throw new HttpException(StatusCodes.NOT_FOUND, 'No Orders found', );
        };
      
        return {
          data: orders,
          totalOrderCount,
          filteredOrderCount,
          page,
          resultPerPage,
        };
      };

    public async approveOrder(orderId: string, req:AuthenticatedRequest) : Promise<OrderInterface> {
      const { order_status } = req.body;
      if (!order_status) throw new HttpException(StatusCodes.BAD_REQUEST, 'Please provide the updated status of the order');
      const order = await this.orderRepository.findOne({ where: { id:orderId }, relations: ["user"] });
      if (!order) throw new HttpException(StatusCodes.NOT_FOUND, 'The Order selected for approval does not exist');
      const approverId = req.user.id;
      const validApprover = await this.userService.findById(approverId,req);
      if (!validApprover) throw new HttpException(StatusCodes.NOT_FOUND, 'Approver with the given ID not found');
      order.payment_intent_id = generatePaymentID();
      order.order_status = order_status;
  
      const savedOrder = await this.orderRepository.save(order);
      return savedOrder;
      };

    public async delete(orderId:string, req:AuthenticatedRequest) {
      const userId = req.user.id;
      const findUser:User = await this.userService.findById(userId,req);
      if(!findUser) throw new HttpException(StatusCodes.NOT_FOUND, `User with id:${userId} not found`);
      const orderToDelete = await this.orderRepository.findOne({ where: { id:orderId }, relations: ["user"] });
      if (!orderToDelete) {
        throw new HttpException(StatusCodes.NOT_FOUND, `Order with ID ${orderId} not found`);
      };
      const hasAdminRole = req.user?.role.includes('admin') || req.user?.role.includes('super-admin');
      console.log(orderToDelete.user.id, req.user.id, hasAdminRole);
      if (orderToDelete.user.id !== req.user.id && !hasAdminRole) throw new HttpException(StatusCodes.UNAUTHORIZED,'You do not have permission to delete this cart!!');
  
      await this.orderRepository.remove(orderToDelete);
      return { msg: `Order placed by: ${findUser.first_name} has been Successfully Deleted` };
      };

    

    /*

    public async delete(productId: number, req:AuthenticatedRequest) {
        const userId = req.user.id;
        const findUser:User = await this.userService.findById(userId,req);
        if(!findUser) throw new HttpException(StatusCodes.NOT_FOUND, `User with id:${userId} not found`);
        const productToDelete = await this.productRepository.findOne({ where: { id:productId } });
        if (!productToDelete) {
          throw new HttpException(StatusCodes.NOT_FOUND, `Product with ID ${productId} not found`);
        };
        await this.productRepository.remove(productToDelete);
        return { msg: `Product: ${productToDelete.name} Successfully Deleted` };
      };

      */
};

