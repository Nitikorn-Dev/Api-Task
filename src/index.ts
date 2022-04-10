import express, { Application } from 'express'
import router from './features';
import { connect } from 'mongoose';
import dotenv from "dotenv"
import { handleError, logError } from './utils/custom-error/error-handler.middleware';
import { NotFoundException } from './utils/custom-error/custom-error.model';

const compression = require('compression');
const cors = require('cors')

import routerApi1 from './features/api1/routers';

dotenv.config()

const dbUrl = process.env.DATABASE;
const PORT = process.env.PORT || 4000;


const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(cors({ origin: 'http://localhost:3001' }))

connect(dbUrl!)
    .then(() => {
        console.log('connect MongoDB success ✅')
    }).catch(() => {
        console.log('cannot connect MongoDB')
    })


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


app.use("/api", router)

app.use("/api1", routerApi1)



app.use("*", (req, res, next) => next(new NotFoundException()))
app.use(logError, handleError)
app.listen(PORT, () => console.log(`Server Port ${PORT} runing...✨`));