// This file contains all the basic configuration for the app server to work
import dotenv from 'dotenv';

type ServerConfig = {
    PORT: number;
    DB_URI: string;
    REDIS_HOST: string; 
    REDIS_PORT: number;
    PROBLEM_SERVICE: string;
    EVALUATION_SERVICE: string;
    USER_SERVICE: string;
    FRONTEND_URL: string;
}

function loadEnv() {
    dotenv.config();
    console.log('Environment variables loaded from .env file');
}

loadEnv();

export const serverConfig: ServerConfig = {
    PORT: Number(process.env.PORT) || 3000,
    DB_URI: String(process.env.MONGODB_URI),
    REDIS_HOST: String(process.env.REDIS_HOST) || 'localhost',
    REDIS_PORT: Number(process.env.REDIS_PORT) || 6379,
    PROBLEM_SERVICE: process.env.PROBLEM_SERVICE_URL ?? 'http://localhost:3000/api/v1',
    EVALUATION_SERVICE: process.env.EVALUATION_SERVICE_URL ?? 'http://localhost:3002/api/v1',
    USER_SERVICE: process.env.USER_SERVICE_URL ?? 'http://localhost:3003/api/v1',
    FRONTEND_URL: process.env.FRONTEND_URL ?? 'http://localhost:5173',
}