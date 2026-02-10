const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const auth = require('../middleware/auth');

// @route   POST /api/exams
// @desc    Create a new exam
// @access  Private (admin)
router.post('/', auth, examController.createExam);

// @route   GET /api/exams
// @desc    Get all exams
// @access  Private
router.get('/', auth, examController.getAllExams);

// @route   GET /api/exams/my-exams
// @desc    Get student's exams
// @access  Private
router.get('/my-exams', auth, examController.getStudentExams);

// @route   GET /api/exams/:id
// @desc    Get a single exam
// @access  Private
router.get('/:id', auth, examController.getExam);

// @route   POST /api/exams/:id/register
// @desc    Register for an exam
// @access  Private
router.post('/:id/register', auth, examController.registerForExam);

// @route   POST /api/exams/:id/start
// @desc    Start an exam
// @access  Private
router.post('/:id/start', auth, examController.startExam);

// @route   POST /api/exams/:id/submit
// @desc    Submit an exam
// @access  Private
router.post('/:id/submit', auth, examController.submitExam);

module.exports = router;
