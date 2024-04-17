import { Router } from 'express';
import { Routes } from '../interfaces/routes.interface';
import { AuthController } from '../controllers/auth.controller';
import { UserController } from '../controllers/user.controller';
import { authentication, authorizeRoles, checkBlackist } from '../middleware/auth.middleware';

class UserRoute implements Routes {
  public path = '/user';
  public router = Router();
  public userController = new UserController();
  //public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:user_id`, authentication, checkBlackist, this.userController.findUserById);
    this.router.get(`${this.path}`, authentication, checkBlackist, authorizeRoles('admin', 'super-admin'), this.userController.findAllUsers);
    this.router.get(`${this.path}/all/black-listed-tokens`, authentication, this.userController.findAllBlackListedTokens);
    this.router.patch(`${this.path}/:user_id`, authentication, checkBlackist, this.userController.updateUser);
    this.router.patch(`${this.path}/edit-password/:user_id`, authentication, checkBlackist, this.userController.resetUserPassword);
    this.router.delete(`${this.path}/:user_id`, authentication, checkBlackist, authorizeRoles('super-admin'), this.userController.deleteUser);
  }
}

export default UserRoute;
