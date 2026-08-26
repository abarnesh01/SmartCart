import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import * as recommendationService from '../../services/recommendationService';
import { Sparkles, Eye, Compass, ThumbsUp } from 'lucide-react';

const RecommendationSection = ({ title, type = 'personalized', productId, products = [] }) => {
  const [items, setItems] = useState(products);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (products && products.length > 0) {
      setItems(products);
      return;
    }

    const fetchRecs = async () => {
      setLoading(true);
      try {
        if (type === 'personalized') {
          const res = await recommendationService.getRecommendations();
          setItems(res.recommendedForYou || []);
        } else if (type === 'recentlyViewed') {
          const res = await recommendationService.getRecommendations();
          setItems(res.recentlyViewed || []);
        }
      } catch (err) {
        console.error('[Recommendation Fetch Error]:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecs();
  }, [type, productId, products]);

  if (!loading && (!items || items.length === 0)) return null;

  const sectionIcons = {
    personalized: <Sparkles className="w-5 h-5 text-brand-500" />,
    recentlyViewed: <Eye className="w-5 h-5 text-indigo-500" />,
    similar: <Compass className="w-5 h-5 text-emerald-500" />,
    youMayLike: <ThumbsUp className="w-5 h-5 text-amber-500" />,
  };

  return (
    <section className="space-y-6 my-12">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
            {sectionIcons[type] || <Sparkles className="w-5 h-5 text-brand-500" />}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {title || (type === 'personalized' ? 'Recommended for You' : 'Recently Viewed')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personalized based on your browsing history & product affinity
            </p>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((prod) => (
          <ProductCard key={prod._id} product={prod} />
        ))}
      </div>
    </section>
  );
};

export default RecommendationSection;
