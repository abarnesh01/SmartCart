import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import { User, Mail, MapPin, Lock, Save } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
    password: '',
    address: user?.shippingAddress?.address || '',
    city: user?.shippingAddress?.city || '',
    postalCode: user?.shippingAddress?.postalCode || '',
    country: user?.shippingAddress?.country || '',
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        name: formData.name,
        email: formData.email,
        avatar: formData.avatar,
        password: formData.password || undefined,
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
        },
      });
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <User className="w-6 h-6 text-brand-500" /> Account Profile
        </h1>
        <p className="text-xs text-slate-500">Manage personal details, avatar, and default shipping address</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-6">
        {/* Avatar preview */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <img
            src={formData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt="Avatar"
            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-brand-500/20"
          />
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">{user?.name}</h3>
            <span className="text-xs text-slate-400 font-semibold uppercase">{user?.role} Account</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Avatar Image URL</label>
          <input
            type="text"
            value={formData.avatar}
            onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            New Password (leave blank to keep current)
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
          />
        </div>

        {/* Shipping Address */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-brand-500" /> Default Shipping Address
          </h4>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Street Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Postal Code</label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Country</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Profile Changes'}
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
