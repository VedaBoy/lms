-- Step 5: Create RLS policies
-- Run this after step 4 succeeds

-- First check your profiles table structure to make sure we have the right column names
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'profiles';

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
