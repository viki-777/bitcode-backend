import mongoose, { Schema } from "mongoose";
import { IComment } from "../types/comment.types";

const commentSchema = new Schema({
    problemId: {
        type: Schema.Types.ObjectId,
        ref: 'Problem',
        required: true,
        index: true
    },
    userId: {
        type: String, // Assuming userId is passed from auth middleware as a string or ObjectId depending on system setup
        required: true,
        index: true
    },
    userName: {
        type: String,
        required: false
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
        trim: true
    },
    parentId: {
        type: Schema.Types.ObjectId,
        ref: 'Comment', // Self-reference for replies
        default: null,
        index: true
    },
    upvotes: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    versionKey: false
});

const Comment = mongoose.model<IComment>('Comment', commentSchema);
export default Comment;
