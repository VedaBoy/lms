-- Debug script to understand your authentication system
-- Run this while logged in as an admin to see the relationship

-- Check what auth.uid() returns
SELECT auth.uid() as current_auth_uid;

-- Check all profiles to see the structure
SELECT id, name, email, role 
FROM profiles 
ORDER BY role, name;

-- Try to find the current user's profile
SELECT 
  p.id,
  p.name,
  p.email,
  p.role,
  CASE 
    WHEN p.id = auth.uid()::uuid THEN 'MATCH by id'
    ELSE 'NO MATCH'
  END as auth_match
FROM profiles p
ORDER BY p.role, p.name;
