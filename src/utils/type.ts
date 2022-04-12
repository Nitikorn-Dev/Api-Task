import { Request, Response, NextFunction } from 'express';
import { Query, Send } from 'express-serve-static-core';

export interface TypeRequestBody<T> extends Request, Auth {
    body: T
}

export interface Auth {
    user?: any
}
export interface TypeRequest<T extends Query, U> extends Request, Auth {
    query: T
    body: U
}

export interface CustomRequest<B, Q extends Query> extends Request, Auth {
    query: Q;
    body: B;
}

export interface TypeResponse<T> extends Response {
    json: Send<T, this>
}