import { Request, Response, NextFunction, Router } from "express";
import { resolveModuleNameFromCache } from "typescript";
import JwtAuthGuard from "../auth/guards/guard";
import { TaskStatus } from "./task.interface";
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


taskRouter.get('/', cache(10), async (req, res) => {
    setTimeout(async () => {
        return res.send(await TaskService.findTaskAll().then(res => res));
    }, 5000)

})

export default taskRouter;