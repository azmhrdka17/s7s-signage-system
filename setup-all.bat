@echo off
echo ========================================
echo  S7S Digital Signage System
echo  Installation & Setup
echo ========================================
echo.

echo [1/4] Installing Backend dependencies...
cd /d c:\s7s-signage-system\backend
call npm install
call npx prisma generate
call npx prisma migrate dev --name init
call npm run prisma:seed

echo.
echo [2/4] Installing Frontend Admin dependencies...
cd /d c:\s7s-signage-system\frontend-admin
call npm install

echo.
echo [3/4] Installing Web Player dependencies...
cd /d c:\s7s-signage-system\web-player
call npm install

echo.
echo [4/4] Creating uploads folder...
cd /d c:\s7s-signage-system
if not exist "backend\uploads" mkdir "backend\uploads"

echo.
echo ========================================
echo  Setup Complete!
echo ========================================
echo.
echo  Next steps:
echo  1. Run: start-all.bat
echo  2. Open: http://localhost:3000/admin
echo  3. Open: http://localhost:3000/operator
echo  4. Open: http://localhost:3002 (Player)
echo ========================================
pause
