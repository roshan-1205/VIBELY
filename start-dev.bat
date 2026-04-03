@echo off
echo 🚀 Starting Vibely Development Environment...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ first.
    pause
    exit /b 1
)

echo 📦 Starting Backend Server...
cd backend

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📥 Installing backend dependencies...
    call npm install
)

REM Start backend in development mode
start "Vibely Backend" cmd /k "npm run dev"

echo ✅ Backend started
cd ..

timeout /t 3 /nobreak >nul

echo 🎨 Starting Frontend Server...
cd frontend

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📥 Installing frontend dependencies...
    call npm install
)

REM Start frontend in development mode
start "Vibely Frontend" cmd /k "npm run dev"

echo ✅ Frontend started
cd ..

echo.
echo 🎉 Vibely Development Environment Started!
echo.
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend:  http://localhost:5000
echo 📊 API Docs: http://localhost:5000/api/health
echo.
echo Press any key to exit...
pause >nul