import { Request, Response, NextFunction } from "express";
import AuthService from "../auth.service";
import { config } from "dotenv";
import { User } from '../../user/user.interface';
import { UnauthorizedException, ForbiddenException } from "../../../utils/custom-error/custom-error.model";
config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;

const JwtAuthGuard = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer Token
    if (!token) {
        next(new UnauthorizedException("Token not found"))
    }

    try {
        await AuthService.validateJWT(token!, ACCESS_TOKEN_SECRET) as User;
        next();
    } catch (error: any) {
        next(new ForbiddenException("Invalid token, You are unauthorised", 404))
    }

}

export default JwtAuthGuard;