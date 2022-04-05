import { Schema, model, Types } from 'mongoose';
export interface Card {
    name: string;
    listId: Types.ObjectId;
    boardId: Types.ObjectId;
    order: string;
}
const cardSchema = new Schema<Card>({
    name: {
        type: String,
        required: true
    },
    listId: {
        type: Schema.Types.ObjectId,
        ref: 'list',
        required: true
    },
    boardId: {
        type: Schema.Types.ObjectId,
        ref: 'board',
        required: true
    },
    order: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    })

export default model('card', cardSchema)