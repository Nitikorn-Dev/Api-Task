
import { Schema, model, Document, HydratedDocument, Types } from 'mongoose';
import { Task, TaskStatus } from './task.interface';

const taskSchema = new Schema<Task>({
    title: {
        type: String,
        minlength: 1,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    comments: {
        type: [Schema.Types.ObjectId],
        ref: "Comment"
    },
    lists: [
        {
            type: Schema.Types.ObjectId,
            ref: "list",
            required: true
        }
    ],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
},
    { timestamps: true }
);

export default model<Task>('Task', taskSchema);



