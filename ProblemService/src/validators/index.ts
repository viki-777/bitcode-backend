import { NextFunction, Request, RequestHandler, Response } from 'express';
import { AnyZodObject } from 'zod';
import logger from '../config/logger.config';

export const validateRequestBody = (schema: AnyZodObject): RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            logger.info('Validating request body...');
            await schema.parseAsync(req.body);
            logger.info('Request body is valid');
            next();
        } catch (error) {
            logger.error('Request body is invalid');
            return res.status(400).json({
                message: "Invalid request body",
                success: false,
                error: error
            });
        }
    }
}

export const validteQueryParams = (Schema: AnyZodObject) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await Schema.parseAsync(req.query);
            console.log('Query params are valid');
            next();
        } catch (error) {
            return res.status(400).json({
                message: "Invalid query params",
                success: false,
                error: error
            });
        }
    }
}