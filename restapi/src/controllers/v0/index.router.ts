// Node Imports
import { Router, Request, Response } from 'express';
// Own Imports
import { FeedRouter } from './feed/routes/feed.router';
import { UserRouter } from './users/routes/user.router';

// Create router with base endpoints
const router: Router = Router();
router.use('/feed', FeedRouter);
router.use('/users', UserRouter);

// Endpoint test
router.get('/', async (req: Request, res: Response) => res.send(`V0`));

// Export
export const IndexRouter: Router = router;