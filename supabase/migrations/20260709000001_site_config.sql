-- supabase/migrations/20260709000001_site_config.sql
-- Create site_config table for admin settings

CREATE TABLE IF NOT EXISTS site_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}',
  category TEXT NOT NULL DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read site config"
  ON site_config FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE email = auth.jwt() ->> 'email' AND is_active = true
    )
  );

CREATE POLICY "Super admins can manage site config"
  ON site_config FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE email = auth.jwt() ->> 'email' AND role = 'super_admin' AND is_active = true
    )
  );

INSERT INTO site_config (key, value, category) VALUES
  ('site_name', '"TopZone"', 'general'),
  ('site_description', '"Platform Top-Up & Gaming Gear Terbaik"', 'general'),
  ('maintenance_mode', 'false', 'general'),
  ('currency', '"IDR"', 'general'),
  ('currency_symbol', '"Rp"', 'general'),
  ('min_order', '10000', 'general'),
  ('payment_midtrans_client_key', '""', 'payment'),
  ('payment_midtrans_server_key', '""', 'payment'),
  ('payment_midtrans_mode', '"sandbox"', 'payment'),
  ('smtp_host', '""', 'email'),
  ('smtp_port', '587', 'email'),
  ('smtp_user', '""', 'email'),
  ('smtp_pass', '""', 'email'),
  ('smtp_from', '"noreply@topzone.id"', 'email'),
  ('whatsapp_support', '""', 'contact'),
  ('instagram_url', '""', 'contact'),
  ('twitter_url', '""', 'contact')
ON CONFLICT (key) DO NOTHING;

CREATE OR REPLACE FUNCTION update_site_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_site_config_updated_at
  BEFORE UPDATE ON site_config
  FOR EACH ROW EXECUTE FUNCTION update_site_config_updated_at();