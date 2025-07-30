import React, { useState, useEffect } from 'react';
import { User } from './types/index';  // Adjust path as needed
import AuthLogin from './components/AuthLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import ParentDashboard from './pages/parent/ParentDashboard';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <AuthLogin onLogin={handleLogin} />;
  }

  // Render dashboard based on role
  switch (currentUser.role) {
    case 'admin':
      return <AdminDashboard user={currentUser} onLogout={handleLogout} />;
    case 'teacher':
      return <TeacherDashboard user={currentUser} onLogout={handleLogout} />;
    case 'student':
      return <StudentDashboard user={currentUser} onLogout={handleLogout} />;
    case 'parent':
      return <ParentDashboard user={currentUser} onLogout={handleLogout} />;
    default:
      return <AuthLogin onLogin={handleLogin} />;
  }
}

export default App;
