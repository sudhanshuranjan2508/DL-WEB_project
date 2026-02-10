const mongoose = require('mongoose');

const examEntrySchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true
  },
  startTime: {
    type: Date
  },
  endTime: {
    type: Date
  },
  score: {
    type: Number
  },
  answers: [{
    questionIndex: Number,
    selectedAnswer: Number,
    isCorrect: Boolean
  }],
  aiProctoringFlags: [{
    timestamp: Date,
    reason: String,
    severity: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    }
  }],
  status: {
    type: String,
    enum: ['registered', 'in_progress', 'completed', 'flagged'],
    default: 'registered'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ExamEntry', examEntrySchema);
