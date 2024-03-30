import { Router } from 'express';
import { Routes } from '../interfaces/routes.interface';
import { AuthController } from '../controllers/auth.controller';
import { authentication, authorizeRoles } from '../middleware/auth.middleware';

class AuthRoute implements Routes {
  public path = '/auth';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/signup`, this.authController.signUp);
    this.router.post(`${this.path}/login`, this.authController.login);
    this.router.post(`${this.path}/admin/signup`,authentication, authorizeRoles("super-admin"), this.authController.adminSignup);
    //this.router.post(`${this.path}logout`, authMiddleware, this.authController.logOut);
  }
}

export default AuthRoute;



/*
import { Router } from 'express';
import { Routes } from '../interfaces/routes.interface';
import { AuthController } from '../controllers/auth.controller';

export const authRouter = Router();
const authController = new AuthController();


// Admin level routes
authRouter.route("/signup").post(authController.signUp);
authRouter.route("/login").post(authController.login);

*/

