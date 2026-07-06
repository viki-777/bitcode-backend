import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(morgan('dev'));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', service: 'API Gateway' });
});

// Proxy routes
// Problems Service
app.use('/api/v1/problems', createProxyMiddleware({
    target: process.env.PROBLEM_SERVICE_URL || 'http://localhost:3000',
    changeOrigin: true,
}));

// Submissions Service
app.use('/api/v1/submissions', createProxyMiddleware({
    target: process.env.SUBMISSION_SERVICE_URL || 'http://localhost:3001',
    changeOrigin: true,
}));

// User Service
app.use('/api/v1/users', createProxyMiddleware({
    target: process.env.USER_SERVICE_URL || 'http://localhost:3003',
    changeOrigin: true,
}));
app.use('/api/v1/auth', createProxyMiddleware({
    target: process.env.USER_SERVICE_URL || 'http://localhost:3003',
    changeOrigin: true,
}));

// Handle 404
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found in API Gateway' });
});

app.listen(PORT, () => {
    console.log(`API Gateway is running on port ${PORT}`);
    console.log(`Proxying /api/v1/problems to ${process.env.PROBLEM_SERVICE_URL}`);
    console.log(`Proxying /api/v1/submissions to ${process.env.SUBMISSION_SERVICE_URL}`);
    console.log(`Proxying /api/v1/users to ${process.env.USER_SERVICE_URL}`);
});
