import { Router } from 'express';
import {
  listHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  toggleCompletion,
  getStats,
} from '../controllers/habitController.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);

router.get('/', listHabits);
router.post('/', createHabit);
router.get('/stats', getStats);
router.patch('/:id', updateHabit);
router.delete('/:id', deleteHabit);
router.post('/:id/toggle', toggleCompletion);

export default router;
