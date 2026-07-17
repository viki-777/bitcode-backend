import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';

// Load environment variables from .env file.
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Enable CORS for cross-origin requests.
app.use(cors());

// Log incoming HTTP requests.
app.use(morgan('dev'));

// Health check endpoint.
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', service: 'API Gateway' });
});

// Forward problem-related requests to the Problem Service.
app.use('/api/v1/problems', createProxyMiddleware({
    target: process.env.PROBLEM_SERVICE_URL || 'http://localhost:3000',
    changeOrigin: true,
}));

// Forward submission-related requests to the Submission Service.
app.use('/api/v1/submissions', createProxyMiddleware({
    target: process.env.SUBMISSION_SERVICE_URL || 'http://localhost:3001',
    changeOrigin: true,
}));

// Forward user-related requests to the User Service.
app.use('/api/v1/users', createProxyMiddleware({
    target: process.env.USER_SERVICE_URL || 'http://localhost:3003',
    changeOrigin: true,
}));

// Forward authentication requests to the User Service.
app.use('/api/v1/auth', createProxyMiddleware({
    target: process.env.USER_SERVICE_URL || 'http://localhost:3003',
    changeOrigin: true,
}));

// Return 404 for unknown routes.
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found in API Gateway' });
});

// Start the API Gateway server.
app.listen(PORT, () => {
    console.log(`API Gateway is running on port ${PORT}`);
    console.log(`Proxying /api/v1/problems to ${process.env.PROBLEM_SERVICE_URL}`);
    console.log(`Proxying /api/v1/submissions to ${process.env.SUBMISSION_SERVICE_URL}`);
    console.log(`Proxying /api/v1/users to ${process.env.USER_SERVICE_URL}`);
});