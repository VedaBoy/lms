-- Migration script to update existing announcements table to match application requirements
-- Run this in your Supabase SQL editor

-- First, let's add the missing columns to the existing announcements table
ALTER TABLE announcements 
ADD COLUMN IF NOT EXISTS message text,
ADD COLUMN IF NOT EXISTS type text NOT NULL DEFAULT 'info' CHECK (type IN ('success', 'warning', 'info', 'error')),
ADD COLUMN IF NOT EXISTS priority text NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
ADD COLUMN IF NOT EXISTS target_roles text[] NOT NULL DEFAULT '{}',
ADD COLUMN IF NOT EXISTS target_users uuid[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS expires_at timestamptz,
ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;

-- Copy data from existing columns to new ones
UPDATE announcements 
SET 
  message = content,
  expires_at = end_date,
  target_roles = CASE 
    WHEN target_audience IS NULL THEN '{}'::text[]
    ELSE target_audience::text[]
  END
WHERE message IS NULL;

-- Create announcement_reads table if it doesn't exist
CREATE TABLE IF NOT EXISTS announcement_reads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_id uuid REFERENCES announcements(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  read_at timestamptz DEFAULT now(),
  UNIQUE(announcement_id, user_id)
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_announcements_created_by ON announcements(created_by);
CREATE INDEX IF NOT EXISTS idx_announcements_target_roles ON announcements USING GIN(target_roles);
CREATE INDEX IF NOT EXISTS idx_announcements_target_users ON announcements USING GIN(target_users);
CREATE INDEX IF NOT EXISTS idx_announcements_is_active ON announcements(is_active);
CREATE INDEX IF NOT EXISTS idx_announcements_expires_at ON announcements(expires_at);
CREATE INDEX IF NOT EXISTS idx_announcement_reads_announcement_id ON announcement_reads(announcement_id);
CREATE INDEX IF NOT EXISTS idx_announcement_reads_user_id ON announcement_reads(user_id);

-- Enable RLS (it might already be enabled)
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcement_reads ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view announcements targeted to their role" ON announcements;
DROP POLICY IF EXISTS "Admins can manage all announcements" ON announcements;
DROP POLICY IF EXISTS "Users can create announcement_reads for themselves" ON announcement_reads;
DROP POLICY IF EXISTS "Users can view their own announcement_reads" ON announcement_reads;
DROP POLICY IF EXISTS "Admins can view all announcement_reads" ON announcement_reads;

-- Create RLS policies that work with your profiles table structure
-- Note: Your profiles table doesn't have user_id column, so we'll use id directly
CREATE POLICY "Users can view announcements targeted to their role" ON announcements
  FOR SELECT TO authenticated USING (
    is_active = true AND
    (expires_at IS NULL OR expires_at > now()) AND
    (
      -- Check if user's role is in target_roles
      EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid()::uuid
        AND role::text = ANY(target_roles)
      )
      OR
      -- Check if user's profile ID is specifically targeted
      EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid()::uuid
        AND id = ANY(target_users)
      )
    )
  );

CREATE POLICY "Admins can manage all announcements" ON announcements
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid()::uuid
      AND role = 'admin'
    )
  );

-- RLS Policies for announcement_reads table
CREATE POLICY "Users can create announcement_reads for themselves" ON announcement_reads
  FOR INSERT TO authenticated WITH CHECK (
    user_id = auth.uid()::uuid
  );

CREATE POLICY "Users can view their own announcement_reads" ON announcement_reads
  FOR SELECT TO authenticated USING (
    user_id = auth.uid()::uuid
  );

CREATE POLICY "Admins can view all announcement_reads" ON announcement_reads
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid()::uuid
      AND role = 'admin'
    )
  );
