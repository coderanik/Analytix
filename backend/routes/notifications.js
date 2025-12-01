import express from 'express';
import Notification from '../models/Notification.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/notifications
// @desc    Get all notifications
// @access  Public (optional auth)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { read } = req.query;
    const query = {};

    // If user is authenticated, show user-specific and system-wide notifications
    if (req.user) {
      query.$or = [
        { userId: req.user._id },
        { userId: null }, // System-wide notifications
      ];
    } else {
      // If not authenticated, only show system-wide notifications
      query.userId = null;
    }

    if (read !== undefined) {
      query.read = read === 'true';
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(100);

    // Format notifications with time ago
    const formattedNotifications = notifications.map(notif => {
      const now = new Date();
      const diff = now - notif.createdAt;
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      let timeStr = 'Just now';
      if (minutes >= 1 && minutes < 60) {
        timeStr = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
      } else if (hours >= 1 && hours < 24) {
        timeStr = `${hours} hour${hours > 1 ? 's' : ''} ago`;
      } else if (days >= 1) {
        timeStr = `${days} day${days > 1 ? 's' : ''} ago`;
      }

      return {
        id: notif._id.toString(),
        title: notif.title,
        description: notif.description,
        time: timeStr,
        read: notif.read,
        type: notif.type,
      };
    });

    res.json(formattedNotifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/notifications/:id
// @desc    Get notification by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/notifications
// @desc    Create a new notification
// @access  Private (Admin only)
router.post('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, description, type, userId } = req.body;

    const notification = await Notification.create({
      title,
      description,
      type: type || 'update',
      userId: userId || null, // null for system-wide
    });

    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read', protect, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.read = true;
    await notification.save();

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.put('/read-all', protect, async (req, res) => {
  try {
    await Notification.updateMany(
      { 
        $or: [
          { userId: req.user._id },
          { userId: null }
        ],
        read: false 
      },
      { read: true }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/notifications/:id
// @desc    Delete notification
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Users can only delete their own notifications, admins can delete any
    if (notification.userId && notification.userId.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await notification.deleteOne();

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

