import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, GraduationCap } from 'lucide-react';
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

  // Simple UI with minimal mouse effects
  return (
    <div 
      className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 theme-transition"
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      {/* Simple Click Ripples */}
      {clickRipples.map(ripple => (
        <div
          key={ripple.id}
          className="fixed pointer-events-none z-40 animate-ping"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: '40px',
            height: '40px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}

      {/* Subtle cursor-following light effect */}
      <div 
        className="fixed pointer-events-none z-30 w-64 h-64 opacity-20 transition-all duration-500 ease-out"
        style={{ 
          left: mousePosition.x - 128, 
          top: mousePosition.y - 128,
          background: 'radial-gradient(circle, rgba(147, 51, 234, 0.3) 0%, transparent 60%)',
        }}
      />

      {/* Simple Background Elements */}
      <div className="absolute inset-0">
        {/* Static floating shapes */}
        <div className="absolute w-72 h-72 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ top: '10%', left: '10%' }}></div>
        <div className="absolute w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000" style={{ top: '40%', right: '20%' }}></div>
        <div className="absolute w-80 h-80 bg-gradient-to-r from-pink-400/10 to-orange-400/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000" style={{ bottom: '-8%', left: '20%' }}></div>

        {/* Vision Statement Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center px-8 opacity-5 select-none">
            <h2 className="text-6xl font-bold text-white mb-8 leading-tight">
              Personalized Learning
            </h2>
            <p className="text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed">
              We envision a future where every student experiences personalized, high-quality learning at the finest level of granularity
            </p>
          </div>
        </div>

        {/* Simple Grid Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-purple-600/5">
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255,255,255,0.1) 2px, transparent 0)`,
              backgroundSize: '50px 50px'
            }}
          ></div>
        </div>

        {/* Simple floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${4 + Math.random() * 3}s`,
              }}
            >
              <div className="w-1 h-1 bg-white/20 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Enhanced Login Card with Mouse Interactions */}
          <div className="card-interactive mouse-follow bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/50 animate-fade-in hover:shadow-3xl transition-all duration-500 mouse-glow-border theme-transition">
            
            {/* Vision Statement Header with Mouse Effects */}
            <div className="text-center mb-6 p-4 bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-gray-700/50 dark:to-gray-600/50 rounded-2xl border border-blue-200/50 dark:border-gray-600/50 mouse-magnetic interactive-bg theme-transition">
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 text-gradient-hover">Our Vision</p>
              <p className="text-sm text-gray-700 leading-relaxed font-medium hover:text-gray-900 transition-colors duration-300">
                "Personalized, high-quality learning at the finest level of granularity"
              </p>
            </div>

            <div className="text-center mb-8">
              <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl animate-pulse-glow mouse-elastic cursor-pointer">
                <GraduationCap className="w-10 h-10 text-white icon-bounce" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 text-gradient-hover cursor-default">
                EduFlow LMS
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg font-medium hover:text-gray-800 dark:hover:text-gray-100 transition-colors duration-300 cursor-default theme-transition">
                Welcome to your personalized learning journey!
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="group">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 cursor-pointer theme-transition">
                  <Mail className="w-4 h-4 mr-2 text-blue-500 icon-bounce" />
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 icon-pulse" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 bg-gray-50/50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-600 mouse-tilt mouse-shadow-dance text-gray-900 dark:text-white theme-transition"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300 cursor-pointer theme-transition">
                  <Lock className="w-4 h-4 mr-2 text-purple-500 icon-bounce" />
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 icon-pulse" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-14 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-400 transition-all duration-300 bg-gray-50/50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-600 mouse-tilt mouse-shadow-dance text-gray-900 dark:text-white theme-transition"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="btn-glass absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-500 transition-colors mouse-elastic"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5 icon-spin" /> : <Eye className="w-5 h-5 icon-spin" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl mouse-magnetic animate-bounce-in">
                  <p className="text-red-600 text-sm font-medium">{error}</p>
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
                    <span className="text-gradient-hover">Signing In...</span>
                  </div>
                ) : (
                  <span className="text-gradient-hover">Begin Your Learning Journey</span>
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
