import { Router } from "express";
import { Request, Response } from 'express'
import { body, check, validationResult } from "express-validator";
import { User } from "./user.interface";
import UserService from './user.service';

import { Query, Send } from 'express-serve-static-core';

export const userRouter = Router();

//Type Request
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
    check('email', 'is not Email').isEmail(),
    check('password', 'Password must be at  4 - 8 chars long').isLength({ min: 4, max: 8 }),
], async (req: TypeRequest<User, { id: string }>, res: Response) => {
    const user = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const response = await UserService.createUser(user)
        return res.status(200).send(response)
    } catch (error) {
        console.log("Catch Error", error)
        res.status(400).send(error)
    }

});


// Get all user
userRouter.get('/', async (req: Request, res: Response) => {

    try {
        const data = await UserService.findAll();
        return res.status(200).send(data);
    } catch (error) {
        throw new Error('could not find users')
    }
})


userRouter.get(':id', async (req: TypeRequest<any, { id: string }>, res: TypeResponse<User>) => {
    try {
        const user = await UserService.findOne(req.query.id);
        return res.status(200).json({ ...user })

    } catch (error) {

    }
})

export default userRouter;