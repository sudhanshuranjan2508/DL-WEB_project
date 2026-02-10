const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const auth = require('../middleware/auth');

// @route   GET /api/analytics
// @desc    Get system analytics
// @access  Private
router.get('/', auth, analyticsController.getAnalytics);

// @route   GET /api/analytics/exam/:examId
// @desc    Get exam statistics
// @access  Private
router.get('/exam/:examId', auth, analyticsController.getExamStats);

module.exports = router;
