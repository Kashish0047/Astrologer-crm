import express from 'express';
import {
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from '../controllers/appointment.controller';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.route('/').get(getAppointments).post(createAppointment);
router.route('/:id').get(getAppointment).put(updateAppointment).delete(deleteAppointment);

export default router;
