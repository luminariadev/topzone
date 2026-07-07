-- Migration: User Vouchers table for tracking assigned/claimed vouchers
-- Fase 3.4 items 2, 9

CREATE TABLE IF NOT EXISTS user_vouchers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL,
  voucher_id UUID NOT NULL REFERENCES vouchers(id) ON DELETE CASCADE,
  is_used BOOLEAN NOT NULL DEFAULT false,
  used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'vouchers' AND column_name = 'target_type'
  ) THEN
    ALTER TABLE vouchers ADD COLUMN target_type TEXT NOT NULL DEFAULT 'general' CHECK (target_type IN ('general', 'user', 'new_user', 'loyalty'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'vouchers' AND column_name = 'max_uses'
  ) THEN
    ALTER TABLE vouchers ADD COLUMN max_uses INTEGER;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'vouchers' AND column_name = 'used_count'
  ) THEN
    ALTER TABLE vouchers ADD COLUMN used_count INTEGER DEFAULT 0;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'vouchers' AND column_name = 'min_purchase'
  ) THEN
    ALTER TABLE vouchers ADD COLUMN min_purchase INTEGER DEFAULT 0;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'vouchers' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE vouchers ADD COLUMN is_active BOOLEAN DEFAULT true;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_user_vouchers_email ON user_vouchers(user_email);
CREATE INDEX IF NOT EXISTS idx_user_vouchers_voucher ON user_vouchers(voucher_id);
CREATE INDEX IF NOT EXISTS idx_user_vouchers_expires ON user_vouchers(expires_at);

ALTER TABLE user_vouchers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own user_vouchers"
  ON user_vouchers FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'email' = user_email);

CREATE POLICY "Users claim vouchers"
  ON user_vouchers FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt() ->> 'email' = user_email);
