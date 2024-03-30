import * as jwt from 'jsonwebtoken';
import { User } from '../interfaces/user.interface';
import { Payload } from '../types/payload';

const createJWT = (user: User): string => {
  const token = jwt.sign(user, process.env.JWT_SECRET as string, { expiresIn: "1d" });
  return token;
};

const isTokenValid = (token: string): Payload | null => {
  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as Payload;
      return decoded;
  } catch (error) {
      console.error('Error verifying token:', error);
      return null;
  }
};

/*
const isTokenValid = (token: string): AuthenticatedUser | null => {
  try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as AuthenticatedUser;
      return decodedToken;
  } catch (error) {
      // Token is invalid or has expired
      console.error('Token is invalid or has expired:', error);
      throw new HttpException(StatusCodes.INTERNAL_SERVER_ERROR,'Token is invalid or has expired');
      //return null;
  }
};
*/

export {
  createJWT,
  isTokenValid
};
