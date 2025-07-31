-- Quick verification that the migration worked
-- Run this in Supabase SQL Editor to verify everything is set up correctly

-- Check if all new columns were added to announcements table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'announcements' 
AND column_name IN ('message', 'type', 'priority', 'target_roles', 'target_users', 'expires_at', 'is_active')
ORDER BY column_name;

-- Check if announcement_reads table was created
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'announcement_reads'
ORDER BY ordinal_position;

-- Check existing announcements and see if data was migrated
SELECT id, title, 
       COALESCE(message, 'NULL') as message,
       COALESCE(content, 'NULL') as content,
       type, priority, target_roles, is_active,
       created_at
FROM announcements 
ORDER BY created_at DESC 
LIMIT 5;

-- Check RLS policies
SELECT policyname, cmd, permissive
FROM pg_policies 
WHERE tablename IN ('announcements', 'announcement_reads')
ORDER BY tablename, policyname;
