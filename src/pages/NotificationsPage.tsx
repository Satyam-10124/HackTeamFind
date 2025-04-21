import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Check, Clock, Calendar, Users, MessageSquare, User, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useDataStore } from '../store/dataStore';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { formatDistanceToNow } from 'date-fns';
import clsx from 'clsx';

const NotificationsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { notifications, fetchNotifications, markNotificationAsRead, loading } = useDataStore();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unread'>('all');
  
  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user, fetchNotifications]);
  
  const handleMarkAllAsRead = async () => {
    for (const notification of notifications.filter(n => !n.read)) {
      await markNotificationAsRead(notification.id);
    }
  };
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'teamRequest':
        return <Users className="h-5 w-5 text-blue-500 dark:text-blue-400" />;
      case 'teamJoined':
        return <Users className="h-5 w-5 text-green-500 dark:text-green-400" />;
      case 'message':
        return <MessageSquare className="h-5 w-5 text-purple-500 dark:text-purple-400" />;
      case 'hackathonReminder':
        return <Calendar className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />;
      case 'connectionRequest':
        return <User className="h-5 w-5 text-pink-500 dark:text-pink-400" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500 dark:text-gray-400" />;
    }
  };
  
  const filteredNotifications = notifications.filter(notification => {
    if (selectedFilter === 'all') return true;
    return !notification.read;
  });
  
  if (loading.notifications) {
    return <LoadingSpinner message="Loading notifications..." />;
  }
  
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
            <Bell className="h-5 w-5 mr-2 text-primary-500 dark:text-primary-400" />
            Notifications
          </h2>
          <div className="flex items-center space-x-2">
            <span className={clsx("text-sm px-3 py-1 rounded-full cursor-pointer transition-colors duration-200", 
              selectedFilter === 'all' 
                ? "bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            )} onClick={() => setSelectedFilter('all')}>
              All
            </span>
            <span className={clsx("text-sm px-3 py-1 rounded-full cursor-pointer transition-colors duration-200", 
              selectedFilter === 'unread' 
                ? "bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            )} onClick={() => setSelectedFilter('unread')}>
              Unread ({notifications.filter(n => !n.read).length})
            </span>
          </div>
        </div>
        
        {notifications.length > 0 && notifications.some(n => !n.read) && (
          <div className="p-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              You have {notifications.filter(n => !n.read).length} unread notifications
            </p>
            <button 
              onClick={handleMarkAllAsRead}
              className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 flex items-center"
            >
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Mark all as read
            </button>
          </div>
        )}
        
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
            <p>{selectedFilter === 'all' ? "No notifications yet." : "No unread notifications."}</p>
            {selectedFilter === 'unread' && (
              <button
                onClick={() => setSelectedFilter('all')}
                className="mt-2 text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
              >
                View all notifications
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredNotifications
              .map(notification => (
                <div
                  key={notification.id}
                  className={clsx("p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200", {
                    "bg-primary-50 dark:bg-primary-900/10": !notification.read
                  })}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <p className={clsx("text-sm", {
                          "font-medium text-gray-900 dark:text-white": !notification.read,
                          "text-gray-800 dark:text-gray-200": notification.read
                        })}>
                          {notification.message}
                        </p>
                        {!notification.read && (
                          <button
                            onClick={() => markNotificationAsRead(notification.id)}
                            className="ml-2 flex-shrink-0 bg-white dark:bg-gray-700 rounded-md text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <div className="mt-1 flex items-center">
                        <Clock className="h-3 w-3 text-gray-400 dark:text-gray-500 mr-1" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      {notification.type === 'teamRequest' && notification.relatedId && (
                        <div className="mt-2">
                          <Link
                            to={`/team-requests/${notification.relatedId}`}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-primary-700 dark:text-primary-300 bg-primary-100 dark:bg-primary-900/30 hover:bg-primary-200 dark:hover:bg-primary-800/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                          >
                            View Request
                          </Link>
                        </div>
                      )}
                      {notification.type === 'message' && notification.relatedId && (
                        <div className="mt-2">
                          <Link
                            to="/messages"
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-primary-700 dark:text-primary-300 bg-primary-100 dark:bg-primary-900/30 hover:bg-primary-200 dark:hover:bg-primary-800/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                          >
                            View Message
                          </Link>
                        </div>
                      )}
                      {notification.type === 'teamJoined' && notification.relatedId && (
                        <div className="mt-2">
                          <Link
                            to={`/teams/${notification.relatedId}`}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-primary-700 dark:text-primary-300 bg-primary-100 dark:bg-primary-900/30 hover:bg-primary-200 dark:hover:bg-primary-800/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                          >
                            View Team
                          </Link>
                        </div>
                      )}
                      {notification.type === 'hackathonReminder' && notification.relatedId && (
                        <div className="mt-2">
                          <Link
                            to={`/hackathons/${notification.relatedId}`}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-primary-700 dark:text-primary-300 bg-primary-100 dark:bg-primary-900/30 hover:bg-primary-200 dark:hover:bg-primary-800/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                          >
                            View Hackathon
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-center">
          <Link
            to="/dashboard"
            className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;