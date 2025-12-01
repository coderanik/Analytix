import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  day: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  active: {
    type: Number,
    required: true,
    default: 0,
  },
  new: {
    type: Number,
    required: true,
    default: 0,
  },
}, {
  timestamps: true,
});

activitySchema.index({ userId: 1, date: 1 });

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;

