-- Simple test to verify announcements are being saved
-- Run this in Supabase SQL Editor to check if data exists

-- Check if announcements exist
SELECT 
  id,
  title,
  message,
  content,
  type,
  priority,
  target_roles,
  is_active,
  created_at
FROM announcements 
ORDER BY created_at DESC 
LIMIT 10;

-- Check announcement_reads table
SELECT 
  ar.id,
  ar.announcement_id,
  ar.user_id,
  ar.read_at,
  a.title as announcement_title
FROM announcement_reads ar
JOIN announcements a ON ar.announcement_id = a.id
ORDER BY ar.read_at DESC 
LIMIT 10;

-- Count total announcements
SELECT 
  COUNT(*) as total_announcements,
  COUNT(CASE WHEN is_active = true THEN 1 END) as active_announcements
FROM announcements;
