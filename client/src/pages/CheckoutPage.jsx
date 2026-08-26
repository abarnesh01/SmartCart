import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import * as orderService from '../services/orderService';
import { formatCurrency } from '../utils/formatters';
import { CreditCard, Truck, ShieldCheck, CheckCircle2, Lock, ArrowRight, Wallet } from 'lucide-react';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, subtotal, discountTotal, cartTotal, shippingFee, estimatedTax, grandTotal } = useCart();
  const { showToast } = useToast();

  const [shippingAddress, setShippingAddress] = useState({
    address: user?.shippingAddress?.address || '100 Tech Park Way, Suite 400',
    city: user?.shippingAddress?.city || 'San Francisco',
    postalCode: user?.shippingAddress?.postalCode || '94107',
    country: user?.shippingAddress?.country || 'United States',
  });

  const [paymentMethod, setPaymentMethod] = useState('Credit Card (Mock)');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Your Cart is Empty</h2>
        <button
          onClick={() => navigate('/catalog')}
          className="px-6 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-xs"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode) {
      showToast('Please complete all shipping address fields', 'error');
      return;
    }

    setIsProcessing(true);

    try {
      const orderItems = cartItems.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        image: item.product.images[0],
        price: item.product.price,
        quantity: item.quantity,
      }));

      const orderData = {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice: subtotal - discountTotal,
        taxPrice: estimatedTax,
        shippingPrice: shippingFee,
        totalPrice: grandTotal,
      };

      // Mock gateway delay for realistic experience
      setTimeout(async () => {
        try {
          const createdOrder = await orderService.createOrder(orderData);
          showToast('Order Placed Successfully!', 'success');
          navigate(`/orders/${createdOrder._id}`);
        } catch (err) {
          showToast(err.response?.data?.message || 'Failed to place order', 'error');
          setIsProcessing(false);
        }
      }, 1500);
    } catch (err) {
      showToast('Order processing error', 'error');
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Lock className="w-6 h-6 text-brand-500" /> Secure Checkout
        </h1>
        <p className="text-xs text-slate-500">Provide shipping address and select mock payment method</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Shipping & Payment Form */}
        <form onSubmit={handlePlaceOrder} className="lg:col-span-8 space-y-6">
          {/* Shipping Address */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Truck className="w-5 h-5 text-brand-500" /> Shipping Destination
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 100 Tech Park Way, Suite 400"
                  value={shippingAddress.address}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="San Francisco"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="94107"
                    value={shippingAddress.postalCode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Country *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="United States"
                    value={shippingAddress.country}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-brand-500" /> Payment Method Selection
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'Credit Card (Mock)', label: 'Credit / Debit Card', icon: CreditCard },
                { id: 'PayPal (Mock)', label: 'PayPal Instant', icon: Wallet },
                { id: 'COD (Mock)', label: 'Cash on Delivery', icon: ShieldCheck },
              ].map((pm) => (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() => setPaymentMethod(pm.id)}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all ${
                    paymentMethod === pm.id
                      ? 'bg-brand-500/10 border-brand-500 text-brand-500 shadow-md font-bold'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <pm.icon className="w-6 h-6" />
                  <span className="text-xs">{pm.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all hover:scale-105 disabled:opacity-50"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing Payment Gateway...
              </span>
            ) : (
              <>
                Confirm & Pay {formatCurrency(grandTotal)} <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Order Summary Breakdown */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Cart Items ({cartItems.length})
          </h3>

          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <div key={item.product._id} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <img
                    src={item.product.images[0]}
                    alt=""
                    className="w-8 h-8 rounded-lg object-contain bg-slate-100 dark:bg-slate-800 p-1"
                  />
                  <span className="truncate font-semibold text-slate-800 dark:text-slate-200">
                    {item.product.name}
                  </span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white shrink-0 ml-2">
                  {item.quantity} x {formatCurrency(item.product.price)}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-xs pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {discountTotal > 0 && (
              <div className="flex justify-between text-emerald-500">
                <span>Discounts</span>
                <span>-{formatCurrency(discountTotal)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-500">
              <span>Shipping</span>
              <span>{shippingFee === 0 ? 'FREE' : formatCurrency(shippingFee)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Tax (8%)</span>
              <span>{formatCurrency(estimatedTax)}</span>
            </div>
            <div className="flex justify-between text-slate-900 dark:text-white font-black text-base pt-2 border-t border-slate-100 dark:border-slate-800">
              <span>Total Amount</span>
              <span className="text-brand-500">{formatCurrency(grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
