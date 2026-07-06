// This file contains all the basic configuration for the app server to work
import dotenv from 'dotenv';

type ServerConfig = {
    PORT: number;
    DB_URI: string;
    JWT_SECRET: string;
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
    JWT_SECRET: process.env.JWT_SECRET || 'secret123',
    FRONTEND_URL: process.env.FRONTEND_URL ?? 'http://localhost:5173',
}