import { Types } from 'mongoose';

export enum TaskStatus {
    TODO = "TODO",
    IN_PROGRESS = "IN PROGRESS",
    COMPLETE = "COMPLETE"
}

export interface Task {
    title?: string;
    description?: string;
    status?: TaskStatus;
    comments?: Types.ObjectId;
    createdBy?: Types.ObjectId;

}