import { Request, Response, NextFunction } from 'express';
import { Query, Send } from 'express-serve-static-core';

export interface TypeRequestBody<T> extends Request {
    body: T
}

export interface TypeRequest<T, U extends Query> extends Request {
    body: T
    query: U
}