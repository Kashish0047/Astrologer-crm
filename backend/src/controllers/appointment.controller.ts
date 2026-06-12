import { Response, NextFunction } from 'express';
import Appointment from '../models/Appointment';
import Client from '../models/Client';
import { AuthRequest } from '../types';
import { successResponse, errorResponse } from '../utils/response';

export const getAppointments = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
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
    const total = await Appointment.countDocuments(query);
    const appointments = await Appointment.find(query)
      .populate({ path: 'clientId', select: 'name phone email' })
      .skip(startIndex)
      .limit(limit)
      .sort({ date: 1, time: 1 });

    successResponse(res, {
      data: appointments,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

export const getAppointment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const appointment = await Appointment.findOne({ _id: req.params.id, userId: req.user?.id })
      .populate({ path: 'clientId', select: 'name phone email' });

    if (!appointment) {
      errorResponse(res, 'Appointment not found', 404);
      return;
    }

    successResponse(res, appointment);
  } catch (error) {
    next(error);
  }
};

export const createAppointment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    req.body.userId = req.user?.id;
    const appointment = await Appointment.create(req.body);
    successResponse(res, appointment, 'Appointment scheduled successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateAppointment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let appointment = await Appointment.findOne({ _id: req.params.id, userId: req.user?.id });

    if (!appointment) {
      errorResponse(res, 'Appointment not found', 404);
      return;
    }

    appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate({ path: 'clientId', select: 'name phone email' });

    successResponse(res, appointment, 'Appointment updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteAppointment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const appointment = await Appointment.findOne({ _id: req.params.id, userId: req.user?.id });

    if (!appointment) {
      errorResponse(res, 'Appointment not found', 404);
      return;
    }

    await Appointment.deleteOne({ _id: req.params.id });

    successResponse(res, null, 'Appointment deleted successfully');
  } catch (error) {
    next(error);
  }
};
