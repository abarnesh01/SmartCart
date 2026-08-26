import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/cart/CartItem';
import { formatCurrency } from '../utils/formatters';
import { ShoppingBag, ArrowRight, Trash2, ArrowLeft, ShieldCheck } from 'lucide-react';

const CartPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    itemCount,
    subtotal,
    discountTotal,
    shippingFee,
    estimatedTax,
    grandTotal,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Your Shopping Cart is Empty</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Explore our collection of interactive 3D products and add items to your cart.
        </p>
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg"
        >
          Browse Product Catalog <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-brand-500" /> Shopping Cart ({itemCount} items)
          </h1>
          <p className="text-xs text-slate-500">Review items before proceeding to checkout</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-rose-500 font-bold hover:underline flex items-center gap-1"
        >
          <Trash2 className="w-4 h-4" /> Empty Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Item List */}
        <div className="lg:col-span-8 space-y-4">
          {cartItems.map((item) => (
            <CartItem
              key={item.product._id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
            />
          ))}

          <div className="pt-4">
            <Link to="/catalog" className="text-xs font-bold text-brand-500 hover:underline flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Order Summary
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Items Subtotal</span>
              <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(subtotal)}</span>
            </div>

            {discountTotal > 0 && (
              <div className="flex justify-between text-emerald-500 font-bold">
                <span>Discount Savings</span>
                <span>-{formatCurrency(discountTotal)}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-500">
              <span>Estimated Shipping</span>
              <span>{shippingFee === 0 ? 'FREE' : formatCurrency(shippingFee)}</span>
            </div>

            <div className="flex justify-between text-slate-500">
              <span>Estimated Tax (8%)</span>
              <span>{formatCurrency(estimatedTax)}</span>
            </div>

            <div className="flex justify-between text-slate-900 dark:text-white font-bold text-base pt-3 border-t border-slate-100 dark:border-slate-800">
              <span>Total Price</span>
              <span className="text-brand-500 font-black">{formatCurrency(grandTotal)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-brand-600 to-blue-600 hover:from-brand-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-xl shadow-brand-500/20 flex items-center justify-center gap-2 transition-all hover:scale-105"
          >
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-[11px] text-slate-400 justify-center">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>256-bit Encrypted Mock Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
