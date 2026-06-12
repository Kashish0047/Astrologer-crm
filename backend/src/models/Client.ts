import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
  },
  email: {
    type: String,
  },
  dob: {
    type: Date,
  },
  birthTime: {
    type: String,
  },
  birthPlace: {
    type: String,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
  },
  address: {
    type: String,
  },
  occupation: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Client', clientSchema);
