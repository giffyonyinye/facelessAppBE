import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Session from '../models/Session';

const JWT_SECRET = process.env.JWT_SECRET!;

export interface AuthRequest extends Request {
  user?: any;
  session?: any;
}

// Middleware to verify JWT token
export const verifyToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const token = authHeader.substring(7);
    
    try {
      // Try to verify as JWT token first
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        return res.status(401).json({ error: 'Invalid token' });
      }
      
      req.user = user;
      next();
    } catch (jwtError) {
      // If JWT verification fails, try to find as session token
      const session = await Session.findOne({ token });
      
      if (!session) {
        return res.status(401).json({ error: 'Invalid token' });
      }
      
      req.session = session;
      next();
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// Middleware to verify session token (for pseudonymous users)
export const verifySession = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Session token required' });
    }

    const token = authHeader.substring(7);
    const session = await Session.findOne({ token });
    
    if (!session) {
      return res.status(401).json({ error: 'Invalid session token' });
    }
    
    req.session = session;
    next();
  } catch (error) {
    console.error('Session middleware error:', error);
    res.status(500).json({ error: 'Session verification failed' });
  }
};

// Middleware that accepts both JWT and session tokens
export const verifyAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const token = authHeader.substring(7);
    
    // Try JWT first
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const user = await User.findById(decoded.userId);
      
      if (user) {
        req.user = user;
        return next();
      }
    } catch (jwtError) {
      // JWT failed, try session token
    }
    
    // Try session token
    const session = await Session.findOne({ token });
    if (session) {
      req.session = session;
      return next();
    }
    
    return res.status(401).json({ error: 'Invalid authentication token' });
  } catch (error) {
    console.error('Auth verification error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};
