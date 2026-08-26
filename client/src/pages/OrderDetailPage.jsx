import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as orderService from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Package, Clock, CheckCircle2, Truck, AlertCircle, ArrowLeft, Ban } from 'lucide-react';

const orderSteps = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered'];

const OrderDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const data = await orderService.getOrderById(id);
      setOrder(data);
    } catch (err) {
      console.error('[Fetch Order Error]:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  const handleCancelOrder = async () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await orderService.updateOrderStatus(id, 'Cancelled');
        showToast('Order cancelled', 'info');
        fetchOrder();
      } catch (err) {
        showToast(err.response?.data?.message || 'Failed to cancel order', 'error');
      }
    }
  };

  if (loading) return <div className="text-center py-20 text-xs text-slate-400">Loading order details...</div>;

  if (!order) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Order Not Found</h2>
        <Link to="/orders" className="mt-4 inline-block text-brand-500 font-bold text-xs">
          Back to Orders
        </Link>
      </div>
    );
  }

  const currentStepIndex = orderSteps.indexOf(order.orderStatus);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <Link to="/orders" className="text-xs font-bold text-brand-500 hover:underline flex items-center gap-1 mb-2">
            <ArrowLeft className="w-4 h-4" /> Back to My Orders
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Order #{order._id.toUpperCase()}
          </h1>
          <p className="text-xs text-slate-500">Placed on {formatDate(order.createdAt)}</p>
        </div>

        {order.orderStatus !== 'Cancelled' && order.orderStatus !== 'Delivered' && (
          <button
            onClick={handleCancelOrder}
            className="px-4 py-2 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-500/30 font-bold text-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <Ban className="w-4 h-4" /> Cancel Order
          </button>
        )}
      </div>

      {/* Lifecycle Progress Bar */}
      {order.orderStatus !== 'Cancelled' ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Order Status Timeline</h3>
          <div className="grid grid-cols-5 gap-2 text-center">
            {orderSteps.map((step, idx) => {
              const isCompleted = idx <= currentStepIndex;
              return (
                <div key={step} className="flex flex-col items-center space-y-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      isCompleted
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <span className={`text-[11px] font-bold ${isCompleted ? 'text-emerald-500' : 'text-slate-400'}`}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-5 h-5" /> This order was cancelled.
        </div>
      )}

      {/* Grid: Shipping & Financial Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Ordered Items */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
            Purchased Products ({order.orderItems?.length || 0})
          </h3>

          <div className="space-y-3">
            {order.orderItems?.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-contain bg-white dark:bg-slate-800 p-1" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{item.name}</h4>
                    <span className="text-[11px] text-slate-400">Qty: {item.quantity}</span>
                  </div>
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address & Price Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-brand-500" /> Shipping Destination
            </h4>
            <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
              <p className="font-bold text-slate-900 dark:text-white">{order.user?.name}</p>
              <p>{order.shippingAddress?.address}</p>
              <p>
                {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}
              </p>
              <p>{order.shippingAddress?.country}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3 text-xs">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800">
              Price Summary
            </h4>
            <div className="flex justify-between text-slate-500">
              <span>Items Total</span>
              <span>{formatCurrency(order.itemsPrice)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Shipping Fee</span>
              <span>{formatCurrency(order.shippingPrice)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Tax Amount</span>
              <span>{formatCurrency(order.taxPrice)}</span>
            </div>
            <div className="flex justify-between text-slate-900 dark:text-white font-black text-sm pt-2 border-t border-slate-100 dark:border-slate-800">
              <span>Grand Total</span>
              <span className="text-brand-500">{formatCurrency(order.totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
