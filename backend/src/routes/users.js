import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { updateMe, getProgress, leaderboard } from '../controllers/userController.js';

const router = Router();
router.use(protect);

router.patch('/me', updateMe);
router.get('/progress', getProgress);
router.get('/leaderboard', leaderboard);

export default router;
