let currentDashboardData = null;
let currentTypeFilter = 'ALL';
let currentMediaView = 'GROUPED';
let currentRound = 'firstHalf';

const API_BASE = '/api';

// Settings Management
const SETTINGS_KEY = 'metaAdsSettings';

function loadSettings() {
  const stored = localStorage.getItem(SETTINGS_KEY);
  return stored ? JSON.parse(stored) : {
    metaToken: '',
    adAccountId: '',
    lockedUnit: '',
    pageNames: ''
  };
}

function saveSettings() {
  const settings = {
    metaToken: document.getElementById('metaToken').value,
    adAccountId: document.getElementById('adAccountId').value,
    lockedUnit: document.getElementById('lockedUnit').value,
    pageNames: document.getElementById('pageNames').value
  };

  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));

  const msg = document.getElementById('settingsMessage');
  msg.textContent = '✅ บันทึกการตั้งค่าสำเร็จ';
  msg.className = 'settings-message success';

  setTimeout(() => {
    msg.className = 'settings-message';
  }, 3000);

  loadDashboard();
}

function toggleSettings() {
  const page = document.getElementById('settingsPage');
  const settings = loadSettings();

  document.getElementById('metaTokenPage').value = settings.metaToken;
  document.getElementById('adAccountIdPage').value = settings.adAccountId;
  document.getElementById('lockedUnitPage').value = settings.lockedUnit;
  document.getElementById('pageNamesPage').value = settings.pageNames;

  page.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeSettingsPage() {
  document.getElementById('settingsPage').classList.remove('open');
  document.body.style.overflow = '';
}

function saveSettingsPage() {
  const settings = {
    metaToken: document.getElementById('metaTokenPage').value,
    adAccountId: document.getElementById('adAccountIdPage').value,
    lockedUnit: document.getElementById('lockedUnitPage').value,
    pageNames: document.getElementById('pageNamesPage').value
  };

  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));

  const msg = document.getElementById('settingsPageMessage');
  msg.textContent = '✅ บันทึกการตั้งค่าสำเร็จ';
  msg.className = 'settings-message success';

  setTimeout(() => {
    msg.className = 'settings-message';
    closeSettingsPage();
    loadDashboard();
  }, 1500);
}

function toggleTokenVisibilityPage() {
  const input = document.getElementById('metaTokenPage');
  const btn = event.target;
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = '🙈 ซ่อน';
  } else {
    input.type = 'password';
    btn.textContent = '👁️ แสดง';
  }
}

function closeSettings(event, force) {
  document.getElementById('settingsModal').classList.remove('open');
  document.body.style.overflow = '';
  if (event) event.stopPropagation();
}

function toggleTokenVisibility() {
  const input = document.getElementById('metaToken');
  const btn = event.target;
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = '🙈 ซ่อน';
  } else {
    input.type = 'password';
    btn.textContent = '👁️ แสดง';
  }
}

document.addEventListener('DOMContentLoaded', function () {
  setDefaultRound();
  loadDashboard();
});

function setDefaultRound() {
  const now = new Date();
  document.getElementById('reportMonth').value =
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  currentRound = now.getDate() <= 15 ? 'firstHalf' : 'fullMonth';
  applyCurrentRound(false);
}

function setReportRound(round, button) {
  currentRound = round;
  setActiveRoundButton(button);
  applyCurrentRound(true);
}

function applyCurrentRound(fetchMeta) {
  const monthValue = document.getElementById('reportMonth').value;
  if (!monthValue) return;

  const [year, month] = monthValue.split('-').map(Number);
  let start, end;

  if (currentRound === 'firstHalf') {
    start = new Date(year, month - 1, 1);
    end = new Date(year, month - 1, 15);
  } else {
    start = new Date(year, month - 1, 1);
    end = new Date(year, month, 0);
  }

  setDateInputs(start, end);

  const lastDay = new Date(year, month, 0).getDate();
  document.getElementById('roundFirst').textContent = 'รอบ 1–15';
  document.getElementById('roundSecond').textContent = `รอบ 1–${lastDay}`;

  setActiveRoundButton(
    document.getElementById(currentRound === 'firstHalf' ? 'roundFirst' : 'roundSecond')
  );

  if (fetchMeta) refreshData();
  else loadDashboard();
}

function setDateInputs(start, end) {
  document.getElementById('startDate').value = formatDateInput(start);
  document.getElementById('endDate').value = formatDateInput(end);
}

function formatDateInput(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function setActiveRoundButton(button) {
  document.querySelectorAll('.quick-date-btn').forEach(btn => btn.classList.remove('active'));
  if (button) button.classList.add('active');
}

function currentFilters() {
  const settings = loadSettings();
  return {
    startDate: document.getElementById('startDate').value,
    endDate: document.getElementById('endDate').value,
    unit: settings.lockedUnit || document.getElementById('unit').value,
    page: 'ALL'
  };
}

function loadDashboard() {
  document.getElementById('content').innerHTML = '<div class="loading">กำลังโหลดข้อมูล...</div>';

  const filters = currentFilters();
  const query = new URLSearchParams(filters).toString();

  fetch(`${API_BASE}/dashboard?${query}`)
    .then(res => res.json())
    .then(data => renderDashboard(data))
    .catch(error => showError(error));
}

function renderDashboard(data) {
  currentDashboardData = data || { rows: [], units: [], pages: [] };
  updateUnitOptions(currentDashboardData.units || []);
  updatePageOptions(currentDashboardData.pages || []);
  updateLockedUnitOptions(currentDashboardData.units || []);
  renderFilteredDashboard();
}

function setTypeFilter(filter) {
  currentTypeFilter = filter;

  document.getElementById('typeAll').className = 'type-tab' + (filter === 'ALL' ? ' active-all' : '');
  document.getElementById('typeScale').className = 'type-tab' + (filter === 'SCALE' ? ' active-scale' : '');
  document.getElementById('typeRe').className = 'type-tab' + (filter === 'RE' ? ' active-re' : '');

  const labels = {
    ALL: 'ทั้งหมด',
    SCALE: 'ตัวสเกลเท่านั้น',
    RE: 'ตัวรีทั้งหมด'
  };
  document.getElementById('filterStatus').textContent = 'กำลังแสดง: ' + labels[filter];

  renderFilteredDashboard();
}

function setExactTypeFilter(type) {
  if (!currentDashboardData) return;
  currentTypeFilter = type;
  document.getElementById('typeAll').className = 'type-tab';
  document.getElementById('typeScale').className = 'type-tab';
  document.getElementById('typeRe').className = 'type-tab active-re';
  document.getElementById('filterStatus').textContent = 'กำลังแสดง: ' + displayType(type).replace(/^[^A-Za-zก-๙]+\s*/, '');
  renderFilteredDashboard();
  document.querySelector('.table-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function setMediaView(view) {
  currentMediaView = view;
  document.getElementById('mediaGrouped').className = 'media-view-btn' + (view === 'GROUPED' ? ' active' : '');
  document.getElementById('mediaSeparate').className = 'media-view-btn' + (view === 'SEPARATE' ? ' active' : '');
  renderFilteredDashboard();
}

function groupDuplicateMedia(rows) {
  const grouped = {};

  rows.forEach((row, index) => {
    const mediaIdentity = row.mediaKey || normalizeMediaUrlClient(row.mediaUrl) || row.adId || `NO_MEDIA_${index}`;
    const key = [row.unit, row.page, mediaIdentity].join('||');

    if (!grouped[key]) {
      grouped[key] = {
        ...row,
        spend: 0,
        message: 0,
        purchase: 0,
        revenue: 0,
        adCount: 0,
        adNames: [],
        types: []
      };
    }

    grouped[key].spend += Number(row.spend || 0);
    grouped[key].message += Number(row.message || 0);
    grouped[key].purchase += Number(row.purchase || 0);
    grouped[key].revenue += Number(row.revenue || 0);
    grouped[key].adCount += 1;

    if (row.ad && !grouped[key].adNames.includes(row.ad)) grouped[key].adNames.push(row.ad);
    if (row.type && !grouped[key].types.includes(row.type)) grouped[key].types.push(row.type);
    if (!grouped[key].mediaUrl && row.mediaUrl) grouped[key].mediaUrl = row.mediaUrl;
  });

  return Object.values(grouped).map(row => ({
    ...row,
    type: row.types.length === 1 ? row.types[0] : 'MULTI',
    ad: row.adCount > 1 ? `${row.adNames[0] || 'สื่อ'} และอีก ${row.adCount - 1} แอด` : (row.adNames[0] || row.ad),
    cpa: row.message > 0 ? row.spend / row.message : 0,
    roas: row.spend > 0 ? row.revenue / row.spend : 0
  })).sort((a, b) => b.spend - a.spend);
}

function normalizeMediaUrlClient(url) {
  return String(url || '').split('?')[0];
}

function renderFilteredDashboard() {
  if (!currentDashboardData) return;

  const allRows = currentDashboardData.rows || [];
  const selectedPage = document.getElementById('page').value || 'ALL';
  const settings = loadSettings();
  const selectedUnit = settings.lockedUnit || document.getElementById('unit').value || 'ALL';

  const filteredSourceRows = allRows.filter(row => {
    if (selectedUnit !== 'ALL' && String(row.unit || '') !== selectedUnit) {
      return false;
    }

    if (selectedPage !== 'ALL' && String(row.page || '') !== selectedPage) {
      return false;
    }

    if (currentTypeFilter === 'ALL') return true;
    if (currentTypeFilter === 'SCALE') return String(row.type || '').startsWith('SCALE');
    if (currentTypeFilter === 'RE') return String(row.type || '').startsWith('RE:');
    return row.type === currentTypeFilter;
  });

  let rows = currentMediaView === 'GROUPED'
    ? groupDuplicateMedia(filteredSourceRows)
    : filteredSourceRows;

  const summary = aggregateClientRows(filteredSourceRows);
  const typeOrder = ['SCALE:IB', 'SCALE:PC', 'SCALE', 'RE:EG', 'RE:IB', 'RE:DD', 'RE:PD', 'RE:MM', 'RE:ซื้อแล้ว'];
  const visibleTypes = typeOrder.filter(type => {
    if (currentTypeFilter === 'SCALE') return String(type || '').startsWith('SCALE');
    if (currentTypeFilter === 'RE') return type.startsWith('RE:');
    if (currentTypeFilter !== 'ALL') return type === currentTypeFilter;
    return true;
  });
  const groups = visibleTypes.map(type => {
    const groupSummary = aggregateClientRows(filteredSourceRows.filter(row => row.type === type));
    return { type, ...groupSummary };
  });

  let html = `
    <div class="summary-grid">
      ${summaryCard('ค่าใช้จ่าย', money(summary.spend))}
      ${summaryCard('คนเข้า', number(summary.message))}
      ${summaryCard('Purchase', number(summary.purchase))}
      ${summaryCard('ยอดขาย', money(summary.revenue))}
      ${summaryCard('ค่าทัก', money(summary.cpa))}
      ${summaryCard('ROAS', decimal(summary.roas))}
    </div>
    <h2 class="section-title">สรุปแยกประเภท</h2>
    <div class="group-grid">`;

  groups.forEach(group => {
    html += `<div class="group-card ${String(group.type || '').startsWith('SCALE') ? 'scale' : ''}" onclick="setExactTypeFilter('${escapeJsString(group.type)}')" title="กดเพื่อดูเฉพาะสื่อนี้">
      <div class="group-title">${displayType(group.type)}</div>
      ${groupRow('ใช้เงิน', money(group.spend))}
      ${groupRow('คนเข้า', number(group.message))}
      ${groupRow('Purchase', number(group.purchase))}
      ${groupRow('ยอดขาย', money(group.revenue))}
      ${groupRow('ค่าทัก', money(group.cpa))}
      ${groupRow('ROAS', decimal(group.roas))}
    </div>`;
  });

  html += `</div><h2 class="section-title">${currentMediaView === 'GROUPED' ? 'สรุปสื่อไม่ซ้ำ' : 'รายละเอียดรายแอด'} (${number(rows.length)} รายการ)</h2>
    <div class="table-card"><div class="table-wrap"><table><thead><tr>
      <th>ภาพสื่อ</th><th>สินค้า</th><th>เพจ</th><th>ประเภท</th><th>ชื่อแอด / จำนวนแอด</th>
      <th class="number">Spend</th><th class="number">คนเข้า</th><th class="number">Purchase</th>
      <th class="number">Revenue</th><th class="number">CPA</th><th class="number">ROAS</th>
    </tr></thead><tbody>`;

  if (!rows.length) {
    html += '<tr><td colspan="11" class="empty">ไม่พบสื่อในประเภทและช่วงวันที่ที่เลือก</td></tr>';
  } else {
    rows.forEach(row => {
      const roasClass = row.roas >= 2.5 ? 'good' : (row.roas > 0 && row.roas < 2 ? 'bad' : '');
      html += `<tr>
        <td>${mediaCell(row.mediaUrl, row.ad)}</td>
        <td>${escapeHtml(row.unit)}</td>
        <td>${escapeHtml(row.page)}</td>
        <td>${renderTypeBadges(row)}</td>
        <td class="ad-name" title="${escapeAttribute(row.campaign + ' | ' + row.adset)}">${escapeHtml(row.ad)}${row.adCount > 1 ? `<br><span class="ad-count">รวม ${number(row.adCount)} แอด</span>` : ''}</td>
        <td class="number">${money(row.spend)}</td>
        <td class="number">${number(row.message)}</td>
        <td class="number">${number(row.purchase)}</td>
        <td class="number">${money(row.revenue)}</td>
        <td class="number">${money(row.cpa)}</td>
        <td class="number ${roasClass}">${decimal(row.roas)}</td>
      </tr>`;
    });
  }

  html += '</tbody></table></div></div>';
  document.getElementById('content').innerHTML = html;
}

function aggregateClientRows(rows) {
  const total = rows.reduce((sum, row) => {
    sum.spend += Number(row.spend || 0);
    sum.message += Number(row.message || 0);
    sum.purchase += Number(row.purchase || 0);
    sum.revenue += Number(row.revenue || 0);
    return sum;
  }, { spend: 0, message: 0, purchase: 0, revenue: 0 });

  total.cpa = total.message > 0 ? total.spend / total.message : 0;
  total.roas = total.spend > 0 ? total.revenue / total.spend : 0;
  return total;
}

function mediaCell(url, adName) {
  if (!url) return '<div class="media-placeholder">ไม่มีภาพ<br>หรือไม่มีสิทธิ์</div>';
  const safeUrl = escapeAttribute(url);
  const safeName = escapeAttribute(adName || 'ภาพสื่อ');
  return `<div class="media-wrap"><img class="media-thumb" src="${safeUrl}" alt="${safeName}" loading="lazy" referrerpolicy="no-referrer" onclick="openImageModal('${escapeJsString(url)}')" onerror="this.parentElement.outerHTML='<div class=&quot;media-placeholder&quot;>โหลดภาพไม่ได้</div>'"><span class="media-zoom-hint">คลิกขยาย</span></div>`;
}

function openImageModal(url) {
  if (!url) return;
  document.getElementById('modalImage').src = url;
  document.getElementById('imageModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeImageModal(event, force) {
  if (!force && event && event.target && !event.target.classList.contains('modal')) return;
  document.getElementById('imageModal').classList.remove('open');
  document.getElementById('modalImage').src = '';
  document.body.style.overflow = '';
  if (event) event.stopPropagation();
}

function updateUnitOptions(units) {
  const select = document.getElementById('unit');
  const selected = select.value;
  select.innerHTML = '<option value="ALL">ทั้งหมด</option>' + units.map(unit => `<option value="${escapeAttribute(unit)}">${escapeHtml(unit)}</option>`).join('');
  if (selected === 'ALL' || units.includes(selected)) select.value = selected;
}

function updateLockedUnitOptions(units) {
  const select = document.getElementById('lockedUnit');
  const selected = select.value;
  select.innerHTML = '<option value="">ไม่ล็อค - แสดงทั้งหมด</option>' + units.map(unit => `<option value="${escapeAttribute(unit)}">${escapeHtml(unit)}</option>`).join('');
  if (selected && units.includes(selected)) select.value = selected;
}

function updatePageOptions(pages) {
  const select = document.getElementById('page');
  const selected = select.value;
  select.innerHTML = '<option value="ALL">ทุกเพจ</option>' + pages.map(page => `<option value="${escapeAttribute(page)}">${escapeHtml(page)}</option>`).join('');
  if (selected === 'ALL' || pages.includes(selected)) select.value = selected;
  else select.value = 'ALL';
}

function onUnitChange() {
  document.getElementById('page').value = 'ALL';
  loadDashboard();
}

function summaryCard(label, value) {
  return `<div class="summary-card"><div class="summary-label">${label}</div><div class="summary-value">${value}</div></div>`;
}

function renderTypeBadges(row) {
  const types = Array.isArray(row.types) && row.types.length ? row.types : [row.type];
  return `<div class="type-badges">${types.map(type => `<span class="badge ${String(type || '').startsWith('SCALE') ? 'scale' : ''}">${displayType(type)}</span>`).join('')}</div>`;
}

function groupRow(label, value) {
  return `<div class="group-row"><span>${label}</span><strong>${value}</strong></div>`;
}

function displayType(type) {
  return ({
    'SCALE:IB': '💬 SCALE IB',
    'SCALE:PC': '🛒 SCALE PC',
    'SCALE': '🚀 SCALE',
    'RE:EG': '🔵 RE EG',
    'RE:IB': '🟣 RE IB',
    'RE:DD': '🟠 RE DD',
    'RE:PD': '🟢 RE PD',
    'RE:MM': '🔴 RE MM',
    'RE:ซื้อแล้ว': '🟤 RE ซื้อแล้ว'
  })[type] || escapeHtml(type);
}

function money(value) {
  return Number(value || 0).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function number(value) {
  return Number(value || 0).toLocaleString('th-TH');
}

function decimal(value) {
  return Number(value || 0).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function escapeHtml(value) {
  return String(value || '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll('`', '&#096;');
}

function escapeJsString(value) {
  return String(value || '').replaceAll('\\', '\\\\').replaceAll("'", "\\'").replaceAll('\n', '').replaceAll('\r', '');
}

function refreshData() {
  const settings = loadSettings();

  if (!settings.metaToken || !settings.adAccountId) {
    alert('❌ ต้องตั้งค่า Meta Token และ Ad Account ID ก่อน\n\nกดปุ่ม ⚙️ ตั้งค่า เพื่อเพิ่มข้อมูล');
    toggleSettings();
    return;
  }

  const button = document.getElementById('refreshButton');
  button.disabled = true;
  button.innerText = 'กำลังอัปเดต...';
  document.getElementById('content').innerHTML = '<div class="loading">กำลังดึงข้อมูลและภาพสื่อจาก Meta...</div>';

  const filters = currentFilters();
  const payload = {
    ...filters,
    metaToken: settings.metaToken,
    adAccountId: settings.adAccountId
  };

  fetch(`${API_BASE}/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(result => {
      button.disabled = false;
      button.innerText = 'ดึงรายงานรอบนี้';
      if (result.success) {
        loadDashboard();
        alert(result.message + '\nอัปเดตเวลา ' + result.updatedAt);
      } else {
        alert('❌ ' + result.message);
      }
    })
    .catch(error => {
      button.disabled = false;
      button.innerText = 'ดึงรายงานรอบนี้';
      showError(error);
    });
}

function showError(error) {
  document.getElementById('content').innerHTML = `<div class="empty">เกิดข้อผิดพลาด: ${escapeHtml(error.message || error)}</div>`;
}
