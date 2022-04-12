import TaskModel from './task.model';
import { Task, TaskStatus } from './task.interface';

import dotenv from "dotenv"
import { CustomError } from '../../utils/custom-error/custom-error.model';
import { User } from '../user/user.interface';
const dbUrl = process.env.DATABASE;



namespace TaskService {


    export const createTask = async (task: Task) => {

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
