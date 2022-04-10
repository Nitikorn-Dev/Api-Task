import { Schema, model, Types } from 'mongoose';
export interface Lists {
    name: string;
    taskId: Types.ObjectId;
    order: string;
}
const listSchema = new Schema<Lists>({
    name: {
        type: String,
        required: true
    },
    taskId: {
        type: Schema.Types.ObjectId,
        ref: 'Task',
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

export default model('Lists', listSchema)