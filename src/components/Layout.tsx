import React, { useState } from 'react';
import { User } from '../types';
import { 
  Home, 
  Users, 
  BookOpen, 
  BarChart, 
  LogOut, 
  User as UserIcon,
  Menu,
  X,
  Search
} from 'lucide-react';
import { ScrollToTopButton } from './SmoothScroll';
import { ScrollProgress } from './SmoothNav';
import { NotificationBell } from './NotificationPanel';
import { ThemeToggle } from './ThemeProvider';

interface LayoutProps {
  user: User;
  children: React.ReactNode;
  navigation: Array<{
    name: string;
    icon: React.ComponentType<any>;
    current: boolean;
    onClick: () => void;
  }>;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ user, children, navigation, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100 dark:bg-gray-900 theme-transition">
      <ScrollProgress />
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800 theme-transition">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">EduFlow LMS</h1>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={item.onClick}
                  className={`group flex items-center px-2 py-2 text-base font-medium rounded-md w-full text-left transition-all duration-200 ${
                    item.current
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <item.icon className="mr-4 h-6 w-6" />
                  {item.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-xl theme-transition">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center backdrop-blur-lg bg-opacity-90 border border-white/20 mr-3">
                  <span className="text-white font-bold text-lg">E</span>
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  EduFlow LMS
                </h1>
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-2">
                {navigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={item.onClick}
                    className={`group relative overflow-hidden flex items-center px-4 py-3 text-sm font-medium rounded-xl w-full text-left transition-all duration-300 ${
                      item.current
                        ? 'bg-blue-100/80 dark:bg-white/10 backdrop-blur-lg border border-blue-200/50 dark:border-white/20 text-blue-900 dark:text-white shadow-lg dark:shadow-xl'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-white/5 hover:backdrop-blur-lg hover:border hover:border-gray-200/50 dark:hover:border-white/10 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-200 dark:via-gray-300 to-transparent opacity-0 group-hover:opacity-20 dark:group-hover:opacity-10"></div>
                    <item.icon className={`mr-3 h-5 w-5 transition-all duration-300 ${item.current ? '' : 'group-hover:scale-110'}`} />
                    <span className="font-medium">{item.name}</span>
                    {item.current && (
                      <div className="absolute right-2 w-2 h-2 bg-blue-600 dark:bg-white rounded-full"></div>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top bar */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white dark:bg-gray-800 shadow theme-transition">
          <button
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex-1 px-4 flex justify-between items-center">
            <div className="flex-1 flex">
              <div className="w-full flex md:ml-0">
                <div className="relative w-full text-gray-400 dark:text-gray-500 focus-within:text-gray-600 dark:focus-within:text-gray-300">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                    <Search className="h-5 w-5" />
                  </div>
                  <input
                    className="block w-full h-full pl-8 pr-3 py-2 border-transparent bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 dark:focus:placeholder-gray-500 focus:ring-0 focus:border-transparent transition-colors theme-transition"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              {/* Theme Toggle */}
              <ThemeToggle />
              
              {/* Notifications */}
              <NotificationBell user={user} />
              
              <div className="relative">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role}</div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={onLogout}
                className="bg-white dark:bg-gray-800 p-1 rounded-full text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-all duration-300 mouse-tilt btn-interactive"
                title="Logout"
              >
                <LogOut className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none smooth-scroll-container bg-gray-50 dark:bg-gray-900 theme-transition">
          <div className="py-6 scroll-smooth">
            {children}
          </div>
          <ScrollToTopButton />
        </main>
      </div>
    </div>
  );
};

export default Layout;