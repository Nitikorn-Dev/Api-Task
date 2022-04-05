import { Request, Response, NextFunction, Router } from 'express';
import { check, validationResult } from 'express-validator';
import { BadRequestException } from '../../../utils/custom-error/custom-error.model';
import ModelUser, { User } from '../models/user';
import { sign, SignOptions, verify } from 'jsonwebtoken';
import bcrypt = require("bcrypt");
import auth from '../middleware';

const userRouter = Router();

userRouter.post('/register', [
    check('username', 'Username must be at  4 - 8 chars long'),
    check('password', 'Password is too small, try harder').isLength({ min: 4 }),
    check('passwordCheck', 'Password is too small, try harder').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new BadRequestException('Password confirmation does not match password');
        }
        // Indicates the success of this synchronous custom validator
        return true;
    })
], async (req: Request, res: Response, next: NextFunction) => {
    const { password, passwordCheck, username } = req.body;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const existingUser = await ModelUser.findOne({ username })
        if (existingUser) {
            return res.status(400).json({ msg: 'Username exists, think of something unique 🦄' })
        }

        const salt = await bcrypt.genSalt()
        const passwordHash = await bcrypt.hash(password, salt)
        const newUser = new ModelUser({ username, password: passwordHash })
        const response = await newUser.save()
        res.send({ username: response.username, _id: response._id })

    } catch (error: any) {
        if (error.name === 'ValidationError')
            return res.status(422)
        next(error)
    }

})

userRouter.post('/login', [
    check("username", "Don\'t be lazy 🦥,please enter username").isLength({ min: 1 }),
    check("password", "Don\'t be lazy 🦥,please enter password").isLength({ min: 1 })
], async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()[0].msg })
        }
        const user = await ModelUser.findOne({ username })
        if (!user)
            return res.status(400).json({ msg: 'User doesn\'t exist 🙈' })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials 🤕' })
        }
        console.log("Gen")
        const token = sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET!)
        res.json({
            token,
            user: {
                id: user._id,
                username: user.username
            }
        })
    } catch (error) {
        next(error)
    }
});

userRouter.post('/tokenIsValid', async (req: Request & any, res: Response, next: NextFunction) => {
    // const {id}
    try {
        const token = req.header('x-auth-token')
        if (!token) return res.json(false)

        const verified = verify(token, process.env.JWT_SECRET!) as User;
        if (!verified) return res.json(false)
        const user = await ModelUser.findById(verified.id)

        if (!user) return res.json(false)

        return res.json(true)
    } catch (error) {
        next(error)
    }
})

interface TypeRequestBody<T> extends Request {
    body: T
}

userRouter.get('/', auth, async (req: TypeRequestBody<{ user: User }>, res: Response, next: NextFunction) => {
    const { user } = req.body;
    try {
        const user = await ModelUser.findById(req.body.user)
        if (!user)
            return res.status(404).send()
        res.json({
            username: user.username,
            id: user._id,
        })
    } catch (error) {
        next(error)
    }
})

export default userRouter;