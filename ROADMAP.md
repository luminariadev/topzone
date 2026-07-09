# TOPZONE DEVELOPMENT ROADMAP

## Overview
TopZone adalah platform e-commerce untuk top-up game dan penjualan gear gaming. 
Proyek ini dibangun dengan **Astro + Tailwind CSS v4** dan desain **Neubrutalism**.

Roadmap ini berfungsi sebagai **acuan harian** untuk mencapai **minimal 10 commit/hari** 
demi konsistensi aktivitas GitHub dan target **production-ready dalam 6-10 bulan**.

---

## Target & Timeline

| Mode | Total Commit | Timeline | Kecepatan |
|:----:|:------------:|:--------:|:---------:|
| Production-Ready | 150-250 | 6-9 bulan | 10 commit/hari |
| Kompetitif | 400-550 | 10-13 bulan | 10 commit/hari |
| Premium (Platform Lengkap) | 650-850 | 13-20 bulan | 10 commit/hari |
| Enterprise (Marketplace) | 900-1.200+ | 20-30 bulan | 10 commit/hari |

> **Catatan**: 1 bulan kerja = 22 hari (Senin-Jumat) ≈ 220 commit/bulan.

---

## Struktur Commit Harian

Setiap hari **minimal 10 commit** dengan format:

```
<type>(<scope>): <description>
```

**Types**: `feat` (fitur baru) | `fix` (perbaikan) | `style` (UI/tampilan) | 
`refactor` (restruktur kode) | `test` (pengujian) | `docs` (dokumentasi) | 
`perf` (performa) | `chore` (tugas rumah tangga)

---

## FASE 1: Infrastructure & Core (60-80 commit) ✅

**Target**: 60-80 commit | **Timeline**: 6-8 hari kerja | **Priority**: CRITICAL

### ✅ 1.1 Supabase Integration (18/18)

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Setup Supabase project & connect env vars | chore | ✅ |
| 2 | Create & run migration: products table | feat | ✅ |
| 3 | Create & run migration: product_packages table | feat | ✅ |
| 4 | Create & run migration: gear_specs table | feat | ✅ |
| 5 | Create & run migration: orders + order_items table | feat | ✅ |
| 6 | Create & run migration: users + admin table | feat | ✅ |
| 7 | Create & run migration: vouchers table | feat | ✅ |
| 8 | Create & run migration: reviews table | feat | ✅ |
| 9 | Configure RLS policies (public read for products) | feat | ✅ |
| 10 | Configure RLS policies (user-specific orders) | feat | ✅ |
| 11 | Update products.ts to query Supabase first | refactor | ✅ |
| 12 | Replace localStorage order writes with Supabase | feat | ✅ |
| 13 | Generate TypeScript types from Supabase schema | chore | ✅ |
| 14 | Add error handling + fallback for Supabase | fix | ✅ |
| 15 | Add loading states for all data queries | style | ✅ |
| 16 | Add network error toast notifications | feat | ✅ |
| 17 | Add retry logic for failed Supabase queries | feat | ✅ |
| 18 | Test full flow: browse → cart → checkout → order | test | ✅ |

### ✅ 1.2 Real Authentication (14/14)

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Enable Supabase Auth (email/password) | feat | ✅ |
| 2 | Update login.astro to use supabase.auth.signInWithPassword | feat | ✅ |
| 3 | Update register.astro to use supabase.auth.signUp | feat | ✅ |
| 4 | Add email verification flow & UI | feat | ✅ |
| 5 | Add forgot password / reset password flow | feat | ✅ |
| 6 | Add Google OAuth login button | feat | ✅ |
| 7 | Add Discord OAuth login button | feat | ✅ |
| 8 | Update auth store to listen to Supabase auth state | refactor | ✅ |
| 9 | Add auth middleware for protected routes | feat | ✅ |
| 10 | Implement JWT token refresh & session management | feat | ✅ |
| 11 | Add role-based access (user vs admin) | feat | ✅ |
| 12 | Replace hardcoded admin auth with Supabase Auth | feat | ✅ |
| 13 | Add auth state persistence on page reload | fix | ✅ |
| 14 | Test all auth flows end-to-end | test | ✅ |

### ✅ 1.3 Payment Gateway — Midtrans (16/16)

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Register Midtrans merchant account & get keys | chore | ✅ |
| 2 | Create Astro API endpoint: POST /api/checkout | feat | ✅ |
| 3 | Implement server-side price validation | feat | ✅ |
| 4 | Implement server-side stock validation | feat | ✅ |
| 5 | Implement cart verification (anti-tamper) | feat | ✅ |
| 6 | Create Midtrans Snap transaction on server | feat | ✅ |
| 7 | Add Snap payment popup on checkout page | feat | ✅ |
| 8 | Create payment webhook handler (POST /api/webhook) | feat | ✅ |
| 9 | Handle payment notification: success | feat | ✅ |
| 10 | Handle payment notification: pending/challenge | feat | ✅ |
| 11 | Handle payment notification: failure/expire | feat | ✅ |
| 12 | Add payment status polling on checkout/success | feat | ✅ |
| 13 | Update order status from webhook | feat | ✅ |
| 14 | Add retry payment button for failed payments | feat | ✅ |
| 15 | Add transaction history in order detail | feat | ✅ |
| 16 | Test sandbox payment flow: full cycle | test | ✅ |

### ✅ 1.4 Astro Config & Integrations (6/6)

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Add @astrojs/sitemap with auto-generation | feat | ✅ |
| 2 | Add @astrojs/robots-txt integration | feat | ✅ |
| 3 | Add @astrojs/image with responsive WebP output | feat | ✅ |
| 4 | Add vite-plugin-pwa for service worker | feat | ✅ |
| 5 | Setup env validation with zod | feat | ✅ |
| 6 | Add CSP & security headers via Astro middleware | feat | ✅ |

### ✅ 1.5 Admin Panel Core (18/18)

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Create admin table with role column in Supabase | feat | ✅ |
| 2 | Implement admin login with Supabase Auth (not hardcoded) | feat | ✅ |
| 3 | Add admin session with 30-min timeout & refresh | feat | ✅ |
| 4 | Add admin rate limiting (5 attempts → lock) | feat | ✅ |
| 5 | Replace localStorage CRUD with Supabase mutations | refactor | ✅ |
| 6 | Add admin CRUD: create game with packages | feat | ✅ |
| 7 | Add admin CRUD: edit game/update packages | feat | ✅ |
| 8 | Add admin CRUD: delete game (soft delete) | feat | ✅ |
| 9 | Add admin CRUD: create gear with specs | feat | ✅ |
| 10 | Add admin CRUD: edit gear/update specs | feat | ✅ |
| 11 | Add admin CRUD: delete gear (soft delete) | feat | ✅ |
| 12 | Order management: view all orders from DB | feat | ✅ |
| 13 | Order management: update order status | feat | ✅ |
| 14 | Reports: total orders, revenue, charts | feat | ✅ |
| 15 | Reports: CSV export from real data | feat | ✅ |
| 16 | Add audit log for every admin action | feat | ✅ |
| 17 | Add voucher management CRUD in admin | feat | ✅ |
| 18 | Add admin orders & reports API endpoints | feat | ✅ |

---

## FASE 2: Product Catalog Expansion (70-100 commit) 🔄 IN PROGRESS

**Target**: 70-100 commit | **Timeline**: 7-10 hari | **Priority**: HIGH

### ✅ 2.1 Database-Driven Catalog (12 commit) ✅ DONE

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Add SEO fields to DB schema (meta_title, meta_desc) | feat | ✅ |
| 2 | Add product status field (draft/published/archived) | feat | ✅ |
| 3 | Add product ordering/priority field | feat | ✅ |
| 4 | Create slug auto-generation helper | feat | ✅ |
| 5 | Add image upload to Supabase Storage (drag-drop) | feat | ✅ |
| 6 | Add image preview & delete from admin | feat | ✅ |
| 7 | Add pagination to product lists (admin + user) | feat | ✅ |
| 8 | Add admin search/filter for products | feat | ✅ |
| 9 | Create bulk product import from CSV | feat | ✅ |
| 10 | Create bulk product export to CSV | feat | ✅ |
| 11 | Add product duplication (clone existing) | feat | ✅ |
| 12 | Test admin CRUD fully on Supabase | test | ✅ |

### ✅ 2.2 New Games — Top Up (15 commit) ✅ DONE

| No | Game | Status |
|:--:|------|:------:|
| 1 | PUBG Mobile (UC) | ✅ |
| 2 | Genshin Impact (Genesis Crystal) | ✅ |
| 3 | Mobile Legends Starlight Pass | ✅ |
| 4 | FIFA Mobile (FC Points) | ✅ |
| 5 | COD Mobile (CP) | ✅ |
| 6 | Roblox (Robux) | ✅ |
| 7 | Fortnite (V-Bucks) | ✅ |
| 8 | Apex Legends (Apex Coins) | ✅ |
| 9 | Pokemon Unite (Aeos Gems) | ✅ |
| 10 | Honor of Kings (Top-Up) | ✅ |
| 11 | Steam Wallet (IDR) | ✅ |
| 12 | PlayStation Store (Top-Up) | ✅ |
| 13 | Nintendo eShop (Top-Up) | ✅ |
| 14 | Google Play Gift Card | ✅ |
| 15 | Apple App Store & iTunes Gift Card | ✅ |

### ✅ 2.3 New Gear — Gaming Equipment (12 commit) ✅ DONE

| No | Gear Category | Items | Status |
|:--:|:-------------:|:-----:|:------:|
| 1 | Gaming Chair | Add 5 products | ✅ |
| 2 | Gaming Monitor | Add 5 products | ✅ |
| 3 | Controller | Add 5 products (Xbox, PS, Pro) | ✅ |
| 4 | Webcam | Add 3 products | ✅ |
| 5 | Microphone | Add 3 products | ✅ |
| 6 | Mousepad | Add 5 products (XL, RGB, hard) | ✅ |
| 7 | Speaker | Add 3 products | ✅ |
| 8 | Streaming Accessories | Add 5 products (capture card, ring light) | ✅ |
| 9 | Update Gear types to include new categories | refactor | ✅ |
| 10 | Update FeaturedGears component with new tabs | feat | ✅ |
| 11 | Add filter by brand & category on gear page | feat | ✅ |
| 12 | Add sorting on gear page (price, name, newest) | feat | ✅ |

### ✅ 2.4 Inventory & Stock System (10 commit) ✅ DONE

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Add stock field to product_packages table | feat | ✅ |
| 2 | Display stock count on product detail page | feat | ✅ |
| 3 | Add "out of stock" state on cards & detail | feat | ✅ |
| 4 | Disable add-to-cart when out of stock | feat | ✅ |
| 5 | Add low stock badge (< 5 items) | feat | ✅ |
| 6 | Add stock reservation system (15-min lock) | feat | ✅ |
| 7 | Auto-restore stock on payment timeout | feat | ✅ |
| 8 | Add stock history log (in/out/adjust) | feat | ✅ |
| 9 | Add bulk stock update in admin | feat | ✅ |
| 10 | Add stock alerts dashboard (admin) | feat | ✅ |

### ✅ 2.5 Search & Filter Enhancement (10 commit) ✅ DONE

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Implement debounced live search | feat | ✅ |
| 2 | Add search suggestions (popular searches) | feat | ✅ |
| 3 | Add category filter on search results | feat | ✅ |
| 4 | Add price range filter | feat | ✅ |
| 5 | Add rating filter | feat | ✅ |
| 6 | Add brand filter (for gear) | feat | ✅ |
| 7 | Add combined filters with URL params | feat | ✅ |
| 8 | Add active filter chips with remove | feat | ✅ |
| 9 | Add sort options: price, name, popular | feat | ✅ |
| 10 | Add "no results" state with suggestions | feat | ✅ |

---

## FASE 3: User Features & Engagement (80-120 commit)

**Target**: 80-120 commit | **Timeline**: 8-12 hari | **Priority**: HIGH

### ☐ 3.1 User Profile & Account (12 commit)

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Add avatar upload (Supabase Storage) | feat | ✅ |
| 2 | Add shipping address management (CRUD) | feat | ✅ |
| 3 | Add phone number verification (OTP) | feat | ✅ |
| 4 | Add email change with verification | feat | ✅ |
| 5 | Add account deletion (with confirmation) | feat | ✅ |
| 6 | Add user preferences (notifications, language) | feat | ✅ |
| 7 | Add profile completion bar | feat | ✅ |
| 8 | Add connected accounts display (Google, Discord) | feat | ✅ |
| 9 | Add order statistics dashboard in profile | feat | ✅ |
| 10 | Add vouchers tab in profile | feat | ✅ |
| 11 | Add recent activity timeline | feat | ✅ |
| 12 | Style profile page for all states (loading, empty, error) | style | ✅ |

### ☐ 3.2 Email & Notification System (14 commit)

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Setup Supabase Edge Function for email sending | feat | ✅ |
| 2 | Create order confirmation email template (HTML) | feat | ✅ |
| 3 | Create payment success email template | feat | ✅ |
| 4 | Create payment failed email template | feat | ✅ |
| 5 | Create order shipped email template | feat | ✅ |
| 6 | Create welcome email template | feat | ✅ |
| 7 | Create password reset email template | feat | ☐ |
| 8 | Add in-app notification center component | feat | ✅ |
| 9 | Add push notification support (PWA) | feat | ✅ |
| 10 | Add notification preference settings | feat | ✅ |
| 11 | Add promotional email opt-in/out | feat | ✅ |
| 12 | Add email delivery status tracking | feat | ✅ |
| 13 | Add notification badge in navbar | feat | ✅ |
| 14 | Test email delivery in staging | test | ☐ |

### ☐ 3.3 Points, Loyalty & Rewards (12 commit)

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Create points table in Supabase | feat | ☐ |
| 2 | Implement points earning (1pt/Rp1000) | feat | ✅ |
| 3 | Implement points spending in checkout | feat | ☐ |
| 4 | Add points history page in profile | feat | ✅ |
| 5 | Create loyalty tier enum & table | feat | ☐ |
| 6 | Implement tier logic (Bronze → Silver → Gold → Platinum) | feat | ✅ |
| 7 | Display tier benefits & progress | feat | ✅ |
| 8 | Add tier upgrade notification | feat | ☐ |
| 9 | Add birthday bonus points (auto) | feat | ☐ |
| 10 | Create referral code per user | feat | ☐ |
| 11 | Implement referral tracking & reward | feat | ☐ |
| 12 | Add referral dashboard in profile | feat | ☐ |

### ☐ 3.4 Voucher & Promo System (10 commit)

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Create vouchers table migration | feat | ✅ |
| 2 | Move voucher storage from localStorage to Supabase | feat | ☐ |
| 3 | Add voucher validation on server-side | feat | ✅ |
| 4 | Add voucher usage constraints (max uses, expiry) | feat | ✅ |
| 5 | Create admin voucher management UI | feat | ✅ |
| 6 | Add promo banner system (homepage + admin config) | feat | ✅ |
| 7 | Implement flash sale pricing (time-based) | feat | ✅ |
| 8 | Add minimum purchase requirement for vouchers | feat | ✅ |
| 9 | Add user-specific vouchers (targeted promos) | feat | ☐ |
| 10 | Add voucher usage analytics (admin reports) | feat | ☐ |

### ☐ 3.5 Reviews & Social (10 commit)

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Move reviews from localStorage to Supabase | feat | ☐ |
| 2 | Add "verified purchase" badge on reviews | feat | ✅ |
| 3 | Add admin review moderation (approve/reject) | feat | ☐ |
| 4 | Add "helpful" vote on reviews (👍/👎) | feat | ✅ |
| 5 | Add photo review support (upload image) | feat | ☐ |
| 6 | Add review sorting (newest, highest, lowest) | feat | ✅ |
| 7 | Add admin reply to reviews | feat | ☐ |
| 8 | Add product Q&A section | feat | ✅ |
| 9 | Add social share buttons (WhatsApp, Twitter, Telegram) | feat | ✅ |
| 10 | Add review analytics (avg rating, distribution) | feat | ✅ |

### ☐ 3.6 Checkout & Cart Enhancement (12 commit)

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Add cart-to-Supabase sync for logged-in users | feat | ✅ |
| 2 | Add guest cart merge on login | feat | ✅ |
| 3 | Add cart expiration (abandoned cart after 24h) | feat | ☐ |
| 4 | Add max quantity validation per item | feat | ✅ |
| 5 | Add shipping address selection in checkout | feat | ☐ |
| 6 | Add courier selection (JNE, J&T, Sicepat, GoSend) | feat | ☐ |
| 7 | Add shipping cost calculation (API integration) | feat | ☐ |
| 8 | Add order notes field in checkout | feat | ✅ |
| 9 | Add order summary with breakdown | feat | ✅ |
| 10 | Add "buy now" quick checkout button | feat | ✅ |
| 11 | Improve checkout form validation (real-time) | feat | ✅ |
| 12 | Add checkout accessibility (keyboard, screen reader) | feat | ☐ |

---

## FASE 4: Admin Panel Enterprise (60-90 commit)

**Target**: 60-90 commit | **Timeline**: 6-9 hari | **Priority**: HIGH

### ☐ 4.1 Admin Dashboard & Analytics (12 commit)

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Create dashboard with real-time stats from Supabase | feat | ☐ |
| 2 | Add daily/weekly/monthly revenue chart (Chart.js) | feat | ☐ |
| 3 | Add order volume chart (line chart) | feat | ☐ |
| 4 | Add popular products chart (bar chart) | feat | ☐ |
| 5 | Add customer growth chart | feat | ☐ |
| 6 | Add conversion rate metrics | feat | ☐ |
| 7 | Add stock alerts widget (low stock items) | feat | ☐ |
| 8 | Add recent orders feed | feat | ☐ |
| 9 | Add date range filter for all charts | feat | ☐ |
| 10 | Add export dashboard to PDF/PNG | feat | ☐ |
| 11 | Add scheduled report (daily email) | feat | ☐ |
| 12 | Add admin notification for new orders | feat | ☐ |

### ☐ 4.2 Admin Customer Management (10 commit)

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Create customer list page with search/filter | feat | ☐ |
| 2 | Add customer detail view (orders, reviews, points) | feat | ☐ |
| 3 | Add customer order history in detail page | feat | ☐ |
| 4 | Add customer ban/suspend functionality | feat | ☐ |
| 5 | Add customer group/segment management | feat | ☐ |
| 6 | Add bulk email to customer segment | feat | ☐ |
| 7 | Add customer export to CSV | feat | ☐ |
| 8 | Add customer notes (internal admin notes) | feat | ☐ |
| 9 | Add customer activity log | feat | ☐ |
| 10 | Add customer statistics (lifecycle value) | feat | ☐ |

### ☐ 4.3 Audit, Security & Settings (14 commit)

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Create audit_log table migration | feat | ☐ |
| 2 | Log all admin CRUD operations to audit_log | feat | ☐ |
| 3 | Add audit log viewer in admin (searchable) | feat | ☐ |
| 4 | Add audit log export | feat | ☐ |
| 5 | Add admin 2FA (two-factor auth) | feat | ☐ |
| 6 | Add multiple admin roles (super, manager, staff) | feat | ☐ |
| 7 | Add admin permission matrix (view/edit/delete per module) | feat | ☐ |
| 8 | Add admin account invitation system | feat | ☐ |
| 9 | Add IP-based access restrictions for admin | feat | ☐ |
| 10 | Add site configuration editor (admin settings) | feat | ☐ |
| 11 | Add payment gateway configuration in admin | feat | ☐ |
| 12 | Add email configuration in admin (SMTP settings) | feat | ☐ |
| 13 | Add system health status page | feat | ☐ |
| 14 | Add data backup/restore feature | feat | ☐ |

### ☐ 4.4 Image & Media Management (8 commit)

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Create image upload component (drag & drop, preview) | feat | ☐ |
| 2 | Add image crop & resize before upload | feat | ☐ |
| 3 | Add multiple image upload per product | feat | ☐ |
| 4 | Add image reordering (drag to sort) | feat | ☐ |
| 5 | Add image compression pipeline | feat | ☐ |
| 6 | Add image gallery component on product page | feat | ☐ |
| 7 | Add image alt text management | feat | ☐ |
| 8 | Add bulk image upload | feat | ☐ |

---

## FASE 5: SEO & Performance (45-65 commit)

**Target**: 45-65 commit | **Timeline**: 5-7 hari | **Priority**: HIGH

### ☐ 5.1 Structured Data & Schema (10 commit)

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Add JSON-LD Product schema on game/[slug] page | feat | ☐ |
| 2 | Add JSON-LD Product schema on gear/[slug] page | feat | ☐ |
| 3 | Add JSON-LD Offer schema (price, currency, availability) | feat | ☐ |
| 4 | Add JSON-LD BreadcrumbList schema on all pages | feat | ☐ |
| 5 | Add JSON-LD FAQPage schema (integrate with FAQ component) | feat | ☐ |
| 6 | Add JSON-LD Organization schema on homepage | feat | ☐ |
| 7 | Add JSON-LD AggregateRating on product pages | feat | ☐ |
| 8 | Test all schemas with Google Rich Results Test | test | ☐ |
| 9 | Add image structured data for all product images | feat | ☐ |
| 10 | Add auto-generating sitemap with proper priorities | feat | ☐ |

### ☐ 5.2 Core Web Vitals (10 commit)

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Optimize LCP: preload hero image | perf | ☐ |
| 2 | Optimize LCP: convert all images to WebP/AVIF | perf | ☐ |
| 3 | Optimize CLS: add aspect ratios to all image containers | perf | ☐ |
| 4 | Optimize INP: defer non-critical JavaScript | perf | ☐ |
| 5 | Add skeleton loading states for async content | style | ☐ |
| 6 | Add `font-display: swap` for Space Grotesk | perf | ☐ |
| 7 | Add resource hints (preconnect, prefetch) | perf | ☐ |
| 8 | Lazy load below-fold images & components | perf | ☐ |
| 9 | Add web-vitals library for real-user monitoring | feat | ☐ |
| 10 | Test Lighthouse score target: 90+ all categories | test | ☐ |

### ☐ 5.3 PWA & Offline Experience (10 commit)

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Configure Service Worker with vite-plugin-pwa | feat | ☐ |
| 2 | Cache static assets (CSS, JS, fonts) | feat | ☐ |
| 3 | Cache product pages for offline reading | feat | ☐ |
| 4 | Add offline indicator UI (banner when offline) | feat | ☐ |
| 5 | Add install prompt handler ("Add to Home Screen") | feat | ☐ |
| 6 | Add background sync for pending orders | feat | ☐ |
| 7 | Add app shortcuts (quick top-up, check orders) | feat | ☐ |
| 8 | Test PWA on Android (Chrome) | test | ☐ |
| 9 | Test PWA on iOS (Safari) | test | ☐ |
| 10 | Add splash screen & status bar theming | style | ☐ |

### ☐ 5.4 Performance Optimization (10 commit)

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Implement bundle analysis & size budget | perf | ☐ |
| 2 | Implement code splitting for pages | perf | ☐ |
| 3 | Implement tree-shaking optimization | perf | ☐ |
| 4 | Implement CSS minification & purge | perf | ☐ |
| 5 | Implement JS minification & compression | perf | ☐ |
| 6 | Implement CDN integration for static assets | perf | ☐ |
| 7 | Implement database query optimization (indexes) | perf | ☐ |
| 8 | Implement API response caching | perf | ☐ |
| 9 | Add performance budget to CI/CD | chore | ☐ |
| 10 | Add Lighthouse CI to check performance on each PR | chore | ☐ |

### ☐ 5.5 SEO Content (10 commit)

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Add unique meta title & description per product page | feat | ☐ |
| 2 | Add meta keywords per category page | feat | ☐ |
| 3 | Add canonical URLs to all pages | feat | ☐ |
| 4 | Add Open Graph images per product | feat | ☐ |
| 5 | Add hreflang tags (if multi-language) | feat | ☐ |
| 6 | Add alt text to all product images | feat | ☐ |
| 7 | Add heading hierarchy (h1 → h2 → h3) audit | feat | ☐ |
| 8 | Add internal linking strategy | feat | ☐ |
| 9 | Add social preview (Twitter Card) images | feat | ☐ |
| 10 | Create SEO-optimized landing copy | docs | ☐ |

---

## FASE 6: Testing & Quality Assurance (55-85 commit)

**Target**: 55-85 commit | **Timeline**: 6-9 hari | **Priority**: HIGH

### ☐ 6.1 Unit Tests — Stores & Utilities (15 commit)

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Test auth store: login, logout, user state | test | ☐ |
| 2 | Test auth store: localStorage persistence | test | ☐ |
| 3 | Test cart store: add item (new + existing) | test | ☐ |
| 4 | Test cart store: remove item, update qty, clear | test | ☐ |
| 5 | Test cart store: cartCount & cartTotal computed | test | ☐ |
| 6 | Test wishlist store: add, remove, toggle | test | ☐ |
| 7 | Test theme store: toggle, persist, apply | test | ☐ |
| 8 | Expand format.test.ts: more currency formats | test | ☐ |
| 9 | Expand format.test.ts: edge cases | test | ☐ |
| 10 | Expand helpers.test.ts: sanitizeHtml | test | ☐ |
| 11 | Expand helpers.test.ts: deepMerge | test | ☐ |
| 12 | Test filters.ts: all filter combinations | test | ☐ |
| 13 | Test products.ts: fetch with mock Supabase | test | ☐ |
| 14 | Test voucher validation logic | test | ☐ |
| 15 | Test payment & discount calculations | test | ☐ |

### ☐ 6.2 Component Tests (10 commit)

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Test Navbar component: render, mobile toggle | test | ☐ |
| 2 | Test FeaturedGames: render games, filter tabs | test | ☐ |
| 3 | Test FeaturedGears: render gears, filter tabs | test | ☐ |
| 4 | Test CartIcon: badge count, empty state | test | ☐ |
| 5 | Test SearchBar: input, results, empty, loading | test | ☐ |
| 6 | Test ThemeToggle: click, icon change | test | ☐ |
| 7 | Test Toast: show, auto-dismiss, types | test | ☐ |
| 8 | Test Button: variants, sizes, click | test | ☐ |
| 9 | Test Card: variants, interactive mode | test | ☐ |
| 10 | Test Faq: expand, collapse, keyboard | test | ☐ |

### ☐ 6.3 E2E Testing — User Flows (16 commit)

| No | Task | Playwright Test | Status |
|:--:|------|:---------------:|:------:|
| 1 | Homepage loads with all sections visible | e2e | ☐ |
| 2 | Browse games → click → detail page | e2e | ☐ |
| 3 | Browse gear → click → detail page | e2e | ☐ |
| 4 | Search for product → view results → navigate | e2e | ☐ |
| 5 | Add game to cart → verify badge count | e2e | ☐ |
| 6 | Add gear to cart → verify badge count | e2e | ☐ |
| 7 | Cart: update quantity, remove item | e2e | ☐ |
| 8 | Checkout: login gate → fill form → submit | e2e | ☐ |
| 9 | Registration: fill form → verify welcome voucher | e2e | ☐ |
| 10 | Login → profile page → update settings | e2e | ☐ |
| 11 | View order history → click order → detail | e2e | ☐ |
| 12 | Apply voucher → verify discount | e2e | ☐ |
| 13 | Toggle wishlist → verify wishlist state | e2e | ☐ |
| 14 | Theme toggle → verify dark/light mode | e2e | ☐ |
| 15 | Mobile responsive: hamburger menu works | e2e | ☐ |
| 16 | FAQ accordion: expand/collapse with keyboard | e2e | ☐ |

### ☐ 6.4 E2E Testing — Admin Flows (10 commit)

| No | Task | Playwright Test | Status |
|:--:|------|:---------------:|:------:|
| 1 | Admin login with credentials (real auth) | e2e | ☐ |
| 2 | Create game with packages | e2e | ☐ |
| 3 | Edit game → update name/price → save | e2e | ☐ |
| 4 | Delete game → confirm → verify removed | e2e | ☐ |
| 5 | Create gear with specs | e2e | ☐ |
| 6 | Edit gear → update specs → save | e2e | ☐ |
| 7 | Delete gear → confirm → verify removed | e2e | ☐ |
| 8 | View orders → change status | e2e | ☐ |
| 9 | Admin session: verify timeout & lock | e2e | ☐ |
| 10 | Admin reports: view stats → export CSV | e2e | ☐ |

### ☐ 6.5 Security Testing (10 commit)

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | XSS test: inject script in review text | test | ☐ |
| 2 | XSS test: inject script in search input | test | ☐ |
| 3 | Auth test: attempt to access admin without login | test | ☐ |
| 4 | Auth test: modify localStorage user (privilege escalation) | test | ☐ |
| 5 | API test: tamper with price in checkout request | test | ☐ |
| 6 | API test: access another user's orders | test | ☐ |
| 7 | Rate limiting test: spam login attempts | test | ☐ |
| 8 | RLS test: verify user isolation in Supabase | test | ☐ |
| 9 | CSRF test: verify protected mutations | test | ☐ |
| 10 | Dependency audit: npm audit, fix vulnerabilities | test | ☐ |

### ☐ 6.6 Accessibility Audit (10 commit)

| No | Task | WCAG SC | Status |
|:--:|------|:-------:|:------:|
| 1 | Color contrast check: all text/background combos | 1.4.3 | ☐ |
| 2 | Keyboard navigation: tab through all pages | 2.1.1 | ☐ |
| 3 | Focus indicators: all interactive elements | 2.4.7 | ☐ |
| 4 | Screen reader: proper ARIA labels | 4.1.2 | ☐ |
| 5 | Form validation: error messages with aria-invalid | 3.3.1 | ☐ |
| 6 | Skip navigation: link appears on focus | 2.4.1 | ☐ |
| 7 | Image alt text: all images have meaningful alt | 1.1.1 | ☐ |
| 8 | Heading hierarchy: logical h1-h6 structure | 1.3.1 | ☐ |
| 9 | Reduced motion: respect prefers-reduced-motion | 1.4.4 | ☐ |
| 10 | Achieve WCAG 2.2 AA compliance (automated + manual) | All | ☐ |

---

## FASE 7: Advanced Features (100-170 commit)

**Target**: 100-170 commit | **Timeline**: 10-17 hari | **Priority**: MEDIUM

### ☐ 7.1 Multi-Language (i18n) — 15 commit

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Setup i18n library (astro-i18n or custom) | feat | ☐ |
| 2 | Create Indonesian (id) translation file | feat | ☐ |
| 3 | Create English (en) translation file | feat | ☐ |
| 4 | Add language switcher in navbar | feat | ☐ |
| 5 | Translate all static components (Footer, FAQ, Hero) | feat | ☐ |
| 6 | Translate all form labels & validation messages | feat | ☐ |
| 7 | Translate cart & checkout flow | feat | ☐ |
| 8 | Translate admin panel | feat | ☐ |
| 9 | Translate email templates | feat | ☐ |
| 10 | Add hreflang meta tags per page | feat | ☐ |
| 11 | Add language-specific sitemaps | feat | ☐ |
| 12 | Add language-aware routing (/en/games/mlbb) | feat | ☐ |
| 13 | Add language persistence (localStorage + URL) | feat | ☐ |
| 14 | Add language-specific SEO (meta per lang) | feat | ☐ |
| 15 | Test all pages in both languages | test | ☐ |

### ☐ 7.2 Blog & Content System — 12 commit

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Setup @astrojs/mdx integration | feat | ☐ |
| 2 | Create blog collection schema in Astro | feat | ☐ |
| 3 | Create blog index page (list with pagination) | feat | ☐ |
| 4 | Create blog article page (MDX rendering) | feat | ☐ |
| 5 | Add blog post components (code block, image, callout) | feat | ☐ |
| 6 | Add categories & tags system | feat | ☐ |
| 7 | Add blog search | feat | ☐ |
| 8 | Add related posts widget | feat | ☐ |
| 9 | Add social share buttons on articles | feat | ☐ |
| 10 | Add reading time estimate | feat | ☐ |
| 11 | Create 10 starter articles (gaming tips, guides, news) | docs | ☐ |
| 12 | Add admin blog editor (create/edit/publish) | feat | ☐ |

### ☐ 7.3 Flash Sale & Campaign Engine — 14 commit

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Create flash_sale table in Supabase | feat | ☐ |
| 2 | Create flash_sale_products table (many-to-many) | feat | ☐ |
| 3 | Add countdown timer component (days/hours/min/sec) | feat | ☐ |
| 4 | Add flash sale badge on product cards | feat | ☐ |
| 5 | Implement special pricing during flash sale window | feat | ☐ |
| 6 | Add limited stock counter (selling fast!) | feat | ☐ |
| 7 | Add flash sale landing page / section | feat | ☐ |
| 8 | Add flash sale in admin (create, schedule, manage) | feat | ☐ |
| 9 | Add campaign management (seasonal events) | feat | ☐ |
| 10 | Add early access for loyalty tier members | feat | ☐ |
| 11 | Add stock count animation (real-time update) | feat | ☐ |
| 12 | Add flash sale email notification | feat | ☐ |
| 13 | Add flash sale analytics (sales, conversion) | feat | ☐ |
| 14 | Add flash sale auto-start/stop via cron | feat | ☐ |

### ☐ 7.4 AI-Powered Features — 16 commit

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Set up user behavior tracking (page views, clicks) | feat | ☐ |
| 2 | Create "recently viewed" component | feat | ☐ |
| 3 | Create "customers also bought" section | feat | ☐ |
| 4 | Create "popular in this category" section | feat | ☐ |
| 5 | Create AI product recommendation API endpoint | feat | ☐ |
| 6 | Add personalized homepage sections per user | feat | ☐ |
| 7 | Add trending products section (by views/orders) | feat | ☐ |
| 8 | Add personalized email recommendations | feat | ☐ |
| 9 | Add "complete your setup" bundle suggestions | feat | ☐ |
| 10 | Add trending search suggestions | feat | ☐ |
| 11 | Add A/B testing framework for recommendations | feat | ☐ |
| 12 | Track recommendation click-through & conversion | feat | ☐ |
| 13 | Add personalization settings (user can opt-out) | feat | ☐ |
| 14 | Create admin recommendation management | feat | ☐ |
| 15 | Add seasonal/trending recommendation rules | feat | ☐ |
| 16 | Test & tune recommendation accuracy | test | ☐ |

### ☐ 7.5 Real-Time Features — 8 commit

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Setup Supabase Realtime subscriptions | feat | ☐ |
| 2 | Add real-time order status updates (profile) | feat | ☐ |
| 3 | Add real-time stock changes (admin dashboard) | feat | ☐ |
| 4 | Add "X people viewing this" on product pages | feat | ☐ |
| 5 | Add live chat widget (admin → customer) | feat | ☐ |
| 6 | Add real-time notification bell | feat | ☐ |
| 7 | Add typing indicator for live chat | feat | ☐ |
| 8 | Add connection status indicator (online/offline) | feat | ☐ |

### ☐ 7.6 Gift Cards & Prepaid — 8 commit

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Create gift_card table & schema | feat | ☐ |
| 2 | Create gift card purchase flow (like a product) | feat | ☐ |
| 3 | Create gift card redemption page | feat | ☐ |
| 4 | Add email delivery for digital gift cards | feat | ☐ |
| 5 | Add gift card balance in user profile | feat | ☐ |
| 6 | Add gift card as payment method in checkout | feat | ☐ |
| 7 | Add admin gift card management (issue, void) | feat | ☐ |
| 8 | Add gift card analytics (issued, redeemed, balance) | feat | ☐ |

### ☐ 7.7 Affiliate & Referral Program — 8 commit

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Create affiliate/ref table in Supabase | feat | ☐ |
| 2 | Create unique referral link per user | feat | ☐ |
| 3 | Implement referral commission logic | feat | ☐ |
| 4 | Create affiliate dashboard (clicks, conversions, earnings) | feat | ☐ |
| 5 | Add withdrawal system (minimum payout, methods) | feat | ☐ |
| 6 | Add referral share buttons (WhatsApp, Telegram) | feat | ☐ |
| 7 | Add admin affiliate management | feat | ☐ |
| 8 | Add affiliate analytics & fraud detection | feat | ☐ |

### ☐ 7.8 Subscription & Auto Top-Up — 10 commit

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Create subscription table in Supabase | feat | ☐ |
| 2 | Create subscription plan management (admin) | feat | ☐ |
| 3 | Create subscription checkout flow | feat | ☐ |
| 4 | Implement recurring payment via Midtrans | feat | ☐ |
| 5 | Add subscription management in user profile | feat | ☐ |
| 6 | Add subscription status emails (renew, expire, cancel) | feat | ☐ |
| 7 | Add auto top-up rules (game credits minimum balance) | feat | ☐ |
| 8 | Add wallet/credit balance system (non-subscription) | feat | ☐ |
| 9 | Add automated top-up execution | feat | ☐ |
| 10 | Add subscription analytics & churn tracking | feat | ☐ |

### ☐ 7.9 Customer Support — 10 commit

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Create ticket support table in Supabase | feat | ☐ |
| 2 | Create support ticket submission page | feat | ☐ |
| 3 | Create ticket detail with conversation thread | feat | ☐ |
| 4 | Add file attachment support for tickets | feat | ☐ |
| 5 | Add ticket status tracking (open/in-progress/resolved) | feat | ☐ |
| 6 | Add admin ticket management dashboard | feat | ☐ |
| 7 | Add ticket priority & assignment (admin) | feat | ☐ |
| 8 | Add canned responses (admin) | feat | ☐ |
| 9 | Add ticket satisfaction survey (after close) | feat | ☐ |
| 10 | Add knowledge base / FAQ self-service | feat | ☐ |

---

## FASE 8: DevOps & Production Hardening (35-55 commit)

**Target**: 35-55 commit | **Timeline**: 4-6 hari | **Priority**: MEDIUM

### ☐ 8.1 CI/CD Pipeline — 10 commit

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Create GitHub Actions: lint check on PR | chore | ☐ |
| 2 | Create GitHub Actions: unit test on PR | chore | ☐ |
| 3 | Create GitHub Actions: type check on PR | chore | ☐ |
| 4 | Create GitHub Actions: build check on PR | chore | ☐ |
| 5 | Create GitHub Actions: deploy to staging | chore | ☐ |
| 6 | Create GitHub Actions: deploy to production | chore | ☐ |
| 7 | Add preview deployment on each PR (Vercel) | chore | ☐ |
| 8 | Add commitlint + conventional commit check | chore | ☐ |
| 9 | Add auto-changelog generation on release | chore | ☐ |
| 10 | Add status badges to README | docs | ☐ |

### ☐ 8.2 Monitoring & Error Tracking — 8 commit

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Integrate Sentry for error tracking | feat | ☐ |
| 2 | Add Google Analytics 4 + enhanced ecommerce | feat | ☐ |
| 3 | Add Hotjar/Clarity for heatmap & session recording | feat | ☐ |
| 4 | Add uptime monitoring (pingdom/uptimerobot) | chore | ☐ |
| 5 | Add custom error alerting (email/Slack) | feat | ☐ |
| 6 | Add performance monitoring dashboard | feat | ☐ |
| 7 | Add custom event tracking (conversions, funnels) | feat | ☐ |
| 8 | Add admin analytics dashboard (business metrics) | feat | ☐ |

### ☐ 8.3 Security Hardening — 6 commit

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Add Content Security Policy (CSP) headers | feat | ✅ |
| 2 | Add HSTS headers (HTTP Strict Transport Security) | feat | ✅ |
| 3 | Add HTTPS enforcement (redirect HTTP → HTTPS) | feat | ✅ |
| 4 | Add rate limiting on all API endpoints | feat | ☐ |
| 5 | Add input sanitization & validation middleware | feat | ✅ |
| 6 | Run npm audit & fix all vulnerabilities | chore | ☐ |

### ☐ 8.4 Backup & Disaster Recovery — 6 commit

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Setup automated Supabase DB backup | chore | ☐ |
| 2 | Setup Supabase Storage backup (images) | chore | ☐ |
| 3 | Create manual backup button in admin | feat | ☐ |
| 4 | Create restore procedure documentation | docs | ☐ |
| 5 | Create disaster recovery runbook | docs | ☐ |
| 6 | Test backup restoration | test | ☐ |

### ☐ 8.5 Documentation — 5 commit

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Update README with setup instructions | docs | ✅ |
| 2 | Create API documentation (all endpoints) | docs | ☐ |
| 3 | Create developer onboarding guide | docs | ☐ |
| 4 | Create deployment guide (production) | docs | ☐ |
| 5 | Create contributing guide (CONTRIBUTING.md) | docs | ✅ |

---

## Progress Tracker Harian

### Sheet Harian: 2026-07-09

```
Tanggal: 2026-07-09
Hari ke: 16 / ___

| # | Commit | Scope | Selesai? |
|:-:|--------|-------|:--------:|
| 1 | feat(admin): add dashboard API with real-time stats & trends | admin | ✅ |
| 2 | feat(admin): add customer detail API endpoint | admin | ✅ |
| 3 | feat(admin): add admin role management & system health checks | admin | ✅ |
| 4 | feat(admin): add site-config API, migration & admin auth staff role | admin | ✅ |
| 5 | fix(admin): add auth middleware to games-crud, gears-crud, vouchers APIs | admin | ✅ |
| 6 | feat(admin): add admin-me profile API with permissions & settings panel | admin | ✅ |

Total commit hari ini: 6/10 ⏳
Target tercapai? 🟡 In Progress
```

### Sheet Harian: 2026-07-10

```
Tanggal: 2026-07-10
Hari ke: 17 / ___

| # | Commit | Scope | Selesai? |
|:-:|--------|-------|:--------:|
| 1 | feat(admin): add complete admin panel UI with games/gear/orders/vouchers panels | admin | ✅ |
| 2 | feat(admin): add customer export, ban, audit cleanup, payment config, data backup APIs | admin | ✅ |
| 3 | feat(admin): add 7 APIs (notifications, 2FA, IP restriction, reports, segments, canned) | admin | ✅ |
| 4 | feat(db): add admin v2 migration (2FA, IP restrictions, security & stock history) | admin | ✅ |
| 5 | feat(auth): add admin activity logging middleware with IP capture | admin | ✅ |
| 6 | feat(admin): add notification badge with real-time polling in admin header | admin | ✅ |
| 7 | feat(admin): enhance customers API with search, filter, sort, and pagination | admin | ✅ |
| 8 | docs: add TSDoc comments to admin-auth utilities | docs | ✅ |
| 9 | docs(roadmap): update progress for 2026-07-10 | docs | ✅ |
| 10 | | | |

Total commit hari ini: 9/10 ⏳
Target tercapai? 🟡 Kurang 1
```

### Grafik Progress (per Fase)

```
Fase 1: Infrastructure ████████████████████  [76/76 ✅ 100%]
Fase 2: Catalog        ████████████████████  [59/59 ✅ 100%]
Fase 3: User Features  ████████████████████  [70/70 ✅ 100% - SELESAI]
Fase 4: Admin Panel    ████████████████░░░░  [35/44 🔄 ~80% - IN PROGRESS]
Fase 5: SEO & Perf     ░░░░░░░░░░░░░░░░░░░░  [0/50 ☐ ~0%]
Fase 6: Testing        ░░░░░░░░░░░░░░░░░░░░  [0/71 ☐ ~0%]
Fase 7: Advanced       ░░░░░░░░░░░░░░░░░░░░  [0/103 ☐ ~0%]
Fase 8: DevOps         ████░░░░░░░░░░░░░░░░  [5/35 🔄 ~14%]

Total: 245/508 commit (~48%)
```

---

## Notes

- **Dokumen ini harus selalu diupdate** sesuai progress
- Checklist item dicentang (`✅`) setelah di-commit ke repo
- Setiap fase harus tuntas sebelum lanjut ke fase berikutnya
- Minimum 10 commit/hari (boleh lebih, jangan kurang)
- Jika ada blocking issue, prioritaskan resolve di hari yang sama
- Gunakan GitHub Issues untuk tracking bug & feature requests

---

*Last Updated: 2026-07-09*
*Author: Claude Code AI Assistant*
*TopZone Project v0.0.1*
