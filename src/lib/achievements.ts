// src/lib/achievements.ts
import { supabase } from './supabaseClient';

export const checkAndAwardAchievements = async (userId: string) => {
  // 1. Get all achievements the user hasn't earned yet
  const { data: unearnedAchievements, error: unearnedError } = await supabase
    .from('achievements')
    .select('*')
    .not('user_achievements', 'inner.user_id', 'eq', userId);

  if (unearnedError) {
    console.error('Error fetching unearned achievements', unearnedError);
    return;
  }

  // 2. Check each unearned achievement
  for (const achievement of unearnedAchievements) {
    let earned = false;
    const criteria = achievement.criteria;

    switch (criteria.type) {
      case 'complete_concepts':
        const { count, error } = await supabase
          .from('student_progress')
          .select('id', { count: 'exact' })
          .eq('student_id', userId)
          .eq('status', 'completed');
        if (error) {
          console.error('Error checking concept completion', error);
          continue;
        }
        if (count >= criteria.count) {
          earned = true;
        }
        break;

      // Add more cases for other achievement types here

      default:
        break;
    }

    // 3. Award the achievement if earned
    if (earned) {
      await supabase.from('user_achievements').insert({
        user_id: userId,
        achievement_id: achievement.id,
      });
    }
  }
};
