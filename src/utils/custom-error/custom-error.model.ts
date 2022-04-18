
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