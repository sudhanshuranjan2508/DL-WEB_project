const Student = require('../models/Student');
const Exam = require('../models/Exam');
const ExamEntry = require('../models/ExamEntry');

// Get system analytics
exports.getAnalytics = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalExams = await Exam.countDocuments();
    const totalEntries = await ExamEntry.countDocuments();
    
    const completedExams = await ExamEntry.countDocuments({ status: 'completed' });
    const inProgressExams = await ExamEntry.countDocuments({ status: 'in_progress' });
    const flaggedEntries = await ExamEntry.countDocuments({ 
      aiProctoringFlags: { $exists: true, $ne: [] } 
    });

    // Get average scores
    const scoreStats = await ExamEntry.aggregate([
      { $match: { score: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: null,
          avgScore: { $avg: '$score' },
          minScore: { $min: '$score' },
          maxScore: { $max: '$score' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      analytics: {
        totalStudents,
        totalExams,
        totalEntries,
        completedExams,
        inProgressExams,
        flaggedEntries,
        scoreStats: scoreStats[0] || { avgScore: 0, minScore: 0, maxScore: 0 }
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching analytics' 
    });
  }
};

// Get exam statistics
exports.getExamStats = async (req, res) => {
  try {
    const examId = req.params.examId;

    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ 
        success: false, 
        message: 'Exam not found' 
      });
    }

    const entries = await ExamEntry.find({ exam: examId })
      .populate('student', 'name email');

    const totalParticipants = entries.length;
    const completedCount = entries.filter(e => e.status === 'completed').length;
    const inProgressCount = entries.filter(e => e.status === 'in_progress').length;
    const flaggedCount = entries.filter(e => e.aiProctoringFlags.length > 0).length;

    const scores = entries
      .filter(e => e.score !== null && e.score !== undefined)
      .map(e => e.score);

    const avgScore = scores.length > 0 
      ? scores.reduce((a, b) => a + b, 0) / scores.length 
      : 0;

    res.status(200).json({
      success: true,
      examStats: {
        examTitle: exam.title,
        totalParticipants,
        completedCount,
        inProgressCount,
        flaggedCount,
        avgScore: avgScore.toFixed(2),
        maxScore: exam.maxScore,
        participants: entries.map(e => ({
          student: e.student,
          status: e.status,
          score: e.score,
          flagCount: e.aiProctoringFlags.length,
          startTime: e.startTime,
          endTime: e.endTime
        }))
      }
    });
  } catch (error) {
    console.error('Get exam stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching exam statistics' 
    });
  }
};
