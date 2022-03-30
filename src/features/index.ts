import { Router } from 'express';
import taskRouter from './task/task.controller';
import userRouter from './user/user.controller';
import JwtAuthGuard from './auth/guards/guard'
const router = Router();

router.use('/tasks', JwtAuthGuard, taskRouter)
router.use('/auth', userRouter)

export default router;