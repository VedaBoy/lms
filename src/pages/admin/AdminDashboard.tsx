import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import UserManagement from "./UserManagement";
import CourseManagement from "./CourseManagement";
import ContentIntegration from "./ContentIntegration";
import AnalyticsReporting from "./AnalyticsReporting";
import TeacherSubjectAssignment from './TeacherSubjectAssignment';
import EnrollmentManagement from './EnrollmentManagement';
import SystemSettings from "./SystemSettings";
import AnnouncementManagement from "./AnnouncementManagement";
import { supabase } from "../../lib/supabaseClient";
import { User } from "../../types";
import { componentThemes } from "../../utils/themeUtils";
import {
  Users,
  BookOpen,
  Play,
  BarChart3,
  Settings,
  UserCheck,
  Globe,
  Activity,
  Bell,
} from "lucide-react";

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const [currentView, setCurrentView] = useState<string>("overview");

  const navigation = [
    {
      name: "Overview",
      icon: BarChart3,
      current: currentView === "overview",
      onClick: () => setCurrentView("overview"),
    },
    {
      name: "User Management",
      icon: Users,
      current: currentView === "users",
      onClick: () => setCurrentView("users"),
    },
    {
      name: "Course Management",
      icon: BookOpen,
      current: currentView === "courses",
      onClick: () => setCurrentView("courses"),
    },
    {
      name: "Content Integration",
      icon: Play,
      current: currentView === "content",
      onClick: () => setCurrentView("content"),
    },
    {
      name: "Analytics & Reports",
      icon: BarChart3,
      current: currentView === "analytics",
      onClick: () => setCurrentView("analytics"),
    },
    {
      name: "Teacher-Subject Assignments",
      icon: Users,
      current: currentView === "teacher-subject",
      onClick: () => setCurrentView("teacher-subject"),
    },
    {
      name: "Enrollment Management",
      icon: Users,
      current: currentView === "enrollment",
      onClick: () => setCurrentView("enrollment"),
    },
    {
      name: "Announcements",
      icon: Bell,
      current: currentView === "announcements",
      onClick: () => setCurrentView("announcements"),
    },
    {
      name: "System Settings",
      icon: Settings,
      current: currentView === "settings",
      onClick: () => setCurrentView("settings"),
    },
  ];

  const renderContent = () => {
    switch (currentView) {
      case "users":
        return <UserManagement />;
      case "courses":
        return <CourseManagement />;
      case "content":
        return <ContentIntegration />;
      case "analytics":
        return <AnalyticsReporting />;
      case "teacher-subject":
        return <TeacherSubjectAssignment />;
      case "enrollment":
        return <EnrollmentManagement />;
      case "announcements":
        return <AnnouncementManagement currentUser={user} />;
      case "settings":
        return <SystemSettings />;
      default:
        return <AdminOverview setCurrentView={setCurrentView} />;
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
  value: string;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface AdminOverviewProps {
  setCurrentView: React.Dispatch<React.SetStateAction<string>>;
}

const AdminOverview: React.FC<AdminOverviewProps> = ({ setCurrentView }) => {
  const [stats, setStats] = useState<Stat[]>([
    {
      name: "Total Users",
      value: "-",
      change: "",
      icon: Users,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
    },
    {
      name: "Active Students",
      value: "-",
      change: "",
      icon: UserCheck,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
    },
    {
      name: "Courses",
      value: "-",
      change: "",
      icon: BookOpen,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
    },
    {
      name: "Content Items",
      value: "-",
      change: "",
      icon: Globe,
      color: "bg-gradient-to-br from-orange-500 to-orange-600",
    },
  ]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [usersRes, studentsRes, coursesRes, contentRes] = await Promise.all([
          supabase.from("profiles").select("id"),
          supabase.from("profiles").select("id").eq("role", "student"),
          supabase.from("courses").select("id"),
          supabase.from("contents").select("id"),
        ]);

        setStats([
          {
            name: "Total Users",
            value: usersRes.data?.length.toString() ?? "0",
            change: "+12%",
            icon: Users,
            color: "bg-blue-500",
          },
          {
            name: "Active Students",
            value: studentsRes.data?.length.toString() ?? "0",
            change: "+8%",
            icon: UserCheck,
            color: "bg-blue-500",
          },
          {
            name: "Courses",
            value: coursesRes.data?.length.toString() ?? "0",
            change: "+3%",
            icon: BookOpen,
            color: "bg-blue-500",
          },
          {
            name: "Content Items",
            value: contentRes.data?.length.toString() ?? "0",
            change: "+15%",
            icon: Globe,
            color: "bg-orange-500",
          },
        ]);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 sm:px-6 lg:px-8 scroll-smooth theme-transition">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300 text-lg">
          Welcome back! Here's what's happening in your school.
        </p>
      </div>

      {/* Enhanced Stats Grid */}
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
                  <p className="ml-2 text-sm font-medium text-blue-600 dark:text-blue-400">{stat.change}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Activity & Quick Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 animate-fade-in theme-transition" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600 rounded-t-2xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
              Recent Activity
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {[
              { action: "New teacher registered", user: "Sarah Johnson", time: "2 hours ago", color: "text-blue-600 dark:text-blue-400" },
              { action: 'Course "Advanced Math" updated', user: "Mike Davis", time: "4 hours ago", color: "text-blue-600 dark:text-blue-400" },
              { action: "Bulk student upload completed", user: "Admin", time: "6 hours ago", color: "text-blue-600 dark:text-blue-400" },
              { action: "Content integration added", user: "Lisa Chen", time: "1 day ago", color: "text-orange-600 dark:text-orange-400" },
            ].map((activity, i) => (
              <div key={i} className="flex items-start p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 group">
                <div className="flex-shrink-0">
                  <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 group-hover:bg-white dark:group-hover:bg-gray-600 group-hover:shadow-md transition-all duration-200">
                    <Activity className={`h-4 w-4 ${activity.color} transition-transform duration-200`} />
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors theme-transition">{activity.action}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    by {activity.user} • {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 animate-fade-in theme-transition" style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600 rounded-t-2xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
              <Settings className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
              Quick Actions
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <button
                className="btn-glass btn-mouse-track btn-magnetic btn-ripple custom-cursor spotlight-track group p-6 rounded-2xl text-center transition-all duration-300"
                onClick={() => setCurrentView("users")}
              >
                <div className="p-3 bg-blue-500 rounded-xl mx-auto mb-3 w-fit transition-transform duration-200">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <p className="text-sm font-bold text-blue-900 dark:text-blue-300">Add Users</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Manage user accounts</p>
              </button>
              <button
                className="btn-glass btn-mouse-track btn-magnetic btn-ripple custom-cursor spotlight-track group p-6 rounded-2xl text-center transition-all duration-300"
                onClick={() => setCurrentView("courses")}
              >
                <div className="p-3 bg-blue-500 rounded-xl mx-auto mb-3 w-fit transition-transform duration-200">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <p className="text-sm font-bold text-blue-900 dark:text-blue-300">Create Course</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Add new courses</p>
              </button>
              <button
                className="btn-glass group p-6 rounded-2xl text-center transition-all duration-300"
                onClick={() => setCurrentView("content")}
              >
                <div className="p-3 bg-blue-500 rounded-xl mx-auto mb-3 w-fit transition-transform duration-200">
                  <Play className="h-6 w-6 text-white" />
                </div>
                <p className="text-sm font-bold text-blue-900 dark:text-blue-300">Add Content</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Upload materials</p>
              </button>
              <button
                className="btn-glass group p-6 rounded-2xl text-center transition-all duration-300"
                onClick={() => setCurrentView("announcements")}
              >
                <div className="p-3 bg-blue-600 rounded-xl mx-auto mb-3 w-fit transition-transform duration-200">
                  <Bell className="h-6 w-6 text-white" />
                </div>
                <p className="text-sm font-bold text-blue-900 dark:text-blue-300">Send Announcement</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Notify users</p>
              </button>
            </div>
          </div>
        </div>

        {/* Analytics Quick Action */}
        <div className="mt-4">
          <button
            className="btn-glass group w-full p-6 rounded-2xl text-center transition-all duration-300"
            onClick={() => setCurrentView("analytics")}
          >
            <div className="p-3 bg-orange-500 rounded-xl mx-auto mb-3 w-fit transition-transform duration-200">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <p className="text-sm font-bold text-orange-900 dark:text-orange-300">View Reports</p>
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">Analytics dashboard</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
