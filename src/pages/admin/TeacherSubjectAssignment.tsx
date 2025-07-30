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
    <div className="px-4 sm:px-6 lg:px-8 mt-8">
      <h2 className="text-xl font-bold">Teacher-Subject Assignments</h2>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Teacher</label>
        <select onChange={(e) => setSelectedTeacher(e.target.value)} className="w-full p-2 border rounded">
          <option value="">-- Select a Teacher --</option>
          {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>
      {selectedTeacher && (
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-medium">Available Subjects</h3>
            <div className="border rounded p-2 h-64 overflow-y-auto">
              {subjects.filter(s => !assignedSubjects.includes(s.id)).map(subject => (
                <div key={subject.id} className="flex justify-between items-center p-1">
                  <span>{subject.name}</span>
                  <button onClick={() => handleAssign(subject.id)} className="text-blue-500">Assign</button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium">Assigned Subjects</h3>
            <div className="border rounded p-2 h-64 overflow-y-auto">
              {subjects.filter(s => assignedSubjects.includes(s.id)).map(subject => (
                <div key={subject.id} className="flex justify-between items-center p-1">
                  <span>{subject.name}</span>
                  <button onClick={() => handleUnassign(subject.id)} className="text-red-500">Unassign</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherSubjectAssignment;
