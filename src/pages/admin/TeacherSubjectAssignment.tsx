import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { User, Subject } from '../../types';

const TeacherSubjectAssignment: React.FC = () => {
  const [teachers, setTeachers] = useState<User[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');
  const [assignedSubjects, setAssignedSubjects] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: teacherData, error: teacherError } = await supabase.from('profiles').select('*').eq('role', 'teacher');
      if (teacherError) console.error('Error fetching teachers', teacherError);
      else setTeachers(teacherData || []);

      const { data: subjectData, error: subjectError } = await supabase.from('subjects').select('*');
      if (subjectError) console.error('Error fetching subjects', subjectError);
      else setSubjects(subjectData || []);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedTeacher) {
      const fetchAssignedSubjects = async () => {
        const { data, error } = await supabase.from('teacher_subject_assignments').select('subject_id').eq('teacher_id', selectedTeacher);
        if (error) console.error('Error fetching assigned subjects', error);
        else setAssignedSubjects(data?.map(item => item.subject_id) || []);
      };
      fetchAssignedSubjects();
    }
  }, [selectedTeacher]);

  const handleAssign = async (subjectId: string) => {
    const { error } = await supabase.from('teacher_subject_assignments').insert({ teacher_id: selectedTeacher, subject_id: subjectId });
    if (error) console.error('Error assigning subject', error);
    else setAssignedSubjects([...assignedSubjects, subjectId]);
  };

  const handleUnassign = async (subjectId: string) => {
    const { error } = await supabase.from('teacher_subject_assignments').delete().match({ teacher_id: selectedTeacher, subject_id: subjectId });
    if (error) console.error('Error unassigning subject', error);
    else setAssignedSubjects(assignedSubjects.filter(id => id !== subjectId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 sm:px-6 lg:px-8 scroll-smooth theme-transition">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
          Teacher-Subject Assignments
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300 text-lg">
          Assign subjects to teachers for effective classroom management
        </p>
      </div>

      <div className="animate-fade-in" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 theme-transition">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Teacher</label>
            <select 
              onChange={(e) => setSelectedTeacher(e.target.value)} 
              className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white theme-transition focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select a Teacher --</option>
              {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
        </div>

        {selectedTeacher && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 theme-transition">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Available Subjects</h3>
                <div className="border border-gray-200 dark:border-gray-600 rounded-2xl p-4 h-64 overflow-y-auto bg-gray-50 dark:bg-gray-700">
                  {subjects.filter(s => !assignedSubjects.includes(s.id)).map(subject => (
                    <div key={subject.id} className="flex justify-between items-center p-2 hover:bg-white dark:hover:bg-gray-600 rounded-lg theme-transition">
                      <span className="text-gray-900 dark:text-white">{subject.name}</span>
                      <button 
                        onClick={() => handleAssign(subject.id)} 
                        className="btn-glass btn-glass-primary px-3 py-1 rounded-lg text-sm theme-transition"
                      >
                        Assign
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Assigned Subjects</h3>
                <div className="border border-gray-200 dark:border-gray-600 rounded-2xl p-4 h-64 overflow-y-auto bg-gray-50 dark:bg-gray-700">
                  {subjects.filter(s => assignedSubjects.includes(s.id)).map(subject => (
                    <div key={subject.id} className="flex justify-between items-center p-2 hover:bg-white dark:hover:bg-gray-600 rounded-lg theme-transition">
                      <span className="text-gray-900 dark:text-white">{subject.name}</span>
                      <button 
                        onClick={() => handleUnassign(subject.id)} 
                        className="btn-glass btn-glass-danger px-3 py-1 rounded-lg text-sm theme-transition"
                      >
                        Unassign
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

export default TeacherSubjectAssignment;
