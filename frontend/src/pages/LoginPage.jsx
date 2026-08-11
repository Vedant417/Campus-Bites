import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Key, Mail, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const { login, isAuthenticated, user } = useAuth();
  const [loginKey, setLoginKey] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // If already authenticated, redirect to appropriate role dashboard
  React.useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'cafe_staff') {
        navigate('/staff');
      } else if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    }
  }, [isAuthenticated, navigate, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!loginKey || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setError('');
    setSubmitting(true);

    const res = await login(loginKey, password);

    setSubmitting(false);
    if (res.success) {
      // If staff, go to kitchen dashboard, if admin, admin dashboard, else normal student role always to /home
      if (res.user.role === 'cafe_staff') {
        navigate('/staff');
      } else if (res.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-stone-200/40 shadow-premium space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-accent-orange/10 text-accent-orange rounded-2xl flex items-center justify-center font-bold text-xl mx-auto shadow-sm">
            CB
          </div>
          <h2 className="text-2xl font-extrabold text-stone-900 font-sans">Welcome Back</h2>
          <p className="text-sm text-stone-500">Sign in to order your favorite campus meals.</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-accent-red-light/35 border border-accent-red/20 rounded-2xl p-4 flex items-start space-x-3 text-accent-red text-sm animate-fade-in">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-550 block">
              Email Address or Phone
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-stone-400">
                <Mail className="w-5 h-5" />
              </span>
              <input
                type="text"
                placeholder="Enter your email or phone"
                value={loginKey}
                onChange={(e) => setLoginKey(e.target.value)}
                autoComplete="username"
                className="w-full pl-11 pr-4 py-3.5 bg-stone-50 hover:bg-stone-100/50 focus:bg-white border border-stone-200 focus:border-stone-400 rounded-2xl text-stone-900 placeholder-stone-400 text-sm outline-none transition-all duration-200 font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-550 block">
                Password
              </label>
            </div>
            <div className="relative">
              {/* Password Icon */}
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-stone-400 pointer-events-none">
                <Key className="w-5 h-5" />
              </span>

              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full pl-11 pr-12 py-3.5 bg-stone-50 hover:bg-stone-100/50 focus:bg-white border border-stone-200 focus:border-stone-400 rounded-2xl text-stone-900 placeholder-stone-400 text-sm outline-none transition-all duration-200 font-medium"
              />

              {/* Show / Hide Password */}
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-stone-900 hover:bg-stone-850 text-white font-bold py-4 rounded-2xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm text-sm disabled:opacity-50 cursor-pointer"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <LogIn className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer links */}
        <div className="text-center pt-2 border-t border-stone-100 text-sm text-stone-500">
          New to Campus Bites?{' '}
          <Link
            to="/register"
            className="text-accent-orange font-bold hover:underline inline-flex items-center space-x-0.5 cursor-pointer"
          >
            <span>Create Account</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Demo Accounts Panel
        <div className="bg-stone-50/80 rounded-2xl p-4 border border-stone-250/20 text-xs text-stone-600 space-y-1">
          <p className="font-bold text-stone-800 mb-1">Demo Credentials:</p>
          <div className="grid grid-cols-2 gap-1">
            <div><span className="font-semibold text-stone-700">Student:</span> student@bites.edu / student123</div>
            <div><span className="font-semibold text-stone-700">Mayuri - Special Block Staff:</span> mayuri@bites.edu / staff123</div>
            <div><span className="font-semibold text-stone-700">Bistro Staff:</span> bistro@bites.edu / staff123</div>
            <div><span className="font-semibold text-stone-700">Dakshin Staff:</span> dakshin@bites.edu / staff123</div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
