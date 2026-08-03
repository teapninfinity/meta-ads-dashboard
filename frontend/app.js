const SETTINGS_KEY = 'metaAdsSettings';

let dashboardData = [];
let settings = {};

function loadSettings() {
  const saved = localStorage.getItem(SETTINGS_KEY);
  settings = saved ? JSON.parse(saved) : { metaToken: '', adAccountId: '', lockedUnit: '', pageNames: {} };
  return settings;
}

function saveSettings() {
  settings.metaToken = document.getElementById('metaToken').value;
  settings.adAccountId = document.getElementById('adAccountId').value;
  settings.lockedUnit = document.getElementById('lockedUnit').value;
  settings.pageNames = {};
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  alert('✅ บันทึกตั้งค่าสำเร็จ');
}

async function fetchDashboard() {
  try {
    const unit = document.getElementById('unitFilter').value;
    const page = document.getElementById('pageFilter').value;

    const params = new URLSearchParams();
    if (unit !== 'ALL') params.append('unit', unit);
    if (page !== 'ALL') params.append('page', page);

    const response = await fetch(`/api/dashboard?${params}`);
    dashboardData = await response.json();
    renderDashboard();
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('dashboardContent').innerHTML = '<div class="error">❌ เกิดข้อผิดพลาด</div>';
  }
}

function filterByType(rows) {
  const typeFilter = document.getElementById('typeFilter').value;
  if (typeFilter === 'ALL') return rows;

  return rows.filter(row => {
    if (typeFilter === 'SCALE') return row.type.includes('SCALE');
    if (typeFilter === 'RE') return row.type.includes('RE');
    return true;
  });
}

function groupDuplicateMedia(rows) {
  const mediaFilter = document.getElementById('mediaFilter').value;
  if (mediaFilter === 'SEPARATE') return rows;

  const grouped = {};
  rows.forEach(row => {
    const key = `${row.ad}_${row.mediaUrl}`;
    if (!grouped[key]) {
      grouped[key] = { ...row };
    } else {
      grouped[key].spend += row.spend;
      grouped[key].message += row.message;
      grouped[key].purchase += row.purchase;
      grouped[key].revenue += row.revenue;
    }
  });

  return Object.values(grouped);
}

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
  return num.toLocaleString('th-TH');
}

function renderDashboard() {
  let rows = Array.isArray(dashboardData) ? dashboardData : dashboardData.rows || [];

  rows = filterByType(rows);
  rows = groupDuplicateMedia(rows);

  if (rows.length === 0) {
    document.getElementById('dashboardContent').innerHTML = '<div class="no-data">ไม่พบข้อมูล</div>';
    return;
  }

  let html = '<div class="summary-cards">';

  const totals = {
    spend: rows.reduce((sum, r) => sum + r.spend, 0),
    message: rows.reduce((sum, r) => sum + r.message, 0),
    purchase: rows.reduce((sum, r) => sum + r.purchase, 0),
    revenue: rows.reduce((sum, r) => sum + r.revenue, 0)
  };

  html += `
    <div class="card">
      <div class="card-label">💰 ยอดใช้จ่าย</div>
      <div class="card-value">${formatNumber(totals.spend)}</div>
    </div>
    <div class="card">
      <div class="card-label">💬 จำนวนข้อความ</div>
      <div class="card-value">${formatNumber(totals.message)}</div>
    </div>
    <div class="card">
      <div class="card-label">🛒 การซื้อ</div>
      <div class="card-value">${formatNumber(totals.purchase)}</div>
    </div>
    <div class="card">
      <div class="card-label">💵 รายได้</div>
      <div class="card-value">${formatNumber(totals.revenue)}</div>
    </div>
  </div>`;

  html += '<div class="data-table">';
  html += `
    <div class="table-header">
      <div class="col-ad">แอด</div>
      <div class="col-unit">UNIT</div>
      <div class="col-type">ประเภท</div>
      <div class="col-spend">ยอดใช้</div>
      <div class="col-msg">ข้อความ</div>
      <div class="col-buy">ซื้อ</div>
      <div class="col-revenue">รายได้</div>
      <div class="col-media">มีเดีย</div>
    </div>
  `;

  rows.forEach(row => {
    const roi = row.spend > 0 ? ((row.revenue - row.spend) / row.spend * 100).toFixed(2) : 0;
    html += `
      <div class="table-row">
        <div class="col-ad">${row.ad}</div>
        <div class="col-unit">${row.unit}</div>
        <div class="col-type">${row.type}</div>
        <div class="col-spend">${formatNumber(row.spend)}</div>
        <div class="col-msg">${formatNumber(row.message)}</div>
        <div class="col-buy">${formatNumber(row.purchase)}</div>
        <div class="col-revenue">${formatNumber(row.revenue)}</div>
        <div class="col-media">
          ${row.mediaUrl ? `<img src="${row.mediaUrl}" class="thumb" onclick="openImageModal('${row.mediaUrl}')">` : '-'}
        </div>
      </div>
    `;
  });

  html += '</div>';
  document.getElementById('dashboardContent').innerHTML = html;
}

function openImageModal(url) {
  document.getElementById('modalImage').src = url;
  document.getElementById('imageModal').classList.remove('hidden');
}

function closeImageModal() {
  document.getElementById('imageModal').classList.add('hidden');
}

function toggleSettings() {
  const settingsPage = document.getElementById('settingsPage');
  const dashboardPage = document.getElementById('dashboardPage');

  if (settingsPage.classList.contains('hidden')) {
    settingsPage.classList.remove('hidden');
    dashboardPage.classList.add('hidden');
    document.getElementById('metaToken').value = settings.metaToken || '';
    document.getElementById('adAccountId').value = settings.adAccountId || '';
    document.getElementById('lockedUnit').value = settings.lockedUnit || '';
  } else {
    settingsPage.classList.add('hidden');
    dashboardPage.classList.remove('hidden');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  fetchDashboard();

  document.getElementById('unitFilter').addEventListener('change', fetchDashboard);
  document.getElementById('pageFilter').addEventListener('change', fetchDashboard);
  document.getElementById('typeFilter').addEventListener('change', renderDashboard);
  document.getElementById('mediaFilter').addEventListener('change', renderDashboard);

  document.getElementById('settingsBtn').addEventListener('click', toggleSettings);
  document.getElementById('closeSettingsBtn').addEventListener('click', toggleSettings);
  document.getElementById('saveSettingsBtn').addEventListener('click', saveSettings);

  document.getElementById('refreshBtn').addEventListener('click', async () => {
    await fetch('/api/refresh', { method: 'POST' });
    fetchDashboard();
    alert('✅ รีเฟรชสำเร็จ');
  });

  document.getElementById('closeModal').addEventListener('click', closeImageModal);
  document.getElementById('imageModal').addEventListener('click', (e) => {
    if (e.target.id === 'imageModal') closeImageModal();
  });
});
