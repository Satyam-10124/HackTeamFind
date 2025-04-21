import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingSpinner from './components/ui/LoadingSpinner';
import { useAppStore } from './store';
import { useAuthStore } from './store/authStore';
import { useDataStore } from './store/dataStore';

// Lazy-loaded components
const LandingPage = lazy(() => import('./pages/LandingPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const HackathonsPage = lazy(() => import('./pages/HackathonsPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const SignUpPage = lazy(() => import('./pages/SignUpPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const TeamsPage = lazy(() => import('./pages/TeamsPage'));
const MessagesPage = lazy(() => import('./pages/MessagesPage'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));
const ProfileSettingsPage = lazy(() => import('./pages/ProfileSettingsPage'));
import AuthGuard from './components/ui/AuthGuard';

function App() {
  const { toggleDarkMode } = useAppStore();
  const { checkSession } = useAuthStore();
  const { fetchHackathons, fetchUsers } = useDataStore();
  
  useEffect(() => {
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedDarkMode || prefersDarkMode) {
      toggleDarkMode();
    }
    
    // Check user auth session
    checkSession();
    
    // Load initial data
    fetchHackathons();
    fetchUsers();
  }, [toggleDarkMode, checkSession, fetchHackathons, fetchUsers]);
  
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Navbar />
        <main className="flex-grow">
          <Suspense fallback={<LoadingSpinner size="lg" />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/profile/:id" element={<ProfilePage />} />
              <Route path="/hackathons" element={<HackathonsPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={
                <AuthGuard>
                  <DashboardPage />
                </AuthGuard>
              } />
              <Route path="/teams" element={<TeamsPage />} />
              <Route path="/messages" element={
                <AuthGuard>
                  <MessagesPage />
                </AuthGuard>
              } />
              <Route path="/notifications" element={
                <AuthGuard>
                  <NotificationsPage />
                </AuthGuard>
              } />
              <Route path="/profile/settings" element={
                <AuthGuard>
                  <ProfileSettingsPage />
                </AuthGuard>
              } />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#333',
              color: '#fff',
              borderRadius: '0.375rem',
              padding: '1rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            },
            success: {
              style: {
                background: '#10b981',
                borderLeft: '4px solid #059669',
              },
              iconTheme: {
                primary: 'white',
                secondary: '#059669',
              },
            },
            error: {
              style: {
                background: '#ef4444',
                borderLeft: '4px solid #b91c1c',
              },
              iconTheme: {
                primary: 'white',
                secondary: '#b91c1c',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;