-- Pamodzi Realtime Setup for Supabase
-- Run this in Supabase SQL Editor to enable realtime features

-- ============================================
-- ENABLE REALTIME FOR TABLES
-- ============================================

-- Enable realtime publication for all tables
-- This allows live updates in the admin dashboard

-- Add tables to Supabase realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE songs;
ALTER PUBLICATION supabase_realtime ADD TABLE albums;
ALTER PUBLICATION supabase_realtime ADD TABLE artists;
ALTER PUBLICATION supabase_realtime ADD TABLE categories;
ALTER PUBLICATION supabase_realtime ADD TABLE genres;
ALTER PUBLICATION supabase_realtime ADD TABLE song_genres;
ALTER PUBLICATION supabase_realtime ADD TABLE user_profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE likes;
ALTER PUBLICATION supabase_realtime ADD TABLE downloads;
ALTER PUBLICATION supabase_realtime ADD TABLE song_plays;
ALTER PUBLICATION supabase_realtime ADD TABLE admin_users;

-- ============================================
-- VERIFICATION QUERY
-- ============================================

-- Check which tables are in realtime publication
SELECT 
  schemaname,
  tablename
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime'
ORDER BY tablename;

-- ============================================
-- OPTIONAL: Enable Replication
-- ============================================

-- If you need realtime for specific columns with identity
-- Run this for tables that need row-level changes tracked:

-- Example for songs table (usually not needed for basic realtime)
-- ALTER TABLE songs REPLICA IDENTITY FULL;

-- ============================================
-- NOTES
-- ============================================
-- Realtime is now enabled for all Pamodzi tables
-- Changes to these tables will broadcast to connected clients
-- Useful for: live play counts, new song notifications, admin updates
