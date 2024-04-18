import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { User } from "../interfaces/user.interface";
import { encrypt } from "../helpers/helpers";
import userAge from "../helpers/getUserAge";
import { UserEntity } from "../entity/user.entity";
import { CreateUserDto } from "../dto/user.dto";
import { BadRequestError } from "../errors";
import { isEmpty } from "../utils/util";
import { StatusCodes } from "http-status-codes";
import { HttpException } from "../exceptions/HttpException";

export class AuthService {
    public users = UserEntity;

    public async signup(userData:CreateUserDto, req:Request, res:Response) {  
        if (isEmpty(userData)) throw new BadRequestError("Please provide the required data");

        //console.log(userData)
        const userRepository = AppDataSource.getRepository(this.users);
        const existingUser = await userRepository.findOne({ where: { email: userData.email }  });
        if (existingUser) throw new HttpException(StatusCodes.BAD_REQUEST, 'Email is already in use. Please choose another email.')
        const encryptedPassword = await encrypt.encryptpass(userData.password);
        const createUserData: User = await userRepository.create({ ...userData, password: encryptedPassword });
        createUserData.full_name = `${createUserData.first_name} ${createUserData.last_name}`;
        createUserData.age = userAge(createUserData.date_of_birth);
        if(createUserData.role == "admin" || createUserData.role == "super-admin") throw new HttpException(StatusCodes.UNAUTHORIZED, 'You do not have the privilege to set role as admin or super-admin')
        await userRepository.save(createUserData);
        const newSanitizedUser = this.sanitizeUser(createUserData);
        console.log(newSanitizedUser)
      
        return { newSanitizedUser };
      };

      public async login(userData:CreateUserDto, req:Request, res:Response) {
        if (isEmpty(userData)) throw new HttpException(StatusCodes.BAD_REQUEST,"You're not userData");

        const userRepository = AppDataSource.getRepository(this.users);
        const findUser: User = await userRepository.findOne({ where: { email: userData.email }  });
        if (!findUser) throw new HttpException(StatusCodes.NOT_FOUND, `User with email:${userData.email} not found`);
        const isValidPassword = await encrypt.comparepassword(findUser.password, userData.password);
        if(!isValidPassword) throw new HttpException(StatusCodes.BAD_REQUEST, `Incorrect Password!!Please try again`);

        // User is authenticated, generate token and send response
        const token = encrypt.generateToken({
        id: findUser.id,
        first_name: findUser.first_name,
        email: findUser.email,
        role: findUser.role,
       });
       const newSanitizedUser = this.sanitizeUser(findUser);
      
      return { newSanitizedUser, token };

    };

    public async adminSignup(adminData:CreateUserDto, req:Request, res:Response) {  
      if (isEmpty(adminData)) throw new BadRequestError("Please provide the required data");

      const adminRepository = AppDataSource.getRepository(this.users);
      const existingAdmin = await adminRepository.findOne({ where: { email: adminData.email }  });
      if (existingAdmin) throw new HttpException(StatusCodes.BAD_REQUEST, 'Email is already in use. Please choose another email.')
      const encryptedPassword = await encrypt.encryptpass(adminData.password);
      const createAdminData = await adminRepository.create({ ...adminData, password: encryptedPassword });
      createAdminData.full_name = `${createAdminData.first_name} ${createAdminData.last_name}`;
      createAdminData.age = userAge(createAdminData.date_of_birth);
      await adminRepository.save(createAdminData);
      const newSanitizedAdmin = this.sanitizeUser(createAdminData);
      console.log(newSanitizedAdmin);
    
      return { newSanitizedAdmin };
    };

    // Adjusted sanitizeUser method
     public sanitizeUser(user: User): Partial<User> {
      const { password, ...sanitizedUser } = user;
      return sanitizedUser;
    };
};

  