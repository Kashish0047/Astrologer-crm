import { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Client from '../models/Client';
import Appointment from '../models/Appointment';
import Consultation from '../models/Consultation';
import Payment from '../models/Payment';
import { AuthRequest } from '../types';
import { successResponse } from '../utils/response';

export const getDashboardStats = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;

    const [
      totalClients,
      upcomingAppointments,
      completedConsultations,
      revenueStats,
      recentClients,
      upcomingAppointmentsList,
      recentPayments
    ] = await Promise.all([
      Client.countDocuments({ userId }),
      Appointment.countDocuments({ userId, status: 'Scheduled' }),
      Consultation.countDocuments({ userId }),
      Payment.aggregate([
        { 
          $match: { 
            userId: { $in: [userId, new mongoose.Types.ObjectId(userId)] }, 
            status: 'Paid' 
          } 
        },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Client.find({ userId }).sort({ createdAt: -1 }).limit(5),
      Appointment.find({ userId, status: 'Scheduled' })
        .populate({ path: 'clientId', select: 'name phone email' })
        .sort({ date: 1, time: 1 })
        .limit(5),
      Payment.find({ userId })
        .populate({ path: 'clientId', select: 'name phone email' })
        .sort({ paymentDate: -1, createdAt: -1 })
        .limit(5)
    ]);

    const totalRevenue = revenueStats.length > 0 ? revenueStats[0].total : 0;

    successResponse(res, {
      totalClients,
      upcomingAppointments,
      completedConsultations,
      totalRevenue,
      recentClients,
      upcomingAppointmentsList,
      recentPayments,
    });
  } catch (error) {
    next(error);
  }
};
