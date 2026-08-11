import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { User, Mail, Phone, Key, AlertCircle, ArrowRight, Eye, EyeOff, GraduationCap, ChefHat, ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  const { register, isAuthenticated, user } = useAuth();
  const [signupType, setSignupType] = useState(null); // 'student', 'staff', null
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [cafeId, setCafeId] = useState('');

  const [cafes, setCafes] = useState([]);
  const [cafesLoading, setCafesLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  // If already logged in, redirect to appropriate page
  useEffect(() => {
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

  // Fetch active cafes when staff signup is selected
  useEffect(() => {
    if (signupType === 'staff') {
      const fetchCafes = async () => {
        setCafesLoading(true);
        setError('');
        try {
          const res = await API.get('/cafes');
          if (res.data.success) {
            setCafes(res.data.data);
            if (res.data.data.length > 0) {
              setCafeId(res.data.data[0]._id);
            }
          }
        } catch (err) {
          console.error('Error fetching cafes:', err);
          setError('Could not load cafés list. Please try again.');
        } finally {
          setCafesLoading(false);
        }
      };
      fetchCafes();
    }
  }, [signupType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Field validations
    if (!name || !email || !phone || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (signupType === 'staff' && !cafeId) {
      setError('Please select your café.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Email validation
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);

    let submitEmail = email;
    let submitRole = signupType === 'staff' ? 'cafe_staff' : 'student';
    let submitCafeId = signupType === 'staff' ? cafeId : null;

    const res = await register(name, submitEmail, phone, password, confirmPassword, submitRole, submitCafeId);
    setSubmitting(false);

    if (res.success) {
      if (submitRole === 'cafe_staff') {
        navigate('/staff');
      } else {
        navigate('/home');
      }
    } else {
      setError(res.message);
    }
  };

  const handleBackToRoles = () => {
    setSignupType(null);
    setError('');
    setName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setConfirmPassword('');
    setCafeId('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8">
      <div className={`w-full ${signupType === null ? 'max-w-2xl' : 'max-w-md'} bg-white rounded-3xl p-8 border border-stone-200/40 shadow-premium space-y-6 transition-all duration-300`}>
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-accent-orange/10 text-accent-orange rounded-2xl flex items-center justify-center font-bold text-xl mx-auto shadow-sm">
            CB
          </div>
          <h2 className="text-2xl font-extrabold text-stone-900 font-sans">
            {signupType === 'student' && 'Student Signup'}
            {signupType === 'staff' && 'Staff Signup'}
            {signupType === null && 'Create Account'}
          </h2>
          <p className="text-sm text-stone-500">
            {signupType === 'student' && 'Join Campus Bites for seamless food ordering.'}
            {signupType === 'staff' && 'Create your café kitchen manager account.'}
            {signupType === null && 'Choose your account type to get started.'}
          </p>
        </div>

        {/* Error alert */}
        {error && (
          <div className="bg-accent-red-light/35 border border-accent-red/20 rounded-2xl p-4 flex items-start space-x-3 text-accent-red text-sm animate-fade-in">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Role Selection View */}
        {signupType === null && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            {/* Student Card */}
            <button
              type="button"
              onClick={() => setSignupType('student')}
              className="flex flex-col items-center justify-center p-8 bg-stone-550/5 hover:bg-stone-50 hover:border-accent-orange border border-stone-200/80 rounded-3xl transition-all duration-300 group cursor-pointer hover:shadow-premium text-center space-y-4"
            >
              <div className="w-16 h-16 bg-accent-orange/10 text-accent-orange rounded-2xl flex items-center justify-center font-bold group-hover:scale-110 transition-transform duration-300">
                <GraduationCap className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900 group-hover:text-accent-orange transition-colors">
                  Sign up as Student
                </h3>
                <p className="text-xs text-stone-500 mt-1 max-w-[200px]">
                  Order meals, skip queues, and track your orders in real-time.
                </p>
              </div>
              <div className="inline-flex items-center text-xs font-bold text-accent-orange space-x-1">
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Staff Card */}
            <button
              type="button"
              onClick={() => setSignupType('staff')}
              className="flex flex-col items-center justify-center p-8 bg-stone-550/5 hover:bg-stone-50 hover:border-accent-orange border border-stone-200/80 rounded-3xl transition-all duration-300 group cursor-pointer hover:shadow-premium text-center space-y-4"
            >
              <div className="w-16 h-16 bg-accent-orange/10 text-accent-orange rounded-2xl flex items-center justify-center font-bold group-hover:scale-110 transition-transform duration-300">
                <ChefHat className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900 group-hover:text-accent-orange transition-colors">
                  Sign up as Staff
                </h3>
                <p className="text-xs text-stone-500 mt-1 max-w-[200px]">
                  Manage café menus, incoming orders, and kitchen queues.
                </p>
              </div>
              <div className="inline-flex items-center text-xs font-bold text-accent-orange space-x-1">
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        )}

        {/* Signup Forms */}
        {signupType !== null && (
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleBackToRoles}
              className="hover:text-stone-850 flex items-center font-bold text-stone-500 text-xs cursor-pointer mb-2 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              Change Role Selection
            </button>

            <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
              {/* Cafe Dropdown (Staff Only) */}
              {signupType === 'staff' && (
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-550 block">
                    Café Name
                  </label>
                  <select
                    value={cafeId}
                    onChange={(e) => setCafeId(e.target.value)}
                    className="w-full px-4 py-3.5 bg-stone-50 hover:bg-stone-100/50 focus:bg-white border border-stone-200 focus:border-stone-400 rounded-2xl text-stone-900 text-sm outline-none transition-all duration-200 font-medium cursor-pointer"
                  >
                    {cafesLoading ? (
                      <option value="">Loading cafés...</option>
                    ) : cafes.length === 0 ? (
                      <option value="">No cafés found</option>
                    ) : (
                      cafes.map((cafe) => (
                        <option key={cafe._id} value={cafe._id}>
                          {cafe.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              )}

              {/* Name Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-550 block">
                  {signupType === 'staff' ? 'Staff Name' : 'Full Name'}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-stone-400 font-bold">
                    <User className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    placeholder={signupType === 'staff' ? 'Enter staff name' : 'Enter your full name'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="off"
                    className="w-full pl-11 pr-4 py-3 bg-stone-50 hover:bg-stone-100/50 focus:bg-white border border-stone-200 focus:border-stone-400 rounded-2xl text-stone-900 placeholder-stone-400 text-sm outline-none transition-all duration-200 font-medium"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-550 block">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-stone-400 font-bold">
                    <Mail className="w-5 h-5" />
                  </span>
                  <input
                    type="email"
                    placeholder={signupType === 'staff' ? 'Enter staff email address' : 'Enter your email address'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="off"
                    className="w-full pl-11 pr-4 py-3 bg-stone-50 hover:bg-stone-100/50 focus:bg-white border border-stone-200 focus:border-stone-400 rounded-2xl text-stone-900 placeholder-stone-400 text-sm outline-none transition-all duration-200 font-medium"
                  />
                </div>
              </div>

              {/* Phone Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-550 block">
                  Phone Number
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-stone-400 font-bold">
                    <Phone className="w-5 h-5" />
                  </span>
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete="off"
                    className="w-full pl-11 pr-4 py-3 bg-stone-50 hover:bg-stone-100/50 focus:bg-white border border-stone-200 focus:border-stone-400 rounded-2xl text-stone-900 placeholder-stone-400 text-sm outline-none transition-all duration-200 font-medium"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-550 block">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-stone-400 pointer-events-none font-bold">
                    <Key className="w-5 h-5" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    className="w-full pl-11 pr-12 py-3 bg-stone-50 hover:bg-stone-100/50 focus:bg-white border border-stone-200 focus:border-stone-400 rounded-2xl text-stone-900 placeholder-stone-400 text-sm outline-none transition-all duration-200 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-550 block">
                  Confirm Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-stone-400 pointer-events-none font-bold">
                    <Key className="w-5 h-5" />
                  </span>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    className="w-full pl-11 pr-12 py-3 bg-stone-50 hover:bg-stone-100/50 focus:bg-white border border-stone-200 focus:border-stone-400 rounded-2xl text-stone-900 placeholder-stone-400 text-sm outline-none transition-all duration-200 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-stone-900 hover:bg-stone-850 text-white font-bold py-4 rounded-2xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm text-sm disabled:opacity-50 cursor-pointer"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign Up</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Footer links */}
        <div className="text-center pt-2 border-t border-stone-100 text-sm text-stone-500">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-accent-orange font-bold hover:underline cursor-pointer"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
