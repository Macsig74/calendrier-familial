-- ═══════════════════════════════════════════════════════════════
-- 1. Table push_subscriptions (PWA push notifications)
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      TEXT NOT NULL,
  endpoint     TEXT NOT NULL UNIQUE,
  subscription JSONB NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow_all_push_subscriptions" ON push_subscriptions;
CREATE POLICY "allow_all_push_subscriptions"
  ON push_subscriptions FOR ALL
  USING (true) WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════════
-- 2. Supabase Realtime — activer sur toutes les tables
-- ═══════════════════════════════════════════════════════════════
ALTER PUBLICATION supabase_realtime ADD TABLE IF EXISTS events;
ALTER PUBLICATION supabase_realtime ADD TABLE IF EXISTS tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE IF EXISTS car_reservations;
ALTER PUBLICATION supabase_realtime ADD TABLE IF EXISTS trips;
ALTER PUBLICATION supabase_realtime ADD TABLE IF EXISTS users;
ALTER PUBLICATION supabase_realtime ADD TABLE IF EXISTS cars;

ALTER TABLE events           REPLICA IDENTITY FULL;
ALTER TABLE tasks            REPLICA IDENTITY FULL;
ALTER TABLE car_reservations REPLICA IDENTITY FULL;
ALTER TABLE trips            REPLICA IDENTITY FULL;
ALTER TABLE users            REPLICA IDENTITY FULL;
ALTER TABLE cars             REPLICA IDENTITY FULL;
