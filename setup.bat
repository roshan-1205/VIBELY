@echo off
echo 🛠️  VIBELY - One-Time Setup
echo ================================

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ first.
    echo Visit: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found: 
node --version

echo.
echo 📦 Installing Backend Dependencies...
cd backend
if exist "node_modules" (
    echo ⚠️  Backend dependencies already exist. Skipping...
) else (
    call npm install
    if errorlevel 1 (
        echo ❌ Backend dependency installation failed
        pause
        exit /b 1
    )
    echo ✅ Backend dependencies installed
)
cd ..

echo.
echo 🎨 Installing Frontend Dependencies...
cd frontend
if exist "node_modules" (
    echo ⚠️  Frontend dependencies already exist. Skipping...
) else (
    call npm install --legacy-peer-deps
    if errorlevel 1 (
        echo ❌ Frontend dependency installation failed
        pause
        exit /b 1
    )
    echo ✅ Frontend dependencies installed
)
cd ..

echo.
echo 🎉 Setup Complete!
echo.
echo Next steps:
echo 1. Run 'start-dev.bat' to start the development servers
echo 2. Visit http://localhost:3000 for the frontend
echo 3. Backend API will be available at http://localhost:5000
echo.
pause