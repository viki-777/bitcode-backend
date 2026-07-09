import { Request, Response, NextFunction } from 'express';

export function adminMiddleware(req: Request, res: Response, next: NextFunction): any {
    const user = (req as any).user;
    if (!user) {
        return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    
    if (user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admin privileges required' });
    }

    next();
}
