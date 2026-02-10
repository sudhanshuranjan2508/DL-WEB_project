# DL-WEB_project

## AI-Powered Exam Entry System

A comprehensive Python-based exam management system with AI-powered features for student registration, exam scheduling, proctoring, and analytics.

### Features

- **Student Management**: Register and authenticate students securely
- **Exam Scheduling**: Create and manage exams with detailed configurations
- **Exam Registration**: Register students for specific exams
- **AI-Based Proctoring**: Track and flag suspicious behavior during exams
- **Real-time Tracking**: Monitor exam progress and status
- **Analytics Dashboard**: Get comprehensive system analytics
- **Data Persistence**: JSON-based storage for all data

### Installation

1. Clone the repository:
```bash
git clone https://github.com/sudhanshuranjan2508/DL-WEB_project.git
cd DL-WEB_project
```

2. Ensure Python 3.7+ is installed:
```bash
python3 --version
```

3. No external dependencies required - uses Python standard library only!

### Usage

#### Run the Demo

```bash
python3 ai_exam_entry_system.py
```

#### Use as a Module

```python
from ai_exam_entry_system import AIExamEntrySystem

# Initialize the system
system = AIExamEntrySystem()

# Register a student
success, msg = system.register_student("John Doe", "john@example.com", "password")
print(msg)

# Authenticate student
success, student_id = system.authenticate_student("john@example.com", "password")

# Create an exam
exam_id = system.create_exam(
    title="Python Programming",
    description="Final exam",
    duration_minutes=90,
    max_score=100.0,
    scheduled_time="2026-02-15T10:00:00"
)

# Register student for exam
system.register_student_for_exam(student_id, exam_id)

# Start the exam
system.start_exam(student_id, exam_id)

# Flag suspicious behavior (AI proctoring)
system.ai_proctor_flag(student_id, exam_id, "Multiple faces detected")

# Submit the exam
system.submit_exam(student_id, exam_id, 85.0)

# Get analytics
analytics = system.get_analytics()
print(analytics)
```

### Core Components

#### Student Management
- Secure password hashing (SHA-256)
- Student status tracking (Active, Inactive, Suspended)
- Email-based authentication

#### Exam Management
- Flexible exam creation with customizable parameters
- Exam status tracking (Scheduled, In Progress, Completed, Cancelled)
- Duration and scoring configuration

#### AI Proctoring
- Real-time behavior flagging
- Timestamped proctoring logs
- Multiple flag support per student

#### Data Models
- **Student**: User profile with authentication
- **Exam**: Exam configuration and metadata
- **ExamEntry**: Student-exam relationship with status and scores

### System Architecture

The system uses a modular design with clear separation of concerns:

- **Data Models**: Dataclasses for Student, Exam, and ExamEntry
- **Business Logic**: AIExamEntrySystem class handles all operations
- **Data Persistence**: JSON-based storage with automatic save/load
- **Security**: Password hashing and validation

### API Reference

#### AIExamEntrySystem Methods

- `register_student(name, email, password)` - Register a new student
- `authenticate_student(email, password)` - Authenticate a student
- `create_exam(...)` - Create a new exam
- `register_student_for_exam(student_id, exam_id)` - Register student for exam
- `start_exam(student_id, exam_id)` - Start an exam for a student
- `submit_exam(student_id, exam_id, score)` - Submit exam with score
- `ai_proctor_flag(student_id, exam_id, flag_reason)` - Add AI proctoring flag
- `get_student_exams(student_id)` - Get all exams for a student
- `get_exam_participants(exam_id)` - Get all participants for an exam
- `get_analytics()` - Get system-wide analytics

### Data Storage

All data is stored in `exam_system_data.json` in the working directory. The file is automatically created and updated as operations are performed.

### Future Enhancements

- Web interface for easy access
- Deep learning models for automated proctoring
- Real-time video monitoring integration
- Advanced analytics and reporting
- Multi-language support
- Database backend support

### License

MIT License

### Contributing

Contributions are welcome! Please feel free to submit a Pull Request.