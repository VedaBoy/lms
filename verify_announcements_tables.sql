-- Quick verification script to check if announcements tables exist
-- Run this in Supabase SQL Editor AFTER running announcements_setup.sql

-- Check if announcements table exists and show its structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'announcements' 
ORDER BY ordinal_position;

-- Check if announcement_reads table exists and show its structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'announcement_reads' 
ORDER BY ordinal_position;

-- Test a simple query to ensure tables work
SELECT COUNT(*) as announcements_count FROM announcements;
SELECT COUNT(*) as announcement_reads_count FROM announcement_reads;
