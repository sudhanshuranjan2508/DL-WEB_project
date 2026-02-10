# DL-WEB_project

## AI-Powered Exam Entry System with MERN Stack

A comprehensive full-stack application combining **Deep Learning** and **Web Development** using the MERN stack (MongoDB, Express.js, React, Node.js). The system features AI-powered exam management with real-time proctoring capabilities using TensorFlow.js for face detection and behavior monitoring.

## 🚀 Features

### Backend (Node.js/Express + Python)
- **Student Management**: Secure registration and authentication with JWT
- **Exam Scheduling**: Create and manage exams with detailed configurations
- **Exam Registration**: Register students for specific exams
- **Real-time Tracking**: Monitor exam progress and status
- **RESTful API**: Complete API for all operations
- **MongoDB**: Scalable database for data persistence

### Frontend (React + TypeScript)
- **Modern UI**: React with TypeScript for type safety
- **AI Proctoring**: Real-time face detection using TensorFlow.js
- **Webcam Integration**: Live monitoring during exams
- **Responsive Design**: Works on desktop and mobile devices
- **Dashboard**: Comprehensive analytics and reporting

### AI/Deep Learning Features
- **Face Detection**: TensorFlow.js MediaPipe FaceMesh model
- **Multiple Face Detection**: Alerts when multiple people detected
- **Attention Monitoring**: Detects when student looks away
- **Distance Monitoring**: Checks if student is too far from camera
- **Behavior Flagging**: Automatic severity-based warnings

### Python Microservice
- **Legacy Support**: Original Python exam system available as microservice
- **PBKDF2 Security**: Secure password hashing with salts
- **Data Validation**: Comprehensive input validation

## 📋 Prerequisites

- **Node.js** 14.x or higher
- **MongoDB** 4.x or higher (local or cloud)
- **Python** 3.7+ (for Python microservice)
- **npm** or **yarn**

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/sudhanshuranjan2508/DL-WEB_project.git
cd DL-WEB_project
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env file with your MongoDB connection string
# MONGO_URI=mongodb://localhost:27017/ai_exam_system
# JWT_SECRET=your_secret_key_here
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file (optional)
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
```

### 4. MongoDB Setup

Option A: Local MongoDB
```bash
# Install MongoDB Community Edition
# https://docs.mongodb.com/manual/installation/

# Start MongoDB
mongod
```

Option B: MongoDB Atlas (Cloud)
```bash
# Create free account at https://www.mongodb.com/cloud/atlas
# Get connection string and update .env file
```

## 🚀 Running the Application

### Start Backend Server

```bash
cd backend
npm start

# Or with auto-reload during development
npm run dev
```

Server will run on `http://localhost:5000`

### Start Frontend Application

```bash
cd frontend
npm start
```

Application will open at `http://localhost:3000`

### Run Python Microservice (Optional)

```bash
# From root directory
python3 ai_exam_entry_system.py
```

## 📚 API Documentation

### Authentication Endpoints

#### Register Student
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

### Exam Endpoints

#### Get All Exams
```http
GET /api/exams
Authorization: Bearer <token>
```

#### Create Exam
```http
POST /api/exams
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Machine Learning Fundamentals",
  "description": "Final exam covering ML basics",
  "duration": 120,
  "maxScore": 100,
  "scheduledTime": "2026-02-15T10:00:00Z",
  "questions": [
    {
      "question": "What is supervised learning?",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correctAnswer": 0,
      "points": 10
    }
  ]
}
```

#### Register for Exam
```http
POST /api/exams/:examId/register
Authorization: Bearer <token>
```

#### Start Exam
```http
POST /api/exams/:examId/start
Authorization: Bearer <token>
```

#### Submit Exam
```http
POST /api/exams/:examId/submit
Authorization: Bearer <token>
Content-Type: application/json

{
  "answers": [
    { "selectedAnswer": 0 },
    { "selectedAnswer": 2 }
  ]
}
```

### AI Proctoring Endpoints

#### Add Proctoring Flag
```http
POST /api/proctor/flag
Authorization: Bearer <token>
Content-Type: application/json

{
  "examId": "exam_id_here",
  "reason": "Multiple faces detected",
  "severity": "high"
}
```

#### Get Proctoring Flags
```http
GET /api/proctor/:examId
Authorization: Bearer <token>
```

### Analytics Endpoints

#### Get System Analytics
```http
GET /api/analytics
Authorization: Bearer <token>
```

#### Get Exam Statistics
```http
GET /api/analytics/exam/:examId
Authorization: Bearer <token>
```

## 🏗️ Project Structure

```
DL-WEB_project/
├── backend/                      # Node.js/Express Backend
│   ├── controllers/              # Route controllers
│   │   ├── authController.js
│   │   ├── examController.js
│   │   ├── proctorController.js
│   │   └── analyticsController.js
│   ├── models/                   # MongoDB models
│   │   ├── Student.js
│   │   ├── Exam.js
│   │   └── ExamEntry.js
│   ├── routes/                   # API routes
│   │   ├── auth.js
│   │   ├── exams.js
│   │   ├── proctor.js
│   │   └── analytics.js
│   ├── middleware/               # Custom middleware
│   │   └── auth.js
│   ├── server.js                 # Express app entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/                     # React Frontend
│   ├── src/
│   │   ├── components/           # Reusable components
│   │   ├── pages/                # Page components
│   │   ├── services/             # API and AI services
│   │   │   ├── api.ts           # API client
│   │   │   └── aiProctor.ts     # TensorFlow.js service
│   │   ├── contexts/             # React contexts
│   │   ├── utils/                # Utility functions
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
│
├── ai_exam_entry_system.py      # Python microservice
├── requirements.txt              # Python dependencies
├── README.md
└── .gitignore
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for Node.js, PBKDF2-HMAC for Python
- **Input Validation**: Comprehensive validation on all endpoints
- **CORS Protection**: Configurable CORS policies
- **Rate Limiting**: (Can be added) Protect against brute force attacks
- **Secure Headers**: HTTP security headers

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Python tests
python3 ai_exam_entry_system.py
```

## 🎯 Deep Learning Integration

The application uses **TensorFlow.js** for client-side machine learning:

1. **Face Detection**: MediaPipe FaceMesh model detects facial landmarks
2. **Behavior Analysis**: Analyzes face position, orientation, and count
3. **Real-time Monitoring**: Processes video frames during exam
4. **Automatic Flagging**: Sends warnings to backend for review

## 🌟 Future Enhancements

- [ ] Emotion detection using deep learning models
- [ ] Object detection (phone, book detection)
- [ ] Eye tracking for attention monitoring
- [ ] Audio analysis for suspicious sounds
- [ ] Screen recording capabilities
- [ ] Mobile app (React Native)
- [ ] Admin dashboard
- [ ] Email notifications
- [ ] PDF report generation
- [ ] Multi-language support

## 📖 Technology Stack

### Frontend
- React 18 with TypeScript
- TensorFlow.js for ML
- Axios for API calls
- React Router for navigation

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- bcrypt for password hashing

### Deep Learning
- TensorFlow.js
- MediaPipe FaceMesh model
- Real-time video processing

### Python Microservice
- Python 3.7+
- Standard library only
- PBKDF2-HMAC password hashing

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

MIT License - see LICENSE file for details

## 👥 Authors

- Sudhanshu Ranjan

## 🙏 Acknowledgments

- TensorFlow.js team for amazing ML tools
- MongoDB team for excellent database
- React team for the best frontend library
- Express.js for simple backend framework

---

**Note**: This project demonstrates the integration of Deep Learning with Web Development, perfect for learning MERN stack with AI capabilities!

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