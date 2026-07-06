import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction): any {
    console.error('Error:', err);

    if (err instanceof ZodError) {
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            error: err.issues,
        });
    }

    if (err.name === 'MongoServerError' && err.code === 11000) {
        return res.status(409).json({
            success: false,
            message: 'Duplicate key error',
            error: err.keyValue,
        });
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        message,
    });
}
