import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { Github, Loader, Check } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

interface SignUpFormProps {
  onSuccess?: () => void;
}

interface SignUpFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const { signup, loading, error, clearError } = useAuthStore();
  
  const { register, handleSubmit, watch, formState: { errors }, setFocus } = useForm<SignUpFormValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    }
  });
  
  // Set focus to name field on mount
  useEffect(() => {
    setFocus('name');
    return () => {
      clearError();
    };
  }, [setFocus, clearError]);
  
  const password = watch('password');
  
  const onSubmit = async (data: SignUpFormValues) => {
    const result = await signup(data.email, data.password, data.name);
    if (result.success) {
      toast.success('Account created successfully');
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/dashboard');
      }
    } else if (result.error) {
      toast.error(result.error);
    }
  };
  
  // Password strength validation
  const validatePasswordStrength = (value: string) => {
    if (value.length < 8) return "Password must be at least 8 characters";
    
    let strength = 0;
    if (/[a-z]/.test(value)) strength += 1;
    if (/[A-Z]/.test(value)) strength += 1;
    if (/[0-9]/.test(value)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(value)) strength += 1;
    
    if (strength < 3) return "Password must include at least 3 of: lowercase, uppercase, numbers, special characters";
    return true;
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
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Full Name
          </label>
          <div className="mt-1">
            <input
              id="name"
              type="text"
              autoComplete="name"
              className={`appearance-none block w-full px-3 py-2 border ${
                errors.name ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-700'
              } rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 
              focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 
              dark:bg-gray-800 dark:text-white sm:text-sm`}
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
            )}
          </div>
        </div>

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
              autoComplete="new-password"
              className={`appearance-none block w-full px-3 py-2 border ${
                errors.password ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-700'
              } rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 
              focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 
              dark:bg-gray-800 dark:text-white sm:text-sm`}
              {...register("password", { 
                required: "Password is required",
                validate: validatePasswordStrength
              })}
            />
            {errors.password && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Password should be at least 8 characters and include a mix of letters, numbers, and symbols.
          </p>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Confirm Password
          </label>
          <div className="mt-1">
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              className={`appearance-none block w-full px-3 py-2 border ${
                errors.confirmPassword ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-700'
              } rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 
              focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 
              dark:bg-gray-800 dark:text-white sm:text-sm`}
              {...register("confirmPassword", { 
                required: "Please confirm your password",
                validate: value => value === password || "Passwords do not match"
              })}
            />
            {errors.confirmPassword && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword.message}</p>
            )}
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
                Creating account...
              </>
            ) : (
              'Sign up'
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
            Sign up with GitHub
          </button>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300">
            Sign in instead
          </Link>
        </p>
      </div>
      
      <div className="mt-8">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">By signing up, you'll get:</h3>
        <ul className="space-y-2">
          <li className="flex items-start">
            <Check className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Access to a network of talented Web3 developers
            </span>
          </li>
          <li className="flex items-start">
            <Check className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Matching algorithm to find the perfect teammates
            </span>
          </li>
          <li className="flex items-start">
            <Check className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Updates on upcoming hackathons and events
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SignUpForm;