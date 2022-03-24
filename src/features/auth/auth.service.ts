import { sign, SignOptions } from 'jsonwebtoken';
import bcrypt = require("bcrypt");
import { User } from '../user/user.interface';
import dotenv from "dotenv";
dotenv.config();

const singInOptions: SignOptions = {
    algorithm: 'HS256',
    expiresIn: '1h'
}

namespace AuthService {
    export const generateJWT = async ({ email, username }: User) => sign({ email, username }, process.env.ACCESS_TOKEN_SECRET!, singInOptions);

    export const hashPassword = async (password: string): Promise<string> => bcrypt.hashSync(password, bcrypt.genSaltSync(12, "a"))


    export const comparePassword = async (newPassword: string, passwordHash: string) => {
        return bcrypt.compareSync(newPassword, passwordHash)
    }

}

export default AuthService;