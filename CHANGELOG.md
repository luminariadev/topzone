# Changelog

All notable changes to the TopZone project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased] - 2026-06-30

### 🔒 Security

- **Improve sanitizeHtml robustness** (`src/utils/helpers.ts`):
  - Added 5-phase sanitization pipeline (script tags → dangerous protocols → event handlers → dangerous tags → meta refresh)
  - Added defense-in-depth patterns for iframe, object, embed, base, and form tags
  - Added `vbscript:` and non-image `data:` URI blocking
  - Added `isSafeHtml()` for quick HTML safety checks
  - Added `stripHtmlTags()` for plain text extraction
  - Documented limitations — recommends DOMPurify for user-facing content

- **Add Zod validation to checkout API** (`src/pages/api/checkout/index.ts`):
  - Full Zod schema for checkout POST body validation
  - Phone number format validation with regex
  - Item count limits (max 100)
  - Payment method enum validation
  - Descriptive error messages from Zod issues

- **Add Zod validation to Snap payment API** (`src/pages/api/checkout/snap.ts`):
  - Typed `SnapSchema` and `CustomerSchema` Zod schemas
  - Server-side validation before Midtrans API call
  - Typed customer data with optional email field

### 🐛 Bug Fixes

- **Fix implicit `any` types** (`src/lib/products.ts`):
  - Added explicit `string` type to `slug` parameter in `fetchGameBySlug()`
  - Added explicit `string` type to `slug` parameter in `fetchGearBySlug()`
  - Prevents potential runtime errors when called with non-string arguments

### 🎨 Code Quality

- **Improve type safety** (`src/components/Button.astro`):
  - Changed catch-all `[key: string]: any` to `[key: string]: unknown`
  - Forces callers to handle unknown prop types explicitly

- **Remove unsafe `any` casts** (`src/lib/midtrans.ts`):
  - Added typed `SnapWindow` interface replacing `(window as any).snap`
  - Type-safe `snap.pay()` calls with proper interface definition

- **Improve deepMerge type safety** (`src/utils/helpers.ts`):
  - Replaced `Record<string, any>` with `Record<string, unknown>` for target type
  - Safer type narrowing in merge operations

### 📝 Documentation

- **Add CHANGELOG.md**: Track all project changes in Keep a Changelog format

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