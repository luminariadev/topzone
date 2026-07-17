-- scripts/db-optimization.sql
-- Database Query Optimization: Add indexes for frequently queried columns
-- Run these in Supabase SQL Editor

-- ============================================
-- PRODUCTS TABLE INDEXES
-- ============================================

-- Products by type (games vs gear) — used everywhere
CREATE INDEX IF NOT EXISTS idx_products_type ON products(type);

-- Products by slug — used in detail pages
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

-- Products by type and slug combined — used in [slug].astro pages
CREATE INDEX IF NOT EXISTS idx_products_type_slug ON products(type, slug);

-- Products active/featured status — used in homepage queries
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active) WHERE is_active = true;

-- Products created_at — used in sorting
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- ============================================
-- PRODUCT IMAGES TABLE INDEXES
-- ============================================

-- Product images by product_id — used in detail pages
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);

-- Product images order — used in galleries
CREATE INDEX IF NOT EXISTS idx_product_images_sort_order ON product_images(product_id, sort_order);

-- ============================================
-- REVIEWS TABLE INDEXES
-- ============================================

-- Reviews by product_slug and product_type — used in review queries
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_slug, product_type);

-- Reviews by status (for admin approval)
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);

-- Reviews by created_at — used in sort
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);

-- Reviews by rating — used in sort
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating DESC);

-- Composite index for common query pattern: approved reviews for a product
CREATE INDEX IF NOT EXISTS idx_reviews_active_product ON reviews(product_slug, product_type, status)
  WHERE status = 'approved';

-- ============================================
-- ORDERS TABLE INDEXES
-- ============================================

-- Orders by user_email — used in profile
CREATE INDEX IF NOT EXISTS idx_orders_user_email ON orders(user_email);

-- Orders by status — used in admin dashboard
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Orders by created_at — used in sorting
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Composite: user orders with date sort (profile page query)
CREATE INDEX IF NOT EXISTS idx_orders_user_email_created ON orders(user_email, created_at DESC);

-- ============================================
-- USERS / CUSTOMER TABLE INDEXES
-- ============================================

-- Users by email — used in auth
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================
-- VOUCHERS TABLE INDEXES
-- ============================================

-- Vouchers by code — used in checkout
CREATE INDEX IF NOT EXISTS idx_vouchers_code ON vouchers(code);

-- Active vouchers query
CREATE INDEX IF NOT EXISTS idx_vouchers_active ON vouchers(is_active, expires_at)
  WHERE is_active = true AND expires_at > NOW();

-- ============================================
-- CART ITEMS TABLE INDEXES
-- ============================================

-- Cart items by session/user — used in cart queries
CREATE INDEX IF NOT EXISTS idx_cart_items_session ON cart_items(session_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user ON cart_items(user_email);

-- ============================================
-- VERBOSE REPORT
-- ============================================
SELECT
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename IN ('products', 'product_images', 'reviews', 'orders', 'users', 'vouchers', 'cart_items')
ORDER BY tablename, indexname;