import React, { useState } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  Clock, 
  Target, 
  Award,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Star,
  BookOpen
} from 'lucide-react';

import { checkAndAwardAchievements } from '../../lib/achievements';
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

  

  const handleConceptComplete = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // In a real app, you would get the student's profile id
      // For now, we'll just use the user's id
      await checkAndAwardAchievements(user.id);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">My Progress</h1>
          <p className="mt-2 text-sm text-gray-700">
            Track your learning journey and celebrate your achievements.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button onClick={handleConceptComplete} className="bg-blue-500 text-white p-2 rounded">Complete a concept</button>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="semester">This Semester</option>
          </select>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-blue-500">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Concepts Completed</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{overallStats.completedConcepts}</p>
                <p className="ml-1 text-sm text-gray-500">/ {overallStats.totalConcepts}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-green-500">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Score</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{overallStats.averageScore}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-purple-500">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Time Studied</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{Math.floor(overallStats.totalTimeSpent / 60)}h</p>
                <p className="ml-1 text-sm text-gray-500">{overallStats.totalTimeSpent % 60}m</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-orange-500">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Current Streak</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{overallStats.currentStreak}</p>
                <p className="ml-1 text-sm text-gray-500">days</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Subject Progress */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Progress by Subject</h3>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {subjectProgress.map((subject) => (
                <div key={subject.subject}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${subject.color} mr-3`} />
                      <span className="text-sm font-medium text-gray-900">{subject.subject}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {subject.completed}/{subject.totalConcepts} completed
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className={`h-2 rounded-full ${subject.color}`}
                      style={{ width: `${(subject.completed / subject.totalConcepts) * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Avg Score: {subject.averageScore}%</span>
                    <span>Time: {Math.floor(subject.timeSpent / 60)}h {subject.timeSpent % 60}m</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Weekly Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {weeklyActivity.map((day) => (
                <div key={day.day} className="flex items-center">
                  <div className="w-12 text-sm font-medium text-gray-600">{day.day}</div>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${Math.min((day.timeSpent / 90) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 w-16 text-right">
                    {day.timeSpent}m
                  </div>
                  <div className="ml-4 flex items-center">
                    {day.conceptsCompleted > 0 && (
                      <div className="flex items-center">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mr-1" />
                        <span className="text-xs text-green-600">{day.conceptsCompleted}</span>
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
      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Scores</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Concept
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentScores.map((score, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <BookOpen className="h-5 w-5 text-gray-400 mr-3" />
                      <div className="text-sm font-medium text-gray-900">{score.concept}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {score.subject}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getScoreColor(score.score)}`}>
                      {score.score}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {score.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Achievements */}
      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Achievements</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => {
              const earned = !!achievement.earned_at;
              return (
                <div
                  key={achievement.id}
                  className={`border rounded-lg p-4 ${
                    earned
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start">
                    <div className="text-2xl mr-3">{achievement.achievement.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900">{achievement.achievement.name}</h4>
                        {earned && (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{achievement.achievement.description}</p>
                      {earned ? (
                        <p className="text-xs text-green-600 mt-2">
                          Earned on {new Date(achievement.earned_at).toLocaleDateString()}
                        </p>
                      ) : (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-1">
                            <div
                              className="bg-blue-600 h-1 rounded-full"
                              style={{ width: `0%` }} // Placeholder for progress
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">0% complete</p> // Placeholder for progress
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