// Node Import
import { Router, Request, Response } from 'express';
// Own imports
import { AuthRouter, requireAuth } from './auth.router';
import { User } from '../models/User';

// Create router
const router: Router = Router();

// Add auth routes
router.use('/auth', AuthRouter);

/**
 * 
 */
router.get('/', async (req: Request, res: Response) => {
});

/**
 * 
 */
router.get('/:id', async (req: Request, res: Response) => {
    let { id } = req.params;
    const item = await User.findByPk(id);
    res.send(item);
});

export const UserRouter: Router = router;