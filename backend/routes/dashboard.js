import express from 'express';
import Revenue from '../models/Revenue.js';
import Activity from '../models/Activity.js';
import Traffic from '../models/Traffic.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Helper function to format currency
const formatCurrency = (amount, currency = 'USD') => {
  const symbols = {
    USD: '$', EUR: '€', GBP: '£', JPY: '¥', CAD: 'C$', AUD: 'A$',
    CHF: 'CHF', CNY: '¥', INR: '₹', BRL: 'R$', MXN: '$', ZAR: 'R'
  };
  const symbol = symbols[currency] || '$';
  return `${symbol}${amount.toLocaleString()}`;
};

// @route   GET /api/dashboard/kpis
// @desc    Get KPI data
// @access  Private
router.get('/kpis', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    const currency = user?.currency || 'USD';
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonthName = monthNames[currentMonth];

    // Get current month revenue for this user
    const currentRevenue = await Revenue.findOne({ userId, month: currentMonthName, year: currentYear });
    const previousRevenue = await Revenue.findOne({ 
      userId,
      month: monthNames[currentMonth === 0 ? 11 : currentMonth - 1], 
      year: currentMonth === 0 ? currentYear - 1 : currentYear 
    });

    const totalRevenue = currentRevenue?.revenue || 0;
    const prevTotalRevenue = previousRevenue?.revenue || 0;
    const revenueChange = prevTotalRevenue > 0 
      ? (((totalRevenue - prevTotalRevenue) / prevTotalRevenue) * 100).toFixed(1)
      : '0.0';

    // Get user's own activity stats
    const userActivity = await Activity.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: null, totalActive: { $sum: '$active' }, totalNew: { $sum: '$new' } } }
    ]);
    const activeUsers = userActivity[0]?.totalActive || 0;
    const previousMonthActivity = await Activity.aggregate([
      { 
        $match: { 
          userId: userId,
          date: { $lt: new Date(currentYear, currentMonth, 1) }
        }
      },
      { $group: { _id: null, totalActive: { $sum: '$active' } } }
    ]);
    const previousMonthUsers = previousMonthActivity[0]?.totalActive || 0;
    const usersChange = previousMonthUsers > 0
      ? (((activeUsers - previousMonthUsers) / previousMonthUsers) * 100).toFixed(1)
      : '0.0';

    // Calculate conversion rate (mock calculation)
    const conversionRate = 3.24;
    const conversionChange = 0.4;

    // Calculate retention rate
    const retentionRate = 89.2;
    const retentionChange = -1.2;

    res.json({
      revenue: {
        value: formatCurrency(totalRevenue, currency),
        change: `${revenueChange >= 0 ? '+' : ''}${revenueChange}%`,
        trend: revenueChange >= 0 ? 'up' : 'down',
        description: 'Total revenue this month',
      },
      users: {
        value: activeUsers.toLocaleString(),
        change: `${usersChange >= 0 ? '+' : ''}${usersChange}%`,
        trend: usersChange >= 0 ? 'up' : 'down',
        description: 'Active users this month',
      },
      conversion: {
        value: `${conversionRate}%`,
        change: `+${conversionChange}%`,
        trend: 'up',
        description: 'Conversion rate',
      },
      retention: {
        value: `${retentionRate}%`,
        change: `${retentionChange}%`,
        trend: 'down',
        description: 'User retention rate',
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/dashboard/revenue
// @desc    Get revenue data
// @access  Private
router.get('/revenue', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const currentYear = new Date().getFullYear();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const revenues = await Revenue.find({ userId, year: currentYear }).sort({ month: 1 });
    
    // Fill in missing months with defaults
    const revenueMap = {};
    revenues.forEach(r => {
      revenueMap[r.month] = r;
    });

    const revenueData = monthNames.map(month => ({
      month,
      revenue: revenueMap[month]?.revenue || 0,
      target: revenueMap[month]?.target || 0,
    }));

    res.json(revenueData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/dashboard/activity
// @desc    Get user activity data
// @access  Private
router.get('/activity', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday

    const activities = await Activity.find({
      userId,
      date: { $gte: startOfWeek }
    }).sort({ date: 1 });

    // Fill in missing days with defaults
    const activityMap = {};
    activities.forEach(a => {
      const dayIndex = (a.date.getDay() + 6) % 7; // Convert to Mon-Sun
      activityMap[days[dayIndex]] = a;
    });

    const activityData = days.map(day => ({
      day,
      active: activityMap[day]?.active || 0,
      new: activityMap[day]?.new || 0,
    }));

    res.json(activityData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/dashboard/traffic
// @desc    Get traffic source data
// @access  Private
router.get('/traffic', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const trafficSources = await Traffic.aggregate([
      {
        $match: { userId: userId }
      },
      {
        $group: {
          _id: '$name',
          totalValue: { $sum: '$value' },
          fill: { $first: '$fill' }
        }
      },
      { $sort: { totalValue: -1 } }
    ]);

    const fillColors = {
      'Organic': '#3b82f6',
      'Direct': '#22c55e',
      'Referral': '#f59e0b',
      'Social': '#8b5cf6',
      'Email': '#ef4444',
    };

    const trafficData = trafficSources.map(source => ({
      name: source._id,
      value: source.totalValue,
      fill: source.fill || fillColors[source._id] || '#6b7280',
    }));

    res.json(trafficData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/dashboard/users
// @desc    Get users table data
// @access  Private (Admin only, or own data)
router.get('/users', protect, async (req, res) => {
  try {
    // Admins can see all users, regular users only see themselves
    const query = req.user.role === 'Admin' ? {} : { _id: req.user._id };
    const users = await User.find(query).select('-password').sort({ createdAt: -1 }).limit(50);
    
    const usersData = users.map(user => {
      const lastActive = user.lastActive;
      const now = new Date();
      const diff = now - lastActive;
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      let lastActiveStr = 'Just now';
      if (minutes >= 1 && minutes < 60) {
        lastActiveStr = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
      } else if (hours >= 1 && hours < 24) {
        lastActiveStr = `${hours} hour${hours > 1 ? 's' : ''} ago`;
      } else if (days >= 1) {
        lastActiveStr = `${days} day${days > 1 ? 's' : ''} ago`;
      }

      return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        status: user.status,
        role: user.role,
        lastActive: lastActiveStr,
        revenue: `$${user.revenue.toLocaleString()}`,
      };
    });

    res.json(usersData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

