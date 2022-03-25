
import { connect, Schema, model, Document, HydratedDocument, Types } from 'mongoose';
import dotenv from "dotenv"
import { Task, TaskStatus } from './task.interface';


const dbUrl = process.env.DATABASE;
dotenv.config()

const run = async () => {
    if (dbUrl) {
        try {
            await connect(dbUrl)
            console.log('connenct MongoDB')
        } catch (error) {
            console.log('Eror connect MongoDB', error)
        }
    }
}



run();

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
    // comments: {
    //     type: [Schema.Types.ObjectId],
    //     ref: "Comment"
    // },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});


const TaskModel = model<Task>('Task', taskSchema);

export default TaskModel;


// const doc = new TaskModel({})



