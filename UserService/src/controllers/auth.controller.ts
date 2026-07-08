import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { serverConfig } from '../config';
import { registerSchema, loginSchema } from '../validators/auth.validator';

function generateTokens(userId: string, role: string) {
    const accessToken = jwt.sign(
        { userId, role },
        serverConfig.JWT_SECRET,
        { expiresIn: serverConfig.JWT_EXPIRES_IN as any }
    );
    const refreshToken = jwt.sign(
        { userId, role },
        serverConfig.JWT_SECRET,
        { expiresIn: serverConfig.JWT_REFRESH_EXPIRES_IN as any }
    );
    return { accessToken, refreshToken };
}

export async function register(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
        const parsed = registerSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ success: false, message: 'Invalid request body', error: parsed.error.issues });
        }

        const { name, email, password } = parsed.data;

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(409).json({ success: false, message: 'Email already registered' });
        }

        const passwordHash = await bcrypt.hash(password, 12);
        const user = await User.create({ name, email, passwordHash });

        const { accessToken, refreshToken } = generateTokens(String(user._id), user.role);

        return res.status(201).json({
            success: true,
            message: 'Registration successful',
            data: { accessToken, refreshToken, user },
        });
    } catch (error) {
        next(error);
    }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
        const parsed = loginSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ success: false, message: 'Invalid request body', error: parsed.error.issues });
        }

        const { email, password } = parsed.data;

        const user = await User.findOne({ email }).select('+passwordHash');
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const { accessToken, refreshToken } = generateTokens(String(user._id), user.role);

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            data: { accessToken, refreshToken, user },
        });
    } catch (error) {
        next(error);
    }
}

export async function refresh(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ success: false, message: 'Refresh token required' });
        }

        let decoded: any;
        try {
            decoded = jwt.verify(refreshToken, serverConfig.JWT_SECRET);
        } catch {
            return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
        }

        const { accessToken, refreshToken: newRefreshToken } = generateTokens(decoded.userId, decoded.role);

        return res.status(200).json({
            success: true,
            data: { accessToken, refreshToken: newRefreshToken },
        });
    } catch (error) {
        next(error);
    }
}

export async function logout(_req: Request, res: Response): Promise<any> {
    // Stateless JWT — client just discards the token.
    // If refresh token blacklisting is needed, store in Redis here.
    return res.status(200).json({ success: true, message: 'Logged out successfully' });
}

export async function getMe(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
        const userId = (req as any).userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        return res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
}
