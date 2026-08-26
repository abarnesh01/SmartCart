import React from 'react';

export const ProductCardSkeleton = () => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 animate-pulse">
    <div className="w-full h-48 bg-slate-200 dark:bg-slate-800 rounded-xl mb-4" />
    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4 mb-2" />
    <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-3" />
    <div className="flex justify-between items-center mt-4">
      <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
      <div className="h-9 w-9 bg-slate-200 dark:bg-slate-800 rounded-lg" />
    </div>
  </div>
);

export const ProductDetailSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
    <div className="w-full h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
    <div className="space-y-4">
      <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
      <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/4 my-4" />
      <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded w-full" />
      <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl w-1/2 mt-6" />
    </div>
  </div>
);
