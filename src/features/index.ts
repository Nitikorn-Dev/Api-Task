import { Router } from 'express';
import taskRouter from './task/task.controller';
import userRouter from './user/user.controller';
const router = Router();

router.use('/api/tasks', taskRouter)
router.use('/api/users', userRouter)

export default router;