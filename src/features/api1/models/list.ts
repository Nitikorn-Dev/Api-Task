import { Schema, model, Types } from 'mongoose';
export interface List {
    name: string;
    boardId: Types.ObjectId;
    order: string;
}
const listSchema = new Schema<List>({
    name: {
        type: String,
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

export default model('list', listSchema)