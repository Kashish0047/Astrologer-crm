import express from 'express';
import {
  getPayments,
  getPayment,
  createPayment,
  updatePayment,
  deletePayment,
} from '../controllers/payment.controller';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.route('/').get(getPayments).post(createPayment);
router.route('/:id').get(getPayment).put(updatePayment).delete(deletePayment);

export default router;
