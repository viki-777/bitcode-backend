import { Document, model, Schema } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    passwordHash: string;
    avatar: string;
    bio: string;
    country: string;
    role: 'user' | 'admin';
    // Streak
    currentStreak: number;
    longestStreak: number;
    lastSolvedDate: Date | null;
    // Stats (denormalized for fast reads)
    totalSolved: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    totalSubmissions: number;
    // Timestamps
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: '',
    },
    bio: {
        type: String,
        default: '',
        maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
    country: {
        type: String,
        default: '',
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    // Streak
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastSolvedDate: { type: Date, default: null },
    // Stats
    totalSolved: { type: Number, default: 0 },
    easySolved: { type: Number, default: 0 },
    mediumSolved: { type: Number, default: 0 },
    hardSolved: { type: Number, default: 0 },
    totalSubmissions: { type: Number, default: 0 },
}, {
    timestamps: true,
    versionKey: false,
    toJSON: {
        transform: (_doc, ret: any) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.passwordHash; // never expose password hash
            return ret;
        },
    },
});

// userSchema.index({ email: 1 }); // Removed duplicate index

export const User = model<IUser>('User', userSchema);
