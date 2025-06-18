import {z} from "zod";

export const createPostSchema = z.object({
    post: z.string().min(1, {message: "Post is required"})
})