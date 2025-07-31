-- Add status column to grades table

-- Create status enum type if it doesn't exist
DO $$ BEGIN
    CREATE TYPE content_status AS ENUM ('active', 'draft', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add status column to grades table
ALTER TABLE grades ADD COLUMN IF NOT EXISTS status content_status DEFAULT 'active';

-- Add status to subjects table if it doesn't exist
ALTER TABLE subjects ADD COLUMN IF NOT EXISTS status content_status DEFAULT 'active';

-- Add status to chapters table if it doesn't exist  
ALTER TABLE chapters ADD COLUMN IF NOT EXISTS status content_status DEFAULT 'active';

-- Add status to concepts table if it doesn't exist
ALTER TABLE concepts ADD COLUMN IF NOT EXISTS status content_status DEFAULT 'active';

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_grades_status ON grades(status);
CREATE INDEX IF NOT EXISTS idx_subjects_status ON subjects(status);
CREATE INDEX IF NOT EXISTS idx_chapters_status ON chapters(status);
CREATE INDEX IF NOT EXISTS idx_concepts_status ON concepts(status);
