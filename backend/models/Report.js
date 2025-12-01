import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Revenue', 'Analytics', 'Growth', 'Team'],
    required: true,
  },
  status: {
    type: String,
    enum: ['ready', 'generating', 'failed'],
    default: 'generating',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fileUrl: {
    type: String,
    default: null,
  },
  scheduled: {
    enabled: {
      type: Boolean,
      default: false,
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'quarterly'],
    },
    nextRun: {
      type: Date,
    },
  },
}, {
  timestamps: true,
});

const Report = mongoose.model('Report', reportSchema);

export default Report;

