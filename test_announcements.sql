-- Test script to verify announcements system works correctly
-- Run this AFTER running update_announcements_table.sql

-- First, let's check the table structure
\d announcements;
\d announcement_reads;

-- Check if all required columns exist
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'announcements' 
AND column_name IN ('message', 'type', 'priority', 'target_roles', 'target_users', 'expires_at', 'is_active')
ORDER BY column_name;

-- Test inserting a sample announcement (replace with your actual admin profile ID)
-- First, get an admin user ID:
SELECT id, name, role FROM profiles WHERE role = 'admin' LIMIT 1;

-- Insert a test announcement (replace 'YOUR_ADMIN_ID' with actual ID from above query)
-- INSERT INTO announcements (title, message, type, priority, target_roles, created_by, is_active)
-- VALUES (
--   'Test Announcement', 
--   'This is a test message', 
--   'info', 
--   'normal', 
--   ARRAY['admin', 'teacher', 'student'], 
--   'YOUR_ADMIN_ID', 
--   true
-- );

-- Check if the announcement was inserted correctly
SELECT id, title, message, type, priority, target_roles, created_by, is_active, created_at 
FROM announcements 
ORDER BY created_at DESC 
LIMIT 5;

-- Test the RLS policies by checking what a sample user can see
-- (This won't work in SQL editor, but shows the structure)
-- SELECT * FROM announcements WHERE is_active = true;
