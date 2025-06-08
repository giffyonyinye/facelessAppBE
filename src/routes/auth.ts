import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Session from '../models/Session';
import User from '../models/User';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
console.log(JWT_SECRET);

// POST /api/auth/pseudonymous
router.post('/pseudonymous', async (req: any, res: any) => {
  const { nickname } = req.body;
  if (!nickname) {
    return res.status(400).json({ error: 'Nickname is required' });
  }
  try {
    const token = uuidv4();
    await Session.create({ token, nickname });
    res.status(201).json({ token, nickname });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// POST /api/auth/register
router.post('/register', async (req: any, res: any) => {
  const { email, password, nickname } = req.body;
  if (!email || !password || !nickname) {
    return res.status(400).json({ error: 'Email, password, and nickname are required' });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already in use' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, nickname });
    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { email: user.email, nickname: user.nickname } });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /api/auth/login
router.post('/login', async (req: any, res: any) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password || '');
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ token, user: { email: user.email, nickname: user.nickname } });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router; 