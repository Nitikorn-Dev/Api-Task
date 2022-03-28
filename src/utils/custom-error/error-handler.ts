import winston from 'winston'
import dotenv from "dotenv"
dotenv.config();
const isDevEnvironment = () => process.env.NODE_ENV !== 'production';



export enum HttpStatusCode {
    OK = 200,
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
    INTERNAL_SERVER = 500,
}

export class BaseError extends Error {
    constructor(
        public readonly name: string,
        public readonly httpCode: HttpStatusCode,
        public readonly description: string,
        public readonly isOperational: boolean,
    ) {
        super(description);
        Object.setPrototypeOf(this.description, new.target.prototype);
        Error.captureStackTrace(this);
    }
}

export class APIError extends BaseError {
    constructor(
        name: string,
        httpCode = HttpStatusCode.INTERNAL_SERVER,
        description = 'internal server error',
        isOerational = true,
    ) {
        super(name, httpCode, description, isOerational)
    }
}
export class HTTP400Error extends BaseError {
    constructor(description = 'bad request') {
        super('NOT FOUND', HttpStatusCode.BAD_REQUEST, description, true);
    }
}



const customLevels = {
    levels: {
        trace: 5,
        debug: 4,
        info: 3,
        warn: 2,
        error: 1,
        fatal: 0,
    },
    colors: {
        trace: 'white',
        debug: 'green',
        info: 'green',
        warn: 'yellow',
        error: 'red',
        fatal: 'red',
    },
};

const formatter = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.splat(),
    winston.format.printf((info) => {
        const { timestamp, level, message, ...meta } = info;

        return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
            }`;
    }),
);

class Logger {
    private logger: winston.Logger;

    constructor() {
        const prodTransport = new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
        });
        const transport = new winston.transports.Console({
            format: formatter,
        });
        this.logger = winston.createLogger({
            level: isDevEnvironment() ? 'trace' : 'error',
            levels: customLevels.levels,
            transports: [isDevEnvironment() ? transport : prodTransport],
        });
        winston.addColors(customLevels.colors);
    }

    trace(msg: any, meta?: any) {
        this.logger.log('trace', msg, meta);
    }

    debug(msg: any, meta?: any) {
        this.logger.debug(msg, meta);
    }

    info(msg: any, meta?: any) {
        this.logger.info(msg, meta);
    }

    warn(msg: any, meta?: any) {
        this.logger.warn(msg, meta);
    }

    error(msg: any, meta?: any) {
        this.logger.error(msg, meta);
    }

    fatal(msg: any, meta?: any) {
        this.logger.log('fatal', msg, meta);
    }
}

export const logger = new Logger();

class ErrorHandler {
    public async handleError(err: Error): Promise<void> {
        await logger.error(
            'Error message from the centralized error-handling component',
            err,
        );
        //   await sendMailToAdminIfCritical();
        //   await sendEventsToSentry();
    }

    public isTrustedError(error: Error) {
        if (error instanceof BaseError) {
            return error.isOperational;
        }
        return false;
    }
}
export const errorHandler = new ErrorHandler();