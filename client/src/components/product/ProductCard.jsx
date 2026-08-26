import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Box, Star, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../common/Toast';
import { formatCurrency, calculateDiscountPrice } from '../../utils/formatters';
import RatingStars from '../common/RatingStars';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  if (!product) return null;

  const isWishlisted = isInWishlist(product._id);
  const discountedPrice = calculateDiscountPrice(product.price, product.discountPercentage);
  const hasDiscount = product.discountPercentage > 0;

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const added = await toggleWishlist(product);
    showToast(added ? 'Added to wishlist' : 'Removed from wishlist', added ? 'success' : 'info');
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    showToast(`Added ${product.name} to cart!`, 'success');
  };

  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm hover:shadow-xl hover:border-brand-500/30 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Badges */}
      <div className="absolute top-6 left-6 z-10 flex flex-col gap-1.5 items-start">
        {hasDiscount && (
          <span className="px-2.5 py-1 text-[11px] font-black tracking-wider uppercase text-white bg-gradient-to-r from-accent-600 to-rose-500 rounded-full shadow-md">
            -{product.discountPercentage}% OFF
          </span>
        )}
        {product.isFeatured && (
          <span className="px-2.5 py-1 text-[11px] font-bold text-amber-300 bg-slate-900/90 border border-amber-500/30 backdrop-blur-md rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" /> Featured
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleWishlistClick}
        className={`absolute top-6 right-6 z-10 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 ${
          isWishlisted
            ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 scale-110'
            : 'bg-white/80 dark:bg-slate-900/80 text-slate-400 hover:text-rose-500 hover:bg-white border border-slate-200/60 dark:border-slate-800'
        }`}
        title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
      </button>

      {/* Product Image & 3D Badge */}
      <Link to={`/product/${product._id}`} className="block relative mb-4 group-hover:scale-105 transition-transform duration-300">
        <div className="w-full h-52 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center p-4">
          <img
            src={product.images && product.images[0] ? product.images[0] : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'}
            alt={product.name}
            className="max-h-full max-w-full object-contain filter drop-shadow-md"
            loading="lazy"
          />
        </div>
        {/* 3D Indicator */}
        <div className="absolute bottom-2 right-2 bg-slate-950/80 backdrop-blur-md text-brand-400 px-2 py-1 rounded-md text-[10px] font-bold border border-brand-500/30 flex items-center gap-1 shadow-md">
          <Box className="w-3 h-3" /> 3D View
        </div>
      </Link>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider text-[10px] text-brand-500">
              {product.categoryName || product.category?.name || 'General'}
            </span>
            <span className="font-medium text-slate-500">{product.brand}</span>
          </div>

          <Link to={`/product/${product._id}`} className="block">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-brand-500 dark:hover:text-brand-400 transition-colors line-clamp-2 mb-2">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="mb-3">
            <RatingStars rating={product.averageRating || 4.5} numReviews={product.numReviews || 12} size="xs" />
          </div>
        </div>

        {/* Pricing & Cart Action */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-slate-900 dark:text-white">
                {formatCurrency(discountedPrice)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-slate-400 line-through">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>
            <span className={`text-[10px] font-semibold ${product.stock > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="p-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 active:scale-95 text-white shadow-md shadow-brand-500/20 disabled:opacity-50 disabled:pointer-events-none transition-all"
            title="Add to Cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
