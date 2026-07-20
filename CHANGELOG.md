# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [v1.0.0] — 2026-07-21

### Added
- Full product catalog: 24 games + 60+ gear items
- Category filtering (Mobile / PC / Console) on games listing page
- Admin panel with CRUD for games, gear, orders, vouchers, and customers
- Dark/light mode toggle with system preference detection
- User authentication (register, login, logout)
- Shopping cart and checkout flow
- Order history and order detail pages
- Review and rating system for products
- SEO: meta tags, Open Graph, JSON-LD schema, sitemap, robots.txt
- PWA support with installable manifest
- Responsive design (mobile-first)
- GSAP scroll animations
- CI/CD pipeline with GitHub Actions
- Playwright E2E test suite
- Vitest unit tests
- Supabase backend with PostgreSQL schema

### Fixed
- Game image fallback when Supabase is unreachable
- Admin header rendering in dark mode
- Category filter tabs not responding to clicks
- Hamburger menu visibility in light mode
- FAQ question text color in light mode
- Rating star color in testimonials section
- Featured games grid limit (9 items)
- Featured gears grid limit with "View All" link
- 404 page navigation button styling
- Admin login session when Supabase is offline
- Various TypeScript and Astro type checks