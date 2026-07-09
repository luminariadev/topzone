-- Migration: Admin Enhancements v2 - 2FA, IP Restrictions, Security
-- Fase 4 items: 4.3.5 (2FA), 4.3.9 (IP restriction), 4.3.14 (backup)

-- Add 2FA columns to admin_users
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS totp_secret TEXT;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS totp_enabled BOOLEAN DEFAULT false;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS totp_verified_at TIMESTAMPTZ;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS backup_codes TEXT[] DEFAULT '{}';

-- Add IP restriction columns
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS last_login_ip TEXT;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS allowed_ips TEXT[] DEFAULT '{}';
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS ip_restriction_enabled BOOLEAN DEFAULT false;

-- Add login tracking
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS login_attempts INTEGER DEFAULT 0;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS locked_until TIMESTAMPTZ;

-- Add report preferences
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS receive_daily_report BOOLEAN DEFAULT true;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS report_time TEXT DEFAULT '06:00';

-- Add notes and activity tracking
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS notes TEXT;

-- Add site_config indexes
CREATE INDEX IF NOT EXISTS idx_site_config_category ON site_config(category);
CREATE INDEX IF NOT EXISTS idx_site_config_key ON site_config(key);

-- Add user_profiles is_banned if missing
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT false;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS is_suspended BOOLEAN DEFAULT false;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS banned_at TIMESTAMPTZ;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS banned_reason TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Create stock_history table if not exists
CREATE TABLE IF NOT EXISTS stock_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  package_id UUID REFERENCES product_packages(id) ON DELETE CASCADE,
  previous_stock INTEGER NOT NULL DEFAULT 0,
  new_stock INTEGER NOT NULL DEFAULT 0,
  change_amount INTEGER NOT NULL DEFAULT 0,
  reason TEXT NOT NULL DEFAULT 'adjustment',
  note TEXT,
  created_by TEXT NOT NULL DEFAULT 'system',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_stock_history_product ON stock_history(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_history_package ON stock_history(package_id);
CREATE INDEX IF NOT EXISTS idx_stock_history_created ON stock_history(created_at DESC);