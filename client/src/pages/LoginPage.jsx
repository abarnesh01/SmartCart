import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import { Lock, Mail, ArrowRight, Shield, UserCheck, Sparkles, Box } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(email, password);
      showToast(`Welcome back, ${data.name}!`, 'success');
      if (data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Invalid email or password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setLoading(true);
    try {
      const data = await login(demoEmail, demoPassword);
      showToast(`Logged in as ${data.role.toUpperCase()}: ${data.name}`, 'success');
      if (data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Demo login failed', 'error');
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
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Sign In to SmartCart</h1>
        <p className="text-xs text-slate-500">Access your saved 3D items, cart, and personalized recommendations</p>
      </div>

      {/* Demo Credentials Quick Login Bar */}
      <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/30 text-xs space-y-2">
        <span className="font-bold text-brand-400 flex items-center gap-1.5 uppercase tracking-wider">
          <Sparkles className="w-4 h-4" /> Quick Demo One-Click Login
        </span>
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => handleDemoLogin('user@smartcart.com', 'User@123456')}
            className="px-3 py-2 rounded-xl bg-brand-500 text-white font-bold hover:bg-brand-600 transition-colors flex items-center justify-center gap-1 text-[11px]"
          >
            <UserCheck className="w-3.5 h-3.5" /> Customer Account
          </button>
          <button
            type="button"
            onClick={() => handleDemoLogin('admin@smartcart.com', 'Admin@123456')}
            className="px-3 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-colors flex items-center justify-center gap-1 text-[11px]"
          >
            <Shield className="w-3.5 h-3.5" /> Admin Account
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
          <div className="relative">
            <input
              type="email"
              required
              placeholder="user@smartcart.com"
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

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
        </button>

        <div className="text-center pt-2">
          <span className="text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-brand-500 hover:underline">
              Create Account
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
