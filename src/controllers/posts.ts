import express, { Request, Response } from 'express';
import { verifyAuth } from '../middleware/auth';

const router = express.Router();

router.post("/api/post", async(req: Request, res: Response) => {
    
})