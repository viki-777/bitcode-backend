import { CreateCommentDTO } from "../dto/comment.dto";
import { CommentRepository } from "../repositories/comment.repository";
import { Types } from "mongoose";

const commentRepository = new CommentRepository();

export async function createCommentService(commentDto: CreateCommentDTO) {
    // Cast to any or adapt to Partial<IComment>
    const data = {
        ...commentDto,
        problemId: new Types.ObjectId(commentDto.problemId),
        parentId: commentDto.parentId ? new Types.ObjectId(commentDto.parentId) : undefined
    } as any;
    const comment = await commentRepository.create(data);
    return comment;
}

export async function getCommentsByProblemIdService(problemId: string) {
    const comments = await commentRepository.findByProblemId(problemId);
    
    // Optionally format them into nested replies if we want to return a tree structure
    // For simplicity, returning the flat list
    return comments;
}
