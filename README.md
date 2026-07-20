# 🎮 TopZone — Gaming Top Up & Gear Store

[![CI](https://github.com/luminariadev/topzone/actions/workflows/ci.yml/badge.svg)](https://github.com/luminariadev/topzone/actions/workflows/ci.yml)
[![Node.js](https://img.shields.io/badge/Node.js-22-green.svg)](https://nodejs.org/)
[![Astro](https://img.shields.io/badge/Astro-6.4.8-purple.svg)](https://astro.build)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/luminariadev/topzone)

**TopZone** adalah platform e-commerce gaming bertema **Neubrutalism** — top up game dan belanja gaming gear dengan sistem autentikasi lokal + opsi Supabase.

> 🚀 **Live demo:** [topzone.vercel.app](https://topzone.vercel.app)

---

## 📋 Daftar Isi

- [Fitur](#-fitur)
- [Tech Stack](#-tech-stack)
- [Instalasi](#-instalasi)
- [Konfigurasi](#-konfigurasi)
- [Struktur Project](#-struktur-project)
- [API Endpoints](#-api-endpoints)
- [Akun Demo](#-akun-demo)
- [CI/CD](#-cicd)
- [Branch Strategy](#-branch-strategy)
- [Lisensi](#-lisensi)

---

## ✨ Fitur

### 🎯 User
| Fitur | Status |
|-------|--------|
| Katalog Game & Gear (24+ game, 60+ gear) | ✅ |
| Detail produk dengan paket top-up / spesifikasi | ✅ |
| Keranjang belanja (nanostores) | ✅ |
| Checkout & riwayat pesanan per-user | ✅ |
| Voucher diskon (welcome 10%) | ✅ |
| Profil: poin, pengaturan, voucher | ✅ |
| Review & rating produk | ✅ |
| Pencarian produk real-time | ✅ |
| **Category filter** (Mobile / PC / Console) | ✅ |

### 🔐 Autentikasi
- Login/Register dengan Supabase Auth + localStorage fallback
- Session management dengan cookie
- Voucher otomatis saat register baru

### 🛡️ Admin Panel
| Fitur | Status |
|-------|--------|
| Dashboard statistik (orders, revenue, pending, selesai) | ✅ |
| CRUD Games + paket top-up | ✅ |
| CRUD Gear + spesifikasi | ✅ |
| Manajemen Orders (status workflow) | ✅ |
| Manajemen Voucher | ✅ |
| Manajemen Customers | ✅ |
| Audit Log | ✅ |
| Export CSV / JSON laporan | ✅ |

### 🎨 Tema & UX
- **Neubrutalism** — border hitam tebal, neon colors, shadow heavy
- **Dark/Light mode** — toggle dengan localStorage persistence
- **Fully Responsive** — mobile-first dengan hamburger menu
- **PWA Ready** — installable ke home screen
- **GSAP Scroll Animations** — smooth page entry
- **SEO** — JSON-LD schema, Open Graph, Twitter Cards, sitemap

---

## 🧰 Tech Stack

| Teknologi | Kegunaan |
|-----------|----------|
| [Astro](https://astro.build) v6.4.8 | Framework (SSR + Static) |
| [Tailwind CSS v4](https://tailwindcss.com) | Styling neubrutalism |
| [Nanostores](https://github.com/nanostores/nanostores) | State management (cart, auth) |
| [Supabase](https://supabase.com) | Backend opsional (auth + PostgreSQL) |
| [TypeScript](https://typescriptlang.org) | Type safety |
| [Vite](https://vitejs.dev) | Build tool & dev server |
| [Playwright](https://playwright.dev) | E2E testing |
| [Vitest](https://vitest.dev) | Unit testing |
| [GSAP](https://gsap.com) | Animations |
| [Chart.js](https://www.chartjs.org) | Admin dashboard charts |

---

## 🚀 Instalasi

```bash
# Clone
git clone https://github.com/luminariadev/topzone.git
cd topzone

# Install dependencies
npm install

# Development server (port 4322)
npm run dev

# Build production
npm run build

# Preview production build
npm run serve
```

---

## ⚙️ Konfigurasi

### Supabase (Opsional)
Buat file `.env` di root:

```env
PUBLIC_SUPABASE_URL=https://xxxxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbG...NiIs...
```

**Tanpa Supabase**, semua data otomatis pakai fallback (localStorage / hardcoded data).  
Admin login tetap bisa menggunakan hardcoded token tanpa Supabase.

### Skrip NPM

| Script | Deskripsi |
|--------|-----------|
| `npm run dev` | Dev server (port 4322) |
| `npm run build` | Build production |
| `npm run serve` | Preview build |
| `npm test` | Unit tests (Vitest) |
| `npm run e2e` | E2E tests (Playwright) |
| `npm run lint` | ESLint |
| `npm run astro` | CLI Astro |

---

## 📁 Struktur Project

```
src/
├── components/       # Komponen Astro (Navbar, Footer, FAQ, dll)
│   └── products/     # ImageGallery
├── data/             # Hardcoded data fallback (games, gears)
├── layouts/          # Layout.astro (base HTML, SEO, theme)
├── lib/              # Utilities (supabase client, admin-auth, cart, cache)
├── pages/            # Routes
│   ├── admin.astro   # Admin Panel (SPA-style)
│   ├── games/        # /games (listing + [slug])
│   ├── gear/         # /gear (listing + [slug])
│   ├── api/          # API endpoints (auth, admin, reviews, dll)
│   ├── cart.astro
│   ├── checkout.astro
│   ├── orders.astro
│   ├── profile.astro
│   └── ...
├── stores/           # Nanostores (cart, auth, notifications)
├── styles/           # Global CSS + Tailwind theme
├── types/            # TypeScript types
└── utils/            # Helpers (format currency, dll)
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/auth/register` | Register user baru |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout |
| POST | `/api/auth/admin-login` | Login admin |
| GET | `/api/auth/admin-me` | Cek session admin |

### Admin (memerlukan cookie sb-admin-token)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET/POST | `/api/admin/games-crud` | CRUD games |
| GET/POST | `/api/admin/gears-crud` | CRUD gear |
| GET | `/api/admin/orders` | List orders |
| POST | `/api/admin/orders/{id}/status` | Update status order |
| GET | `/api/admin/vouchers` | List vouchers |
| GET | `/api/admin/dashboard-stats` | Statistik dashboard |
| GET | `/api/admin/customers` | List customers |
| GET | `/api/admin/audit-log` | Log aktivitas admin |
| GET | `/api/admin/reviews` | Manajemen reviews |

### Public
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/reviews` | Submit review |
| GET | `/api/reviews?product_id=X` | Ambil reviews produk |

---

## 👤 Akun Demo

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@topzone.id` | `4189` |
| **User** | (register baru) | min 6 karakter |

> Admin login: buka `/admin`, masukkan kredensial di atas.  
> Saat Supabase offline, admin session otomatis pakai hardcoded fallback.

---

## 🔄 CI/CD

Proyek ini menggunakan **GitHub Actions** untuk:

| Job | Deskripsi |
|-----|-----------|
| `lint-and-typecheck` | ESLint + Astro type check |
| `unit-tests` | Vitest unit tests |
| `build` | Build production |
| `e2e-tests` | Playwright E2E (Chrome + Firefox) |
| `changelog` | Auto-generate CHANGELOG.md |
| `version-tag` | Auto-bump versi + git tag |

Lihat `.github/workflows/ci.yml` untuk detail.

---

## 🌿 Branch Strategy

```
main     → Production-ready code (stable)
v1       → Archive of v1 release
```

Setelah rilis `v1`, branch `main` menjadi satu-satunya branch aktif.  
Semua fitur lama telah di-merge dan branch feature sudah dihapus.

---

## 📄 Lisensi

MIT — bebas digunakan untuk pembelajaran, portfolio, atau development.  
Dibuat dengan ❤️ oleh [LuminariaDev](https://github.com/luminariadev).

---

> **TopZone** — Your ultimate destination for game top-ups and premium gaming gear in Indonesia.
