# AI-Powered Exam Entry System - MERN Stack Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Browser                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │            React Frontend (TypeScript)                 │ │
│  │  • Student Dashboard                                   │ │
│  │  • Exam Interface                                      │ │
│  │  • Real-time AI Proctoring (TensorFlow.js)           │ │
│  │  • Webcam Integration                                  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST API
                            │ (Axios)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Express.js Backend                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  REST API Endpoints                                    │ │
│  │  • /api/auth      - Authentication (JWT)              │ │
│  │  • /api/exams     - Exam Management                    │ │
│  │  • /api/proctor   - AI Proctoring Flags              │ │
│  │  • /api/analytics - Statistics & Reports              │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Business Logic                                        │ │
│  │  • Authentication & Authorization                      │ │
│  │  • Exam Workflow Management                           │ │
│  │  • Score Calculation                                   │ │
│  │  • Proctoring Flag Processing                         │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Mongoose ODM
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      MongoDB Database                        │
│  ┌───────────────┐  ┌───────────────┐  ┌─────────────────┐ │
│  │   Students    │  │     Exams     │  │   ExamEntries   │ │
│  │               │  │               │  │                 │ │
│  │ • _id         │  │ • _id         │  │ • student ref   │ │
│  │ • name        │  │ • title       │  │ • exam ref      │ │
│  │ • email       │  │ • questions   │  │ • score         │ │
│  │ • password    │  │ • maxScore    │  │ • flags[]       │ │
│  │ • status      │  │ • duration    │  │ • status        │ │
│  └───────────────┘  └───────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              Python Microservice (Optional)                  │
│  • Legacy Python exam system                                │
│  • PBKDF2-HMAC password hashing                            │
│  • JSON file storage                                        │
│  • Can be integrated via HTTP bridge                       │
└─────────────────────────────────────────────────────────────┘
```

## Deep Learning Integration

### TensorFlow.js on Client Side

```
Webcam Feed
     │
     ▼
┌────────────────────────┐
│ TensorFlow.js Model    │
│ (MediaPipe FaceMesh)   │
└────────────────────────┘
     │
     ├─► Face Detection
     ├─► Multiple Face Check
     ├─► Position Analysis
     └─► Distance Estimation
     │
     ▼
┌────────────────────────┐
│ Behavior Analysis      │
│ • Face count           │
│ • Attention level      │
│ • Distance from camera │
└────────────────────────┘
     │
     ▼
┌────────────────────────┐
│ Flag Generation        │
│ (if suspicious)        │
└────────────────────────┘
     │
     ▼ Send to Backend
┌────────────────────────┐
│ Store in Database      │
│ • Timestamp            │
│ • Reason               │
│ • Severity             │
└────────────────────────┘
```

## Data Flow

### 1. Student Registration
```
Student → Frontend → POST /api/auth/register → Backend
                                              → Hash Password (bcrypt)
                                              → Save to MongoDB
                                              → Return JWT Token
```

### 2. Exam Taking Workflow
```
1. Student logs in → Receives JWT token
2. Browse exams → GET /api/exams
3. Register for exam → POST /api/exams/:id/register
4. Start exam → POST /api/exams/:id/start
   ├─► Start timer
   ├─► Initialize webcam
   └─► Start AI proctoring
5. During exam:
   ├─► TensorFlow.js monitors face
   ├─► Detects suspicious behavior
   └─► Sends flags → POST /api/proctor/flag
6. Submit exam → POST /api/exams/:id/submit
   ├─► Calculate score
   ├─► Save results
   └─► Return score
```

### 3. Analytics
```
Admin/Student → GET /api/analytics
              → Aggregate data from MongoDB
              → Return statistics
```

## Security Layers

1. **Authentication**: JWT tokens with expiration
2. **Password Hashing**: bcrypt (Node.js) / PBKDF2-HMAC (Python)
3. **Input Validation**: All endpoints validate input
4. **CORS**: Configured for specific origins
5. **Status Checks**: Active/Inactive/Suspended users
6. **Score Validation**: Min/Max bounds checked

## Scalability Features

- **Stateless Backend**: Can scale horizontally
- **MongoDB**: Handles millions of documents
- **Client-side ML**: Reduces server load
- **REST API**: Easy to add microservices
- **TypeScript**: Better code maintainability

## Technology Choices

| Component | Technology | Why? |
|-----------|-----------|------|
| Frontend | React + TypeScript | Type safety, component reuse |
| Backend | Node.js + Express | Fast, JavaScript everywhere |
| Database | MongoDB | Flexible schema, scalable |
| Auth | JWT | Stateless, scalable |
| ML | TensorFlow.js | Client-side, no GPU needed |
| Password | bcrypt/PBKDF2 | Industry standard security |

## Deployment Recommendations

### Development
- Frontend: `npm start` (localhost:3000)
- Backend: `npm start` (localhost:5000)
- MongoDB: Local or Atlas

### Production
- Frontend: Vercel, Netlify, or AWS S3 + CloudFront
- Backend: Heroku, AWS EC2, or DigitalOcean
- Database: MongoDB Atlas (managed)
- CI/CD: GitHub Actions

## Performance Optimizations

1. **Lazy Loading**: React components load on demand
2. **Image Optimization**: Compress webcam frames
3. **Debouncing**: Limit API calls during proctoring
4. **Caching**: Cache exam data in frontend
5. **Indexing**: MongoDB indexes on frequently queried fields
6. **Connection Pooling**: Mongoose connection pool

## Future Deep Learning Enhancements

1. **Emotion Detection**: Classify student emotions
2. **Object Detection**: Detect phones, books, other people
3. **Eye Tracking**: Monitor where student is looking
4. **Audio Analysis**: Detect suspicious sounds
5. **Gesture Recognition**: Detect cheating gestures
6. **Custom Models**: Train on institution-specific data
