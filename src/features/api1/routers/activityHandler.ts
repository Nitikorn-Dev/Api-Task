import { Request, Response, NextFunction, Router } from 'express';
import ModelBoard, { Board } from '../models/board';
import ModelActivity from '../models/activity';
import UseGuard from '../middleware';
import { User } from '../models/user';
import { TypeRequestBody } from '../interface/type';
const activityRouter = Router();

// // get all activities
// router.get('/', async (req, res, next) => {
//     try {
//         const activities = await Activity.find()
//         res.json(activities)
//     } catch (error) {
//         next(error)
//     }
// })

// create new activity
activityRouter.post('/', UseGuard.auth, async (req: TypeRequestBody<any>, res: Response, next: NextFunction) => {
    const user: User = req.user;
    try {
        const boardId = req.body.boardId
        const board = await ModelBoard.findOne({ _id: boardId, userId: user.id })
        if (!board)
            return res.status(404).send()
        const activity = new ModelActivity(req.body)
        const respData = await activity.save()
        res.send(respData)
    } catch (error: any) {
        if (error.name === 'ValidationError')
            res.status(422)
        next(error)
    }
})

// delete activity based on id
activityRouter.delete('/:id', async (req, res: Response, next: NextFunction) => {
    const _id = req.params.id
    try {
        const activity = await ModelActivity.findByIdAndDelete(_id)
        if (!activity)
            return res.status(404).send()
        res.send(activity)
    } catch (error: any) {
        next(error)
    }
});

export default activityRouter;