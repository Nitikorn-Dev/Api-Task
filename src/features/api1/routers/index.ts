import { Router } from 'express';
import boardRouter from './boardHandler';
import ListRouter from './listHandler';
import userRouter from './userHandler';
import cardRouter from './cardHandler';

const routerApi1 = Router();

routerApi1.use('/user', userRouter);
routerApi1.use('/boards', boardRouter);
routerApi1.use('/lists', ListRouter);
routerApi1.use('/cards', cardRouter);
export default routerApi1;