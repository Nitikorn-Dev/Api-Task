import express, { Application, Request, Response } from 'express'
import router from './features';
const compression = require('compression');
import { connect, model, connections, createConnection } from 'mongoose';
import dotenv from "dotenv"

import TaskModel from './features/task/task.model';

dotenv.config()
const dbUrl = process.env.DATABASE;


const app: Application = express();
const PORT = process.env.PORT || 4000;

connect(dbUrl!)
    .then(() => {
        console.log('connect MongoDB success')
    }).catch(() => {
        console.log('cannot connect MongoDB')
    })


// TaskModel.findOne({ title: 'T2' }).then(res => console.log(res))

const config = {
    autoIndex: true,
    useNewUrlParser: true,
}

const run = async () => {
    if (dbUrl) {
        try {
            await connect(dbUrl, config)
            console.log('connenct MongoDB')
        } catch (error) {
            console.log('Eror connect MongoDB', error)
        }
    }
}



// run();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router)
app.use(compression());

app.get("/", async (req: Request, res: Response): Promise<Response> => {
    return res.send({ message: 'Hellow World' });
});
// OBqzX0ShmKjATNhn
app.listen(PORT, () => console.log(`Server Port ${PORT} runing...`));