-- Run this in your Supabase Dashboard → SQL Editor
-- Adds the push_subscriptions table for PWA push notifications

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     TEXT NOT NULL,
  endpoint    TEXT NOT NULL UNIQUE,
  subscription JSONB NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Allow the anon key to insert/update/select subscriptions
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_all_push_subscriptions"
  ON push_subscriptions
  FOR ALL
  USING (true)
  WITH CHECK (true);
