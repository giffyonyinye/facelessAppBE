import mongoose from "mongoose";
import {z} from "zod";

const objectId = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId format",
  });

export const createPostSchema = z.object({
    title: z.string().min(1, {message: "Title is requird"}),
    userId: objectId.optional(), 
    sessionId: z.string().optional(),
    thoughts: z.array(z.object({thought: z.string().min(1, {message: "Thought cannot be empty"})})).min(1, {message: "At least one thought is required"})
});

export type CreatePostInput = z.infer<typeof createPostSchema>

