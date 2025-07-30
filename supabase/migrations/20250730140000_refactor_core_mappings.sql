-- Migration: Refactor Core Mappings
-- This migration introduces proper join tables for key relationships
-- and refactors the classes table for better data integrity.

-- 1. Create parent_student_mapping table
CREATE TABLE IF NOT EXISTS parent_student_mapping (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(parent_id, student_id)
);

-- 2. Create enrollments table for many-to-many student-class relationship
CREATE TYPE enrollment_status AS ENUM ('active', 'withdrawn', 'completed');
CREATE TABLE IF NOT EXISTS enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  enrollment_date timestamptz DEFAULT now(),
  status enrollment_status DEFAULT 'active',
  UNIQUE(student_id, class_id)
);

-- 3. Create teacher_subject_assignments table for many-to-many teacher-subject relationship
CREATE TABLE IF NOT EXISTS teacher_subject_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject_id uuid NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(teacher_id, subject_id)
);

-- 4. Modify the 'classes' table
-- First, add the new single subject_id column
ALTER TABLE classes ADD COLUMN subject_id uuid REFERENCES subjects(id) ON DELETE SET NULL;

-- Note: In a real-world scenario with existing data, we would write a script here
-- to migrate data from the old array columns to the new tables before dropping them.
-- For this new setup, we can just drop the old columns.
ALTER TABLE classes DROP COLUMN IF EXISTS student_ids;
ALTER TABLE classes DROP COLUMN IF EXISTS subject_ids;


-- 5. Add Indexes for performance
CREATE INDEX IF NOT EXISTS idx_parent_student_mapping_parent_id ON parent_student_mapping(parent_id);
CREATE INDEX IF NOT EXISTS idx_parent_student_mapping_student_id ON parent_student_mapping(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_student_id ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_class_id ON enrollments(class_id);
CREATE INDEX IF NOT EXISTS idx_teacher_subject_assignments_teacher_id ON teacher_subject_assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_subject_assignments_subject_id ON teacher_subject_assignments(subject_id);
CREATE INDEX IF NOT EXISTS idx_classes_subject_id ON classes(subject_id);


-- 6. Enable RLS and define policies for new tables
ALTER TABLE parent_student_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_subject_assignments ENABLE ROW LEVEL SECURITY;

-- Policies for parent_student_mapping
CREATE POLICY "Admins can manage parent-student links" ON parent_student_mapping
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Teachers can view links for their students" ON parent_student_mapping
  FOR SELECT USING (EXISTS (SELECT 1 FROM classes WHERE teacher_id = (SELECT id FROM profiles WHERE user_id = auth.uid()) AND student_id = ANY(student_ids)));

CREATE POLICY "Parents can view their own children links" ON parent_student_mapping
  FOR SELECT USING (parent_id = (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- Policies for enrollments
CREATE POLICY "Admins and teachers can manage enrollments" ON enrollments
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role IN ('admin', 'teacher')));

CREATE POLICY "Students can view their own enrollments" ON enrollments
  FOR SELECT USING (student_id = (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- Policies for teacher_subject_assignments
CREATE POLICY "Admins can manage teacher-subject links" ON teacher_subject_assignments
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Teachers can view their own subject assignments" ON teacher_subject_assignments
  FOR SELECT USING (teacher_id = (SELECT id FROM profiles WHERE user_id = auth.uid()));
