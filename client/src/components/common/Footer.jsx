import React from 'react';
import { Link } from 'react-router-dom';
import { Box, ShieldCheck, Truck, RefreshCw, Headphones, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Proposition Badges */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-slate-800">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/40 border border-slate-800">
            <div className="p-3 rounded-xl bg-brand-500/10 text-brand-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-200">Express Delivery</h4>
              <p className="text-xs text-slate-400">Free shipping on orders over $150</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/40 border border-slate-800">
            <div className="p-3 rounded-xl bg-brand-500/10 text-brand-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-200">Secure Payments</h4>
              <p className="text-xs text-slate-400">256-bit encrypted checkout</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/40 border border-slate-800">
            <div className="p-3 rounded-xl bg-brand-500/10 text-brand-400">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-200">30-Day Returns</h4>
              <p className="text-xs text-slate-400">Hassle-free money back guarantee</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/40 border border-slate-800">
            <div className="p-3 rounded-xl bg-brand-500/10 text-brand-400">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-200">24/7 VIP Support</h4>
              <p className="text-xs text-slate-400">Dedicated AI & human assistant</p>
            </div>
          </div>
        </div>

        {/* Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 py-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white">
                <Box className="w-5 h-5" />
              </div>
              <span className="text-lg font-black text-white">
                Smart<span className="text-brand-400">Cart</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              SmartCart revolutionizes online shopping through interactive 3D product previews, real-time spatial interaction, and personalized AI recommendation engines.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Categories</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/catalog?category=audio-acoustics" className="hover:text-brand-400 transition-colors">Audio & Acoustics</Link></li>
              <li><Link to="/catalog?category=smart-wearables" className="hover:text-brand-400 transition-colors">Smart Wearables</Link></li>
              <li><Link to="/catalog?category=smartphones-mobile" className="hover:text-brand-400 transition-colors">Smartphones</Link></li>
              <li><Link to="/catalog?category=gaming-computing" className="hover:text-brand-400 transition-colors">Gaming & Computing</Link></li>
              <li><Link to="/catalog?category=footwear-performance" className="hover:text-brand-400 transition-colors">Footwear & Apparel</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/catalog" className="hover:text-brand-400 transition-colors">All Products</Link></li>
              <li><Link to="/cart" className="hover:text-brand-400 transition-colors">Shopping Cart</Link></li>
              <li><Link to="/wishlist" className="hover:text-brand-400 transition-colors">My Wishlist</Link></li>
              <li><Link to="/orders" className="hover:text-brand-400 transition-colors">Track Orders</Link></li>
              <li><Link to="/profile" className="hover:text-brand-400 transition-colors">Account Profile</Link></li>
            </ul>
          </div>

          {/* Academic & Platform */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Platform Features</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 text-brand-400 font-semibold">
                <Box className="w-3.5 h-3.5" /> 3D WebGL Viewer
              </li>
              <li className="flex items-center gap-1.5 text-indigo-400 font-semibold">
                <Heart className="w-3.5 h-3.5" /> AI Recommendations
              </li>
              <li><span className="text-slate-500">MERN Stack Architecture</span></li>
              <li><span className="text-slate-500">JWT & Bcrypt Security</span></li>
              <li><span className="text-slate-500">Recharts Analytics</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 SmartCart Inc. Built with MERN Stack, React Three Fiber & Tailwind CSS.</p>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Research Documentation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
