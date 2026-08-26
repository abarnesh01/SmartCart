import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import StatCard from '../components/admin/StatCard';
import SalesChart from '../components/admin/SalesChart';
import * as adminService from '../services/adminService';
import { formatCurrency, formatDate } from '../utils/formatters';
import { DollarSign, ShoppingBag, Package, Users, Sparkles, ArrowRight } from 'lucide-react';

const AdminDashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const data = await adminService.getDashboardStats();
        setDashboardData(data);
      } catch (err) {
        console.error('[Admin Dashboard Error]:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const overview = dashboardData?.overview || {};
  const recentOrders = dashboardData?.recentOrders || [];
  const topProducts = dashboardData?.topProducts || [];

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white">Dashboard Overview</h1>
            <p className="text-xs text-slate-400">Real-time metrics, revenue breakdown, and order activity</p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value={formatCurrency(overview.totalRevenue || 0)}
            icon={DollarSign}
            trend="+18.4% this week"
            color="emerald"
          />
          <StatCard
            title="Total Orders"
            value={overview.totalOrders || 0}
            icon={ShoppingBag}
            trend="+12.5%"
            color="blue"
          />
          <StatCard
            title="Total Products"
            value={overview.totalProducts || 0}
            icon={Package}
            color="purple"
          />
          <StatCard
            title="Total Customers"
            value={overview.totalUsers || 0}
            icon={Users}
            color="amber"
          />
        </div>

        {/* Sales Chart Section */}
        <SalesChart salesData={dashboardData?.salesDaily || []} />

        {/* Recent Orders & Top Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Recent Orders</h3>
              <Link to="/admin/orders" className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-slate-400 uppercase text-[10px] bg-slate-800/50 rounded-xl">
                  <tr>
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Total</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {recentOrders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-slate-800/30">
                      <td className="p-3 font-bold text-white">#{ord._id.substring(ord._id.length - 6)}</td>
                      <td className="p-3 text-slate-300">{ord.user?.name || 'Guest'}</td>
                      <td className="p-3 font-bold text-emerald-400">{formatCurrency(ord.totalPrice)}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          {ord.orderStatus}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400">{formatDate(ord.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Selling Products */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">Top Performing Products</h3>
            <div className="space-y-3">
              {topProducts.map((prod) => (
                <div key={prod._id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/40 border border-slate-800">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={prod.images?.[0]} alt="" className="w-10 h-10 rounded-xl object-contain bg-slate-800 p-1" />
                    <div className="truncate">
                      <h4 className="text-xs font-bold text-white truncate">{prod.name}</h4>
                      <span className="text-[10px] text-slate-400">{prod.salesCount || 0} Sales</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">{formatCurrency(prod.price)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
