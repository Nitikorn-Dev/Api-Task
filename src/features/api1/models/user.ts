import { Schema, model, Types } from 'mongoose';
export interface User {
    id?: any;
    username: string;
    password: string;
}

const userSchema = new Schema<User>({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5
    },
})

export default model<User>('user', userSchema)