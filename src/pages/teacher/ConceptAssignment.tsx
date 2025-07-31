import React, { useState } from 'react';
import { 
  BookOpen, 
  Users, 
  Calendar, 
  Clock, 
  Plus,
  Search,
  Filter,
  Send,
  Target,
  User
} from 'lucide-react';

const ConceptAssignment: React.FC = () => {
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [assignmentType, setAssignmentType] = useState('class'); // 'class' or 'individual'
  const [selectedConcepts, setSelectedConcepts] = useState<string[]>([]);

  // Mock data
  const classes = [
    { id: '1', name: 'Math 101 - Period 1', students: 28, grade: '5th' },
    { id: '2', name: 'Math 101 - Period 3', students: 25, grade: '5th' },
    { id: '3', name: 'Algebra II - Period 5', students: 24, grade: '9th' },
  ];

  const students = [
    { id: '1', name: 'Emma Wilson', class: 'Math 101 - Period 1', progress: 85 },
    { id: '2', name: 'James Rodriguez', class: 'Math 101 - Period 1', progress: 92 },
    { id: '3', name: 'Sophia Chen', class: 'Math 101 - Period 1', progress: 78 },
    { id: '4', name: 'Michael Brown', class: 'Math 101 - Period 3', progress: 88 },
  ];

  const concepts = [
    {
      id: '1',
      title: 'Integer Operations',
      subject: 'Mathematics',
      chapter: 'Number Systems',
      difficulty: 'Intermediate',
      estimatedTime: 25,
      contentSources: ['Khan Academy', 'IXL', 'YouTube'],
    },
    {
      id: '2',
      title: 'Fraction Addition',
      subject: 'Mathematics',
      chapter: 'Number Systems',
      difficulty: 'Beginner',
      estimatedTime: 20,
      contentSources: ['Khan Academy', 'Desmos'],
    },
    {
      id: '3',
      title: 'Decimal Operations',
      subject: 'Mathematics',
      chapter: 'Number Systems',
      difficulty: 'Intermediate',
      estimatedTime: 30,
      contentSources: ['IXL', 'Custom'],
    },
  ];

  const activeAssignments = [
    {
      id: '1',
      concept: 'Integer Operations',
      assignedTo: 'Math 101 - Period 1',
      assignedDate: '2024-01-10',
      dueDate: '2024-01-17',
      completed: 18,
      total: 28,
      averageScore: 82,
    },
    {
      id: '2',
      concept: 'Fraction Addition',
      assignedTo: 'Math 101 - Period 3',
      assignedDate: '2024-01-12',
      dueDate: '2024-01-19',
      completed: 15,
      total: 25,
      averageScore: 89,
    },
  ];

  const AssignmentForm = () => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-lg bg-white max-h-[80vh] overflow-y-auto">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">Create New Assignment</h3>
            <button
              onClick={() => setShowAssignForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form className="space-y-6">
            {/* Assignment Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Assignment Type</label>
              <div className="grid grid-cols-2 gap-4">
                <label className="relative">
                  <input 
                    type="radio" 
                    name="assignmentType" 
                    value="class" 
                    checked={assignmentType === 'class'}
                    onChange={(e) => setAssignmentType(e.target.value)}
                    className="sr-only" 
                  />
                  <div className={`border-2 rounded-lg p-4 cursor-pointer transition-colors theme-transition ${
                    assignmentType === 'class' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                  }`}>
                    <div className="flex items-center justify-center mb-2">
                      <Users className="w-8 h-8 text-blue-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-900 text-center">Entire Class</p>
                  </div>
                </label>
                <label className="relative">
                  <input 
                    type="radio" 
                    name="assignmentType" 
                    value="individual" 
                    checked={assignmentType === 'individual'}
                    onChange={(e) => setAssignmentType(e.target.value)}
                    className="sr-only" 
                  />
                  <div className={`border-2 rounded-lg p-4 cursor-pointer transition-colors theme-transition ${
                    assignmentType === 'individual' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                  }`}>
                    <div className="flex items-center justify-center mb-2">
                      <User className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-900 text-center">Individual Students</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Target Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {assignmentType === 'class' ? 'Select Class' : 'Select Students'}
              </label>
              {assignmentType === 'class' ? (
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Choose a class</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} ({cls.students} students)
                    </option>
                  ))}
                </select>
              ) : (
                <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto">
                  {students.map((student) => (
                    <label key={student.id} className="flex items-center py-2">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        <div className="text-xs text-gray-500">{student.class}</div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Concept Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Concepts</label>
              <div className="border border-gray-300 rounded-lg">
                <div className="p-3 border-b border-gray-200">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search concepts..."
                      className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {concepts.map((concept) => (
                    <label key={concept.id} className="flex items-start p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1 mr-3"
                        checked={selectedConcepts.includes(concept.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedConcepts([...selectedConcepts, concept.id]);
                          } else {
                            setSelectedConcepts(selectedConcepts.filter(id => id !== concept.id));
                          }
                        }}
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{concept.title}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {concept.chapter} • {concept.difficulty} • {concept.estimatedTime} min
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {concept.contentSources.map((source, index) => (
                            <span key={index} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                              {source}
                            </span>
                          ))}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Assignment Details */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">Assignment Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="date"
                      className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Assignment Instructions</label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Provide specific instructions for students..."
                />
              </div>
            </div>

            {/* Content Provider Mapping */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">Content Provider Preferences</h4>
              <p className="text-sm text-gray-600 mb-4">Set the order of content providers for each concept</p>
              <div className="space-y-3">
                {selectedConcepts.map((conceptId) => {
                  const concept = concepts.find(c => c.id === conceptId);
                  return concept ? (
                    <div key={conceptId} className="bg-white rounded-lg p-3">
                      <div className="text-sm font-medium text-gray-900 mb-2">{concept.title}</div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Primary</label>
                          <select className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500">
                            {concept.contentSources.map((source) => (
                              <option key={source} value={source}>{source}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Secondary</label>
                          <select className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500">
                            {concept.contentSources.map((source) => (
                              <option key={source} value={source}>{source}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Fallback</label>
                          <select className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500">
                            <option value="fallback">Fallback URL</option>
                            <option value="offline">Offline Materials</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowAssignForm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700"
              >
                <Send className="w-4 h-4 mr-2" />
                Create Assignment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Concept Assignment</h1>
          <p className="mt-2 text-sm text-gray-700">
            Assign concepts to your classes or individual students with customized content preferences.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setShowAssignForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Assignment
          </button>
        </div>
      </div>

      {/* Active Assignments */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Active Assignments</h2>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Concept
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Score
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activeAssignments.map((assignment) => (
                  <tr key={assignment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Target className="h-8 w-8 text-blue-600 bg-blue-100 rounded-lg p-2 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{assignment.concept}</div>
                          <div className="text-sm text-gray-500">Assigned {assignment.assignedDate}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {assignment.assignedTo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${(assignment.completed / assignment.total) * 100}%` }}
                        />
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {assignment.completed}/{assignment.total} completed
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {assignment.dueDate}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        assignment.averageScore >= 85 ? 'bg-green-100 text-green-800' :
                        assignment.averageScore >= 75 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {assignment.averageScore}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 text-sm">View Details</button>
                        <button className="text-green-600 hover:text-green-900 text-sm">Push to AV</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showAssignForm && <AssignmentForm />}
    </div>
  );
};

export default ConceptAssignment;