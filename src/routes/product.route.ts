import { Router } from 'express';
import { Routes } from '../interfaces/routes.interface';
import { authentication, authorizeRoles } from '../middleware/auth.middleware';
import { ProductController } from '../controllers/product.controller';

class ProductRoute implements Routes {
  public path = '/product';
  public router = Router();
  public productController = new ProductController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, authentication, authorizeRoles('super-admin'), this.productController.addNewProduct);
    this.router.get(`${this.path}/:product_id`, authentication, this.productController.findProductById);
    this.router.get(`${this.path}`, authentication, this.productController.findAllProducts);
    this.router.patch(`${this.path}/:product_id`, authentication, authorizeRoles('admin', 'super-admin'), this.productController.updateProduct);
    this.router.delete(`${this.path}/:product_id`, authentication, authorizeRoles('super-admin'), this.productController.deleteProduct);
  }
}

export default ProductRoute;
