import mongoose from 'mongoose';

const revenueSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  revenue: {
    type: Number,
    required: true,
  },
  target: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

// Compound index for user, month and year
revenueSchema.index({ userId: 1, month: 1, year: 1 }, { unique: true });

const Revenue = mongoose.model('Revenue', revenueSchema);

export default Revenue;

