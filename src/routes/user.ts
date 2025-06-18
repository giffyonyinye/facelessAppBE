import express, { Request, Response } from 'express';
import { userByIdSchema } from '../validators/user';
import User from '../models/User';
import { AuthRequest, verifyAuth } from '../middleware/auth';

const router = express.Router();

// get user by id /api/user/:id

router.get('/api/user/:id', verifyAuth, async(req: AuthRequest, res:Response) => {
    console.log("jkdjf")
    const parseResult = userByIdSchema.safeParse(req.params);

    if(!parseResult.success) {
        const errors = parseResult.error.flatten().fieldErrors;
        return res.status(400).json({error: errors})
    };

    const { id } = parseResult.data;

    try {
        const user = User.findById(id).lean();
        if(!user){
            res.status(404).json({error: "User not found"})
        }
        // const { password, ...safeUser} = user;
        return res.status(200).json(user)
    } catch (error: any) {
        console.error(`[User Fetch Error]: ${error.message}`);
        return res.status(500).json({ error: 'Internal server error' });
    }

})


router.get('/api/users', verifyAuth,  async (req: Request, res: Response) => {
    console.log("first")
    try {
      // Optional pagination support
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const skip = (page - 1) * limit;
  
      const [users, total] = await Promise.all([
        User.find()
          .select('-password') // exclude sensitive fields
          .skip(skip)
          .limit(limit)
          .lean(),
        User.countDocuments()
      ]);
  
      return res.status(200).json({
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        users,
      });
    } catch (error) {
      console.error('[Fetch Users Error]:', error);
      return res.status(500).json({ error: 'Failed to fetch users' });
    }
  });

  export default router;