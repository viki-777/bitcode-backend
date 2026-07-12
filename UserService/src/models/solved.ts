import { Document, model, Schema } from 'mongoose';

// Tracks which problems a user has solved (idempotent)
export interface ISolved extends Document {
    userId: string;
    problemId: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    firstSolvedAt: Date;
}

const solvedSchema = new Schema<ISolved>({
    userId: { type: String, required: true },
    problemId: { type: String, required: true },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: true,
    },
    firstSolvedAt: { type: Date, default: Date.now },
}, {
    versionKey: false,
    timestamps: false,
});

// Compound unique index — one record per user per problem
solvedSchema.index({ userId: 1, problemId: 1 }, { unique: true });
solvedSchema.index({ userId: 1 });

export const Solved = model<ISolved>('Solved', solvedSchema);
