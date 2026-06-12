import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth.routes';
import clientRoutes from './routes/client.routes';
import appointmentRoutes from './routes/appointment.routes';
import consultationRoutes from './routes/consultation.routes';
import paymentRoutes from './routes/payment.routes';
import dashboardRoutes from './routes/dashboard.routes';

dotenv.config();

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(errorHandler);

export default app;
