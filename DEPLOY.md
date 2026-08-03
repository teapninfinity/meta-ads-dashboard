# 🚀 Deploy Meta Ads Dashboard สำหรับทีม

## ตัวเลือก Deploy (เลือก 1 อัน)

### ✅ ที่แนะนำ: Railway.app (ง่ายที่สุด)

#### ขั้นตอน:

**1. สร้างบัญชี Railway**
- ไปที่ https://railway.app
- สมัครด้วย GitHub / Google

**2. Connect GitHub**
```
1. Push project ขึ้น GitHub
   cd meta-ads-dashboard
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_GITHUB/meta-ads-dashboard.git
   git branch -M main
   git push -u origin main

2. ใน Railway: New → GitHub Repo → เลือก meta-ads-dashboard
```

**3. Configure Environment**
- Railway จะ auto detect `package.json`
- ตั้งค่า PORT (ปล่อยให้ auto)
- Deploy → คำสั่งจะรัน `npm install && npm start`

**4. Get URL**
```
https://meta-ads-dashboard-prod-xxxxxx.railway.app
```

---

### 🔵 ตัวเลือก 2: Render.com

#### ขั้นตอน:

**1. สมัครที่ https://render.com**

**2. สร้าง Web Service**
```
Dashboard → New → Web Service
→ Connect GitHub repo
→ Environment: Node
→ Build: npm install
→ Start: npm start
```

**3. ตั้งค่า Environment Variables**
```
PORT=3000
NODE_ENV=production
```

**4. Deploy**
- Render จะ auto deploy เมื่อ push ขึ้น GitHub

---

### 🟢 ตัวเลือก 3: Fly.io

```bash
# Install Fly CLI
# https://fly.io/docs/getting-started/installing-flyctl/

# ใน project directory:
flyctl launch

# ตั้งค่า app name เป็น meta-ads-dashboard
# Deploy:
flyctl deploy
```

---

## 📋 ก่อน Deploy ต้องทำ:

### 1. สร้างไฟล์ `.env.production`
```
PORT=3000
NODE_ENV=production
```

### 2. ตรวจสอบ `package.json` (backend)
```json
{
  "name": "meta-ads-dashboard-backend",
  "version": "1.0.0",
  "engines": {
    "node": "18.x"
  },
  "scripts": {
    "start": "node server.js"
  }
}
```

### 3. แก้ไข `backend/server.js` ให้อ่าน PORT จาก environment
```javascript
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
```

---

## 🌐 URL สำหรับทีม

Deploy สำเร็จ → ได้ URL เช่น:

```
https://meta-ads-dashboard-prod.railway.app
https://meta-ads-dashboard.onrender.com
https://meta-ads-dashboard.fly.dev
```

**แชร์ URL นี้กับทีม** 👥

---

## 🔐 ใช้งาน:

### ทีมใหม่ ใส่ API Credentials:
1. เข้า https://your-app-url
2. คลิก ⚙️ ตั้งค่า
3. ใส่:
   - **Meta Access Token** (ได้จาก Meta Business)
   - **Ad Account ID** (เช่น `act_123456789`)
4. คลิก 💾 บันทึก

ข้อมูลบันทึกใน browser (LocalStorage) ของแต่ละคน

---

## 📱 ใช้งานจากอุปกรณ์อื่น:

- 💻 Desktop: เข้าผ่าน URL เดียวกัน
- 📱 Mobile: เข้าผ่าน URL เดียวกัน
- 🔒 Private: หากต้องการให้ Private ให้ใช้ Authentication (เพิ่มเติม)

---

## ⚠️ Important Notes

### ข้อมูล Credentials:
- ✅ Token, Account ID บันทึกใน **Local Browser** (ไม่ส่งขึ้น Server)
- ✅ ปลอดภัยสำหรับทีม

### Data Refresh:
- ⏰ ต้อง integrate Meta API (ดู README.md)
- 📊 ปัจจุบัน: Sample Data

### Scaling:
- 🟢 Railway Free: OK สำหรับ 10-50 คนในทีม
- 🔵 Render Free: OK สำหรับ 5-20 คน
- 🟡 Fly.io Free: OK สำหรับ 20-100 คน

---

## 🛠️ Troubleshooting

### ❌ Error: Cannot find module
```
Solution: ตรวจสอบ package.json มีครบหรือไม่
Deploy ใหม่ → Platform จะรัน npm install
```

### ❌ Port conflict
```
Solution: ใช้ process.env.PORT (auto assign)
```

### ❌ Settings ไม่บันทึก
```
Solution: ทำการ refresh page → ข้อมูลในทีมแต่ละคนบันทึก local
```

---

## 📞 Support

มีปัญหา? ลองสิ่งนี้:

1. ตรวจสอบ Console (F12) → Errors?
2. ตรวจสอบ Platform Logs (Railway/Render)
3. `npm test` ในเครื่อง
4. ดู README.md สำหรับรายละเอียด

---

**🎉 Deploy สำเร็จ = ทีมใช้งานได้เลย!**
