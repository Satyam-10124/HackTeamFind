import React from 'react';
import { Link } from 'react-router-dom';
import { User, Settings, Key, Bell, Shield, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import AuthGuard from '../components/ui/AuthGuard';
import ProfileForm from '../components/profile/ProfileForm';
import toast from 'react-hot-toast';

const ProfileSettingsPage: React.FC = () => {
  const { logout } = useAuthStore();
  
  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Successfully logged out');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };
  
  return (
    <AuthGuard>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
          <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
            <nav className="space-y-1">
              <Link
                to="/profile/settings"
                className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 hover:bg-gray-50 dark:hover:bg-gray-800 group rounded-md px-3 py-2 flex items-center text-sm font-medium transition-colors duration-200 bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 dark:border-primary-400"
              >
                <User className="text-primary-500 dark:text-primary-400 group-hover:text-primary-600 dark:group-hover:text-primary-300 flex-shrink-0 -ml-1 mr-3 h-5 w-5" />
                <span className="truncate">Profile</span>
              </Link>
              
              <Link
                to="/profile/account"
                className="text-gray-900 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800 group rounded-md px-3 py-2 flex items-center text-sm font-medium transition-colors duration-200"
              >
                <Key className="text-gray-400 dark:text-gray-500 group-hover:text-primary-500 dark:group-hover:text-primary-400 flex-shrink-0 -ml-1 mr-3 h-5 w-5" />
                <span className="truncate">Account</span>
              </Link>
              
              <Link
                to="/profile/notifications"
                className="text-gray-900 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800 group rounded-md px-3 py-2 flex items-center text-sm font-medium transition-colors duration-200"
              >
                <Bell className="text-gray-400 dark:text-gray-500 group-hover:text-primary-500 dark:group-hover:text-primary-400 flex-shrink-0 -ml-1 mr-3 h-5 w-5" />
                <span className="truncate">Notifications</span>
              </Link>
              
              <Link
                to="/profile/privacy"
                className="text-gray-900 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800 group rounded-md px-3 py-2 flex items-center text-sm font-medium transition-colors duration-200"
              >
                <Shield className="text-gray-400 dark:text-gray-500 group-hover:text-primary-500 dark:group-hover:text-primary-400 flex-shrink-0 -ml-1 mr-3 h-5 w-5" />
                <span className="truncate">Privacy</span>
              </Link>
              
              <button
                onClick={handleLogout}
                className="w-full text-left text-gray-900 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800 group rounded-md px-3 py-2 flex items-center text-sm font-medium transition-colors duration-200"
              >
                <LogOut className="text-gray-400 dark:text-gray-500 group-hover:text-primary-500 dark:group-hover:text-primary-400 flex-shrink-0 -ml-1 mr-3 h-5 w-5" />
                <span className="truncate">Sign out</span>
              </button>
            </nav>
          </aside>
          
          <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="bg-white dark:bg-gray-800 py-6 px-4 space-y-6 sm:p-6">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    Profile Information
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Update your personal information and how others will see you on the platform.
                  </p>
                </div>
                
                <ProfileForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default ProfileSettingsPage;