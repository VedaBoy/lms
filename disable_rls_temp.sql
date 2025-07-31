-- Temporary fix: Disable RLS to test functionality
-- Run this ONLY for testing, then re-enable with correct policies

-- Disable RLS temporarily
ALTER TABLE announcements DISABLE ROW LEVEL SECURITY;
ALTER TABLE announcement_reads DISABLE ROW LEVEL SECURITY;

-- Test creating an announcement now
-- After it works, run the next script to re-enable with proper policies
