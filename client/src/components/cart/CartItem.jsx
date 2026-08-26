import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { formatCurrency, calculateDiscountPrice } from '../../utils/formatters';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  if (!item || !item.product) return null;

  const { product, quantity } = item;
  const discountedPrice = calculateDiscountPrice(product.price, product.discountPercentage);

  return (
    <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 items-center justify-between">
      {/* Product Image */}
      <Link to={`/product/${product._id}`} className="w-16 h-16 rounded-xl bg-white dark:bg-slate-800 p-2 shrink-0 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center">
        <img
          src={product.images && product.images[0] ? product.images[0] : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'}
          alt={product.name}
          className="max-h-full max-w-full object-contain"
        />
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <Link to={`/product/${product._id}`} className="block">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate hover:text-brand-500 transition-colors">
            {product.name}
          </h4>
        </Link>
        <span className="text-[11px] text-slate-400 block mb-1">
          {product.brand}
        </span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            {formatCurrency(discountedPrice)}
          </span>
          {product.discountPercentage > 0 && (
            <span className="text-[11px] text-slate-400 line-through">
              {formatCurrency(product.price)}
            </span>
          )}
        </div>
      </div>

      {/* Quantity & Delete Controls */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        <button
          onClick={() => onRemove && onRemove(product._id)}
          className="p-1 text-slate-400 hover:text-rose-500 rounded-md transition-colors"
          title="Remove item"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-1">
          <button
            onClick={() => onUpdateQuantity && onUpdateQuantity(product._id, quantity - 1)}
            className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="text-xs font-bold text-slate-900 dark:text-white px-1.5 min-w-[20px] text-center">
            {quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity && onUpdateQuantity(product._id, quantity + 1)}
            className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
