/*
import { Request, Response } from 'express';
import { AppDataSource } from '../../database/data-source';
import { User } from '../../entity/user.entity';
import { encrypt } from '../../helpers/helpers';
import { UserResponse } from '../../dto/user-response.dto';
import { CustomAPIError } from '../../errors';
import { StatusCodes } from 'http-status-codes';

export class AuthController {

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: 'Please provide email and password.',
        });
      }

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { email } });
      const isPasswordValid = encrypt.comparepassword(user.password, password)

      if (!user || !isPasswordValid) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          error: 'Invalid email or password.',
        });
      }

      // User is authenticated, generate token and send response
      const token = encrypt.generateToken({
        id: user.id,
        first_name: user.first_name,
        email: user.email,
        role: user.role,
      });

      // Use the UserResponse DTO to structure the data being sent in the response
      const userDataSent = UserResponse.fromUser(user);

      return res.status(StatusCodes.OK).json({
        message: 'Login successful',
        token,
        userDataSent,
      });

    } catch (error) {
      console.error('Error during login:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: 'Something went wrong. Please try again later.',
      });
    }
  }
}

*/
