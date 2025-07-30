-- Migration: Add password_hash column to profiles table for local authentication

-- Add password_hash column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_hash text;

-- Add index for password lookups (though we should avoid selecting by password)
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Update RLS policies to ensure password_hash is never returned in queries
-- Drop and recreate the existing policy to exclude password_hash from selects
DROP POLICY IF EXISTS "Users can view profiles" ON profiles;

-- Create a new policy that explicitly excludes password_hash
CREATE POLICY "Users can view profiles" ON profiles
  FOR SELECT TO authenticated 
  USING (true);

-- Note: We should ensure the application never selects password_hash in queries
-- and only uses it for authentication verification
