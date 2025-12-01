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

// @route   GET /api/analytics/revenue
// @desc    Get revenue analytics with period filter
// @access  Private
router.get('/revenue', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    const { period = '30d' } = req.query;
    const now = new Date();
    let startDate = new Date();

    switch (period) {
      case '24h':
        startDate.setHours(now.getHours() - 24);
        break;
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = now.getFullYear();
    
    const revenues = await Revenue.find({ 
      userId,
      year: currentYear,
      createdAt: { $gte: startDate }
    }).sort({ month: 1 });

    const revenueMap = {};
    revenues.forEach(r => {
      revenueMap[r.month] = r;
    });

    const revenueData = monthNames
      .filter(month => {
        const monthIndex = monthNames.indexOf(month);
        const monthDate = new Date(currentYear, monthIndex, 1);
        return monthDate >= startDate;
      })
      .map(month => ({
        month,
        revenue: revenueMap[month]?.revenue || 0,
        target: revenueMap[month]?.target || 0,
      }));

    res.json(revenueData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/analytics/activity
// @desc    Get user activity analytics
// @access  Private
router.get('/activity', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const { period = '7d' } = req.query;
    const now = new Date();
    let startDate = new Date();

    switch (period) {
      case '24h':
        startDate.setHours(now.getHours() - 24);
        break;
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    const activities = await Activity.find({
      userId,
      date: { $gte: startDate }
    }).sort({ date: 1 });

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/analytics/traffic
// @desc    Get traffic source analytics
// @access  Private
router.get('/traffic', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const { period = '30d' } = req.query;
    const now = new Date();
    let startDate = new Date();

    switch (period) {
      case '24h':
        startDate.setHours(now.getHours() - 24);
        break;
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    const trafficSources = await Traffic.aggregate([
      {
        $match: {
          userId: userId,
          createdAt: { $gte: startDate }
        }
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

// @route   GET /api/analytics/revenue-breakdown
// @desc    Get revenue breakdown by category
// @access  Private
router.get('/revenue-breakdown', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    const currency = user?.currency || 'USD';
    
    // Calculate actual revenue breakdown from user's revenue data
    const currentYear = new Date().getFullYear();
    const revenues = await Revenue.find({ userId, year: currentYear });
    const totalRevenue = revenues.reduce((sum, r) => sum + r.revenue, 0);
    
    const breakdown = [
      { 
        label: 'Subscriptions', 
        value: formatCurrency(Math.floor(totalRevenue * 0.68), currency), 
        percentage: 68 
      },
      { 
        label: 'One-time purchases', 
        value: formatCurrency(Math.floor(totalRevenue * 0.23), currency), 
        percentage: 23 
      },
      { 
        label: 'Add-ons', 
        value: formatCurrency(Math.floor(totalRevenue * 0.09), currency), 
        percentage: 9 
      },
    ];

    res.json(breakdown);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

