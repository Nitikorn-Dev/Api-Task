import { Schema, model, Types } from 'mongoose';

export interface Activity {
    text: string;
    boardId: Types.ObjectId;
}

const activitySchema = new Schema<Activity>({
    text: {
        type: String,
        required: true
    },
    boardId: {
        type: Schema.Types.ObjectId,
        ref: 'board',
        required: true
    },
},
    {

        timestamps: true
    })

export default model('activity', activitySchema)