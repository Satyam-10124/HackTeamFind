import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { Github, Loader } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

interface LoginFormProps {
  onSuccess?: () => void;
}

interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const { login, loading, error, clearError } = useAuthStore();
  
  const { register, handleSubmit, formState: { errors }, setFocus } = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    }
  });
  
  // Set focus to email field on mount
  useEffect(() => {
    setFocus('email');
    return () => {
      clearError();
    };
  }, [setFocus, clearError]);
  
  const onSubmit = async (data: LoginFormValues) => {
    const result = await login(data.email, data.password);
    if (result.success) {
      toast.success('Successfully logged in');
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/dashboard');
      }
    } else if (result.error) {
      toast.error(result.error);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-md">
          {error}
        </div>
      )}
      
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email address
          </label>
          <div className="mt-1">
            <input
              id="email"
              type="email"
              autoComplete="email"
              className={`appearance-none block w-full px-3 py-2 border ${
                errors.email ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-700'
              } rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 
              focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 
              dark:bg-gray-800 dark:text-white sm:text-sm`}
              {...register("email", { 
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address"
                }
              })}
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <div className="mt-1">
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className={`appearance-none block w-full px-3 py-2 border ${
                errors.password ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-700'
              } rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 
              focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 
              dark:bg-gray-800 dark:text-white sm:text-sm`}
              {...register("password", { 
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters"
                }
              })}
            />
            {errors.password && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="rememberMe"
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-700 rounded dark:bg-gray-800"
              {...register("rememberMe")}
            />
            <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <Link to="/forgot-password" className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300">
              Forgot your password?
            </Link>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader className="animate-spin h-4 w-4 mr-2" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </div>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              Or continue with
            </span>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="button"
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <Github className="h-5 w-5 mr-2" />
            Sign in with GitHub
          </button>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;