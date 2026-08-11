import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, LogOut, ShieldAlert, ArrowLeft, Edit3, Save, X, AlertCircle, CheckCircle } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Initialize edit fields when user profile loads
  useEffect(() => {
    if (user) {
      setEditName(user.name);
      setEditEmail(user.email);
      setEditPhone(user.phone);
    }
  }, [user]);

  const handleLogoutClick = () => {
    logout();
    navigate('/');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!editName || !editEmail || !editPhone) {
      setError('Please fill in all fields.');
      return;
    }

    // Basic email format check
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(editEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    const res = await updateProfile(editName, editEmail, editPhone);
    setSubmitting(false);

    if (res.success) {
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      // Auto clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(res.message);
    }
  };

  const handleCancel = () => {
    if (user) {
      setEditName(user.name);
      setEditEmail(user.email);
      setEditPhone(user.phone);
    }
    setError('');
    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <div className="max-w-xl mx-auto space-y-8 pb-16 pt-4">
      {/* Header */}
      <div className="flex items-center space-x-3 text-stone-500 text-sm">
        <button onClick={() => navigate(-1)} className="hover:text-stone-850 flex items-center font-bold cursor-pointer">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Go Back
        </button>
      </div>

      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold text-stone-900 font-sans">My Profile</h2>
          <p className="text-sm text-stone-500 mt-1">
            Manage your {user.role === 'cafe_staff' ? 'staff' : 'student'} credentials and logout.
          </p>
        </div>
        
        {/* Toggle Edit Button (shown when not editing) */}
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-white hover:bg-stone-50 text-stone-800 font-bold border border-stone-200/80 px-4 py-2.5 rounded-xl transition-all duration-200 text-xs flex items-center space-x-1.5 shadow-sm cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-accent-orange" />
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-accent-red-light/35 border border-accent-red/20 rounded-2xl p-4 flex items-start space-x-3 text-accent-red text-sm animate-fade-in">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-accent-green-light/35 border border-accent-green/20 rounded-2xl p-4 flex items-start space-x-3 text-accent-green text-sm animate-fade-in">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/40 shadow-premium space-y-6">
        {/* User Card Header */}
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-accent-orange text-white rounded-full flex items-center justify-center font-extrabold text-2xl shadow-md shadow-accent-orange/15 font-sans">
            {user.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
          </div>
          <div>
            <h3 className="text-xl font-bold text-stone-900 font-sans">{user.name}</h3>
            {user.role === 'cafe_staff' && (
              <p className="text-xs text-stone-500 font-medium mt-0.5">{user.email}</p>
            )}
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest bg-stone-100 px-2 py-0.5 rounded border border-stone-200/20 mt-0.5 inline-block">
              {user.role === 'cafe_staff' ? 'Cafe Staff' : user.role} Account
            </span>
          </div>
        </div>

        {isEditing ? (
          /* Profile Edit Form */
          <form onSubmit={handleSave} className="space-y-4 pt-6 border-t border-stone-100">
            <div className="space-y-1.5">
              <label className="text-stone-450 text-[10px] block font-bold uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-stone-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 hover:bg-stone-100/50 focus:bg-white border border-stone-250/70 focus:border-stone-400 rounded-2xl text-stone-900 text-sm outline-none font-medium transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-stone-450 text-[10px] block font-bold uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-stone-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="student@college.edu"
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 hover:bg-stone-100/50 focus:bg-white border border-stone-250/70 focus:border-stone-400 rounded-2xl text-stone-900 text-sm outline-none font-medium transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-stone-450 text-[10px] block font-bold uppercase tracking-wider">Phone Number</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-stone-400">
                  <Phone className="w-4 h-4" />
                </span>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 hover:bg-stone-100/50 focus:bg-white border border-stone-250/70 focus:border-stone-400 rounded-2xl text-stone-900 text-sm outline-none font-medium transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-stone-900 hover:bg-stone-850 text-white font-bold py-3.5 rounded-xl transition-all duration-200 text-xs flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold py-3.5 rounded-xl transition-all duration-200 text-xs flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        ) : (
          /* Profile Details View */
          <div className="space-y-4 pt-6 border-t border-stone-100 text-stone-700 animate-fade-in">
            <div className="flex items-center space-x-3.5">
              <User className="w-5 h-5 text-stone-400" />
              <div>
                <span className="text-stone-400 text-[10px] block font-bold uppercase tracking-wider">Full Name</span>
                <span className="text-sm font-bold text-stone-800">{user.name}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3.5">
              <Mail className="w-5 h-5 text-stone-400" />
              <div>
                <span className="text-stone-400 text-[10px] block font-bold uppercase tracking-wider">Email Address</span>
                <span className="text-sm font-semibold text-stone-800">{user.email}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3.5">
              <Phone className="w-5 h-5 text-stone-400" />
              <div>
                <span className="text-stone-400 text-[10px] block font-bold uppercase tracking-wider">Phone Number</span>
                <span className="text-sm font-semibold text-stone-800">{user.phone}</span>
              </div>
            </div>

            {user.role === 'cafe_staff' && user.cafeId && (
              <div className="flex items-center space-x-3.5">
                <ShieldAlert className="w-5 h-5 text-accent-orange" />
                <div>
                  <span className="text-stone-400 text-[10px] block font-bold uppercase tracking-wider">Assigned Café</span>
                  <span className="text-sm font-bold text-accent-orange">{user.cafeId.name}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        {!isEditing && (
          <button
            onClick={handleLogoutClick}
            className="w-full bg-accent-red hover:bg-accent-red-dark text-white font-bold py-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-md shadow-accent-red/10 text-sm mt-4 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </div>
  );
}
