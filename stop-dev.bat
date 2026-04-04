@echo off
echo 🛑 Stopping Vibely Development Environment...

REM Kill processes running on ports 3000 and 5000
echo 🔍 Finding processes on ports 3000 and 5000...

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    echo 🔄 Stopping process on port 3000 (PID: %%a)
    taskkill /PID %%a /F >nul 2>&1
)

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do (
    echo 🔄 Stopping process on port 5000 (PID: %%a)
    taskkill /PID %%a /F >nul 2>&1
)

REM Close any cmd windows with Vibely in the title
taskkill /FI "WINDOWTITLE eq Vibely*" /F >nul 2>&1

echo ✅ Development servers stopped
echo.
pause