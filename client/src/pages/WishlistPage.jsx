import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/product/ProductCard';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';

const WishlistPage = () => {
  const { wishlistItems, wishlistCount } = useWishlist();

  if (wishlistCount === 0) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
          <Heart className="w-10 h-10 text-rose-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Your Wishlist is Empty</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Save your favorite 3D products and items here to view or move to cart anytime.
        </p>
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg"
        >
          Explore Products <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Heart className="w-6 h-6 text-rose-500 fill-rose-500" /> My Saved Wishlist ({wishlistCount} items)
        </h1>
        <p className="text-xs text-slate-500">Easily move your saved products directly to shopping cart</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlistItems.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
