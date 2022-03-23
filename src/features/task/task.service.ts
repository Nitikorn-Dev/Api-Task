
import { connect, Schema, model, Document, HydratedDocument, Types } from 'mongoose';
import TaskModel from './task.model';
import { Task, TaskStatus } from './task.interface';

import dotenv from "dotenv"
const dbUrl = process.env.DATABASE;

const config = {
    autoIndex: true,
    useNewUrlParser: true,
}

const connectMogoDB = async () => {
    if (dbUrl) {
        try {
            await connect(dbUrl, config)
            console.log('connenct MongoDB')
        } catch (error) {
            console.log('Eror connect MongoDB', error)
        }
    }
}

namespace TaskService {
    export const findTask = async (query: Task) => {
        // connectMogoDB();
        try {
            return await TaskModel.findOne({ ...query });
        } catch (error) {
            console.log(error)
            throw new Error('Could not find Task')
        }
    }

    export const findTaskAll = async () => {
        // connectMogoDB();
        try {
            return await TaskModel.find();
        } catch (error) {
            throw new Error('Could not find TaskAll');
        }
    }
}


export default TaskService;
