import { Router } from 'express';
import { Routes } from '../interfaces/routes.interface';
import { authentication, authorizeRoles, checkBlackist } from '../middleware/auth.middleware';
import { OrderController } from '../controllers/order.controller';

class OrderRoute implements Routes {
  public path = '/order';
  public router = Router();
  public orderController = new OrderController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, authentication, checkBlackist, this.orderController.addNewOrder);
    this.router.get(`${this.path}/:order_id`, authentication, checkBlackist, this.orderController.findOrderById);
    this.router.get(`${this.path}`, authentication, checkBlackist, this.orderController.findUserOrder);
    this.router.get(`${this.path}/all/orders`, authentication, checkBlackist, authorizeRoles('admin', 'super-admin'), this.orderController.findAllOrders);
    this.router.patch(`${this.path}/:order_id`, authentication, checkBlackist, authorizeRoles('admin', 'super-admin'), this.orderController.approveOrder);
    this.router.delete(`${this.path}/:order_id`, authentication, checkBlackist, this.orderController.deleteOrder);
  }
}

export default OrderRoute;
