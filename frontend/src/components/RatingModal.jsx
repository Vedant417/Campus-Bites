import React, { useState, useEffect, useCallback } from 'react';
import { X, Star, MessageSquare, Users, ChevronRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

/* ─────────────────────────────────────────────
   Star display (read-only)
───────────────────────────────────────────── */
function StarDisplay({ rating, size = 'sm' }) {
  const filled = Math.round(rating);
  const sz = size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5';
  return (
    <div className="flex items-center space-x-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`${sz} ${s <= filled ? 'fill-amber-400 text-amber-400' : 'text-stone-200 fill-stone-200'}`}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Interactive Star Picker
───────────────────────────────────────────── */
function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  const labels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  return (
    <div className="text-center space-y-2">
      <div className="flex items-center justify-center space-x-2">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onChange(value === s ? 0 : s)}
            onMouseEnter={() => setHovered(s)}
            onMouseLeave={() => setHovered(0)}
            className="focus:outline-none transition-transform duration-100 hover:scale-110 active:scale-95 cursor-pointer"
          >
            <Star
              className={`w-9 h-9 transition-all duration-150 ${
                s <= (hovered || value)
                  ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                  : 'text-stone-200 fill-stone-200'
              }`}
            />
          </button>
        ))}
      </div>
      <p className={`text-xs font-bold tracking-wider transition-all duration-200 ${
        (hovered || value) ? 'text-amber-500 opacity-100' : 'text-stone-300 opacity-50'
      }`}>
        {labels[hovered || value] || 'Tap to rate'}
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Format relative time
───────────────────────────────────────────── */
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

/* ─────────────────────────────────────────────
   Main RatingModal
───────────────────────────────────────────── */
export default function RatingModal({ item, cafeName, onClose, onRatingSubmit }) {
  const { user, isAuthenticated } = useAuth();

  const [ratings, setRatings] = useState([]);
  const [loadingRatings, setLoadingRatings] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewerName, setReviewerName] = useState(user?.name || '');
  const [reviewText, setReviewText] = useState('');

  // Current aggregates from server
  const [avgRating, setAvgRating] = useState(item.averageRating || 0);
  const [totalRatings, setTotalRatings] = useState(item.totalRatings || 0);

  const fetchRatings = useCallback(async () => {
    try {
      setLoadingRatings(true);
      const res = await API.get(`/ratings/${item._id}`);
      if (res.data.success) {
        setRatings(res.data.data);
        setAvgRating(res.data.averageRating);
        setTotalRatings(res.data.totalRatings);
      }
    } catch (err) {
      console.error('Error fetching ratings:', err);
    } finally {
      setLoadingRatings(false);
    }
  }, [item._id]);

  useEffect(() => {
    fetchRatings();
    // Lock body scroll
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [fetchRatings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRating) {
      setError('Please select a star rating first.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const res = await API.post(`/ratings/${item._id}`, {
        rating: selectedRating,
        review: reviewText.trim(),
        userName: reviewerName.trim() || 'Anonymous Student',
      });
      if (res.data.success) {
        setSubmitted(true);
        setAvgRating(res.data.averageRating);
        setTotalRatings(res.data.totalRatings);
        // Notify parent to refresh card rating
        if (onRatingSubmit) onRatingSubmit(item._id, res.data.averageRating, res.data.totalRatings);
        // Refresh reviews list
        await fetchRatings();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit rating. Please try again.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render rating distribution bars ──────────────
  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = ratings.filter((r) => r.rating === star).length;
    const pct = totalRatings > 0 ? Math.round((count / totalRatings) * 100) : 0;
    return { star, count, pct };
  });

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Blur overlay */}
      <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm animate-fade-in" />

      {/* Modal Panel */}
      <div className="relative w-full sm:max-w-lg max-h-[92vh] sm:max-h-[85vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-slide-up">

        {/* ── Header ── */}
        <div className="flex-shrink-0 px-6 pt-5 pb-4 border-b border-stone-100">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <span className="text-[9px] font-bold uppercase tracking-widest text-accent-orange bg-accent-orange/10 px-2 py-0.5 rounded-full">
                {cafeName}
              </span>
              <h3 className="text-xl font-extrabold text-stone-900 mt-1 font-sans leading-tight">
                {item.name}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Aggregate score row */}
          <div className="mt-3 flex items-center space-x-3 bg-amber-50 rounded-2xl p-3 border border-amber-100">
            <div className="text-center">
              <div className="text-3xl font-extrabold text-amber-500 leading-none">
                {totalRatings > 0 ? avgRating.toFixed(1) : '—'}
              </div>
              <div className="text-[9px] text-stone-400 font-bold mt-0.5">out of 5</div>
            </div>
            <div className="w-px h-10 bg-amber-200" />
            <div className="flex-1 space-y-1.5">
              {distribution.map(({ star, pct }) => (
                <div key={star} className="flex items-center space-x-1.5">
                  <span className="text-[9px] font-bold text-stone-400 w-2">{star}</span>
                  <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400 flex-shrink-0" />
                  <div className="flex-1 bg-stone-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-amber-400 h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-stone-400 font-medium w-6 text-right">{pct}%</span>
                </div>
              ))}
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-stone-700">{totalRatings}</div>
              <div className="text-[9px] text-stone-400 font-bold">{totalRatings === 1 ? 'rating' : 'ratings'}</div>
            </div>
          </div>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="flex-1 overflow-y-auto overscroll-contain">

          {/* ── Rate Form ── */}
          <div className="px-6 py-5 border-b border-stone-100">
            {!isAuthenticated ? (
              <div className="text-center py-4 space-y-2">
                <Star className="w-8 h-8 text-stone-200 mx-auto" />
                <p className="text-sm font-bold text-stone-500">Sign in to rate this dish</p>
                <p className="text-xs text-stone-400">Your reviews help fellow students make better choices!</p>
              </div>
            ) : submitted ? (
              <div className="text-center py-6 space-y-2 animate-fade-in">
                <div className="text-3xl">🎉</div>
                <p className="text-base font-extrabold text-stone-900">Thanks for rating!</p>
                <StarDisplay rating={selectedRating} size="lg" />
                <p className="text-xs text-stone-500 mt-1">Your rating has been submitted and the average has been updated.</p>
                <button
                  onClick={() => { setSubmitted(false); setSelectedRating(0); setReviewText(''); }}
                  className="text-xs text-accent-orange font-bold underline cursor-pointer mt-2"
                >
                  Rate again
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest text-center">Your Rating</p>

                <StarPicker value={selectedRating} onChange={setSelectedRating} />

                {/* Reviewer name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                    Your Name <span className="text-stone-300 normal-case font-medium">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="Anonymous Student"
                    maxLength={50}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 outline-none focus:border-stone-400 focus:bg-white transition-colors placeholder:text-stone-300"
                  />
                </div>

                {/* Review text */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                    Review <span className="text-stone-300 normal-case font-medium">(optional)</span>
                  </label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Was it fresh? Spicy? Worth every rupee? Tell fellow students…"
                    maxLength={500}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 outline-none focus:border-stone-400 focus:bg-white transition-colors resize-none placeholder:text-stone-300"
                  />
                </div>

                {error && (
                  <p className="text-xs text-accent-red font-medium">{error}</p>
                )}

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !selectedRating}
                    className="flex-2 py-3 px-6 bg-amber-500 hover:bg-amber-600 disabled:bg-stone-200 disabled:text-stone-400 text-white font-bold rounded-xl text-xs transition-all duration-200 cursor-pointer flex items-center justify-center space-x-1.5 disabled:cursor-not-allowed shadow-sm shadow-amber-400/20"
                  >
                    {submitting ? (
                      <><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>Submitting…</span></>
                    ) : (
                      <><Star className="w-3.5 h-3.5" /><span>Submit Rating</span></>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* ── Reviews List ── */}
          <div className="px-6 py-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-stone-400" />
                <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">What Students Say</span>
              </div>
              {totalRatings > 0 && (
                <span className="text-[10px] font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full flex items-center space-x-1">
                  <Users className="w-2.5 h-2.5" />
                  <span>{totalRatings} {totalRatings === 1 ? 'review' : 'reviews'}</span>
                </span>
              )}
            </div>

            {loadingRatings ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="animate-pulse space-y-2">
                    <div className="h-3 bg-stone-100 rounded w-1/3" />
                    <div className="h-2.5 bg-stone-100 rounded w-full" />
                  </div>
                ))}
              </div>
            ) : ratings.length === 0 ? (
              <div className="text-center py-6 space-y-2">
                <div className="text-2xl">☕</div>
                <p className="text-sm font-bold text-stone-500">No reviews yet</p>
                <p className="text-xs text-stone-400">Be the first to rate this dish!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {ratings.map((r) => (
                  <div
                    key={r._id}
                    className="bg-stone-50 rounded-2xl p-3.5 border border-stone-100 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-accent-orange text-white flex items-center justify-center text-[9px] font-extrabold flex-shrink-0">
                          {r.userName?.[0]?.toUpperCase() || 'A'}
                        </div>
                        <span className="text-xs font-bold text-stone-800">{r.userName || 'Anonymous Student'}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <StarDisplay rating={r.rating} size="sm" />
                        <span className="text-[9px] text-stone-400 font-medium">{timeAgo(r.createdAt)}</span>
                      </div>
                    </div>
                    {r.review && (
                      <p className="text-xs text-stone-600 leading-relaxed pl-8">{r.review}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
