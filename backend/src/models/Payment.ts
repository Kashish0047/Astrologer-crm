import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
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
  amount: {
    type: Number,
    required: [true, 'Please add an amount'],
  },
  paymentMethod: {
    type: String,
    enum: ['UPI', 'Cash', 'Card', 'Bank Transfer'],
    required: [true, 'Please add a payment method'],
  },
  status: {
    type: String,
    enum: ['Paid', 'Pending', 'Refunded'],
    default: 'Pending',
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Payment', paymentSchema);
