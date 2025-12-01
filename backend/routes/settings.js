import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/settings
// @desc    Get user settings
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('settings country currency');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Include country and currency in settings response
    const settings = user.settings || {};
    settings.country = user.country || '';
    settings.currency = user.currency || 'USD';

    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/settings
// @desc    Update user settings
// @access  Private
router.put('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { timezone, language, theme, notifications, display, country, currency } = req.body;

    // Update country and currency directly on user model
    if (country !== undefined) {
      user.country = country;
    }

    if (currency !== undefined) {
      user.currency = currency;
    }

    if (!user.settings) {
      user.settings = {};
    }

    if (timezone !== undefined) {
      user.settings.timezone = timezone;
    }

    if (language !== undefined) {
      user.settings.language = language;
    }

    if (theme !== undefined) {
      user.settings.theme = theme;
    }

    if (notifications) {
      if (!user.settings.notifications) user.settings.notifications = {};
      if (notifications.email !== undefined) user.settings.notifications.email = notifications.email;
      if (notifications.push !== undefined) user.settings.notifications.push = notifications.push;
      if (notifications.weeklyReports !== undefined) user.settings.notifications.weeklyReports = notifications.weeklyReports;
      if (notifications.marketing !== undefined) user.settings.notifications.marketing = notifications.marketing;
    }

    if (display) {
      if (!user.settings.display) user.settings.display = {};
      if (display.compactMode !== undefined) user.settings.display.compactMode = display.compactMode;
      if (display.animations !== undefined) user.settings.display.animations = display.animations;
      if (display.highContrast !== undefined) user.settings.display.highContrast = display.highContrast;
    }

    await user.save();

    res.json(user.settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/settings/password
// @desc    Update user password
// @access  Private
router.put('/password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide current and new password' });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/settings/2fa
// @desc    Toggle 2FA
// @access  Private
router.put('/2fa', protect, async (req, res) => {
  try {
    const { enabled } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // In a real app, you would store 2FA settings
    // For now, we'll just return success
    res.json({ message: `2FA ${enabled ? 'enabled' : 'disabled'} successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

