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
        return res.status(500).json(customError.message)
    } else {
        return res.status((customError as CustomError).status).send(customError)
    }
}

export function logError(
    err: TypeError | CustomError,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.log(err)

    next(err);
}