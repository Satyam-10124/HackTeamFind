import React from 'react';
import { Loader } from 'lucide-react';
import clsx from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  leadingIcon,
  trailingIcon,
  className,
  disabled,
  ...props
}) => {
  const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white border-transparent focus:ring-primary-500',
    secondary: 'bg-primary-100 hover:bg-primary-200 dark:bg-primary-900/30 dark:hover:bg-primary-900/50 text-primary-700 dark:text-primary-300 border-transparent focus:ring-primary-500',
    outline: 'bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 focus:ring-primary-500',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border-transparent focus:ring-primary-500',
    danger: 'bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white border-transparent focus:ring-red-500',
  };

  const sizeClasses: Record<ButtonSize, string> = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const baseClasses = 'inline-flex justify-center items-center border rounded-md shadow-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200';
  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = (disabled || loading) ? 'opacity-60 cursor-not-allowed' : '';

  return (
    <button
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        widthClass,
        disabledClass,
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
          {children}
        </>
      ) : (
        <>
          {leadingIcon && <span className="mr-2">{leadingIcon}</span>}
          {children}
          {trailingIcon && <span className="ml-2">{trailingIcon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;