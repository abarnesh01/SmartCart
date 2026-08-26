import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import CartItem from './CartItem';
import { formatCurrency } from '../../utils/formatters';
import { X, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';

const CartDrawer = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    itemCount,
    subtotal,
    discountTotal,
    cartTotal,
    shippingFee,
    grandTotal,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Your Shopping Cart ({itemCount})
              </h3>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-3 py-16">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 text-slate-400" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Your cart is empty</h4>
                <p className="text-xs text-slate-500 max-w-xs">
                  Discover interactive 3D models and add products to your cart.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between pb-2">
                  <span className="text-xs text-slate-500 font-medium">Cart Items</span>
                  <button
                    onClick={clearCart}
                    className="text-[11px] text-rose-500 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Clear Cart
                  </button>
                </div>
                {cartItems.map((item) => (
                  <CartItem
                    key={item.product._id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                  />
                ))}
              </>
            )}
          </div>

          {/* Footer Totals & Checkout Button */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(subtotal)}</span>
                </div>
                {discountTotal > 0 && (
                  <div className="flex justify-between text-emerald-500 font-semibold">
                    <span>Discount Savings</span>
                    <span>-{formatCurrency(discountTotal)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>Estimated Shipping</span>
                  <span>{shippingFee === 0 ? 'FREE' : formatCurrency(shippingFee)}</span>
                </div>
                <div className="flex justify-between text-slate-900 dark:text-white font-bold text-sm pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span>Total</span>
                  <span className="text-brand-500 font-black">{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckoutClick}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-blue-600 hover:from-brand-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
