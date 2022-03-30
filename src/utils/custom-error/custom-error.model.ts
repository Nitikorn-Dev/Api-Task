
export class CustomError extends Error { 
    constructor(
        protected msg: string | Object | any,
        public status: number = 500,
        public description?: any
    ) { 
        super();
        // Object.setPrototypeOf(this, new.target.prototype);
        // Error.captureStackTrace(this);
    }
}

export class BadRequestException extends CustomError {
    constructor(
        protected msg: string | Object = BadRequestException.name,
        public description: any = {}
    ) {
        super(msg, 400, description)
    }
}

export class UnauthorizedException extends CustomError {
    constructor(
        protected msg: string | Object = UnauthorizedException.name,
        public description: any = {}
    ) {
        super(msg, 401, description)
    }
}

export class ForbiddenException extends CustomError {
    constructor(
        protected msg: string | Object | any = ForbiddenException.name,
        public description: any = {}
    ) {
        super(msg, 403, description)
    }
}

export class NotFoundException extends CustomError {
    constructor(
        protected msg: string | Object | any = NotFoundException.name,
        public description: any = {}
    ) {
        super(msg, 404, description)
    }
}
export class InternalServerErrorException extends CustomError {
    constructor(
        protected msg: string | Object | any = NotFoundException.name,
        public description: any = {}
    ) {
        super(msg, 500, description)
    }
}


// export enum HttpStatusCode {
//     OK = 200,
//     BAD_REQUEST = 400,
//     NOT_FOUND = 404,
//     INTERNAL_SERVER = 500,
// }

// export class BaseError extends Error {
//     constructor(
//         public readonly name: string,
//         public readonly httpCode: HttpStatusCode,
//         public readonly description: string,
//         public readonly isOperational: boolean,
//     ) {
//         super(description);
//         Object.setPrototypeOf(this.description, new.target.prototype);
//         Error.captureStackTrace(this);
//     }
// }

// class APIError extends BaseError {
//     constructor(
//         name: string,
//         httpCode = HttpStatusCode.INTERNAL_SERVER,
//         description = 'internal server error',
//         isOerational = true,
//     ) {
//         super(name, httpCode, description, isOerational)
//     }
// }
// class HTTP400Error extends BaseError {
//     constructor(description = 'bad request') {
//         super('NOT FOUND', HttpStatusCode.BAD_REQUEST, description, true);
//     }
// }



// class ErrorHandler {
//     public async handleError(err: Error): Promise<void> {
//       await logger.error(
//         'Error message from the centralized error-handling component',
//         err,
//       );
//     //   await sendMailToAdminIfCritical();
//     //   await sendEventsToSentry();
//     }
    
//     public isTrustedError(error: Error) {
//       if (error instanceof BaseError) {
//         return error.isOperational;
//       }
//       return false;
//     }
//    }
//    export const errorHandler = new ErrorHandler();