import mongoose, { Schema } from "mongoose";
import { ISolution } from "../types/solution.types";

const solutionSchema = new Schema({
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
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [150, 'Title cannot be more than 150 characters']
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
        trim: true
    },
    language: {
        type: String,
        required: [true, 'Programming language is required']
    },
    upvotes: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    versionKey: false
});

const Solution = mongoose.model<ISolution>('Solution', solutionSchema);
export default Solution;
