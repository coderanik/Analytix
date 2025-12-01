import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/profile
// @desc    Get current user profile
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Format profile data
    const joinedDate = new Date(user.joinedDate || user.createdAt);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const joinedStr = `${monthNames[joinedDate.getMonth()]} ${joinedDate.getFullYear()}`;

    // Format currency
    const formatCurrency = (amount, currency = 'USD') => {
      const symbols = {
        USD: '$', EUR: '€', GBP: '£', JPY: '¥', CAD: 'C$', AUD: 'A$',
        CHF: 'CHF', CNY: '¥', INR: '₹', BRL: 'R$', MXN: '$', ZAR: 'R'
      };
      const symbol = symbols[currency] || '$';
      return `${symbol}${amount.toLocaleString()}`;
    };

    const profile = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      company: user.company || '',
      location: user.location || '',
      country: user.country || '',
      currency: user.currency || 'USD',
      joinedDate: joinedStr,
      plan: user.plan || 'Pro Plan',
      bio: user.bio || '',
      achievements: user.achievements || ['Early Adopter', 'Top Contributor'],
      stats: {
        projects: 24,
        tasksCompleted: 156,
        teamMembers: 12,
        revenueGenerated: formatCurrency(user.revenue, user.currency || 'USD'),
      },
    };

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/profile
// @desc    Update user profile
// @access  Private
router.put('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, email, company, location, bio, achievements } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    if (company !== undefined) user.company = company;
    if (location !== undefined) user.location = location;
    if (bio !== undefined) user.bio = bio;
    if (achievements) user.achievements = achievements;

    await user.save();

    res.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      company: user.company,
      location: user.location,
      bio: user.bio,
      achievements: user.achievements,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/profile/activity
// @desc    Get user activity history
// @access  Private
router.get('/activity', protect, async (req, res) => {
  try {
    // Mock activity data (in production, this would come from an ActivityLog model)
    const activities = [
      { action: 'Updated project settings', time: '2 hours ago' },
      { action: 'Added new team member', time: '5 hours ago' },
      { action: 'Completed quarterly review', time: '1 day ago' },
      { action: 'Generated analytics report', time: '2 days ago' },
    ];

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

