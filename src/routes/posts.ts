import express, { Request, Response } from 'express';
import { verifyAuth } from '../middleware/auth';
import { createPost } from '../controllers/posts';

const router = express.Router();

router.post('/', verifyAuth, createPost);