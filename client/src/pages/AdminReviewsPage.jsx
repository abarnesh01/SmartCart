import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import * as adminService from '../services/adminService';
import * as reviewService from '../services/reviewService';
import RatingStars from '../components/common/RatingStars';
import { useToast } from '../components/common/Toast';
import { formatDate } from '../utils/formatters';
import { MessageSquare, Trash2 } from 'lucide-react';

const AdminReviewsPage = () => {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllReviews();
      setReviews(data || []);
    } catch (err) {
      console.error('[Admin Reviews Error]:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDeleteReview = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer review?')) {
      try {
        await reviewService.deleteReview(id);
        showToast('Review deleted by admin', 'info');
        fetchReviews();
      } catch (err) {
        showToast(err.response?.data?.message || 'Delete failed', 'error');
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        <div>
          <h1 className="text-2xl font-black text-white">Review Moderation Panel</h1>
          <p className="text-xs text-slate-400">Monitor and delete inappropriate customer product reviews</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-400 uppercase text-[10px] bg-slate-800/60 rounded-xl">
              <tr>
                <th className="p-3">Product</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Rating</th>
                <th className="p-3">Headline & Review</th>
                <th className="p-3">Date</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {reviews.map((rev) => (
                <tr key={rev._id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-white max-w-xs truncate">
                    {rev.product?.name || 'Deleted Product'}
                  </td>
                  <td className="p-3 text-slate-300">{rev.user?.name || rev.userName}</td>
                  <td className="p-3">
                    <RatingStars rating={rev.rating} size="xs" />
                  </td>
                  <td className="p-3 max-w-md">
                    {rev.title && <span className="font-bold text-white block mb-0.5">{rev.title}</span>}
                    <p className="text-slate-400 line-clamp-2">{rev.comment}</p>
                  </td>
                  <td className="p-3 text-slate-400">{formatDate(rev.createdAt)}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDeleteReview(rev._id)}
                      className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
                      title="Delete Review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminReviewsPage;
