import { Request, Response } from "express";
import { loginSchema } from "../validators/auth";
import { authenticateUser } from "../services.ts/auth";

export const login = async (req: Request, res: Response) => {
    const parseResult = loginSchema.safeParse(req.body);
    
    if(!parseResult.success) {
        const errors = parseResult.error.flatten().fieldErrors
        return res.status(400).json({error: "Validation failed", details: errors})
    }
    
    try {
        const {token, user} = await authenticateUser(parseResult.data);
        return res.status(200).json({token, user});
    } catch (error) {
        if(error instanceof Error && error.message === "Invalid credentials"){
            return res.status(401).json({error: error})
        };
        console.error('[LOGIN ERROR]:', error);
        return res.status(500).json({ error: 'Login failed. Please try again later.' });
    }
};

