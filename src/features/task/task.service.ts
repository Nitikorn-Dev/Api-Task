
import { connect, Schema, model, Document, HydratedDocument, Types } from 'mongoose';
import TaskModel from './task.model';
import { Task, TaskStatus } from './task.interface';

import dotenv from "dotenv"
import { CustomError } from '../../utils/custom-error/custom-error.model';
import { User } from '../user/user.interface';
const dbUrl = process.env.DATABASE;



namespace TaskService {


    export const createTask = async (user: User & { _id: any }, task: Task) => {

        const title = await findTask({ createdBy: user._id })
        if (title) {
            throw new CustomError("Title already in use")
        }

        try {
            return await TaskModel.create(task);
        } catch (error) {
            throw new CustomError("Not able to save task", 400)
        }
    }

    // export const updateTask = (task: Task) => {
    //     return await TaskModel.updateOne({ _id: task.id })
    // }



    export const findTask = async (task: Task): Promise<Task | null> => {
        return await TaskModel.findOne({ ...task });
    }

    export const findTaskAll = async () => {
        return await TaskModel.find();
    }
}


export default TaskService;
