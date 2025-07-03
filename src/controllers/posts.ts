import express, { Request, Response } from 'express';
import { verifyAuth } from '../middleware/auth';
import { createPostSchema } from '../validators/post';
import { createPostService } from '../services.ts/post';


export const createPost = async (req: Request, res: Response): Promise<void> => {
  const result = createPostSchema.safeParse(req.body);

  if (!result.success) {
     res.status(400).json({
      error: 'Validation failed',
      details: result.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    const post = await createPostService(result.data);
    res.status(201).json(post);
    return;
  } catch (err) {
    console.error('[CREATE POST ERROR]:', err);
    res.status(500).json({ error: 'Failed to create post' });
    return;
  }
};