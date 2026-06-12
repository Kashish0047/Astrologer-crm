import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
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
  date: {
    type: Date,
    required: [true, 'Please add a date'],
  },
  time: {
    type: String,
    required: [true, 'Please add a time'],
  },
  consultationType: {
    type: String,
    enum: ['Career', 'Marriage', 'Health', 'Finance', 'General Guidance'],
    required: [true, 'Please specify consultation type'],
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled'],
    default: 'Scheduled',
  },
  notes: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Appointment', appointmentSchema);
