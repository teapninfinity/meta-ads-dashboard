# 🚀 Deploy Instructions สำหรับ teapninfinity

## เลือก 1 วิธี:

---

## ✅ **วิธี 1: Windows (ง่ายสุด)**

### เปิด PowerShell/Command Prompt แล้ว:

```bash
cd D:\สรุปประชุม RESCALE\meta-ads-dashboard

# Windows users:
DEPLOY_SCRIPT.bat
```

จากนั้น:
- ใส่ **GitHub password** (หรือ Personal Access Token ถ้า 2FA เปิด)
- รอให้ push สำเร็จ

---

## ✅ **วิธี 2: Manual (Step-by-Step)**

```bash
# 1. ไปที่โฟลเดอร์
cd D:\สรุปประชุม RESCALE\meta-ads-dashboard

# 2. Initialize Git
git init
git config user.email "team@pninfinity.com"
git config user.name "PNInfinity Team"

# 3. Add files
git add .

# 4. Commit
git commit -m "Initial commit: Meta Ads Dashboard"

# 5. Setup main branch
git branch -M main

# 6. Add remote
git remote add origin https://github.com/teapninfinity/meta-ads-dashboard.git

# 7. Push to GitHub
git push -u origin main
```

**ถ้าถูกถาม username/password:**
- Username: `teapninfinity`
- Password: [GitHub password หรือ Personal Access Token]

---

## 🔑 ถ้า 2FA เปิด:

1. ไปที่ https://github.com/settings/tokens
2. Click **Generate new token (classic)**
3. ใส่ Name: `meta-ads-deployment`
4. เลือก scope: `repo`
5. Click **Generate token**
6. Copy token → ใช้เป็น password

---

## ✅ หลังจาก Push สำเร็จ:

```
✅ Push สำเร็จ!

🎉 ขั้นตอนต่อไป:
   1. ไปที่ https://railway.app
   2. Sign in ด้วย GitHub
   3. Click "New Project"
   4. Select "Deploy from GitHub repo"
   5. เลือก: teapninfinity/meta-ads-dashboard
   6. Click "Deploy"

⏰ รอประมาณ 2-3 นาที
📱 Railway จะให้ URL ของคุณ
```

---

## 🎯 Railway Configuration (Auto):

Railway จะ auto detect:
```
✅ Node.js runtime
✅ npm install
✅ npm start
✅ PORT from environment
```

ไม่ต้องตั้งค่าอะไรเพิ่มเติม!

---

## 📱 ได้ URL แล้ว:

Railway จะให้ URL เช่น:
```
https://meta-ads-dashboard-prod-xxxxx.railway.app
```

**แชร์ URL นี้กับทีม!** 🎉

---

## 🆘 Troubleshooting:

### ❌ "fatal: could not read Username"
**วิธีแก้:**
- ปิด Terminal
- เปิดใหม่
- รันคำสั่ง git push อีกครั้ง

### ❌ "remote repository not found"
**วิธีแก้:**
```bash
git remote remove origin
git remote add origin https://github.com/teapninfinity/meta-ads-dashboard.git
git push -u origin main
```

### ❌ "Repository already exists"
**วิธีแก้:**
```bash
rm -r .git
# แล้วเริ่มใหม่
```

---

## ✅ เสร็จแล้ว!

URL → https://your-railway-url.railway.app  
ทีม → เข้าได้ทั้งหมด  
ข้อมูล → บันทึกใน local  

**ไม่ต้องติดตั้งอะไรเพิ่มเติม!** 🚀
