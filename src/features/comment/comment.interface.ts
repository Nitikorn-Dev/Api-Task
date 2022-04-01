import { Types } from 'mongoose';


export interface Comment {
    text: string;
    createBy: Types.ObjectId
}