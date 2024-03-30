import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { User } from "../interfaces/user.interface";
import { encrypt } from "../helpers/helpers";
import userAge from "../helpers/getUserAge";
import { UserEntity } from "../entity/user.entity";
import { StatusCodes } from "http-status-codes";
import { HttpException } from "../exceptions/HttpException";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { UpdateUserDto } from "../dto/update-user.dto";
import { AuthService } from "./auth.service";

export class UserService {
    public users = UserEntity;
    public authService = new AuthService();
    public userRepository = AppDataSource.getRepository(this.users);

    public async findById(id:number, req:AuthenticatedRequest) {
        const user = await this.userRepository.findOne({ where: { id: id } });
        //console.log(user)
        if(!user) throw new HttpException(StatusCodes.NOT_FOUND, `User with id:${id} not found`);
        const hasAdminRole = req.user?.role.includes('admin') || req.user?.role.includes('super-admin');
        console.log(user.id, req.user.id, hasAdminRole);
        if (user.id !== req.user.id && !hasAdminRole) throw new HttpException(StatusCodes.UNAUTHORIZED,'You do not have permission to retrieve user details!!');
        return user;
    };

    public async getAllUsers() {
        const allUsers = await this.userRepository.find();
        if(!allUsers) throw new HttpException(StatusCodes.NOT_FOUND, `No user was found`);
        return allUsers;
    };

    async updateUser(userId: number, updateUserDto: UpdateUserDto, req:AuthenticatedRequest) : Promise<Partial<User>> {
      let userToUpdate = await this.userRepository.findOne({ where: { id:userId } });
  
      if (!userToUpdate) {
        throw new  HttpException(StatusCodes.NOT_FOUND, `User with id:${userId} not found`);
      };

      const hasAdminRole = req.user?.role.includes('admin') || req.user?.role.includes('super-admin');

      console.log(userToUpdate.id, req.user.id, hasAdminRole);
    
      if(userToUpdate.id !== req.user.id && !hasAdminRole) throw new HttpException(StatusCodes.UNAUTHORIZED,'You do not have permission to update user!!');
      if(req.user.role == "admin" && userToUpdate.role == "super-admin") throw new HttpException(StatusCodes.UNAUTHORIZED,'You do not have permission to update super-admin!!');
      if(req.user.role !== "super-admin" && updateUserDto.role == "admin" || updateUserDto.role == "super-admin") throw new HttpException(StatusCodes.UNAUTHORIZED, 'You do not have the privilege to update user role to admin or super-admin!!')
  
      // Update the user's properties with provided data from updateUserDto
      Object.assign(userToUpdate, updateUserDto);
     
      const newUserToUpdate = await this.userRepository.save(userToUpdate);

      return this.authService.sanitizeUser(newUserToUpdate);
    };

    public async resetPassword(userId:number, oldPassword:string, newPassword:string, req:AuthenticatedRequest) {
        
          const user = await this.userRepository.findOne({ where: { id:userId } });
            if (!user) {
            throw new HttpException(StatusCodes.NOT_FOUND,`User with ID ${userId} not found`);
          };
            console.log(user, user.password, newPassword, oldPassword)
         
          const isValidPassword = await encrypt.comparepassword(user.password, oldPassword);
          if (!isValidPassword) {
            throw new HttpException(StatusCodes.BAD_REQUEST,'Invalid Password!!Please input correct password');
          };
          
          const hasAdminRole = req.user?.role.includes('admin') || req.user?.role.includes('super-admin');

          console.log(user.id, req.user.id, hasAdminRole);
    
          if (user.id !== req.user.id && !hasAdminRole) throw new HttpException(StatusCodes.UNAUTHORIZED,'You do not have permission to reset user password!!')
      
          const hashedNewPassword = await encrypt.encryptpass(newPassword);
          user.password = hashedNewPassword ;
          await this.userRepository.save(user);
          return { msg: `Successfully Updated: ${user.first_name} ${user.last_name} Password` };
          
    };

    async delete(id: number, req:AuthenticatedRequest) {
        const userToDelete = await this.userRepository.findOne({ where: { id:id } });
        if (!userToDelete) {
          throw new HttpException(StatusCodes.NOT_FOUND, `User with ID ${id} not found`);
        };
  
        await this.userRepository.remove(userToDelete);
        return { msg: `User: ${userToDelete.full_name} Successfully Deleted` };
      };

}

/*
{
    "home_address": "30 Community Road,Ilaje, Bariga",
    "city": "Lagos",
    "phone_number": "08124447366"
}
*/