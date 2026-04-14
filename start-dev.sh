#!/bin/bash

echo "🚀 Starting Vibely Development Environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check if ports are available
echo "🔍 Checking if ports are available..."
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 3000 is already in use. Please close the application using it."
    read -p "Press Enter to continue anyway..."
fi

if lsof -Pi :5001 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 5001 is already in use. Please close the application using it."
    read -p "Press Enter to continue anyway..."
fi

echo "📦 Starting Backend Server..."
cd backend

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📥 Installing backend dependencies..."
    npm install
else
    echo "✅ Backend dependencies already installed"
fi

# Start backend in development mode
echo "🔄 Starting backend server..."
if command -v gnome-terminal &> /dev/null; then
    gnome-terminal --title="Vibely Backend" -- bash -c "npm run dev; exec bash"
elif command -v osascript &> /dev/null; then
    osascript -e 'tell app "Terminal" to do script "cd \"'$(pwd)'\" && npm run dev"'
else
    npm run dev &
fi

echo "✅ Backend started"
cd ..

sleep 3

echo "🎨 Starting Frontend Server..."
cd frontend

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📥 Installing frontend dependencies..."
    npm install --legacy-peer-deps
else
    echo "✅ Frontend dependencies already installed"
fi

# Start frontend in development mode
echo "🔄 Starting frontend server..."
if command -v gnome-terminal &> /dev/null; then
    gnome-terminal --title="Vibely Frontend" -- bash -c "npm run dev; exec bash"
elif command -v osascript &> /dev/null; then
    osascript -e 'tell app "Terminal" to do script "cd \"'$(pwd)'\" && npm run dev"'
else
    npm run dev &
fi

echo "✅ Frontend started"
cd ..

echo ""
echo "🎉 Vibely Development Environment Started!"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:5001"
echo "📊 API Docs: http://localhost:5001/api/health"
echo ""
echo "Press Ctrl+C to stop the servers"

# Keep script running
wait