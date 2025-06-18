import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Session from '../models/Session';
import User from '../models/User';
import { loginSchema, registerSchema } from '../validators/auth';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET|| '1234567890qwerty';
if (!process.env.JWT_SECRET) {
  console.warn('JWT_SECRET not provided - using development key (not secure for production)');
};


//POST /api/auth/pseudonymous
router.post('/pseudonymous', async (req: any, res: any) => {
  const { nickname } = req.body;
  if (!nickname || typeof nickname !== 'string' || nickname.trim().length === 0) {
    return res.status(400).json({ error: 'Valid nickname is required' });
  }
  const trimmedNickname = nickname.trim();
  try {
    const existingName = await Session.findOne({ nickname: trimmedNickname });
    if (existingName) {
      return res.status(409).json({ error: 'Nickname already in use' });
    }
    const token = uuidv4();
    await Session.create({ token, nickname: nickname.trim() });
    res.status(201).json({ token, nickname: nickname.trim() });
  } catch (err) {
    console.error('Pseudonymous session creation error:', err);
    res.status(500).json({ error: 'Failed to create session' });
  }
});


// POST /api/auth/register
router.post('/register', async (req: any, res: any) => {
  // const { email, password, nickname } = req.body;

  const parseResult = registerSchema.safeParse(req.body)

  // if (!email || !password || !nickname) {
  //   // return res.status(400).json({ error: 'Email, password, and nickname are required' });
  //   return res.status(400).json({ error: {
  //     email: "email is required",
  //     password: "password is required",
  //     nickname: "nickname is required"
  //   }});
  // }
  if(!parseResult.success) {
    const errors = parseResult.error.flatten().fieldErrors;
    return res.status(400).json({error: errors})
  }
  const { email, password, nickname } = parseResult.data;

  // if (typeof email !== 'string' || typeof password !== 'string' || typeof nickname !== 'string') {
  //   return res.status(400).json({ error: 'Invalid input types' });
  // }

  // if (password.length < 6) {
  //   return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  // }

  // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // if (!emailRegex.test(email)) {
  //   return res.status(400).json({ error: 'Invalid email format' });
  // }

  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already in use' });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      nickname: nickname.trim()
    });
    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({
      token,
      user: { email: user.email, nickname: user.nickname }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /api/auth/login
router.post('/login', async (req: any, res: any) => {
  
  const parseResult = loginSchema.safeParse(req.body);

  if(!parseResult.success) {
    const errors = parseResult.error.flatten().fieldErrors;
    return res.status(400).json({error: errors})
  }

  const { email, password } = parseResult.data; 

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({
      token,
      user: { email: user.email, nickname: user.nickname }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router; 