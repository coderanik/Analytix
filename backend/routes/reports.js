import express from 'express';
import Report from '../models/Report.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/reports
// @desc    Get all reports
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    // Admins can see all reports, users only see their own
    const query = req.user.role === 'Admin' ? {} : { userId: req.user._id };

    const reports = await Report.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    const formattedReports = reports.map(report => {
      const date = new Date(report.createdAt);
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const dateStr = `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

      return {
        id: report._id.toString(),
        title: report.title,
        description: report.description,
        type: report.type,
        date: dateStr,
        status: report.status,
        fileUrl: report.fileUrl,
      };
    });

    res.json(formattedReports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/reports/scheduled
// @desc    Get scheduled reports
// @access  Private
router.get('/scheduled', protect, async (req, res) => {
  try {
    const query = {
      'scheduled.enabled': true,
    };

    if (req.user.role !== 'Admin') {
      query.userId = req.user._id;
    }

    const reports = await Report.find(query)
      .populate('userId', 'name email')
      .sort({ 'scheduled.nextRun': 1 });

    const scheduledReports = reports.map(report => {
      const nextRun = new Date(report.scheduled.nextRun);
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const nextRunStr = `${monthNames[nextRun.getMonth()]} ${nextRun.getDate()}, ${nextRun.getFullYear()}`;

      let frequency = '';
      switch (report.scheduled.frequency) {
        case 'daily':
          frequency = 'Every day';
          break;
        case 'weekly':
          frequency = 'Every Monday';
          break;
        case 'monthly':
          frequency = '1st of month';
          break;
        case 'quarterly':
          frequency = 'Every quarter';
          break;
        default:
          frequency = report.scheduled.frequency;
      }

      return {
        title: report.title,
        frequency,
        nextRun: nextRunStr,
      };
    });

    res.json(scheduledReports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/reports
// @desc    Generate a new report
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, type } = req.body;

    const report = await Report.create({
      title: title || 'New Report',
      description: description || 'Generated report',
      type: type || 'Analytics',
      userId: req.user._id,
      status: 'generating',
    });

    // Simulate report generation (in production, this would be a background job)
    setTimeout(async () => {
      report.status = 'ready';
      report.fileUrl = `/reports/${report._id}.pdf`; // Mock file URL
      await report.save();
    }, 2000);

    res.status(201).json({
      id: report._id.toString(),
      title: report.title,
      description: report.description,
      type: report.type,
      status: report.status,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/reports/:id
// @desc    Get report by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id).populate('userId', 'name email');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Users can only access their own reports, admins can access any
    if (report.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/reports/:id/download
// @desc    Download report file
// @access  Private
router.get('/:id/download', protect, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Users can only download their own reports, admins can download any
    if (report.userId.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (report.status !== 'ready' || !report.fileUrl) {
      return res.status(400).json({ message: 'Report is not ready for download' });
    }

    // In a real app, this would serve the actual file
    // For now, we'll return a mock PDF response
    const fileName = `${report.title.replace(/\s+/g, '_')}_${report._id}.pdf`;
    
    // Set headers for file download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    
    // Generate a simple mock PDF content (minimal valid PDF)
    // In production, you would read the actual file from storage
    const mockPdfContent = Buffer.from(
      '%PDF-1.4\n' +
      '1 0 obj\n' +
      '<< /Type /Catalog /Pages 2 0 R >>\n' +
      'endobj\n' +
      '2 0 obj\n' +
      '<< /Type /Pages /Kids [3 0 R] /Count 1 >>\n' +
      'endobj\n' +
      '3 0 obj\n' +
      '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> >>\n' +
      'endobj\n' +
      '4 0 obj\n' +
      '<< /Length 44 >>\n' +
      'stream\n' +
      'BT\n' +
      '/F1 12 Tf\n' +
      '100 700 Td\n' +
      `(${report.title}) Tj\n` +
      'ET\n' +
      'endstream\n' +
      'endobj\n' +
      'xref\n' +
      '0 5\n' +
      '0000000000 65535 f \n' +
      '0000000009 00000 n \n' +
      '0000000058 00000 n \n' +
      '0000000115 00000 n \n' +
      '0000000317 00000 n \n' +
      'trailer\n' +
      '<< /Size 5 /Root 1 0 R >>\n' +
      'startxref\n' +
      '410\n' +
      '%%EOF'
    );

    res.send(mockPdfContent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/reports/:id
// @desc    Delete report
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Users can only delete their own reports, admins can delete any
    if (report.userId.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await report.deleteOne();

    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

