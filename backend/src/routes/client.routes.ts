import express from 'express';
import {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
} from '../controllers/client.controller';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.route('/').get(getClients).post(createClient);
router.route('/:id').get(getClient).put(updateClient).delete(deleteClient);

export default router;
