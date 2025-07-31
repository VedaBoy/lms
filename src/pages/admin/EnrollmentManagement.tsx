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
    <div className="px-4 sm:px-6 lg:px-8 mt-8">
      <h2 className="text-xl font-bold">Enrollment Management</h2>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Grade</label>
        <select onChange={(e) => setSelectedGrade(e.target.value)} className="w-full p-2 border rounded">
          <option value="">-- Select a Grade --</option>
          {grades.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
      </div>
      {selectedGrade && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Subject</label>
          <select onChange={(e) => setSelectedSubject(e.target.value)} className="w-full p-2 border rounded">
            <option value="">-- Select a Subject --</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      )}
      {selectedSubject && (
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-medium">Available Students</h3>
            <div className="border rounded p-2 h-64 overflow-y-auto">
              {students.filter(s => !enrolledStudents.includes(s.id)).map(student => (
                <div key={student.id} className="flex justify-between items-center p-1">
                  <span>{student.name}</span>
                  <button onClick={() => handleEnroll(student.id)} className="btn-glass btn-glass-primary text-blue-500 px-3 py-1 rounded text-sm">Enroll</button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium">Enrolled Students</h3>
            <div className="border rounded p-2 h-64 overflow-y-auto">
              {students.filter(s => enrolledStudents.includes(s.id)).map(student => (
                <div key={student.id} className="flex justify-between items-center p-1">
                  <span>{student.name}</span>
                                    <button onClick={() => handleUnenroll(enrollment.student_id)} className="btn-glass btn-glass-danger text-red-500 px-3 py-1 rounded text-sm">Unenroll</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnrollmentManagement;
