import { Request, Response, NextFunction, Router } from 'express';
import { TypeRequestBody } from '../interface/type';
import UseGuard from '../middleware';
import ModelBoard, { Board } from '../models/board';
import ModelCard, { Card } from '../models/card';
import { User } from '../models/user';
const cardRouter = Router();


// // fetch all the card entries from db /api/cards
cardRouter.get('/', async (req, res, next) => {
    try {
        const cardEntries = await ModelCard.find()
        res.json(cardEntries)
    } catch (error) {
        next(error)
    }
})

// create new card entry
cardRouter.post('/', UseGuard.auth, async (req: TypeRequestBody<Card>, res, next: NextFunction) => {
    const card = req.body;
    const user: User = req.user;
    console.log(req.body, card);
    try {
        const checkBoard = await ModelBoard.findOne({ _id: card.boardId, userId: user.id })
        if (!checkBoard)
            return res.status(404).send()
        const nawCard = new ModelCard(req.body)
        const respData = await nawCard.save()
        res.send(respData)
    } catch (error: any) {
        if (error.name === 'ValidationError')
            res.status(422)
        next(error)
    }
});

// get cards based on cardId
cardRouter.get('/:id', async (req, res, next) => {
    const _id = req.params.id
    try {
        const cards = await ModelCard.findById(_id)
        if (!cards)
            return res.status(404).send({ error: 'Card not found!' })
        res.send(cards)
    } catch (error) {
        next(error)
    }
});


// update card content based on id
cardRouter.patch('/:id', async (req, res, next) => {
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'listId', 'order']
    const isValidOperation = updates.every(
        (update) => allowedUpdates.includes(update))
    if (!isValidOperation)
        return res.status(400).send({ error: 'Invalid updates!' })
    try {
        const card = await ModelCard.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })
        if (!card)
            return res.status(404).send({ error: 'Card not found!' })
        res.send(card)
    } catch (error) {
        next(error)
    }
});


// delete card based on id
cardRouter.delete('/:id', async (req, res, next) => {
    const _id = req.params.id
    try {
        const card = await ModelCard.findByIdAndDelete(_id)
        if (!card)
            return res.status(404).send()
        res.send(card)
    } catch (error) {
        next(error)
    }
})



export default cardRouter;