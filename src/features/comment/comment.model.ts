import { Schema, model } from 'mongoose';
import { Comment } from './comment.interface';



const commentSchema = new Schema<Comment>({
    text: {
        type: String,
        minlength: 1,
        required: true
    },
    createBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
},
    { timestamps: true }
);

export default model("Comment", commentSchema)