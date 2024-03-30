import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { AppDataSource } from "../database/data-source";
import { UserEntity } from "../entity/user.entity";
import { HttpException } from "../exceptions/HttpException";
import { StatusCodes } from "http-status-codes";
import { isTokenValid } from "../utils/jwt";
dotenv.config();
/*
export interface AuthenticatedUser {
  full_name: string;
  userId: number;
  role: string;
};
*/

export interface AuthenticatedUser {
  id: number;
  first_name: string;
  email: string;
  role: string;
}

// Extend the Express Request interface to include the 'user' property
export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
};

export const authentication = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;

  const authHeader = req.headers.authorization as string;
  if (authHeader && authHeader.startsWith('Bearer')) {
      token = authHeader.split(' ')[1];
  }

  if (!token) {
      throw new HttpException(StatusCodes.UNAUTHORIZED, 'Authentication invalid!! Please Login Afresh');
  }

  const decodedPayload = isTokenValid(token);
  if (!decodedPayload) {
      throw new HttpException(StatusCodes.UNAUTHORIZED, 'Authentication invalid');
  }

  const { id, first_name, email, role } = decodedPayload;

  // Attach the user and his permissions to the req object
  req.user = { id, first_name, email, role };
  console.log(req.user)

  next();
};


export const authorizeRoles = (...roles: string[]) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
          return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'No authentication token provided' });
      }

      try {
          const decodedToken = isTokenValid(token);
          if (!decodedToken) {
              return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Invalid or expired authentication token' });
          };
          console.log(decodedToken.role);

          // Check if the user role is included in the allowed roles
          if (!roles.includes(decodedToken.role)) {
              return res.status(StatusCodes.FORBIDDEN).json({ error: 'Unauthorized to access this route' });
          }

          next();
      } catch (error) {
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
      }
  };
};

