
-- supabase/migrations/20250730120000_add_gamification_features.sql

-- 1. Achievements Table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  icon text, -- Can be an emoji or a name for an icon component
  criteria jsonb NOT NULL, -- e.g., {"type": "complete_concepts", "count": 1}
  created_at timestamptz DEFAULT now()
);

-- 2. User Achievements Table
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id uuid REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Enable RLS
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for achievements
CREATE POLICY "Authenticated users can read achievements"
  ON achievements
  FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for user_achievements
CREATE POLICY "Users can read their own achievements"
  ON user_achievements
  FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.user_id = auth.uid() AND p.id = user_achievements.user_id));

CREATE POLICY "Teachers can read their students' achievements"
  ON user_achievements
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN classes c ON c.teacher_id = p.id
      WHERE p.user_id = auth.uid()
      AND p.role = 'teacher'
      AND user_achievements.user_id = ANY(c.student_ids)
    )
  );

-- Seed some initial achievements
INSERT INTO achievements (name, description, icon, criteria) VALUES
('First Steps', 'Complete your first concept', '🎯', '{"type": "complete_concepts", "count": 1}'),
('Math Whiz', 'Score 90% or higher on 3 math concepts', '🧮', '{"type": "score_in_subject", "subject": "Mathematics", "min_score": 90, "count": 3}'),
('Streak Master', 'Study for 7 consecutive days', '🔥', '{"type": "study_streak", "days": 7}'),
('Perfect Score', 'Get 100% on any concept', '⭐', '{"type": "perfect_score", "count": 1}'),
('Time Master', 'Study for 10 hours total', '⏰', '{"type": "time_spent", "minutes": 600}');

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON user_achievements(achievement_id);
