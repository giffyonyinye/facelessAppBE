import { Request, Response } from "express";
import { loginSchema, pseudonymousSchema, registerSchema } from "../validators/auth";
import { authenticateUser, pseudonymousUser, registerUser } from "../services.ts/auth";

const login = async (req: Request, res: Response): Promise<void> => {
    const parseResult = loginSchema.safeParse(req.body);
    
    if(!parseResult.success) {
        const errors = parseResult.error.flatten().fieldErrors
         res.status(400).json({error: "Validation failed", details: errors})
         return;
    }
    
    try {
        const {token, user} = await authenticateUser(parseResult.data);
        res.status(200).json({token, user});
        return;
    } catch (error) {
        if(error instanceof Error && error.message === "Invalid credentials"){
            res.status(401).json({error: error});
            return;
        };
        console.error('[LOGIN ERROR]:', error);
        res.status(500).json({ error: 'Login failed. Please try again later.' });
        return;
    }
};

const register = async (req: Request, res: Response): Promise<void> => {
    const parseResult = registerSchema.safeParse(req.body);
    if(!parseResult.success) {
        const errors = parseResult.error.flatten().fieldErrors;
        res.status(400).json({error: errors});
        return;
    }
    try {
        const {token, user} = await registerUser(parseResult.data);
        res.status(201).json({token, user});
        return;
    } catch (error) {
        if(error instanceof Error && error.message === "Email already in use") {
            res.status(409).json({error: error});
            return
        };
        res.status(500).json({error: "Registration failed"});
    }
};

const pseudonymous = async (req: Request, res: Response): Promise<void> => {
    const parseResult = pseudonymousSchema.safeParse(req.body);
    if(!parseResult.success){
        const errors = parseResult.error.flatten().fieldErrors;
        res.status(400).json({error: errors});
        return;
    }

    try {
        const {token, guestUser} = await pseudonymousUser(parseResult.data);
        res.status(201).json({token, guestUser});
        return;
    } catch (error) {
        if(error instanceof Error && error.message === "Nickname already in use"){
            res.status(409).json({error : error});
            return
        }
        res.status(500).json({error: ""})
    }
}

export { login, register, pseudonymous };
