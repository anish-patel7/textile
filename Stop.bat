@echo off
title Stop Textile Design Manager
echo.
echo  Stopping Textile Design Manager...
echo.

:: Kill node processes running our servers
for /f "tokens=5" %%a in ('netstat -aon ^| find ":5000" ^| find "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do taskkill /F /PID %%a >nul 2>&1

:: Close titled windows
taskkill /FI "WINDOWTITLE eq Textile-Backend" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Textile-Frontend" /F >nul 2>&1

echo  Servers stopped.
echo.
timeout /t 2 /nobreak >nul
