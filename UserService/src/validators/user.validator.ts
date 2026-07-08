import { z } from 'zod';

export const updateProfileSchema = z.object({
    name: z.string().min(2).max(100).optional(),
    avatar: z.string().url('Invalid avatar URL').optional().or(z.literal('')),
    bio: z.string().max(500).optional(),
    country: z.string().max(100).optional(),
});
