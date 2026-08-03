# ⚡ Quick Start - Deploy ใน 5 นาที

## 🎯 โลกของคุณ: Deploy ไป Railway.app

### Step 1: Push ขึ้น GitHub (1 นาที)

```bash
cd meta-ads-dashboard

# Initialize git
git init
git add .
git commit -m "Initial commit: Meta Ads Dashboard"

# เปลี่ยน YOUR_USERNAME กับ YOUR_REPO_NAME
git remote add origin https://github.com/YOUR_USERNAME/meta-ads-dashboard.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy ไป Railway (2 นาที)

1. **เข้า** https://railway.app
2. **สมัครด้วย GitHub** 
3. **คลิก** `New Project` → `Deploy from GitHub repo`
4. **เลือก** `meta-ads-dashboard` repository
5. **คลิก** `Deploy` → รอ 1-2 นาที

### Step 3: ได้ URL (1 นาที)

Railway จะ auto generate URL:
```
https://meta-ads-dashboard-prod-xxxxx.railway.app
```

**คัดลอก URL นี้ → แชร์กับทีม** 🎉

---

## 📱 ทีมใช้งาน:

### ครั้งแรก:
1. เข้า URL ที่ได้
2. คลิก ⚙️ ตั้งค่า
3. ใส่:
   - **Meta Token**: `EAABa...` (ได้จาก Meta Business)
   - **Ad Account ID**: `act_1234567890`
4. คลิก 💾 บันทึก

### ครั้งต่อไป:
- เข้า URL เดียวกัน → ข้อมูลจำได้ (บันทึกใน browser)

---

## ❓ FAQ

**Q: ข้อมูลปลอดภัย?**
A: ✅ Token บันทึกใน Local Browser เท่านั้น (ไม่ส่งขึ้น Server)

**Q: เปลี่ยนชื่อ Server?**
A: ไปที่ Railway Settings → General → Change name

**Q: ดูข้อมูลในอนาคต?**
A: ต้อง integrate Meta API (ดู README.md)

**Q: ต้องการ Https?**
A: ✅ Railway ให้ HTTPS ฟรี

---

## 🚀 เสร็จแล้ว!

URL → https://your-domain.railway.app  
ทีม → เข้าได้ทั้งหมด  
ข้อมูล → บันทึกใน local  

**ไม่ต้องติดตั้งอะไรเพิ่มเติม!** 🎊

---

สำหรับตัวเลือก deploy อื่น → ดู [DEPLOY.md](./DEPLOY.md)
