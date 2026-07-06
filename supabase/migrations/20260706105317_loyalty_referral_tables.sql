-- Migration 0010: Loyalty & Referral Tables
-- Fase 3.3 items 1, 5, 10

-- Points table
CREATE TABLE IF NOT EXISTS user_points (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL UNIQUE,
  total_points INTEGER NOT NULL DEFAULT 0,
  lifetime_points INTEGER NOT NULL DEFAULT 0,
  tier TEXT NOT NULL DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Points history
CREATE TABLE IF NOT EXISTS points_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL,
  points INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('earn', 'spend', 'bonus', 'expired')),
  description TEXT NOT NULL,
  order_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Referral codes
CREATE TABLE IF NOT EXISTS referral_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  total_referrals INTEGER NOT NULL DEFAULT 0,
  total_reward INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Referral tracking
CREATE TABLE IF NOT EXISTS referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_email TEXT NOT NULL,
  referred_email TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired')),
  reward_points INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_points_history_user ON points_history(user_email);
CREATE INDEX IF NOT EXISTS idx_points_history_created ON points_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON referral_codes(code);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_email);
CREATE INDEX IF NOT EXISTS idx_referrals_referred ON referrals(referred_email);

-- RLS
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- Users can view their own points
CREATE POLICY "Users view own points"
  ON user_points FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'email' = user_email);

-- Users can view own points history
CREATE POLICY "Users view own points_history"
  ON points_history FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'email' = user_email);

-- Users can view own referral code
CREATE POLICY "Users view own referral_code"
  ON referral_codes FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'email' = user_email);

-- Users can view referrals where they are referrer
CREATE POLICY "Users view own referrals"
  ON referrals FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'email' = referrer_email);
