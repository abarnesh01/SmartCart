import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as productService from '../services/productService';
import ProductGrid from '../components/product/ProductGrid';
import ProductFilter from '../components/product/ProductFilter';
import { Search, SlidersHorizontal, Package } from 'lucide-react';

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [pages, setPages] = useState(1);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Active Filter States
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || 'all';
  const brand = searchParams.get('brand') || 'all';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const minRating = Number(searchParams.get('rating')) || 0;
  const sortBy = searchParams.get('sortBy') || 'newest';

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [catList, brandList] = await Promise.all([
          productService.getCategories(),
          productService.getBrands(),
        ]);
        setCategories(catList || []);
        setBrands(brandList || []);
      } catch (err) {
        console.error('[Catalog Metadata Error]:', err.message);
      }
    };
    fetchMetadata();
  }, []);

  useEffect(() => {
    const fetchCatalogProducts = async () => {
      setLoading(true);
      try {
        const params = {
          search,
          category,
          brand,
          minPrice,
          maxPrice,
          rating: minRating || undefined,
          sortBy,
          page,
          limit: 12,
        };

        const res = await productService.getProducts(params);
        setProducts(res.products || []);
        setPages(res.pages || 1);
        setTotalProducts(res.totalProducts || 0);
      } catch (err) {
        console.error('[Catalog Fetch Error]:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalogProducts();
  }, [searchParams, page]);

  const updateFilters = (key, value) => {
    const newParams = new URLSearchParams(searchParams);

    if (value && value !== 'all' && value !== 0 && value !== '') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }

    newParams.set('page', '1');
    setPage(1);
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearchParams({});
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 rounded-3xl p-8 border border-slate-800 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
            <Package className="w-7 h-7 text-brand-400" /> Product Catalog
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse {totalProducts} products with 3D model previews, filters, and instant sorting.
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setShowMobileFilter(!showMobileFilter)}
          className="lg:hidden px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold flex items-center gap-2"
        >
          <SlidersHorizontal className="w-4 h-4 text-brand-400" /> Filter & Sort
        </button>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <div className={`lg:block ${showMobileFilter ? 'block' : 'hidden'}`}>
          <ProductFilter
            categories={categories}
            brands={brands}
            selectedCategory={category}
            selectedBrand={brand}
            minPrice={minPrice}
            maxPrice={maxPrice}
            minRating={minRating}
            sortBy={sortBy}
            onFilterChange={updateFilters}
            onResetFilters={handleResetFilters}
          />
        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-3">
          <ProductGrid
            products={products}
            loading={loading}
            page={page}
            pages={pages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Catalog;
