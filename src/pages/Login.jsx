import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Lock, Mail, LogIn } from 'lucide-react';
import ThemeToggle from '../components/ui/ThemeToggle';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { login, loading, error: authError } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            await login(data.email, data.password);
            navigate('/');
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-dark-bg text-text-light' : 'bg-light-bg text-gray-800'} transition-colors duration-200`}>
            <div className={`max-w-md w-full space-y-8 p-8 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-dark-card border border-dark-border' : 'bg-light-card border border-light-border'}`}>
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-text-light' : 'text-gray-800'}`}>Welcome Back</h2>
                        <p className={`${theme === 'dark' ? 'text-text-muted' : 'text-gray-500'}`}>Sign in to continue your fitness journey</p>
                    </div>
                    <ThemeToggle />
                </div>
                
                {authError && (
                    <div className="p-3 rounded-md bg-red-100 border border-red-300 text-red-600">
                        {authError}
                    </div>
                )}
                
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label htmlFor="email" className={`block text-sm font-medium ${theme === 'dark' ? 'text-text-light' : 'text-gray-700'}`}>
                            Email
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail size={18} className={`${theme === 'dark' ? 'text-text-muted' : 'text-gray-400'}`} />
                            </div>
                            <input
                                type="email"
                                {...register('email', { required: 'Email is required' })}
                                className={`block w-full pl-10 pr-3 py-2 rounded-md focus:ring-2 focus:outline-none focus:ring-opacity-50 ${theme === 'dark' 
                                    ? 'bg-dark-darker border-dark-border text-text-light focus:ring-blue-500' 
                                    : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
                                placeholder="you@example.com"
                            />
                        </div>
                        {errors.email && <span className="text-red-500 text-sm mt-1">{errors.email.message}</span>}
                    </div>
                    
                    <div>
                        <label htmlFor="password" className={`block text-sm font-medium ${theme === 'dark' ? 'text-text-light' : 'text-gray-700'}`}>
                            Password
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock size={18} className={`${theme === 'dark' ? 'text-text-muted' : 'text-gray-400'}`} />
                            </div>
                            <input
                                type="password"
                                {...register('password', { required: 'Password is required' })}
                                className={`block w-full pl-10 pr-3 py-2 rounded-md focus:ring-2 focus:outline-none focus:ring-opacity-50 ${theme === 'dark' 
                                    ? 'bg-dark-darker border-dark-border text-text-light focus:ring-blue-500' 
                                    : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
                                placeholder="••••••••"
                            />
                        </div>
                        {errors.password && <span className="text-red-500 text-sm mt-1">{errors.password.message}</span>}
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className={`h-4 w-4 rounded focus:ring-blue-500 ${theme === 'dark' ? 'bg-dark-darker border-dark-border' : 'border-gray-300'}`}
                            />
                            <label htmlFor="remember-me" className={`ml-2 block text-sm ${theme === 'dark' ? 'text-text-muted' : 'text-gray-500'}`}>
                                Remember me
                            </label>
                        </div>
                        <div className="text-sm">
                            <a href="#" className={`font-medium ${theme === 'dark' ? 'text-text-link hover:text-blue-400' : 'text-blue-600 hover:text-blue-800'}`}>
                                Forgot password?
                            </a>
                        </div>
                    </div>
                    
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing in...
                            </>
                        ) : (
                            <>
                                <LogIn size={18} />
                                Sign in
                            </>
                        )}
                    </button>
                </form>
                
                <div className="text-center pt-2">
                    <Link to="/register" className={`text-sm font-medium ${theme === 'dark' ? 'text-text-link hover:text-blue-400' : 'text-blue-600 hover:text-blue-800'} transition-colors`}>
                        Don't have an account? Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;