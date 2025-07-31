import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  Clock, 
  Target, 
  Award,
  BarChart3,
  CheckCircle2,
  Star,
  BookOpen,
  Trophy
} from 'lucide-react';

import { supabase } from '../../lib/supabaseClient';

const MyProgress: React.FC = () => {
  const [achievements, setAchievements] = useState<any[]>([]);

  useEffect(() => {
    const fetchAchievements = async () => {
      const { data, error } = await supabase
        .from('user_achievements')
        .select('*, achievement:achievement_id(name, description, icon))');
      if (error) console.error('Error fetching achievements', error);
      else setAchievements(data || []);
    };
    fetchAchievements();
  }, []);
  const [timeRange, setTimeRange] = useState('week');

  // Mock data
  const overallStats = {
    totalConcepts: 15,
    completedConcepts: 8,
    inProgressConcepts: 4,
    notStartedConcepts: 3,
    averageScore: 86,
    totalTimeSpent: 420, // minutes
    currentStreak: 7,
    longestStreak: 12,
  };

  const subjectProgress = [
    {
      subject: 'Mathematics',
      totalConcepts: 8,
      completed: 5,
      inProgress: 2,
      notStarted: 1,
      averageScore: 88,
      timeSpent: 245,
      color: 'bg-blue-500',
    },
    {
      subject: 'Science',
      totalConcepts: 4,
      completed: 2,
      inProgress: 1,
      notStarted: 1,
      averageScore: 82,
      timeSpent: 125,
      color: 'bg-green-500',
    },
    {
      subject: 'English',
      totalConcepts: 3,
      completed: 1,
      inProgress: 1,
      notStarted: 1,
      averageScore: 90,
      timeSpent: 50,
      color: 'bg-purple-500',
    },
  ];

  const recentScores = [
    { concept: 'Integer Operations', score: 92, date: '2024-01-10', subject: 'Mathematics' },
    { concept: 'Fraction Addition', score: 85, date: '2024-01-08', subject: 'Mathematics' },
    { concept: 'Plant Biology', score: 88, date: '2024-01-05', subject: 'Science' },
    { concept: 'Reading Comprehension', score: 90, date: '2024-01-03', subject: 'English' },
    { concept: 'Geometry Basics', score: 78, date: '2024-01-01', subject: 'Mathematics' },
  ];

  const weeklyActivity = [
    { day: 'Mon', timeSpent: 45, conceptsCompleted: 1 },
    { day: 'Tue', timeSpent: 60, conceptsCompleted: 2 },
    { day: 'Wed', timeSpent: 30, conceptsCompleted: 0 },
    { day: 'Thu', timeSpent: 75, conceptsCompleted: 1 },
    { day: 'Fri', timeSpent: 90, conceptsCompleted: 2 },
    { day: 'Sat', timeSpent: 40, conceptsCompleted: 1 },
    { day: 'Sun', timeSpent: 55, conceptsCompleted: 1 },
  ];

  

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
    if (score >= 80) return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
    return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 sm:px-6 lg:px-8 scroll-smooth theme-transition">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          My Progress
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300 text-lg">
          Track your learning journey and celebrate your achievements.
        </p>
        <div className="mt-4 flex justify-end">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm theme-transition"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="semester">This Semester</option>
          </select>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { name: 'Concepts Completed', value: overallStats.completedConcepts, total: overallStats.totalConcepts, icon: Target, color: 'bg-gradient-to-br from-blue-500 to-blue-600' },
          { name: 'Average Score', value: `${overallStats.averageScore}%`, icon: Award, color: 'bg-gradient-to-br from-green-500 to-green-600' },
          { name: 'Time Studied', value: `${Math.floor(overallStats.totalTimeSpent / 60)}h ${overallStats.totalTimeSpent % 60}m`, icon: Clock, color: 'bg-gradient-to-br from-purple-500 to-purple-600' },
          { name: 'Current Streak', value: `${overallStats.currentStreak} days`, icon: TrendingUp, color: 'bg-gradient-to-br from-orange-500 to-orange-600' }
        ].map((stat, index) => (
          <div 
            key={stat.name} 
            className="btn-glass group rounded-2xl shadow-lg p-6 transition-all duration-300 theme-transition animate-fade-in"
            style={{ 
              animationDelay: `${index * 100}ms`,
              animationFillMode: 'forwards'
            }}
          >
            <div className="flex items-center">
              <div className={`flex-shrink-0 p-3 rounded-xl ${stat.color} shadow-lg transition-transform duration-200`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-100 transition-colors theme-transition">{stat.name}</p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors theme-transition">
                    {typeof stat.value === 'number' ? stat.value : stat.value}
                  </p>
                  {stat.total && <p className="ml-1 text-sm text-gray-500 dark:text-gray-400">/ {stat.total}</p>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Subject Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 animate-fade-in theme-transition" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-t-2xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
              Progress by Subject
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {subjectProgress.map((subject) => (
                <div key={subject.subject}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${subject.color} mr-3`} />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{subject.subject}</span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {subject.completed}/{subject.totalConcepts} completed
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-2">
                    <div 
                      className={`h-2 rounded-full ${subject.color}`}
                      style={{ width: `${(subject.completed / subject.totalConcepts) * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Avg Score: {subject.averageScore}%</span>
                    <span>Time: {Math.floor(subject.timeSpent / 60)}h {subject.timeSpent % 60}m</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 animate-fade-in theme-transition" style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-t-2xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
              Weekly Activity
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {weeklyActivity.map((day) => (
                <div key={day.day} className="flex items-center">
                  <div className="w-12 text-sm font-medium text-gray-600 dark:text-gray-300">{day.day}</div>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full" 
                        style={{ width: `${Math.min((day.timeSpent / 90) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 w-16 text-right">
                    {day.timeSpent}m
                  </div>
                  <div className="ml-4 flex items-center">
                    {day.conceptsCompleted > 0 && (
                      <div className="flex items-center">
                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 mr-1" />
                        <span className="text-xs text-green-600 dark:text-green-400">{day.conceptsCompleted}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Scores */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 animate-fade-in theme-transition" style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-700 dark:to-gray-600 rounded-t-2xl">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
            <Star className="h-5 w-5 mr-2 text-orange-600 dark:text-orange-400" />
            Recent Scores
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Concept
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {recentScores.map((score, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 theme-transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <BookOpen className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3" />
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{score.concept}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {score.subject}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getScoreColor(score.score)}`}>
                      {score.score}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {score.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Achievements */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 animate-fade-in theme-transition" style={{ animationDelay: '700ms', animationFillMode: 'forwards' }}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 rounded-t-2xl">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
            Achievements
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => {
              const earned = !!achievement.earned_at;
              return (
                <div
                  key={achievement.id}
                  className={`border rounded-2xl p-4 theme-transition ${
                    earned
                      ? 'border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-start">
                    <div className="text-2xl mr-3">{achievement.achievement.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">{achievement.achievement.name}</h4>
                        {earned && (
                          <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{achievement.achievement.description}</p>
                      {earned ? (
                        <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                          Earned on {new Date(achievement.earned_at).toLocaleDateString()}
                        </p>
                      ) : (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1">
                            <div
                              className="bg-blue-600 dark:bg-blue-400 h-1 rounded-full"
                              style={{ width: `0%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">0% complete</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProgress;