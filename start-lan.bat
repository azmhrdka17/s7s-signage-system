@echo off
echo ========================================
echo  S7S Digital Signage System (LAN Mode)
echo ========================================
echo.

REM Dapatkan IP Address
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set IP=%%a
    goto :found
)
:found
set IP=%IP:~1%

echo Server IP Address: %IP%
echo.
echo ========================================
echo  FIREWALL CHECK
echo ========================================
echo Pastikan firewall sudah dibuka untuk port:
echo - Port 3001 (Backend API)
echo - Port 3000 (Admin Panel)
echo - Port 3002 (Web Player)
echo.
echo Untuk membuka firewall, jalankan sebagai Administrator:
echo   New-NetFirewallRule -DisplayName "S7S Ports" -Direction Inbound -LocalPort 3000,3001,3002 -Protocol TCP -Action Allow
echo.
echo ========================================
echo  AKSES DARI LAPTOP LAIN
echo ========================================
echo.
echo   Admin Panel:  http://%IP%:3000/admin
echo   Operator:     http://%IP%:3000/operator
echo   Web Player:   http://%IP%:3002
echo.
echo ========================================
pause

echo.
echo [1/3] Starting Backend API...
start "Backend API" cmd /k "cd /d c:\s7s-signage-system\backend && npm run start:dev"
timeout /t 5 /nobreak >nul

echo [2/3] Starting Admin Panel...
start "Admin Panel" cmd /k "cd /d c:\s7s-signage-system\frontend-admin && npm run dev -- -H 0.0.0.0"
timeout /t 5 /nobreak >nul

echo [3/3] Starting Web Player...
start "Web Player" cmd /k "cd /d c:\s7s-signage-system\web-player && npm run dev -- --host 0.0.0.0"
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo  All Services Started!
echo ========================================
echo.
echo Server berjalan di: %IP%
echo.
echo Akses dari laptop lain:
echo   Admin:    http://%IP%:3000/admin
echo   Operator: http://%IP%:3000/operator  
echo   Player:   http://%IP%:3002
echo.
echo ========================================
pause
