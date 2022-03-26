import { sign, SignOptions, verify } from 'jsonwebtoken';
import bcrypt = require("bcrypt");
import { User } from '../user/user.interface';


const singInOptions: SignOptions = {
    algorithm: 'HS256',
    // expiresIn: '1h'
}

namespace AuthService {

    export const generateJWT = async ({ email }: User, secret: string, expiresIn: string = '2m') => {
        return sign({ email }, secret, { ...singInOptions, expiresIn });
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