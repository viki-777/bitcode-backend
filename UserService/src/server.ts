import express from 'express';
import cors from 'cors';
import { serverConfig } from './config';
import v1Router from './routers/v1/index.router';
import { connectDB } from './config/db';
import { errorHandler } from './middlewares/error.middleware';

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api/v1', v1Router);

app.use(errorHandler);

app.listen(serverConfig.PORT, async () => {
    console.log(`UserService is running on http://localhost:${serverConfig.PORT}`);
    await connectDB();
});
