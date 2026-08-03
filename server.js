const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files from frontend
app.use(express.static(path.join(__dirname, './frontend')));

// Debug logging
app.use((req, res, next) => {
  console.log(`📍 ${req.method} ${req.path}`);
  next();
});

// Sample data
const sampleData = {
  units: ['UNIT A', 'UNIT B', 'UNIT C'],
  pages: ['เพจ 1', 'เพจ 2', 'เพจ 3'],
  rows: [
    {
      id: 1,
      unit: 'UNIT A',
      page: 'เพจ 1',
      type: 'SCALE:IB',
      ad: 'แอด SCALE IB #1',
      campaign: 'Campaign A',
      adset: 'Adset A1',
      mediaUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=500&h=500',
      mediaKey: 'media_1',
      spend: 5000,
      message: 150,
      purchase: 25,
      revenue: 75000,
      adId: 'ad_1'
    },
    {
      id: 2,
      unit: 'UNIT A',
      page: 'เพจ 1',
      type: 'SCALE:PC',
      ad: 'แอด SCALE PC #1',
      campaign: 'Campaign A',
      adset: 'Adset A2',
      mediaUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500',
      mediaKey: 'media_2',
      spend: 4000,
      message: 120,
      purchase: 20,
      revenue: 60000,
      adId: 'ad_2'
    },
    {
      id: 3,
      unit: 'UNIT B',
      page: 'เพจ 2',
      type: 'RE:EG',
      ad: 'แอด RE EG #1',
      campaign: 'Campaign B',
      adset: 'Adset B1',
      mediaUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&h=500',
      mediaKey: 'media_3',
      spend: 3000,
      message: 80,
      purchase: 15,
      revenue: 45000,
      adId: 'ad_3'
    },
    {
      id: 4,
      unit: 'UNIT B',
      page: 'เพจ 2',
      type: 'RE:IB',
      ad: 'แอด RE IB #1',
      campaign: 'Campaign B',
      adset: 'Adset B2',
      mediaUrl: 'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=500&h=500',
      mediaKey: 'media_4',
      spend: 2500,
      message: 70,
      purchase: 12,
      revenue: 36000,
      adId: 'ad_4'
    },
    {
      id: 5,
      unit: 'UNIT C',
      page: 'เพจ 3',
      type: 'SCALE',
      ad: 'แอด SCALE #1',
      campaign: 'Campaign C',
      adset: 'Adset C1',
      mediaUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=500',
      mediaKey: 'media_5',
      spend: 6000,
      message: 180,
      purchase: 30,
      revenue: 90000,
      adId: 'ad_5'
    }
  ]
};

// API endpoint: Get dashboard data
app.get('/api/dashboard', (req, res) => {
  const { startDate, endDate, unit, page } = req.query;

  let filtered = sampleData.rows;

  if (unit && unit !== 'ALL') {
    filtered = filtered.filter(row => row.unit === unit);
  }

  if (page && page !== 'ALL') {
    filtered = filtered.filter(row => row.page === page);
  }

  res.json({
    rows: filtered,
    units: sampleData.units,
    pages: sampleData.pages
  });
});

// API endpoint: Refresh data
app.post('/api/refresh', (req, res) => {
  const updatedAt = new Date().toLocaleString('th-TH');

  res.json({
    success: true,
    message: 'อัปเดตข้อมูลสำเร็จ',
    updatedAt: updatedAt,
    rowCount: sampleData.rows.length
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Catch-all: serve index.html
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, './frontend/index.html');
  console.log(`📄 Serving index.html from: ${indexPath}`);
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error(`❌ Error sending file: ${err.message}`);
      res.status(500).send('Error: index.html not found');
    }
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server running at http://localhost:${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}\n`);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
});
