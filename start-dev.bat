@echo off
echo 🚀 Starting Vibely Development Environment...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ first.
    pause
    exit /b 1
)

REM Check if ports are available
echo 🔍 Checking if ports are available...
netstat -ano | findstr :3000 >nul 2>&1
if not errorlevel 1 (
    echo ⚠️  Port 3000 is already in use. Please close the application using it.
    echo Press any key to continue anyway...
    pause >nul
)

netstat -ano | findstr :5001 >nul 2>&1
if not errorlevel 1 (
    echo ⚠️  Port 5001 is already in use. Please close the application using it.
    echo Press any key to continue anyway...
    pause >nul
)

echo 📦 Starting Backend Server...
cd backend

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📥 Installing backend dependencies...
    call npm install
) else (
    echo ✅ Backend dependencies already installed
)

REM Start backend in development mode
echo 🔄 Starting backend server...
start "Vibely Backend" cmd /k "npm run dev"
if errorlevel 1 (
    echo ❌ Failed to start backend server
    pause
    exit /b 1
)

echo ✅ Backend started
cd ..

timeout /t 3 /nobreak >nul

echo 🎨 Starting Frontend Server...
cd frontend

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📥 Installing frontend dependencies...
    call npm install --legacy-peer-deps
) else (
    echo ✅ Frontend dependencies already installed
)

REM Start frontend in development mode
echo 🔄 Starting frontend server...
start "Vibely Frontend" cmd /k "npm run dev"
if errorlevel 1 (
    echo ❌ Failed to start frontend server
    pause
    exit /b 1
)

echo ✅ Frontend started
cd ..

echo.
echo 🎉 Vibely Development Environment Started!
echo.
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend:  http://localhost:5001
echo 📊 API Docs: http://localhost:5001/api/health
echo.
echo Press any key to exit...
pause >nul