import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { serverConfig } from '../config';

export function authMiddleware(req: Request, res: Response, next: NextFunction): any {
    const authHeader = req.headers['authorization'] as string;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Authorization token missing' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, serverConfig.JWT_SECRET) as { userId: string };
        (req as any).userId = decoded.userId;
        next();
    } catch {
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
}
