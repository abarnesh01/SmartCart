import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';
import * as reviewService from '../../services/reviewService';
import RatingStars from '../common/RatingStars';
import { formatDate } from '../../utils/formatters';
import { MessageSquare, Star, Plus, Trash2, Edit3, X, User } from 'lucide-react';

const ReviewSection = ({ productId, averageRating = 0, numReviews = 0 }) => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [reviews, setReviews] = useState([]);
  const [distribution, setDistribution] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
  const [loading, setLoading] = useState(true);

  // Form State
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    try {
      const data = await reviewService.getProductReviews(productId);
      setReviews(data.reviews || []);
      if (data.ratingDistribution) {
        setDistribution(data.ratingDistribution);
      }
    } catch (err) {
      console.error('[Fetch Reviews Error]:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      showToast('Please enter a review comment', 'error');
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        await reviewService.updateReview(editingId, { rating, title, comment });
        showToast('Review updated successfully!', 'success');
      } else {
        await reviewService.createReview({ productId, rating, title, comment });
        showToast('Review submitted successfully!', 'success');
      }
      setShowModal(false);
      resetForm();
      fetchReviews();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit review', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await reviewService.deleteReview(id);
        showToast('Review deleted', 'info');
        fetchReviews();
      } catch (err) {
        showToast(err.response?.data?.message || 'Failed to delete review', 'error');
      }
    }
  };

  const handleEdit = (rev) => {
    setEditingId(rev._id);
    setRating(rev.rating);
    setTitle(rev.title || '');
    setComment(rev.comment);
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setRating(5);
    setTitle('');
    setComment('');
  };

  const userReview = reviews.find((r) => r.user === user?._id || r.user?._id === user?._id);

  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
      {/* Title & Write Review Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-brand-500" />
            Customer Reviews & Ratings
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real feedback from verified SmartCart buyers
          </p>
        </div>

        {isAuthenticated && !userReview && (
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-md shadow-brand-500/20 flex items-center gap-2 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Write a Review
          </button>
        )}
      </div>

      {/* Rating Breakdown Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center bg-slate-50 dark:bg-slate-800/40 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
        {/* Average Rating Large Badge */}
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-5xl font-black text-slate-900 dark:text-white">
            {averageRating ? averageRating.toFixed(1) : '0.0'}
          </span>
          <div className="my-2">
            <RatingStars rating={averageRating} size="md" />
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Based on {numReviews} customer reviews
          </span>
        </div>

        {/* Rating Distribution Progress Bars */}
        <div className="md:col-span-2 space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = distribution[star] || 0;
            const percentage = numReviews > 0 ? (count / numReviews) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-3 text-xs">
                <span className="w-12 font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                  {star} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                </span>
                <div className="flex-1 h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-8 text-right font-medium text-slate-400">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8 text-xs text-slate-400">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/30 rounded-2xl text-slate-400 text-sm">
            No reviews yet for this product. Be the first to share your thoughts!
          </div>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev._id}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/60 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt={rev.userName}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-500/20"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{rev.userName}</h4>
                    <span className="text-[11px] text-slate-400">{formatDate(rev.createdAt)}</span>
                  </div>
                </div>

                {/* Edit / Delete actions */}
                {(rev.user === user?._id || rev.user?._id === user?._id || isAdmin) && (
                  <div className="flex items-center gap-2">
                    {rev.user === user?._id && (
                      <button
                        onClick={() => handleEdit(rev)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-brand-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        title="Edit Review"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(rev._id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      title="Delete Review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <RatingStars rating={rev.rating} size="xs" />

              {rev.title && <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">{rev.title}</h5>}

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{rev.comment}</p>
            </div>
          ))
        )}
      </div>

      {/* Review Form Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingId ? 'Edit Product Review' : 'Write a Product Review'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Rating Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Select Rating
                </label>
                <RatingStars rating={rating} size="lg" interactive={true} onRatingChange={(r) => setRating(r)} />
              </div>

              {/* Review Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Review Headline (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Great sound quality, fast shipping!"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>

              {/* Review Comment */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Review Description *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share details about build quality, performance, and overall satisfaction..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-md disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : editingId ? 'Update Review' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default ReviewSection;
