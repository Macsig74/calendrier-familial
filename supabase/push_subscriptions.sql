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
--    (DO blocks pour ignorer si déjà ajoutées)
-- ═══════════════════════════════════════════════════════════════
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE events;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE car_reservations;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE trips;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE users;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE cars;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE events           REPLICA IDENTITY FULL;
ALTER TABLE tasks            REPLICA IDENTITY FULL;
ALTER TABLE car_reservations REPLICA IDENTITY FULL;
ALTER TABLE trips            REPLICA IDENTITY FULL;
ALTER TABLE users            REPLICA IDENTITY FULL;
ALTER TABLE cars             REPLICA IDENTITY FULL;
