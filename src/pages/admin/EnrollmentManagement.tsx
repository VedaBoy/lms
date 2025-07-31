import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { User, Subject } from '../../types';

const EnrollmentManagement: React.FC = () => {
  const [grades, setGrades] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [enrolledStudents, setEnrolledStudents] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: gradeData, error: gradeError } = await supabase.from('grades').select('*');
      if (gradeError) console.error('Error fetching grades', gradeError);
      else setGrades(gradeData || []);

      const { data: studentData, error: studentError } = await supabase.from('profiles').select('*').eq('role', 'student');
      if (studentError) console.error('Error fetching students', studentError);
      else setStudents(studentData || []);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedGrade) {
      const fetchSubjects = async () => {
        const { data: subjectData, error: subjectError } = await supabase.from('subjects').select('*').eq('grade_id', selectedGrade);
        if (subjectError) console.error('Error fetching subjects', subjectError);
        else setSubjects(subjectData || []);
      };
      fetchSubjects();
    }
  }, [selectedGrade]);

  useEffect(() => {
    if (selectedSubject) {
      const fetchEnrolledStudents = async () => {
        const { data, error } = await supabase.from('enrollments').select('student_id').eq('subject_id', selectedSubject);
        if (error) console.error('Error fetching enrolled students', error);
        else setEnrolledStudents(data?.map(item => item.student_id) || []);
      };
      fetchEnrolledStudents();
    }
  }, [selectedSubject]);

  const handleEnroll = async (studentId: string) => {
    const { error } = await supabase.from('enrollments').insert({ subject_id: selectedSubject, student_id: studentId });
    if (error) console.error('Error enrolling student', error);
    else setEnrolledStudents([...enrolledStudents, studentId]);
  };

  const handleUnenroll = async (studentId: string) => {
    const { error } = await supabase.from('enrollments').delete().match({ subject_id: selectedSubject, student_id: studentId });
    if (error) console.error('Error unenrolling student', error);
    else setEnrolledStudents(enrolledStudents.filter(id => id !== studentId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 sm:px-6 lg:px-8 scroll-smooth theme-transition">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Enrollment Management
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300 text-lg">
          Manage student enrollments across grades and subjects
        </p>
      </div>

      <div className="space-y-6 animate-fade-in" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 theme-transition">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Grade</label>
              <select 
                onChange={(e) => setSelectedGrade(e.target.value)} 
                className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white theme-transition focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Select a Grade --</option>
                {grades.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>
            {selectedGrade && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Subject</label>
                <select 
                  onChange={(e) => setSelectedSubject(e.target.value)} 
                  className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white theme-transition focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Select a Subject --</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            )}
          </div>
        </div>
        {selectedSubject && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 theme-transition">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Available Students</h3>
                <div className="border border-gray-200 dark:border-gray-600 rounded-2xl p-4 h-64 overflow-y-auto bg-gray-50 dark:bg-gray-700">
                  {students.filter(s => !enrolledStudents.includes(s.id)).map(student => (
                    <div key={student.id} className="flex justify-between items-center p-2 hover:bg-white dark:hover:bg-gray-600 rounded-lg theme-transition">
                      <span className="text-gray-900 dark:text-white">{student.name}</span>
                      <button 
                        onClick={() => handleEnroll(student.id)} 
                        className="btn-glass btn-glass-primary px-3 py-1 rounded-lg text-sm theme-transition"
                      >
                        Enroll
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Enrolled Students</h3>
                <div className="border border-gray-200 dark:border-gray-600 rounded-2xl p-4 h-64 overflow-y-auto bg-gray-50 dark:bg-gray-700">
                  {students.filter(s => enrolledStudents.includes(s.id)).map(student => (
                    <div key={student.id} className="flex justify-between items-center p-2 hover:bg-white dark:hover:bg-gray-600 rounded-lg theme-transition">
                      <span className="text-gray-900 dark:text-white">{student.name}</span>
                      <button 
                        onClick={() => handleUnenroll(student.id)} 
                        className="btn-glass btn-glass-danger px-3 py-1 rounded-lg text-sm theme-transition"
                      >
                        Unenroll
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrollmentManagement;
