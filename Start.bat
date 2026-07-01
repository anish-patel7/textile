@echo off
title Textile Design Manager
color 0A
echo.
echo  ==========================================
echo   Textile Design Management System
echo  ==========================================
echo.

:: Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo  ERROR: Node.js is not installed.
    echo  Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

:: Check .env
if not exist "backend\.env" (
    echo  ERROR: backend\.env not found!
    echo  Please copy backend\.env.example to backend\.env
    echo  and fill in your SUPABASE_URL and SUPABASE_SERVICE_KEY
    echo.
    pause
    exit /b 1
)

:: Install backend dependencies if needed
if not exist "backend\node_modules" (
    echo  Installing backend dependencies...
    cd backend
    call npm install --silent
    cd ..
)

:: Install frontend dependencies if needed
if not exist "frontend\node_modules" (
    echo  Installing frontend dependencies...
    cd frontend
    call npm install --silent
    cd ..
)

echo  Starting backend server...
start "Textile-Backend" /min cmd /c "cd backend && node server.js"

echo  Waiting for backend to start...
timeout /t 3 /nobreak >nul

echo  Starting frontend...
start "Textile-Frontend" /min cmd /c "cd frontend && npm run dev"

echo  Waiting for frontend to start...
timeout /t 4 /nobreak >nul

echo  Opening browser...
start http://localhost:3000

echo.
echo  Application is running!
echo  Frontend: http://localhost:3000
echo  Backend:  http://localhost:5000
echo.
echo  Close this window or run Stop.bat to stop the application.
echo.
pause
