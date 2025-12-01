import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['Admin', 'Editor', 'User'],
    default: 'User',
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'active',
  },
  lastActive: {
    type: Date,
    default: Date.now,
  },
  revenue: {
    type: Number,
    default: 0,
  },
  company: {
    type: String,
    default: '',
  },
  location: {
    type: String,
    default: '',
  },
  country: {
    type: String,
    default: '',
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'BRL', 'MXN', 'ZAR'],
  },
  joinedDate: {
    type: Date,
    default: Date.now,
  },
  plan: {
    type: String,
    enum: ['Free', 'Pro', 'Enterprise'],
    default: 'Free',
  },
  bio: {
    type: String,
    default: '',
  },
  achievements: [{
    type: String,
  }],
  settings: {
    timezone: {
      type: String,
      default: 'utc-8',
    },
    language: {
      type: String,
      default: 'en',
    },
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light',
    },
    notifications: {
      email: {
        type: Boolean,
        default: true,
      },
      push: {
        type: Boolean,
        default: true,
      },
      weeklyReports: {
        type: Boolean,
        default: false,
      },
      marketing: {
        type: Boolean,
        default: false,
      },
    },
    display: {
      compactMode: {
        type: Boolean,
        default: false,
      },
      animations: {
        type: Boolean,
        default: true,
      },
      highContrast: {
        type: Boolean,
        default: false,
      },
    },
  },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;

