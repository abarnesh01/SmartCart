import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import * as adminService from '../services/adminService';
import * as orderService from '../services/orderService';
import { useToast } from '../components/common/Toast';
import { formatCurrency, formatDate } from '../utils/formatters';
import { ShoppingBag, Search } from 'lucide-react';

const AdminOrdersPage = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllOrders();
      setOrders(data || []);
    } catch (err) {
      console.error('[Admin Orders Error]:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      showToast(`Order status updated to ${newStatus}`, 'success');
      fetchOrders();
    } catch (err) {
      showToast(err.response?.data?.message || 'Status update failed', 'error');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        <div>
          <h1 className="text-2xl font-black text-white">Order Management</h1>
          <p className="text-xs text-slate-400">Track and update lifecycle statuses for all customer orders</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-400 uppercase text-[10px] bg-slate-800/60 rounded-xl">
              <tr>
                <th className="p-3">Order ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Items</th>
                <th className="p-3">Total Amount</th>
                <th className="p-3">Current Status</th>
                <th className="p-3">Date Placed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {orders.map((ord) => (
                <tr key={ord._id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-white">#{ord._id.substring(ord._id.length - 8).toUpperCase()}</td>
                  <td className="p-3 text-slate-300">
                    <span className="block font-bold">{ord.user?.name || 'Guest User'}</span>
                    <span className="text-[10px] text-slate-400">{ord.user?.email}</span>
                  </td>
                  <td className="p-3 text-slate-300">{ord.orderItems?.length || 0} Items</td>
                  <td className="p-3 font-bold text-emerald-400">{formatCurrency(ord.totalPrice)}</td>
                  <td className="p-3">
                    <select
                      value={ord.orderStatus}
                      onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Packed">Packed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-3 text-slate-400">{formatDate(ord.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminOrdersPage;
