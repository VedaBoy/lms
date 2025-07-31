-- Fix RLS policies for announcements system
-- Run this in your Supabase SQL editor to fix the authentication issue

-- First, let's check what auth.uid() returns vs your profiles table
-- This will help us understand the relationship
SELECT 
  auth.uid() as auth_user_id,
  p.id as profile_id,
  p.name,
  p.role
FROM profiles p
WHERE p.id = auth.uid()::uuid
LIMIT 1;

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view announcements targeted to their role" ON announcements;
DROP POLICY IF EXISTS "Admins can manage all announcements" ON announcements;
DROP POLICY IF EXISTS "Users can create announcement_reads for themselves" ON announcement_reads;
DROP POLICY IF EXISTS "Users can view their own announcement_reads" ON announcement_reads;
DROP POLICY IF EXISTS "Admins can view all announcement_reads" ON announcement_reads;

-- Create more permissive policies that should work
-- Allow authenticated users to view active announcements
CREATE POLICY "Authenticated users can view active announcements" ON announcements
  FOR SELECT TO authenticated USING (
    is_active = true AND
    (expires_at IS NULL OR expires_at > now())
  );

-- Allow admins to do everything with announcements
CREATE POLICY "Admins can manage announcements" ON announcements
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid()::uuid
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid()::uuid
      AND role = 'admin'
    )
  );

-- Allow authenticated users to manage their own announcement reads
CREATE POLICY "Users can manage their announcement reads" ON announcement_reads
  FOR ALL TO authenticated USING (
    user_id = auth.uid()::uuid
  )
  WITH CHECK (
    user_id = auth.uid()::uuid
  );
