import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, AlertCircle, Info, Clock, Trash2 } from 'lucide-react';
import { User } from '../types';
import { supabase } from '../lib/supabaseClient';

export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  userId: string;
  actionUrl?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  expiresAt?: Date;
}

interface AnnouncementData {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  expires_at?: string;
  created_at: string;
  created_by: string;
  announcement_reads?: { user_id: string; read_at: string }[];
}

interface NotificationPanelProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ user, isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch announcements from database
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        
        // user.id is already the profile ID from the profiles table
        const profileId = user.id;
        const userRole = user.role;

        if (!profileId) {
          console.error('No profile ID found');
          setLoading(false);
          return;
        }

        // Fetch announcements targeted to user's role or specifically to the user
        const { data: announcements, error } = await supabase
          .from('announcements')
          .select(`
            id,
            title,
            message,
            type,
            priority,
            expires_at,
            created_at,
            created_by,
            target_roles,
            target_users,
            announcement_reads (
              user_id,
              read_at
            )
          `)
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching announcements:', error);
          setLoading(false);
          return;
        }

        // Filter announcements on the client side since RLS is disabled
        const filteredAnnouncements = (announcements || []).filter(announcement => {
          // Check if user's role is in target_roles
          const roleMatch = announcement.target_roles && announcement.target_roles.includes(userRole);
          // Check if user is specifically targeted
          const userMatch = announcement.target_users && announcement.target_users.includes(profileId);
          // Include if either condition is true, or if no targeting is specified
          return roleMatch || userMatch || 
                 (!announcement.target_roles?.length && !announcement.target_users?.length);
        });

        // Convert announcements to notifications format
        const notificationData: Notification[] = filteredAnnouncements.map((announcement: any) => {
          const isRead = announcement.announcement_reads?.some(
            (read: any) => read.user_id === profileId
          ) || false;

          return {
            id: announcement.id,
            type: announcement.type,
            title: announcement.title,
            message: announcement.message,
            timestamp: new Date(announcement.created_at),
            read: isRead,
            userId: profileId,
            priority: announcement.priority,
            expiresAt: announcement.expires_at ? new Date(announcement.expires_at) : undefined,
          };
        });

        setNotifications(notificationData);
      } catch (error) {
        console.error('Error in fetchAnnouncements:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && user.id) {
      fetchAnnouncements();
    }
  }, [user.id, isOpen]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = async (id: string) => {
    try {
      // user.id is already the profile ID
      const profileId = user.id;

      if (!profileId) {
        console.error('No profile ID found in markAsRead');
        return;
      }

      // Insert read record
      const { error } = await supabase
        .from('announcement_reads')
        .insert({
          announcement_id: id,
          user_id: profileId
        });

      if (error && error.code !== '23505') { // Ignore duplicate key error
        console.error('Error marking as read:', error);
        return;
      }

      // Update local state
      setNotifications(prev => prev.map(n => 
        n.id === id ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error('Error in markAsRead:', error);
    }
  };

  const markAsUnread = async (id: string) => {
    try {
      // user.id is already the profile ID
      const profileId = user.id;

      if (!profileId) {
        console.error('No profile ID found in markAsUnread');
        return;
      }

      // Delete read record
      const { error } = await supabase
        .from('announcement_reads')
        .delete()
        .eq('announcement_id', id)
        .eq('user_id', profileId);

      if (error) {
        console.error('Error marking as unread:', error);
        return;
      }

      // Update local state
      setNotifications(prev => prev.map(n => 
        n.id === id ? { ...n, read: false } : n
      ));
    } catch (error) {
      console.error('Error in markAsUnread:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    // For announcements, we don't actually delete them, just mark as read and hide locally
    await markAsRead(id);
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAllAsRead = async () => {
    try {
      // user.id is already the profile ID
      const profileId = user.id;

      if (!profileId) {
        console.error('No profile ID found in markAllAsRead');
        return;
      }

      // Mark all unread notifications as read
      const unreadNotifications = notifications.filter(n => !n.read);
      const readRecords = unreadNotifications.map(n => ({
        announcement_id: n.id,
        user_id: profileId
      }));

      if (readRecords.length > 0) {
        const { error } = await supabase
          .from('announcement_reads')
          .insert(readRecords);

        if (error) {
          console.error('Error marking all as read:', error);
          return;
        }

        // Update local state
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      }
    } catch (error) {
      console.error('Error in markAllAsRead:', error);
    }
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getNotificationBg = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'info':
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Notification Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-96 bg-white dark:bg-gray-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Bell className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Notifications
            </h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Buttons */}
        {notifications.length > 0 && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={markAllAsRead}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              disabled={unreadCount === 0}
            >
              Mark all as read
            </button>
            <button
              onClick={clearAll}
              className="text-sm text-red-600 dark:text-red-400 hover:underline"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-sm">Loading announcements...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
              <Bell className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">No announcements</p>
              <p className="text-sm">You're all caught up!</p>
            </div>
          ) : (
            <div className="space-y-1 p-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`relative p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                    notification.read 
                      ? 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 opacity-75' 
                      : getNotificationBg(notification.type)
                  }`}
                >
                  {/* Unread indicator */}
                  {!notification.read && (
                    <div className="absolute left-2 top-4 w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {notification.title}
                          </h4>
                          {notification.priority && notification.priority !== 'normal' && (
                            <span className={`inline-flex px-2 py-0.5 text-xs font-bold rounded-full ${
                              notification.priority === 'urgent' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                              notification.priority === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                              'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                            }`}>
                              {notification.priority}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-1 ml-2">
                          <button
                            onClick={() => notification.read ? markAsUnread(notification.id) : markAsRead(notification.id)}
                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded transition-colors"
                            title={notification.read ? 'Mark as unread' : 'Mark as read'}
                          >
                            {notification.read ? (
                              <Bell className="w-4 h-4" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
                            title="Delete notification"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTime(notification.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// Notification Bell Button Component
interface NotificationBellProps {
  user: User;
  className?: string;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ user, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        // user.id is already the profile ID
        const profileId = user.id;
        const userRole = user.role;

        if (!profileId) {
          console.error('No profile ID found in NotificationBell');
          return;
        }
        
        // Get announcements for this user
        const { data: announcements } = await supabase
          .from('announcements')
          .select(`
            id,
            announcement_reads!left (
              user_id
            )
          `)
          .or(`target_roles.cs.{${userRole}},target_users.cs.{${profileId}}`)
          .eq('is_active', true);

        if (announcements) {
          // Count unread announcements (those without a read record for this user)
          const unread = announcements.filter(announcement => 
            !announcement.announcement_reads?.some((read: any) => read.user_id === profileId)
          ).length;
          
          setUnreadCount(unread);
        }
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    };

    fetchUnreadCount();
    
    // Refresh count every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    
    return () => clearInterval(interval);
  }, [user.id]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`relative p-2 rounded-full text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${className}`}
        title="View notifications"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <NotificationPanel
        user={user}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};
