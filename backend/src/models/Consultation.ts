import mongoose from 'mongoose';

const consultationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
  },
  concern: {
    type: String,
    required: [true, 'Please add the primary concern'],
  },
  discussionNotes: {
    type: String,
    required: [true, 'Please add discussion notes'],
  },
  recommendations: {
    type: String,
  },
  aiSummary: {
    type: String,
  },
  followUpDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Consultation', consultationSchema);
