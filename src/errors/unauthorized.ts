import { StatusCodes } from 'http-status-codes';
import CustomAPIError from './custom-api';

class UnauthorizedError extends CustomAPIError {
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

export default UnauthorizedError;
