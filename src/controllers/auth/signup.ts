/*
import { Request, Response } from "express";
import { AppDataSource } from "../../database/data-source";
import { User } from "../../entity/user.entity";
import { encrypt } from "../../helpers/helpers";
import { UserResponse} from "../../dto/user-response.dto"; // Import UserDto from the correct path
import * as cache from "memory-cache";
import { StatusCodes } from "http-status-codes";
import userAge from "../../helpers/getUserAge";

export class AuthController {

    static async signup(req: Request, res: Response) {
        try {
        const { first_name, last_name, email, password, role, nationality,home_address, city, gender, date_of_birth, phone_number } = req.body;
        // Validate required fields
        if (!first_name || !last_name || !email || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: 'Please provide firstName, lastName, email and password.',
        });
        };
        const userRepository = AppDataSource.getRepository(User);
        const existingUser = await userRepository.findOne({ where: { email }  });
        if (existingUser) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: 'Email is already in use. Please choose another email.',
              });
        }
        const encryptedPassword = await encrypt.encryptpass(password);
        const newUser = await userRepository.create({
            first_name, 
            last_name, 
            full_name: `${first_name} ${last_name}`,
            email, 
            password: encryptedPassword, 
            role, 
            nationality, 
            home_address,
            city,
            gender, 
            date_of_birth, 
            phone_number
        });
        newUser.age = userAge(newUser.date_of_birth)

        await userRepository.save(newUser);
    // Use the UserResponse DTO to structure the data being sent in the response
        const userDataSent = UserResponse.fromUser(newUser);
        const token = encrypt.generateToken({
            id: newUser.id,
            first_name: newUser.first_name,
            email: newUser.email,
            role: newUser.role,
        });
    
        return res
          .status(200)
          .json({ message: "User created successfully", token, userDataSent });
            
        } catch (error) {
        console.error('Error during signup:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: 'Something went wrong. Please try again later.',
           });     
         }
      }
}

*/
  