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
      // Mock data - replace with actual Supabase queries
      setStats([
        {
          name: "Total Students",
          value: 45,
          change: "+3 this week",
          icon: Users,
          color: "bg-gradient-to-br from-blue-500 to-blue-600",
        },
        {
          name: "Active Assignments",
          value: 8,
          change: "2 due today",
          icon: BookOpen,
          color: "bg-gradient-to-br from-blue-500 to-blue-600",
        },
        {
          name: "Live Sessions",
          value: 3,
          change: "Today",
          icon: Play,
          color: "bg-gradient-to-br from-blue-500 to-blue-600",
        },
        {
          name: "Avg Performance",
          value: "87%",
          change: "+2% from last week",
          icon: TrendingUp,
          color: "bg-gradient-to-br from-orange-500 to-orange-600",
        },
      ]);

      setRecent([
        { student: "Alice Johnson", action: "completed Math assignment", time: "2 hours ago" },
        { student: "Bob Smith", action: "joined live session", time: "3 hours ago" },
        { student: "Carol White", action: "submitted project", time: "5 hours ago" },
      ]);

      // Mock sessions data
      setSessions([
        {
          id: 1,
          topic: "Algebra Basics",
          started_at: new Date().toISOString(),
          status: "active"
        }
      ]);
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 sm:px-6 lg:px-8 scroll-smooth theme-transition">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
          Teacher Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300 text-lg">
          Manage your classes, assignments, and track student progress.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div 
            key={stat.name} 
            className="btn-glass group rounded-2xl shadow-lg p-6 transition-all duration-300 theme-transition animate-fade-in"
            style={{ 
              animationDelay: `${index * 100}ms`,
              animationFillMode: 'forwards'
            }}
          >
            <div className="flex items-center">
              <div className={`flex-shrink-0 p-3 rounded-xl ${stat.color} shadow-lg transition-transform duration-200`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-100 transition-colors theme-transition">{stat.name}</p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors theme-transition">{stat.value}</p>
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-medium">{stat.change}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Sessions */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 animate-fade-in theme-transition" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600 rounded-t-2xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
              Today's Sessions
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {sessions.length === 0 && (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-300 dark:text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">No sessions scheduled for today.</p>
                </div>
              )}
              {sessions.map((session, index) => (
                <div 
                  key={session.id} 
                  className="btn-glass group rounded-2xl p-4 hover:border-blue-200 dark:hover:border-blue-600 transition-all duration-300 theme-transition animate-fade-in"
                  style={{ animationDelay: `${500 + index * 100}ms`, animationFillMode: 'forwards' }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center mr-4">
                        <Play className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors theme-transition">{session.topic}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Started at {new Date(session.started_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => onQuickNavigate("streaming")}
                      className="btn-glass btn-glass-blue px-4 py-2 text-sm font-bold text-blue-700 dark:text-blue-300 rounded-full transition-all duration-200"
                    >
                      Join
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 animate-fade-in theme-transition" style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600 rounded-t-2xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
              Recent Activity
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recent.map((activity, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">
                      <span className="font-medium">{activity.student}</span> {activity.action}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 animate-fade-in theme-transition" style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => onQuickNavigate("assign")}
            className="btn-glass btn-glass-success p-4 rounded-lg text-center transition-colors theme-transition"
          >
            <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-blue-900 dark:text-blue-300">Assign Concepts</p>
          </button>
          <button
            onClick={() => onQuickNavigate("streaming")}
            className="btn-glass btn-glass-primary p-4 rounded-lg text-center transition-colors theme-transition"
          >
            <Play className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-blue-900 dark:text-blue-300">AV Streaming</p>
          </button>
          <button
            onClick={() => onQuickNavigate("progress")}
            className="btn-glass btn-glass-blue p-4 rounded-lg text-center transition-colors theme-transition"
          >
            <Users className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-blue-900 dark:text-blue-300">Student Progress</p>
          </button>
          <button className="btn-glass btn-glass-orange p-4 rounded-lg text-center transition-colors theme-transition">
            <BarChart3 className="h-8 w-8 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-orange-900 dark:text-orange-300">Analytics</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
