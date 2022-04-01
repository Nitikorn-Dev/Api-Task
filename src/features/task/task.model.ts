
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
    status: {
        type: String,
        enum: TaskStatus,
        default: TaskStatus.TODO
    },
    comments: {
        type: [Schema.Types.ObjectId],
        ref: "Comment"
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

export default model<Task>('Task', taskSchema);



