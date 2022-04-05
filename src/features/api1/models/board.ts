import { Schema, model, Types } from 'mongoose';
export interface Board {
    name: string;
    userId: Types.ObjectId;
    image: { color: string, thumb: string, full: string };
}

const boardSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    image: {
        color: {
            type: String,
        },
        thumb: {
            type: String,
        },
        full: {
            type: String,
        }
    }
},
    {
        timestamps: true
    })

export default model<Board>('board', boardSchema);