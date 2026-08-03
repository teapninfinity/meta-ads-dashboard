@echo off
REM Meta Ads Dashboard - Deploy Script for Windows

echo.
echo 🚀 Meta Ads Dashboard - Deploy Script
echo ======================================
echo.

REM ตั้งค่า
set GITHUB_USER=teapninfinity
set REPO_NAME=meta-ads-dashboard
set GITHUB_URL=https://github.com/%GITHUB_USER%/%REPO_NAME%.git

REM ตรวจสอบว่า git ติดตั้งหรือไม่
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git ไม่ได้ติดตั้ง
    echo ดาวน์โหลดจาก: https://git-scm.com/download
    pause
    exit /b 1
)

echo ✅ Git พร้อม
echo.

REM ขั้นตอน 1: Initialize Git
echo 📝 ขั้นตอนที่ 1: Initialize Git Repository
git init
git config user.email "team@pninfinity.com"
git config user.name "PNInfinity Team"

REM ขั้นตอน 2: Add files
echo.
echo 📝 ขั้นตอนที่ 2: Add files
git add .

REM ขั้นตอน 3: Commit
echo.
echo 📝 ขั้นตอนที่ 3: Commit
git commit -m "Initial commit: Meta Ads Dashboard"

REM ขั้นตอน 4: Change branch to main
echo.
echo 📝 ขั้นตอนที่ 4: Setup main branch
git branch -M main

REM ขั้นตอน 5: Add remote
echo.
echo 📝 ขั้นตอนที่ 5: Add remote repository
git remote add origin "%GITHUB_URL%"

REM ขั้นตอน 6: Push to GitHub
echo.
echo 📝 ขั้นตอนที่ 6: Push to GitHub
echo ℹ️  ถ้าถูกถาม username/password:
echo    - Username: %GITHUB_USER%
echo    - Password: [Personal Access Token หรือ password]
echo.

git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ✅ Push สำเร็จ!
    echo.
    echo 🎉 ขั้นตอนต่อไป:
    echo    1. ไปที่ https://railway.app
    echo    2. Sign in ด้วย GitHub
    echo    3. New Project → Deploy from GitHub
    echo    4. เลือก: %GITHUB_USER%/%REPO_NAME%
    echo    5. คลิก Deploy
    echo.
    echo ⏰ รอประมาณ 2-3 นาที...
    echo 📱 Railway จะให้ URL ของคุณ
    echo.
) else (
    echo.
    echo ❌ Push ไม่สำเร็จ
    echo.
    echo 🔧 วิธีแก้:
    echo    1. ตรวจสอบ GitHub username/password
    echo    2. ถ้า 2FA เปิด ต้องใช้ Personal Access Token
    echo       → https://github.com/settings/tokens
    echo    3. สร้าง token → Copy → ใช้เป็น password
    echo.
    pause
    exit /b 1
)

pause
