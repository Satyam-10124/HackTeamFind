import React from 'react';
import { Loader } from 'lucide-react';
import clsx from 'clsx';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md',
  message = 'Loading...',
  className,
  fullScreen = false,
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const messageClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };
  
  const containerClasses = clsx(
    'flex flex-col items-center justify-center',
    fullScreen ? 'fixed inset-0 bg-white/80 dark:bg-gray-900/80 z-50' : 'w-full h-60',
    className
  );
  
  return (
    <div className={containerClasses}>
      <Loader className={`${sizeClasses[size]} text-primary-500 dark:text-primary-400 animate-spin`} />
      {message && (
        <p className={`mt-4 text-gray-600 dark:text-gray-400 ${messageClasses[size]}`}>{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;