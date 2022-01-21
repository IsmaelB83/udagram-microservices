// Node Import
import { Router, Request, Response } from 'express';
// Own imports
import { AuthRouter } from './auth/auth.router';
import { User } from './model.index';

// Create router
const router: Router = Router();

// Add auth routes
router.use('/auth', AuthRouter);

/**
 * Find user by pk
 */
router.get('/:id', async (req: Request, res: Response) => {
    let { id } = req.params;
    const item = await User.findByPk(id);
    res.send(item);
});

export const UserRouter: Router = router;