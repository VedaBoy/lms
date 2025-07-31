-- Fixed SQL to create announcements table for testing
-- Run this in your Supabase SQL editor

-- Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'info' CHECK (type IN ('success', 'warning', 'info', 'error')),
  priority text NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  target_roles text[] NOT NULL DEFAULT '{}',
  target_users uuid[] DEFAULT '{}',
  expires_at timestamptz,
  created_by uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create announcement_reads table
CREATE TABLE IF NOT EXISTS announcement_reads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_id uuid REFERENCES announcements(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  read_at timestamptz DEFAULT now(),
  UNIQUE(announcement_id, user_id)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_announcements_created_by ON announcements(created_by);
CREATE INDEX IF NOT EXISTS idx_announcements_target_roles ON announcements USING GIN(target_roles);
CREATE INDEX IF NOT EXISTS idx_announcements_target_users ON announcements USING GIN(target_users);
CREATE INDEX IF NOT EXISTS idx_announcements_is_active ON announcements(is_active);
CREATE INDEX IF NOT EXISTS idx_announcements_expires_at ON announcements(expires_at);
CREATE INDEX IF NOT EXISTS idx_announcement_reads_announcement_id ON announcement_reads(announcement_id);
CREATE INDEX IF NOT EXISTS idx_announcement_reads_user_id ON announcement_reads(user_id);

-- Enable RLS
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcement_reads ENABLE ROW LEVEL SECURITY;

-- RLS Policies for announcements table
CREATE POLICY "Users can view announcements targeted to their role" ON announcements
  FOR SELECT TO authenticated USING (
    is_active = true AND
    (expires_at IS NULL OR expires_at > now()) AND
    (
      -- Check if user's role is in target_roles (using auth.uid() directly since it maps to profiles.user_id)
      EXISTS (
        SELECT 1 FROM profiles 
        WHERE user_id = auth.uid() 
        AND role::text = ANY(target_roles)
      )
      OR
      -- Check if user's profile ID is specifically targeted
      EXISTS (
        SELECT 1 FROM profiles 
        WHERE user_id = auth.uid() 
        AND id = ANY(target_users)
      )
    )
  );

CREATE POLICY "Admins can manage all announcements" ON announcements
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- RLS Policies for announcement_reads table
CREATE POLICY "Users can create announcement_reads for themselves" ON announcement_reads
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() 
      AND id = announcement_reads.user_id
    )
  );

CREATE POLICY "Users can view their own announcement_reads" ON announcement_reads
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() 
      AND id = announcement_reads.user_id
    )
  );

CREATE POLICY "Admins can view all announcement_reads" ON announcement_reads
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );
