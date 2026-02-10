#!/bin/bash

# AI Exam Entry System - Setup Script

echo "=================================="
echo "AI Exam Entry System Setup"
echo "=================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 14+ first."
    exit 1
fi

echo "✓ Node.js version: $(node --version)"

# Check MongoDB
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB not found locally. You can use MongoDB Atlas cloud database."
fi

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Backend installation failed"
    exit 1
fi
echo "✓ Backend dependencies installed"

# Setup backend .env
if [ ! -f .env ]; then
    echo "📝 Creating backend .env file..."
    cp .env.example .env
    echo "✓ Created .env file. Please update with your MongoDB URI and JWT secret."
fi

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Frontend installation failed"
    exit 1
fi
echo "✓ Frontend dependencies installed"

# Setup frontend .env
if [ ! -f .env ]; then
    echo "📝 Creating frontend .env file..."
    cp .env.example .env
    echo "✓ Created frontend .env file"
fi

echo ""
echo "=================================="
echo "✓ Setup Complete!"
echo "=================================="
echo ""
echo "Next steps:"
echo "1. Update backend/.env with your MongoDB URI"
echo "2. Start MongoDB (if using local): mongod"
echo "3. Start backend: cd backend && npm start"
echo "4. Start frontend: cd frontend && npm start"
echo ""
echo "Or use the convenience script:"
echo "  npm run backend   # Start backend only"
echo "  npm run frontend  # Start frontend only"
echo ""
echo "Visit http://localhost:3000 to see the application!"
echo "=================================="
