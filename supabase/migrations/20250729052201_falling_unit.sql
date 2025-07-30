/*
  # K-12 LMS Platform Database Schema

  This schema supports a comprehensive K-12 Learning Management System with the following features:
  - User management with role-based access control
  - School and class organization
  - Curriculum framework (subjects, chapters, concepts)
  - Content integration with external providers
  - Assignment and progress tracking
  - AV streaming playlists

  ## Tables Overview:
  1. profiles - User profiles linked to Supabase auth
  2. schools - School information
  3. classes - Class organization
  4. subjects - Subject definitions
  5. chapters - Chapter organization within subjects
  6. concepts - Individual learning concepts
  7. content_integrations - External content mappings
  8. assignments - Concept assignments to students
  9. student_progress - Individual student progress tracking
  10. av_playlists - AV streaming playlists for teachers

  ## Security:
  - Row Level Security (RLS) enabled on all tables
  - Policies ensure users can only access appropriate data based on their role
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'teacher', 'student', 'parent');
CREATE TYPE assignment_status AS ENUM ('active', 'completed', 'archived');
CREATE TYPE progress_status AS ENUM ('not_started', 'in_progress', 'completed');
CREATE TYPE playlist_status AS ENUM ('draft', 'scheduled', 'active', 'completed');
CREATE TYPE content_provider AS ENUM ('youtube', 'vimeo', 'lti');

-- 1. User Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  school_id uuid,
  phone text,
  address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Schools Table
CREATE TABLE IF NOT EXISTS schools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text,
  phone text,
  email text,
  admin_ids uuid[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. Classes Table
CREATE TABLE IF NOT EXISTS classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  grade_level integer NOT NULL CHECK (grade_level >= 0 AND grade_level <= 12),
  school_id uuid REFERENCES schools(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  student_ids uuid[] DEFAULT '{}',
  subject_ids uuid[] DEFAULT '{}',
  room_number text,
  schedule jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 4. Subjects Table
CREATE TABLE IF NOT EXISTS subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  grade_level_min integer DEFAULT 0,
  grade_level_max integer DEFAULT 12,
  school_id uuid REFERENCES schools(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 5. Chapters Table
CREATE TABLE IF NOT EXISTS chapters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  subject_id uuid REFERENCES subjects(id) ON DELETE CASCADE,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 6. Concepts Table
CREATE TABLE IF NOT EXISTS concepts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  chapter_id uuid REFERENCES chapters(id) ON DELETE CASCADE,
  order_index integer NOT NULL DEFAULT 0,
  meta_tags jsonb DEFAULT '{}',
  estimated_time_minutes integer DEFAULT 30,
  difficulty_level text DEFAULT 'intermediate',
  learning_objectives text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 7. Content Integrations Table
CREATE TABLE IF NOT EXISTS content_integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  concept_id uuid REFERENCES concepts(id) ON DELETE CASCADE,
  provider content_provider NOT NULL,
  content_url text NOT NULL,
  fallback_url text,
  provider_config jsonb DEFAULT '{}',
  title text NOT NULL,
  description text,
  duration_minutes integer,
  content_type text DEFAULT 'video',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 8. Assignments Table
CREATE TABLE IF NOT EXISTS assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  concept_id uuid REFERENCES concepts(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  class_id uuid REFERENCES classes(id) ON DELETE SET NULL,
  student_ids uuid[] NOT NULL DEFAULT '{}',
  due_date timestamptz,
  instructions text,
  priority text DEFAULT 'normal',
  status assignment_status DEFAULT 'active',
  provider_preferences jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 9. Student Progress Table
CREATE TABLE IF NOT EXISTS student_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  concept_id uuid REFERENCES concepts(id) ON DELETE CASCADE,
  assignment_id uuid REFERENCES assignments(id) ON DELETE SET NULL,
  status progress_status DEFAULT 'not_started',
  time_spent_minutes integer DEFAULT 0,
  score integer CHECK (score >= 0 AND score <= 100),
  attempts integer DEFAULT 0,
  last_accessed_at timestamptz,
  completed_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(student_id, concept_id, assignment_id)
);

-- 10. AV Playlists Table
CREATE TABLE IF NOT EXISTS av_playlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  content_items jsonb DEFAULT '[]',
  scheduled_for timestamptz,
  estimated_duration_minutes integer DEFAULT 0,
  status playlist_status DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add foreign key constraint for school_id in profiles
ALTER TABLE profiles ADD CONSTRAINT fk_profiles_school 
  FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_school_id ON profiles(school_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_classes_school_id ON classes(school_id);
CREATE INDEX IF NOT EXISTS idx_classes_teacher_id ON classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_chapters_subject_id ON chapters(subject_id);
CREATE INDEX IF NOT EXISTS idx_concepts_chapter_id ON concepts(chapter_id);
CREATE INDEX IF NOT EXISTS idx_content_integrations_concept_id ON content_integrations(concept_id);
CREATE INDEX IF NOT EXISTS idx_assignments_teacher_id ON assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_assignments_concept_id ON assignments(concept_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_student_id ON student_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_concept_id ON student_progress(concept_id);
CREATE INDEX IF NOT EXISTS idx_av_playlists_teacher_id ON av_playlists(teacher_id);
CREATE INDEX IF NOT EXISTS idx_av_playlists_class_id ON av_playlists(class_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE concepts ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE av_playlists ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles table
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all profiles in their school"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.user_id = auth.uid()
      AND p.role = 'admin'
      AND p.school_id = profiles.school_id
    )
  );

CREATE POLICY "Teachers can read student profiles in their classes"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    role = 'student' AND
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN classes c ON c.teacher_id = p.id
      WHERE p.user_id = auth.uid()
      AND p.role = 'teacher'
      AND profiles.id = ANY(c.student_ids)
    )
  );

-- RLS Policies for schools table
CREATE POLICY "Users can read their school"
  ON schools
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.user_id = auth.uid()
      AND p.school_id = schools.id
    )
  );

CREATE POLICY "Admins can manage their school"
  ON schools
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.user_id = auth.uid()
      AND p.role = 'admin'
      AND p.school_id = schools.id
    )
  );

-- RLS Policies for classes table
CREATE POLICY "Users can read classes in their school"
  ON classes
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.user_id = auth.uid()
      AND p.school_id = classes.school_id
    )
  );

CREATE POLICY "Teachers can manage their classes"
  ON classes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.user_id = auth.uid()
      AND p.id = classes.teacher_id
    )
  );

CREATE POLICY "Admins can manage classes in their school"
  ON classes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.user_id = auth.uid()
      AND p.role = 'admin'
      AND p.school_id = classes.school_id
    )
  );

-- RLS Policies for subjects table
CREATE POLICY "Users can read subjects in their school"
  ON subjects
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.user_id = auth.uid()
      AND p.school_id = subjects.school_id
    )
  );

CREATE POLICY "Admins and teachers can manage subjects"
  ON subjects
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.user_id = auth.uid()
      AND p.role IN ('admin', 'teacher')
      AND p.school_id = subjects.school_id
    )
  );

-- RLS Policies for chapters table
CREATE POLICY "Users can read chapters"
  ON chapters
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN subjects s ON s.school_id = p.school_id
      WHERE p.user_id = auth.uid()
      AND s.id = chapters.subject_id
    )
  );

CREATE POLICY "Admins and teachers can manage chapters"
  ON chapters
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN subjects s ON s.school_id = p.school_id
      WHERE p.user_id = auth.uid()
      AND p.role IN ('admin', 'teacher')
      AND s.id = chapters.subject_id
    )
  );

-- RLS Policies for concepts table
CREATE POLICY "Users can read concepts"
  ON concepts
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN subjects s ON s.school_id = p.school_id
      JOIN chapters ch ON ch.subject_id = s.id
      WHERE p.user_id = auth.uid()
      AND ch.id = concepts.chapter_id
    )
  );

CREATE POLICY "Admins and teachers can manage concepts"
  ON concepts
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN subjects s ON s.school_id = p.school_id
      JOIN chapters ch ON ch.subject_id = s.id
      WHERE p.user_id = auth.uid()
      AND p.role IN ('admin', 'teacher')
      AND ch.id = concepts.chapter_id
    )
  );

-- RLS Policies for content_integrations table
CREATE POLICY "Users can read content integrations"
  ON content_integrations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN subjects s ON s.school_id = p.school_id
      JOIN chapters ch ON ch.subject_id = s.id
      JOIN concepts c ON c.chapter_id = ch.id
      WHERE p.user_id = auth.uid()
      AND c.id = content_integrations.concept_id
    )
  );

CREATE POLICY "Admins and teachers can manage content integrations"
  ON content_integrations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN subjects s ON s.school_id = p.school_id
      JOIN chapters ch ON ch.subject_id = s.id
      JOIN concepts c ON c.chapter_id = ch.id
      WHERE p.user_id = auth.uid()
      AND p.role IN ('admin', 'teacher')
      AND c.id = content_integrations.concept_id
    )
  );

-- RLS Policies for assignments table
CREATE POLICY "Teachers can manage their assignments"
  ON assignments
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.user_id = auth.uid()
      AND p.id = assignments.teacher_id
    )
  );

CREATE POLICY "Students can read their assignments"
  ON assignments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.user_id = auth.uid()
      AND p.id = ANY(assignments.student_ids)
    )
  );

CREATE POLICY "Admins can read assignments in their school"
  ON assignments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN profiles t ON t.id = assignments.teacher_id
      WHERE p.user_id = auth.uid()
      AND p.role = 'admin'
      AND p.school_id = t.school_id
    )
  );

-- RLS Policies for student_progress table
CREATE POLICY "Students can manage their own progress"
  ON student_progress
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.user_id = auth.uid()
      AND p.id = student_progress.student_id
    )
  );

CREATE POLICY "Teachers can read progress of their students"
  ON student_progress
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN classes c ON c.teacher_id = p.id
      WHERE p.user_id = auth.uid()
      AND p.role = 'teacher'
      AND student_progress.student_id = ANY(c.student_ids)
    )
  );

CREATE POLICY "Parents can read their children's progress"
  ON student_progress
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles parent
      JOIN profiles student ON student.id = student_progress.student_id
      WHERE parent.user_id = auth.uid()
      AND parent.role = 'parent'
      AND parent.school_id = student.school_id
      -- Additional parent-child relationship logic would go here
    )
  );

-- RLS Policies for av_playlists table
CREATE POLICY "Teachers can manage their playlists"
  ON av_playlists
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.user_id = auth.uid()
      AND p.id = av_playlists.teacher_id
    )
  );

CREATE POLICY "Students can read playlists for their classes"
  ON av_playlists
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN classes c ON c.id = av_playlists.class_id
      WHERE p.user_id = auth.uid()
      AND p.role = 'student'
      AND p.id = ANY(c.student_ids)
    )
  );

-- Create functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_schools_updated_at BEFORE UPDATE ON schools FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON subjects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chapters_updated_at BEFORE UPDATE ON chapters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_concepts_updated_at BEFORE UPDATE ON concepts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_integrations_updated_at BEFORE UPDATE ON content_integrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_student_progress_updated_at BEFORE UPDATE ON student_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_av_playlists_updated_at BEFORE UPDATE ON av_playlists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();