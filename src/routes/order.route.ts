import { Router } from 'express';
import { Routes } from '../interfaces/routes.interface';
import { authentication, authorizeRoles } from '../middleware/auth.middleware';
import { OrderController } from '../controllers/order.controller';

class OrderRoute implements Routes {
  public path = '/order';
  public router = Router();
  public orderController = new OrderController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, authentication, this.orderController.addNewOrder);
    this.router.get(`${this.path}/:order_id`, authentication, this.orderController.findOrderById);
    this.router.get(`${this.path}`, authentication, this.orderController.findUserOrder);
    this.router.get(`${this.path}/all/orders`, authentication, authorizeRoles('admin', 'super-admin'), this.orderController.findAllOrders);
    this.router.patch(`${this.path}/:order_id`, authentication, authorizeRoles('admin', 'super-admin'), this.orderController.approveOrder);
    this.router.delete(`${this.path}/:order_id`, authentication, this.orderController.deleteOrder);
  }
}

export default OrderRoute;
