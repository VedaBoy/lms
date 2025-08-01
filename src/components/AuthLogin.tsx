import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, GraduationCap, Sun, Moon } from 'lucide-react';
import { useAuth } from './AuthProvider';

const AuthLogin: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [clickRipples, setClickRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      // Check system preference
      setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Toggle theme
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Simple cursor movement tracking
  const handleMouseMove = React.useCallback((e: React.MouseEvent) => {
    requestAnimationFrame(() => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    });
  }, []);

  // Simple click effect
  const handleClick = React.useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const newRipple = {
      id: Date.now(),
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    
    setClickRipples([newRipple]); // Only one ripple at a time
    
    // Remove ripple after animation
    setTimeout(() => {
      setClickRipples([]);
    }, 800);
  }, []);

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    const result = await login(email, password);
    
    if (!result.success) {
      setError(result.error || 'Login failed');
    }
    
    setIsLoading(false);
  };

  // Glassmorphism UI consistent with the rest of the site
  return (
    <div 
      className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-blue-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 theme-transition"
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      {/* Theme Switcher Button */}
      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={toggleTheme}
          className="btn-glass p-3 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl"
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? (
            <Sun className="w-6 h-6 text-yellow-500" />
          ) : (
            <Moon className="w-6 h-6 text-blue-600" />
          )}
        </button>
      </div>

      {/* Glassmorphism Click Ripples */}
      {clickRipples.map(ripple => (
        <div
          key={ripple.id}
          className="fixed pointer-events-none z-40 animate-ping"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: '40px',
            height: '40px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}

      {/* Glassmorphism cursor-following light effect */}
      <div 
        className="fixed pointer-events-none z-30 w-64 h-64 opacity-20 transition-all duration-500 ease-out"
        style={{ 
          left: mousePosition.x - 128, 
          top: mousePosition.y - 128,
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 60%)',
        }}
      />

      {/* Clean glassmorphism background */}
      <div className="absolute inset-0">
        {/* Subtle floating glassmorphism shapes */}
        <div className="absolute w-72 h-72 btn-glass rounded-full opacity-50" style={{ top: '15%', left: '10%' }}></div>
        <div className="absolute w-96 h-96 btn-glass rounded-full opacity-40" style={{ top: '40%', right: '15%' }}></div>
        <div className="absolute w-80 h-80 btn-glass rounded-full opacity-30" style={{ bottom: '10%', left: '20%' }}></div>

        {/* Clean vision statement background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center px-8 opacity-5 select-none">
            <h2 className="text-6xl font-bold text-gray-700 dark:text-white mb-8 leading-tight">
              Personalized Learning
            </h2>
            <p className="text-2xl text-gray-600 dark:text-white/80 max-w-4xl mx-auto leading-relaxed">
              We envision a future where every student experiences personalized, high-quality learning at the finest level of granularity
            </p>
          </div>
        </div>

        {/* Simple grid pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-blue-500/5 dark:from-blue-600/3 dark:to-blue-500/3">
          <div 
            className="absolute inset-0 opacity-10 dark:opacity-5"
            style={{
              backgroundImage: `radial-gradient(circle at 25px 25px, rgba(59, 130, 246, 0.1) 2px, transparent 0)`,
              backgroundSize: '50px 50px'
            }}
          ></div>
        </div>

        {/* Clean floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            >
              <div className="w-1 h-1 bg-blue-400/20 dark:bg-blue-400/10 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Clean Glassmorphism Login Card */}
          <div className="login-card rounded-3xl shadow-2xl p-8 transition-all duration-500">
            
            {/* Clean Vision Statement Header */}
            <div className="text-center mb-6 p-4 login-card-inner rounded-2xl">
              <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">Our Vision</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                "Personalized, high-quality learning at the finest level of granularity"
              </p>
            </div>

            <div className="text-center mb-8">
              <div className="mx-auto w-20 h-20 btn-glass-primary rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <GraduationCap className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                EduFlow LMS
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
                Welcome to your personalized learning journey!
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="group">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-blue-500" />
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="login-input w-full pl-12 pr-4 py-4 rounded-2xl bg-white/15 dark:bg-gray-800/40 backdrop-filter backdrop-blur-16 border-2 border-white/30 dark:border-gray-600/40 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/60 dark:focus:border-blue-400/60 transition-all duration-300 text-gray-900 dark:text-white shadow-lg"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                  <Lock className="w-4 h-4 mr-2 text-blue-500" />
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="login-input w-full pl-12 pr-14 py-4 rounded-2xl bg-white/15 dark:bg-gray-800/40 backdrop-filter backdrop-blur-16 border-2 border-white/30 dark:border-gray-600/40 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/60 dark:focus:border-blue-400/60 transition-all duration-300 text-gray-900 dark:text-white shadow-lg"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors p-1 rounded"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="login-card-inner p-4 rounded-2xl border border-red-300/30 dark:border-red-500/30">
                  <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="btn-glass btn-glass-primary w-full py-4 px-6 text-white font-bold rounded-2xl shadow-lg transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                    <span>Signing In...</span>
                  </div>
                ) : (
                  <span>Begin Your Learning Journey</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLogin;
