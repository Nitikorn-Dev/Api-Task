import { Router } from 'express';
import boardRouter from './boardHandler';
import userRouter from './userHandler';

const routerApi1 = Router();

routerApi1.use('/user', userRouter);
routerApi1.use('/boards', boardRouter)
export default routerApi1;