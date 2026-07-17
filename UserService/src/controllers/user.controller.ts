import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user';
import { Activity } from '../models/activity';
import { Solved } from '../models/solved';
import { updateProfileSchema } from '../validators/user.validator';

// GET /users/:userId — Public profile
export async function getProfile(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        return res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
}

// PATCH /users/:userId — Update own profile
export async function updateProfile(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
        const requestingUserId = (req as any).userId;
        if (requestingUserId !== req.params.userId) {
            return res.status(403).json({ success: false, message: 'Forbidden: cannot update another user\'s profile' });
        }

        const parsed = updateProfileSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ success: false, message: 'Invalid request body', error: parsed.error.issues });
        }

        const user = await User.findByIdAndUpdate(req.params.userId, parsed.data, { new: true });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        return res.status(200).json({ success: true, message: 'Profile updated', data: user });
    } catch (error) {
        next(error);
    }
}

// GET /users/:userId/stats
export async function getStats(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
        const user = await User.findById(req.params.userId).select(
            'totalSolved easySolved mediumSolved hardSolved totalSubmissions currentStreak longestStreak'
        );
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        return res.status(200).json({
            success: true,
            data: {
                totalSolved: user.totalSolved,
                easySolved: user.easySolved,
                mediumSolved: user.mediumSolved,
                hardSolved: user.hardSolved,
                totalSubmissions: user.totalSubmissions,
                currentStreak: user.currentStreak,
                longestStreak: user.longestStreak,
            },
        });
    } catch (error) {
        next(error);
    }
}

// GET /users/:userId/activity — 365-day heatmap data
export async function getActivity(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
        const since = new Date();
        since.setFullYear(since.getFullYear() - 1);
        const sinceStr = since.toISOString().split('T')[0];

        const activities = await Activity.find({
            userId: req.params.userId,
            date: { $gte: sinceStr },
        }).select('date count -_id').sort({ date: 1 });

        return res.status(200).json({ success: true, data: activities });
    } catch (error) {
        next(error);
    }
}

// GET /users/:userId/solved
export async function getSolved(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
        const solved = await Solved.find({ userId: req.params.userId })
            .select('problemId difficulty firstSolvedAt -_id')
            .sort({ firstSolvedAt: -1 });

        return res.status(200).json({ success: true, data: solved });
    } catch (error) {
        next(error);
    }
}

// POST /users/:userId/solved — Internal: called by EvaluationService on AC
export async function markSolved(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
        const { userId } = req.params;
        const { problemId, difficulty } = req.body;

        if (!problemId || !difficulty) {
            return res.status(400).json({ success: false, message: 'problemId and difficulty are required' });
        }

        // Upsert — idempotent
        const existing = await Solved.findOne({ userId: userId as string, problemId: problemId as string });
        if (!existing) {
            await Solved.create({ userId: userId as string, problemId: problemId as string, difficulty: difficulty as 'Easy' | 'Medium' | 'Hard' });

            // Update denormalized stats on user
            const diffField = difficulty === 'Easy' ? 'easySolved'
                : difficulty === 'Medium' ? 'mediumSolved' : 'hardSolved';

            await User.findByIdAndUpdate(userId, {
                $inc: { totalSolved: 1, [diffField]: 1 },
            });
        }

        return res.status(200).json({ success: true, message: 'Problem marked as solved' });
    } catch (error) {
        next(error);
    }
}

// POST /users/:userId/streak — Internal: called by EvaluationService on AC
export async function updateStreak(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
        const lastDate = user.lastSolvedDate
            ? user.lastSolvedDate.toISOString().split('T')[0]
            : null;

        if (lastDate === today) {
            
            return res.status(200).json({ success: true, message: 'Already counted today' });
        }

        let newStreak = 1;
        if (lastDate) {
            const last = new Date(lastDate);
            const todayDate = new Date(today);
            const diffDays = Math.round((todayDate.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays === 1) {
                newStreak = user.currentStreak + 1; // Consecutive!
            }
            // diffDays > 1 → streak broken, reset to 1
        }

        const newLongest = Math.max(user.longestStreak, newStreak);
        await User.findByIdAndUpdate(userId, {
            currentStreak: newStreak,
            longestStreak: newLongest,
            lastSolvedDate: new Date(),
        });

        return res.status(200).json({ success: true, data: { currentStreak: newStreak, longestStreak: newLongest } });
    } catch (error) {
        next(error);
    }
}

// POST /users/:userId/activity — Internal: called by EvaluationService every submission
export async function recordActivity(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
        const { userId } = req.params;
        const today = new Date().toISOString().split('T')[0];

       
        await Activity.findOneAndUpdate(
            { userId, date: today },
            { $inc: { count: 1 } },
            { upsert: true }
        );

        // Also increment totalSubmissions on user
        await User.findByIdAndUpdate(userId, { $inc: { totalSubmissions: 1 } });

        return res.status(200).json({ success: true, message: 'Activity recorded' });
    } catch (error) {
        next(error);
    }
}

// GET /leaderboard/global
export async function getLeaderboard(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
        const users = await User.find({ totalSolved: { $gt: 0 } })
            .select('name totalSolved')
            .sort({ totalSolved: -1, _id: 1 }) // Tie-breaker by older user
            .limit(100);

        const leaderboard = users.map((u, index) => ({
            userId: u._id.toString(),
            name: u.name,
            score: u.totalSolved,
            rank: index + 1
        }));

        return res.status(200).json({ success: true, data: leaderboard });
    } catch (error) {
        next(error);
    }
}
