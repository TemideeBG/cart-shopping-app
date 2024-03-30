import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { User } from "../interfaces/user.interface";
import { ProductInterface } from "../interfaces/product.interface";
import { StatusCodes } from "http-status-codes";
import { HttpException } from "../exceptions/HttpException";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { CartEntity } from "../entity/cart.entity";
import { UserService } from "./user.service";
import { CartInterface } from "../interfaces/cart.interface";
import { CreateCartDto } from "../dto/cart.dto";
import { ProductService } from "./product.service";
import { UpdateCartDto } from "../dto/update-cart.dto";
import { BadRequestError } from "../errors";
import { ProductEntity } from "../entity/product.entity";


export class CartService  {
    public carts = CartEntity;
    public userService = new UserService();
    public productService = new ProductService();
    public cartRepository = AppDataSource.getRepository(this.carts);

    public async createCart(createCartDto:CreateCartDto, req:AuthenticatedRequest) {
        createCartDto.userId = req.user.id;
        const findUser:User = await this.userService.findById(createCartDto.userId,req);
        if(!findUser) throw new HttpException(StatusCodes.NOT_FOUND, `User with id:${createCartDto.userId} not found`);
        const findProduct:ProductEntity = await this.productService.getSingleProduct(createCartDto.productId);
        if(!findProduct) throw new HttpException(StatusCodes.NOT_FOUND, `Product with id:${createCartDto.productId} not found`);
        const availableProducts = findProduct.num_of_products_created - findProduct.num_of_products_requested;
        if(createCartDto.quantity > availableProducts) throw new HttpException(StatusCodes.BAD_REQUEST, `Products requested for, exceeds the stock available which is ${availableProducts}!!`);
          
        createCartDto.discount = findProduct.company === 'ikea' ? findProduct.price * 0.05 : 0
        createCartDto.price = (findProduct.price - createCartDto.discount).toFixed(2);
        console.log(availableProducts, createCartDto.price, createCartDto.discount);
        createCartDto.productId = findProduct.id;
        req.body.user = req.user;
        const cart = new CartEntity();
        Object.assign(cart, createCartDto);
        //cart.product = findProduct;
        cart.currency = findProduct.currency;
        console.log(cart.currency);
        cart.amount = `${cart.currency}${cart.price}`;
        
        const savedCart = await this.cartRepository.save(cart);
        console.log(savedCart);
        return savedCart; 
    };

    public async getSingleCart(id: string, req: AuthenticatedRequest): Promise<CartInterface> {
        const cart = await this.cartRepository
            .createQueryBuilder("cart")
            .leftJoinAndSelect("cart.user", "user")
            .leftJoinAndSelect("cart.product", "product")
            .select(["cart", "user.id", "user.full_name", "user.email", "user.home_address", "user.city", "product.name", "product.price", "product.description", "product.category", "product.company"])
            .where("cart.id = :id", { id })
            .getOne();
    
        if (!cart) {
            throw new HttpException(StatusCodes.NOT_FOUND, `Cart with id:${id} not found`);
        }
    
        const hasAdminRole = req.user?.role.includes('admin') || req.user?.role.includes('super-admin');
        console.log(cart.user.id, req.user.id, hasAdminRole);
    
        if (cart.user.id !== req.user.id && !hasAdminRole) {
            throw new HttpException(StatusCodes.UNAUTHORIZED, 'You do not have permission to retrieve cart details!!');
        }
    
        return cart;
    }

    public async getCurrentCartUser(req: AuthenticatedRequest): Promise<CartInterface[]> {
        const carts = await this.cartRepository
            .createQueryBuilder("cart")
            .leftJoinAndSelect("cart.user", "user")
            .leftJoinAndSelect("cart.product", "product")
            .select(["cart", "user.full_name", "user.email", "user.home_address", "user.city", "product.name", "product.price", "product.description", "product.category", "product.company"])
            .where("user.id = :userId", { userId: req.user.id })
            .getMany();
    
        if (!carts || carts.length === 0) {
            throw new HttpException(StatusCodes.NOT_FOUND, `No carts found for user with id:${req.user.id}`);
        }
    
        return carts;
    }
    

    public async getAllProducts(): Promise<CartInterface[]> {
        const allCarts = await this.cartRepository
            .createQueryBuilder("cart")
            .leftJoinAndSelect("cart.user", "user")
            .leftJoinAndSelect("cart.product", "product")
            .select(["cart", "user.full_name", "user.email", "user.home_address", "user.city", "product.name", "product.price", "product.description", "product.category", "product.company"])
            .getMany();

        if (!allCarts || allCarts.length === 0) {
            throw new HttpException(StatusCodes.NOT_FOUND, `No cart was found`);
        }
        return allCarts;
    }; 

    async updateCart(cartId: string, updateCartDto: UpdateCartDto, req:AuthenticatedRequest) : Promise<CartInterface> {
        const { quantity, productId } = updateCartDto ;
        let isvalidProduct:ProductInterface = await this.productService.getSingleProduct(productId);
        if(!isvalidProduct) throw new HttpException(StatusCodes.NOT_FOUND, `Product with id:${productId} not found`);

        let cartToUpdate = await this.cartRepository.findOne({ where: { id:cartId } });
        if (!cartToUpdate) {
          throw new  HttpException(StatusCodes.NOT_FOUND, `cart with id:${cartId} not found`);
        };
        const availableProducts = isvalidProduct.num_of_products_created - isvalidProduct.num_of_products_requested;
        if(quantity > availableProducts) throw new BadRequestError(`Movies requested for, exceeds the stock available which is ${availableProducts}!!`);
        const hasAdminRole = req.user?.role.includes('admin') || req.user?.role.includes('super-admin');
        console.log(cartToUpdate.user.id, req.user.id, hasAdminRole);
        if (cartToUpdate.user.id !== req.user.id && !hasAdminRole) throw new HttpException(StatusCodes.UNAUTHORIZED,'You do not have permission to update cart details!!'); 
    
        // Update the product's properties with provided data from updateProductDto
        Object.assign(cartToUpdate, updateCartDto);
       
        const newCartToUpdate = await this.cartRepository.save(cartToUpdate);
        return newCartToUpdate;
      };

    async delete(cartId:string, req:AuthenticatedRequest) {
        const userId = req.user.id;
        const findUser:User = await this.userService.findById(userId,req);
        if(!findUser) throw new HttpException(StatusCodes.NOT_FOUND, `User with id:${userId} not found`);
        const cartToDelete = await this.cartRepository.findOne({ where: { id:cartId }, relations: ["user"] });
        if (!cartToDelete) {
          throw new HttpException(StatusCodes.NOT_FOUND, `Cart with ID ${cartId} not found`);
        };
        const hasAdminRole = req.user?.role.includes('admin') || req.user?.role.includes('super-admin');
        console.log(cartToDelete.user.id, req.user.id, hasAdminRole);
        if (cartToDelete.user.id !== req.user.id && !hasAdminRole) throw new HttpException(StatusCodes.UNAUTHORIZED,'You do not have permission to delete this cart!!');
        await this.cartRepository.remove(cartToDelete);
        return { msg: `Cart placed by: ${findUser.first_name} has been Successfully Deleted` };
      };


}




/*

    public async getCart(id:string, req:AuthenticatedRequest) : Promise<CartInterface> {
        const cart = await this.cartRepository.findOne({ where: { id: id } });
        if(!cart) throw new HttpException(StatusCodes.NOT_FOUND, `Cart with id:${id} not found`);
        const hasAdminRole = req.user?.role.includes('admin') || req.user?.role.includes('super-admin');
        console.log(cart.user.id, req.user.id, hasAdminRole);
        if (cart.user.id !== req.user.id && !hasAdminRole) throw new HttpException(StatusCodes.UNAUTHORIZED,'You do not have permission to retrieve cart details!!');
        return cart;
    };

    public async getCurrentCartUser(req:AuthenticatedRequest) : Promise<CartInterface> {
        const cart = await this.cartRepository.findOne({ where: { user: req.user } });
        if(!cart) throw new HttpException(StatusCodes.NOT_FOUND, `No Cart has been placed by: ${req.user.first_name}`);
        return cart;
    };

    public async getAllProducts()  {
        const allCarts = await this.cartRepository.find();
        if(!allCarts) throw new HttpException(StatusCodes.NOT_FOUND, `No cart was found`);
        return allCarts;
    };


    */