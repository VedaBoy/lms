import React, { useEffect } from 'react';
import { AuthProvider, useAuth, ProtectedRoute } from './components/AuthProvider';
import { ThemeProvider } from './components/ThemeProvider';
import AuthLogin from './components/AuthLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import ParentDashboard from './pages/parent/ParentDashboard';
import { initializeButtonMouseTracking } from './utils/buttonMouseTracker';

// Main App Content Component
const AppContent: React.FC = () => {
  const { user, loading, logout } = useAuth();

  // Initialize button mouse tracking only for buttons
  useEffect(() => {
    initializeButtonMouseTracking();
    
    // Re-initialize only when user changes (different dashboards)
    // Removed continuous re-initialization to reduce continuous effects
  }, [user]); // Re-run when user changes (different dashboards)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading application...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthLogin />;
  }

  // Render dashboard based on role with proper authentication
  const renderDashboard = () => {
    switch (user.role) {
      case 'admin':
        return (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard user={user} onLogout={logout} />
          </ProtectedRoute>
        );
      case 'teacher':
        return (
          <ProtectedRoute allowedRoles={['teacher', 'admin']}>
            <TeacherDashboard user={user} onLogout={logout} />
          </ProtectedRoute>
        );
      case 'student':
        return (
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard user={user} onLogout={logout} />
          </ProtectedRoute>
        );
      case 'parent':
        return (
          <ProtectedRoute allowedRoles={['parent']}>
            <ParentDashboard user={user} onLogout={logout} />
          </ProtectedRoute>
        );
      default:
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Unknown Role</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Your account role is not recognized.</p>
              <button
                onClick={logout}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        );
    }
  };

  return renderDashboard();
};

// Main App Component with Providers
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <AppContent />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
