const express = require('express');
const router = express.Router();
const proctorController = require('../controllers/proctorController');
const auth = require('../middleware/auth');

// @route   POST /api/proctor/flag
// @desc    Add AI proctoring flag
// @access  Private
router.post('/flag', auth, proctorController.addProctoringFlag);

// @route   GET /api/proctor/:examId
// @desc    Get proctoring flags for an exam
// @access  Private
router.get('/:examId', auth, proctorController.getProctoringFlags);

module.exports = router;
