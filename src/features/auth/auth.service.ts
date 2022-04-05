import { sign, SignOptions, verify } from 'jsonwebtoken';
import bcrypt = require("bcrypt");
import { User } from '../user/user.interface';


const singInOptions: SignOptions = {
    algorithm: 'HS256',
    // expiresIn: '1h'
}

type Optional<T> = {
    [P in keyof T]?: T[P]
}
namespace AuthService {

    export const generateJWT = async ({ email, username, _id }: Optional<User & { _id: any }>, secret: string, expiresIn: string = '2m') => {
        console.log(_id)
        return sign({ email, username, _id }, secret, { ...singInOptions, expiresIn });
    }

    export const validateJWT = async (token: string, secret: string) => {
        return verify(token, secret)
    }


    export const hasAccessToEndpoint = async (allowedAccessTypes: string[], user: any[]) => {
        return allowedAccessTypes.some((at) => user.some((uat) => uat === at))
    }

    export const hashPassword = async (password: string): Promise<string> => {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(12, "a"))
    }


    export const comparePassword = async (newPassword: string, passwordHash: string) => {
        return bcrypt.compareSync(newPassword, passwordHash)
    }

}

export default AuthService;