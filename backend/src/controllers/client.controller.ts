import { Response, NextFunction } from 'express';
import Client from '../models/Client';
import Appointment from '../models/Appointment';
import Consultation from '../models/Consultation';
import Payment from '../models/Payment';
import { AuthRequest } from '../types';
import { successResponse, errorResponse } from '../utils/response';

export const getClients = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const search = req.query.search as string;

    const query: any = { userId: req.user?.id };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const startIndex = (page - 1) * limit;
    const total = await Client.countDocuments(query);
    const clients = await Client.find(query).skip(startIndex).limit(limit).sort({ createdAt: -1 });

    successResponse(res, {
      data: clients,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

export const getClient = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const client = await Client.findOne({ _id: req.params.id, userId: req.user?.id });

    if (!client) {
      errorResponse(res, 'Client not found', 404);
      return;
    }

    successResponse(res, client);
  } catch (error) {
    next(error);
  }
};

export const createClient = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    req.body.userId = req.user?.id;
    const client = await Client.create(req.body);
    successResponse(res, client, 'Client created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateClient = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let client = await Client.findOne({ _id: req.params.id, userId: req.user?.id });

    if (!client) {
      errorResponse(res, 'Client not found', 404);
      return;
    }

    client = await Client.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    successResponse(res, client, 'Client updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteClient = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const client = await Client.findOne({ _id: req.params.id, userId: req.user?.id });

    if (!client) {
      errorResponse(res, 'Client not found', 404);
      return;
    }

    // Cascade delete associated records
    await Appointment.deleteMany({ clientId: req.params.id });
    await Consultation.deleteMany({ clientId: req.params.id });
    await Payment.deleteMany({ clientId: req.params.id });
    await Client.deleteOne({ _id: req.params.id });

    successResponse(res, null, 'Client deleted successfully');
  } catch (error) {
    next(error);
  }
};
