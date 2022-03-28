import express, { Application, NextFunction, Request, Response, Router } from 'express'
import router from './features';
const compression = require('compression');
import { connect, model, connections, createConnection } from 'mongoose';
import dotenv from "dotenv"

import TaskModel from './features/task/task.model';
import { handleError, logError } from './utils/custom-error/error-handler.middleware';
import { NotFoundException } from './utils/custom-error/custom-error.model';

dotenv.config()
const dbUrl = process.env.DATABASE;


const app: Application = express();
const PORT = process.env.PORT || 4000;

connect(dbUrl!)
    .then(() => {
        console.log('connect MongoDB success ✅')
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
            console.log('%cconnenct MongoDB', 'color:blue')
        } catch (error) {
            console.log('Eror connect MongoDB', error)
        }
    }
}

// run();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", router)
app.use(compression());

const router1 = Router();
app.use("/test", async (req, res, next) => {
    const err = new Error("nnn")
    const msg = err.message
    const name = err.name
    console.log(err.name)
    try {
        // throw "ff"
        throw new Error("new Error")
    } catch (error: any) {
        // console.log(error.message)
        // next(error.message)
        // next(new Error("skdfdjsk"))
        // console.log(error)
        next(error)
    }

    console.log('middlewar 1')
}
    // ,(req, res, next) => {
    //     console.log('middlewar 2')
    //     return res.send({ token: req.body.token })
    // }
)

app.use(router1);
// app.use("/admin", router1, (req, res) => res.sendStatus(401))

app.get("/hellow/:id", (req, res, next) => {
    console.log('Request URL:', req.originalUrl)
    //@ts-ignore
    // req.user = "J"
    throw new NotFoundException();
    if (req.params.id === "0") next("route")
    else next()
    // next()
    // return res.send({ use: "use" })
    console.log("midleWare 1")
}, (req, res, next) => {
    console.log('Request Type:', req.method)
    console.log("Hellow Info")
    // return res.send({ msg: "middlewar2" })
    // next();
    res.send('regular')
}, (req, res) => res.send({ middlewar: 3 }))
app.get("/hellow/:id", async (req: Request, res: Response): Promise<Response> => {
    //@ts-ignore
    return res.status(200).send({ message: 'Hellow World' });
});


app.use("*", (req, res, next) => next(new NotFoundException()))
app.use(handleError)
// app.use((
//     err: TypeError,
//     req: Request,
//     res: Response,
//     next: NextFunction) => {
//     console.log("handleError", err)
// })
app.listen(PORT, () => console.log(`Server Port ${PORT} runing...✨`));