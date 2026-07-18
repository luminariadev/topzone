-- src/db/migrations/20260719000001_points_loyalty.sql
-- Points & Loyalty system tables
-- Creates: user_points, points_history, loyalty_tiers, referrals, birthday_bonus

-- User Points ledger
CREATE TABLE IF NOT EXISTS user_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  points_balance INTEGER NOT NULL DEFAULT 0 CHECK (points_balance >= 0),
  lifetime_points INTEGER NOT NULL DEFAULT 0 CHECK (lifetime_points >= 0),
  tier_level TEXT NOT NULL DEFAULT 'bronze' CHECK (tier_level IN ('bronze', 'silver', 'gold', 'platinum')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Points history log
CREATE TABLE IF NOT EXISTS points_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  reason TEXT NOT NULL, -- 'earn', 'spend', 'expire', 'bonus', 'adjust'
  reference_type TEXT, -- 'order', 'referral', 'birthday', 'signup', 'review', 'admin_adjust'
  reference_id TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Loyalty tier definitions
CREATE TABLE IF NOT EXISTS loyalty_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE CHECK (name IN ('bronze', 'silver', 'gold', 'platinum')),
  min_lifetime_points INTEGER NOT NULL,
  discount_percent INTEGER NOT NULL DEFAULT 0,
  priority_access BOOLEAN NOT NULL DEFAULT false,
  free_shipping BOOLEAN NOT NULL DEFAULT false,
  birthday_bonus_multiplier INTEGER NOT NULL DEFAULT 1,
  badge_icon TEXT
);

-- Default tier data
INSERT INTO loyalty_tiers (name, min_lifetime_points, discount_percent, priority_access, free_shipping, birthday_bonus_multiplier, badge_icon)
VALUES
  ('bronze', 0, 0, false, false, 1, '🥉'),
  ('silver', 5000, 3, false, false, 2, '🥈'),
  ('gold', 20000, 5, true, true, 3, '🥇'),
  ('platinum', 50000, 10, true, true, 5, '💎')
ON CONFLICT (name) DO NOTHING;

-- Referral system
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_email TEXT,
  referred_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  referral_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'registered', 'completed', 'expired')),
  reward_points INTEGER DEFAULT 0,
  reward_claimed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Birthday bonus tracking
CREATE TABLE IF NOT EXISTS birthday_bonus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  birth_date DATE NOT NULL,
  bonus_year INTEGER NOT NULL,
  points_awarded INTEGER NOT NULL DEFAULT 0,
  claimed BOOLEAN NOT NULL DEFAULT false,
  claimed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, bonus_year)
);

-- Enable RLS
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE birthday_bonus ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view own points" ON user_points FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own history" ON points_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view tiers" ON loyalty_tiers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can view own referrals" ON referrals FOR SELECT USING (auth.uid() = referrer_id);
CREATE POLICY "Users can view own birthday bonus" ON birthday_bonus FOR SELECT USING (auth.uid() = user_id);

-- Admin policies
CREATE POLICY "Admins can view all points" ON user_points FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admins can view all history" ON points_history FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admins can view all referrals" ON referrals FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admins can manage tiers" ON loyalty_tiers FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Indexes
CREATE INDEX idx_points_history_user ON points_history(user_id);
CREATE INDEX idx_points_history_created ON points_history(created_at DESC);
CREATE INDEX idx_referrals_code ON referrals(referral_code);
CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX idx_birthday_bonus_user ON birthday_bonus(user_id);
CREATE INDEX idx_birthday_bonus_year ON birthday_bonus(bonus_year);