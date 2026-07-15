import { Document, Types } from "mongoose";

export interface ISolution extends Document {
    problemId: Types.ObjectId;
    userId: string;
    userName?: string;
    title: string;
    content: string;
    language: string;
    upvotes: number;
    createdAt: Date;
    updatedAt: Date;
}
