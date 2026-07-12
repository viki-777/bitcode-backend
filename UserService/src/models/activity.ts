import { Document, model, Schema } from 'mongoose';

// Tracks per-day submission activity for the heatmap
export interface IActivity extends Document {
    userId: string;
    date: string;   // "YYYY-MM-DD"
    count: number;
}

const activitySchema = new Schema<IActivity>({
    userId: { type: String, required: true },
    date: { type: String, required: true },   // e.g. "2026-07-05"
    count: { type: Number, default: 1 },
}, {
    versionKey: false,
    timestamps: false,
});

// Compound unique index — one record per user per day
activitySchema.index({ userId: 1, date: 1 }, { unique: true });

export const Activity = model<IActivity>('Activity', activitySchema);
