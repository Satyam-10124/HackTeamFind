import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import LoadingSpinner from './LoadingSpinner';

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, redirectTo = '/login' }) => {
  const { user, loading, checkSession } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const init = async () => {
      setIsChecking(true);
      await checkSession();
      setIsChecking(false);
    };
    
    init();
  }, [checkSession]);
  
  useEffect(() => {
    if (!isChecking && !loading && !user) {
      navigate(redirectTo);
    }
  }, [user, loading, navigate, redirectTo, isChecking]);
  
  if (isChecking || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" message="Checking authentication..." />
      </div>
    );
  }
  
  if (!user) {
    return null;
  }
  
  return <>{children}</>;
};

export default AuthGuard;