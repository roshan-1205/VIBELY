@echo off
echo ========================================
echo VIBELY SETUP - COMPLETE INSTALLATION
echo ========================================
echo.

echo This script will:
echo - Install all dependencies
echo - Set up media upload system
echo - Create necessary directories
echo - Start both servers
echo.

set /p choice="Continue with setup? (y/n): "
if /i "%choice%" neq "y" goto :end

echo.
echo ========================================
echo STEP 1: BACKEND SETUP
echo ========================================
echo.

echo Installing backend dependencies...
cd backend
if not exist "node_modules" (
    echo Running npm install...
    npm install
) else (
    echo Dependencies already installed
)

echo.
echo Installing multer for file uploads...
npm install multer@^1.4.5-lts.1

echo.
echo Creating upload directories...
if not exist "uploads" mkdir "uploads"
if not exist "uploads\images" mkdir "uploads\images"
if not exist "uploads\videos" mkdir "uploads\videos"
if not exist "uploads\thumbnails" mkdir "uploads\thumbnails"

echo ✅ Backend setup complete
cd ..

echo.
echo ========================================
echo STEP 2: FRONTEND SETUP
echo ========================================
echo.

echo Installing frontend dependencies...
cd frontend
if not exist "node_modules" (
    echo Running npm install...
    npm install
) else (
    echo Dependencies already installed
)

echo ✅ Frontend setup complete
cd ..

echo.
echo ========================================
echo STEP 3: CREATING TEST FILES
echo ========================================
echo.

echo Creating test image...
node create-test-image.js

echo.
echo ========================================
echo STEP 4: ENVIRONMENT CHECK
echo ========================================
echo.

echo Checking backend configuration...
findstr /C:"app.use('/uploads'" backend\server.js >nul
if %errorlevel%==0 (
    echo ✅ Static file serving configured
) else (
    echo ❌ Static file serving not configured
)

echo.
echo Checking upload directories...
if exist "backend\uploads\images" (
    echo ✅ Images directory exists
) else (
    echo ❌ Images directory missing
)

if exist "backend\uploads\videos" (
    echo ✅ Videos directory exists
) else (
    echo ❌ Videos directory missing
)

echo.
echo ========================================
echo STEP 5: STARTING SERVERS
echo ========================================
echo.

echo Starting backend server...
start "VIBELY Backend" cmd /k "cd backend && npm run dev"

echo Waiting for backend to start...
timeout /t 3 /nobreak >nul

echo Starting frontend server...
start "VIBELY Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo SETUP COMPLETE!
echo ========================================
echo.
echo ✅ Backend server: http://localhost:5000
echo ✅ Frontend server: http://localhost:3000
echo ✅ Media upload system ready
echo.
echo FEATURES AVAILABLE:
echo - Real-time image and video uploads
echo - Full media display in post cards
echo - File validation and error handling
echo - Drag and drop support
echo - Progress indicators
echo.
echo TESTING:
echo 1. Go to: http://localhost:3000
echo 2. Create a post with images/videos
echo 3. Images should display directly in posts
echo.
echo TROUBLESHOOTING:
echo - If images don't load: Check browser console
echo - If upload fails: Check file size (max 50MB)
echo - If servers don't start: Check ports 3000/5000
echo.
echo Both servers are now running in separate windows.
echo Close those windows to stop the servers.
echo.

:end
echo Press any key to exit...
pause >nul