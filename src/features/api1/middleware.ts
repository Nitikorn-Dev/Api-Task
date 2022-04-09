import { Request, Response, NextFunction } from 'express';
import { sign, SignOptions, verify } from 'jsonwebtoken';
import { User } from './models/user';
import ModelList from './models/list';
import ModelBoard from './models/board';
import dotenv from "dotenv"
import { TypeRequestBody, CustomRequest, TypeRequest, Auth } from './interface/type';
import { Board } from './models/board';

namespace UseGard {

    export function auth(req: TypeRequestBody<any>, res: Response, next: NextFunction) {
        const token = req.header('x-auth-token')
        try {
            if (!token)
                return res.status(401)
                    .json({ msg: 'No authentication token, access denied.' })
            const verified = verify(token, process.env.ACCESS_TOKEN_SECRET!) as User
            if (!verified)
                return res.status(401)
                    .json({ msg: 'Token verification failed, access denied.' })
            req.user = verified
            next();
        } catch (error) {
            next(error)
        }
    }

    export function UserIsUserGuard(req: TypeRequestBody<{ board: Board }>, res: Response, next: NextFunction) {
        const user: User = req.user;
        // const
        // try {
        //     // const check = ModelBoard.fi
        // } catch (error) {

        // }
    }

}


export default UseGard;