import React, { useEffect, useState } from "react";
import {
  Users,
  BookOpen,
  Play,
  BarChart3,
  Clock,
  TrendingUp,
  Activity,
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import Layout from "../../components/Layout";
import ConceptAssignment from "./ConceptAssignment";
import AVStreaming from "./AVStreaming";
import StudentProgress from "./StudentProgress";
import { User } from "../../types";

interface TeacherDashboardProps {
  user: User | null; // user can be null if not logged in
  onLogout: () => void;
}

type ViewType = "overview" | "assign" | "streaming" | "progress";

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  user,
  onLogout,
}) => {
  const [currentView, setCurrentView] = useState<ViewType>("overview");

  // If no user, show simple message or redirect (you can customize)
  if (!user) {
    return <div>Please login to access this page.</div>;
  }

  const navigation = [
    {
      name: "Overview",
      icon: BarChart3,
      current: currentView === "overview",
      onClick: () => setCurrentView("overview"),
    },
    {
      name: "Assign Concepts",
      icon: BookOpen,
      current: currentView === "assign",
      onClick: () => setCurrentView("assign"),
    },
    {
      name: "AV Streaming",
      icon: Play,
      current: currentView === "streaming",
      onClick: () => setCurrentView("streaming"),
    },
    {
      name: "Student Progress",
      icon: Users,
      current: currentView === "progress",
      onClick: () => setCurrentView("progress"),
    },
  ];

  const renderContent = () => {
    switch (currentView) {
      case "assign":
        return <ConceptAssignment />;
      case "streaming":
        return <AVStreaming />;
      case "progress":
        return <StudentProgress />;
      default:
        return <TeacherOverview onQuickNavigate={setCurrentView} />;
    }
  };

  return (
    <Layout user={user} navigation={navigation} onLogout={onLogout}>
      {renderContent()}
    </Layout>
  );
};

interface Stat {
  name: string;
  value: number | string;
  change?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface ActivityLog {
  student: string;
  action: string;
  time: string;
}

const TeacherOverview: React.FC<{
  onQuickNavigate: (view: ViewType) => void;
}> = ({ onQuickNavigate }) => {
  const [stats, setStats] = useState<Stat[]>([]);
  const [recent, setRecent] = useState<ActivityLog[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        console.error("User not authenticated or error fetching user:", error);
        return;
      }

      const teacherId = user.id;

      const [totalRes, assignedRes, completedRes, actRes, sessRes] =
        await Promise.all([
          supabase
            .from("profiles")
            .select("id", { count: "exact" })
            .eq("role", "student"),

          supabase
            .from("assignments")
            .select("id", { count: "exact" })
            .eq("teacher_id", teacherId)
            .eq("status", "assigned"),

          supabase
            .from("assignments")
            .select("id", { count: "exact" })
            .eq("teacher_id", teacherId)
            .eq("status", "completed"),

          supabase
            .from("activity_logs")
            .select(
              `action, timestamp, assignments!inner(student_id, student:student_id(name))`
            )
            .eq("assignments.teacher_id", teacherId)
            .order("timestamp", { ascending: false })
            .limit(4),

          supabase
            .from("av_sessions")
            .select("*")
            .eq("teacher_id", teacherId)
            .gte("started_at", new Date().toISOString().slice(0, 10))
            .order("started_at", { ascending: true })
            .limit(3),
        ]);

      setStats([
        {
          name: "Total Students",
          value: totalRes.count || 0,
          icon: Users,
          color: "bg-gradient-to-br from-blue-500 to-blue-600",
        },
        {
          name: "Assigned Concepts",
          value: assignedRes.count || 0,
          icon: BookOpen,
          color: "bg-gradient-to-br from-green-500 to-green-600",
        },
        {
          name: "Completed Concepts",
          value: completedRes.count || 0,
          icon: TrendingUp,
          color: "bg-gradient-to-br from-purple-500 to-purple-600",
        },
        {
          name: "Today's Sessions",
          value: sessRes.data?.length || 0,
          icon: Clock,
          color: "bg-gradient-to-br from-orange-500 to-orange-600",
        },
      ]);

      setRecent(
        actRes.data?.map((r: any) => ({
          student: r.student.name,
          action: r.action,
          time: new Date(r.timestamp).toLocaleTimeString(),
        })) || []
      );

      setSessions(sessRes.data || []);
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 sm:px-6 lg:px-8 scroll-smooth theme-transition">
            <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent animate-fade-in-scale">
          Teacher Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300 text-lg">
          Manage your classes, assignments, and track student progress.
        </p>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((s, index) => (
                    <div
            key={s.name}
            className={`group bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 hover-lift hover-glow cursor-pointer animate-bounce-in delay-${(index + 1) * 100} theme-transition`}
          >
            <div className="flex items-center">
              <div className={`flex-shrink-0 p-4 rounded-xl ${s.color} shadow-lg group-hover:animate-pulse transition-all duration-300 theme-transition`}>
                <s.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-100 transition-colors theme-transition">
                  {s.name}
                </p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {s.value}
                  </p>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-purple-400 to-blue-500 h-2 rounded-full animate-shimmer transition-all duration-1000"
                    style={{ width: `${70 + (index * 8)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Sessions and Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Sessions with Animations */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-slide-in-left theme-transition">
          <div className="bg-gradient-to-r from-purple-500 to-blue-600 p-6 text-white">
            <h3 className="text-xl font-bold flex items-center">
              <Clock className="w-6 h-6 mr-3 animate-pulse" />
              Today's Sessions
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {sessions.length === 0 && (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-300 dark:text-gray-500 mx-auto mb-3 animate-pulse" />
                <p className="text-gray-500 dark:text-gray-400 animate-fade-in">No sessions scheduled for today.</p>
              </div>
            )}
            {sessions.map((s, i) => (
              <div
                key={i}
                className={`group flex items-center justify-between p-5 rounded-xl bg-gradient-to-r from-gray-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 hover:from-purple-50 hover:to-blue-50 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-300 theme-transition transform hover:translate-x-2 animate-slide-in-up delay-${(i + 1) * 100} theme-transition`}
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center animate-pulse-glow mr-4">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-gray-900 dark:text-white block">
                      {new Date(s.started_at).toLocaleTimeString()}
                    </span>
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mt-1">
                      {s.topic || "Live Session"}
                    </h4>
                  </div>
                </div>
                <button
                  onClick={() => onQuickNavigate("streaming")}
                  className="px-4 py-2 text-sm font-bold text-purple-700 bg-purple-100 rounded-full hover:bg-purple-200 hover:scale-105 transition-all duration-200 group-hover:animate-bounce"
                >
                  Join
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity with Enhanced Animations */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 animate-slide-in-right theme-transition">
          <div className="bg-gradient-to-r from-blue-500 to-green-600 p-6 text-white">
            <h3 className="text-xl font-bold flex items-center">
              <Activity className="w-6 h-6 mr-3 animate-pulse" />
              Recent Student Activity
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {recent.length === 0 && (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-gray-300 dark:text-gray-500 mx-auto mb-3 animate-pulse" />
                <p className="text-gray-500 dark:text-gray-400 animate-fade-in">No recent activity to display.</p>
              </div>
            )}
            {recent.map((r, i) => (
              <div 
                key={i} 
                className={`flex items-start p-4 rounded-lg bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 hover:from-blue-50 hover:to-green-50 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-300 theme-transition transform hover:translate-x-2 animate-slide-in-up delay-${(i + 1) * 100} theme-transition`}
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-green-500 flex items-center justify-center animate-pulse-glow">
                    <Activity className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors theme-transition">
                    <span className="font-bold text-green-600 dark:text-green-400">{r.student}</span> {r.action}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{r.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Quick Actions */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 animate-slide-in-up delay-300 theme-transition">
        <div className="bg-gradient-to-r from-green-500 to-purple-600 p-6 text-white rounded-t-2xl">
          <h3 className="text-xl font-bold">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button
              onClick={() => onQuickNavigate("assign")}
              className="group relative overflow-hidden bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 hover:from-green-100 hover:to-green-200 dark:hover:from-green-800/40 dark:hover:to-green-700/40 p-6 rounded-xl transition-all duration-300 theme-transition transform hover:scale-105 hover-glow cursor-magic theme-transition"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 animate-shimmer"></div>
              <BookOpen className="h-8 w-8 text-green-700 mx-auto mb-2 group-hover:animate-bounce" />
              <p className="text-sm font-bold text-green-900 group-hover:text-green-700">Assign Concepts</p>
            </button>
            <button
              onClick={() => onQuickNavigate("streaming")}
              className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800/40 dark:hover:to-blue-700/40 p-6 rounded-xl transition-all duration-300 theme-transition transform hover:scale-105 hover-glow cursor-magic border border-blue-200 dark:border-blue-700"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white dark:via-gray-300 to-transparent opacity-0 group-hover:opacity-20 animate-shimmer"></div>
              <Play className="h-8 w-8 text-blue-700 dark:text-blue-400 mx-auto mb-2 group-hover:animate-bounce" />
              <p className="text-sm font-bold text-blue-900 dark:text-blue-300 group-hover:text-blue-700 dark:group-hover:text-blue-400">AV Streaming</p>
            </button>
            <button
              onClick={() => onQuickNavigate("progress")}
              className="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-800/40 dark:hover:to-purple-700/40 p-6 rounded-xl transition-all duration-300 theme-transition transform hover:scale-105 hover-glow cursor-magic border border-purple-200 dark:border-purple-700"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white dark:via-gray-300 to-transparent opacity-0 group-hover:opacity-20 animate-shimmer"></div>
              <Users className="h-8 w-8 text-purple-700 dark:text-purple-400 mx-auto mb-2 group-hover:animate-bounce" />
              <p className="text-sm font-bold text-purple-900 dark:text-purple-300 group-hover:text-purple-700 dark:group-hover:text-purple-400">Student Progress</p>
            </button>
            <button
              className="group relative overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 hover:from-orange-100 hover:to-orange-200 dark:hover:from-orange-800/40 dark:hover:to-orange-700/40 p-6 rounded-xl transition-all duration-300 theme-transition transform hover:scale-105 hover-glow cursor-magic border border-orange-200 dark:border-orange-700"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white dark:via-gray-300 to-transparent opacity-0 group-hover:opacity-20 animate-shimmer"></div>
              <BarChart3 className="h-8 w-8 text-orange-700 dark:text-orange-400 mx-auto mb-2 group-hover:animate-bounce" />
              <p className="text-sm font-bold text-orange-900 dark:text-orange-300 group-hover:text-orange-700 dark:group-hover:text-orange-400">Analytics</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
