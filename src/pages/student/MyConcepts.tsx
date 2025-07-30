import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Play, 
  Clock,
  Target,
  Star,
  Youtube,
  Globe
} from 'lucide-react';

const MyConcepts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null);

  // Mock data
  const concepts = [
    {
      id: '1',
      title: 'Decimal Operations',
      subject: 'Mathematics',
      chapter: 'Number Systems',
      description: 'Learn to add, subtract, multiply, and divide decimal numbers',
      estimatedTime: 25,
      difficulty: 'Intermediate',
      dueDate: '2024-01-16',
      progress: 0,
      status: 'assigned',
      priority: 'high',
      contentSources: [
        { type: 'video', provider: 'Khan Academy', url: '#', title: 'Introduction to Decimals' },
        { type: 'interactive', provider: 'IXL', url: '#', title: 'Decimal Practice' },
        { type: 'video', provider: 'YouTube', url: '#', title: 'Decimal Examples' },
      ],
      learningObjectives: [
        'Understand decimal place values',
        'Add and subtract decimals',
        'Multiply decimals by whole numbers',
        'Divide decimals by whole numbers',
      ],
    },
    {
      id: '2',
      title: 'Photosynthesis Process',
      subject: 'Science',
      chapter: 'Plant Biology',
      description: 'Understand how plants convert sunlight into energy',
      estimatedTime: 20,
      difficulty: 'Beginner',
      dueDate: '2024-01-17',
      progress: 45,
      status: 'in_progress',
      priority: 'medium',
      contentSources: [
        { type: 'video', provider: 'Khan Academy', url: '#', title: 'What is Photosynthesis?' },
        { type: 'interactive', provider: 'Custom', url: '#', title: 'Plant Cell Explorer' },
        { type: 'assessment', provider: 'Custom', url: '#', title: 'Photosynthesis Quiz' },
      ],
      learningObjectives: [
        'Define photosynthesis',
        'Identify the parts of a leaf',
        'Explain the role of chlorophyll',
        'Describe the inputs and outputs',
      ],
    },
    {
      id: '3',
      title: 'Integer Operations',
      subject: 'Mathematics',
      chapter: 'Number Systems',
      description: 'Master addition, subtraction, multiplication, and division of integers',
      estimatedTime: 30,
      difficulty: 'Intermediate',
      dueDate: '2024-01-12',
      progress: 100,
      status: 'completed',
      priority: 'low',
      score: 92,
      completedAt: '2024-01-10',
      contentSources: [
        { type: 'video', provider: 'Khan Academy', url: '#', title: 'Integer Basics' },
        { type: 'interactive', provider: 'IXL', url: '#', title: 'Integer Practice' },
      ],
      learningObjectives: [
        'Understand positive and negative numbers',
        'Add and subtract integers',
        'Multiply and divide integers',
        'Solve integer word problems',
      ],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'assigned':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'youtube':
        return <Youtube className="w-4 h-4 text-red-600" />;
      case 'khan academy':
        return <Globe className="w-4 h-4 text-green-600" />;
      case 'ixl':
        return <Globe className="w-4 h-4 text-blue-600" />;
      default:
        return <Globe className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredConcepts = concepts.filter(concept => {
    const matchesSearch = concept.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         concept.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = filterSubject === 'all' || concept.subject === filterSubject;
    const matchesStatus = filterStatus === 'all' || concept.status === filterStatus;
    return matchesSearch && matchesSubject && matchesStatus;
  });

  const ConceptDetailModal = ({ concept }: { concept: any }) => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-lg bg-white max-h-[80vh] overflow-y-auto">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">{concept.title}</h3>
            <button
              onClick={() => setSelectedConcept(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* Concept Info */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-sm text-gray-500">Subject:</span>
                  <span className="ml-2 text-sm font-medium text-gray-900">{concept.subject}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Chapter:</span>
                  <span className="ml-2 text-sm font-medium text-gray-900">{concept.chapter}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Estimated Time:</span>
                  <span className="ml-2 text-sm font-medium text-gray-900">{concept.estimatedTime} minutes</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Due Date:</span>
                  <span className="ml-2 text-sm font-medium text-gray-900">{concept.dueDate}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(concept.status)}`}>
                  {concept.status.replace('_', ' ')}
                </span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(concept.difficulty)}`}>
                  {concept.difficulty}
                </span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(concept.priority)}`}>
                  {concept.priority} priority
                </span>
              </div>
              <p className="text-sm text-gray-700 mt-4">{concept.description}</p>
            </div>

            {/* Progress */}
            {concept.progress > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm text-gray-500">{concept.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${concept.progress}%` }}
                  />
                </div>
                {concept.status === 'completed' && concept.score && (
                  <div className="mt-2 flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="text-sm font-medium text-gray-900">Final Score: {concept.score}%</span>
                  </div>
                )}
              </div>
            )}

            {/* Learning Objectives */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3">Learning Objectives</h4>
              <ul className="space-y-2">
                {concept.learningObjectives.map((objective: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <Target className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Content Sources */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3">Learning Materials</h4>
              <div className="space-y-3">
                {concept.contentSources.map((source: any, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {getProviderIcon(source.provider)}
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{source.title}</div>
                          <div className="text-xs text-gray-500">{source.provider} • {source.type}</div>
                        </div>
                      </div>
                      <button className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-full hover:bg-blue-100">
                        <Play className="w-3 h-3 mr-1" />
                        Start
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                onClick={() => setSelectedConcept(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              {concept.status !== 'completed' && (
                <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700">
                  <Play className="w-4 h-4 mr-2" />
                  {concept.status === 'assigned' ? 'Start Learning' : 'Continue'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 px-4 sm:px-6 lg:px-8 scroll-smooth">
      <div className="sm:flex sm:items-center animate-slide-in-up">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent animate-fade-in-scale">
            My Concepts
          </h1>
          <p className="mt-2 text-lg text-gray-600 animate-slide-in-left delay-200">
            Access your assigned learning concepts and track your progress through each module.
          </p>
        </div>
      </div>

      {/* Enhanced Filters */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-in-up delay-300">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Search concepts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:shadow-md bg-white"
          />
        </div>
        <div className="relative group">
          <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-all duration-300 hover:shadow-md bg-white cursor-pointer"
          >
            <option value="all">All Subjects</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Science">Science</option>
            <option value="English">English</option>
          </select>
        </div>
        <div className="relative group">
          <Target className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-all duration-300 hover:shadow-md bg-white cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Enhanced Concepts Grid */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredConcepts.map((concept, index) => (
          <div
            key={concept.id}
            className={`group bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover-lift hover-glow cursor-pointer transition-all duration-300 animate-bounce-in delay-${(index + 1) * 100}`}
            onClick={() => setSelectedConcept(concept.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300 mb-2">
                  {concept.title}
                </h3>
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <BookOpen className="w-4 h-4 mr-2 text-green-500" />
                  {concept.subject} • {concept.chapter}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-2 animate-pulse" />
                  {concept.estimatedTime} minutes
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusColor(concept.status)} animate-pulse`}>
                  {concept.status.replace('_', ' ')}
                </span>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${getDifficultyColor(concept.difficulty)}`}>
                  {concept.difficulty}
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2 group-hover:text-gray-700 transition-colors">
              {concept.description}
            </p>

            {/* Enhanced Progress Bar */}
            {concept.progress > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm font-bold text-green-600">{concept.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full animate-shimmer transition-all duration-1000"
                    style={{ width: `${concept.progress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-bold rounded-full ${getPriorityColor(concept.priority)} animate-pulse`}>
                  {concept.priority} priority
                </span>
              </div>
              <button className="group-hover:bg-gradient-to-r group-hover:from-green-500 group-hover:to-blue-500 bg-gray-100 text-gray-600 group-hover:text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 transform group-hover:scale-105 flex items-center">
                <Play className="w-4 h-4 mr-2" />
                {concept.status === 'assigned' ? 'Start' : 'Continue'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Empty State */}
      {filteredConcepts.length === 0 && (
        <div className="text-center py-12 animate-fade-in">
          <BookOpen className="mx-auto h-16 w-16 text-gray-300 mb-4 animate-pulse" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No concepts found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Enhanced Modal */}
      {selectedConcept && (
        <ConceptDetailModal concept={concepts.find(c => c.id === selectedConcept)} />
      )}
    </div>
  );
};

export default MyConcepts;