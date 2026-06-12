import express from 'express';
import { body } from 'express-validator';
import { register, login, getMe, updateMe } from '../controllers/auth.controller';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post(
  '/register',
  [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  register
);

router.post(
  '/login',
  [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists(),
  ],
  login
);

router.get('/me', protect, getMe);

router.put(
  '/update',
  protect,
  [
    body('name', 'Name cannot be empty').optional().not().isEmpty(),
    body('email', 'Please include a valid email').optional().isEmail(),
    body('password', 'Password must be 6 or more characters').optional().isLength({ min: 6 }),
  ],
  updateMe
);

export default router;
