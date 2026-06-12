import express from 'express';
import { getDashboardStats } from '../controllers/dashboard.controller';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.get('/stats', getDashboardStats);

export default router;
