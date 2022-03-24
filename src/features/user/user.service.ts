import { body, validationResult } from 'express-validator';
import { User } from './user.interface';
import UserModel from './user.model';
import AuthService from '../auth/auth.service';

class UserService {

    constructor() {

    }

    async createUser(user: User) {

        let checkEmail = await findByEmail(user.email)
        if (checkEmail) {
            return {
                errors: [
                    {
                        email: user.email,
                        msg: "The user already exists",
                    },
                ]
            }
        }

        const passwordHash = await AuthService.hashPassword(user.password!);
        await UserModel.create({ ...user, password: passwordHash });
        const token = await AuthService.generateJWT(user);
        return { token, message: "create user Success" };
    }


    async findByEmail() {

    }

}


const createUser = async (user: User) => {

    let checkEmail = await findByEmail(user.email)
    if (checkEmail) {
        return {
            errors: [
                {
                    email: user.email,
                    msg: "The user already exists",
                },
            ]
        }
    }

    const passwordHash = await AuthService.hashPassword(user.password!);
    await UserModel.create({ ...user, password: passwordHash });
    const token = await AuthService.generateJWT(user);
    return { token, message: "create user Success" };

}

const findAll = async (): Promise<User[]> => {
    return await UserModel.find().exec();
}

const findOne = async (id: number | string): Promise<User> => {
    return await UserModel.findOne({ id }).select({ username: 1, email: 1 });
}

const findByEmail = async (email: string) => {
    return await UserModel.findOne({ email })
}


export default { createUser, findAll };