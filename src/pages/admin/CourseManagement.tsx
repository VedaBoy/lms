import React, { useState, useEffect, useMemo } from "react";
import {
  BookOpen,
  Layers,
  Target,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  GraduationCap,
  ChevronDown,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import CourseForm from "./CourseForm";

type Status = "active" | "draft" | "archived";

interface Subject {
  id: string;
  name: string;
  description?: string;
  grade_id?: string;
  teacher_id?: string;
  status: Status;
}
interface Chapter {
  id: string;
  subject_id: string;
  title: string;
  order_index?: number;
  status: Status;
  subject_name?: string;
  subject_grade_id?: string;
}
interface Concept {
  id: string;
  chapter_id: string;
  title: string;
  order_index?: number;
  taxonomy_level?: string;
  grade_level?: number;
  content_sources?: string[];
  status: Status;
  chapter_title?: string;
  chapter_subject_id?: string;
  chapter_subject_name?: string;
  chapter_subject_grade_id?: string;
}

const tabs: Array<"grades" | "subjects" | "chapters" | "concepts"> = [
  "grades",
  "subjects",
  "chapters",
  "concepts",
];

const CourseManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"grades" | "subjects" | "chapters" | "concepts">(
    "grades"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "">("");
  const [gradeFilter, setGradeFilter] = useState<string>("");
  const [subjectFilter, setSubjectFilter] = useState<string>("");
  const [chapterFilter, setChapterFilter] = useState<string>("");
  const [grades, setGrades] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Subject | Chapter | Concept | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [animateCards, setAnimateCards] = useState(false);

  useEffect(() => {
    fetchAll();
    // Reset filters when switching tabs
    if (activeTab !== "subjects" && activeTab !== "chapters" && activeTab !== "concepts") {
      setGradeFilter("");
    }
    if (activeTab !== "chapters" && activeTab !== "concepts") {
      setSubjectFilter("");
    }
    if (activeTab !== "concepts") {
      setChapterFilter("");
    }
  }, [activeTab]);

  const fetchAll = async () => {
    setLoading(true);
    setAnimateCards(false);
    try {
      const [gRes, sRes, chRes, cRes] = await Promise.all([
        supabase.from("grades").select("*"),
        supabase.from("subjects").select("*, grade:grade_id(name), teacher:teacher_id(name)"),
        supabase.from("chapters").select("*, subject:subject_id(name, grade_id)"),
        supabase.from("concepts").select("*, chapter:chapter_id(title, subject_id, subject:subject_id(name, grade_id))"),
      ]);
      if (gRes.data) setGrades(gRes.data);
      if (sRes.data)
        setSubjects(
          sRes.data.map((s) => ({
            ...s,
            grade_name: (s as any).grade?.name || 'N/A',
            teacher_name: (s as any).teacher?.name || 'N/A',
          }))
        );
      if (chRes.data)
        setChapters(
          chRes.data.map((c) => ({
            ...c,
            subject_name: (c as any).subject.name,
            subject_grade_id: (c as any).subject.grade_id,
          }))
        );
      if (cRes.data)
        setConcepts(
          cRes.data.map((c) => ({
            ...c,
            chapter_title: (c as any).chapter.title,
            chapter_subject_id: (c as any).chapter.subject_id,
            chapter_subject_name: (c as any).chapter.subject?.name,
            chapter_subject_grade_id: (c as any).chapter.subject?.grade_id,
          }))
        );
      
      // Trigger animation after data loads
      setTimeout(() => setAnimateCards(true), 100);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = <T extends Record<string, any>>(
    list: T[],
    key: keyof T
  ) =>
    list.filter(
      (item) => {
        const matchesSearch = String(item[key] ?? "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesStatus = activeTab === "grades" || !statusFilter || item.status === statusFilter;
        const matchesGrade = 
          (activeTab !== "subjects" && activeTab !== "chapters" && activeTab !== "concepts") || !gradeFilter || 
          (activeTab === "subjects" && item.grade_id === gradeFilter) ||
          (activeTab === "chapters" && item.subject_grade_id === gradeFilter) ||
          (activeTab === "concepts" && item.chapter_subject_grade_id === gradeFilter);
        const matchesSubject = 
          (activeTab !== "chapters" && activeTab !== "concepts") || !subjectFilter || 
          (activeTab === "chapters" && item.subject_id === subjectFilter) ||
          (activeTab === "concepts" && item.chapter_subject_id === subjectFilter);
        const matchesChapter = activeTab !== "concepts" || !chapterFilter || item.chapter_id === chapterFilter;
        
        return matchesSearch && matchesStatus && matchesGrade && matchesSubject && matchesChapter;
      }
    );

  const statusClasses: Record<Status, string> = {
    active: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700",
    draft: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-700",
    archived: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600",
  };

  const filteredList = useMemo(() => {
    return activeTab === "grades"
      ? filterItems(grades, "name")
      : activeTab === "subjects"
      ? filterItems(subjects, "name")
      : activeTab === "chapters"
      ? filterItems(chapters, "title")
      : filterItems(concepts, "title");
  }, [searchTerm, statusFilter, gradeFilter, subjectFilter, chapterFilter, grades, subjects, chapters, concepts, activeTab]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 sm:px-6 lg:px-8 theme-transition">
      {/* Header Section with Animation */}
      <div className="pt-8 pb-6">
        <div className="sm:flex sm:items-center mb-8">
          <div className="sm:flex-auto">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow theme-transition-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 dark:from-white to-gray-600 dark:to-gray-300 bg-clip-text text-transparent">
                Course Management
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
              Manage your curriculum structure with ease
            </p>
            <div className="flex items-center space-x-2 mt-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                {filteredList.length} {activeTab} found
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
            className="group mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-blue-100/80 dark:bg-white/10 backdrop-blur-lg border border-blue-200/50 dark:border-white/20 text-blue-900 dark:text-white rounded-xl font-medium hover:bg-blue-200/80 dark:hover:bg-white/20 transition-all duration-200"
          >
            <Plus className="mr-2 w-5 h-5" />
            New {activeTab.slice(0, -1)}
          </button>
        </div>
      </div>

      {/* Enhanced Navigation Tabs */}
      <div className="bg-gray-50/80 dark:bg-white/5 backdrop-blur-lg border border-gray-200/50 dark:border-white/20 rounded-2xl mb-8 overflow-hidden">
        <nav className="flex">
          {tabs.map((tab) => {
            const Icon =
              tab === "grades" ? GraduationCap : tab === "subjects" ? BookOpen : tab === "chapters" ? Layers : Target;
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`group relative flex-1 flex items-center justify-center px-6 py-4 font-semibold transition-all duration-300 ${
                  isActive
                    ? "text-blue-900 dark:text-white bg-blue-100/80 dark:bg-white/20 backdrop-blur-lg border-b-2 border-blue-500 dark:border-white/50"
                    : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100/50 dark:hover:bg-white/5 hover:backdrop-blur-lg"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon className={`w-5 h-5 transition-all duration-300 ${
                    isActive ? "" : "group-hover:scale-105"
                  }`} />
                  <span className="capitalize font-medium">
                    {tab}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Enhanced Filters Section */}
      <div className="bg-gray-50/80 dark:bg-white/5 backdrop-blur-lg border border-gray-200/50 dark:border-white/20 rounded-2xl p-6 mb-8">
        <div className={`grid grid-cols-1 gap-4 ${
          activeTab === "subjects" ? "md:grid-cols-4" : 
          activeTab === "chapters" ? "md:grid-cols-5" : 
          activeTab === "concepts" ? "md:grid-cols-6" :
          "md:grid-cols-3"
        }`}>
          {/* Search Input */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors theme-transition duration-200" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:bg-white dark:focus:bg-gray-600 shadow-sm hover:shadow-md theme-transition"
            />
          </div>

          {/* Status Filter */}
          <div className="relative group">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors theme-transition duration-200" />
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full pl-10 pr-10 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 shadow-sm hover:shadow-md appearance-none"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          {/* Subject Tab Filters */}
          {activeTab === "subjects" && (
            <div className="relative group">
              <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors theme-transition duration-200" />
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              <select
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 shadow-sm hover:shadow-md appearance-none"
              >
                <option value="">All Grades</option>
                {grades.map((grade) => (
                  <option key={grade.id} value={grade.id}>
                    {grade.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          {/* Chapter Tab Filters */}
          {activeTab === "chapters" && (
            <>
              <div className="relative group">
                <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors theme-transition duration-200" />
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                <select
                  value={gradeFilter}
                  onChange={(e) => {
                    setGradeFilter(e.target.value);
                    if (e.target.value !== gradeFilter) {
                      setSubjectFilter("");
                    }
                  }}
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 shadow-sm hover:shadow-md appearance-none"
                >
                  <option value="">All Grades</option>
                  {grades.map((grade) => (
                    <option key={grade.id} value={grade.id}>
                      {grade.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative group">
                <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors theme-transition duration-200" />
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                <select
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 shadow-sm hover:shadow-md appearance-none"
                >
                  <option value="">All Subjects</option>
                  {subjects
                    .filter(subject => !gradeFilter || subject.grade_id === gradeFilter)
                    .map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                </select>
              </div>
            </>
          )}
          {/* Concept Tab Filters */}
          {activeTab === "concepts" && (
            <>
              <div className="relative group">
                <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors theme-transition duration-200" />
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                <select
                  value={gradeFilter}
                  onChange={(e) => {
                    setGradeFilter(e.target.value);
                    if (e.target.value !== gradeFilter) {
                      setSubjectFilter("");
                      setChapterFilter("");
                    }
                  }}
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 shadow-sm hover:shadow-md appearance-none"
                >
                  <option value="">All Grades</option>
                  {grades.map((grade) => (
                    <option key={grade.id} value={grade.id}>
                      {grade.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative group">
                <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors theme-transition duration-200" />
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                <select
                  value={subjectFilter}
                  onChange={(e) => {
                    setSubjectFilter(e.target.value);
                    if (e.target.value !== subjectFilter) {
                      setChapterFilter("");
                    }
                  }}
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 shadow-sm hover:shadow-md appearance-none"
                >
                  <option value="">All Subjects</option>
                  {subjects
                    .filter(subject => !gradeFilter || subject.grade_id === gradeFilter)
                    .map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="relative group">
                <Layers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors theme-transition duration-200" />
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                <select
                  value={chapterFilter}
                  onChange={(e) => setChapterFilter(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 shadow-sm hover:shadow-md appearance-none"
                >
                  <option value="">All Chapters</option>
                  {chapters
                    .filter(chapter => 
                      (!gradeFilter || chapter.subject_grade_id === gradeFilter) &&
                      (!subjectFilter || chapter.subject_id === subjectFilter)
                    )
                    .map((chapter) => (
                      <option key={chapter.id} value={chapter.id}>
                        {chapter.title}
                      </option>
                    ))}
                </select>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="bg-gray-50/80 dark:bg-white/5 backdrop-blur-lg border border-gray-200/50 dark:border-white/20 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Name / Title
                </th>
                {activeTab === "grades" && (
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Level
                  </th>
                )}
                {activeTab === "subjects" && (
                  <>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Teacher
                    </th>
                  </>
                )}
              {activeTab === "chapters" && (
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Subject
                </th>
              )}
              {activeTab === "concepts" && (
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Chapter
                </th>
              )}
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-gray-800 theme-transition">
            {loading ? (
              <tr>
                <td colSpan={
                  activeTab === "grades" ? 4 : 
                  activeTab === "subjects" ? 5 : 
                  activeTab === "chapters" ? 4 : 5
                } className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Loading {activeTab}...</p>
                  </div>
                </td>
              </tr>
            ) : filteredList.length === 0 ? (
              <tr>
                <td colSpan={
                  activeTab === "grades" ? 4 : 
                  activeTab === "subjects" ? 5 : 
                  activeTab === "chapters" ? 4 : 5
                } className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 font-medium">No {activeTab} found</p>
                      <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              filteredList.map((item, index) => (
                <tr 
                key={item.id} 
                className={`hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 transform hover:scale-[1.01] ${
                  index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700/30' : 'bg-white dark:bg-gray-800'
                } ${
                  animateCards ? 'animate-fade-in opacity-100' : 'opacity-0'
                } theme-transition`}
                style={{ 
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: 'forwards'
                }}
              >
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {"name" in item ? item.name : item.title}
                </td>
                {activeTab === "grades" && (
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{(item as any).level}</td>
                )}
                {activeTab === "subjects" && (
                  <>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{(item as any).grade_name}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{(item as any).teacher_name}</td>
                  </>
                )}
                {activeTab === "chapters" && (
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{(item as Chapter).subject_name}</td>
                )}
                {activeTab === "concepts" && (
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{(item as Concept).chapter_title}</td>
                )}
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-3 py-1.5 text-xs font-semibold rounded-full shadow-sm ${
                      statusClasses[item.status as Status]
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button
                    onClick={() => {
                      setEditing(item);
                      setShowForm(true);
                    }}
                    className="group p-2 rounded-full bg-blue-100/80 dark:bg-white/10 backdrop-blur-lg border border-blue-200/50 dark:border-white/20 hover:bg-blue-200/80 dark:hover:bg-white/20 transition-all duration-200"
                    aria-label="Edit"
                  >
                    <Edit3 className="text-blue-600 dark:text-blue-400 w-4 h-4" />
                  </button>
                  <button
                    onClick={async () => {
                      if (
                        window.confirm(
                          `Are you sure you want to delete this ${activeTab.slice(
                            0,
                            -1
                          )}?`
                        )
                      ) {
                        try {
                          const tbl =
                            activeTab === "grades"
                              ? "grades"
                              : activeTab === "subjects"
                              ? "subjects"
                              : activeTab === "chapters"
                              ? "chapters"
                              : "concepts";
                          await supabase.from(tbl).delete().eq("id", item.id);
                          fetchAll();
                        } catch (error) {
                          console.error("Delete failed:", error);
                        }
                      }
                    }}
                    className="group p-2 rounded-full bg-red-100/80 dark:bg-white/10 backdrop-blur-lg border border-red-200/50 dark:border-white/20 hover:bg-red-200/80 dark:hover:bg-red-500/10 transition-all duration-200"
                    aria-label="Delete"
                  >
                    <Trash2 className="text-red-600 dark:text-red-400 w-4 h-4" />
                  </button>
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>

      {showForm && (
        <CourseForm
          activeTab={activeTab}
          editing={editing}
          onClose={() => {
            setShowForm(false);
            setEditing(null);
          }}
          refresh={fetchAll}
        />
      )}
    </div>
  );
};

export default CourseManagement;