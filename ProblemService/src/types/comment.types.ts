import { Document, Types } from "mongoose";

export interface IComment extends Document {
    problemId: Types.ObjectId;
    userId: string;
    userName?: string;
    content: string;
    parentId?: Types.ObjectId;
    upvotes: number;
    createdAt: Date;
    updatedAt: Date;
}
