import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import User from '../models/User';
import { AuthRequest } from '../types';
import { generateToken } from '../utils/jwt';
import { successResponse, errorResponse } from '../utils/response';

export const register = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      errorResponse(res, 'User already exists', 400);
      return;
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    const token = generateToken(user._id.toString());

    successResponse(res, {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    }, 'User registered successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      errorResponse(res, 'Invalid credentials', 401);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      errorResponse(res, 'Invalid credentials', 401);
      return;
    }

    const token = generateToken(user._id.toString());

    successResponse(res, {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id).select('-password');
    if (!user) {
      errorResponse(res, 'User not found', 404);
      return;
    }
    successResponse(res, user);
  } catch (error) {
    next(error);
  }
};

export const updateMe = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const { name, email, password } = req.body;
    const userId = req.user?.id;

    const user = await User.findById(userId);
    if (!user) {
      errorResponse(res, 'User not found', 404);
      return;
    }

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        errorResponse(res, 'Email already in use by another account', 400);
        return;
      }
      user.email = email;
    }

    if (name) {
      user.name = name;
    }

    if (password) {
      user.password = password;
    }

    await user.save();

    successResponse(res, {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    }, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};


