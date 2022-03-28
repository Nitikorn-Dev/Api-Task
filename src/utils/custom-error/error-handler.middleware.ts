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

    logger.error(err + "❌")
    if (!(err instanceof CustomError)) {
        res.status(500).json(err['message'])
    } else {

        res.status((customError as CustomError).status).send(customError)
    }
}

export function logError(
    err: TypeError | CustomError,
    req: Request,
    res: Response,
    next: NextFunction
) {
    // logger.error("Error")
    // next(err);
}