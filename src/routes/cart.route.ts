import { Router } from 'express';
import { Routes } from '../interfaces/routes.interface';
import { authentication, authorizeRoles } from '../middleware/auth.middleware';
import { CartController } from '../controllers/cart.controller';

class CartRoute implements Routes {
  public path = '/cart';
  public router = Router();
  public cartController = new CartController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, authentication, this.cartController.addNewCart);
    this.router.get(`${this.path}/:cart_id`, authentication, this.cartController.findCartById);
    this.router.get(`${this.path}`, authentication, this.cartController.findUserCart);
    this.router.get(`${this.path}/all/carts`, authentication, authorizeRoles('admin', 'super-admin'), this.cartController.findAllCarts);
    this.router.patch(`${this.path}/:cart_id`, authentication, this.cartController.updateCart);
    this.router.delete(`${this.path}/:cart_id`, authentication, this.cartController.deleteCart);
  }
}

export default CartRoute;
