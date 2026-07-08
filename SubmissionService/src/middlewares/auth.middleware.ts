import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


// Reusing the same JWT secret across services.
// Ideally, use an asymmetric key (RS256) where UserService signs and others verify.
// For now, we share the secret via env vars.

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-me';

export function authMiddleware(req: Request, res: Response, next: NextFunction): any {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Authorization token missing' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        (req as any).userId = decoded.userId;
        next();
    } catch {
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
}
