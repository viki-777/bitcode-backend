import { NextFunction, Request, Response } from "express";
import {
    createCommentService,
    getCommentsByProblemIdService
} from "../services/comment.service";

export async function createCommentHandler(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const problemId = req.params.id;
    // Assume req.user exists from authMiddleware, or it's passed in body for now.
    // We'll extract userId from req.body or req.user.
    const userId = (req as any).user?.id || req.body.userId;

    const data = {
        ...req.body,
        problemId,
        userId
    };

    const response = await createCommentService(data);

    res.status(201).json({
        message: "Comment created successfully",
        data: response,
        success: true,
    });
}

export async function getCommentsHandler(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const problemId = req.params.id;
    const response = await getCommentsByProblemIdService(problemId);

    res.status(200).json({
        message: "Comments fetched successfully",
        data: response,
        success: true,
    });
}
