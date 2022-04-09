import { Request, Response, NextFunction, Router } from 'express';
import ModelBoard, { Board } from '../models/board';
import ModelCard from '../models/card';
import ModelList from '../models/list';
import ModelActivity from '../models/activity';
import UseGuard from '../middleware';
import { User } from '../models/user';
import { TypeRequest, TypeRequestBody } from '../interface/type';
import { check, validationResult } from 'express-validator';

const boardRouter = Router();

// fetch all the boards for a user
boardRouter.get('/', UseGuard.auth, async (req: TypeRequestBody<{ user: User }>, res, next) => {
    const { user } = req;
    try {
        const boardsList = await ModelBoard.find({ userId: user.id })
        res.json(boardsList)
    } catch (error) {
        console.log(error)
        next(error)
    }
});

// create new board for a user
boardRouter.post('/', UseGuard.auth, [
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
boardRouter.get('/:id/lists', UseGuard.auth,
    async (req: TypeRequestBody<{ user: User }>, res, next) => {
        const { user } = req.body;
        const _id = req.params.id;
        console.log(user, req.params.id);
        try {
            const board = await ModelBoard.findOne({ _id, userId: user.id })
            console.log(board)
            if (!board)
                return res.status(404).send()
            const lists = await ModelList.find({ boardId: _id })
            res.send(lists)
        } catch (error) {
            next(error)
        }
    });

// get cards based on boardId
boardRouter.get('/:id/cards', UseGuard.auth, async (req: TypeRequestBody<{ user: User }>, res, next) => {
    const { user } = req.body;
    const _id = req.params.id;
    try {
        const board = await ModelBoard.findOne({ _id, userId: user.id })
        if (!board)
            return res.status(404).send()
        const cards = await ModelCard.find({ boardId: _id })
        res.send(cards)
    } catch (error) {
        next(error)
    }
});

// get activities based on boardId
boardRouter.get('/:id/activities', UseGuard.auth,
    async (req: TypeRequest<{ limit: string, last: string }, any>, res, next) => {
        const user: User = req.user;

        const _id = req.params.id;
        const _last = req.query.last;
        const _limit = Number.parseInt(req.query.limit, 10) || 10
        try {
            const board = await ModelBoard.findOne({ _id, userId: user.id })
            if (!board)
                return res.status(404).send()
            const query: { boardId: any, _id?: any } = { boardId: _id }
            if (_last)
                query._id = { '$lt': _last }
            const activities = await ModelActivity.find(query, null, { limit: _limit + 1, sort: { _id: 'desc' } })
            res.append('X-Has-More', activities.length === _limit + 1 ? 'true' : 'false')
            res.send(activities.slice(0, _limit))
        } catch (error) {
            next(error)
        }
    });

// delete board based on id
boardRouter.delete('/:id', UseGuard.auth, async (req: TypeRequestBody<any>, res, next) => {
    const user: User = req.user;
    const _id = req.params.id
    try {
        const board = await ModelBoard.findOneAndDelete({ _id, userId: user.id })
        if (!board)
            return res.status(404).send()
        // find all lists within board and delete them as well
        const lists = await ModelList.find({ boardId: _id })
        lists.forEach(async (list) => {
            // find all cards within each lists and delete them as well
            const cards = await ModelCard.find({ listid: list._id })
            cards.forEach(async (card) => (
                await ModelCard.deleteOne({ _id: card._id })))
            await ModelList.deleteOne({ _id: list._id })
        })
        // find all activities within board and delete them as well
        const activities = await ModelActivity.find({ boardId: _id })
        activities.forEach(async (activity) => {
            await ModelActivity.deleteOne({ _id: activity._id })
        })
        res.send(board)
    } catch (error) {
        next(error)
    }
})

export default boardRouter;