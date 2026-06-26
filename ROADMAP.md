# TOPZONE DEVELOPMENT ROADMAP

## Overview
TopZone adalah platform e-commerce untuk top-up game dan penjualan gear gaming. 
Proyek ini dibangun dengan **Astro + Tailwind CSS v4** dan desain **Neubrutalism**.

Roadmap ini berfungsi sebagai **acuan harian** untuk mencapai **minimal 10 commit/hari** 
demi konsistensi aktivitas GitHub dan target **production-ready dalam 6-10 bulan**.

---

## ðŸ“Š Target & Timeline

| Mode | Total Commit | Timeline | Kecepatan |
|:----:|:------------:|:--------:|:---------:|
| ðŸ¥‡ Production-Ready | 150-250 | 6-9 bulan | 10 commit/hari |
| ðŸ¥ˆ Kompetitif | 400-550 | 10-13 bulan | 10 commit/hari |
| ðŸ¥‡ Premium (Platform Lengkap) | 650-850 | 13-20 bulan | 10 commit/hari |
| ðŸ’Ž Enterprise (Marketplace) | 900-1.200+ | 20-30 bulan | 10 commit/hari |

> **Catatan**: 1 bulan kerja = 22 hari (Senin-Jumat) â‰ˆ 220 commit/bulan.

---

## ðŸ“ Struktur Commit Harian

Setiap hari **minimal 10 commit** dengan format:

```
<type>(<scope>): <description>
```

**Types**: `feat` (fitur baru) | `fix` (perbaikan) | `style` (UI/tampilan) | 
`refactor` (restruktur kode) | `test` (pengujian) | `docs` (dokumentasi) | 
`perf` (performa) | `chore` (tugas rumah tangga)

**Contoh commit flow 1 hari (10 commit):**

```
 1. feat(auth): implement Supabase Auth login
 2. style(login): improve dark mode contrast on form
 3. test(auth): add unit test for login mutation
 4. feat(products): add product image upload component
 5. fix(cart): resolve quantity update race condition
 6. refactor(stores): extract localStorage persistence
 7. style(navbar): add mobile hamburger transition
 8. test(cart): add integration test for add-to-cart
 9. docs(api): document payment webhook endpoint
10. chore(deps): update astro to latest patch
```

---

## ðŸš€ FASE 1: Infrastructure & Core (60-80 commit)

**Target**: 60-80 commit | **Timeline**: 6-8 hari kerja | **Priority**: ðŸ”´ CRITICAL

### â–¡ 1.1 Supabase Integration (18 commit)

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Setup Supabase project & connect env vars | chore | â–¡ |
| 2 | Create & run migration: products table | feat | â–¡ |
| 3 | Create & run migration: product_packages table | feat | â–¡ |
| 4 | Create & run migration: gear_specs table | feat | â–¡ |
| 5 | Create & run migration: orders + order_items table | feat | â–¡ |
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
| 18 | Test full flow: browse â†’ cart â†’ checkout â†’ order | test | ✅ |

### â–¡ 1.2 Real Authentication (14 commit)

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Enable Supabase Auth (email/password) | feat | â–¡ |
| 2 | Update login.astro to use supabase.auth.signInWithPassword | feat | â–¡ |
| 3 | Update register.astro to use supabase.auth.signUp | feat | â–¡ |
| 4 | Add email verification flow & UI | feat | â–¡ |
| 5 | Add forgot password / reset password flow | feat | â–¡ |
| 6 | Add Google OAuth login button | feat | â–¡ |
| 7 | Add Discord OAuth login button | feat | â–¡ |
| 8 | Update auth store to listen to Supabase auth state | refactor | â–¡ |
| 9 | Add auth middleware for protected routes | feat | â–¡ |
| 10 | Implement JWT token refresh & session management | feat | â–¡ |
| 11 | Add role-based access (user vs admin) | feat | â–¡ |
| 12 | Replace hardcoded admin auth with Supabase Auth | feat | â–¡ |
| 13 | Add auth state persistence on page reload | fix | â–¡ |
| 14 | Test all auth flows end-to-end | test | â–¡ |

### â–¡ 1.3 Payment Gateway â€” Midtrans (16 commit)

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Register Midtrans merchant account & get keys | chore | â–¡ |
| 2 | Create Astro API endpoint: POST /api/checkout | feat | â–¡ |
| 3 | Implement server-side price validation | feat | â–¡ |
| 4 | Implement server-side stock validation | feat | â–¡ |
| 5 | Implement cart verification (anti-tamper) | feat | â–¡ |
| 6 | Create Midtrans Snap transaction on server | feat | â–¡ |
| 7 | Add Snap payment popup on checkout page | feat | â–¡ |
| 8 | Create payment webhook handler (POST /api/webhook) | feat | â–¡ |
| 9 | Handle payment notification: success | feat | â–¡ |
| 10 | Handle payment notification: pending/challenge | feat | â–¡ |
| 11 | Handle payment notification: failure/expire | feat | â–¡ |
| 12 | Add payment status polling on checkout/success | feat | â–¡ |
| 13 | Update order status from webhook | feat | â–¡ |
| 14 | Add retry payment button for failed payments | feat | â–¡ |
| 15 | Add transaction history in order detail | feat | â–¡ |
| 16 | Test sandbox payment flow: full cycle | test | â–¡ |

### â–¡ 1.4 Astro Config & Integrations (6 commit)

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Add @astrojs/sitemap with auto-generation | feat | â–¡ |
| 2 | Add @astrojs/robots-txt integration | feat | â–¡ |
| 3 | Add @astrojs/image with responsive WebP output | feat | â–¡ |
| 4 | Add vite-plugin-pwa for service worker | feat | â–¡ |
| 5 | Setup env validation with zod | feat | â–¡ |
| 6 | Add CSP & security headers via Astro middleware | feat | â–¡ |

### â–¡ 1.5 Admin Panel Core (16 commit)

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Create admin table with role column in Supabase | feat | â–¡ |
| 2 | Implement admin login with Supabase Auth (not hardcoded) | feat | â–¡ |
| 3 | Add admin session with 30-min timeout & refresh | feat | â–¡ |
| 4 | Add admin rate limiting (5 attempts â†’ lock) | feat | â–¡ |
| 5 | Replace localStorage CRUD with Supabase mutations | refactor | â–¡ |
| 6 | Add admin CRUD: create game with packages | feat | â–¡ |
| 7 | Add admin CRUD: edit game/update packages | feat | â–¡ |
| 8 | Add admin CRUD: delete game (soft delete) | feat | â–¡ |
| 9 | Add admin CRUD: create gear with specs | feat | â–¡ |
| 10 | Add admin CRUD: edit gear/update specs | feat | â–¡ |
| 11 | Add admin CRUD: delete gear (soft delete) | feat | â–¡ |
| 12 | Order management: view all orders from DB | feat | â–¡ |
| 13 | Order management: update order status | feat | â–¡ |
| 14 | Reports: total orders, revenue, charts | feat | â–¡ |
| 15 | Reports: CSV export from real data | feat | â–¡ |
| 16 | Add audit log for every admin action | feat | â–¡ |

---

## ðŸš€ FASE 2: Product Catalog Expansion (70-100 commit)

**Target**: 70-100 commit | **Timeline**: 7-10 hari | **Priority**: ðŸŸ¡ HIGH

### â–¡ 2.1 Database-Driven Catalog (12 commit)

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Add SEO fields to DB schema (meta_title, meta_desc) | feat | â–¡ |
| 2 | Add product status field (draft/published/archived) | feat | â–¡ |
| 3 | Add product ordering/priority field | feat | â–¡ |
| 4 | Create slug auto-generation helper | feat | â–¡ |
| 5 | Add image upload to Supabase Storage (drag-drop) | feat | â–¡ |
| 6 | Add image preview & delete from admin | feat | â–¡ |
| 7 | Add pagination to product lists (admin + user) | feat | â–¡ |
| 8 | Add admin search/filter for products | feat | â–¡ |
| 9 | Create bulk product import from CSV | feat | â–¡ |
| 10 | Create bulk product export to CSV | feat | â–¡ |
| 11 | Add product duplication (clone existing) | feat | â–¡ |
| 12 | Test admin CRUD fully on Supabase | test | â–¡ |

### â–¡ 2.2 New Games â€” Top Up (15 commit)

| No | Game | Status |
|:--:|------|:------:|
| 1 | PUBG Mobile (UC) | â–¡ |
| 2 | Genshin Impact (Genesis Crystal) | â–¡ |
| 3 | Mobile Legends Starlight Pass | â–¡ |
| 4 | FIFA Mobile (FC Points) | â–¡ |
| 5 | COD Mobile (CP) | â–¡ |
| 6 | Roblox (Robux) | â–¡ |
| 7 | Fortnite (V-Bucks) | â–¡ |
| 8 | Apex Legends (Apex Coins) | â–¡ |
| 9 | Pokemon Unite (Aeos Gems) | â–¡ |
| 10 | Honor of Kings (Top-Up) | â–¡ |
| 11 | Steam Wallet (IDR) | â–¡ |
| 12 | PlayStation Store (Top-Up) | â–¡ |
| 13 | Nintendo eShop (Top-Up) | â–¡ |
| 14 | Google Play Gift Card | â–¡ |
| 15 | Apple App Store & iTunes Gift Card | â–¡ |

### â–¡ 2.3 New Gear â€” Gaming Equipment (12 commit)

| No | Gear Category | Items | Status |
|:--:|:-------------:|:-----:|:------:|
| 1 | Gaming Chair | Add 5 products | â–¡ |
| 2 | Gaming Monitor | Add 5 products | â–¡ |
| 3 | Controller | Add 5 products (Xbox, PS, Pro) | â–¡ |
| 4 | Webcam | Add 3 products | â–¡ |
| 5 | Microphone | Add 3 products | â–¡ |
| 6 | Mousepad | Add 5 products (XL, RGB, hard) | â–¡ |
| 7 | Speaker | Add 3 products | â–¡ |
| 8 | Streaming Accessories | Add 5 products (capture card, ring light) | â–¡ |
| 9 | Update Gear types to include new categories | refactor | â–¡ |
| 10 | Update FeaturedGears component with new tabs | feat | â–¡ |
| 11 | Add filter by brand & category on gear page | feat | â–¡ |
| 12 | Add sorting on gear page (price, name, newest) | feat | â–¡ |

### â–¡ 2.4 Inventory & Stock System (10 commit)

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Add stock field to product_packages table | feat | â–¡ |
| 2 | Display stock count on product detail page | feat | â–¡ |
| 3 | Add "out of stock" state on cards & detail | feat | â–¡ |
| 4 | Disable add-to-cart when out of stock | feat | â–¡ |
| 5 | Add low stock badge (< 5 items) | feat | â–¡ |
| 6 | Add stock reservation system (15-min lock) | feat | â–¡ |
| 7 | Auto-restore stock on payment timeout | feat | â–¡ |
| 8 | Add stock history log (in/out/adjust) | feat | â–¡ |
| 9 | Add bulk stock update in admin | feat | â–¡ |
| 10 | Add stock alerts dashboard (admin) | feat | â–¡ |

### â–¡ 2.5 Search & Filter Enhancement (10 commit)

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Implement debounced live search | feat | â–¡ |
| 2 | Add search suggestions (popular searches) | feat | â–¡ |
| 3 | Add category filter on search results | feat | â–¡ |
| 4 | Add price range filter | feat | â–¡ |
| 5 | Add rating filter | feat | â–¡ |
| 6 | Add brand filter (for gear) | feat | â–¡ |
| 7 | Add combined filters with URL params | feat | â–¡ |
| 8 | Add active filter chips with remove | feat | â–¡ |
| 9 | Add sort options: price, name, popular | feat | â–¡ |
| 10 | Add "no results" state with suggestions | feat | â–¡ |

---

## ðŸš€ FASE 3: User Features & Engagement (80-120 commit)

**Target**: 80-120 commit | **Timeline**: 8-12 hari | **Priority**: ðŸŸ¡ HIGH

### â–¡ 3.1 User Profile & Account (12 commit)

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Add avatar upload (Supabase Storage) | feat | â–¡ |
| 2 | Add shipping address management (CRUD) | feat | â–¡ |
| 3 | Add phone number verification (OTP) | feat | â–¡ |
| 4 | Add email change with verification | feat | â–¡ |
| 5 | Add account deletion (with confirmation) | feat | â–¡ |
| 6 | Add user preferences (notifications, language) | feat | â–¡ |
| 7 | Add profile completion bar | feat | â–¡ |
| 8 | Add connected accounts display (Google, Discord) | feat | â–¡ |
| 9 | Add order statistics dashboard in profile | feat | â–¡ |
| 10 | Add vouchers tab in profile | feat | â–¡ |
| 11 | Add recent activity timeline | feat | â–¡ |
| 12 | Style profile page for all states (loading, empty, error) | style | â–¡ |

### â–¡ 3.2 Email & Notification System (14 commit)

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Setup Supabase Edge Function for email sending | feat | â–¡ |
| 2 | Create order confirmation email template (HTML) | feat | â–¡ |
| 3 | Create payment success email template | feat | â–¡ |
| 4 | Create payment failed email template | feat | â–¡ |
| 5 | Create order shipped email template | feat | â–¡ |
| 6 | Create welcome email template | feat | â–¡ |
| 7 | Create password reset email template | feat | â–¡ |
| 8 | Add in-app notification center component | feat | â–¡ |
| 9 | Add push notification support (PWA) | feat | â–¡ |
| 10 | Add notification preference settings | feat | â–¡ |
| 11 | Add promotional email opt-in/out | feat | â–¡ |
| 12 | Add email delivery status tracking | feat | â–¡ |
| 13 | Add notification badge in navbar | feat | â–¡ |
| 14 | Test email delivery in staging | test | â–¡ |

### â–¡ 3.3 Points, Loyalty & Rewards (12 commit)

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Create points table in Supabase | feat | â–¡ |
| 2 | Implement points earning (1pt/Rp1000) | feat | â–¡ |
| 3 | Implement points spending in checkout | feat | â–¡ |
| 4 | Add points history page in profile | feat | â–¡ |
| 5 | Create loyalty tier enum & table | feat | â–¡ |
| 6 | Implement tier logic (Bronze â†’ Silver â†’ Gold â†’ Platinum) | feat | â–¡ |
| 7 | Display tier benefits & progress | feat | â–¡ |
| 8 | Add tier upgrade notification | feat | â–¡ |
| 9 | Add birthday bonus points (auto) | feat | â–¡ |
| 10 | Create referral code per user | feat | â–¡ |
| 11 | Implement referral tracking & reward | feat | â–¡ |
| 12 | Add referral dashboard in profile | feat | â–¡ |

### â–¡ 3.4 Voucher & Promo System (10 commit)

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Create vouchers table migration | feat | ✅ |
| 2 | Move voucher storage from localStorage to Supabase | feat | â–¡ |
| 3 | Add voucher validation on server-side | feat | â–¡ |
| 4 | Add voucher usage constraints (max uses, expiry) | feat | â–¡ |
| 5 | Create admin voucher management UI | feat | â–¡ |
| 6 | Add promo banner system (homepage + admin config) | feat | â–¡ |
| 7 | Implement flash sale pricing (time-based) | feat | â–¡ |
| 8 | Add minimum purchase requirement for vouchers | feat | â–¡ |
| 9 | Add user-specific vouchers (targeted promos) | feat | â–¡ |
| 10 | Add voucher usage analytics (admin reports) | feat | â–¡ |

### â–¡ 3.5 Reviews & Social (10 commit)

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Move reviews from localStorage to Supabase | feat | â–¡ |
| 2 | Add "verified purchase" badge on reviews | feat | â–¡ |
| 3 | Add admin review moderation (approve/reject) | feat | â–¡ |
| 4 | Add "helpful" vote on reviews (ðŸ‘/ðŸ‘Ž) | feat | â–¡ |
| 5 | Add photo review support (upload image) | feat | â–¡ |
| 6 | Add review sorting (newest, highest, lowest) | feat | â–¡ |
| 7 | Add admin reply to reviews | feat | â–¡ |
| 8 | Add product Q&A section | feat | â–¡ |
| 9 | Add social share buttons (WhatsApp, Twitter) | feat | â–¡ |
| 10 | Add review analytics (avg rating, distribution) | feat | â–¡ |

### â–¡ 3.6 Checkout & Cart Enhancement (12 commit)

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Add cart-to-Supabase sync for logged-in users | feat | â–¡ |
| 2 | Add guest cart merge on login | feat | â–¡ |
| 3 | Add cart expiration (abandoned cart after 24h) | feat | â–¡ |
| 4 | Add max quantity validation per item | feat | â–¡ |
| 5 | Add shipping address selection in checkout | feat | â–¡ |
| 6 | Add courier selection (JNE, J&T, Sicepat, GoSend) | feat | â–¡ |
| 7 | Add shipping cost calculation (API integration) | feat | â–¡ |
| 8 | Add order notes field in checkout | feat | â–¡ |
| 9 | Add order summary with breakdown | feat | â–¡ |
| 10 | Add "buy now" quick checkout button | feat | â–¡ |
| 11 | Improve checkout form validation (real-time) | feat | â–¡ |
| 12 | Add checkout accessibility (keyboard, screen reader) | feat | â–¡ |

---

## ðŸš€ FASE 4: Admin Panel Enterprise (60-90 commit)

**Target**: 60-90 commit | **Timeline**: 6-9 hari | **Priority**: ðŸŸ¡ HIGH

### â–¡ 4.1 Admin Dashboard & Analytics (12 commit)

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Create dashboard with real-time stats from Supabase | feat | â–¡ |
| 2 | Add daily/weekly/monthly revenue chart (Chart.js) | feat | â–¡ |
| 3 | Add order volume chart (line chart) | feat | â–¡ |
| 4 | Add popular products chart (bar chart) | feat | â–¡ |
| 5 | Add customer growth chart | feat | â–¡ |
| 6 | Add conversion rate metrics | feat | â–¡ |
| 7 | Add stock alerts widget (low stock items) | feat | â–¡ |
| 8 | Add recent orders feed | feat | â–¡ |
| 9 | Add date range filter for all charts | feat | â–¡ |
| 10 | Add export dashboard to PDF/PNG | feat | â–¡ |
| 11 | Add scheduled report (daily email) | feat | â–¡ |
| 12 | Add admin notification for new orders | feat | â–¡ |

### â–¡ 4.2 Admin Customer Management (10 commit)

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Create customer list page with search/filter | feat | â–¡ |
| 2 | Add customer detail view (orders, reviews, points) | feat | â–¡ |
| 3 | Add customer order history in detail page | feat | â–¡ |
| 4 | Add customer ban/suspend functionality | feat | â–¡ |
| 5 | Add customer group/segment management | feat | â–¡ |
| 6 | Add bulk email to customer segment | feat | â–¡ |
| 7 | Add customer export to CSV | feat | â–¡ |
| 8 | Add customer notes (internal admin notes) | feat | â–¡ |
| 9 | Add customer activity log | feat | â–¡ |
| 10 | Add customer statistics (lifecycle value) | feat | â–¡ |

### â–¡ 4.3 Audit, Security & Settings (14 commit)

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Create audit_log table migration | feat | â–¡ |
| 2 | Log all admin CRUD operations to audit_log | feat | â–¡ |
| 3 | Add audit log viewer in admin (searchable) | feat | â–¡ |
| 4 | Add audit log export | feat | â–¡ |
| 5 | Add admin 2FA (two-factor auth) | feat | â–¡ |
| 6 | Add multiple admin roles (super, manager, staff) | feat | â–¡ |
| 7 | Add admin permission matrix (view/edit/delete per module) | feat | â–¡ |
| 8 | Add admin account invitation system | feat | â–¡ |
| 9 | Add IP-based access restrictions for admin | feat | â–¡ |
| 10 | Add site configuration editor (admin settings) | feat | â–¡ |
| 11 | Add payment gateway configuration in admin | feat | â–¡ |
| 12 | Add email configuration in admin (SMTP settings) | feat | â–¡ |
| 13 | Add system health status page | feat | â–¡ |
| 14 | Add data backup/restore feature | feat | â–¡ |

### â–¡ 4.4 Image & Media Management (8 commit)

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Create image upload component (drag & drop, preview) | feat | â–¡ |
| 2 | Add image crop & resize before upload | feat | â–¡ |
| 3 | Add multiple image upload per product | feat | â–¡ |
| 4 | Add image reordering (drag to sort) | feat | â–¡ |
| 5 | Add image compression pipeline | feat | â–¡ |
| 6 | Add image gallery component on product page | feat | â–¡ |
| 7 | Add image alt text management | feat | â–¡ |
| 8 | Add bulk image upload | feat | â–¡ |

---

## ðŸš€ FASE 5: SEO & Performance (45-65 commit)

**Target**: 45-65 commit | **Timeline**: 5-7 hari | **Priority**: ðŸŸ¡ HIGH

### â–¡ 5.1 Structured Data & Schema (10 commit)

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Add JSON-LD Product schema on game/[slug] page | feat | â–¡ |
| 2 | Add JSON-LD Product schema on gear/[slug] page | feat | â–¡ |
| 3 | Add JSON-LD Offer schema (price, currency, availability) | feat | â–¡ |
| 4 | Add JSON-LD BreadcrumbList schema on all pages | feat | â–¡ |
| 5 | Add JSON-LD FAQPage schema (integrate with FAQ component) | feat | â–¡ |
| 6 | Add JSON-LD Organization schema on homepage | feat | â–¡ |
| 7 | Add JSON-LD AggregateRating on product pages | feat | â–¡ |
| 8 | Test all schemas with Google Rich Results Test | test | â–¡ |
| 9 | Add image structured data for all product images | feat | â–¡ |
| 10 | Add auto-generating sitemap with proper priorities | feat | â–¡ |

### â–¡ 5.2 Core Web Vitals (10 commit)

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Optimize LCP: preload hero image | perf | â–¡ |
| 2 | Optimize LCP: convert all images to WebP/AVIF | perf | â–¡ |
| 3 | Optimize CLS: add aspect ratios to all image containers | perf | â–¡ |
| 4 | Optimize INP: defer non-critical JavaScript | perf | â–¡ |
| 5 | Add skeleton loading states for async content | style | â–¡ |
| 6 | Add `font-display: swap` for Space Grotesk | perf | â–¡ |
| 7 | Add resource hints (preconnect, prefetch) | perf | â–¡ |
| 8 | Lazy load below-fold images & components | perf | â–¡ |
| 9 | Add web-vitals library for real-user monitoring | feat | â–¡ |
| 10 | Test Lighthouse score target: 90+ all categories | test | â–¡ |

### â–¡ 5.3 PWA & Offline Experience (10 commit)

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Configure Service Worker with vite-plugin-pwa | feat | â–¡ |
| 2 | Cache static assets (CSS, JS, fonts) | feat | â–¡ |
| 3 | Cache product pages for offline reading | feat | â–¡ |
| 4 | Add offline indicator UI (banner when offline) | feat | â–¡ |
| 5 | Add install prompt handler ("Add to Home Screen") | feat | â–¡ |
| 6 | Add background sync for pending orders | feat | â–¡ |
| 7 | Add app shortcuts (quick top-up, check orders) | feat | â–¡ |
| 8 | Test PWA on Android (Chrome) | test | â–¡ |
| 9 | Test PWA on iOS (Safari) | test | â–¡ |
| 10 | Add splash screen & status bar theming | style | â–¡ |

### â–¡ 5.4 Performance Optimization (10 commit)

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Implement bundle analysis & size budget | perf | â–¡ |
| 2 | Implement code splitting for pages | perf | â–¡ |
| 3 | Implement tree-shaking optimization | perf | â–¡ |
| 4 | Implement CSS minification & purge | perf | â–¡ |
| 5 | Implement JS minification & compression | perf | â–¡ |
| 6 | Implement CDN integration for static assets | perf | â–¡ |
| 7 | Implement database query optimization (indexes) | perf | â–¡ |
| 8 | Implement API response caching | perf | â–¡ |
| 9 | Add performance budget to CI/CD | chore | â–¡ |
| 10 | Add Lighthouse CI to check performance on each PR | chore | â–¡ |

### â–¡ 5.5 SEO Content (10 commit)

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Add unique meta title & description per product page | feat | â–¡ |
| 2 | Add meta keywords per category page | feat | â–¡ |
| 3 | Add canonical URLs to all pages | feat | â–¡ |
| 4 | Add Open Graph images per product | feat | â–¡ |
| 5 | Add hreflang tags (if multi-language) | feat | â–¡ |
| 6 | Add alt text to all product images | feat | â–¡ |
| 7 | Add heading hierarchy (h1 â†’ h2 â†’ h3) audit | feat | â–¡ |
| 8 | Add internal linking strategy | feat | â–¡ |
| 9 | Add social preview (Twitter Card) images | feat | â–¡ |
| 10 | Create SEO-optimized landing copy | docs | â–¡ |

---

## ðŸš€ FASE 6: Testing & Quality Assurance (55-85 commit)

**Target**: 55-85 commit | **Timeline**: 6-9 hari | **Priority**: ðŸŸ¡ HIGH

### â–¡ 6.1 Unit Tests â€” Stores & Utilities (15 commit)

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Test auth store: login, logout, user state | test | â–¡ |
| 2 | Test auth store: localStorage persistence | test | â–¡ |
| 3 | Test cart store: add item (new + existing) | test | â–¡ |
| 4 | Test cart store: remove item, update qty, clear | test | â–¡ |
| 5 | Test cart store: cartCount & cartTotal computed | test | â–¡ |
| 6 | Test wishlist store: add, remove, toggle | test | â–¡ |
| 7 | Test theme store: toggle, persist, apply | test | â–¡ |
| 8 | Expand format.test.ts: more currency formats | test | â–¡ |
| 9 | Expand format.test.ts: edge cases | test | â–¡ |
| 10 | Expand helpers.test.ts: sanitizeHtml | test | â–¡ |
| 11 | Expand helpers.test.ts: deepMerge | test | â–¡ |
| 12 | Test filters.ts: all filter combinations | test | â–¡ |
| 13 | Test products.ts: fetch with mock Supabase | test | â–¡ |
| 14 | Test voucher validation logic | test | â–¡ |
| 15 | Test payment & discount calculations | test | â–¡ |

### â–¡ 6.2 Component Tests (10 commit)

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Test Navbar component: render, mobile toggle | test | â–¡ |
| 2 | Test FeaturedGames: render games, filter tabs | test | â–¡ |
| 3 | Test FeaturedGears: render gears, filter tabs | test | â–¡ |
| 4 | Test CartIcon: badge count, empty state | test | â–¡ |
| 5 | Test SearchBar: input, results, empty, loading | test | â–¡ |
| 6 | Test ThemeToggle: click, icon change | test | â–¡ |
| 7 | Test Toast: show, auto-dismiss, types | test | â–¡ |
| 8 | Test Button: variants, sizes, click | test | â–¡ |
| 9 | Test Card: variants, interactive mode | test | â–¡ |
| 10 | Test Faq: expand, collapse, keyboard | test | â–¡ |

### â–¡ 6.3 E2E Testing â€” User Flows (16 commit)

| No | Task | Playwright Test | Status |
|:--:|------|:---------------:|:------:|
| 1 | Homepage loads with all sections visible | e2e | â–¡ |
| 2 | Browse games â†’ click â†’ detail page | e2e | â–¡ |
| 3 | Browse gear â†’ click â†’ detail page | e2e | â–¡ |
| 4 | Search for product â†’ view results â†’ navigate | e2e | â–¡ |
| 5 | Add game to cart â†’ verify badge count | e2e | â–¡ |
| 6 | Add gear to cart â†’ verify badge count | e2e | â–¡ |
| 7 | Cart: update quantity, remove item | e2e | â–¡ |
| 8 | Checkout: login gate â†’ fill form â†’ submit | e2e | â–¡ |
| 9 | Registration: fill form â†’ verify welcome voucher | e2e | â–¡ |
| 10 | Login â†’ profile page â†’ update settings | e2e | â–¡ |
| 11 | View order history â†’ click order â†’ detail | e2e | â–¡ |
| 12 | Apply voucher â†’ verify discount | e2e | â–¡ |
| 13 | Toggle wishlist â†’ verify wishlist state | e2e | â–¡ |
| 14 | Theme toggle â†’ verify dark/light mode | e2e | â–¡ |
| 15 | Mobile responsive: hamburger menu works | e2e | â–¡ |
| 16 | FAQ accordion: expand/collapse with keyboard | e2e | â–¡ |

### â–¡ 6.4 E2E Testing â€” Admin Flows (10 commit)

| No | Task | Playwright Test | Status |
|:--:|------|:---------------:|:------:|
| 1 | Admin login with credentials (real auth) | e2e | â–¡ |
| 2 | Create game with packages | e2e | â–¡ |
| 3 | Edit game â†’ update name/price â†’ save | e2e | â–¡ |
| 4 | Delete game â†’ confirm â†’ verify removed | e2e | â–¡ |
| 5 | Create gear with specs | e2e | â–¡ |
| 6 | Edit gear â†’ update specs â†’ save | e2e | â–¡ |
| 7 | Delete gear â†’ confirm â†’ verify removed | e2e | â–¡ |
| 8 | View orders â†’ change status | e2e | â–¡ |
| 9 | Admin session: verify timeout & lock | e2e | â–¡ |
| 10 | Admin reports: view stats â†’ export CSV | e2e | â–¡ |

### â–¡ 6.5 Security Testing (10 commit)

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | XSS test: inject script in review text | test | â–¡ |
| 2 | XSS test: inject script in search input | test | â–¡ |
| 3 | Auth test: attempt to access admin without login | test | â–¡ |
| 4 | Auth test: modify localStorage user (privilege escalation) | test | â–¡ |
| 5 | API test: tamper with price in checkout request | test | â–¡ |
| 6 | API test: access another user's orders | test | â–¡ |
| 7 | Rate limiting test: spam login attempts | test | â–¡ |
| 8 | RLS test: verify user isolation in Supabase | test | â–¡ |
| 9 | CSRF test: verify protected mutations | test | â–¡ |
| 10 | Dependency audit: npm audit, fix vulnerabilities | test | â–¡ |

### â–¡ 6.6 Accessibility Audit (10 commit)

| No | Task | WCAG SC | Status |
|:--:|------|:-------:|:------:|
| 1 | Color contrast check: all text/background combos | 1.4.3 | â–¡ |
| 2 | Keyboard navigation: tab through all pages | 2.1.1 | â–¡ |
| 3 | Focus indicators: all interactive elements | 2.4.7 | â–¡ |
| 4 | Screen reader: proper ARIA labels | 4.1.2 | â–¡ |
| 5 | Form validation: error messages with aria-invalid | 3.3.1 | â–¡ |
| 6 | Skip navigation: link appears on focus | 2.4.1 | â–¡ |
| 7 | Image alt text: all images have meaningful alt | 1.1.1 | â–¡ |
| 8 | Heading hierarchy: logical h1-h6 structure | 1.3.1 | â–¡ |
| 9 | Reduced motion: respect prefers-reduced-motion | 1.4.4 | â–¡ |
| 10 | Achieve WCAG 2.2 AA compliance (automated + manual) | All | â–¡ |

---

## ðŸš€ FASE 7: Advanced Features (100-170 commit)

**Target**: 100-170 commit | **Timeline**: 10-17 hari | **Priority**: ðŸŸ¢ MEDIUM

### â–¡ 7.1 Multi-Language (i18n) â€” 15 commit

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Setup i18n library (astro-i18n or custom) | feat | â–¡ |
| 2 | Create Indonesian (id) translation file | feat | â–¡ |
| 3 | Create English (en) translation file | feat | â–¡ |
| 4 | Add language switcher in navbar | feat | â–¡ |
| 5 | Translate all static components (Footer, FAQ, Hero) | feat | â–¡ |
| 6 | Translate all form labels & validation messages | feat | â–¡ |
| 7 | Translate cart & checkout flow | feat | â–¡ |
| 8 | Translate admin panel | feat | â–¡ |
| 9 | Translate email templates | feat | â–¡ |
| 10 | Add hreflang meta tags per page | feat | â–¡ |
| 11 | Add language-specific sitemaps | feat | â–¡ |
| 12 | Add language-aware routing (/en/games/mlbb) | feat | â–¡ |
| 13 | Add language persistence (localStorage + URL) | feat | â–¡ |
| 14 | Add language-specific SEO (meta per lang) | feat | â–¡ |
| 15 | Test all pages in both languages | test | â–¡ |

### â–¡ 7.2 Blog & Content System â€” 12 commit

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Setup @astrojs/mdx integration | feat | â–¡ |
| 2 | Create blog collection schema in Astro | feat | â–¡ |
| 3 | Create blog index page (list with pagination) | feat | â–¡ |
| 4 | Create blog article page (MDX rendering) | feat | â–¡ |
| 5 | Add blog post components (code block, image, callout) | feat | â–¡ |
| 6 | Add categories & tags system | feat | â–¡ |
| 7 | Add blog search | feat | â–¡ |
| 8 | Add related posts widget | feat | â–¡ |
| 9 | Add social share buttons on articles | feat | â–¡ |
| 10 | Add reading time estimate | feat | â–¡ |
| 11 | Create 10 starter articles (gaming tips, guides, news) | docs | â–¡ |
| 12 | Add admin blog editor (create/edit/publish) | feat | â–¡ |

### â–¡ 7.3 Flash Sale & Campaign Engine â€” 14 commit

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Create flash_sale table in Supabase | feat | â–¡ |
| 2 | Create flash_sale_products table (many-to-many) | feat | â–¡ |
| 3 | Add countdown timer component (days/hours/min/sec) | feat | â–¡ |
| 4 | Add flash sale badge on product cards | feat | â–¡ |
| 5 | Implement special pricing during flash sale window | feat | â–¡ |
| 6 | Add limited stock counter (selling fast!) | feat | â–¡ |
| 7 | Add flash sale landing page / section | feat | â–¡ |
| 8 | Add flash sale in admin (create, schedule, manage) | feat | â–¡ |
| 9 | Add campaign management (seasonal events) | feat | â–¡ |
| 10 | Add early access for loyalty tier members | feat | â–¡ |
| 11 | Add stock count animation (real-time update) | feat | â–¡ |
| 12 | Add flash sale email notification | feat | â–¡ |
| 13 | Add flash sale analytics (sales, conversion) | feat | â–¡ |
| 14 | Add flash sale auto-start/stop via cron | feat | â–¡ |

### â–¡ 7.4 AI-Powered Features â€” 16 commit

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Set up user behavior tracking (page views, clicks) | feat | â–¡ |
| 2 | Create "recently viewed" component | feat | â–¡ |
| 3 | Create "customers also bought" section | feat | â–¡ |
| 4 | Create "popular in this category" section | feat | â–¡ |
| 5 | Create AI product recommendation API endpoint | feat | â–¡ |
| 6 | Add personalized homepage sections per user | feat | â–¡ |
| 7 | Add trending products section (by views/orders) | feat | â–¡ |
| 8 | Add personalized email recommendations | feat | â–¡ |
| 9 | Add "complete your setup" bundle suggestions | feat | â–¡ |
| 10 | Add trending search suggestions | feat | â–¡ |
| 11 | Add A/B testing framework for recommendations | feat | â–¡ |
| 12 | Track recommendation click-through & conversion | feat | â–¡ |
| 13 | Add personalization settings (user can opt-out) | feat | â–¡ |
| 14 | Create admin recommendation management | feat | â–¡ |
| 15 | Add seasonal/trending recommendation rules | feat | â–¡ |
| 16 | Test & tune recommendation accuracy | test | â–¡ |

### â–¡ 7.5 Real-Time Features â€” 8 commit

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Setup Supabase Realtime subscriptions | feat | â–¡ |
| 2 | Add real-time order status updates (profile) | feat | â–¡ |
| 3 | Add real-time stock changes (admin dashboard) | feat | â–¡ |
| 4 | Add "X people viewing this" on product pages | feat | â–¡ |
| 5 | Add live chat widget (admin â†’ customer) | feat | â–¡ |
| 6 | Add real-time notification bell | feat | â–¡ |
| 7 | Add typing indicator for live chat | feat | â–¡ |
| 8 | Add connection status indicator (online/offline) | feat | â–¡ |

### â–¡ 7.6 Gift Cards & Prepaid â€” 8 commit

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Create gift_card table & schema | feat | â–¡ |
| 2 | Create gift card purchase flow (like a product) | feat | â–¡ |
| 3 | Create gift card redemption page | feat | â–¡ |
| 4 | Add email delivery for digital gift cards | feat | â–¡ |
| 5 | Add gift card balance in user profile | feat | â–¡ |
| 6 | Add gift card as payment method in checkout | feat | â–¡ |
| 7 | Add admin gift card management (issue, void) | feat | â–¡ |
| 8 | Add gift card analytics (issued, redeemed, balance) | feat | â–¡ |

### â–¡ 7.7 Affiliate & Referral Program â€” 8 commit

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Create affiliate/ref table in Supabase | feat | â–¡ |
| 2 | Create unique referral link per user | feat | â–¡ |
| 3 | Implement referral commission logic | feat | â–¡ |
| 4 | Create affiliate dashboard (clicks, conversions, earnings) | feat | â–¡ |
| 5 | Add withdrawal system (minimum payout, methods) | feat | â–¡ |
| 6 | Add referral share buttons (WhatsApp, Telegram) | feat | â–¡ |
| 7 | Add admin affiliate management | feat | â–¡ |
| 8 | Add affiliate analytics & fraud detection | feat | â–¡ |

### â–¡ 7.8 Subscription & Auto Top-Up â€” 10 commit

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Create subscription table in Supabase | feat | â–¡ |
| 2 | Create subscription plan management (admin) | feat | â–¡ |
| 3 | Create subscription checkout flow | feat | â–¡ |
| 4 | Implement recurring payment via Midtrans | feat | â–¡ |
| 5 | Add subscription management in user profile | feat | â–¡ |
| 6 | Add subscription status emails (renew, expire, cancel) | feat | â–¡ |
| 7 | Add auto top-up rules (game credits minimum balance) | feat | â–¡ |
| 8 | Add wallet/credit balance system (non-subscription) | feat | â–¡ |
| 9 | Add automated top-up execution | feat | â–¡ |
| 10 | Add subscription analytics & churn tracking | feat | â–¡ |

### â–¡ 7.9 Customer Support â€” 10 commit

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Create ticket support table in Supabase | feat | â–¡ |
| 2 | Create support ticket submission page | feat | â–¡ |
| 3 | Create ticket detail with conversation thread | feat | â–¡ |
| 4 | Add file attachment support for tickets | feat | â–¡ |
| 5 | Add ticket status tracking (open/in-progress/resolved) | feat | â–¡ |
| 6 | Add admin ticket management dashboard | feat | â–¡ |
| 7 | Add ticket priority & assignment (admin) | feat | â–¡ |
| 8 | Add canned responses (admin) | feat | â–¡ |
| 9 | Add ticket satisfaction survey (after close) | feat | â–¡ |
| 10 | Add knowledge base / FAQ self-service | feat | â–¡ |

---

## ðŸš€ FASE 8: DevOps & Production Hardening (35-55 commit)

**Target**: 35-55 commit | **Timeline**: 4-6 hari | **Priority**: ðŸŸ¢ MEDIUM

### â–¡ 8.1 CI/CD Pipeline â€” 10 commit

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Create GitHub Actions: lint check on PR | chore | â–¡ |
| 2 | Create GitHub Actions: unit test on PR | chore | â–¡ |
| 3 | Create GitHub Actions: type check on PR | chore | â–¡ |
| 4 | Create GitHub Actions: build check on PR | chore | â–¡ |
| 5 | Create GitHub Actions: deploy to staging | chore | â–¡ |
| 6 | Create GitHub Actions: deploy to production | chore | â–¡ |
| 7 | Add preview deployment on each PR (Vercel) | chore | â–¡ |
| 8 | Add commitlint + conventional commit check | chore | â–¡ |
| 9 | Add auto-changelog generation on release | chore | â–¡ |
| 10 | Add status badges to README | docs | â–¡ |

### â–¡ 8.2 Monitoring & Error Tracking â€” 8 commit

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Integrate Sentry for error tracking | feat | â–¡ |
| 2 | Add Google Analytics 4 + enhanced ecommerce | feat | â–¡ |
| 3 | Add Hotjar/Clarity for heatmap & session recording | feat | â–¡ |
| 4 | Add uptime monitoring (pingdom/uptimerobot) | chore | â–¡ |
| 5 | Add custom error alerting (email/Slack) | feat | â–¡ |
| 6 | Add performance monitoring dashboard | feat | â–¡ |
| 7 | Add custom event tracking (conversions, funnels) | feat | â–¡ |
| 8 | Add admin analytics dashboard (business metrics) | feat | â–¡ |

### â–¡ 8.3 Security Hardening â€” 6 commit

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Add Content Security Policy (CSP) headers | feat | â–¡ |
| 2 | Add HSTS headers (HTTP Strict Transport Security) | feat | â–¡ |
| 3 | Add HTTPS enforcement (redirect HTTP â†’ HTTPS) | feat | â–¡ |
| 4 | Add rate limiting on all API endpoints | feat | â–¡ |
| 5 | Add input sanitization & validation middleware | feat | â–¡ |
| 6 | Run npm audit & fix all vulnerabilities | chore | â–¡ |

### â–¡ 8.4 Backup & Disaster Recovery â€” 6 commit

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Setup automated Supabase DB backup | chore | â–¡ |
| 2 | Setup Supabase Storage backup (images) | chore | â–¡ |
| 3 | Create manual backup button in admin | feat | â–¡ |
| 4 | Create restore procedure documentation | docs | â–¡ |
| 5 | Create disaster recovery runbook | docs | â–¡ |
| 6 | Test backup restoration | test | â–¡ |

### â–¡ 8.5 Documentation â€” 5 commit

| No | Task | Scope | Status |
|:--:|------|-------|:------:|
| 1 | Update README with setup instructions | docs | â–¡ |
| 2 | Create API documentation (all endpoints) | docs | â–¡ |
| 3 | Create developer onboarding guide | docs | â–¡ |
| 4 | Create deployment guide (production) | docs | â–¡ |
| 5 | Create contributing guide (CONTRIBUTING.md) | docs | â–¡ |

---

## ðŸ“ˆ Progress Tracker Harian

### Sheet Harian

```
Tanggal: ____-__-__
Hari ke: __ / ___

| # | Commit | Scope | Waktu | Selesai? |
|:-:|--------|-------|:-----:|:--------:|
| 1 | ______ | ______ | __:__ | â–¡ |
| 2 | ______ | ______ | __:__ | â–¡ |
| 3 | ______ | ______ | __:__ | â–¡ |
| 4 | ______ | ______ | __:__ | â–¡ |
| 5 | ______ | ______ | __:__ | â–¡ |
| 6 | ______ | ______ | __:__ | â–¡ |
| 7 | ______ | ______ | __:__ | â–¡ |
| 8 | ______ | ______ | __:__ | â–¡ |
| 9 | ______ | ______ | __:__ | â–¡ |
|10 | ______ | ______ | __:__ | â–¡ |

Total commit hari ini: __/10
Target tercapai? [Ya / Tidak]
Kendala: _______________
```

### Grafik Progress (per Fase)

```
Fase 1: Infrastructure â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘  [__/__ commit]
Fase 2: Catalog        â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘  [__/__ commit]
Fase 3: User Features  â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘  [__/__ commit]
Fase 4: Admin Panel    â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘  [__/__ commit]
Fase 5: SEO & Perf     â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘  [__/__ commit]
Fase 6: Testing        â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘  [__/__ commit]
Fase 7: Advanced       â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘  [__/__ commit]
Fase 8: DevOps         â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘  [__/__ commit]

Total: __/___ commit (__%)
```

---

## ðŸ”¥ Quick Start â€” Mulai Sekarang

### 3 Commit Pertama (Hari Ini Juga)

```
1. chore(supabase): create & run initial migration
2. feat(auth): configure Supabase Auth login
3. style(login): improve dark mode contrast
```

### Cara Commit Cepat

```bash
# 1. Buat perubahan
git add .

# 2. Commit (deskripsi jelas)
git commit -m "feat(auth): implement Supabase Auth login"

# 3. Push
git push origin main
```

---

## âš ï¸ Notes

- **Dokumen ini harus selalu diupdate** sesuai progress
- Checklist item dicentang (`[x]`) setelah di-commit ke repo
- Setiap fase harus tuntas sebelum lanjut ke fase berikutnya
- Minimum 10 commit/hari (boleh lebih, jangan kurang)
- Jika ada blocking issue, prioritaskan resolve di hari yang sama
- Gunakan GitHub Issues untuk tracking bug & feature requests

---

*Last Updated: 2026-06-26*
*Author: Claude Code AI Assistant*
*TopZone Project v0.0.1*


