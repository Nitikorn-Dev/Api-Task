import { Request, Response, NextFunction } from 'express';
import { CustomError } from './custom-error.model';
import { logger } from './error-handler';
// import { CustomError } 

export function handleError(
    err: TypeError | CustomError,
    req: Request,
    res: Response,
    next: NextFunction
) {
    let customError = err;

    // logger.error(err.stack + "❌")
    if (!(err instanceof CustomError)) {
        console.log("Error")
        return res.status(500).json(customError.message)
    } else {
        console.log("CustomError")
        return res.status((customError as CustomError).status).send(customError)
    }
    // next(err)
}

export function logError(
    err: TypeError | CustomError,
    req: Request,
    res: Response,
    next: NextFunction
) {
    logger.error(err.stack)
    next(err);
}