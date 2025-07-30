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
    { name: 'Concepts Completed', value: '12', change: '+3 this week', icon: CheckCircle2, color: 'bg-gradient-to-br from-green-500 to-green-600' },
    { name: 'Current Score', value: '88%', change: '+5% improvement', icon: Award, color: 'bg-gradient-to-br from-purple-500 to-purple-600' },
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
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'not_started':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 sm:px-6 lg:px-8 scroll-smooth theme-transition">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
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
            className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-fade-in theme-transition"
            style={{ 
              animationDelay: `${index * 100}ms`,
              animationFillMode: 'forwards'
            }}
          >
            <div className="flex items-center">
              <div className={`flex-shrink-0 p-3 rounded-xl ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors">{stat.name}</p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">{stat.value}</p>
                </div>
                <p className="text-xs text-green-600 mt-1 font-medium">{stat.change}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Enhanced Today's Assignments */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 animate-fade-in theme-transition" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-t-2xl">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <Target className="h-5 w-5 mr-2 text-green-600" />
              Today's Assignments
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {todayAssignments.map((assignment, index) => (
                <div 
                  key={assignment.id} 
                  className="group border border-gray-200 rounded-2xl p-4 hover:shadow-lg hover:border-green-200 transition-all duration-300 transform hover:scale-[1.02] animate-fade-in"
                  style={{ animationDelay: `${500 + index * 100}ms`, animationFillMode: 'forwards' }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h4 className="text-sm font-bold text-gray-900 group-hover:text-green-600 transition-colors">{assignment.concept}</h4>
                        <span className={`ml-2 inline-flex px-3 py-1 text-xs font-bold rounded-full shadow-sm ${getPriorityColor(assignment.priority)}`}>
                          {assignment.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1 font-medium">{assignment.subject}</p>
                      <div className="flex items-center text-xs text-gray-500 mt-2">
                        <div className="flex items-center mr-4 p-1 rounded-lg bg-gray-50">
                          <Clock className="w-3 h-3 mr-1 text-blue-500" />
                          <span className="font-medium">{assignment.estimatedTime} min</span>
                        </div>
                        <div className="flex items-center p-1 rounded-lg bg-gray-50">
                          <Target className="w-3 h-3 mr-1 text-orange-500" />
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
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${assignment.progress}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{assignment.progress}% complete</div>
                    </div>
                  )}

                  <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                    <PlayCircle className="w-4 h-4 mr-2" />
                    {assignment.status === 'not_started' ? 'Start Learning' : 'Continue'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.action === 'Completed' ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      {activity.action === 'Completed' ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <PlayCircle className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.action}</span> {activity.concept}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <span>{activity.time}</span>
                      {activity.score && (
                        <>
                          <span className="mx-2">•</span>
                          <span className="text-green-600 font-medium">Score: {activity.score}%</span>
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
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Access</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg text-center transition-colors">
            <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-blue-900">All Concepts</p>
          </button>
          <button className="bg-green-50 hover:bg-green-100 p-4 rounded-lg text-center transition-colors">
            <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-green-900">My Progress</p>
          </button>
          <button className="bg-purple-50 hover:bg-purple-100 p-4 rounded-lg text-center transition-colors">
            <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-purple-900">Achievements</p>
          </button>
          <button className="bg-orange-50 hover:bg-orange-100 p-4 rounded-lg text-center transition-colors">
            <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-orange-900">Study Schedule</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;