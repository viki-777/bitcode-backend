import BaseRepository from "./base.repository";
import Comment from "../models/comment";
import { IComment } from "../types/comment.types";

export class CommentRepository extends BaseRepository<IComment> {
    constructor() {
        super(Comment);
    }

    async findByProblemId(problemId: string) {
        return await Comment.find({ problemId }).sort({ createdAt: -1 });
    }
}
