import { NextFunction, Request, Response } from "express";
import {
    createSolutionService,
    getSolutionsByProblemIdService
} from "../services/solution.service";

export async function createSolutionHandler(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const problemId = req.params.id;
    const userId = (req as any).user?.id || req.body.userId;

    const data = {
        ...req.body,
        problemId,
        userId
    };

    const response = await createSolutionService(data);

    res.status(201).json({
        message: "Solution created successfully",
        data: response,
        success: true,
    });
}

export async function getSolutionsHandler(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const problemId = req.params.id;
    const response = await getSolutionsByProblemIdService(problemId);

    res.status(200).json({
        message: "Solutions fetched successfully",
        data: response,
        success: true,
    });
}
