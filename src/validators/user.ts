import mongoose from 'mongoose';
import {z} from 'zod';

export const userByIdSchema = z.object({
    id: z.string().min(1, {message: "User Id is required"}).refine((val) => mongoose.Types.ObjectId.isValid(val), {message: "Invalid user format"})
})