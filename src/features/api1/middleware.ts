import { Request, Response, NextFunction } from 'express';
import { sign, SignOptions, verify } from 'jsonwebtoken';
import { User } from './models/user';
import dotenv from "dotenv"
interface TypeRequestBody<T> extends Request {
    body: T
}

const auth = (req: TypeRequestBody<{ user: User }>, res: Response, next: NextFunction) => {
    const token = req.header('x-auth-token')
    try {
        if (!token)
            return res.status(401)
                .json({ msg: 'No authentication token, access denied.' })
        const verified = verify(token, process.env.ACCESS_TOKEN_SECRET!) as User
        if (!verified)
            return res.status(401)
                .json({ msg: 'Token verification failed, access denied.' })
        req.body.user = verified
        next();
    } catch (error) {
        next(error)
    }
}

export default auth;