# Changelog

All notable changes to the TopZone project will be documented in this file.

The format is based on [Keep a Changelogeloglog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased] - 2026-07-01

### 🔒 Security

- **Add Zod validation to checkout & Snap payment APIs** (`src/pages/api/checkout/index.ts`, `src/pages/api/checkout/snap.ts`):
  - Full Zod schema for checkout POST body validation (items, phone format, payment enum, item limits)
  - Typed `SnapSchema` and `CustomerSchema` for Midtrans payment link creation
  - Server-side validation before external API calls with descriptive error messages

- **Improve sanitizeHtml robustness** (`src/utils/helpers.ts`):
  - Added 5-phase sanitization pipeline (script tags → dangerous protocols → event handlers → dangerous tags → meta refresh)
  - Added defense-in-depth patterns for iframe, object, embed, base, and form tags
  - Added `vbscript:` and non-image `data:` URI blocking
  - Added `isSafeHtml()` for quick HTML safety checks
  - Added `stripHtmlTags()` for plain text extraction
  - Documented limitations — recommends DOMPurify for user-facing content

- **Fix empty catch blocks** (`src/lib/products.ts`, `src/pages/admin.astro`, `src/pages/checkout.astro`, `src/pages/profile.astro`, `src/layouts/Layout.astro`):
  - Replace silent catch handlers with `console.warn()` for better diagnostics
  - Prevents silent failures when localStorage/JSON parsing fails

### 🐛 Bug Fixes

- **Fix slugify accented characters** (`src/utils/helpers.ts`):
  - Added `ï/î` → `i` mapping for proper handling of `naïve` → `naive`

- **Fix regex pattern in webhook test** (`src/utils/__tests__/webhook-security.test.ts`):
  - Fixed `d+` → `\d+` for correct digit matching

- **Fix implicit `any` types** (`src/lib/products.ts`):
  - Added explicit `string` type to `slug` parameter in `fetchGameBySlug()`
  - Added explicit `string` type to `slug` parameter in `fetchGearBySlug()`

### 🎨 Code Quality

- **Add explicit return types** (`src/lib/products.ts`):
  - `fetchGames(): Promise<Game[]>`
  - `fetchGears(): Promise<Gear[]>`

- **Improve type safety** (`src/components/Button.astro`):
  - Changed catch-all `[key: string]: any` to `[key: string]: unknown`

- **Remove unsafe `any` casts** (`src/lib/midtrans.ts`):
  - Added typed `SnapWindow` interface replacing `(window as any).snap`

- **Improve deepMerge type safety** (`src/utils/helpers.ts`):
  - Replaced `Record<string, any>` with `Record<string, unknown>` for target type

### 📝 Documentation & Configuration

- **Add CHANGELOG.md**: Track all project changes in Keep a Changelog format
- **Add .editorconfig**: Cross-editor formatting consistency (LF, 2-space indent, UTF-8)
- **Add ESLint configuration** (`.eslintrc.cjs`):
  - TypeScript strict rules with Astro plugin
  - Enforce no-explicit-any, no-empty-catch, prefer-const
  - Added lint/lint:fix scripts to package.json

---

## [0.1.0] - 2026-06-30

### 🚀 Features

- Initial TopZone platform release
- Game & Gear catalog with Neubrutalism theme
- Admin panel with CRUD operations
- User authentication with Supabase Auth
- Midtrans Snap payment integration
- Dark mode support
- PWA-ready with manifest and meta tags

### 🔒 Security

- Admin authentication with hardcoded fallback behind env flag
- CSRF protection via SameSite cookies
- Rate limiting on admin login
- Content Security Policy (CSP) headers
- HSTS enforcement

### 📚 Documentation

- Comprehensive README with installation guide
- Supabase configuration documentation
- Environment variable validation