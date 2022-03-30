import { NextFunction, Router } from "express";
import { Request, Response } from 'express'
import { check, validationResult } from "express-validator";
import { User } from "./user.interface";

import UserService from './user.service';

import { Query, Send } from 'express-serve-static-core';
import { CustomError, NotFoundException, } from "../../utils/custom-error/custom-error.model";

export const userRouter = Router();

//Type Request
interface TypeRequestBody<T> extends Request {
    body: T
}
interface TypeRequest<T, U extends Query> extends Request {
    body: T
    query: U
}
//Type Response
interface TypeResponse<ResBody> extends Response {
    json: Send<ResBody, this>
}

//Sign up
userRouter.post('/create', [
    check('username', 'Username must be at  4 - 20 chars long').isLength({ min: 4, max: 20 }),
    check('email', 'Invalid email').isEmail(),
    check('password', 'Password must be at  4 - 8 chars long').isLength({ min: 4, max: 8 }),
], async (req: TypeRequest<User, { id: string }>, res: Response, next: NextFunction) => {
    const user = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // return res.status(400).json({ errors: errors.array() })
        // throw new CustomError(errors.array())
        return next(new CustomError(errors.array()))
        return;
    }

    // try {

    //     const response = await UserService.createUser(user)
    //     return res.status(200).send(response)

    // } catch (error: any) {

    //     return next(error)
    // }

});


// Get all user
userRouter.get('/', async (req: Request, res: Response) => {
    try {
        const data = await UserService.findAll();
        return res.status(200).send(data);
    } catch (error) {
        return res.status(400).json(error)
    }
})


userRouter.get(':id', async (req: TypeRequest<any, { id: string }>, res: TypeResponse<User>): Promise<User | Object> => {
    try {
        const user = await UserService.findOne(req.query.id);
        return res.status(200).json(user!)

    } catch (error) {
        return res.status(400).send({ error })
    }
})

// Login
userRouter.post('/login', [
    check('email', 'Invalid email'),
    check('password', 'Password must be at  4 - 8 chars long').isLength({ min: 4, max: 8 })
], async (req: TypeRequestBody<User>, res: Response) => {
    const user = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const user = await UserService.login(req.body);
        return res.status(200).json(user);
    } catch (error) {
        console.log(error)
        return res.status(400).json({ error })
    }

})


userRouter.post('/token', async (req: Request, res: Response, next: NextFunction) => {
    let refreshToken = req.headers.authorization;
    if (!refreshToken) {
        return next(new CustomError("Token not found", 401))
        // return res.status(401).json({ message: "Token not found" })
    }
    if (refreshToken.toLowerCase().startsWith('bearer')) {
        refreshToken = refreshToken.slice('bearer'.length).trim();
    }

    try {
        const user = await UserService.createRefreshJWT(refreshToken);
        return res.status(200).json(user);
    } catch (error: any) {
        next(error)
        // if (error.message === "Invalid refresh token") {
        //     return res.status(403).json(error.message)
        // }
        // else {
        //     return res.status(500).json(error.message)
        // }
    }
});

userRouter.delete("/logout", async (req: Request, res: Response) => {
    const refreshToken = req.body;
    await UserService.removeRefreshToken(refreshToken);
    return res.sendStatus(204);
})

export default userRouter;