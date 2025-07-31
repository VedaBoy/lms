import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Key,
  Users,
  TrendingUp,
  ChevronDown,
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { User } from '../../types';
import bcrypt from 'bcryptjs';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | User['role']>('all');
  const [showAddUser, setShowAddUser] = useState(false);
  const [showParentLink, setShowParentLink] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordUser, setPasswordUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Fetch users from Supabase
  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from<'profiles', User>('profiles')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) console.error('Fetch error:', error.message);
    else setUsers(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter logic
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      `${user.name} ${user.email}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const AddUserForm: React.FC<{ onClose: () => void; initial?: Partial<User> }> = ({
    onClose,
    initial = {}
  }) => {
    const [email, setEmail] = useState(initial.email || '');
    const [role, setRole] = useState<User['role']>(initial.role || 'student');
    const [status, setStatus] = useState<User['status']>(initial.status || 'active');
    // Assuming 'firstName' and 'lastName' can be derived from 'name' or added to User type
    const [firstName, setFirstName] = useState(initial.name?.split(' ')[0] || '');
    const [lastName, setLastName] = useState(initial.name?.split(' ').slice(1).join(' ') || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');

    useEffect(() => {
      if (initial.name) {
        const nameParts = initial.name.split(' ');
        setFirstName(nameParts[0] || '');
        setLastName(nameParts.slice(1).join(' ') || '');
      }
    }, [initial.name]);

    const validatePasswords = () => {
      if (!initial.id && !password) {
        setPasswordError('Password is required for new users');
        return false;
      }
      if (password && password.length < 8) {
        setPasswordError('Password must be at least 8 characters long');
        return false;
      }
      if (password !== confirmPassword) {
        setPasswordError('Passwords do not match');
        return false;
      }
      setPasswordError('');
      return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validatePasswords()) {
        return;
      }

      let password_hash;
      if (password) {
        // Hash the password before storing
        const saltRounds = 10;
        password_hash = await bcrypt.hash(password, saltRounds);
      }

      const payload: any = {
        email,
        name: `${firstName} ${lastName}`.trim(), // Combine first and last name for 'name'
        role,
        status,
        createdAt: initial.createdAt || new Date().toISOString(),
      };

      // Only include password_hash if a password was provided
      if (password_hash) {
        payload.password_hash = password_hash;
      }

      let error;
      if (initial.id) {
        const res = await supabase
          .from('profiles')
          .update(payload)
          .eq('id', initial.id);
        error = res.error;
      } else {
        const res = await supabase
          .from('profiles')
          .insert(payload);
        error = res.error;
      }

      if (error) console.error('Save error:', error.message);
      else {
        onClose();
        fetchUsers();
      }
    };

    return (
      <div className="fixed inset-0 bg-gray-600 dark:bg-gray-900 bg-opacity-50 dark:bg-opacity-75 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border border-white/20 w-11/12 md:w-3/4 lg:w-1/2 backdrop-blur-lg bg-white/10 dark:bg-white/5 rounded-lg">
          <div className="mt-3">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white dark:text-white">{initial.id ? 'Edit User' : 'Add New User'}</h3>
              <button
                onClick={onClose}
                className="text-gray-400 dark:text-gray-500 dark:text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent theme-transition"
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent theme-transition"
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent theme-transition"
                  placeholder="Enter email address"
                />
              </div>

              {(!initial.id || password) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Password {!initial.id && <span className="text-red-500">*</span>}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required={!initial.id}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent theme-transition"
                        placeholder={initial.id ? "Leave blank to keep current password" : "Enter password"}
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Confirm Password {!initial.id && <span className="text-red-500">*</span>}
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required={!initial.id}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent theme-transition"
                        placeholder={initial.id ? "Leave blank to keep current password" : "Confirm password"}
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {passwordError && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  {passwordError}
                </div>
              )}

              {!initial.id && (
                <div className="text-sm text-gray-600 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p className="font-medium mb-1">Password Requirements:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Minimum 8 characters long</li>
                    <li>Must match confirmation password</li>
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as User['role'])}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent theme-transition"
                  >
                    <option value="admin">Admin</option>
                    <option value="teacher">Teacher</option>
                    <option value="student">Student</option>
                    <option value="parent">Parent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as User['status'])}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent theme-transition"
                  >
                    <option value="active">Active</option>
                    <option value="hold">Hold</option>
                  </select>
                </div>
              </div>

              {/* No explicit grade level or class assignment in the provided backend code, keeping it for UI consistency if needed later */}
              {/*
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Grade Level</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent theme-transition">
                  <option value="">Select grade (if applicable)</option>
                  <option value="k">Kindergarten</option>
                  <option value="1">1st Grade</option>
                  <option value="2">2nd Grade</option>
                  <option value="3">3rd Grade</option>
                  <option value="4">4th Grade</option>
                  <option value="5">5th Grade</option>
                  <option value="6">6th Grade</option>
                  <option value="7">7th Grade</option>
                  <option value="8">8th Grade</option>
                  <option value="9">9th Grade</option>
                  <option value="10">10th Grade</option>
                  <option value="11">11th Grade</option>
                  <option value="12">12th Grade</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Class Assignment</label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input type="checkbox" id="math101" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <label htmlFor="math101" className="ml-2 text-sm text-gray-700">Math 101</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="science201" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <label htmlFor="science201" className="ml-2 text-sm text-gray-700">Science 201</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="english101" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <label htmlFor="english101" className="ml-2 text-sm text-gray-700">English 101</label>
                  </div>
                </div>
              </div>
              */}

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-600">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 dark:hover:bg-gray-600 focus:ring-2 focus:ring-blue-500 theme-transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                >
                  {initial.id ? 'Save Changes' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const PasswordModal: React.FC<{ user: User; onClose: () => void }> = ({ user, onClose }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const validatePasswords = () => {
      if (!password) {
        setPasswordError('Password is required');
        return false;
      }
      if (password.length < 8) {
        setPasswordError('Password must be at least 8 characters long');
        return false;
      }
      if (password !== confirmPassword) {
        setPasswordError('Passwords do not match');
        return false;
      }
      setPasswordError('');
      return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!validatePasswords()) {
        return;
      }

      setIsLoading(true);

      try {
        // Hash the password before storing
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        const { error } = await supabase
          .from('profiles')
          .update({ password_hash })
          .eq('id', user.id);

        if (error) {
          console.error('Password update error:', error.message);
          setPasswordError('Failed to update password. Please try again.');
        } else {
          onClose();
          // Optionally show a success message
        }
      } catch (error) {
        console.error('Password hashing error:', error);
        setPasswordError('An unexpected error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border border-white/20 w-11/12 md:w-1/2 lg:w-1/3 backdrop-blur-lg bg-white/10 dark:bg-white/5 rounded-lg">
          <div className="mt-3">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Set Password for {user.name}</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent theme-transition"
                    placeholder="Enter new password"
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent theme-transition"
                    placeholder="Confirm new password"
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              {passwordError && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  {passwordError}
                </div>
              )}

              <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                <p className="font-medium mb-1">Password Requirements:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Minimum 8 characters long</li>
                  <li>Must match confirmation password</li>
                </ul>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-600">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 dark:hover:bg-gray-600 focus:ring-2 focus:ring-blue-500 theme-transition"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? 'Setting Password...' : 'Set Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 sm:px-6 lg:px-8 theme-transition interactive-bg scroll-smooth">
      <div className="sm:flex sm:items-center animate-slide-in-up">
        <div className="sm:flex-auto">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow theme-transition-lg mouse-elastic icon-bounce cursor-pointer">
              <Users className="w-6 h-6 text-white icon-spin" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent text-gradient-hover cursor-default">
              User Management
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 font-medium hover:text-gray-800 dark:hover:text-gray-200 transition-colors theme-transition duration-300 cursor-default">
            Manage all users in your school system including admins, teachers, students, and parents.
          </p>
          <div className="flex items-center space-x-2 mt-2 mouse-magnetic">
            <TrendingUp className="w-4 h-4 text-green-500 icon-bounce" />
            <span className="text-sm text-green-600 dark:text-green-400 font-medium hover:text-green-700 dark:hover:text-green-300 transition-colors theme-transition">
              {filteredUsers.length} users found
            </span>
          </div>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none space-x-2">
          <button
            onClick={() => setShowParentLink(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 focus:ring-2 focus:ring-blue-500 transition-all duration-300 theme-transition mouse-tilt mouse-shadow-dance btn-interactive cursor-pointer"
          >
            <Users className="w-4 h-4 mr-2 icon-bounce" />
            Manage Parent Links
          </button>
          <button
            onClick={() => {
              setEditingUser(null);
              setShowAddUser(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-xl text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 btn-interactive mouse-ripple mouse-magnetic cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-2 icon-spin" />
            Add User
          </button>
        </div>
      </div>

      {/* Enhanced Search and Filter */}
      <div className="bg-gray-50/80 dark:bg-white/5 backdrop-blur-lg border border-gray-200/50 dark:border-white/20 rounded-2xl p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search Input */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors theme-transition duration-200" />
            <input
              type="text"
              placeholder="Search users by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:bg-white dark:focus:bg-gray-600 shadow-sm hover:shadow-md theme-transition"
            />
          </div>
          {/* Filter Select */}
          <div className="relative group">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors theme-transition duration-200" />
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as 'all' | User['role'])}
              className="w-full pl-10 pr-10 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 shadow-sm hover:shadow-md appearance-none"
            >
              <option value="all">All Roles</option>
              <option value="admin">👑 Admin</option>
              <option value="teacher">👨‍🏫 Teacher</option>
              <option value="student">🎓 Student</option>
              <option value="parent">👨‍👩‍👧‍👦 Parent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-100 dark:border-gray-700 theme-transition overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400 dark:text-gray-300">Loading users...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-300 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                              {user.name ? user.name.split(' ').map(n => n[0]).join('') : ''}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-300">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'teacher' ? 'bg-blue-100 text-blue-800' :
                        user.role === 'student' ? 'bg-green-100 text-green-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 dark:text-gray-300">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => {
                            setPasswordUser(user);
                            setShowPasswordModal(true);
                          }}
                          className="text-green-600 hover:text-green-900"
                          title="Set Password"
                        >
                          <Key className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingUser(user);
                            setShowAddUser(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit User"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={async () => {
                            if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
                              const { error } = await supabase
                                .from('profiles')
                                .delete()
                                .eq('id', user.id);
                              if (error) console.error('Delete error:', error.message);
                              else fetchUsers();
                            }
                          }}
                          className="text-red-600 hover:text-red-900"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAddUser && (
        <AddUserForm
          onClose={() => {
            setShowAddUser(false);
            setEditingUser(null);
          }}
          initial={editingUser || {}}
        />
      )}
      {showPasswordModal && passwordUser && (
        <PasswordModal
          user={passwordUser}
          onClose={() => {
            setShowPasswordModal(false);
            setPasswordUser(null);
          }}
        />
      )}
      {showParentLink && <ParentStudentLinkForm onClose={() => setShowParentLink(false)} />}
    </div>
  );
};

const ParentStudentLinkForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [parents, setParents] = useState<User[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [selectedParent, setSelectedParent] = useState<string>('');
  const [linkedStudents, setLinkedStudents] = useState<string[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data: parentData, error: parentError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'parent');
      if (parentError) console.error('Error fetching parents', parentError);
      else setParents(parentData || []);

      const { data: studentData, error: studentError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student');
      if (studentError) console.error('Error fetching students', studentError);
      else setStudents(studentData || []);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedParent) {
      const fetchLinkedStudents = async () => {
        const { data, error } = await supabase
          .from('parent_student_mapping')
          .select('student_id')
          .eq('parent_id', selectedParent);
        if (error) console.error('Error fetching linked students', error);
        else setLinkedStudents(data?.map(item => item.student_id) || []);
      };
      fetchLinkedStudents();
    }
  }, [selectedParent]);

  const fetchLinkedStudents = async () => {
    const { data, error } = await supabase
      .from('parent_student_mapping')
      .select('student_id')
      .eq('parent_id', selectedParent);
    if (error) console.error('Error fetching linked students', error);
    else setLinkedStudents(data?.map(item => item.student_id) || []);
  };

  useEffect(() => {
    if (selectedParent) {
      fetchLinkedStudents();
    }
  }, [selectedParent]);

  const handleLink = async (studentId: string) => {
    const { error } = await supabase.from('parent_student_mapping').insert({ parent_id: selectedParent, student_id: studentId });
    if (error) console.error('Error linking student', error);
    else fetchLinkedStudents(); // Re-fetch after successful link
  };

  const handleUnlink = async (studentId: string) => {
    const { error } = await supabase.from('parent_student_mapping').delete().match({ parent_id: selectedParent, student_id: studentId });
    if (error) console.error('Error unlinking student', error);
    else fetchLinkedStudents(); // Re-fetch after successful unlink
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border border-white/20 w-11/12 md:w-3/4 lg:w-1/2 backdrop-blur-lg bg-white/10 dark:bg-white/5 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Manage Parent-Student Links</h3>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Parent</label>
          <select onChange={(e) => setSelectedParent(e.target.value)} className="w-full p-2 border rounded">
            <option value="">-- Select a Parent --</option>
            {parents.map(parent => <option key={parent.id} value={parent.id}>{parent.name}</option>)}
          </select>
        </div>
        {selectedParent && (
          <div className="mt-4">
            <h4 className="text-md font-medium text-gray-900 dark:text-white">Link Students</h4>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <h5 className="text-sm font-medium text-gray-900 dark:text-white">Available Students</h5>
                <div className="border rounded p-2 h-64 overflow-y-auto">
                  {students.filter(s => !linkedStudents.includes(s.id)).map(student => (
                    <div key={student.id} className="flex justify-between items-center p-1">
                      <span>{student.name}</span>
                      <button onClick={() => handleLink(student.id)} className="text-blue-500">Link</button>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h5 className="text-sm font-medium text-gray-900 dark:text-white">Linked Students</h5>
                <div className="border rounded p-2 h-64 overflow-y-auto">
                  {students.filter(s => linkedStudents.includes(s.id)).map(student => (
                    <div key={student.id} className="flex justify-between items-center p-1">
                      <span>{student.name}</span>
                      <button onClick={() => handleUnlink(student.id)} className="text-red-500">Unlink</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="bg-gray-300 text-black p-2 rounded">Close</button>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;