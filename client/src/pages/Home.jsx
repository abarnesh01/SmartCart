import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as productService from '../services/productService';
import ProductGrid from '../components/product/ProductGrid';
import RecommendationSection from '../components/product/RecommendationSection';
import Canvas3DViewer from '../components/3d/Canvas3DViewer';
import { ArrowRight, Box, Sparkles, ShieldCheck, Zap, Award, Flame, ChevronRight } from 'lucide-react';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [cats, feat, trend] = await Promise.all([
          productService.getCategories(),
          productService.getFeaturedProducts(),
          productService.getTrendingProducts(),
        ]);
        setCategories(cats || []);
        setFeaturedProducts(feat || []);
        setTrendingProducts(trend || []);
      } catch (err) {
        console.error('[Home Data Error]:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const hero3DConfig = {
    type: 'headphones',
    color: '#0f172a',
    accentColor: '#38bdf8',
    scale: 1.2,
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pb-16 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 rounded-3xl border border-slate-800 text-white shadow-2xl">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold tracking-wider text-slate-200">Next-Generation Shopping Experience</span>
            </div>

            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black tracking-tight text-white leading-tight">
              Experience Products in <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-blue-400 to-accent-400">Interactive 3D</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
              Rotate, zoom, and inspect spatial 3D models before you buy. Powered by real-time WebGL rendering and personalized AI recommendation engines.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/catalog"
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-blue-600 hover:from-brand-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-xl shadow-brand-500/20 flex items-center gap-2 transition-all hover:scale-105"
              >
                Explore 3D Catalog <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/catalog?category=audio-acoustics"
                className="px-6 py-3.5 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider border border-slate-700 transition-all"
              >
                View Audio Gear
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 text-xs">
              <div>
                <span className="text-xl font-black text-white block">30+</span>
                <span className="text-slate-400">Seeded Products</span>
              </div>
              <div>
                <span className="text-xl font-black text-brand-400 block">3D WebGL</span>
                <span className="text-slate-400">Real-Time Viewer</span>
              </div>
              <div>
                <span className="text-xl font-black text-emerald-400 block">AI Engine</span>
                <span className="text-slate-400">Smart Matching</span>
              </div>
            </div>
          </div>

          {/* Right Hero 3D Interactive Canvas */}
          <div className="lg:col-span-6">
            <Canvas3DViewer model3DConfig={hero3DConfig} productName="Apex ANC Headphones" />
          </div>
        </div>
      </section>

      {/* Featured Categories Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-6 h-6 text-brand-500" /> Shop by Category
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Browse curated technology and lifestyle collections</p>
          </div>
          <Link to="/catalog" className="text-xs font-bold text-brand-500 hover:underline flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/catalog?category=${cat.slug || cat.name}`}
              className="group relative rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 flex flex-col items-center text-center shadow-sm hover:shadow-xl hover:border-brand-500/40 transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 p-2 mb-3 group-hover:scale-110 transition-transform">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover rounded-xl" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors line-clamp-1">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-500" /> Featured Products
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Hand-picked premium electronics with interactive 3D models</p>
          </div>
        </div>

        <ProductGrid products={featuredProducts} loading={loading} />
      </section>

      {/* Personalized AI Recommendations Section */}
      <RecommendationSection title="Recommended for You" type="personalized" />

      {/* Special Promotional Banner */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-brand-900 via-blue-900 to-indigo-950 text-white p-8 sm:p-12 shadow-2xl border border-brand-800/50">
        <div className="max-w-xl space-y-4 relative z-10">
          <span className="px-3 py-1 text-[11px] font-black uppercase tracking-wider text-amber-300 bg-amber-500/20 border border-amber-500/30 rounded-full inline-block">
            Limited Time Offer
          </span>
          <h2 className="text-3xl font-black tracking-tight">Upgrade Your Workspace with Ergonomic 3D Gear</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Get up to 20% discount on mesh executive chairs, standing desks, and ambient smart lighting.
          </p>
          <Link
            to="/catalog?category=smart-home-living"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-slate-100 shadow-lg transition-transform hover:scale-105"
          >
            Claim Offer Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Trending Products Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Flame className="w-6 h-6 text-rose-500" /> Trending Now
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Top-selling electronics and wearables this week</p>
          </div>
        </div>

        <ProductGrid products={trendingProducts} loading={loading} />
      </section>
    </div>
  );
};

export default Home;
