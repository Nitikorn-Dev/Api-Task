import { Router } from 'express';
import taskRouter from './task/task.controller';
import userRouter from './user/user.controller';
import JwtAuthGuard from './auth/guards/guard'
const router = Router();

router.use('/tasks', JwtAuthGuard, taskRouter)
router.use('/users', userRouter)

export default router;