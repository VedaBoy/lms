import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

type TabType = 'grades' | 'subjects' | 'chapters' | 'concepts';
type Status = 'active' | 'draft' | 'archived';

interface Props {
  activeTab: TabType;
  editing: any;
  onClose(): void;
  refresh(): void;
}

const CourseForm: React.FC<Props> = ({ activeTab, editing, onClose, refresh }) => {
  const isEditing = Boolean(editing?.id);

  // Unified form state
  const [name, setName] = useState(editing?.name || '');
  const [description, setDescription] = useState(editing?.description || '');
  const [level, setLevel] = useState(editing?.level || 0);
  const [gradeId, setGradeId] = useState(editing?.grade_id || '');
  const [teacherId, setTeacherId] = useState(editing?.teacher_id || '');
  const [subjectId, setSubjectId] = useState(editing?.subject_id || editing?.chapter_id || '');
  const [title, setTitle] = useState(editing?.title || '');
  const [orderIndex, setOrderIndex] = useState(editing?.order_index || 1);
  const [taxonomy, setTaxonomy] = useState(editing?.taxonomy_level || '');
  const [gradeLevel, setGradeLevel] = useState(editing?.grade_level || '');
  const [sources, setSources] = useState<string[]>(editing?.content_sources || []);
  const [status, setStatus] = useState<Status>(editing?.status || 'active');

  const [allGrades, setAllGrades] = useState<any[]>([]);
  const [allSubjects, setAllSubjects] = useState<any[]>([]);
  const [allChapters, setAllChapters] = useState<any[]>([]);
  const [allTeachers, setAllTeachers] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('grades').select('id,name').then((r) => r.data && setAllGrades(r.data));
    supabase.from('subjects').select('id,name').then((r) => r.data && setAllSubjects(r.data));
    supabase.from('chapters').select('id,title').then((r) => r.data && setAllChapters(r.data));
    supabase.from('profiles').select('id,name').eq('role', 'teacher').then((r) => r.data && setAllTeachers(r.data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let table = '';
    let payload: any = {};

    if (activeTab === 'grades') {
      table = 'grades';
      payload = {
        name,
        level,
      };
    } else if (activeTab === 'subjects') {
      table = 'subjects';
      payload = {
        name,
        description,
        grade_id: gradeId,
        teacher_id: teacherId,
        status
      };
    } else if (activeTab === 'chapters') {
      table = 'chapters';
      payload = {
        subject_id: subjectId,
        title,
        order_index: orderIndex,
        status
      };
    } else {
      table = 'concepts';
      payload = {
        chapter_id: subjectId,
        title,
        order_index: orderIndex,
        taxonomy_level: taxonomy,
        grade_level: gradeLevel,
        content_sources: sources,
        status
      };
    }

    if (isEditing) {
      await supabase.from(table).update(payload).eq('id', editing.id);
    } else {
      await supabase.from(table).insert(payload);
    }

    refresh();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg overflow-y-auto max-h-[90vh] theme-transition">
        <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit' : 'Add'} {activeTab.slice(0, -1)}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 'grades' && (
            <>
              <label>Name</label>
              <input value={name} onChange={e => setName(e.target.value)} className="w-full border rounded px-3 py-2" />
              <label>Level</label>
              <input type="number" value={level} onChange={e => setLevel(+e.target.value)} className="w-full border rounded px-3 py-2" />
            </>
          )}

          {activeTab === 'subjects' && (
            <>
              <label>Name</label>
              <input value={name} onChange={e => setName(e.target.value)} className="w-full border rounded px-3 py-2" />
              <label>Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border rounded px-3 py-2" />
              <label>Grade</label>
              <select value={gradeId} onChange={e => setGradeId(e.target.value)} className="w-full border rounded px-3 py-2">
                <option value="">-- Select Grade --</option>
                {allGrades.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
              <label>Teacher</label>
              <select value={teacherId} onChange={e => setTeacherId(e.target.value)} className="w-full border rounded px-3 py-2">
                <option value="">-- Select Teacher --</option>
                {allTeachers.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </>
          )}

          {activeTab === 'chapters' && (
            <>
              <label>Subject</label>
              <select value={subjectId} onChange={e => setSubjectId(e.target.value)} className="w-full border rounded px-3 py-2">
                <option value="">-- Select Subject --</option>
                {allSubjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <label>Title</label>
              <input value={title} onChange={e => setTitle(e.target.value)} className="w-full border rounded px-3 py-2" />
              <label>Order Index</label>
              <input type="number" value={orderIndex} onChange={e => setOrderIndex(+e.target.value)} className="w-full border rounded px-3 py-2" />
            </>
          )}

          {activeTab === 'concepts' && (
            <>
              <label>Chapter</label>
              <select value={subjectId} onChange={e => setSubjectId(e.target.value)} className="w-full border rounded px-3 py-2">
                <option value="">-- Select Chapter --</option>
                {allChapters.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
              <label>Title</label>
              <input value={title} onChange={e => setTitle(e.target.value)} className="w-full border rounded px-3 py-2" />
              <label>Order Index</label>
              <input type="number" value={orderIndex} onChange={e => setOrderIndex(+e.target.value)} className="w-full border rounded px-3 py-2" />
              <label>Taxonomy Level</label>
              <input value={taxonomy} onChange={e => setTaxonomy(e.target.value)} className="w-full border rounded px-3 py-2" />
              <label>Grade Level</label>
              <input type="number" value={gradeLevel} onChange={e => setGradeLevel(+e.target.value)} className="w-full border rounded px-3 py-2" />
              <label>Content Sources (comma-separated)</label>
              <input value={sources.join(',')} onChange={e => setSources(e.target.value.split(',').map(s => s.trim()))} className="w-full border rounded px-3 py-2" />
            </>
          )}

          <label>Status</label>
          <select value={status} onChange={e => setStatus(e.target.value as Status)} className="w-full border rounded px-3 py-2">
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="btn-glass px-4 py-2 rounded">Cancel</button>
            <button type="submit" className="btn-glass btn-glass-primary px-4 py-2 rounded">
              {isEditing ? 'Save Changes' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;