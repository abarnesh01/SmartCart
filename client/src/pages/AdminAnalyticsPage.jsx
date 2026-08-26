import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import StatCard from '../components/admin/StatCard';
import * as adminService from '../services/adminService';
import { BarChart3, Eye, Search, ShoppingBag, Heart, CheckCircle2, Sparkles, TrendingUp } from 'lucide-react';

const AdminAnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const data = await adminService.getAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error('[Admin Analytics Error]:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const overview = analytics?.overview || {};
  const metrics = analytics?.activityMetrics || {};
  const topSearchTerms = analytics?.topSearchTerms || [];

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" /> Academic Research & System Evaluation Panel
          </div>
          <h1 className="text-2xl font-black text-white">System Evaluation & CTR Analytics</h1>
          <p className="text-xs text-slate-400">
            Empirical telemetry tracking recommendation click-through rates, conversion funnels, and search interactions
          </p>
        </div>

        {/* Primary Research Evaluation KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Recommendation Click CTR"
            value={`${overview.recCTR || 0}%`}
            icon={Sparkles}
            trend="High Recommendation Conversion"
            color="emerald"
          />
          <StatCard
            title="Product View to Purchase Ratio"
            value={`${overview.conversionRate || 0}%`}
            icon={TrendingUp}
            color="blue"
          />
          <StatCard
            title="Total Product Views"
            value={metrics.views || 0}
            icon={Eye}
            color="purple"
          />
          <StatCard
            title="Total Searches Executed"
            value={metrics.searches || 0}
            icon={Search}
            color="amber"
          />
        </div>

        {/* Funnel & Conversion Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Telemetry Activity Counts Grid */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" /> Interaction Telemetry Breakdown
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/50 border border-slate-800">
                <span className="flex items-center gap-2 text-slate-300 font-bold">
                  <Eye className="w-4 h-4 text-sky-400" /> Product Detail Views
                </span>
                <span className="font-black text-white text-sm">{metrics.views || 0}</span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/50 border border-slate-800">
                <span className="flex items-center gap-2 text-slate-300 font-bold">
                  <Search className="w-4 h-4 text-amber-400" /> Search Queries Executed
                </span>
                <span className="font-black text-white text-sm">{metrics.searches || 0}</span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/50 border border-slate-800">
                <span className="flex items-center gap-2 text-slate-300 font-bold">
                  <ShoppingBag className="w-4 h-4 text-blue-400" /> Cart Additions
                </span>
                <span className="font-black text-white text-sm">{metrics.cartAdds || 0}</span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/50 border border-slate-800">
                <span className="flex items-center gap-2 text-slate-300 font-bold">
                  <Heart className="w-4 h-4 text-rose-400" /> Wishlist Additions
                </span>
                <span className="font-black text-white text-sm">{metrics.wishlistAdds || 0}</span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/50 border border-slate-800">
                <span className="flex items-center gap-2 text-slate-300 font-bold">
                  <Sparkles className="w-4 h-4 text-emerald-400" /> AI Recommendation Clicks
                </span>
                <span className="font-black text-emerald-400 text-sm">{metrics.recClicks || 0}</span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/50 border border-slate-800">
                <span className="flex items-center gap-2 text-slate-300 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Completed Orders / Purchases
                </span>
                <span className="font-black text-emerald-400 text-sm">{metrics.purchases || 0}</span>
              </div>
            </div>
          </div>

          {/* Popular Search Keywords */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-amber-400" /> Top Customer Search Queries
            </h3>

            {topSearchTerms.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-8">No search telemetry recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {topSearchTerms.map((st, i) => (
                  <div key={i} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800">
                    <span className="text-xs font-bold text-white">"{st.term}"</span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      {st.count} searches
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminAnalyticsPage;
