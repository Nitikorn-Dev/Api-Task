import { Router } from "express";
import { TaskStatus } from "./task.interface";
import TaskService from './task.service';
const taskRouter = Router();

taskRouter.get('/', async (req, res) => {
    return res.send(await TaskService.findTaskAll().then(res => res));
})

export default taskRouter;