import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Menu, X, Search, User, Calendar, LogIn, 
  Bell, MessageSquare, Plus, Globe, Users, LogOut 
} from 'lucide-react';
import { useAppStore } from '../store';
import ThemeToggle from './ThemeToggle';
import { useAuthStore } from '../store/authStore';
import { useDataStore } from '../store/dataStore';
import toast from 'react-hot-toast';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const { darkMode } = useAppStore();
  const { user, logout } = useAuthStore();
  const { notifications, markNotificationAsRead, teamRequests } = useDataStore();
  
  const unreadNotifications = notifications.filter(n => !n.read);
  const pendingRequests = teamRequests.filter(request => 
    request.receiverId === user?.id && request.status === 'pending'
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowNotifications(false);
      setShowUserMenu(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Successfully logged out');
      navigate('/');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Calendar className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              <span className="ml-2 text-xl font-bold text-primary-800 dark:text-primary-300">HackTeamFinder</span>
            </Link>
            
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/hackathons"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-gray-200 border-b-2 border-transparent hover:border-primary-500 transition-colors duration-200"
              >
                <Calendar className="h-4 w-4 mr-1" />
                Hackathons
              </Link>
              <Link
                to="/search"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-gray-200 border-b-2 border-transparent hover:border-primary-500 transition-colors duration-200"
              >
                <Search className="h-4 w-4 mr-1" />
                Find Teammates
              </Link>
              <Link
                to="/teams"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-gray-200 border-b-2 border-transparent hover:border-primary-500 transition-colors duration-200"
              >
                <Users className="h-4 w-4 mr-1" />
                Teams
              </Link>
              <Link
                to="/global"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-gray-200 border-b-2 border-transparent hover:border-primary-500 transition-colors duration-200"
              >
                <Globe className="h-4 w-4 mr-1" />
                Community
              </Link>
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            <ThemeToggle />
            
            {user ? (
              <>
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowNotifications(!showNotifications);
                    }}
                    className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 relative"
                  >
                    <span className="sr-only">View notifications</span>
                    <Bell className="h-6 w-6" />
                    {unreadNotifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-accent-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                        {unreadNotifications.length}
                      </span>
                    )}
                  </button>
                  
                  {showNotifications && (
                    <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                      <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="notifications-menu">
                        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-200">Notifications</h3>
                        </div>
                        
                        {unreadNotifications.length === 0 ? (
                          <div className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                            No new notifications
                          </div>
                        ) : (
                          unreadNotifications.map(notification => (
                            <div 
                              key={notification.id}
                              className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700"
                              onClick={() => markNotificationAsRead(notification.id)}
                            >
                              <p className="text-sm text-gray-800 dark:text-gray-200">{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(notification.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </p>
                            </div>
                          ))
                        )}
                        
                        <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                          <Link
                            to="/notifications"
                            className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
                            onClick={() => setShowNotifications(false)}
                          >
                            View all notifications
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <Link
                  to="/messages"
                  className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 relative"
                >
                  <span className="sr-only">Messages</span>
                  <MessageSquare className="h-6 w-6" />
                </Link>
                
                <div className="relative ml-3">
                  <div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowUserMenu(!showUserMenu);
                      }}
                      className="bg-white dark:bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <span className="sr-only">Open user menu</span>
                      <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-600 dark:text-primary-400">
                        {user.user_metadata?.name ? user.user_metadata.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                      </div>
                    </button>
                  </div>
                  
                  {showUserMenu && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                      <div className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                        <div className="font-medium">{user.user_metadata?.name || 'User'}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</div>
                      </div>
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/profile/settings"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Settings
                      </Link>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          handleLogout();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <div className="flex items-center">
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign out
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex space-x-2">
                <Link
                  to="/login"
                  className="inline-flex items-center px-3 py-2 border border-primary-500 text-sm font-medium rounded-md text-primary-700 dark:text-primary-400 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
          
          <div className="flex items-center sm:hidden">
            <ThemeToggle />
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center ml-2 p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 transition-colors duration-200">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/hackathons"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-primary-500 transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Hackathons
              </div>
            </Link>
            <Link
              to="/search"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-primary-500 transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Find Teammates
              </div>
            </Link>
            <Link
              to="/teams"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-primary-500 transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Teams
              </div>
            </Link>
            <Link
              to="/global"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-primary-500 transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Community
              </div>
            </Link>
            
            {user ? (
              <>
                <Link
                  to="/notifications"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-primary-500 transition-colors duration-200 relative"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    Notifications
                    {unreadNotifications.length > 0 && (
                      <span className="ml-2 bg-accent-600 text-white rounded-full px-2 py-0.5 text-xs">
                        {unreadNotifications.length}
                      </span>
                    )}
                  </div>
                </Link>
                <Link
                  to="/messages"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-primary-500 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Messages
                  </div>
                </Link>
                <Link
                  to="/dashboard"
                  className="block pl-3 pr-4 py-2 border-l-4 border-primary-500 text-base font-medium text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-gray-800 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Dashboard
                  </div>
                </Link>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-primary-500 transition-colors duration-200"
                >
                  <div className="flex items-center">
                    <LogOut className="h-5 w-5 mr-2" />
                    Sign out
                  </div>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-primary-500 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <LogIn className="h-5 w-5 mr-2" />
                    Log in
                  </div>
                </Link>
                <Link
                  to="/signup"
                  className="block pl-3 pr-4 py-2 border-l-4 border-primary-500 text-base font-medium text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-gray-800 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <Plus className="h-5 w-5 mr-2" />
                    Sign up
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;