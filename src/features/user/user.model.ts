import { Schema, model } from 'mongoose';
import { User } from './user.interface';


const userSchema = new Schema<User>({
    username: {
        type: String,
        minlength: 4,
        maxlength: 20,
        required: true
    },
    email: {
        type: String,
        minlength: 5,
        maxlength: 40,
        unique: true
    },
    password: {
        type: String,
        // minlength: 4,
        select: false,
        required: true
    }
});


export default model<User>('User', userSchema);