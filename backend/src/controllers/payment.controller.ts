import { Response, NextFunction } from 'express';
import Payment from '../models/Payment';
import Client from '../models/Client';
import { AuthRequest } from '../types';
import { successResponse, errorResponse } from '../utils/response';

export const getPayments = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const status = req.query.status as string;
    const search = req.query.search as string;

    let query: any = { userId: req.user?.id };

    if (status) {
      query.status = status;
    }

    if (search) {
      const clients = await Client.find({
        userId: req.user?.id,
        name: { $regex: search, $options: 'i' },
      }).select('_id');
      const clientIds = clients.map((c) => c._id);
      query.clientId = { $in: clientIds };
    }

    const startIndex = (page - 1) * limit;
    const total = await Payment.countDocuments(query);
    const payments = await Payment.find(query)
      .populate({ path: 'clientId', select: 'name phone email' })
      .skip(startIndex)
      .limit(limit)
      .sort({ paymentDate: -1, createdAt: -1 });

    successResponse(res, {
      data: payments,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

export const getPayment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const payment = await Payment.findOne({ _id: req.params.id, userId: req.user?.id })
      .populate({ path: 'clientId', select: 'name phone email' });

    if (!payment) {
      errorResponse(res, 'Payment not found', 404);
      return;
    }

    successResponse(res, payment);
  } catch (error) {
    next(error);
  }
};

export const createPayment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    req.body.userId = req.user?.id;
    const payment = await Payment.create(req.body);
    successResponse(res, payment, 'Payment recorded successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updatePayment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let payment = await Payment.findOne({ _id: req.params.id, userId: req.user?.id });

    if (!payment) {
      errorResponse(res, 'Payment not found', 404);
      return;
    }

    payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate({ path: 'clientId', select: 'name phone email' });

    successResponse(res, payment, 'Payment updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deletePayment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const payment = await Payment.findOne({ _id: req.params.id, userId: req.user?.id });

    if (!payment) {
      errorResponse(res, 'Payment not found', 404);
      return;
    }

    await Payment.deleteOne({ _id: req.params.id });

    successResponse(res, null, 'Payment deleted successfully');
  } catch (error) {
    next(error);
  }
};
