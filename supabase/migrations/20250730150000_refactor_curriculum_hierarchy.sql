-- Migration: Implement Hierarchical Curriculum Structure

-- 1. Drop old, now-redundant tables to avoid conflicts.
-- Note: This is destructive. In a production environment, we would migrate data first.
DROP TABLE IF EXISTS enrollments;
DROP TABLE IF EXISTS teacher_subject_assignments;
DROP TABLE IF EXISTS classes;

-- 2. Create the new top-level 'grades' table.
CREATE TABLE IF NOT EXISTS grades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, -- e.g., "Kindergarten", "5th Grade"
  level integer UNIQUE NOT NULL, -- e.g., 0 for K, 5 for 5th
  created_at timestamptz DEFAULT now()
);

-- 3. Refactor the 'subjects' table to link to grades and teachers.
-- Remove school_id as it's now inherited from the grade->school relationship (if we add schools back to grades).
-- Add grade_id and teacher_id.
ALTER TABLE subjects DROP COLUMN IF EXISTS school_id;
ALTER TABLE subjects DROP COLUMN IF EXISTS grade_level_min;
ALTER TABLE subjects DROP COLUMN IF EXISTS grade_level_max;
ALTER TABLE subjects ADD COLUMN IF NOT EXISTS grade_id uuid REFERENCES grades(id) ON DELETE CASCADE;
ALTER TABLE subjects ADD COLUMN IF NOT EXISTS teacher_id uuid REFERENCES profiles(id) ON DELETE SET NULL;

-- 4. RLS for the new 'grades' table.
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view grades" ON grades
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage grades" ON grades
  FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- 5. Update RLS for 'subjects' to reflect new structure.
-- Drop old policy if it exists
DROP POLICY IF EXISTS "Users can read subjects in their school" ON subjects;
DROP POLICY IF EXISTS "Admins and teachers can manage subjects" ON subjects;

CREATE POLICY "Users can read subjects" ON subjects
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins and teachers can manage subjects" ON subjects
  FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role IN ('admin', 'teacher')));

-- 6. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_grades_level ON grades(level);
CREATE INDEX IF NOT EXISTS idx_subjects_grade_id ON subjects(grade_id);
CREATE INDEX IF NOT EXISTS idx_subjects_teacher_id ON subjects(teacher_id);
