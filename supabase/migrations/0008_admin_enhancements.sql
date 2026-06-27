-- Migration 0008: Admin enhancements - product status & audit log
-- Adds missing columns and indexes for Phase 1.5 admin panel

-- Add status column to products if not exists
ALTER TABLE products ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'published'
  CHECK (status IN ('draft', 'published', 'archived'));

-- Add index for status-based queries
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_type_status ON products(type, status);

-- Add last_login tracking for admin_users
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS last_login TIMESTAMPTZ;

-- Add index for audit log queries
CREATE INDEX IF NOT EXISTS idx_audit_log_created ON audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_admin ON audit_log(admin_email);

-- Add index for orders management
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_email);

-- Add index for voucher queries
CREATE INDEX IF NOT EXISTS idx_vouchers_code ON vouchers(code);
CREATE INDEX IF NOT EXISTS idx_vouchers_active ON vouchers(is_active);

-- Update existing products to have published status
UPDATE products SET status = 'published' WHERE status IS NULL;
