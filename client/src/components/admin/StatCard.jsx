import React from 'react';

const StatCard = ({ title, value, icon: Icon, trend, color = 'emerald' }) => {
  const colorMap = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</span>
        <div className={`p-2.5 rounded-xl border ${colorMap[color] || colorMap.emerald}`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>

      <div className="flex items-baseline justify-between">
        <span className="text-2xl font-black text-white">{value}</span>
        {trend && (
          <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5">
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
