import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      
      // Check if there's a stored user session
      const storedUser = localStorage.getItem('lms_user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        
        // Verify the user still exists and is valid
        const { data: userData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', parsedUser.id)
          .eq('status', 'active')
          .single();

        if (userData && !error) {
          setUser(userData);
        } else {
          // Invalid session, clear storage
          localStorage.removeItem('lms_user');
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('lms_user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);

      // First, get the user profile
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email.toLowerCase().trim())
        .eq('status', 'active')
        .single();

      if (userError || !userData) {
        return { 
          success: false, 
          error: 'Invalid email or password. Please check your credentials.' 
        };
      }

      // Verify password (if using bcrypt)
      const bcrypt = await import('bcryptjs');
      
      if (!userData.password_hash) {
        return { 
          success: false, 
          error: 'Account not properly configured. Please contact administrator.' 
        };
      }

      const passwordMatch = await bcrypt.compare(password, userData.password_hash);
      
      if (!passwordMatch) {
        return { 
          success: false, 
          error: 'Invalid email or password. Please check your credentials.' 
        };
      }

      // Set user and store in localStorage
      setUser(userData);
      localStorage.setItem('lms_user', JSON.stringify(userData));

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: 'Login failed. Please try again.' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      localStorage.removeItem('lms_user');
      
      // Optional: Log logout activity to database
      // await supabase.from('user_sessions').insert({
      //   user_id: user?.id,
      //   action: 'logout',
      //   timestamp: new Date().toISOString()
      // });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles, 
  fallback 
}) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
              Access Denied
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Please log in to access this page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(user!.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
              Unauthorized
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              You don't have permission to access this page.
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
              Required roles: {allowedRoles.join(', ')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
