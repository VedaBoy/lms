-- Step 1: Create announcements table only
-- Run this first to see if the basic table creation works

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
