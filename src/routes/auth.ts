import express from 'express';
import { loginSchema, registerSchema } from '../validators/auth';
import { AuthController } from '../controllers';

const router = express.Router();

// route /api/auth
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.post('/pseudonymous', AuthController.pseudonymous);

export default router; 