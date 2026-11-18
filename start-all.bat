@echo off
echo ========================================
echo  S7S Digital Signage System
echo  Starting All Services...
echo ========================================
echo.

echo [1/3] Starting Backend...
start "Backend" cmd /k "cd /d c:\s7s-signage-system\backend && npm run start:dev"
timeout /t 3 /nobreak >nul

echo [2/3] Starting Admin Frontend...
start "Admin" cmd /k "cd /d c:\s7s-signage-system\frontend-admin && npm run dev"
timeout /t 3 /nobreak >nul

echo [3/3] Starting Web Player...
start "Player" cmd /k "cd /d c:\s7s-signage-system\web-player && npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo  All services started!
echo ========================================
echo  Backend:  http://localhost:3001
echo  Admin:    http://localhost:3000
echo  Player:   http://localhost:3002
echo ========================================
pause
