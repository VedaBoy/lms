import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import UserManagement from "./UserManagement";
import CourseManagement from "./CourseManagement";
import ContentIntegration from "./ContentIntegration";
import AnalyticsReporting from "./AnalyticsReporting";
import TeacherSubjectAssignment from './TeacherSubjectAssignment';
import EnrollmentManagement from './EnrollmentManagement';
import SystemSettings from "./SystemSettings";
import { supabase } from "../../lib/supabaseClient";
import { User } from "../../types";
import {
  Users,
  BookOpen,
  Play,
  BarChart3,
  Settings,
  UserCheck,
  Globe,
  Activity,
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
      color: "bg-gradient-to-br from-green-500 to-green-600",
    },
    {
      name: "Courses",
      value: "-",
      change: "",
      icon: BookOpen,
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
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
            color: "bg-green-500",
          },
          {
            name: "Courses",
            value: coursesRes.data?.length.toString() ?? "0",
            change: "+3%",
            icon: BookOpen,
            color: "bg-purple-500",
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
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back! Here's what's happening in your school.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`flex-shrink-0 p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <p className="ml-2 text-sm font-medium text-green-600">{stat.change}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6 space-y-4">
            {[
              { action: "New teacher registered", user: "Sarah Johnson", time: "2 hours ago" },
              { action: 'Course "Advanced Math" updated', user: "Mike Davis", time: "4 hours ago" },
              { action: "Bulk student upload completed", user: "Admin", time: "6 hours ago" },
              { action: "Content integration added", user: "Lisa Chen", time: "1 day ago" },
            ].map((activity, i) => (
              <div key={i} className="flex items-start">
                <div className="flex-shrink-0">
                  <Activity className="h-5 w-5 text-gray-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">
                    by {activity.user} • {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <button
                className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg text-center transition-colors"
                onClick={() => setCurrentView("users")}
              >
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-blue-900">Add Users</p>
              </button>
              <button
                className="bg-green-50 hover:bg-green-100 p-4 rounded-lg text-center transition-colors"
                onClick={() => setCurrentView("courses")}
              >
                <BookOpen className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-green-900">Create Course</p>
              </button>
              <button
                className="bg-purple-50 hover:bg-purple-100 p-4 rounded-lg text-center transition-colors"
                onClick={() => setCurrentView("content")}
              >
                <Play className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-purple-900">Add Content</p>
              </button>
              <button
                className="bg-orange-50 hover:bg-orange-100 p-4 rounded-lg text-center transition-colors"
                onClick={() => setCurrentView("analytics")}
              >
                <BarChart3 className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-orange-900">View Reports</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
