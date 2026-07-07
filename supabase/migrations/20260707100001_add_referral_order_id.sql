-- Migration: Add order_id to referrals table (if not already present)
-- Used by referral-complete API to track which order completed a referral

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'referrals' AND column_name = 'order_id'
  ) THEN
    ALTER TABLE referrals ADD COLUMN order_id TEXT;
    CREATE INDEX idx_referrals_order ON referrals(order_id);
  END IF;
END $$;