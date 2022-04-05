import { Request, Response, NextFunction, Router } from "express";
import { check, validationResult } from "express-validator";
import { resolveModuleNameFromCache } from "typescript";
import { CustomError } from "../../utils/custom-error/custom-error.model";
import JwtAuthGuard from "../auth/guards/guard";
import { User } from "../user/user.interface";
import { Task, TaskStatus } from "./task.interface";
import TaskService from './task.service';
const taskRouter = Router();
var mcache = require('memory-cache');

let cache = (duration: number) => {
    return (req: Request, res: Response & any, next: NextFunction) => {
        let key = `_express_${req.originalUrl || req.url}`;
        let cachedBody = mcache.get(key);
        if (cachedBody) {
            res.send(cachedBody)
            return;
        } else {
            res.sendResponse = res.send;
            res.send = (body: any) => {
                mcache.put(key, body, duration * 1000);
                res.sendResponse(body)
            }
            next();
        }
    }
}


interface TypeRequestBody<T> extends Request {
    body: T
}

//POST
taskRouter.post('/create', [
    check("title", "Title is required to create a Task").isLength({ min: 1 })
], async (req: Request, res: Response, next: NextFunction) => {
    const { task, user } = req.body
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return next(new CustomError(error.array()[0], 400))
    }

    try {
        const response = await TaskService.createTask(user.id, task);
        return res.status(200).send({ task: response, msg: 'create Task Success' })
    } catch (error: any) {
        next(error)
    }
})

//PUT

taskRouter.put('/:id'
    // ,[check("description","Description is required"),
    // check("status","Status is required")]
    , async (req, res, next) => {

    })


//GET
taskRouter.get('/', cache(10), async (req, res, next) => {
    console.log("get All", req.body.user)
    try {
        return res.status(200).send(await TaskService.findTaskAll());
    } catch (error) {
        return next(new CustomError('Could not find TaskAll'))
    }
    // setTimeout(async () => {
    // }, 5000)

})

taskRouter.get("/:id", async (req, res, next) => {
    const id = req.params.id
    let task: Task = {}
    try {
        return res.send(await TaskService.findTask(task))
    } catch (error) {
        return next(error)
    }
})


export default taskRouter;