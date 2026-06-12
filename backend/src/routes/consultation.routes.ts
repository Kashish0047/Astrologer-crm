import express from 'express';
import {
  getConsultations,
  getConsultation,
  createConsultation,
  updateConsultation,
  deleteConsultation,
  generateAISummary,
} from '../controllers/consultation.controller';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.route('/').get(getConsultations).post(createConsultation);
router.route('/:id').get(getConsultation).put(updateConsultation).delete(deleteConsultation);
router.post('/:id/generate-summary', generateAISummary);

export default router;
