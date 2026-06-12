import { Response, NextFunction } from 'express';
import Consultation from '../models/Consultation';
import Client from '../models/Client';
import { AuthRequest } from '../types';
import { successResponse, errorResponse } from '../utils/response';
import { generateConsultationSummary } from '../services/gemini.service';

export const getConsultations = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const search = req.query.search as string;

    let query: any = { userId: req.user?.id };

    if (search) {
      const clients = await Client.find({
        userId: req.user?.id,
        name: { $regex: search, $options: 'i' },
      }).select('_id');
      const clientIds = clients.map((c) => c._id);
      
      query.$or = [
        { clientId: { $in: clientIds } },
        { concern: { $regex: search, $options: 'i' } }
      ];
    }

    const startIndex = (page - 1) * limit;
    const total = await Consultation.countDocuments(query);
    const consultations = await Consultation.find(query)
      .populate({ path: 'clientId', select: 'name phone email' })
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 });

    successResponse(res, {
      data: consultations,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

export const getConsultation = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const consultation = await Consultation.findOne({ _id: req.params.id, userId: req.user?.id })
      .populate({ path: 'clientId', select: 'name phone email' });

    if (!consultation) {
      errorResponse(res, 'Consultation not found', 404);
      return;
    }

    successResponse(res, consultation);
  } catch (error) {
    next(error);
  }
};

export const createConsultation = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    req.body.userId = req.user?.id;
    const consultation = await Consultation.create(req.body);
    successResponse(res, consultation, 'Consultation recorded successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateConsultation = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let consultation = await Consultation.findOne({ _id: req.params.id, userId: req.user?.id });

    if (!consultation) {
      errorResponse(res, 'Consultation not found', 404);
      return;
    }

    consultation = await Consultation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate({ path: 'clientId', select: 'name phone email' });

    successResponse(res, consultation, 'Consultation updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteConsultation = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const consultation = await Consultation.findOne({ _id: req.params.id, userId: req.user?.id });

    if (!consultation) {
      errorResponse(res, 'Consultation not found', 404);
      return;
    }

    await Consultation.deleteOne({ _id: req.params.id });

    successResponse(res, null, 'Consultation deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const generateAISummary = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const consultation = await Consultation.findOne({ _id: req.params.id, userId: req.user?.id });

    if (!consultation) {
      errorResponse(res, 'Consultation not found', 404);
      return;
    }

    if (!consultation.discussionNotes) {
      errorResponse(res, 'No discussion notes available to summarize', 400);
      return;
    }

    let aiSummary: string;
    try {
      aiSummary = await generateConsultationSummary(consultation.discussionNotes);
    } catch (genError: any) {
      errorResponse(res, `Failed to generate summary: ${genError.message || 'Unknown Gemini error'}`, 400);
      return;
    }

    consultation.aiSummary = aiSummary;
    await consultation.save();

    successResponse(res, { aiSummary }, 'AI summary generated successfully');
  } catch (error) {
    next(error);
  }
};
