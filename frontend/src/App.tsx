import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>🎓 AI-Powered Exam Entry System</h1>
        <p className="subtitle">MERN Stack + Deep Learning Integration</p>
        
        <div className="features-grid">
          <div className="feature-card">
            <h3>📚 Exam Management</h3>
            <p>Create, schedule, and manage exams with ease</p>
          </div>
          
          <div className="feature-card">
            <h3>🤖 AI Proctoring</h3>
            <p>Real-time face detection using TensorFlow.js</p>
          </div>
          
          <div className="feature-card">
            <h3>📊 Analytics</h3>
            <p>Comprehensive dashboards and reporting</p>
          </div>
          
          <div className="feature-card">
            <h3>🔒 Secure Auth</h3>
            <p>JWT-based authentication with bcrypt</p>
          </div>
        </div>

        <div className="tech-stack">
          <h2>Technology Stack</h2>
          <div className="tech-badges">
            <span className="badge">MongoDB</span>
            <span className="badge">Express.js</span>
            <span className="badge">React</span>
            <span className="badge">Node.js</span>
            <span className="badge">TensorFlow.js</span>
            <span className="badge">TypeScript</span>
          </div>
        </div>

        <div className="getting-started">
          <h3>Getting Started</h3>
          <div className="commands">
            <div className="command-box">
              <h4>Backend</h4>
              <code>cd backend && npm install && npm start</code>
            </div>
            <div className="command-box">
              <h4>Frontend</h4>
              <code>cd frontend && npm install && npm start</code>
            </div>
          </div>
        </div>

        <div className="status-indicator">
          <div className="status-item">
            <span className="status-dot"></span>
            <span>Backend API: http://localhost:5000</span>
          </div>
          <div className="status-item">
            <span className="status-dot"></span>
            <span>Frontend: http://localhost:3000</span>
          </div>
        </div>

        <footer className="App-footer">
          <p>Built with ❤️ combining Deep Learning & Web Development</p>
          <a 
            href="https://github.com/sudhanshuranjan2508/DL-WEB_project"
            target="_blank"
            rel="noopener noreferrer"
            className="github-link"
          >
            View on GitHub
          </a>
        </footer>
      </header>
    </div>
  );
}

export default App;

