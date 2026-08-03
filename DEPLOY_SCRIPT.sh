#!/bin/bash

# Meta Ads Dashboard - Auto Deploy Script
# ใช้งาน: bash DEPLOY_SCRIPT.sh

echo "🚀 Meta Ads Dashboard - Deploy Script"
echo "======================================"

# ตั้งค่า
GITHUB_USER="teapninfinity"
REPO_NAME="meta-ads-dashboard"
GITHUB_URL="https://github.com/${GITHUB_USER}/${REPO_NAME}.git"

# ตรวจสอบว่า git ติดตั้งหรือไม่
if ! command -v git &> /dev/null; then
    echo "❌ Git ไม่ได้ติดตั้ง ดาวน์โหลดจาก: https://git-scm.com/download"
    exit 1
fi

echo ""
echo "✅ Git พร้อม"
echo ""

# ขั้นตอน 1: Initialize Git
echo "📝 ขั้นตอนที่ 1: Initialize Git Repository"
git init
git config user.email "team@pninfinity.com"
git config user.name "PNInfinity Team"

# ขั้นตอน 2: Add files
echo ""
echo "📝 ขั้นตอนที่ 2: Add files"
git add .

# ขั้นตอน 3: Commit
echo ""
echo "📝 ขั้นตอนที่ 3: Commit"
git commit -m "Initial commit: Meta Ads Dashboard"

# ขั้นตอน 4: Change branch to main
echo ""
echo "📝 ขั้นตอนที่ 4: Setup main branch"
git branch -M main

# ขั้นตอน 5: Add remote
echo ""
echo "📝 ขั้นตอนที่ 5: Add remote repository"
git remote add origin "$GITHUB_URL"

# ขั้นตอน 6: Push to GitHub
echo ""
echo "📝 ขั้นตอนที่ 6: Push to GitHub"
echo "ℹ️  ถ้าถูกถาม username/password:"
echo "   - Username: ${GITHUB_USER}"
echo "   - Password: [Personal Access Token หรือ password]"
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Push สำเร็จ!"
    echo ""
    echo "🎉 ขั้นตอนต่อไป:"
    echo "   1. ไปที่ https://railway.app"
    echo "   2. Sign in ด้วย GitHub"
    echo "   3. New Project → Deploy from GitHub"
    echo "   4. เลือก: ${GITHUB_USER}/${REPO_NAME}"
    echo "   5. คลิก Deploy"
    echo ""
    echo "⏰ รอประมาณ 2-3 นาที..."
    echo "📱 Railway จะให้ URL ของคุณ"
    echo ""
else
    echo ""
    echo "❌ Push ไม่สำเร็จ"
    echo ""
    echo "🔧 วิธีแก้:"
    echo "   1. ตรวจสอบ GitHub username/password"
    echo "   2. ถ้า 2FA เปิด ต้องใช้ Personal Access Token"
    echo "      → https://github.com/settings/tokens"
    echo "   3. สร้าง token → Copy → ใช้เป็น password"
    exit 1
fi
