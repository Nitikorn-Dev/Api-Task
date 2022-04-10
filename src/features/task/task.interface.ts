
import { Types, Document } from 'mongoose';

export enum TaskStatus {
    TODO = "TODO",
    IN_PROGRESS = "IN PROGRESS",
    COMPLETE = "COMPLETE"
}

export interface Task {
    title?: string;
    description?: string;
    lists: [Types.ObjectId];
    comments?: Types.ObjectId;
    createdBy?: Types.ObjectId;

}