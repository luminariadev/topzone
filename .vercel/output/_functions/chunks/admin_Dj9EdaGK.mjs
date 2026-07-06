import { c as createComponent } from './astro-component_Bx6FovRv.mjs';
import 'piccolore';
import { k as renderTemplate, o as renderComponent, m as maybeRenderHead } from './entrypoint_l-pqzMWz.mjs';
import { $ as $$Layout, a as $$Footer } from './Footer_7KXavt6J.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a, _b;
const $$Admin = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate(_b || (_b = __template(["", ` <script>
  const API = {
    login: '/api/auth/admin-login',
    logout: '/api/auth/admin-logout',
    me: '/api/auth/admin-me',
    games: '/api/admin/games-crud',
    gears: '/api/admin/gears-crud',
    orders: '/api/admin/orders',
    vouchers: '/api/admin/vouchers',
    audit: '/api/admin/audit-log',
    reports: '/api/admin/reports',
  };
  const SESSION_TIME = 30 * 60 * 1000; // 30 menit
  const DEFAULT_GAMES = [
  {
    "slug": "mobile-legends",
    "name": "Mobile Legends",
    "img": "/assets/mlbb.png",
    "color": "#39FF14",
    "badge": "Terlaris",
    "category": "mobile",
    "currency": "Diamond",
    "description": "Top up diamond Mobile Legends Bang Bang dengan harga terbaik. Instan, aman, dan terpercaya.",
    "packages": [
      { "id": "mlbb-86", "label": "86 Diamond", "price": 19000 },
      { "id": "mlbb-172", "label": "172 Diamond", "price": 37000 },
      { "id": "mlbb-257", "label": "257 Diamond", "price": 55000 },
      { "id": "mlbb-344", "label": "344 Diamond", "price": 72000 },
      { "id": "mlbb-514", "label": "514 Diamond", "price": 108000 },
      { "id": "mlbb-706", "label": "706 Diamond", "price": 147000 }]},
  {
    "slug": "valorant",
    "name": "Valorant",
    "img": "/assets/valorant.png",
    "color": "#FF007F",
    "badge": "Trending",
    "category": "pc",
    "currency": "VP",
    "description": "Beli Valorant Points (VP) untuk unlock agent, skin senjata, dan battle pass favoritmu.",
    "packages": [
      { "id": "valo-420", "label": "420 VP", "price": 55000 },
      { "id": "valo-740", "label": "740 VP", "price": 95000 },
      { "id": "valo-1200", "label": "1.200 VP", "price": 150000 },
      { "id": "valo-2050", "label": "2.050 VP", "price": 255000 },
      { "id": "valo-3650", "label": "3.650 VP", "price": 450000 },
      { "id": "valo-5350", "label": "5.350 VP", "price": 650000 }]},
  {
    "slug": "free-fire",
    "name": "Free Fire",
    "img": "/assets/freefire.png",
    "color": "#FFE600",
    "badge": "Hot Deal",
    "category": "mobile",
    "currency": "Diamond",
    "description": "Top up diamond Free Fire untuk beli skin karakter, senjata, dan item eksklusif lainnya.",
    "packages": [
      { "id": "ff-70", "label": "70 Diamond", "price": 14000 },
      { "id": "ff-140", "label": "140 Diamond", "price": 27000 },
      { "id": "ff-355", "label": "355 Diamond", "price": 66000 },
      { "id": "ff-720", "label": "720 Diamond", "price": 132000 },
      { "id": "ff-1450", "label": "1.450 Diamond", "price": 260000 },
      { "id": "ff-2180", "label": "2.180 Diamond", "price": 385000 }]}];
  const DEFAULT_GEARS = [
  {
    "slug": "mechanical-keyboard",
    "name": "Mechanical Keyboard",
    "img": "/assets/keyboard.png",
    "price": 350000,
    "tag": "RGB Ready",
    "category": "keyboard",
    "description": "Keyboard mekanikal 75% compact dengan switch taktil dan RGB per-key. Cocok untuk gaming marathon.",
    "specs": [
      { "label": "Layout", "value": "75% Compact" },
      { "label": "Switch", "value": "Blue Tactile" },
      { "label": "Backlight", "value": "Per-key RGB" },
      { "label": "Interface", "value": "USB-C + Wireless" },
      { "label": "Battery", "value": "4000 mAh" }]},
  {
    "slug": "gaming-mouse",
    "name": "Gaming Mouse",
    "img": "/assets/mouse.png",
    "price": 250000,
    "tag": "12000 DPI",
    "category": "mouse",
    "description": "Mouse gaming ergonomis dengan sensor optik presisi tinggi, 7 tombol programmable, dan RGB side strip.",
    "specs": [
      { "label": "DPI", "value": "200 – 12.000" },
      { "label": "Polling Rate", "value": "1000 Hz" },
      { "label": "Buttons", "value": "7 programmable" },
      { "label": "Weight", "value": "88g" },
      { "label": "Interface", "value": "USB 2.0" }]},
  {
    "slug": "rgb-headset",
    "name": "RGB Headset",
    "img": "/assets/headset.png",
    "price": 300000,
    "tag": "Surround Sound",
    "category": "headset",
    "description": "Headset gaming dengan virtual 7.1 surround sound, mikrofon noise-cancelling, dan RGB earcup.",
    "specs": [
      { "label": "Driver", "value": "50mm Neodymium" },
      { "label": "Frequency", "value": "20Hz – 20kHz" },
      { "label": "Microphone", "value": "Noise-cancelling" },
      { "label": "Audio", "value": "Virtual 7.1 Surround" },
      { "label": "Interface", "value": "3.5mm + USB" }]}];
  // -------------------------------------------------------
  // SECURITY: Session Management (API-based)
  // -------------------------------------------------------

  let adminUser = null;
  let sessionExpiry = 0;

  /** Fetch /api/auth/admin-me to verify session server-side */
  async function checkSession() {
    try {
      const res = await fetch(API.me);
      const data = await res.json();
      if (data.admin) {
        adminUser = data.admin;
        sessionExpiry = Date.now() + SESSION_TIME;
        return true;
      }
    } catch(e) {
      console.warn('Admin session check failed:', e);
      adminUser = null;
      return false;
    }

  /** Login via Supabase Auth API */
  async function loginAdmin(email, password) {
    const res = await fetch(API.login, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  }

  /** Logout via API */
  async function logoutAdmin() {
    await fetch(API.logout, { method: 'POST' });
    adminUser = null;
  }

  /** Log admin action to audit trail */
  async function logAudit(action, entityType, entityId, details = {}) {
    if (!adminUser) return;
    try {
      await fetch(API.audit, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admin_email: adminUser.email,
          action,
          entity_type: entityType,
          entity_id: entityId || null,
          details,
        }),
      });
    } catch(e) {
      // Silent failure for audit logging (non-critical feature)
    }
  }

  /** Generic fetch helper with admin session check */
  async function apiFetch(url, options = {}) {
    const res = await fetch(url, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers },
    });
    if (res.status === 401) {
      adminUser = null;
      showGate();
      throw new Error('Session expired');
    }
    return res.json();
  }

  // Session timer display
  function updateSessionTimer() {
    const el = document.getElementById('session-timer');
    if (!el) return;
    if (!adminUser) { el.textContent = ''; return; }
    const remaining = Math.max(0, sessionExpiry - Date.now());
    const min = Math.floor(remaining / 60000);
    const sec = Math.floor((remaining % 60000) / 1000);
    el.textContent = 'Sesi: ' + min + 'm ' + sec.toString().padStart(2,'0') + 's';
    if (remaining <= 0 && adminUser) {
      logoutAdmin().then(() => showGate());
    }
  }
  setInterval(updateSessionTimer, 1000);

  // -------------------------------------------------------
  // AUTH (API-based)
  // -------------------------------------------------------

  let loginAttempts = 0;
  let loginCooldown = false;

  function showGate() {
    document.getElementById('login-gate').classList.remove('hidden');
    document.getElementById('admin-dashboard').classList.add('hidden');
  }

  async function showDashboard() {
    document.getElementById('login-gate').classList.add('hidden');
    document.getElementById('admin-dashboard').classList.remove('hidden');
    sessionExpiry = Date.now() + SESSION_TIME;
    await renderAll();
  }

  // Check session on load
  checkSession().then((valid) => { if (valid) showDashboard(); });

  document.getElementById('admin-login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const err = document.getElementById('admin-login-error');
    const btn = document.getElementById('admin-login-btn');

    if (loginCooldown) {
      err.textContent = 'Terlalu banyak percobaan. Tunggu beberapa saat.';
      err.classList.remove('hidden');
      return;
    }

    const emailInput = document.getElementById('admin-email');
    const passInput = document.getElementById('admin-password');
    const email = emailInput ? emailInput.value : '';
    const pass = passInput ? passInput.value : '';
    btn.disabled = true;
    btn.textContent = 'Memproses...';

    try {
      const result = await loginAdmin(email, pass);
      if (result.success && result.admin) {
        loginAttempts = 0;
        adminUser = result.admin;
        showDashboard();
        err.classList.add('hidden');
      } else {
        loginAttempts++;
        err.textContent = result.error || 'Email atau password salah! (Percobaan: ' + loginAttempts + ')';
        err.classList.remove('hidden');
      }
    } catch(e) {
      err.textContent = 'Gagal terhubung ke server. Coba lagi.';
      err.classList.remove('hidden');
    }
    btn.disabled = false;
    btn.textContent = 'Masuk ke Admin';

    if (loginAttempts >= 5) {
      loginCooldown = true;
      btn.disabled = true;
      btn.textContent = 'Tunggu 30 detik...';
      setTimeout(() => {
        loginCooldown = false;
        loginAttempts = 0;
        btn.disabled = false;
        btn.textContent = 'Masuk ke Admin';
        err.textContent = 'Coba lagi.';
      }, 30000);
    }
  });

  document.getElementById('admin-logout').addEventListener('click', async () => {
    await logoutAdmin();
    showGate();
  });

  // -------------------------------------------------------
  // TAB SWITCHING
  // -------------------------------------------------------

  document.querySelectorAll('.admin-tab').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.admin-tab').forEach((b) => { b.style.background = '#fff'; });
      btn.style.background = '#39FF14';
      ['games','gear','orders','vouchers','reports'].forEach((p) => {
        document.getElementById('panel-' + p).classList.add('hidden');
      });
      document.getElementById('panel-' + btn.dataset.tab).classList.remove('hidden');
    });
  });

  // -------------------------------------------------------
  // HELPERS
  // -------------------------------------------------------

  function formatRp(n) { return 'Rp ' + Number(n).toLocaleString('id-ID'); }

  function statusBadge(s) {
    const m = { pending: 'bg-yellow-400', processing: 'bg-blue-400', completed: 'bg-neon-green', cancelled: 'bg-red-400' };
    const l = { pending: 'Pending', processing: 'Diproses', completed: 'Selesai', cancelled: 'Dibatalkan' };
    return '<span class="inline-block px-2 py-1 text-xs font-black uppercase tracking-wider border-2 border-black ' + (m[s]||'bg-gray-400') + '">' + (l[s]||s) + '</span>';
  }

  function randomId() { return Date.now().toString(36) + '-' + Math.random().toString(36).substr(2,6); }

  // -------------------------------------------------------
  // GAMES CRUD (API-based)
  // -------------------------------------------------------

  let cachedGames = [];
  let gamesCurrentPage = 1;
  const gamesPerPage = 10;
  let gamesSearchQuery = '';
  let gamesStatusFilter = 'all';

  async function getGames() {
    try {
      const data = await apiFetch(API.games);
      cachedGames = data.games || [];
      return cachedGames;
    } catch(e) {
      return cachedGames;
    }
  }

  function filterGames(games) {
    let result = games;
    if (gamesSearchQuery) {
      const q = gamesSearchQuery.toLowerCase();
      result = result.filter(g => (g.name||'').toLowerCase().includes(q) || (g.slug||'').toLowerCase().includes(q));
    }
    if (gamesStatusFilter !== 'all') {
      result = result.filter(g => (g.status || 'published') === gamesStatusFilter);
    }
    return result;
  }

  function paginateGames(games) {
    const start = (gamesCurrentPage - 1) * gamesPerPage;
    return games.slice(start, start + gamesPerPage);
  }

  function renderGamesPagination(total) {
    const totalPages = Math.ceil(total / gamesPerPage);
    const el = document.getElementById('games-pagination');
    if (!el || totalPages <= 1) { if (el) el.innerHTML = ''; return; }
    let html = '';
    if (gamesCurrentPage > 1) {
      html += '<button class="game-page-btn px-4 py-2 font-black border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000] hover:bg-black hover:text-white transition-all" data-page="' + (gamesCurrentPage - 1) + '">Sebelumnya</button>';
    }
    const maxPages = 5;
    let startPage = Math.max(1, gamesCurrentPage - Math.floor(maxPages / 2));
    let endPage = Math.min(totalPages, startPage + maxPages - 1);
    if (endPage - startPage + 1 < maxPages) {
      startPage = Math.max(1, endPage - maxPages + 1);
    }
    for (let p = startPage; p <= endPage; p++) {
      html += '<button class="game-page-btn w-10 h-10 font-black border-2 border-black ' + (p === gamesCurrentPage ? 'bg-black text-neon-green shadow-[2px_2px_0px_0px_#000]' : 'bg-white hover:bg-black hover:text-white transition-all') + '" data-page="' + p + '">' + p + '</button>';
    }
    if (gamesCurrentPage < totalPages) {
      html += '<button class="game-page-btn px-4 py-2 font-black border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000] hover:bg-black hover:text-white transition-all" data-page="' + (gamesCurrentPage + 1) + '">Berikutnya</button>';
    }
    el.innerHTML = html;
    el.querySelectorAll('.game-page-btn').forEach(b => b.addEventListener('click', function() { gamesCurrentPage = parseInt(this.dataset.page); renderGames(); }));
  }

  async function renderGames() {
    const list = document.getElementById('games-list');
    const games = await getGames();
    const filtered = filterGames(games);
    const paginated = paginateGames(filtered);
    const countLabel = document.getElementById('game-count-label');
    if (countLabel) countLabel.textContent = filtered.length + ' dari ' + games.length + ' game';
    if (paginated.length === 0) {
      list.innerHTML = '<div class="col-span-full text-center py-12 border-4 border-dashed border-black"><p class="text-xl font-black text-gray-400">Tidak ada game yang cocok.</p></div>';
      renderGamesPagination(0);
      return;
    }
    list.innerHTML = paginated.map((g, i) => '<div class="border-4 border-black bg-white shadow-[4px_4px_0px_0px_#000] p-5">' +
      '<div class="flex justify-between items-start mb-3">' +
        '<div><h3 class="text-xl font-black">' + (g.name||'') + '</h3>' +
        '<p class="text-xs text-gray-500 font-bold">/' + (g.slug||'') + ' &middot; ' + (g.currency||'') + '</p></div>' +
        '<div class="flex gap-1 items-center">' +
        '<span class="px-2 py-1 text-xs font-black border-2 border-black" style="background:' + (g.color||'#39FF14') + '">' + (g.badge||'') + '</span>' +
        (g.status ? '<span class="px-2 py-1 text-xs font-black border-2 border-black ' + (g.status === 'published' ? 'bg-neon-green' : g.status === 'draft' ? 'bg-yellow-400' : 'bg-gray-400') + '">' + g.status + '</span>' : '') +
        '</div></div>' +
      '<p class="text-sm font-medium text-gray-600 mb-2">' + (g.description||'') + '</p>' +
      '<p class="text-sm font-bold mb-1">Packages (' + (g.packages||[]).length + ')</p>' +
      '<div class="text-xs text-gray-500 mb-3">' + (g.packages||[]).map(function(p) { return p.label + ': ' + formatRp(p.price); }).join(', ') + '</div>' +
      '<div class="flex gap-2"><button class="game-edit px-4 py-2 text-xs font-black border-2 border-black bg-neon-green hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all" data-idx="' + i + '">Edit</button>' +
      '<button class="game-del px-4 py-2 text-xs font-black border-2 border-black bg-red-400 text-white hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all" data-idx="' + i + '">Hapus</button></div></div>').join('');
    list.querySelectorAll('.game-edit').forEach((b) => b.addEventListener('click', function() { openGameModal(parseInt(this.dataset.idx)); }));
    list.querySelectorAll('.game-del').forEach((b) => b.addEventListener('click', async function() {
      const games = await getGames();
      const filtered = filterGames(games);
      const g = filtered[parseInt(this.dataset.idx)];
      if (g && confirm('Hapus game ' + (g.name||'') + '?')) {
        await deleteGame(g.slug);
        await logAudit('delete', 'game', g.slug, { name: g.name });
        await renderGames();
      }
    }));
    renderGamesPagination(filtered.length);
  }

  var gameEditingIdx = -1;

  function openGameModal(idx) {
    gameEditingIdx = idx;
    var games = getGames();
    var g = idx >= 0 ? games[idx] : { name:'', slug:'', img:'/assets/mlbb.png', color:'#39FF14', badge:'New', category:'mobile', currency:'Diamond', description:'', packages:[] };
    document.getElementById('game-modal-title').textContent = idx >= 0 ? 'Edit Game' : 'Tambah Game';
    document.getElementById('game-edit-id').value = g.slug || '';
    document.getElementById('game-name').value = g.name || '';
    document.getElementById('game-slug').value = g.slug || '';
    document.getElementById('game-img').value = g.img || '/assets/mlbb.png';
    document.getElementById('game-color').value = g.color || '#39FF14';
    document.getElementById('game-badge').value = g.badge || 'New';
    document.getElementById('game-category').value = g.category || 'mobile';
    document.getElementById('game-currency').value = g.currency || 'Diamond';
    document.getElementById('game-desc').value = g.description || '';
    renderGamePackages(g.packages || []);
    document.getElementById('game-modal').classList.remove('hidden');
  }

  function renderGamePackages(pkgs) {
    var el = document.getElementById('game-packages');
    el.innerHTML = pkgs.map(function(p, i) { return '<div class="flex gap-2 items-center"><input class="pkg-label flex-1 px-2 py-1 border-2 border-black font-bold text-sm" value="' + (p.label||'') + '" placeholder="Label" /><input class="pkg-price w-28 px-2 py-1 border-2 border-black font-bold text-sm" type="number" value="' + (p.price||0) + '" placeholder="Price" /><button type="button" class="pkg-del px-2 py-1 text-xs font-black border-2 border-black bg-red-400 text-white" data-idx="' + i + '">X</button></div>'; }).join('');
    el.querySelectorAll('.pkg-del').forEach(function(b) { b.addEventListener('click', function() { var p = getPkgData(); p.splice(parseInt(this.dataset.idx),1); renderGamePackages(p); }); });
  }

  function getPkgData() {
    var items = document.querySelectorAll('#game-packages > div');
    return Array.from(items).map(function(d) { return { label: d.querySelector('.pkg-label').value, price: parseInt(d.querySelector('.pkg-price').value) || 0 }; });
  }

  document.getElementById('game-add-pkg').addEventListener('click', function() { var p = getPkgData(); p.push({label:'',price:0}); renderGamePackages(p); });

  document.getElementById('game-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    var data = {
      slug: document.getElementById('game-slug').value,
      name: document.getElementById('game-name').value,
      img: document.getElementById('game-img').value,
      color: document.getElementById('game-color').value,
      badge: document.getElementById('game-badge').value,
      category: document.getElementById('game-category').value,
      currency: document.getElementById('game-currency').value,
      description: document.getElementById('game-desc').value,
      packages: getPkgData().filter(function(p) { return p.label; }),
    };
    await saveGame(data, gameEditingIdx >= 0);
    await logAudit(gameEditingIdx >= 0 ? 'update' : 'create', 'game', data.slug, { name: data.name });
    document.getElementById('game-modal').classList.add('hidden');
    await renderGames();
  });

  document.getElementById('game-modal-close').addEventListener('click', function() { document.getElementById('game-modal').classList.add('hidden'); });

  // -------------------------------------------------------
  // GEAR CRUD (API-based)
  // -------------------------------------------------------

  let cachedGears = [];
  let gearCurrentPage = 1;
  const gearPerPage = 10;
  let gearSearchQuery = '';
  let gearStatusFilter = 'all';

  async function getGearItems() {
    try {
      const data = await apiFetch(API.gears);
      cachedGears = data.gears || [];
      return cachedGears;
    } catch(e) {
      return cachedGears;
    }
  }

  function filterGear(items) {
    let result = items;
    if (gearSearchQuery) {
      const q = gearSearchQuery.toLowerCase();
      result = result.filter(g => (g.name||'').toLowerCase().includes(q) || (g.slug||'').toLowerCase().includes(q));
    }
    if (gearStatusFilter !== 'all') {
      result = result.filter(g => (g.status || 'published') === gearStatusFilter);
    }
    return result;
  }

  function paginateGear(items) {
    const start = (gearCurrentPage - 1) * gearPerPage;
    return items.slice(start, start + gearPerPage);
  }

  function renderGearPagination(total) {
    const totalPages = Math.ceil(total / gearPerPage);
    const el = document.getElementById('gear-pagination');
    if (!el || totalPages <= 1) { if (el) el.innerHTML = ''; return; }
    let html = '';
    if (gearCurrentPage > 1) {
      html += '<button class="gear-page-btn px-4 py-2 font-black border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000] hover:bg-black hover:text-white transition-all" data-page="' + (gearCurrentPage - 1) + '">Sebelumnya</button>';
    }
    const maxPages = 5;
    let startPage = Math.max(1, gearCurrentPage - Math.floor(maxPages / 2));
    let endPage = Math.min(totalPages, startPage + maxPages - 1);
    if (endPage - startPage + 1 < maxPages) {
      startPage = Math.max(1, endPage - maxPages + 1);
    }
    for (let p = startPage; p <= endPage; p++) {
      html += '<button class="gear-page-btn w-10 h-10 font-black border-2 border-black ' + (p === gearCurrentPage ? 'bg-black text-neon-green shadow-[2px_2px_0px_0px_#000]' : 'bg-white hover:bg-black hover:text-white transition-all') + '" data-page="' + p + '">' + p + '</button>';
    }
    if (gearCurrentPage < totalPages) {
      html += '<button class="gear-page-btn px-4 py-2 font-black border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000] hover:bg-black hover:text-white transition-all" data-page="' + (gearCurrentPage + 1) + '">Berikutnya</button>';
    }
    el.innerHTML = html;
    el.querySelectorAll('.gear-page-btn').forEach(b => b.addEventListener('click', function() { gearCurrentPage = parseInt(this.dataset.page); renderGear(); }));
  }

  async function saveGearItem(gearData, isEdit) {
    return apiFetch(API.gears, {
      method: isEdit ? 'PUT' : 'POST',
      body: JSON.stringify(gearData),
    });
  }

  async function deleteGear(slug) {
    return apiFetch(API.gears + '?slug=' + encodeURIComponent(slug), { method: 'DELETE' });
  }

  async function renderGear() {
    var list = document.getElementById('gear-list');
    var items = await getGearItems();
    var filtered = filterGear(items);
    var paginated = paginateGear(filtered);
    var countLabel = document.getElementById('gear-count-label');
    if (countLabel) countLabel.textContent = filtered.length + ' dari ' + items.length + ' gear';
    if (paginated.length === 0) {
      list.innerHTML = '<div class="col-span-full text-center py-12 border-4 border-dashed border-black"><p class="text-xl font-black text-gray-400">Tidak ada gear yang cocok.</p></div>';
      renderGearPagination(0);
      return;
    }
    list.innerHTML = paginated.map(function(g, i) { return '<div class="border-4 border-black bg-white shadow-[4px_4px_0px_0px_#000] p-5">' +
      '<div class="flex justify-between items-start mb-3">' +
        '<div><h3 class="text-xl font-black">' + (g.name||'') + '</h3>' +
        '<p class="text-xs text-gray-500 font-bold">/' + (g.slug||'') + ' &middot; ' + (g.category||'') + '</p></div>' +
        '<div class="flex gap-1 items-center">' +
        '<span class="px-2 py-1 text-xs font-black border-2 border-black bg-neon-yellow">' + (g.tag||'') + '</span>' +
        (g.status ? '<span class="px-2 py-1 text-xs font-black border-2 border-black ' + (g.status === 'published' ? 'bg-neon-green' : g.status === 'draft' ? 'bg-yellow-400' : 'bg-gray-400') + '">' + g.status + '</span>' : '') +
        '</div></div>' +
      '<p class="text-sm font-medium text-gray-600 mb-2">' + (g.description||'') + '</p>' +
      '<p class="text-xl font-black text-neon-pink mb-2">' + formatRp(g.price) + '</p>' +
      '<p class="text-sm font-bold mb-1">Specs (' + (g.specs||[]).length + ')</p>' +
      '<div class="text-xs text-gray-500 mb-3">' + (g.specs||[]).map(function(s) { return s.label + ': ' + s.value; }).join(', ') + '</div>' +
      '<div class="flex gap-2"><button class="gear-edit px-4 py-2 text-xs font-black border-2 border-black bg-neon-green hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all" data-idx="' + i + '">Edit</button>' +
      '<button class="gear-del px-4 py-2 text-xs font-black border-2 border-black bg-red-400 text-white hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all" data-idx="' + i + '">Hapus</button></div></div>'; }).join('');
    list.querySelectorAll('.gear-edit').forEach(function(b) { b.addEventListener('click', function() { openGearModal(parseInt(this.dataset.idx)); }); });
    list.querySelectorAll('.gear-del').forEach(function(b) { b.addEventListener('click', async function() {
      const items = await getGearItems();
      const filtered = filterGear(items);
      const g = filtered[parseInt(this.dataset.idx)];
      if (g && confirm('Hapus gear ' + (g.name||'') + '?')) {
        await deleteGear(g.slug);
        await logAudit('delete', 'gear', g.slug, { name: g.name });
        await renderGear();
      }
    }); });
    renderGearPagination(filtered.length);
  }

  var gearEditingIdx = -1;

  function openGearModal(idx) {
    gearEditingIdx = idx;
    var items = getGearItems();
    var g = idx >= 0 ? items[idx] : { name:'', slug:'', img:'/assets/keyboard.png', price:0, tag:'Gaming', category:'keyboard', description:'', specs:[] };
    document.getElementById('gear-modal-title').textContent = idx >= 0 ? 'Edit Gear' : 'Tambah Gear';
    document.getElementById('gear-edit-id').value = g.slug || '';
    document.getElementById('gear-name').value = g.name || '';
    document.getElementById('gear-slug').value = g.slug || '';
    document.getElementById('gear-img').value = g.img || '/assets/keyboard.png';
    document.getElementById('gear-price').value = g.price || 0;
    document.getElementById('gear-tag').value = g.tag || 'Gaming';
    document.getElementById('gear-category').value = g.category || 'keyboard';
    document.getElementById('gear-desc').value = g.description || '';
    renderGearSpecs(g.specs || []);
    document.getElementById('gear-modal').classList.remove('hidden');
  }

  function renderGearSpecs(specs) {
    var el = document.getElementById('gear-specs');
    el.innerHTML = specs.map(function(s, i) { return '<div class="flex gap-2 items-center"><input class="spec-label flex-1 px-2 py-1 border-2 border-black font-bold text-sm" value="' + (s.label||'') + '" placeholder="Label" /><input class="spec-val flex-1 px-2 py-1 border-2 border-black font-bold text-sm" value="' + (s.value||'') + '" placeholder="Value" /><button type="button" class="spec-del px-2 py-1 text-xs font-black border-2 border-black bg-red-400 text-white" data-idx="' + i + '">X</button></div>'; }).join('');
    el.querySelectorAll('.spec-del').forEach(function(b) { b.addEventListener('click', function() { var s = getSpecData(); s.splice(parseInt(this.dataset.idx),1); renderGearSpecs(s); }); });
  }

  function getSpecData() {
    var items = document.querySelectorAll('#gear-specs > div');
    return Array.from(items).map(function(d) { return { label: d.querySelector('.spec-label').value, value: d.querySelector('.spec-val').value }; });
  }

  document.getElementById('gear-add-spec').addEventListener('click', function() { var s = getSpecData(); s.push({label:'',value:''}); renderGearSpecs(s); });

  document.getElementById('gear-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    var data = {
      slug: document.getElementById('gear-slug').value,
      name: document.getElementById('gear-name').value,
      img: document.getElementById('gear-img').value,
      price: parseInt(document.getElementById('gear-price').value) || 0,
      tag: document.getElementById('gear-tag').value,
      category: document.getElementById('gear-category').value,
      description: document.getElementById('gear-desc').value,
      specs: getSpecData().filter(function(s) { return s.label; }),
    };
    await saveGearItem(data, gearEditingIdx >= 0);
    await logAudit(gearEditingIdx >= 0 ? 'update' : 'create', 'gear', data.slug, { name: data.name, price: data.price });
    document.getElementById('gear-modal').classList.add('hidden');
    await renderGear();
  });

  document.getElementById('gear-modal-close').addEventListener('click', function() { document.getElementById('gear-modal').classList.add('hidden'); });

  // -------------------------------------------------------
  // ORDERS (API-based)
  // -------------------------------------------------------

  let allOrders = [];

  async function fetchOrders() {
    try {
      const data = await apiFetch(API.orders);
      allOrders = data.orders || [];
      return allOrders;
    } catch(e) {
      return allOrders;
    }
  }

  async function updateOrderStatus(orderId, newStatus) {
    return apiFetch(API.orders, {
      method: 'PUT',
      body: JSON.stringify({ order_id: orderId, status: newStatus }),
    });
  }

  async function renderOrders() {
    var orders = await fetchOrders();
    var tbody = document.getElementById('orders-table-body');
    var empty = document.getElementById('orders-empty');
    if (orders.length === 0) {
      tbody.innerHTML = '';
      empty.classList.remove('hidden');
      return;
    }
    empty.classList.add('hidden');
    tbody.innerHTML = orders.map(function(o) { return '<tr class="border-b-2 border-black/10 hover:bg-gray-50">' +
      '<td class="px-4 py-3 font-bold text-sm">' + (o.id||'') + '</td>' +
      '<td class="px-4 py-3 font-bold">' + (o.name||'') + '</td>' +
      '<td class="px-4 py-3 text-sm">' + (o.items?o.items.length:0) + ' item</td>' +
      '<td class="px-4 py-3 font-black text-neon-pink">' + formatRp(o.total) + '</td>' +
      '<td class="px-4 py-3">' + statusBadge(o.status) + '</td>' +
      '<td class="px-4 py-3 text-sm text-gray-500">' + (o.createdAt ? new Date(o.createdAt).toLocaleDateString('id-ID') : '-') + '</td>' +
      '<td class="px-4 py-3"><button class="order-status-edit px-3 py-1 text-xs font-black border-2 border-black hover:bg-black hover:text-white transition-all" data-id="' + (o.id||'') + '">Ubah</button></td></tr>'; }).join('');
    tbody.querySelectorAll('.order-status-edit').forEach(function(b) { b.addEventListener('click', function() { openStatusModal(this.dataset.id); }); });
  }

  var editingOrderId = null;

  async function openStatusModal(id) {
    editingOrderId = id;
    document.getElementById('modal-order-ref').textContent = 'Order #' + id;
    document.getElementById('modal-status-select').value = 'pending';
    document.getElementById('status-modal').classList.remove('hidden');
  }
  document.getElementById('modal-status-close').addEventListener('click', function() { document.getElementById('status-modal').classList.add('hidden'); });
  document.getElementById('modal-status-save').addEventListener('click', async function() {
    if (!editingOrderId) return;
    var ns = document.getElementById('modal-status-select').value;
    await updateOrderStatus(editingOrderId, ns);
    await logAudit('update', 'order', editingOrderId, { status: ns });
    document.getElementById('status-modal').classList.add('hidden');
    await renderOrders();
  });

  // -------------------------------------------------------
  // INIT
  // -------------------------------------------------------

    async function getAllOrders() {
    try {
      const data = await apiFetch(API.orders + '?limit=200');
      return data.orders || [];
    } catch(e) { return []; }
  }

  // -------------------------------------------------------
  // LAPORAN
  // -------------------------------------------------------

  async function renderLaporan() {
    var orders = await getAllOrders();
    var totalOrders = orders.length;
    var totalRevenue = orders.reduce(function(s, o) { return s + (o.total || 0); }, 0);
    var pending = orders.filter(function(o) { return o.status === 'pending'; }).length;
    var completed = orders.filter(function(o) { return o.status === 'completed'; }).length;
    var totalOrders = orders.length;
    var totalRevenue = orders.reduce(function(s, o) { return s + (o.total || 0); }, 0);
    var pending = orders.filter(function(o) { return o.status === 'pending'; }).length;
    var completed = orders.filter(function(o) { return o.status === 'completed'; }).length;

    document.getElementById('laporan-total-orders').textContent = totalOrders;
    document.getElementById('laporan-total-revenue').textContent = 'Rp ' + totalRevenue.toLocaleString('id-ID');
    document.getElementById('laporan-pending').textContent = pending;
    document.getElementById('laporan-completed').textContent = completed;

    var tbody = document.getElementById('laporan-table-body');
    var empty = document.getElementById('laporan-empty');
    if (orders.length === 0) {
      tbody.innerHTML = '';
      empty.classList.remove('hidden');
      return;
    }
    empty.classList.add('hidden');
    tbody.innerHTML = orders.map(function(o) {
      return '<tr class="border-b-2 border-black/10 hover:bg-gray-50">' +
        '<td class="px-4 py-3 font-bold text-sm">' + (o.id||'') + '</td>' +
        '<td class="px-4 py-3 font-bold text-sm">' + (o.name||'') + '</td>' +
        '<td class="px-4 py-3 text-sm">' + (o.items?o.items.length:0) + ' item</td>' +
        '<td class="px-4 py-3 font-black text-neon-pink text-sm">' + formatRp(o.total) + '</td>' +
        '<td class="px-4 py-3">' + statusBadge(o.status) + '</td>' +
        '<td class="px-4 py-3 text-xs text-gray-500">' + (o.createdAt ? new Date(o.createdAt).toLocaleDateString('id-ID') : '-') + '</td></tr>';
    }).join('');
  }

  // EXPORT CSV
  document.getElementById('export-csv')?.addEventListener('click', async function() {
    const orders = await getAllOrders();
    if (orders.length === 0) { alert('Tidak ada data transaksi untuk di-export.'); return; }
    var csv = '\\uFEFFID Order,Pelanggan,Email,Item,Total,Status,Pembayaran,Tanggal\\n';
    orders.forEach(function(o) {
      csv += (o.id||'') + ',' + (o.customer_name||o.name||'').replace(/,/g,' ') + ',' + (o.customer_email||o.userEmail||'') + ',' + (o.order_items||o.items? (o.order_items||o.items).length:0) + ' item' + ',' + (o.total||0) + ',' + (o.status||'') + ',' + (o.payment_method||o.payment||'') + ',' + (o.created_at||o.createdAt||'') + '\\n';
    });
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'topzone-laporan-' + new Date().toISOString().slice(0,10) + '.csv';
    link.click();
    alert('Laporan berhasil di-download!');
  });

  // -------------------------------------------------------
  // VOUCHERS CRUD
  // -------------------------------------------------------

  async function getVouchers() {
    try {
      const data = await apiFetch(API.vouchers);
      return data.vouchers || [];
    } catch(e) { return []; }
  }

  async function saveVoucher(vData, isEdit) {
    return apiFetch(API.vouchers, {
      method: isEdit ? 'PUT' : 'POST',
      body: JSON.stringify(vData),
    });
  }

  async function deleteVoucher(id) {
    return apiFetch(API.vouchers + '?id=' + encodeURIComponent(id), { method: 'DELETE' });
  }

  async function renderVouchers() {
    const vouchers = await getVouchers();
    const tbody = document.getElementById('vouchers-table-body');
    const empty = document.getElementById('vouchers-empty');
    if (vouchers.length === 0) {
      tbody.innerHTML = '';
      if (empty) empty.classList.remove('hidden');
      return;
    }
    if (empty) empty.classList.add('hidden');
    tbody.innerHTML = vouchers.map(function(v) {
      const discountText = v.discount_type === 'percentage' ? v.discount + '%' : formatRp(v.discount);
      const statusClass = v.is_active ? 'bg-neon-green' : 'bg-red-400';
      const statusText = v.is_active ? 'Aktif' : 'Nonaktif';
      return '<tr class="border-b-2 border-black/10 hover:bg-gray-50">' +
        '<td class="px-4 py-3 font-black text-sm">' + (v.code||'') + '</td>' +
        '<td class="px-4 py-3 font-bold">' + discountText + '</td>' +
        '<td class="px-4 py-3 text-sm">' + formatRp(v.min_purchase || 0) + '</td>' +
        '<td class="px-4 py-3 text-sm">' + (v.used_count||0) + 'x</td>' +
        '<td class="px-4 py-3 text-sm">' + (v.max_uses ? v.max_uses + 'x' : 'Unlimited') + '</td>' +
        '<td class="px-4 py-3"><span class="inline-block px-2 py-1 text-xs font-black border-2 border-black ' + statusClass + ' text-white">' + statusText + '</span></td>' +
        '<td class="px-4 py-3"><button class="voucher-del px-3 py-1 text-xs font-black border-2 border-black bg-red-400 text-white hover:shadow-none" data-id="' + (v.id||'') + '">Hapus</button></td></tr>';
    }).join('');
    tbody.querySelectorAll('.voucher-del').forEach(function(b) { b.addEventListener('click', async function() {
      if (confirm('Hapus voucher ini?')) {
        await deleteVoucher(this.dataset.id);
        await renderVouchers();
      }
    }); });
  }

  document.getElementById('voucher-add-btn')?.addEventListener('click', function() {
    document.getElementById('voucher-modal-title').textContent = 'Tambah Voucher';
    document.getElementById('voucher-edit-id').value = '';
    document.getElementById('voucher-code').value = '';
    document.getElementById('voucher-discount').value = '';
    document.getElementById('voucher-type').value = 'percentage';
    document.getElementById('voucher-min').value = '0';
    document.getElementById('voucher-max').value = '0';
    document.getElementById('voucher-expires').value = '';
    document.getElementById('voucher-modal').classList.remove('hidden');
  });

  document.getElementById('voucher-form')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const editId = document.getElementById('voucher-edit-id').value;
    const data = {
      code: document.getElementById('voucher-code').value,
      discount: parseInt(document.getElementById('voucher-discount').value) || 0,
      discount_type: document.getElementById('voucher-type').value,
      min_purchase: parseInt(document.getElementById('voucher-min').value) || 0,
      max_uses: parseInt(document.getElementById('voucher-max').value) || null,
      expires_at: document.getElementById('voucher-expires').value || null,
    };
    if (editId) data.id = editId;
    await saveVoucher(data, !!editId);
    await logAudit(editId ? 'update' : 'create', 'voucher', data.code);
    document.getElementById('voucher-modal').classList.add('hidden');
    await renderVouchers();
  });

  document.getElementById('voucher-modal-close')?.addEventListener('click', function() {
    document.getElementById('voucher-modal').classList.add('hidden');
  });

  async function renderAll() {
    await renderGames();
    await renderGear();
    await renderOrders();
    await renderLaporan();
    await renderVouchers();

    // Add search/filter event listeners for games
    const gameSearch = document.getElementById('game-search-input');
    if (gameSearch) {
      let searchTimeout;
      gameSearch.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => { renderGames(); }, 300);
      });
    }
    const gameStatus = document.getElementById('game-status-filter');
    if (gameStatus) {
      gameStatus.addEventListener('change', () => { renderGames(); });
    }

    // Add search/filter event listeners for gear
    const gearSearch = document.getElementById('gear-search-input');
    if (gearSearch) {
      let searchTimeout;
      gearSearch.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => { renderGear(); }, 300);
      });
    }
    const gearStatus = document.getElementById('gear-status-filter');
    if (gearStatus) {
      gearStatus.addEventListener('change', () => { renderGear(); });
    }

    // Export CSV handlers
    const gameExport = document.getElementById('game-export-csv');
    if (gameExport) {
      gameExport.addEventListener('click', async () => {
        const games = await getGames();
        if (games.length === 0) { alert('Tidak ada data untuk diexport.'); return; }
        var csv = '\uFEFFNama,Slug,Category,Currency,Badge,Status,Packages\\n';
        games.forEach(function(g) {
          csv += (g.name||'') + ',' + (g.slug||'') + ',' + (g.category||'') + ',' + (g.currency||'') + ',' + (g.badge||'') + ',' + (g.status||'published') + ',' + (g.packages||[]).map(function(p) { return p.label + ':' + p.price; }).join('; ') + '\\n';
        });
        var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        var link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'topzone-games-' + new Date().toISOString().slice(0,10) + '.csv';
        link.click();
      });
    }

    const gearExport = document.getElementById('gear-export-csv');
    if (gearExport) {
      gearExport.addEventListener('click', async () => {
        const items = await getGearItems();
        if (items.length === 0) { alert('Tidak ada data untuk diexport.'); return; }
        var csv = '\uFEFFNama,Slug,Category,Brand,Price,Tag,Status,Specs\\n';
        items.forEach(function(g) {
          csv += (g.name||'') + ',' + (g.slug||'') + ',' + (g.category||'') + ',' + (g.brand||'') + ',' + (g.price||0) + ',' + (g.tag||'') + ',' + (g.status||'published') + ',' + (g.specs||[]).map(function(s) { return s.label + ':' + s.value; }).join('; ') + '\\n';
        });
        var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        var link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'topzone-gears-' + new Date().toISOString().slice(0,10) + '.csv';
        link.click();
      });
    }
  }

  // Close modals on overlay click
  document.querySelectorAll('.fixed.inset-0').forEach(function(m) {
    m.addEventListener('click', function(e) { if (e.target === m) m.classList.add('hidden'); });
  });
<\/script>`], ["", ` <script>
  const API = {
    login: '/api/auth/admin-login',
    logout: '/api/auth/admin-logout',
    me: '/api/auth/admin-me',
    games: '/api/admin/games-crud',
    gears: '/api/admin/gears-crud',
    orders: '/api/admin/orders',
    vouchers: '/api/admin/vouchers',
    audit: '/api/admin/audit-log',
    reports: '/api/admin/reports',
  };
  const SESSION_TIME = 30 * 60 * 1000; // 30 menit
  const DEFAULT_GAMES = [
  {
    "slug": "mobile-legends",
    "name": "Mobile Legends",
    "img": "/assets/mlbb.png",
    "color": "#39FF14",
    "badge": "Terlaris",
    "category": "mobile",
    "currency": "Diamond",
    "description": "Top up diamond Mobile Legends Bang Bang dengan harga terbaik. Instan, aman, dan terpercaya.",
    "packages": [
      { "id": "mlbb-86", "label": "86 Diamond", "price": 19000 },
      { "id": "mlbb-172", "label": "172 Diamond", "price": 37000 },
      { "id": "mlbb-257", "label": "257 Diamond", "price": 55000 },
      { "id": "mlbb-344", "label": "344 Diamond", "price": 72000 },
      { "id": "mlbb-514", "label": "514 Diamond", "price": 108000 },
      { "id": "mlbb-706", "label": "706 Diamond", "price": 147000 }]},
  {
    "slug": "valorant",
    "name": "Valorant",
    "img": "/assets/valorant.png",
    "color": "#FF007F",
    "badge": "Trending",
    "category": "pc",
    "currency": "VP",
    "description": "Beli Valorant Points (VP) untuk unlock agent, skin senjata, dan battle pass favoritmu.",
    "packages": [
      { "id": "valo-420", "label": "420 VP", "price": 55000 },
      { "id": "valo-740", "label": "740 VP", "price": 95000 },
      { "id": "valo-1200", "label": "1.200 VP", "price": 150000 },
      { "id": "valo-2050", "label": "2.050 VP", "price": 255000 },
      { "id": "valo-3650", "label": "3.650 VP", "price": 450000 },
      { "id": "valo-5350", "label": "5.350 VP", "price": 650000 }]},
  {
    "slug": "free-fire",
    "name": "Free Fire",
    "img": "/assets/freefire.png",
    "color": "#FFE600",
    "badge": "Hot Deal",
    "category": "mobile",
    "currency": "Diamond",
    "description": "Top up diamond Free Fire untuk beli skin karakter, senjata, dan item eksklusif lainnya.",
    "packages": [
      { "id": "ff-70", "label": "70 Diamond", "price": 14000 },
      { "id": "ff-140", "label": "140 Diamond", "price": 27000 },
      { "id": "ff-355", "label": "355 Diamond", "price": 66000 },
      { "id": "ff-720", "label": "720 Diamond", "price": 132000 },
      { "id": "ff-1450", "label": "1.450 Diamond", "price": 260000 },
      { "id": "ff-2180", "label": "2.180 Diamond", "price": 385000 }]}];
  const DEFAULT_GEARS = [
  {
    "slug": "mechanical-keyboard",
    "name": "Mechanical Keyboard",
    "img": "/assets/keyboard.png",
    "price": 350000,
    "tag": "RGB Ready",
    "category": "keyboard",
    "description": "Keyboard mekanikal 75% compact dengan switch taktil dan RGB per-key. Cocok untuk gaming marathon.",
    "specs": [
      { "label": "Layout", "value": "75% Compact" },
      { "label": "Switch", "value": "Blue Tactile" },
      { "label": "Backlight", "value": "Per-key RGB" },
      { "label": "Interface", "value": "USB-C + Wireless" },
      { "label": "Battery", "value": "4000 mAh" }]},
  {
    "slug": "gaming-mouse",
    "name": "Gaming Mouse",
    "img": "/assets/mouse.png",
    "price": 250000,
    "tag": "12000 DPI",
    "category": "mouse",
    "description": "Mouse gaming ergonomis dengan sensor optik presisi tinggi, 7 tombol programmable, dan RGB side strip.",
    "specs": [
      { "label": "DPI", "value": "200 – 12.000" },
      { "label": "Polling Rate", "value": "1000 Hz" },
      { "label": "Buttons", "value": "7 programmable" },
      { "label": "Weight", "value": "88g" },
      { "label": "Interface", "value": "USB 2.0" }]},
  {
    "slug": "rgb-headset",
    "name": "RGB Headset",
    "img": "/assets/headset.png",
    "price": 300000,
    "tag": "Surround Sound",
    "category": "headset",
    "description": "Headset gaming dengan virtual 7.1 surround sound, mikrofon noise-cancelling, dan RGB earcup.",
    "specs": [
      { "label": "Driver", "value": "50mm Neodymium" },
      { "label": "Frequency", "value": "20Hz – 20kHz" },
      { "label": "Microphone", "value": "Noise-cancelling" },
      { "label": "Audio", "value": "Virtual 7.1 Surround" },
      { "label": "Interface", "value": "3.5mm + USB" }]}];
  // -------------------------------------------------------
  // SECURITY: Session Management (API-based)
  // -------------------------------------------------------

  let adminUser = null;
  let sessionExpiry = 0;

  /** Fetch /api/auth/admin-me to verify session server-side */
  async function checkSession() {
    try {
      const res = await fetch(API.me);
      const data = await res.json();
      if (data.admin) {
        adminUser = data.admin;
        sessionExpiry = Date.now() + SESSION_TIME;
        return true;
      }
    } catch(e) {
      console.warn('Admin session check failed:', e);
      adminUser = null;
      return false;
    }

  /** Login via Supabase Auth API */
  async function loginAdmin(email, password) {
    const res = await fetch(API.login, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  }

  /** Logout via API */
  async function logoutAdmin() {
    await fetch(API.logout, { method: 'POST' });
    adminUser = null;
  }

  /** Log admin action to audit trail */
  async function logAudit(action, entityType, entityId, details = {}) {
    if (!adminUser) return;
    try {
      await fetch(API.audit, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admin_email: adminUser.email,
          action,
          entity_type: entityType,
          entity_id: entityId || null,
          details,
        }),
      });
    } catch(e) {
      // Silent failure for audit logging (non-critical feature)
    }
  }

  /** Generic fetch helper with admin session check */
  async function apiFetch(url, options = {}) {
    const res = await fetch(url, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers },
    });
    if (res.status === 401) {
      adminUser = null;
      showGate();
      throw new Error('Session expired');
    }
    return res.json();
  }

  // Session timer display
  function updateSessionTimer() {
    const el = document.getElementById('session-timer');
    if (!el) return;
    if (!adminUser) { el.textContent = ''; return; }
    const remaining = Math.max(0, sessionExpiry - Date.now());
    const min = Math.floor(remaining / 60000);
    const sec = Math.floor((remaining % 60000) / 1000);
    el.textContent = 'Sesi: ' + min + 'm ' + sec.toString().padStart(2,'0') + 's';
    if (remaining <= 0 && adminUser) {
      logoutAdmin().then(() => showGate());
    }
  }
  setInterval(updateSessionTimer, 1000);

  // -------------------------------------------------------
  // AUTH (API-based)
  // -------------------------------------------------------

  let loginAttempts = 0;
  let loginCooldown = false;

  function showGate() {
    document.getElementById('login-gate').classList.remove('hidden');
    document.getElementById('admin-dashboard').classList.add('hidden');
  }

  async function showDashboard() {
    document.getElementById('login-gate').classList.add('hidden');
    document.getElementById('admin-dashboard').classList.remove('hidden');
    sessionExpiry = Date.now() + SESSION_TIME;
    await renderAll();
  }

  // Check session on load
  checkSession().then((valid) => { if (valid) showDashboard(); });

  document.getElementById('admin-login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const err = document.getElementById('admin-login-error');
    const btn = document.getElementById('admin-login-btn');

    if (loginCooldown) {
      err.textContent = 'Terlalu banyak percobaan. Tunggu beberapa saat.';
      err.classList.remove('hidden');
      return;
    }

    const emailInput = document.getElementById('admin-email');
    const passInput = document.getElementById('admin-password');
    const email = emailInput ? emailInput.value : '';
    const pass = passInput ? passInput.value : '';
    btn.disabled = true;
    btn.textContent = 'Memproses...';

    try {
      const result = await loginAdmin(email, pass);
      if (result.success && result.admin) {
        loginAttempts = 0;
        adminUser = result.admin;
        showDashboard();
        err.classList.add('hidden');
      } else {
        loginAttempts++;
        err.textContent = result.error || 'Email atau password salah! (Percobaan: ' + loginAttempts + ')';
        err.classList.remove('hidden');
      }
    } catch(e) {
      err.textContent = 'Gagal terhubung ke server. Coba lagi.';
      err.classList.remove('hidden');
    }
    btn.disabled = false;
    btn.textContent = 'Masuk ke Admin';

    if (loginAttempts >= 5) {
      loginCooldown = true;
      btn.disabled = true;
      btn.textContent = 'Tunggu 30 detik...';
      setTimeout(() => {
        loginCooldown = false;
        loginAttempts = 0;
        btn.disabled = false;
        btn.textContent = 'Masuk ke Admin';
        err.textContent = 'Coba lagi.';
      }, 30000);
    }
  });

  document.getElementById('admin-logout').addEventListener('click', async () => {
    await logoutAdmin();
    showGate();
  });

  // -------------------------------------------------------
  // TAB SWITCHING
  // -------------------------------------------------------

  document.querySelectorAll('.admin-tab').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.admin-tab').forEach((b) => { b.style.background = '#fff'; });
      btn.style.background = '#39FF14';
      ['games','gear','orders','vouchers','reports'].forEach((p) => {
        document.getElementById('panel-' + p).classList.add('hidden');
      });
      document.getElementById('panel-' + btn.dataset.tab).classList.remove('hidden');
    });
  });

  // -------------------------------------------------------
  // HELPERS
  // -------------------------------------------------------

  function formatRp(n) { return 'Rp ' + Number(n).toLocaleString('id-ID'); }

  function statusBadge(s) {
    const m = { pending: 'bg-yellow-400', processing: 'bg-blue-400', completed: 'bg-neon-green', cancelled: 'bg-red-400' };
    const l = { pending: 'Pending', processing: 'Diproses', completed: 'Selesai', cancelled: 'Dibatalkan' };
    return '<span class="inline-block px-2 py-1 text-xs font-black uppercase tracking-wider border-2 border-black ' + (m[s]||'bg-gray-400') + '">' + (l[s]||s) + '</span>';
  }

  function randomId() { return Date.now().toString(36) + '-' + Math.random().toString(36).substr(2,6); }

  // -------------------------------------------------------
  // GAMES CRUD (API-based)
  // -------------------------------------------------------

  let cachedGames = [];
  let gamesCurrentPage = 1;
  const gamesPerPage = 10;
  let gamesSearchQuery = '';
  let gamesStatusFilter = 'all';

  async function getGames() {
    try {
      const data = await apiFetch(API.games);
      cachedGames = data.games || [];
      return cachedGames;
    } catch(e) {
      return cachedGames;
    }
  }

  function filterGames(games) {
    let result = games;
    if (gamesSearchQuery) {
      const q = gamesSearchQuery.toLowerCase();
      result = result.filter(g => (g.name||'').toLowerCase().includes(q) || (g.slug||'').toLowerCase().includes(q));
    }
    if (gamesStatusFilter !== 'all') {
      result = result.filter(g => (g.status || 'published') === gamesStatusFilter);
    }
    return result;
  }

  function paginateGames(games) {
    const start = (gamesCurrentPage - 1) * gamesPerPage;
    return games.slice(start, start + gamesPerPage);
  }

  function renderGamesPagination(total) {
    const totalPages = Math.ceil(total / gamesPerPage);
    const el = document.getElementById('games-pagination');
    if (!el || totalPages <= 1) { if (el) el.innerHTML = ''; return; }
    let html = '';
    if (gamesCurrentPage > 1) {
      html += '<button class="game-page-btn px-4 py-2 font-black border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000] hover:bg-black hover:text-white transition-all" data-page="' + (gamesCurrentPage - 1) + '">Sebelumnya</button>';
    }
    const maxPages = 5;
    let startPage = Math.max(1, gamesCurrentPage - Math.floor(maxPages / 2));
    let endPage = Math.min(totalPages, startPage + maxPages - 1);
    if (endPage - startPage + 1 < maxPages) {
      startPage = Math.max(1, endPage - maxPages + 1);
    }
    for (let p = startPage; p <= endPage; p++) {
      html += '<button class="game-page-btn w-10 h-10 font-black border-2 border-black ' + (p === gamesCurrentPage ? 'bg-black text-neon-green shadow-[2px_2px_0px_0px_#000]' : 'bg-white hover:bg-black hover:text-white transition-all') + '" data-page="' + p + '">' + p + '</button>';
    }
    if (gamesCurrentPage < totalPages) {
      html += '<button class="game-page-btn px-4 py-2 font-black border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000] hover:bg-black hover:text-white transition-all" data-page="' + (gamesCurrentPage + 1) + '">Berikutnya</button>';
    }
    el.innerHTML = html;
    el.querySelectorAll('.game-page-btn').forEach(b => b.addEventListener('click', function() { gamesCurrentPage = parseInt(this.dataset.page); renderGames(); }));
  }

  async function renderGames() {
    const list = document.getElementById('games-list');
    const games = await getGames();
    const filtered = filterGames(games);
    const paginated = paginateGames(filtered);
    const countLabel = document.getElementById('game-count-label');
    if (countLabel) countLabel.textContent = filtered.length + ' dari ' + games.length + ' game';
    if (paginated.length === 0) {
      list.innerHTML = '<div class="col-span-full text-center py-12 border-4 border-dashed border-black"><p class="text-xl font-black text-gray-400">Tidak ada game yang cocok.</p></div>';
      renderGamesPagination(0);
      return;
    }
    list.innerHTML = paginated.map((g, i) => '<div class="border-4 border-black bg-white shadow-[4px_4px_0px_0px_#000] p-5">' +
      '<div class="flex justify-between items-start mb-3">' +
        '<div><h3 class="text-xl font-black">' + (g.name||'') + '</h3>' +
        '<p class="text-xs text-gray-500 font-bold">/' + (g.slug||'') + ' &middot; ' + (g.currency||'') + '</p></div>' +
        '<div class="flex gap-1 items-center">' +
        '<span class="px-2 py-1 text-xs font-black border-2 border-black" style="background:' + (g.color||'#39FF14') + '">' + (g.badge||'') + '</span>' +
        (g.status ? '<span class="px-2 py-1 text-xs font-black border-2 border-black ' + (g.status === 'published' ? 'bg-neon-green' : g.status === 'draft' ? 'bg-yellow-400' : 'bg-gray-400') + '">' + g.status + '</span>' : '') +
        '</div></div>' +
      '<p class="text-sm font-medium text-gray-600 mb-2">' + (g.description||'') + '</p>' +
      '<p class="text-sm font-bold mb-1">Packages (' + (g.packages||[]).length + ')</p>' +
      '<div class="text-xs text-gray-500 mb-3">' + (g.packages||[]).map(function(p) { return p.label + ': ' + formatRp(p.price); }).join(', ') + '</div>' +
      '<div class="flex gap-2"><button class="game-edit px-4 py-2 text-xs font-black border-2 border-black bg-neon-green hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all" data-idx="' + i + '">Edit</button>' +
      '<button class="game-del px-4 py-2 text-xs font-black border-2 border-black bg-red-400 text-white hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all" data-idx="' + i + '">Hapus</button></div></div>').join('');
    list.querySelectorAll('.game-edit').forEach((b) => b.addEventListener('click', function() { openGameModal(parseInt(this.dataset.idx)); }));
    list.querySelectorAll('.game-del').forEach((b) => b.addEventListener('click', async function() {
      const games = await getGames();
      const filtered = filterGames(games);
      const g = filtered[parseInt(this.dataset.idx)];
      if (g && confirm('Hapus game ' + (g.name||'') + '?')) {
        await deleteGame(g.slug);
        await logAudit('delete', 'game', g.slug, { name: g.name });
        await renderGames();
      }
    }));
    renderGamesPagination(filtered.length);
  }

  var gameEditingIdx = -1;

  function openGameModal(idx) {
    gameEditingIdx = idx;
    var games = getGames();
    var g = idx >= 0 ? games[idx] : { name:'', slug:'', img:'/assets/mlbb.png', color:'#39FF14', badge:'New', category:'mobile', currency:'Diamond', description:'', packages:[] };
    document.getElementById('game-modal-title').textContent = idx >= 0 ? 'Edit Game' : 'Tambah Game';
    document.getElementById('game-edit-id').value = g.slug || '';
    document.getElementById('game-name').value = g.name || '';
    document.getElementById('game-slug').value = g.slug || '';
    document.getElementById('game-img').value = g.img || '/assets/mlbb.png';
    document.getElementById('game-color').value = g.color || '#39FF14';
    document.getElementById('game-badge').value = g.badge || 'New';
    document.getElementById('game-category').value = g.category || 'mobile';
    document.getElementById('game-currency').value = g.currency || 'Diamond';
    document.getElementById('game-desc').value = g.description || '';
    renderGamePackages(g.packages || []);
    document.getElementById('game-modal').classList.remove('hidden');
  }

  function renderGamePackages(pkgs) {
    var el = document.getElementById('game-packages');
    el.innerHTML = pkgs.map(function(p, i) { return '<div class="flex gap-2 items-center"><input class="pkg-label flex-1 px-2 py-1 border-2 border-black font-bold text-sm" value="' + (p.label||'') + '" placeholder="Label" /><input class="pkg-price w-28 px-2 py-1 border-2 border-black font-bold text-sm" type="number" value="' + (p.price||0) + '" placeholder="Price" /><button type="button" class="pkg-del px-2 py-1 text-xs font-black border-2 border-black bg-red-400 text-white" data-idx="' + i + '">X</button></div>'; }).join('');
    el.querySelectorAll('.pkg-del').forEach(function(b) { b.addEventListener('click', function() { var p = getPkgData(); p.splice(parseInt(this.dataset.idx),1); renderGamePackages(p); }); });
  }

  function getPkgData() {
    var items = document.querySelectorAll('#game-packages > div');
    return Array.from(items).map(function(d) { return { label: d.querySelector('.pkg-label').value, price: parseInt(d.querySelector('.pkg-price').value) || 0 }; });
  }

  document.getElementById('game-add-pkg').addEventListener('click', function() { var p = getPkgData(); p.push({label:'',price:0}); renderGamePackages(p); });

  document.getElementById('game-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    var data = {
      slug: document.getElementById('game-slug').value,
      name: document.getElementById('game-name').value,
      img: document.getElementById('game-img').value,
      color: document.getElementById('game-color').value,
      badge: document.getElementById('game-badge').value,
      category: document.getElementById('game-category').value,
      currency: document.getElementById('game-currency').value,
      description: document.getElementById('game-desc').value,
      packages: getPkgData().filter(function(p) { return p.label; }),
    };
    await saveGame(data, gameEditingIdx >= 0);
    await logAudit(gameEditingIdx >= 0 ? 'update' : 'create', 'game', data.slug, { name: data.name });
    document.getElementById('game-modal').classList.add('hidden');
    await renderGames();
  });

  document.getElementById('game-modal-close').addEventListener('click', function() { document.getElementById('game-modal').classList.add('hidden'); });

  // -------------------------------------------------------
  // GEAR CRUD (API-based)
  // -------------------------------------------------------

  let cachedGears = [];
  let gearCurrentPage = 1;
  const gearPerPage = 10;
  let gearSearchQuery = '';
  let gearStatusFilter = 'all';

  async function getGearItems() {
    try {
      const data = await apiFetch(API.gears);
      cachedGears = data.gears || [];
      return cachedGears;
    } catch(e) {
      return cachedGears;
    }
  }

  function filterGear(items) {
    let result = items;
    if (gearSearchQuery) {
      const q = gearSearchQuery.toLowerCase();
      result = result.filter(g => (g.name||'').toLowerCase().includes(q) || (g.slug||'').toLowerCase().includes(q));
    }
    if (gearStatusFilter !== 'all') {
      result = result.filter(g => (g.status || 'published') === gearStatusFilter);
    }
    return result;
  }

  function paginateGear(items) {
    const start = (gearCurrentPage - 1) * gearPerPage;
    return items.slice(start, start + gearPerPage);
  }

  function renderGearPagination(total) {
    const totalPages = Math.ceil(total / gearPerPage);
    const el = document.getElementById('gear-pagination');
    if (!el || totalPages <= 1) { if (el) el.innerHTML = ''; return; }
    let html = '';
    if (gearCurrentPage > 1) {
      html += '<button class="gear-page-btn px-4 py-2 font-black border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000] hover:bg-black hover:text-white transition-all" data-page="' + (gearCurrentPage - 1) + '">Sebelumnya</button>';
    }
    const maxPages = 5;
    let startPage = Math.max(1, gearCurrentPage - Math.floor(maxPages / 2));
    let endPage = Math.min(totalPages, startPage + maxPages - 1);
    if (endPage - startPage + 1 < maxPages) {
      startPage = Math.max(1, endPage - maxPages + 1);
    }
    for (let p = startPage; p <= endPage; p++) {
      html += '<button class="gear-page-btn w-10 h-10 font-black border-2 border-black ' + (p === gearCurrentPage ? 'bg-black text-neon-green shadow-[2px_2px_0px_0px_#000]' : 'bg-white hover:bg-black hover:text-white transition-all') + '" data-page="' + p + '">' + p + '</button>';
    }
    if (gearCurrentPage < totalPages) {
      html += '<button class="gear-page-btn px-4 py-2 font-black border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000] hover:bg-black hover:text-white transition-all" data-page="' + (gearCurrentPage + 1) + '">Berikutnya</button>';
    }
    el.innerHTML = html;
    el.querySelectorAll('.gear-page-btn').forEach(b => b.addEventListener('click', function() { gearCurrentPage = parseInt(this.dataset.page); renderGear(); }));
  }

  async function saveGearItem(gearData, isEdit) {
    return apiFetch(API.gears, {
      method: isEdit ? 'PUT' : 'POST',
      body: JSON.stringify(gearData),
    });
  }

  async function deleteGear(slug) {
    return apiFetch(API.gears + '?slug=' + encodeURIComponent(slug), { method: 'DELETE' });
  }

  async function renderGear() {
    var list = document.getElementById('gear-list');
    var items = await getGearItems();
    var filtered = filterGear(items);
    var paginated = paginateGear(filtered);
    var countLabel = document.getElementById('gear-count-label');
    if (countLabel) countLabel.textContent = filtered.length + ' dari ' + items.length + ' gear';
    if (paginated.length === 0) {
      list.innerHTML = '<div class="col-span-full text-center py-12 border-4 border-dashed border-black"><p class="text-xl font-black text-gray-400">Tidak ada gear yang cocok.</p></div>';
      renderGearPagination(0);
      return;
    }
    list.innerHTML = paginated.map(function(g, i) { return '<div class="border-4 border-black bg-white shadow-[4px_4px_0px_0px_#000] p-5">' +
      '<div class="flex justify-between items-start mb-3">' +
        '<div><h3 class="text-xl font-black">' + (g.name||'') + '</h3>' +
        '<p class="text-xs text-gray-500 font-bold">/' + (g.slug||'') + ' &middot; ' + (g.category||'') + '</p></div>' +
        '<div class="flex gap-1 items-center">' +
        '<span class="px-2 py-1 text-xs font-black border-2 border-black bg-neon-yellow">' + (g.tag||'') + '</span>' +
        (g.status ? '<span class="px-2 py-1 text-xs font-black border-2 border-black ' + (g.status === 'published' ? 'bg-neon-green' : g.status === 'draft' ? 'bg-yellow-400' : 'bg-gray-400') + '">' + g.status + '</span>' : '') +
        '</div></div>' +
      '<p class="text-sm font-medium text-gray-600 mb-2">' + (g.description||'') + '</p>' +
      '<p class="text-xl font-black text-neon-pink mb-2">' + formatRp(g.price) + '</p>' +
      '<p class="text-sm font-bold mb-1">Specs (' + (g.specs||[]).length + ')</p>' +
      '<div class="text-xs text-gray-500 mb-3">' + (g.specs||[]).map(function(s) { return s.label + ': ' + s.value; }).join(', ') + '</div>' +
      '<div class="flex gap-2"><button class="gear-edit px-4 py-2 text-xs font-black border-2 border-black bg-neon-green hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all" data-idx="' + i + '">Edit</button>' +
      '<button class="gear-del px-4 py-2 text-xs font-black border-2 border-black bg-red-400 text-white hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all" data-idx="' + i + '">Hapus</button></div></div>'; }).join('');
    list.querySelectorAll('.gear-edit').forEach(function(b) { b.addEventListener('click', function() { openGearModal(parseInt(this.dataset.idx)); }); });
    list.querySelectorAll('.gear-del').forEach(function(b) { b.addEventListener('click', async function() {
      const items = await getGearItems();
      const filtered = filterGear(items);
      const g = filtered[parseInt(this.dataset.idx)];
      if (g && confirm('Hapus gear ' + (g.name||'') + '?')) {
        await deleteGear(g.slug);
        await logAudit('delete', 'gear', g.slug, { name: g.name });
        await renderGear();
      }
    }); });
    renderGearPagination(filtered.length);
  }

  var gearEditingIdx = -1;

  function openGearModal(idx) {
    gearEditingIdx = idx;
    var items = getGearItems();
    var g = idx >= 0 ? items[idx] : { name:'', slug:'', img:'/assets/keyboard.png', price:0, tag:'Gaming', category:'keyboard', description:'', specs:[] };
    document.getElementById('gear-modal-title').textContent = idx >= 0 ? 'Edit Gear' : 'Tambah Gear';
    document.getElementById('gear-edit-id').value = g.slug || '';
    document.getElementById('gear-name').value = g.name || '';
    document.getElementById('gear-slug').value = g.slug || '';
    document.getElementById('gear-img').value = g.img || '/assets/keyboard.png';
    document.getElementById('gear-price').value = g.price || 0;
    document.getElementById('gear-tag').value = g.tag || 'Gaming';
    document.getElementById('gear-category').value = g.category || 'keyboard';
    document.getElementById('gear-desc').value = g.description || '';
    renderGearSpecs(g.specs || []);
    document.getElementById('gear-modal').classList.remove('hidden');
  }

  function renderGearSpecs(specs) {
    var el = document.getElementById('gear-specs');
    el.innerHTML = specs.map(function(s, i) { return '<div class="flex gap-2 items-center"><input class="spec-label flex-1 px-2 py-1 border-2 border-black font-bold text-sm" value="' + (s.label||'') + '" placeholder="Label" /><input class="spec-val flex-1 px-2 py-1 border-2 border-black font-bold text-sm" value="' + (s.value||'') + '" placeholder="Value" /><button type="button" class="spec-del px-2 py-1 text-xs font-black border-2 border-black bg-red-400 text-white" data-idx="' + i + '">X</button></div>'; }).join('');
    el.querySelectorAll('.spec-del').forEach(function(b) { b.addEventListener('click', function() { var s = getSpecData(); s.splice(parseInt(this.dataset.idx),1); renderGearSpecs(s); }); });
  }

  function getSpecData() {
    var items = document.querySelectorAll('#gear-specs > div');
    return Array.from(items).map(function(d) { return { label: d.querySelector('.spec-label').value, value: d.querySelector('.spec-val').value }; });
  }

  document.getElementById('gear-add-spec').addEventListener('click', function() { var s = getSpecData(); s.push({label:'',value:''}); renderGearSpecs(s); });

  document.getElementById('gear-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    var data = {
      slug: document.getElementById('gear-slug').value,
      name: document.getElementById('gear-name').value,
      img: document.getElementById('gear-img').value,
      price: parseInt(document.getElementById('gear-price').value) || 0,
      tag: document.getElementById('gear-tag').value,
      category: document.getElementById('gear-category').value,
      description: document.getElementById('gear-desc').value,
      specs: getSpecData().filter(function(s) { return s.label; }),
    };
    await saveGearItem(data, gearEditingIdx >= 0);
    await logAudit(gearEditingIdx >= 0 ? 'update' : 'create', 'gear', data.slug, { name: data.name, price: data.price });
    document.getElementById('gear-modal').classList.add('hidden');
    await renderGear();
  });

  document.getElementById('gear-modal-close').addEventListener('click', function() { document.getElementById('gear-modal').classList.add('hidden'); });

  // -------------------------------------------------------
  // ORDERS (API-based)
  // -------------------------------------------------------

  let allOrders = [];

  async function fetchOrders() {
    try {
      const data = await apiFetch(API.orders);
      allOrders = data.orders || [];
      return allOrders;
    } catch(e) {
      return allOrders;
    }
  }

  async function updateOrderStatus(orderId, newStatus) {
    return apiFetch(API.orders, {
      method: 'PUT',
      body: JSON.stringify({ order_id: orderId, status: newStatus }),
    });
  }

  async function renderOrders() {
    var orders = await fetchOrders();
    var tbody = document.getElementById('orders-table-body');
    var empty = document.getElementById('orders-empty');
    if (orders.length === 0) {
      tbody.innerHTML = '';
      empty.classList.remove('hidden');
      return;
    }
    empty.classList.add('hidden');
    tbody.innerHTML = orders.map(function(o) { return '<tr class="border-b-2 border-black/10 hover:bg-gray-50">' +
      '<td class="px-4 py-3 font-bold text-sm">' + (o.id||'') + '</td>' +
      '<td class="px-4 py-3 font-bold">' + (o.name||'') + '</td>' +
      '<td class="px-4 py-3 text-sm">' + (o.items?o.items.length:0) + ' item</td>' +
      '<td class="px-4 py-3 font-black text-neon-pink">' + formatRp(o.total) + '</td>' +
      '<td class="px-4 py-3">' + statusBadge(o.status) + '</td>' +
      '<td class="px-4 py-3 text-sm text-gray-500">' + (o.createdAt ? new Date(o.createdAt).toLocaleDateString('id-ID') : '-') + '</td>' +
      '<td class="px-4 py-3"><button class="order-status-edit px-3 py-1 text-xs font-black border-2 border-black hover:bg-black hover:text-white transition-all" data-id="' + (o.id||'') + '">Ubah</button></td></tr>'; }).join('');
    tbody.querySelectorAll('.order-status-edit').forEach(function(b) { b.addEventListener('click', function() { openStatusModal(this.dataset.id); }); });
  }

  var editingOrderId = null;

  async function openStatusModal(id) {
    editingOrderId = id;
    document.getElementById('modal-order-ref').textContent = 'Order #' + id;
    document.getElementById('modal-status-select').value = 'pending';
    document.getElementById('status-modal').classList.remove('hidden');
  }
  document.getElementById('modal-status-close').addEventListener('click', function() { document.getElementById('status-modal').classList.add('hidden'); });
  document.getElementById('modal-status-save').addEventListener('click', async function() {
    if (!editingOrderId) return;
    var ns = document.getElementById('modal-status-select').value;
    await updateOrderStatus(editingOrderId, ns);
    await logAudit('update', 'order', editingOrderId, { status: ns });
    document.getElementById('status-modal').classList.add('hidden');
    await renderOrders();
  });

  // -------------------------------------------------------
  // INIT
  // -------------------------------------------------------

    async function getAllOrders() {
    try {
      const data = await apiFetch(API.orders + '?limit=200');
      return data.orders || [];
    } catch(e) { return []; }
  }

  // -------------------------------------------------------
  // LAPORAN
  // -------------------------------------------------------

  async function renderLaporan() {
    var orders = await getAllOrders();
    var totalOrders = orders.length;
    var totalRevenue = orders.reduce(function(s, o) { return s + (o.total || 0); }, 0);
    var pending = orders.filter(function(o) { return o.status === 'pending'; }).length;
    var completed = orders.filter(function(o) { return o.status === 'completed'; }).length;
    var totalOrders = orders.length;
    var totalRevenue = orders.reduce(function(s, o) { return s + (o.total || 0); }, 0);
    var pending = orders.filter(function(o) { return o.status === 'pending'; }).length;
    var completed = orders.filter(function(o) { return o.status === 'completed'; }).length;

    document.getElementById('laporan-total-orders').textContent = totalOrders;
    document.getElementById('laporan-total-revenue').textContent = 'Rp ' + totalRevenue.toLocaleString('id-ID');
    document.getElementById('laporan-pending').textContent = pending;
    document.getElementById('laporan-completed').textContent = completed;

    var tbody = document.getElementById('laporan-table-body');
    var empty = document.getElementById('laporan-empty');
    if (orders.length === 0) {
      tbody.innerHTML = '';
      empty.classList.remove('hidden');
      return;
    }
    empty.classList.add('hidden');
    tbody.innerHTML = orders.map(function(o) {
      return '<tr class="border-b-2 border-black/10 hover:bg-gray-50">' +
        '<td class="px-4 py-3 font-bold text-sm">' + (o.id||'') + '</td>' +
        '<td class="px-4 py-3 font-bold text-sm">' + (o.name||'') + '</td>' +
        '<td class="px-4 py-3 text-sm">' + (o.items?o.items.length:0) + ' item</td>' +
        '<td class="px-4 py-3 font-black text-neon-pink text-sm">' + formatRp(o.total) + '</td>' +
        '<td class="px-4 py-3">' + statusBadge(o.status) + '</td>' +
        '<td class="px-4 py-3 text-xs text-gray-500">' + (o.createdAt ? new Date(o.createdAt).toLocaleDateString('id-ID') : '-') + '</td></tr>';
    }).join('');
  }

  // EXPORT CSV
  document.getElementById('export-csv')?.addEventListener('click', async function() {
    const orders = await getAllOrders();
    if (orders.length === 0) { alert('Tidak ada data transaksi untuk di-export.'); return; }
    var csv = '\\\\uFEFFID Order,Pelanggan,Email,Item,Total,Status,Pembayaran,Tanggal\\\\n';
    orders.forEach(function(o) {
      csv += (o.id||'') + ',' + (o.customer_name||o.name||'').replace(/,/g,' ') + ',' + (o.customer_email||o.userEmail||'') + ',' + (o.order_items||o.items? (o.order_items||o.items).length:0) + ' item' + ',' + (o.total||0) + ',' + (o.status||'') + ',' + (o.payment_method||o.payment||'') + ',' + (o.created_at||o.createdAt||'') + '\\\\n';
    });
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'topzone-laporan-' + new Date().toISOString().slice(0,10) + '.csv';
    link.click();
    alert('Laporan berhasil di-download!');
  });

  // -------------------------------------------------------
  // VOUCHERS CRUD
  // -------------------------------------------------------

  async function getVouchers() {
    try {
      const data = await apiFetch(API.vouchers);
      return data.vouchers || [];
    } catch(e) { return []; }
  }

  async function saveVoucher(vData, isEdit) {
    return apiFetch(API.vouchers, {
      method: isEdit ? 'PUT' : 'POST',
      body: JSON.stringify(vData),
    });
  }

  async function deleteVoucher(id) {
    return apiFetch(API.vouchers + '?id=' + encodeURIComponent(id), { method: 'DELETE' });
  }

  async function renderVouchers() {
    const vouchers = await getVouchers();
    const tbody = document.getElementById('vouchers-table-body');
    const empty = document.getElementById('vouchers-empty');
    if (vouchers.length === 0) {
      tbody.innerHTML = '';
      if (empty) empty.classList.remove('hidden');
      return;
    }
    if (empty) empty.classList.add('hidden');
    tbody.innerHTML = vouchers.map(function(v) {
      const discountText = v.discount_type === 'percentage' ? v.discount + '%' : formatRp(v.discount);
      const statusClass = v.is_active ? 'bg-neon-green' : 'bg-red-400';
      const statusText = v.is_active ? 'Aktif' : 'Nonaktif';
      return '<tr class="border-b-2 border-black/10 hover:bg-gray-50">' +
        '<td class="px-4 py-3 font-black text-sm">' + (v.code||'') + '</td>' +
        '<td class="px-4 py-3 font-bold">' + discountText + '</td>' +
        '<td class="px-4 py-3 text-sm">' + formatRp(v.min_purchase || 0) + '</td>' +
        '<td class="px-4 py-3 text-sm">' + (v.used_count||0) + 'x</td>' +
        '<td class="px-4 py-3 text-sm">' + (v.max_uses ? v.max_uses + 'x' : 'Unlimited') + '</td>' +
        '<td class="px-4 py-3"><span class="inline-block px-2 py-1 text-xs font-black border-2 border-black ' + statusClass + ' text-white">' + statusText + '</span></td>' +
        '<td class="px-4 py-3"><button class="voucher-del px-3 py-1 text-xs font-black border-2 border-black bg-red-400 text-white hover:shadow-none" data-id="' + (v.id||'') + '">Hapus</button></td></tr>';
    }).join('');
    tbody.querySelectorAll('.voucher-del').forEach(function(b) { b.addEventListener('click', async function() {
      if (confirm('Hapus voucher ini?')) {
        await deleteVoucher(this.dataset.id);
        await renderVouchers();
      }
    }); });
  }

  document.getElementById('voucher-add-btn')?.addEventListener('click', function() {
    document.getElementById('voucher-modal-title').textContent = 'Tambah Voucher';
    document.getElementById('voucher-edit-id').value = '';
    document.getElementById('voucher-code').value = '';
    document.getElementById('voucher-discount').value = '';
    document.getElementById('voucher-type').value = 'percentage';
    document.getElementById('voucher-min').value = '0';
    document.getElementById('voucher-max').value = '0';
    document.getElementById('voucher-expires').value = '';
    document.getElementById('voucher-modal').classList.remove('hidden');
  });

  document.getElementById('voucher-form')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const editId = document.getElementById('voucher-edit-id').value;
    const data = {
      code: document.getElementById('voucher-code').value,
      discount: parseInt(document.getElementById('voucher-discount').value) || 0,
      discount_type: document.getElementById('voucher-type').value,
      min_purchase: parseInt(document.getElementById('voucher-min').value) || 0,
      max_uses: parseInt(document.getElementById('voucher-max').value) || null,
      expires_at: document.getElementById('voucher-expires').value || null,
    };
    if (editId) data.id = editId;
    await saveVoucher(data, !!editId);
    await logAudit(editId ? 'update' : 'create', 'voucher', data.code);
    document.getElementById('voucher-modal').classList.add('hidden');
    await renderVouchers();
  });

  document.getElementById('voucher-modal-close')?.addEventListener('click', function() {
    document.getElementById('voucher-modal').classList.add('hidden');
  });

  async function renderAll() {
    await renderGames();
    await renderGear();
    await renderOrders();
    await renderLaporan();
    await renderVouchers();

    // Add search/filter event listeners for games
    const gameSearch = document.getElementById('game-search-input');
    if (gameSearch) {
      let searchTimeout;
      gameSearch.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => { renderGames(); }, 300);
      });
    }
    const gameStatus = document.getElementById('game-status-filter');
    if (gameStatus) {
      gameStatus.addEventListener('change', () => { renderGames(); });
    }

    // Add search/filter event listeners for gear
    const gearSearch = document.getElementById('gear-search-input');
    if (gearSearch) {
      let searchTimeout;
      gearSearch.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => { renderGear(); }, 300);
      });
    }
    const gearStatus = document.getElementById('gear-status-filter');
    if (gearStatus) {
      gearStatus.addEventListener('change', () => { renderGear(); });
    }

    // Export CSV handlers
    const gameExport = document.getElementById('game-export-csv');
    if (gameExport) {
      gameExport.addEventListener('click', async () => {
        const games = await getGames();
        if (games.length === 0) { alert('Tidak ada data untuk diexport.'); return; }
        var csv = '\uFEFFNama,Slug,Category,Currency,Badge,Status,Packages\\\\n';
        games.forEach(function(g) {
          csv += (g.name||'') + ',' + (g.slug||'') + ',' + (g.category||'') + ',' + (g.currency||'') + ',' + (g.badge||'') + ',' + (g.status||'published') + ',' + (g.packages||[]).map(function(p) { return p.label + ':' + p.price; }).join('; ') + '\\\\n';
        });
        var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        var link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'topzone-games-' + new Date().toISOString().slice(0,10) + '.csv';
        link.click();
      });
    }

    const gearExport = document.getElementById('gear-export-csv');
    if (gearExport) {
      gearExport.addEventListener('click', async () => {
        const items = await getGearItems();
        if (items.length === 0) { alert('Tidak ada data untuk diexport.'); return; }
        var csv = '\uFEFFNama,Slug,Category,Brand,Price,Tag,Status,Specs\\\\n';
        items.forEach(function(g) {
          csv += (g.name||'') + ',' + (g.slug||'') + ',' + (g.category||'') + ',' + (g.brand||'') + ',' + (g.price||0) + ',' + (g.tag||'') + ',' + (g.status||'published') + ',' + (g.specs||[]).map(function(s) { return s.label + ':' + s.value; }).join('; ') + '\\\\n';
        });
        var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        var link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'topzone-gears-' + new Date().toISOString().slice(0,10) + '.csv';
        link.click();
      });
    }
  }

  // Close modals on overlay click
  document.querySelectorAll('.fixed.inset-0').forEach(function(m) {
    m.addEventListener('click', function(e) { if (e.target === m) m.classList.add('hidden'); });
  });
<\/script>`])), renderComponent($$result, "Layout", $$Layout, {}, { "default": async ($$result2) => renderTemplate(_a || (_a = __template(["  <script>\n    document.documentElement.classList.remove('dark');\n  <\/script>  ", '<div id="login-gate" class="min-h-screen flex items-center justify-center bg-neon-yellow py-16 px-4"> <div class="w-full max-w-md border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_#000]"> <div class="text-center mb-6"> <div class="text-5xl mb-2">&#x1F512;</div> <h1 class="text-4xl font-black text-black">Admin <span style="color:#39FF14; -webkit-text-stroke:1px #000;">Panel</span></h1> <p class="font-bold text-sm text-black mt-1">Akses terbatas untuk administrator</p> </div> <form id="admin-login-form" class="space-y-4"> <div> <label class="text-sm font-black uppercase tracking-wider mb-2 block text-black">Email</label> <input type="email" id="admin-email" class="w-full px-4 py-3 border-3 border-black font-bold text-lg shadow-[3px_3px_0px_0px_#000] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] outline-none transition-all text-black" placeholder="admin@topzone.com"> </div> <div> <label class="text-sm font-black uppercase tracking-wider mb-2 block text-black">Password</label> <input type="password" id="admin-password" class="w-full px-4 py-3 border-3 border-black font-bold text-lg shadow-[3px_3px_0px_0px_#000] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] outline-none transition-all text-black" placeholder="••••••••"> </div> <div id="admin-login-error" class="hidden bg-red-500 text-white font-black px-4 py-3 border-2 border-black text-sm text-center"></div> <button type="submit" id="admin-login-btn" class="w-full py-4 font-black uppercase tracking-wider text-lg bg-black text-neon-green border-4 border-black shadow-[4px_4px_0px_0px_#39FF14] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#39FF14] active:translate-y-0 active:shadow-[2px_2px_0px_0px_#39FF14] transition-all">Masuk ke Admin</button> </form> </div> </div>  <div id="admin-dashboard" class="hidden min-h-screen bg-gray-100"> <!-- Admin Top Bar --> <header class="bg-black text-white border-b-4 border-neon-yellow"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between"> <div class="flex items-center gap-3"> <span class="text-2xl font-black tracking-tight">&#x1F3AE; ADMIN</span> <span class="bg-neon-yellow text-black text-xs font-black px-2 py-1">PANEL</span> </div> <div class="flex items-center gap-4"> <span class="text-xs text-gray-400 hidden sm:inline" id="session-timer"></span> <button id="admin-logout" class="px-4 py-2 text-sm font-black border-2 border-neon-yellow text-neon-yellow hover:bg-neon-yellow hover:text-black transition-all">Logout</button> </div> </div> </header> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"> <!-- Stats Cards --> <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"> <div class="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_#000]"> <p class="text-xs font-black uppercase tracking-wider text-gray-500">Total Orders</p> <p class="text-3xl font-black" id="laporan-total-orders">0</p> </div> <div class="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_#000]"> <p class="text-xs font-black uppercase tracking-wider text-gray-500">Revenue</p> <p class="text-3xl font-black text-neon-pink" id="laporan-total-revenue">Rp 0</p> </div> <div class="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_#000]"> <p class="text-xs font-black uppercase tracking-wider text-gray-500">Pending</p> <p class="text-3xl font-black text-yellow-500" id="laporan-pending">0</p> </div> <div class="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_#000]"> <p class="text-xs font-black uppercase tracking-wider text-gray-500">Selesai</p> <p class="text-3xl font-black text-neon-green" id="laporan-completed">0</p> </div> </div> <!-- Nav Tabs --> <div class="flex flex-wrap gap-2 mb-6 border-b-4 border-black pb-2"> <button class="admin-tab px-6 py-3 font-black tracking-wider border-2 border-black bg-neon-yellow shadow-[2px_2px_0px_0px_#000]" data-tab="games">&#x1F3AE; Games</button> <button class="admin-tab px-6 py-3 font-black tracking-wider border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000]" data-tab="gear">&#x1F3B5; Gear</button> <button class="admin-tab px-6 py-3 font-black tracking-wider border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000]" data-tab="orders">&#x1F4E6; Orders</button> <button class="admin-tab px-6 py-3 font-black tracking-wider border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000]" data-tab="vouchers">&#x1F3B0; Vouchers</button> <button class="admin-tab px-6 py-3 font-black tracking-wider border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000]" data-tab="reports">&#x1F4CA; Reports</button> </div> <!-- GAMES --> <div id="panel-games" class="space-y-6"> <div class="flex justify-between items-center"> <h2 class="text-3xl font-black">&#x1F3AE; Games</h2> <div class="flex gap-2"> <button id="game-export-csv" class="px-4 py-3 font-black text-sm border-2 border-black bg-blue-400 shadow-[3px_3px_0px_0px_#000] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all">&#x1F4E5; Export CSV</button> <button id="game-add-btn" class="px-5 py-3 font-black border-2 border-black bg-neon-green shadow-[3px_3px_0px_0px_#000] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all">+ Tambah Game</button> </div> </div> <div class="flex flex-wrap gap-3 items-center"> <input id="game-search-input" class="flex-1 min-w-[200px] px-4 py-2 border-3 border-black font-bold text-sm shadow-[2px_2px_0px_0px_#000]" placeholder="🔍 Cari game..."> <select id="game-status-filter" class="px-4 py-2 border-3 border-black font-bold text-sm bg-white shadow-[2px_2px_0px_0px_#000]"> <option value="all">Semua Status</option> <option value="published">Published</option> <option value="draft">Draft</option> <option value="archived">Archived</option> </select> <span class="text-sm font-bold text-gray-500" id="game-count-label"></span> </div> <div id="games-list" class="grid grid-cols-1 lg:grid-cols-2 gap-6"></div> <div id="games-pagination" class="flex justify-center gap-2 mt-4"></div> </div> <!-- GEAR --> <div id="panel-gear" class="hidden space-y-6"> <div class="flex justify-between items-center"> <h2 class="text-3xl font-black">&#x1F3B5; Gear</h2> <div class="flex gap-2"> <button id="gear-export-csv" class="px-4 py-3 font-black text-sm border-2 border-black bg-blue-400 shadow-[3px_3px_0px_0px_#000] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all">&#x1F4E5; Export CSV</button> <button id="gear-add-btn" class="px-5 py-3 font-black border-2 border-black bg-neon-yellow shadow-[3px_3px_0px_0px_#000] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all">+ Tambah Gear</button> </div> </div> <div class="flex flex-wrap gap-3 items-center"> <input id="gear-search-input" class="flex-1 min-w-[200px] px-4 py-2 border-3 border-black font-bold text-sm shadow-[2px_2px_0px_0px_#000]" placeholder="🔍 Cari gear..."> <select id="gear-status-filter" class="px-4 py-2 border-3 border-black font-bold text-sm bg-white shadow-[2px_2px_0px_0px_#000]"> <option value="all">Semua Status</option> <option value="published">Published</option> <option value="draft">Draft</option> <option value="archived">Archived</option> </select> <span class="text-sm font-bold text-gray-500" id="gear-count-label"></span> </div> </div> <div id="gear-list" class="grid grid-cols-1 lg:grid-cols-2 gap-6"></div> <div id="gear-pagination" class="flex justify-center gap-2 mt-4"></div> </div> <!-- ORDERS --> <div id="panel-orders" class="hidden space-y-6"> <h2 class="text-3xl font-black">&#x1F4E6; Orders</h2> <div class="border-4 border-black bg-white shadow-[4px_4px_0px_0px_#000] overflow-x-auto"> <table class="w-full text-left"> <thead class="border-b-4 border-black bg-gray-50"> <tr> <th class="px-4 py-3 font-black text-sm">Order ID</th> <th class="px-4 py-3 font-black text-sm">Pembeli</th> <th class="px-4 py-3 font-black text-sm">Item</th> <th class="px-4 py-3 font-black text-sm">Total</th> <th class="px-4 py-3 font-black text-sm">Status</th> <th class="px-4 py-3 font-black text-sm">Tanggal</th> <th class="px-4 py-3 font-black text-sm">Aksi</th> </tr> </thead> <tbody id="orders-table-body"></tbody> </table> <div id="orders-empty" class="text-center py-12 hidden"><p class="text-xl font-black text-gray-400">Belum ada pesanan.</p></div> </div> </div> <!-- VOUCHERS --> <div id="panel-vouchers" class="hidden space-y-6"> <div class="flex justify-between items-center"> <h2 class="text-3xl font-black">&#x1F3B0; Vouchers</h2> <button id="voucher-add-btn" class="px-5 py-3 font-black border-2 border-black bg-neon-green shadow-[3px_3px_0px_0px_#000] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all">+ Tambah Voucher</button> </div> <div class="border-4 border-black bg-white shadow-[4px_4px_0px_0px_#000] overflow-x-auto"> <table class="w-full text-left"> <thead class="border-b-4 border-black bg-gray-50"> <tr> <th class="px-4 py-3 font-black text-sm">Kode</th> <th class="px-4 py-3 font-black text-sm">Diskon</th> <th class="px-4 py-3 font-black text-sm">Min. Belanja</th> <th class="px-4 py-3 font-black text-sm">Digunakan</th> <th class="px-4 py-3 font-black text-sm">Maks</th> <th class="px-4 py-3 font-black text-sm">Status</th> <th class="px-4 py-3 font-black text-sm">Aksi</th> </tr> </thead> <tbody id="vouchers-table-body"></tbody> </table> <div id="vouchers-empty" class="text-center py-12 hidden"><p class="text-xl font-black text-gray-400">Belum ada voucher.</p></div> </div> </div> <!-- REPORTS --> <div id="panel-reports" class="hidden space-y-6"> <h2 class="text-3xl font-black">&#x1F4CA; Reports</h2> <div class="border-4 border-black bg-white shadow-[4px_4px_0px_0px_#000] p-6"> <h3 class="text-xl font-black mb-4">Laporan Transaksi</h3> <div class="flex gap-3 mb-4"> <button id="export-csv" class="px-5 py-3 font-black border-2 border-black bg-neon-green shadow-[3px_3px_0px_0px_#000] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all">&#x1F4E5; Export CSV</button> </div> <div class="overflow-x-auto"> <table class="w-full text-left"> <thead class="border-b-4 border-black bg-gray-50"> <tr> <th class="px-4 py-3 font-black text-sm">Order ID</th> <th class="px-4 py-3 font-black text-sm">Pelanggan</th> <th class="px-4 py-3 font-black text-sm">Item</th> <th class="px-4 py-3 font-black text-sm">Total</th> <th class="px-4 py-3 font-black text-sm">Status</th> <th class="px-4 py-3 font-black text-sm">Tanggal</th> </tr> </thead> <tbody id="laporan-table-body"></tbody> </table> <div id="laporan-empty" class="text-center py-12 hidden"><p class="text-xl font-black text-gray-400">Belum ada transaksi.</p></div> </div> </div> </div> </div>  <div id="voucher-modal" class="hidden fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"> <div class="bg-white border-4 border-black p-6 w-full max-w-lg shadow-[8px_8px_0px_0px_#000]"> <h3 class="text-2xl font-black mb-4" id="voucher-modal-title">Tambah Voucher</h3> <form id="voucher-form" class="space-y-3"> <input type="hidden" id="voucher-edit-id"> <div><label class="text-xs font-black uppercase tracking-wider block mb-1">Kode Voucher</label><input id="voucher-code" required class="w-full px-3 py-2 border-3 border-black font-bold uppercase shadow-[2px_2px_0px_0px_#000]" placeholder="WELCOME10"></div> <div class="flex gap-3"> <div class="flex-1"><label class="text-xs font-black uppercase tracking-wider block mb-1">Diskon</label><input id="voucher-discount" type="number" required class="w-full px-3 py-2 border-3 border-black font-bold"></div> <div class="flex-1"><label class="text-xs font-black uppercase tracking-wider block mb-1">Tipe</label> <select id="voucher-type" class="w-full px-3 py-2 border-3 border-black font-bold bg-white"> <option value="percentage">Persen (%)</option><option value="nominal">Nominal (Rp)</option> </select> </div> </div> <div class="flex gap-3"> <div class="flex-1"><label class="text-xs font-black uppercase tracking-wider block mb-1">Min. Belanja</label><input id="voucher-min" type="number" value="0" class="w-full px-3 py-2 border-3 border-black font-bold"></div> <div class="flex-1"><label class="text-xs font-black uppercase tracking-wider block mb-1">Maks Penggunaan</label><input id="voucher-max" type="number" value="0" class="w-full px-3 py-2 border-3 border-black font-bold" placeholder="0 = unlimited"></div> </div> <div><label class="text-xs font-black uppercase tracking-wider block mb-1">Kadaluarsa</label><input id="voucher-expires" type="date" class="w-full px-3 py-2 border-3 border-black font-bold"></div> <div class="flex gap-3 pt-2"><button type="submit" class="flex-1 py-3 font-black bg-neon-green border-2 border-black shadow-[2px_2px_0px_0px_#000]">Save</button><button type="button" id="voucher-modal-close" class="flex-1 py-3 font-black bg-gray-200 border-2 border-black">Cancel</button></div> </form> </div> </div>  <div id="game-modal" class="hidden fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"> <div class="bg-white border-4 border-black p-6 w-full max-w-lg shadow-[8px_8px_0px_0px_#000] max-h-[90vh] overflow-y-auto"> <h3 class="text-2xl font-black mb-4" id="game-modal-title">Tambah Game</h3> <form id="game-form" class="space-y-3"> <input type="hidden" id="game-edit-id"> <div><label class="text-xs font-black uppercase tracking-wider block mb-1">Nama Game</label><input id="game-name" required class="w-full px-3 py-2 border-3 border-black font-bold shadow-[2px_2px_0px_0px_#000] focus:shadow-none focus:translate-x-[1px] focus:translate-y-[1px] outline-none transition-all"></div> <div><label class="text-xs font-black uppercase tracking-wider block mb-1">Slug (url)</label><input id="game-slug" required class="w-full px-3 py-2 border-3 border-black font-bold shadow-[2px_2px_0px_0px_#000]"></div> <div><label class="text-xs font-black uppercase tracking-wider block mb-1">Image Path</label><input id="game-img" value="/assets/mlbb.png" class="w-full px-3 py-2 border-3 border-black font-bold shadow-[2px_2px_0px_0px_#000]"></div> <div class="flex gap-3"> <div class="flex-1"><label class="text-xs font-black uppercase tracking-wider block mb-1">Color</label><input id="game-color" value="#39FF14" class="w-full px-3 py-2 border-3 border-black font-bold"></div> <div class="flex-1"><label class="text-xs font-black uppercase tracking-wider block mb-1">Badge</label><input id="game-badge" value="New" class="w-full px-3 py-2 border-3 border-black font-bold"></div> <div class="flex-1"><label class="text-xs font-black uppercase tracking-wider block mb-1">Category</label> <select id="game-category" class="w-full px-3 py-2 border-3 border-black font-bold bg-white"> <option value="mobile">Mobile</option><option value="pc">PC</option><option value="console">Console</option> </select> </div> </div> <div><label class="text-xs font-black uppercase tracking-wider block mb-1">Currency</label><input id="game-currency" value="Diamond" class="w-full px-3 py-2 border-3 border-black font-bold"></div> <div><label class="text-xs font-black uppercase tracking-wider block mb-1">Description</label><textarea id="game-desc" rows="2" class="w-full px-3 py-2 border-3 border-black font-bold shadow-[2px_2px_0px_0px_#000]"></textarea></div> <div class="border-2 border-black p-3 bg-gray-50"><p class="font-black text-sm mb-2">Top-Up Packages</p><div id="game-packages" class="space-y-2"></div><button type="button" id="game-add-pkg" class="mt-2 px-3 py-1 text-xs font-black border border-black hover:bg-black hover:text-white transition-all">+ Add Package</button></div> <div class="flex gap-3 pt-2"><button type="submit" class="flex-1 py-3 font-black bg-neon-green border-2 border-black shadow-[2px_2px_0px_0px_#000]">Save</button><button type="button" id="game-modal-close" class="flex-1 py-3 font-black bg-gray-200 border-2 border-black">Cancel</button></div> </form> </div> </div>  <div id="gear-modal" class="hidden fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"> <div class="bg-white border-4 border-black p-6 w-full max-w-lg shadow-[8px_8px_0px_0px_#000] max-h-[90vh] overflow-y-auto"> <h3 class="text-2xl font-black mb-4" id="gear-modal-title">Tambah Gear</h3> <form id="gear-form" class="space-y-3"> <input type="hidden" id="gear-edit-id"> <div><label class="text-xs font-black uppercase tracking-wider block mb-1">Nama Gear</label><input id="gear-name" required class="w-full px-3 py-2 border-3 border-black font-bold shadow-[2px_2px_0px_0px_#000]"></div> <div><label class="text-xs font-black uppercase tracking-wider block mb-1">Slug</label><input id="gear-slug" required class="w-full px-3 py-2 border-3 border-black font-bold"></div> <div><label class="text-xs font-black uppercase tracking-wider block mb-1">Image Path</label><input id="gear-img" value="/assets/keyboard.png" class="w-full px-3 py-2 border-3 border-black font-bold"></div> <div class="flex gap-3"> <div class="flex-1"><label class="text-xs font-black uppercase tracking-wider block mb-1">Price</label><input id="gear-price" type="number" required class="w-full px-3 py-2 border-3 border-black font-bold"></div> <div class="flex-1"><label class="text-xs font-black uppercase tracking-wider block mb-1">Tag</label><input id="gear-tag" value="Gaming" class="w-full px-3 py-2 border-3 border-black font-bold"></div> <div class="flex-1"><label class="text-xs font-black uppercase tracking-wider block mb-1">Category</label> <select id="gear-category" class="w-full px-3 py-2 border-3 border-black font-bold bg-white"> <option value="keyboard">Keyboard</option><option value="mouse">Mouse</option><option value="headset">Headset</option><option value="monitor">Monitor</option> </select> </div> </div> <div><label class="text-xs font-black uppercase tracking-wider block mb-1">Description</label><textarea id="gear-desc" rows="2" class="w-full px-3 py-2 border-3 border-black font-bold shadow-[2px_2px_0px_0px_#000]"></textarea></div> <div class="border-2 border-black p-3 bg-gray-50"><p class="font-black text-sm mb-2">Specifications</p><div id="gear-specs" class="space-y-2"></div><button type="button" id="gear-add-spec" class="mt-2 px-3 py-1 text-xs font-black border border-black hover:bg-black hover:text-white transition-all">+ Add Spec</button></div> <div class="flex gap-3 pt-2"><button type="submit" class="flex-1 py-3 font-black bg-neon-yellow border-2 border-black shadow-[2px_2px_0px_0px_#000]">Save</button><button type="button" id="gear-modal-close" class="flex-1 py-3 font-black bg-gray-200 border-2 border-black">Cancel</button></div> </form> </div> </div>  <div id="status-modal" class="hidden fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"> <div class="bg-white border-4 border-black p-6 w-full max-w-sm shadow-[8px_8px_0px_0px_#000]"> <h3 class="text-2xl font-black mb-2">Ubah Status</h3> <p class="font-bold mb-4 text-sm text-gray-500" id="modal-order-ref"></p> <select id="modal-status-select" class="w-full px-4 py-3 border-3 border-black font-bold mb-4 bg-white"> <option value="pending">Pending</option><option value="processing">Diproses</option><option value="completed">Selesai</option><option value="cancelled">Dibatalkan</option> </select> <div class="flex gap-3"> <button id="modal-status-save" class="flex-1 py-3 font-black bg-neon-green border-2 border-black shadow-[2px_2px_0px_0px_#000]">Simpan</button> <button id="modal-status-close" class="flex-1 py-3 font-black bg-gray-200 border-2 border-black">Batal</button> </div> </div> </div> ', " "])), maybeRenderHead(), renderComponent($$result2, "Footer", $$Footer, {})) }));
}, "D:/Rizkia/Project Software/TopZone/src/pages/admin.astro", void 0);

const $$file = "D:/Rizkia/Project Software/TopZone/src/pages/admin.astro";
const $$url = "/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Admin,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
