import mongoose from 'mongoose';
import { serverConfig } from '.';

export async function connectDB() {
    try {
        await mongoose.connect(serverConfig.MONGODB_URI);
        console.log('Connected to MongoDB (UserService) successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}
