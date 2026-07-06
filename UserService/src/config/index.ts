import dotenv from 'dotenv';

type ServerConfig = {
    PORT: number;
    MONGODB_URI: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    JWT_REFRESH_EXPIRES_IN: string;
    FRONTEND_URL: string;
    LOG_LEVEL: string;
}

function loadEnv() {
    dotenv.config();
    console.log('Environment variables loaded from .env file');
}

loadEnv();

export const serverConfig: ServerConfig = {
    PORT: Number(process.env.PORT) || 3003,
    MONGODB_URI: process.env.MONGODB_URI ?? '',
    JWT_SECRET: process.env.JWT_SECRET ?? 'fallback-secret-change-me',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '15m',
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
    FRONTEND_URL: process.env.FRONTEND_URL ?? 'http://localhost:5173',
    LOG_LEVEL: process.env.LOG_LEVEL ?? 'info',
};
