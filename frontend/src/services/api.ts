import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  
  getProfile: () =>
    api.get('/auth/profile'),
};

// Exam API
export const examAPI = {
  getAllExams: () =>
    api.get('/exams'),
  
  getExam: (id: string) =>
    api.get(`/exams/${id}`),
  
  getMyExams: () =>
    api.get('/exams/my-exams'),
  
  createExam: (data: any) =>
    api.post('/exams', data),
  
  registerForExam: (examId: string) =>
    api.post(`/exams/${examId}/register`),
  
  startExam: (examId: string) =>
    api.post(`/exams/${examId}/start`),
  
  submitExam: (examId: string, answers: any[]) =>
    api.post(`/exams/${examId}/submit`, { answers }),
};

// Proctor API
export const proctorAPI = {
  addFlag: (data: { examId: string; reason: string; severity: string }) =>
    api.post('/proctor/flag', data),
  
  getFlags: (examId: string) =>
    api.get(`/proctor/${examId}`),
};

// Analytics API
export const analyticsAPI = {
  getAnalytics: () =>
    api.get('/analytics'),
  
  getExamStats: (examId: string) =>
    api.get(`/analytics/exam/${examId}`),
};

export default api;
