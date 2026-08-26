import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="max-w-xl mx-auto py-24 px-4 text-center space-y-6">
      <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-brand-400 shadow-xl">
        <Box className="w-10 h-10" />
      </div>
      <h1 className="text-4xl font-black text-slate-900 dark:text-white">404 - Page Not Found</h1>
      <p className="text-xs text-slate-500 max-w-sm mx-auto">
        The page or 3D product view you are looking for does not exist or has been relocated.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg"
      >
        <Home className="w-4 h-4" /> Back to Storefront
      </Link>
    </div>
  );
};

export default NotFoundPage;
