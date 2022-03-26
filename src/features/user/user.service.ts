import { User } from './user.interface';
import UserModel from './user.model';
import AuthService from '../auth/auth.service';
import dotenv from "dotenv";
dotenv.config();

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET!;
namespace UserService {
    //Global
    let refreshTokens: string[] = [];


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
        let res = await UserModel.create({ ...user, password: passwordHash });
        const access_token = await AuthService.generateJWT(user, ACCESS_SECRET);
        return { access_token, message: "create user Success" };

    }

    export const findAll = async (): Promise<User[]> => {
        return await UserModel.find().select({ password: 1 }).exec();
    }

    export const findOne = async (id: number | string) => {
        return await UserModel.findOne({ id }).select('+email +password');
    }

    const findByEmail = async (email: string): Promise<User | null> => {
        return await UserModel.findOne({ email }).select('+password')
    }

    const validateUser = async (email: string, password: string): Promise<User> => {
        const user = await findByEmail(email)
        if (user === null) {
            throw new Error('Could not find Email')
        }

        const match = await AuthService.comparePassword(password, user.password);
        if (match) {
            return user;
        } {
            throw new Error('Invalid Password')
        }
    }



    export const login = async ({ email, password }: Pick<User, "email" | "password">) => {
        const user = await validateUser(email, password);
        const access_token = await AuthService.generateJWT(user, ACCESS_SECRET);
        const refreshToken = await AuthService.generateJWT(user, REFRESH_SECRET, '5m');
        refreshTokens.push(refreshToken);
        return { access_token, refreshToken }
    }

    export const createRefreshJWT = async (refreshToken: string) => {

        if (!refreshTokens.includes(refreshToken)) {
            throw new Error("Invalid refresh token");
        }

        try {
            const user = await AuthService.validateJWT(refreshToken, REFRESH_SECRET) as User;
            console.log("validateJWT", user)
            const accessToken = await AuthService.generateJWT(user, ACCESS_SECRET);
            return { accessToken };
        } catch (error) {
            throw new Error("Invalid token")
        }
    }

    export const removeRefreshToken = async (refreshToken: string) => {
        const index = refreshTokens.indexOf(refreshToken)
        refreshTokens.splice(index)
    }


}

export default UserService;