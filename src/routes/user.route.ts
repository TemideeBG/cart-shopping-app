import { Router } from 'express';
import { Routes } from '../interfaces/routes.interface';
import { AuthController } from '../controllers/auth.controller';
import { UserController } from '../controllers/user.controller';
import { authentication, authorizeRoles } from '../middleware/auth.middleware';

class UserRoute implements Routes {
  public path = '/user';
  public router = Router();
  public userController = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:user_id`, authentication, this.userController.findUserById);
    this.router.get(`${this.path}`, authentication, authorizeRoles('admin', 'super-admin'), this.userController.findAllUsers);
    this.router.patch(`${this.path}/:user_id`, authentication, this.userController.updateUser);
    this.router.patch(`${this.path}/edit-password/:user_id`, authentication, this.userController.resetUserPassword);
    this.router.delete(`${this.path}/:user_id`, authentication, authorizeRoles('super-admin'), this.userController.deleteUser);
  }
}

export default UserRoute;
