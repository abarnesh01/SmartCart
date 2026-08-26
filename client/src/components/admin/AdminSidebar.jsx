import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  MessageSquare,
  BarChart3,
  Box,
  ArrowLeft,
} from 'lucide-react';

const AdminSidebar = () => {
  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard, end: true },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Users', path: '/admin/users', icon: Users },
    { label: 'Reviews', path: '/admin/reviews', icon: MessageSquare },
    { label: 'Evaluation Analytics', path: '/admin/analytics', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between min-h-screen text-slate-300">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-black text-white block">SmartCart</span>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Admin Control</span>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Return to Store button */}
      <div className="p-4 border-t border-slate-800">
        <NavLink
          to="/"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Storefront
        </NavLink>
      </div>
    </aside>
  );
};

export default AdminSidebar;
