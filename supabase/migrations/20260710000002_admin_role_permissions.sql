-- Migration: Admin Role Permissions - store permission overrides per admin
-- This allows per-admin permission overrides beyond the default matrix

CREATE TABLE IF NOT EXISTS admin_permissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_email TEXT NOT NULL,
  module TEXT NOT NULL,
  permission TEXT NOT NULL,
  granted BOOLEAN NOT NULL DEFAULT true,
  granted_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(admin_email, module, permission)
);

CREATE INDEX IF NOT EXISTS idx_admin_permissions_email ON admin_permissions(admin_email);
CREATE INDEX IF NOT EXISTS idx_admin_permissions_module ON admin_permissions(module);

ALTER TABLE admin_permissions ENABLE ROW LEVEL SECURITY;

-- Only super_admin can manage permissions
CREATE POLICY "Super admins can manage permissions"
  ON admin_permissions FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'super_admin');

-- Add order_notes column to orders if not exists (checkout enhancement)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_notes TEXT;

-- Add notification_badge tracking
CREATE TABLE IF NOT EXISTS admin_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_email TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'order',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  entity_id TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_notifications_email ON admin_notifications(admin_email);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_read ON admin_notifications(admin_email, read);

ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read own notifications"
  ON admin_notifications FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'email' = admin_email);

CREATE POLICY "System can insert notifications"
  ON admin_notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);
