const Exam = require('../models/Exam');
const ExamEntry = require('../models/ExamEntry');
const Student = require('../models/Student');

// Create a new exam
exports.createExam = async (req, res) => {
  try {
    const { title, description, duration, maxScore, scheduledTime, questions } = req.body;

    const exam = new Exam({
      title,
      description,
      duration,
      maxScore,
      scheduledTime,
      questions: questions || []
    });

    await exam.save();

    res.status(201).json({
      success: true,
      message: 'Exam created successfully',
      exam
    });
  } catch (error) {
    console.error('Create exam error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating exam' 
    });
  }
};

// Get all exams
exports.getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find().sort({ scheduledTime: -1 });

    res.status(200).json({
      success: true,
      count: exams.length,
      exams
    });
  } catch (error) {
    console.error('Get exams error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching exams' 
    });
  }
};

// Get a single exam
exports.getExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({ 
        success: false, 
        message: 'Exam not found' 
      });
    }

    res.status(200).json({
      success: true,
      exam
    });
  } catch (error) {
    console.error('Get exam error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching exam' 
    });
  }
};

// Register student for exam
exports.registerForExam = async (req, res) => {
  try {
    const examId = req.params.id;
    const studentId = req.student.id;

    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ 
        success: false, 
        message: 'Exam not found' 
      });
    }

    // Check if already registered
    const existingEntry = await ExamEntry.findOne({
      student: studentId,
      exam: examId
    });

    if (existingEntry) {
      return res.status(400).json({ 
        success: false, 
        message: 'Already registered for this exam' 
      });
    }

    // Create exam entry
    const examEntry = new ExamEntry({
      student: studentId,
      exam: examId
    });

    await examEntry.save();

    // Add to student's registered exams
    await Student.findByIdAndUpdate(studentId, {
      $push: { registeredExams: examId }
    });

    // Add to exam's participants
    await Exam.findByIdAndUpdate(examId, {
      $push: { participants: studentId }
    });

    res.status(201).json({
      success: true,
      message: 'Successfully registered for exam',
      examEntry
    });
  } catch (error) {
    console.error('Register for exam error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error registering for exam' 
    });
  }
};

// Start exam
exports.startExam = async (req, res) => {
  try {
    const examId = req.params.id;
    const studentId = req.student.id;

    const examEntry = await ExamEntry.findOne({
      student: studentId,
      exam: examId
    });

    if (!examEntry) {
      return res.status(404).json({ 
        success: false, 
        message: 'Not registered for this exam' 
      });
    }

    if (examEntry.startTime) {
      return res.status(400).json({ 
        success: false, 
        message: 'Exam already started' 
      });
    }

    examEntry.startTime = new Date();
    examEntry.status = 'in_progress';
    await examEntry.save();

    // Update exam status if needed
    const exam = await Exam.findById(examId);
    if (exam.status === 'scheduled') {
      exam.status = 'in_progress';
      await exam.save();
    }

    res.status(200).json({
      success: true,
      message: 'Exam started successfully',
      examEntry
    });
  } catch (error) {
    console.error('Start exam error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error starting exam' 
    });
  }
};

// Submit exam
exports.submitExam = async (req, res) => {
  try {
    const examId = req.params.id;
    const studentId = req.student.id;
    const { answers } = req.body;

    const examEntry = await ExamEntry.findOne({
      student: studentId,
      exam: examId
    });

    if (!examEntry) {
      return res.status(404).json({ 
        success: false, 
        message: 'Not registered for this exam' 
      });
    }

    if (!examEntry.startTime) {
      return res.status(400).json({ 
        success: false, 
        message: 'Exam not started yet' 
      });
    }

    if (examEntry.endTime) {
      return res.status(400).json({ 
        success: false, 
        message: 'Exam already submitted' 
      });
    }

    // Get exam to calculate score
    const exam = await Exam.findById(examId);
    let score = 0;
    const processedAnswers = [];

    if (exam.questions && answers) {
      answers.forEach((answer, index) => {
        const question = exam.questions[index];
        if (question) {
          const isCorrect = answer.selectedAnswer === question.correctAnswer;
          if (isCorrect) {
            score += question.points || (exam.maxScore / exam.questions.length);
          }
          processedAnswers.push({
            questionIndex: index,
            selectedAnswer: answer.selectedAnswer,
            isCorrect
          });
        }
      });
    }

    // Validate score
    if (score < 0) score = 0;
    if (score > exam.maxScore) score = exam.maxScore;

    examEntry.endTime = new Date();
    examEntry.score = score;
    examEntry.answers = processedAnswers;
    examEntry.status = 'completed';
    await examEntry.save();

    res.status(200).json({
      success: true,
      message: 'Exam submitted successfully',
      score,
      maxScore: exam.maxScore,
      examEntry
    });
  } catch (error) {
    console.error('Submit exam error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error submitting exam' 
    });
  }
};

// Get student's exams
exports.getStudentExams = async (req, res) => {
  try {
    const studentId = req.student.id;

    const examEntries = await ExamEntry.find({ student: studentId })
      .populate('exam')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: examEntries.length,
      exams: examEntries
    });
  } catch (error) {
    console.error('Get student exams error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching exams' 
    });
  }
};
