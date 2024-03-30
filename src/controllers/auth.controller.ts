import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { HttpException } from "../exceptions/HttpException";
import { AuthService } from "../services/auth.service";

export class AuthController {
    public authService = new AuthService()

    public signUp = async (req:Request, res:Response, next:NextFunction) => {
            const userData = req.body;
            const signUpUserData = await this.authService.signup(userData,req,res);
            return res.status(StatusCodes.CREATED).json({ data: signUpUserData, message: `Successfully Registered ${signUpUserData.newSanitizedUser.full_name} as ${signUpUserData.newSanitizedUser.role}` });     
    };

    public login = async (req:Request, res:Response, next:NextFunction) => {
            const userData = req.body;
            const loginUserData = await this.authService.login(userData,req,res);
            console.log(loginUserData);
            return res.status(StatusCodes.CREATED).json({ data: loginUserData, message: 'Login successful' }); 
    };

    public adminSignup = async (req:Request, res:Response, next:NextFunction) => {
            const adminData = req.body;
            const signUpAdminData = await this.authService.adminSignup(adminData,req,res);
            return res.status(StatusCodes.CREATED).json({ data: signUpAdminData, message: `Successfully Registered ${signUpAdminData.newSanitizedAdmin.full_name} as ${signUpAdminData.newSanitizedAdmin.role}` });      
    };
}