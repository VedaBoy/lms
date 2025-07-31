-- Migration: Add Announcements Table for Admin Notifications

-- Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'info' CHECK (type IN ('success', 'warning', 'info', 'error')),
  priority text NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  target_roles text[] NOT NULL DEFAULT '{}', -- Array of roles: admin, teacher, student, parent
  target_users uuid[] DEFAULT '{}', -- Specific user IDs (optional, empty means all users in target_roles)
  expires_at timestamptz, -- Optional expiration date
  created_by uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create announcement_reads table to track which users have read which announcements
CREATE TABLE IF NOT EXISTS announcement_reads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_id uuid REFERENCES announcements(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  read_at timestamptz DEFAULT now(),
  UNIQUE(announcement_id, user_id)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_announcements_created_by ON announcements(created_by);
CREATE INDEX IF NOT EXISTS idx_announcements_target_roles ON announcements USING GIN(target_roles);
CREATE INDEX IF NOT EXISTS idx_announcements_target_users ON announcements USING GIN(target_users);
CREATE INDEX IF NOT EXISTS idx_announcements_is_active ON announcements(is_active);
CREATE INDEX IF NOT EXISTS idx_announcements_expires_at ON announcements(expires_at);
CREATE INDEX IF NOT EXISTS idx_announcement_reads_announcement_id ON announcement_reads(announcement_id);
CREATE INDEX IF NOT EXISTS idx_announcement_reads_user_id ON announcement_reads(user_id);

-- Enable Row Level Security
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcement_reads ENABLE ROW LEVEL SECURITY;

-- RLS Policies for announcements table
CREATE POLICY "Users can view announcements targeted to their role" ON announcements
  FOR SELECT TO authenticated USING (
    is_active = true AND
    (expires_at IS NULL OR expires_at > now()) AND
    (
      -- Check if user's role is in target_roles
      EXISTS (
        SELECT 1 FROM profiles 
        WHERE user_id = auth.uid() 
        AND role::text = ANY(target_roles)
      )
      OR
      -- Check if user is specifically targeted
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

-- Insert some sample announcements for testing
INSERT INTO announcements (title, message, type, priority, target_roles, created_by)
SELECT 
  'Welcome to the New LMS Platform!',
  'We are excited to announce the launch of our new Learning Management System. Explore the new features and let us know your feedback.',
  'success',
  'high',
  ARRAY['admin', 'teacher', 'student', 'parent'],
  profiles.id
FROM profiles 
WHERE role = 'admin' 
LIMIT 1;

INSERT INTO announcements (title, message, type, priority, target_roles, created_by)
SELECT 
  'System Maintenance Scheduled',
  'The system will undergo scheduled maintenance on Sunday from 2:00 AM to 4:00 AM. During this time, the platform may be temporarily unavailable.',
  'warning',
  'normal',
  ARRAY['admin', 'teacher', 'student', 'parent'],
  profiles.id
FROM profiles 
WHERE role = 'admin' 
LIMIT 1;

INSERT INTO announcements (title, message, type, priority, target_roles, created_by)
SELECT 
  'New Course Materials Available',
  'New interactive course materials have been added to the Mathematics curriculum. Teachers can now access advanced problem sets and video tutorials.',
  'info',
  'normal',
  ARRAY['teacher'],
  profiles.id
FROM profiles 
WHERE role = 'admin' 
LIMIT 1;
