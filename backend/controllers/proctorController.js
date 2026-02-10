const ExamEntry = require('../models/ExamEntry');

// Add AI proctoring flag
exports.addProctoringFlag = async (req, res) => {
  try {
    const { examId, reason, severity } = req.body;
    const studentId = req.student.id;

    const examEntry = await ExamEntry.findOne({
      student: studentId,
      exam: examId
    });

    if (!examEntry) {
      return res.status(404).json({ 
        success: false, 
        message: 'Exam entry not found' 
      });
    }

    examEntry.aiProctoringFlags.push({
      timestamp: new Date(),
      reason,
      severity: severity || 'medium'
    });

    // Update status if high severity
    if (severity === 'high' && examEntry.aiProctoringFlags.length >= 3) {
      examEntry.status = 'flagged';
    }

    await examEntry.save();

    res.status(200).json({
      success: true,
      message: 'Proctoring flag added',
      flagCount: examEntry.aiProctoringFlags.length
    });
  } catch (error) {
    console.error('Add proctoring flag error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error adding proctoring flag' 
    });
  }
};

// Get proctoring flags for an exam entry
exports.getProctoringFlags = async (req, res) => {
  try {
    const { examId } = req.params;
    const studentId = req.student.id;

    const examEntry = await ExamEntry.findOne({
      student: studentId,
      exam: examId
    });

    if (!examEntry) {
      return res.status(404).json({ 
        success: false, 
        message: 'Exam entry not found' 
      });
    }

    res.status(200).json({
      success: true,
      flags: examEntry.aiProctoringFlags
    });
  } catch (error) {
    console.error('Get proctoring flags error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching proctoring flags' 
    });
  }
};
