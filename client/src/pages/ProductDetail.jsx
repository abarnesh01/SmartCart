import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import * as productService from '../services/productService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../components/common/Toast';
import Canvas3DViewer from '../components/3d/Canvas3DViewer';
import ReviewSection from '../components/product/ReviewSection';
import RecommendationSection from '../components/product/RecommendationSection';
import RatingStars from '../components/common/RatingStars';
import { ProductDetailSkeleton } from '../components/common/Skeleton';
import { formatCurrency, calculateDiscountPrice } from '../utils/formatters';
import {
  ShoppingBag,
  Heart,
  Box,
  ShieldCheck,
  Truck,
  RotateCcw,
  Minus,
  Plus,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('3d'); // '3d' | 'image'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await productService.getProductById(id);
        setProduct(data);
        if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0]);
        }

        const similar = await productService.getSimilarProducts(id);
        setSimilarProducts(similar || []);
      } catch (err) {
        console.error('[Product Detail Error]:', err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetail();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [id]);

  if (loading) return <ProductDetailSkeleton />;

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Product Not Found</h2>
        <Link to="/catalog" className="mt-4 inline-block text-brand-500 font-bold text-xs uppercase tracking-wider">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product._id);
  const discountedPrice = calculateDiscountPrice(product.price, product.discountPercentage);
  const hasDiscount = product.discountPercentage > 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    showToast(`Added ${quantity} x ${product.name} to cart!`, 'success');
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleWishlistToggle = async () => {
    const added = await toggleWishlist(product);
    showToast(added ? 'Added to wishlist' : 'Removed from wishlist', added ? 'success' : 'info');
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Top Product View Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: 3D Canvas / Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          {/* Tab Selector Toggle */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl w-fit">
            <button
              onClick={() => setActiveTab('3d')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === '3d'
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Box className="w-4 h-4" /> 3D Interactive Viewer
            </button>
            <button
              onClick={() => setActiveTab('image')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'image'
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Photo Gallery
            </button>
          </div>

          {/* Active View Container */}
          {activeTab === '3d' ? (
            <Canvas3DViewer model3DConfig={product.model3D} productName={product.name} />
          ) : (
            <div className="space-y-4">
              <div className="w-full h-[420px] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 flex items-center justify-center shadow-md">
                <img
                  src={selectedImage || product.images[0]}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain filter drop-shadow-xl"
                />
              </div>

              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex items-center gap-3">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(img)}
                      className={`w-20 h-20 rounded-2xl bg-white dark:bg-slate-900 border-2 p-2 overflow-hidden transition-all ${
                        selectedImage === img
                          ? 'border-brand-500 shadow-md scale-105'
                          : 'border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Product Overview & Actions */}
        <div className="lg:col-span-6 space-y-6">
          {/* Brand & Title */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
              <span className="text-brand-500 uppercase tracking-widest">{product.categoryName || 'Product'}</span>
              <span>{product.brand}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-3 mt-3">
              <RatingStars rating={product.averageRating || 4.8} numReviews={product.numReviews || 12} size="sm" />
              <span className="text-xs text-emerald-500 font-bold">Verified Guarantee</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  {formatCurrency(discountedPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-slate-400 line-through">
                    {formatCurrency(product.price)}
                  </span>
                )}
              </div>
              {hasDiscount && (
                <span className="text-xs font-bold text-rose-500">
                  Save {product.discountPercentage}% off retail price
                </span>
              )}
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                product.stock > 0
                  ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-500 border border-rose-500/30'
              }`}
            >
              {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Sold Out'}
            </span>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {product.description}
          </p>

          {/* Specifications Grid */}
          {product.specifications && product.specifications.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Technical Specifications
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {product.specifications.map((spec, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex justify-between">
                    <span className="text-slate-500">{spec.key}:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector & Action Buttons */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Quantity:</span>
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-sm font-bold px-3 text-slate-900 dark:text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                  className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all hover:scale-105 disabled:opacity-50"
              >
                Buy Now <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleWishlistToggle}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isWishlisted
                    ? 'bg-rose-500 text-white border-rose-500 shadow-md'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-500'
                }`}
                title={isWishlisted ? 'Remove Wishlist' : 'Add Wishlist'}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <ReviewSection productId={product._id} averageRating={product.averageRating} numReviews={product.numReviews} />

      {/* Similar Products Recommendation */}
      <RecommendationSection title="Similar Products You May Like" type="similar" products={similarProducts} />
    </div>
  );
};

export default ProductDetail;
