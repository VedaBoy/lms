import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  TrendingUp, 
  Clock, 
  Target,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  BarChart3
} from 'lucide-react';

const StudentProgress: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConcept, setSelectedConcept] = useState('all');

  // Mock data
  const classes = [
    { id: '1', name: 'Math 101 - Period 1', students: 28 },
    { id: '2', name: 'Math 101 - Period 3', students: 25 },
    { id: '3', name: 'Algebra II - Period 5', students: 24 },
  ];

  const concepts = [
    { id: '1', name: 'Integer Operations' },
    { id: '2', name: 'Fraction Addition' },
    { id: '3', name: 'Decimal Operations' },
    { id: '4', name: 'Geometry Basics' },
  ];

  const students = [
    {
      id: '1',
      name: 'Emma Wilson',
      class: 'Math 101 - Period 1',
      avatar: 'EW',
      totalConcepts: 12,
      completedConcepts: 10,
      averageScore: 88,
      timeSpent: 245,
      lastActivity: '2024-01-15 2:30 PM',
      strugglingConcepts: ['Geometry Basics'],
      status: 'on_track',
    },
    {
      id: '2',
      name: 'James Rodriguez',
      class: 'Math 101 - Period 1',
      avatar: 'JR',
      totalConcepts: 12,
      completedConcepts: 12,
      averageScore: 94,
      timeSpent: 198,
      lastActivity: '2024-01-15 3:15 PM',
      strugglingConcepts: [],
      status: 'ahead',
    },
    {
      id: '3',
      name: 'Sophia Chen',
      class: 'Math 101 - Period 1',
      avatar: 'SC',
      totalConcepts: 12,
      completedConcepts: 8,
      averageScore: 76,
      timeSpent: 312,
      lastActivity: '2024-01-15 1:45 PM',
      strugglingConcepts: ['Integer Operations', 'Fraction Addition'],
      status: 'needs_attention',
    },
    {
      id: '4',
      name: 'Michael Brown',
      class: 'Math 101 - Period 3',
      avatar: 'MB',
      totalConcepts: 12,
      completedConcepts: 9,
      averageScore: 82,
      timeSpent: 267,
      lastActivity: '2024-01-15 11:20 AM',
      strugglingConcepts: ['Decimal Operations'],
      status: 'on_track',
    },
  ];

  const conceptProgress = [
    {
      concept: 'Integer Operations',
      totalStudents: 77,
      completed: 65,
      inProgress: 8,
      notStarted: 4,
      averageScore: 84,
      averageTime: 28,
      strugglingStudents: 6,
    },
    {
      concept: 'Fraction Addition',
      totalStudents: 77,
      completed: 58,
      inProgress: 12,
      notStarted: 7,
      averageScore: 79,
      averageTime: 32,
      strugglingStudents: 9,
    },
    {
      concept: 'Decimal Operations',
      totalStudents: 77,
      completed: 45,
      inProgress: 18,
      notStarted: 14,
      averageScore: 81,
      averageTime: 35,
      strugglingStudents: 8,
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
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'on_track':
        return <Target className="w-4 h-4 text-blue-600" />;
      case 'needs_attention':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Target className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'all' || student.class.includes(selectedClass);
    return matchesSearch && matchesClass;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 sm:px-6 lg:px-8 py-8 theme-transition">
      <div className="sm:flex sm:items-center animate-fade-in" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Student Progress</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Monitor individual student progress and identify students who need additional support.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button className="btn-glass btn-glass-primary inline-flex items-center px-4 py-2 rounded-2xl text-sm font-medium shadow-lg theme-transition">
            <BarChart3 className="w-4 h-4 mr-2" />
            Generate Report
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white theme-transition"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white theme-transition"
          >
            <option value="all">All Classes</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.name}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>
        <div className="relative">
          <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
          <select
            value={selectedConcept}
            onChange={(e) => setSelectedConcept(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
          >
            <option value="all">All Concepts</option>
            {concepts.map((concept) => (
              <option key={concept.id} value={concept.name}>
                {concept.name}
              </option>
            ))}
          </select>
        </div>
        <div className="relative">
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none">
            <option value="all">All Status</option>
            <option value="ahead">Ahead</option>
            <option value="on_track">On Track</option>
            <option value="needs_attention">Needs Attention</option>
          </select>
        </div>
      </div>

      {/* Concept Overview */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Concept Progress Overview</h2>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Concept
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Struggling
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {conceptProgress.map((concept, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{concept.concept}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${(concept.completed / concept.totalStudents) * 100}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500">
                        {concept.completed}/{concept.totalStudents} completed ({concept.inProgress} in progress)
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        concept.averageScore >= 85 ? 'bg-green-100 text-green-800' :
                        concept.averageScore >= 75 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {concept.averageScore}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1 text-gray-400" />
                        {concept.averageTime} min
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        concept.strugglingStudents <= 3 ? 'bg-green-100 text-green-800' :
                        concept.strugglingStudents <= 6 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {concept.strugglingStudents} students
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Individual Student Progress */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Individual Student Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <div key={student.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">{student.avatar}</span>
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">{student.name}</div>
                    <div className="text-xs text-gray-500">{student.class}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  {getStatusIcon(student.status)}
                  <span className={`ml-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(student.status)}`}>
                    {student.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{student.completedConcepts}/{student.totalConcepts}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(student.completedConcepts / student.totalConcepts) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500">Average Score</div>
                    <div className="text-lg font-semibold text-gray-900">{student.averageScore}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Time Spent</div>
                    <div className="text-lg font-semibold text-gray-900">{student.timeSpent}m</div>
                  </div>
                </div>

                {student.strugglingConcepts.length > 0 && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Struggling With</div>
                    <div className="flex flex-wrap gap-1">
                      {student.strugglingConcepts.map((concept, index) => (
                        <span key={index} className="inline-flex px-2 py-1 text-xs bg-red-100 text-red-700 rounded">
                          {concept}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    Last active: {student.lastActivity}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="btn-glass btn-glass-primary flex-1 px-3 py-2 text-xs font-medium rounded">
                    View Details
                  </button>
                  <button className="btn-glass btn-glass-success flex-1 px-3 py-2 text-xs font-medium rounded">
                    Push Content
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentProgress;