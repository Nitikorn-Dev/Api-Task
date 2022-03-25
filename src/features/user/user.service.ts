import { body, validationResult } from 'express-validator';
import { User } from './user.interface';
import UserModel from './user.model';
import AuthService from '../auth/auth.service';

namespace UserService {
    export const createUser = async (user: User) => {

        let checkEmail = await findByEmail(user.email)
        if (checkEmail) {
            return {
                errors: [
                    {
                        email: user.email,
                        msg: "E-mail already in use",
                    },
                ]
            }
        }

        const passwordHash = await AuthService.hashPassword(user.password!);
        await UserModel.create({ ...user, password: passwordHash });
        const token = await AuthService.generateJWT(user);
        return { token, message: "create user Success" };

    }

    export const findAll = async (): Promise<User[]> => {
        return await UserModel.find().exec();
    }

    export const findOne = async (id: number | string) => {
        return await UserModel.findOne({ id }).select({ username: 1, email: 1 });
    }

    export const findByEmail = async (email: string): Promise<User | null> => {
        return await UserModel.findOne({ email })
    }


    export const login = async (user: User) => {

        return findByEmail(user.email).then((user) => {

        })
    }

}

export default UserService;
// module.exports.createUser = createUser;
// module.exports = findAll;
// module.exports = { findAll, createUser };
console.log(module)