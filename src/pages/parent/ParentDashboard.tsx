import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { User } from '../../types';
import { 
  Users, 
  BarChart3, 
  BookOpen, 
  Clock,
  TrendingUp,
  Award,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Target
} from 'lucide-react';

interface ParentDashboardProps {
  user: User;
  onLogout: () => void;
}

const ParentDashboard: React.FC<ParentDashboardProps> = ({ user, onLogout }) => {
  const [currentView, setCurrentView] = useState('overview');

  const navigation = [
    {
      name: 'Overview',
      icon: BarChart3,
      current: currentView === 'overview',
      onClick: () => setCurrentView('overview'),
    },
    {
      name: 'Children Progress',
      icon: Users,
      current: currentView === 'children',
      onClick: () => setCurrentView('children'),
    },
  ];

  const renderContent = () => {
    switch (currentView) {
      case 'children':
        return <ChildrenProgress />;
      default:
        return <ParentOverview user={user} />;
    }
  };

  return (
    <Layout user={user} navigation={navigation} onLogout={onLogout}>
      {renderContent()}
    </Layout>
  );
};

const ParentOverview: React.FC<{ user: User }> = ({ user }) => {
  // Mock data for parent dashboard
  const children = [
    {
      id: '1',
      name: 'Emma Wilson',
      grade: '5th Grade',
      class: 'Math 101 - Period 1',
      teacher: 'Ms. Johnson',
      avatar: 'EW',
      totalConcepts: 12,
      completedConcepts: 8,
      averageScore: 88,
      lastActivity: '2024-01-15 3:30 PM',
      weeklyTimeSpent: 180, // minutes
      status: 'on_track',
    },
    {
      id: '2',
      name: 'Michael Wilson',
      grade: '3rd Grade',
      class: 'Math 201 - Period 2',
      teacher: 'Mr. Davis',
      avatar: 'MW',
      totalConcepts: 8,
      completedConcepts: 6,
      averageScore: 92,
      lastActivity: '2024-01-15 2:15 PM',
      weeklyTimeSpent: 145,
      status: 'ahead',
    },
  ];

  const upcomingAssignments = [
    {
      child: 'Emma Wilson',
      concept: 'Decimal Operations',
      subject: 'Mathematics',
      dueDate: '2024-01-16',
      status: 'not_started',
    },
    {
      child: 'Emma Wilson',
      concept: 'Photosynthesis Process',
      subject: 'Science',
      dueDate: '2024-01-17',
      status: 'in_progress',
    },
    {
      child: 'Michael Wilson',
      concept: 'Addition with Regrouping',
      subject: 'Mathematics',
      dueDate: '2024-01-18',
      status: 'not_started',
    },
  ];

  const recentActivity = [
    {
      child: 'Emma Wilson',
      action: 'Completed Integer Operations',
      score: 88,
      time: '2 hours ago',
    },
    {
      child: 'Michael Wilson',
      action: 'Started Multiplication Tables',
      score: null,
      time: '4 hours ago',
    },
    {
      child: 'Emma Wilson',
      action: 'Watched Fraction Addition video',
      score: null,
      time: '1 day ago',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ahead':
        return 'bg-green-100 text-green-800';
      case 'on_track':
        return 'bg-blue-100 text-blue-800';
      case 'needs_attention':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ahead':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'on_track':
        return <Target className="w-4 h-4 text-blue-600" />;
      case 'needs_attention':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Target className="w-4 h-4 text-gray-600" />;
    }
  };

  const getAssignmentStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'not_started':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 px-4 sm:px-6 lg:px-8 scroll-smooth">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
          Parent Dashboard
        </h1>
        <p className="mt-2 text-gray-600 text-lg animate-slide-in-left delay-200">
          Welcome back, {user.name}! Here's how your children are progressing.
        </p>
      </div>

      {/* Enhanced Children Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {children.map((child, index) => (
          <div 
            key={child.id} 
            className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] animate-fade-in"
            style={{ 
              animationDelay: `${index * 150}ms`,
              animationFillMode: 'forwards'
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-pink-500 to-blue-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                  <span className="text-xl font-bold text-white">{child.avatar}</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-pink-600 transition-colors">{child.name}</h3>
                  <p className="text-sm font-medium text-gray-600">{child.grade} • {child.class}</p>
                  <p className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-lg mt-1">Teacher: {child.teacher}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="p-2 bg-gray-50 rounded-xl mr-2 group-hover:bg-white group-hover:shadow-md transition-all duration-200">
                  {getStatusIcon(child.status)}
                </div>
                <span className={`inline-flex px-3 py-1.5 text-xs font-bold rounded-full shadow-sm ${getStatusColor(child.status)}`}>
                  {child.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{child.completedConcepts}</div>
                <div className="text-xs text-gray-500">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{child.averageScore}%</div>
                <div className="text-xs text-gray-500">Avg Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{Math.floor(child.weeklyTimeSpent / 60)}h</div>
                <div className="text-xs text-gray-500">This Week</div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium">{child.completedConcepts}/{child.totalConcepts}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${(child.completedConcepts / child.totalConcepts) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex items-center text-xs text-gray-500">
              <Clock className="w-3 h-3 mr-1" />
              Last active: {child.lastActivity}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Assignments */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Upcoming Assignments</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {upcomingAssignments.map((assignment, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{assignment.concept}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {assignment.child} • {assignment.subject}
                    </div>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <Calendar className="w-3 h-3 mr-1" />
                      Due {assignment.dueDate}
                    </div>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAssignmentStatusColor(assignment.status)}`}>
                    {assignment.status.replace('_', ' ')}
                  </span>
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
                      activity.action.includes('Completed') ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      {activity.action.includes('Completed') ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <BookOpen className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.child}</span> {activity.action.toLowerCase()}
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

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg text-center transition-colors">
            <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-blue-900">View Reports</p>
          </button>
          <button className="bg-green-50 hover:bg-green-100 p-4 rounded-lg text-center transition-colors">
            <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-green-900">Schedule</p>
          </button>
          <button className="bg-purple-50 hover:bg-purple-100 p-4 rounded-lg text-center transition-colors">
            <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-purple-900">Contact Teachers</p>
          </button>
          <button className="bg-orange-50 hover:bg-orange-100 p-4 rounded-lg text-center transition-colors">
            <Award className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-orange-900">Achievements</p>
          </button>
        </div>
      </div>
    </div>
  );
};

const ChildrenProgress: React.FC = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Children Progress</h1>
        <p className="mt-2 text-gray-600">Detailed progress tracking for each of your children.</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Detailed Progress Reports</h3>
        <p className="text-gray-600 mb-4">
          This feature will provide comprehensive progress reports, grade tracking, and detailed analytics for each child.
        </p>
        <p className="text-sm text-gray-500">
          Coming soon in the full version of the LMS platform.
        </p>
      </div>
    </div>
  );
};

export default ParentDashboard;