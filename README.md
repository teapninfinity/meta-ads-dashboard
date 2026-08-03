# Meta Ads Dashboard 📊

เว็บแอปพลิเคชันสำหรับรายงาน Meta Ads ด้วย Node.js + Express + Vanilla JavaScript

## 📋 โครงสร้าง

```
meta-ads-dashboard/
├── backend/              # Backend API (Node.js + Express)
│   ├── server.js         # Main server file
│   ├── package.json      # Dependencies
│   └── .env              # Environment variables
├── frontend/             # Frontend (Vanilla JS)
│   ├── index.html        # HTML
│   ├── styles.css        # CSS
│   └── app.js            # JavaScript logic
└── README.md             # This file
```

## 🚀 ติดตั้ง

### 1. ติดตั้ง Dependencies

```bash
cd backend
npm install
```

### 2. สตาร์ทเซิร์ฟเวอร์

```bash
npm start
```

เซิร์ฟเวอร์จะทำงานที่ `http://localhost:3000`

## 🎯 Features

✅ **Dashboard ทั้งหมด** - แสดงข้อมูลรวม Spend, คนเข้า, Purchase, Revenue, CPA, ROAS

✅ **Filter ยืดหยุ่น**
- รอบประชุม (1-15 และ 1-สิ้นเดือน)
- สินค้า
- เพจ
- ประเภท (SCALE / RE)

✅ **โหมดดูภาพ**
- รวมภาพซ้ำ (Grouped) - รวมตัวเลขสื่อเดียวกัน
- แยกรายแอด (Separate) - แสดงแอดแต่ละรายการ

✅ **ตารางรายละเอียด**
- ภาพสื่อ
- สรุปตัวเลขหลัก
- CPA และ ROAS

✅ **Image Modal** - คลิกภาพเพื่อขยายดู

✅ **Responsive Design** - ใช้งานได้ทั้ง Desktop และ Mobile

## 🔌 API Endpoints

### GET `/api/dashboard`
ดึงข้อมูลแดชบอร์ด

**Query Parameters:**
```
startDate: YYYY-MM-DD
endDate: YYYY-MM-DD
product: string (ชื่อสินค้า หรือ 'ALL')
page: string (ชื่อเพจ หรือ 'ALL')
```

**Response:**
```json
{
  "rows": [
    {
      "product": "โปรดัค A",
      "page": "เพจ 1",
      "type": "SCALE:IB",
      "ad": "ชื่อแอด",
      "mediaUrl": "https://...",
      "spend": 5000,
      "message": 150,
      "purchase": 25,
      "revenue": 75000
    }
  ],
  "products": ["โปรดัค A", "โปรดัค B"],
  "pages": ["เพจ 1", "เพจ 2"]
}
```

### POST `/api/refresh`
ดึงข้อมูลใหม่จาก Meta Ads API

**Request Body:**
```json
{
  "startDate": "2026-08-01",
  "endDate": "2026-08-15",
  "product": "ALL",
  "page": "ALL"
}
```

**Response:**
```json
{
  "success": true,
  "message": "อัปเดตข้อมูลสำเร็จ",
  "updatedAt": "3 สิงหาคม 2569 14:30"
}
```

## 🔗 เชื่อมต่อ Meta Ads API

ปัจจุบัน backend ใช้ sample data ชั่วคราว สำหรับเชื่อมต่อ Meta Ads API จริง:

### 1. ติดตั้ง Facebook SDK

```bash
npm install axios
```

### 2. แก้ไข `backend/server.js`

เพิ่มโค้ดดังนี้ในไฟล์ `server.js`:

```javascript
const axios = require('axios');

const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const META_AD_ACCOUNT_ID = process.env.META_AD_ACCOUNT_ID;

async function fetchMetaAdsData(filters) {
  try {
    const response = await axios.get(
      `https://graph.facebook.com/v18.0/${META_AD_ACCOUNT_ID}/ads`,
      {
        params: {
          fields: 'id,name,adset_id,campaign_id,insights{spend,actions}',
          access_token: META_ACCESS_TOKEN,
          date_start: filters.startDate,
          date_stop: filters.endDate
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Meta API Error:', error.message);
    throw error;
  }
}

// ใช้ในเอนด์พอยต์ GET /api/dashboard
app.get('/api/dashboard', async (req, res) => {
  try {
    const filters = req.query;
    const metaData = await fetchMetaAdsData(filters);
    // Process metaData and return
    res.json({ rows: processedRows, products, pages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 3. ตั้ง Environment Variables

เพิ่มใน `.env`:

```
META_ACCESS_TOKEN=your_access_token_here
META_AD_ACCOUNT_ID=act_your_account_id
```

## 📝 โครงสร้างข้อมูล

ทุกแถว (`row`) ต้องมีฟิลด์เหล่านี้:

```javascript
{
  id: 1,                           // Unique identifier
  product: "โปรดัค A",            // ชื่อสินค้า
  page: "เพจ 1",                   // ชื่อเพจ
  type: "SCALE:IB",                // ประเภท (SCALE:IB, SCALE:PC, RE:EG, ...)
  ad: "ชื่อแอด",                   // ชื่อแอด
  campaign: "Campaign A",           // ชื่อ Campaign
  adset: "Adset A1",               // ชื่อ Adset
  mediaUrl: "https://...",         // URL ของภาพ
  mediaKey: "media_1",             // Unique key สำหรับรวมภาพซ้ำ
  spend: 5000,                     // ค่าใช้จ่าย (THB)
  message: 150,                    // จำนวนคนเข้า
  purchase: 25,                    // จำนวน Purchase
  revenue: 75000,                  // ยอดขาย (THB)
  adId: "ad_1"                     // ID จาก Meta
}
```

## 🎨 ประเภทที่รองรับ

**SCALE:**
- `SCALE:IB` - Instant Booking
- `SCALE:PC` - Product Catalog
- `SCALE` - General Scale

**RE (Remarketing/Retargeting):**
- `RE:EG` - Website Engagement
- `RE:IB` - Instant Booking
- `RE:DD` - Dynamic Ads
- `RE:PD` - Product Detail
- `RE:MM` - Multiple Model
- `RE:ซื้อแล้ว` - Purchased

## 🛠️ Custom Configuration

### เปลี่ยนโปรต์

ระบุ `PORT` ในโค้ด หรือ environment variable:

```bash
PORT=8080 npm start
```

### เพิ่ม CORS Origins

แก้ไข `backend/server.js`:

```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'https://yourdomain.com']
}));
```

### เปลี่ยนรูปแบบปริมาณ (เช่น USD แทน THB)

แก้ไขฟังก์ชัน `money()` ใน `frontend/app.js`:

```javascript
function money(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(value);
}
```

## 📱 Responsive Breakpoints

- **Desktop**: 1100px ขึ้นไป
- **Tablet**: 650px - 1100px
- **Mobile**: ต่ำกว่า 650px

## 🐛 Troubleshooting

### เซิร์ฟเวอร์ไม่เริ่ม

```bash
# Check port is not in use
# Windows
netstat -ano | findstr :3000

# Clear node_modules and reinstall
rm -r node_modules
npm install
npm start
```

### ข้อมูลไม่แสดง

- ตรวจสอบ Console (F12) สำหรับ error messages
- ตรวจสอบ Network tab ว่า API call สำเร็จหรือไม่
- ตรวจสอบ `backend/server.js` ว่าข้อมูล sample ถูกต้องหรือไม่

### CORS Error

เพิ่ม origin ใน `backend/server.js`:

```javascript
app.use(cors({
  origin: true,  // Allow all origins (development only)
  credentials: true
}));
```

## 📚 Libraries

- **Backend**: Express.js, CORS, dotenv
- **Frontend**: Vanilla JavaScript (ไม่ต้อง framework)

## 📄 License

MIT

## ✉️ Support

สำหรับปัญหาหรือคำถาม ติดต่อ: team@pninfinity.com
