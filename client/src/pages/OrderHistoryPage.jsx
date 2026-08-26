import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as orderService from '../services/orderService';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Package, Clock, CheckCircle2, Truck, XCircle, ArrowRight } from 'lucide-react';

const statusBadgeStyles = {
  Pending: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
  Confirmed: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
  Packed: 'bg-purple-500/10 text-purple-500 border-purple-500/30',
  Shipped: 'bg-sky-500/10 text-sky-500 border-sky-500/30',
  Delivered: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
  Cancelled: 'bg-rose-500/10 text-rose-500 border-rose-500/30',
};

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await orderService.getMyOrders();
        setOrders(data || []);
      } catch (err) {
        console.error('[Order History Error]:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-xs text-slate-400">Loading order history...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">No Past Orders Found</h2>
        <p className="text-xs text-slate-500">You haven't placed any orders yet.</p>
        <Link to="/catalog" className="inline-block px-6 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-xs">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Package className="w-6 h-6 text-brand-500" /> Order History ({orders.length})
        </h1>
        <p className="text-xs text-slate-500">Track and view details of your previous purchases</p>
      </div>

      <div className="space-y-4">
        {orders.map((ord) => (
          <div
            key={ord._id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-brand-500/30 transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  Order #{ord._id.substring(ord._id.length - 8).toUpperCase()}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-[11px] font-bold border ${
                    statusBadgeStyles[ord.orderStatus] || statusBadgeStyles.Pending
                  }`}
                >
                  {ord.orderStatus}
                </span>
              </div>

              <span className="text-xs text-slate-400 block">
                Placed on {formatDate(ord.createdAt)} • {ord.orderItems?.length || 0} Items
              </span>

              {/* Item thumbnails */}
              <div className="flex items-center gap-2 pt-1">
                {ord.orderItems?.slice(0, 4).map((item, idx) => (
                  <img
                    key={idx}
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 rounded-lg object-contain bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200/60 dark:border-slate-700/60"
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 dark:border-slate-800">
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Total Amount</span>
                <span className="text-lg font-black text-slate-900 dark:text-white">
                  {formatCurrency(ord.totalPrice)}
                </span>
              </div>

              <Link
                to={`/orders/${ord._id}`}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-500 hover:text-white text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1"
              >
                View Details <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
