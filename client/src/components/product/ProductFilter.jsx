import React from 'react';
import { Filter, RotateCcw, Star, DollarSign, Tag, Award } from 'lucide-react';

const ProductFilter = ({
  categories = [],
  brands = [],
  selectedCategory = 'all',
  selectedBrand = 'all',
  minPrice = '',
  maxPrice = '',
  minRating = 0,
  sortBy = 'newest',
  onFilterChange,
  onResetFilters,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
          <Filter className="w-5 h-5 text-brand-500" />
          <span>Filters</span>
        </div>
        <button
          onClick={onResetFilters}
          className="text-xs font-semibold text-slate-400 hover:text-brand-500 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Clear All
        </button>
      </div>

      {/* Sort By */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Award className="w-4 h-4 text-brand-500" /> Sort By
        </label>
        <select
          value={sortBy}
          onChange={(e) => onFilterChange('sortBy', e.target.value)}
          className="w-full py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-500/40"
        >
          <option value="newest">Newest Arrivals</option>
          <option value="popular">Most Popular</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

      {/* Categories */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Tag className="w-4 h-4 text-brand-500" /> Category
        </label>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          <button
            onClick={() => onFilterChange('category', 'all')}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
              selectedCategory === 'all'
                ? 'bg-brand-500 text-white font-bold shadow-md shadow-brand-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>All Categories</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => onFilterChange('category', cat.slug || cat.name)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                selectedCategory === cat.slug || selectedCategory === cat.name
                  ? 'bg-brand-500 text-white font-bold shadow-md shadow-brand-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <DollarSign className="w-4 h-4 text-brand-500" /> Price Range ($)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => onFilterChange('minPrice', e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => onFilterChange('maxPrice', e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Brands */}
      {brands.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Brand
          </label>
          <select
            value={selectedBrand}
            onChange={(e) => onFilterChange('brand', e.target.value)}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200"
          >
            <option value="all">All Brands</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Rating Filter */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> Minimum Rating
        </label>
        <div className="space-y-1">
          {[4, 3, 2].map((stars) => (
            <button
              key={stars}
              onClick={() => onFilterChange('rating', minRating === stars ? 0 : stars)}
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs transition-colors ${
                minRating === stars
                  ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-1">
                {Array.from({ length: stars }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
                <span className="ml-1 font-semibold">& Up</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;
