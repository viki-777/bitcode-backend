import express from 'express';
import { getProfile, updateProfile, getStats, getActivity, getSolved, markSolved, updateStreak, recordActivity, getLeaderboard } from '../../controllers/user.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const userRouter = express.Router();

// Public endpoints
userRouter.get('/leaderboard/global', getLeaderboard);
userRouter.get('/:userId', getProfile);
userRouter.get('/:userId/stats', getStats);
userRouter.get('/:userId/activity', getActivity);
userRouter.get('/:userId/solved', getSolved);

// Protected endpoints
userRouter.patch('/:userId', authMiddleware, updateProfile);

// Internal endpoints (should ideally be protected by a service-to-service token or network isolation)
userRouter.post('/:userId/solved', markSolved);
userRouter.post('/:userId/streak', updateStreak);
userRouter.post('/:userId/activity', recordActivity);

export default userRouter;
