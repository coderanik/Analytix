import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users with search, filter, and sort
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, status, sortBy = 'name', sortOrder = 'asc', page = 1, limit = 50 } = req.query;

    // Build query
    const query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(query)
      .select('-password')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    // Format users
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

    res.json({
      users: usersData,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/users
// @desc    Create a new user
// @access  Private (Admin only)
router.post('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { name, email, password, role, status } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password: password || 'password123', // Default password
      role: role || 'User',
      status: status || 'active',
    });

    res.status(201).json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is admin or updating own profile
    if (req.user.role !== 'Admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { name, email, role, status, revenue } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    if (role && req.user.role === 'Admin') user.role = role;
    if (status && req.user.role === 'Admin') user.status = status;
    if (revenue !== undefined) user.revenue = revenue;

    await user.save();

    res.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      revenue: user.revenue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private (Admin only)
router.delete('/:id', protect, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.deleteOne();

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

