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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Teacher Dashboard
        </h1>
        <p className="mt-2 text-gray-600 text-lg">
          Welcome! Here's a snapshot of your classroom activity for today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((s) => (
          <div key={s.name} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`flex-shrink-0 p-3 rounded-lg ${s.color}`}>
                <s.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{s.name}</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {s.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Today's Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-lg font-medium">Today's Sessions</h3>
          </div>
          <div className="p-6 space-y-4">
            {sessions.length === 0 && (
              <p className="text-gray-500">No sessions today.</p>
            )}
            {sessions.map((s, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <Clock className="h-4 w-4 text-gray-400 mr-2 inline" />
                  <span className="text-sm font-medium">
                    {new Date(s.started_at).toLocaleTimeString()}
                  </span>
                  <h4 className="text-sm font-semibold mt-1">
                    {s.topic || "Live Session"}
                  </h4>
                </div>
                <button
                  onClick={() => onQuickNavigate("streaming")}
                  className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-full"
                >
                  Join
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-lg font-medium">Recent Student Activity</h3>
          </div>
          <div className="p-6 space-y-4">
            {recent.length === 0 && (
              <p className="text-gray-500">No recent activity.</p>
            )}
            {recent.map((r, i) => (
              <div key={i} className="flex items-start">
                <Activity className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm">
                    <span className="font-medium">{r.student}</span> {r.action}
                  </p>
                  <p className="text-xs text-gray-500">{r.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button
            onClick={() => onQuickNavigate("assign")}
            className="flex flex-col items-center p-3 bg-green-100 rounded hover:bg-green-200"
          >
            <BookOpen className="h-6 w-6 text-green-700 mb-1" />
            Assign Concepts
          </button>
          <button
            onClick={() => onQuickNavigate("streaming")}
            className="flex flex-col items-center p-3 bg-blue-100 rounded hover:bg-blue-200"
          >
            <Play className="h-6 w-6 text-blue-700 mb-1" />
            AV Streaming
          </button>
          <button
            onClick={() => onQuickNavigate("progress")}
            className="flex flex-col items-center p-3 bg-purple-100 rounded hover:bg-purple-200"
          >
            <Users className="h-6 w-6 text-purple-700 mb-1" />
            Student Progress
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
