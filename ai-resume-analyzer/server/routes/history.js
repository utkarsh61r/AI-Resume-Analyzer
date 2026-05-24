const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');

const getResume = () => {
  try { return require('../models/Resume'); } catch { return null; }
};

// GET /api/history
router.get('/', requireAuth, async (req, res) => {
  try {
    const Resume = getResume();
    if (!Resume) return res.json({ resumes: [] });

    const resumes = await Resume.find({ userId: req.userId })
      .select('-parsedText')
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    res.json({ resumes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/history/:id
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const Resume = getResume();
    if (!Resume) return res.status(503).json({ error: 'DB not available' });

    const resume = await Resume.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!resume) return res.status(404).json({ error: 'Not found' });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
