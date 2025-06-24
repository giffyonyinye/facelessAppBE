import { z } from "zod";

export const registerSchema = z.object({
    email: z.string().email({message: "Invalid email format"}),
    password: z.string().min(6, {message: "Password must be at least 6 characters long"}),
    nickname: z.string().min(1, { message: 'Nickname is required' }),
});

export const loginSchema = z.object({
    email: z.string().min(1, {message: 'Email is required'}).email({message: "Invalid email format"}),
    password: z.string().min(1, {message: 'Password is required'})
});

export const pseudonymousSchema = z.object({
    nickname: z.string().min(1, {message: "Nickname is required"})
})

export type LoginInput = z.infer<typeof loginSchema>;
export type registerInput = z.infer<typeof registerSchema>;
export type pseudonymousInput = z.infer<typeof pseudonymousSchema>;