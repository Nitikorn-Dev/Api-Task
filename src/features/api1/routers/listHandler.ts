import { AnyNaptrRecord } from 'dns';
import { Request, Response, NextFunction, Router } from 'express';
import { TypeRequestBody } from '../interface/type';
import UseGuard from '../middleware';

import ModelList, { List } from '../models/list';
import ModelCard, { Card } from '../models/card';
import ModelBoard, { Board } from '../models/board';
import { User } from '../models/user';


const ListRouter = Router();


// create new entry of list
ListRouter.post('/', UseGuard.auth, async (req: TypeRequestBody<List>, res: Response, next: NextFunction) => {
    const user = req.user;
    console.log(req.body)
    console.log(user.id, req.body.boardId)
    try {
        const board = await ModelBoard.findOne({ _id: req.body.boardId, userId: user.id })
        console.log(board)
        if (!board)
            return res.status(404).send()
        const newList = new ModelList(req.body)
        const respData = await newList.save()
        res.send(respData)
    } catch (error: any) {
        if (error.name === 'ValidationError')
            res.status(422)
        next(error)
    }
});


// get list based on listId
ListRouter.get('/:id', async (req, res, next) => {
    const _id = req.params.id
    try {
        const lists = await ModelList.findById(_id)
        if (!lists)
            return res.status(404).send()
        res.send(lists)
    } catch (error) {
        next(error)
    }
});


// fetch cards based on list-id
ListRouter.get('/:id/cards', async (req, res, next) => {
    const _id = req.params.id
    try {
        const lists = await ModelList.findById(_id)
        if (!lists)
            return res.status(404).send()
        const cards = await ModelCard.find({ listID: _id })
        res.send(cards)
    } catch (error) {
        next(error)
    }
});

// update list content based on id
ListRouter.patch('/:id', async (req, res, next) => {
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'order']
    const isValidOperation = updates.every(
        (update) => allowedUpdates.includes(update))
    if (!isValidOperation)
        return res.status(400).send({ error: 'Invalid updates!' })
    try {
        const list = await ModelList.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })
        if (!list)
            return res.status(404).send({ error: 'List not found!' })
        res.send(list)
    } catch (error) {
        next(error)
    }
})

// delete list based on id
ListRouter.delete('/:id', async (req, res, next) => {
    const _id = req.params.id
    try {
        const list = await ModelList.findByIdAndDelete(_id)
        if (!list)
            return res.status(404).send()
        // find all cards within list and delete them as well
        const cards = await ModelCard.find({ listid: _id })
        cards.forEach(async (card) => (
            await ModelCard.deleteOne({ _id: card._id })))
        res.send(list)
    } catch (error) {
        next(error)
    }
})

export default ListRouter;