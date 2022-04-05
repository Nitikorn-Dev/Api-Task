import { Request, Response, NextFunction, Router } from 'express';
import ModelBoard, { Board } from '../models/board';
import ModelList from '../models/list';
import auth from '../middleware';
import { User } from '../models/user';
import { TypeRequestBody } from '../interface/type';
import { check, validationResult } from 'express-validator';

const boardRouter = Router();

// fetch all the boards for a user
boardRouter.get('/', auth, async (req: TypeRequestBody<{ user: User }>, res, next) => {
    const { user } = req.body;
    try {
        const boardsList = await ModelBoard.find({ userId: user.id })
        res.json(boardsList)
    } catch (error) {
        console.log(error)
        next(error)
    }
});

// create new board for a user
boardRouter.post('/', auth, [
    check("name", "please enter name").isLength({ min: 1 })
], async (req: TypeRequestBody<{ user: User, board: Board }>, res: Response, next: NextFunction) => {
    const { user, ...board } = req.body;
    console.log(user, board)
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const newBoard = new ModelBoard({ ...board, userId: user.id })
        const respData = await newBoard.save()
        res.send(respData)
    } catch (error: any) {
        if (error.name === 'ValidationError')
            res.status(422)
        next(error)
    }
});

// get lists based on boardId
boardRouter.get('/:id/lists', auth,
    async (req: TypeRequestBody<{ user: User }>, res, next) => {
        const { user } = req.body;
        const _id = req.params._id
        console.log(user, _id);
        try {
            const board = await ModelBoard.findOne({ _id, userId: user.id })
            if (!board)
                return res.status(404).send()
            const lists = await ModelList.find({ boardId: _id })
            res.send(lists)
        } catch (error) {
            next(error)
        }
    })

export default boardRouter;