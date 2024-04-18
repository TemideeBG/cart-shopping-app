import { AppDataSource } from "../database/data-source";
import { User } from "../interfaces/user.interface";
import { StatusCodes } from "http-status-codes";
import { HttpException } from "../exceptions/HttpException";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { UserService } from "./user.service";
import { SelectQueryBuilder } from "typeorm";
import { ApiFeatures } from "../utils/api-feature";
import { BlackListedTokenEntity } from "../entity/blacklisted-token.entity";
import { CreateBlackListedTokenDto } from "../dto/blacklisted-token.dto";
import { BlackListedTokenInterface } from "../interfaces/blacklisted-token";
import { isTokenValid } from "../utils/jwt";


export class BlackListedTokenService  {
    public blackListedToken = BlackListedTokenEntity;
    public userService = new UserService();
    public blackListedTokenRepository = AppDataSource.getRepository(this.blackListedToken);

    public async createBlackListedToken(token:string, req:AuthenticatedRequest)  {
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

        const newBlackListedToken = new BlackListedTokenEntity();
        newBlackListedToken.token = token;
        
        const savedBlackListedToken = await this.blackListedTokenRepository.save(newBlackListedToken);
        return { message: `Successfully Logged out ${req.user.first_name}`}; 
    };

    public async getBlackListedTokenById(id: number, req: AuthenticatedRequest): Promise<BlackListedTokenInterface> {
        const blackListedToken = await this.blackListedTokenRepository.findOne({ where: { id: id } });
    
        if (!blackListedToken)  throw new HttpException(StatusCodes.NOT_FOUND, `Black-Listed Token with id:${id} not found`);
        return blackListedToken;
    };

    public async getBlackListedTokenByToken(token: string, req: AuthenticatedRequest) {
        const blackListedToken = await this.blackListedTokenRepository.findOne({ where: { token: token } });
    
        //if (!blackListedToken)  throw new HttpException(StatusCodes.NOT_FOUND, `Black-Listed Token with token:${token} not found`);
        return blackListedToken;
    };


    public async getAllBlackListedTokens() {
        const allTokens = await this.blackListedTokenRepository.find();
        if (!allTokens || allTokens.length === 0) {
            throw new HttpException(StatusCodes.NOT_FOUND, `No Black was found`);
        }
        return allTokens;
    };


}



