import React, { useState } from 'react';
import Layout from '../../components/Layout';
import MyConcepts from './MyConcepts';
import MyProgress from './MyProgress';
import { User } from '../../types';
import { 
  BookOpen, 
  BarChart3, 
  Target, 
  Clock,
  TrendingUp,
  Award,
  PlayCircle,
  CheckCircle2
} from 'lucide-react';

interface StudentDashboardProps {
  user: User;
  onLogout: () => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, onLogout }) => {
  const [currentView, setCurrentView] = useState('overview');

  const navigation = [
    {
      name: 'My Dashboard',
      icon: BarChart3,
      current: currentView === 'overview',
      onClick: () => setCurrentView('overview'),
    },
    {
      name: 'My Concepts',
      icon: BookOpen,
      current: currentView === 'concepts',
      onClick: () => setCurrentView('concepts'),
    },
    {
      name: 'My Progress',
      icon: TrendingUp,
      current: currentView === 'progress',
      onClick: () => setCurrentView('progress'),
    },
  ];

  const renderContent = () => {
    switch (currentView) {
      case 'concepts':
        return <MyConcepts />;
      case 'progress':
        return <MyProgress />;
      default:
        return <StudentOverview user={user} />;
    }
  };

  return (
    <Layout user={user} navigation={navigation} onLogout={onLogout}>
      {renderContent()}
    </Layout>
  );
};

const StudentOverview: React.FC<{ user: User }> = ({ user }) => {
  const stats = [
    { name: 'Concepts Completed', value: '12', change: '+3 this week', icon: CheckCircle2, color: 'bg-gradient-to-br from-blue-500 to-blue-600' },
    { name: 'Current Score', value: '88%', change: '+5% improvement', icon: Award, color: 'bg-gradient-to-br from-blue-500 to-blue-600' },
    { name: 'Time Studied', value: '245m', change: 'This week', icon: Clock, color: 'bg-gradient-to-br from-blue-500 to-blue-600' },
    { name: 'Streak Days', value: '7', change: 'Keep it up!', icon: TrendingUp, color: 'bg-gradient-to-br from-orange-500 to-orange-600' },
  ];

  const todayAssignments = [
    {
      id: '1',
      concept: 'Decimal Operations',
      subject: 'Mathematics',
      dueDate: 'Today',
      estimatedTime: 25,
      progress: 0,
      status: 'not_started',
      priority: 'high',
    },
    {
      id: '2',
      concept: 'Photosynthesis Process',
      subject: 'Science',
      dueDate: 'Tomorrow',
      estimatedTime: 20,
      progress: 45,
      status: 'in_progress',
      priority: 'medium',
    },
    {
      id: '3',
      concept: 'Reading Comprehension',
      subject: 'English',
      dueDate: 'Jan 20',
      estimatedTime: 30,
      progress: 0,
      status: 'not_started',
      priority: 'low',
    },
  ];

  const recentActivity = [
    { concept: 'Integer Operations', action: 'Completed', score: 92, time: '2 hours ago' },
    { concept: 'Fraction Addition', action: 'Watched video', score: null, time: '1 day ago' },
    { concept: 'Geometry Basics', action: 'Started practice', score: null, time: '2 days ago' },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-700';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-700';
      case 'low':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-700';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-700';
      case 'in_progress':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-700';
      case 'not_started':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-600';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 sm:px-6 lg:px-8 scroll-smooth theme-transition">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
          Welcome back, {user.name}!
        </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-300 text-lg">
          Track your learning progress and achievements.
        </p>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
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
                  <p className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors theme-transition">{stat.value}</p>
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-medium">{stat.change}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Enhanced Today's Assignments */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 animate-fade-in theme-transition" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600 rounded-t-2xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
              <Target className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
              Today's Assignments
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {todayAssignments.map((assignment, index) => (
                <div 
                  key={assignment.id} 
                  className="btn-glass group rounded-2xl p-4 hover:border-blue-200 dark:hover:border-blue-600 transition-all duration-300 theme-transition animate-fade-in"
                  style={{ animationDelay: `${500 + index * 100}ms`, animationFillMode: 'forwards' }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors theme-transition">{assignment.concept}</h4>
                        <span className={`ml-2 inline-flex px-3 py-1 text-xs font-bold rounded-full shadow-sm ${getPriorityColor(assignment.priority)}`}>
                          {assignment.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">{assignment.subject}</p>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                        <div className="flex items-center mr-4 p-1 rounded-lg bg-gray-50 dark:bg-gray-600">
                          <Clock className="w-3 h-3 mr-1 text-blue-500 dark:text-blue-400" />
                          <span className="font-medium">{assignment.estimatedTime} min</span>
                        </div>
                        <div className="flex items-center p-1 rounded-lg bg-gray-50 dark:bg-gray-600">
                          <Target className="w-3 h-3 mr-1 text-orange-500 dark:text-orange-400" />
                          <span className="font-medium">Due {assignment.dueDate}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`inline-flex px-3 py-1.5 text-xs font-bold rounded-full shadow-sm ${getStatusColor(assignment.status)}`}>
                      {assignment.status.replace('_', ' ')}
                    </span>
                  </div>

                  {assignment.progress > 0 && (
                    <div className="mb-3">
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${assignment.progress}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{assignment.progress}% complete</div>
                    </div>
                  )}

                  <button className="w-full bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors theme-transition flex items-center justify-center">
                    <PlayCircle className="w-4 h-4 mr-2" />
                    {assignment.status === 'not_started' ? 'Start Learning' : 'Continue'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-100 dark:border-gray-700 theme-transition">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600 rounded-t-lg">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.action === 'Completed' ? 'bg-green-100 dark:bg-green-900' : 'bg-blue-100 dark:bg-blue-900'
                    }`}>
                      {activity.action === 'Completed' ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <PlayCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">
                      <span className="font-medium">{activity.action}</span> {activity.concept}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>{activity.time}</span>
                      {activity.score && (
                        <>
                          <span className="mx-2">•</span>
                          <span className="text-green-600 dark:text-green-400 font-medium">Score: {activity.score}%</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-100 dark:border-gray-700 p-6 theme-transition">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Access</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-800/40 p-4 rounded-lg text-center transition-colors theme-transition border border-blue-200 dark:border-blue-700">
            <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-blue-900 dark:text-blue-300">All Concepts</p>
          </button>
          <button className="bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-800/40 p-4 rounded-lg text-center transition-colors theme-transition border border-green-200 dark:border-green-700">
            <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-green-900 dark:text-green-300">My Progress</p>
          </button>
          <button className="bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-800/40 p-4 rounded-lg text-center transition-colors theme-transition border border-blue-200 dark:border-blue-700">
            <Award className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-blue-900 dark:text-blue-300">Achievements</p>
          </button>
          <button className="bg-orange-50 dark:bg-orange-900/30 hover:bg-orange-100 dark:hover:bg-orange-800/40 p-4 rounded-lg text-center transition-colors theme-transition border border-orange-200 dark:border-orange-700">
            <Clock className="h-8 w-8 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-orange-900 dark:text-orange-300">Study Schedule</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;