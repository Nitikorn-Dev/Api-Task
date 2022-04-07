import { Request, Response, NextFunction, Router } from 'express';
import { TypeRequestBody } from '../interface/type';
import auth from '../middleware';
import ModelList from '../models/list';
import { User } from '../models/user';


const ListRouter = Router();


// create new entry of list
// ListRouter.post('/', auth, async (req: TypeRequestBody<{ user: User, board: Board }>, res: Response, next: NextFunction) => {
//     try {
//         const boardId = req.body.boardId
//         const board = await ModelList.findOne({ _id: boardId, userId: req.user })
//         if (!board)
//             return res.status(404).send()
//         const list = new ModelList(req.body)
//         const respData = await list.save()
//         res.send(respData)
//     } catch (error:any) {
//         if (error.name === 'ValidationError')
//             res.status(422)
//         next(error)
//     }
// });


export default ListRouter;