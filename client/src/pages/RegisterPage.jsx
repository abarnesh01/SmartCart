import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import { Lock, Mail, User, ArrowRight, Box } from 'lucide-react';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    setLoading(true);
    try {
      const data = await register(name, email, password, role);
      showToast('Account registered successfully!', 'success');
      if (data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-accent-500 p-0.5 mx-auto shadow-xl">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <Box className="w-6 h-6 text-brand-400" />
          </div>
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Create SmartCart Account</h1>
        <p className="text-xs text-slate-500">Sign up to save wishlists, manage orders, and get AI recommendations</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
          <div className="relative">
            <input
              type="text"
              required
              placeholder="Sarah Connor"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
            />
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
          <div className="relative">
            <input
              type="email"
              required
              placeholder="sarah@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
            />
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Password</label>
          <div className="relative">
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
            />
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Account Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
          >
            <option value="user">Customer Account</option>
            <option value="admin">Administrator Account</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          {loading ? 'Creating Account...' : 'Register Account'} <ArrowRight className="w-4 h-4" />
        </button>

        <div className="text-center pt-2">
          <span className="text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-brand-500 hover:underline">
              Sign In
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
