import express from 'express';
import authRouter from './auth.router';
import userRouter from './user.router';

const v1Router = express.Router();

v1Router.get('/ping', (req, res) => res.status(200).json({ success: true, message: 'UserService is up' }));
v1Router.use('/auth', authRouter);
v1Router.use('/users', userRouter);

export default v1Router;
