import { Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import User from '../models/User';
import { AuthRequest } from '../types';
import { errorResponse } from '../utils/response';

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    errorResponse(res, 'Not authorized to access this route', 401);
    return;
  }

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      errorResponse(res, 'User not found', 404);
      return;
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    };

    next();
  } catch (error) {
    errorResponse(res, 'Not authorized to access this route', 401);
    return;
  }
};
