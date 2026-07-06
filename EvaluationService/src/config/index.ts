// This file contains all the basic configuration for the app server to work
import dotenv from 'dotenv';

type ServerConfig = {
    PORT: number;
    MONGODB_URI: string;
    PROBLEM_SERVICE: string;
    SUBMISSION_SERVICE: string;
    USER_SERVICE: string;
    REDIS_HOST: string;
    REDIS_PORT: number;
    FRONTEND_URL: string;
}

function loadEnv() {
    dotenv.config();
    console.log('Environment variables loaded from .env file');
}

loadEnv();

export const serverConfig: ServerConfig = {
    PORT: Number(process.env.PORT) || 3000,
    MONGODB_URI: String(process.env.MONGODB_URI),
    PROBLEM_SERVICE: process.env.PROBLEM_SERVICE_URL ?? 'http://localhost:3000/api/v1',
    SUBMISSION_SERVICE: process.env.SUBMISSION_SERVICE_URL ?? 'http://localhost:3001/api/v1',
    USER_SERVICE: process.env.USER_SERVICE_URL ?? 'http://localhost:3003/api/v1',
    REDIS_HOST: String(process.env.REDIS_HOST) || 'localhost',
    REDIS_PORT: Number(process.env.REDIS_PORT) || 6379,
    FRONTEND_URL: process.env.FRONTEND_URL ?? 'http://localhost:5173',
}