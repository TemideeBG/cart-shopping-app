import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserService } from "../services/user.service";
import { HttpException } from "../exceptions/HttpException";

export class UserController {
    public userService = new UserService()

    public findUserById = async (req:Request, res:Response, next:NextFunction) => {
            const user = await this.userService.findById(+req.params.user_id,req);
            return res.status(StatusCodes.OK).json({ data: user, message: 'successfully retrieved user details' });  
    };

    public findAllUsers = async (req:Request, res:Response, next:NextFunction) => {
            const users = await this.userService.getAllUsers();
            return res.status(StatusCodes.CREATED).json({ data: users, message: 'successfully retrieved all user details' });    
    };

    public updateUser = async (req:Request, res:Response, next:NextFunction) => {
            const userData = req.body;
            const user = await this.userService.updateUser(+req.params.user_id, userData,req)
            return res.status(StatusCodes.OK).json({ data: user, message: 'successfully updated user details' });    
    };

    public resetUserPassword = async (req:Request, res:Response, next:NextFunction) => {
            const { oldPassword, newPassword } = req.body;
            const user = await this.userService.resetPassword(+req.params.user_id, oldPassword, newPassword, req)
            return res.status(StatusCodes.OK).json({ data: user, message: 'successfully updated user password' });     
    };

    public deleteUser = async (req:Request, res:Response, next:NextFunction) => {
            const user = await this.userService.delete(+req.params.user_id, req)
            return res.status(StatusCodes.OK).json({ message: 'successfully deleted user' });    
    };
}