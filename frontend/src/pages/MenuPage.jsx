import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import API from '../services/api';
import { MenuItemSkeleton } from '../components/SkeletonLoader';
import ConflictModal from '../components/ConflictModal';
import RatingModal from '../components/RatingModal';
import { Utensils, Box, ArrowLeft, ShoppingBag, Plus, Minus, Star, Tag, ChevronLeft, ChevronRight } from 'lucide-react';

/* ─────────────────────────────────────────────
   Inline star display (mini)
───────────────────────────────────────────── */
function MiniStars({ rating }) {
  const filled = Math.round(rating);
  return (
    <span className="flex items-center space-x-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-2.5 h-2.5 ${s <= filled ? 'fill-amber-400 text-amber-400' : 'fill-stone-200 text-stone-200'}`}
        />
      ))}
    </span>
  );
}

export default function MenuPage() {
  const { slug } = useParams();
  const { orderType, setOrderType, addToCart, cartItems, updateQuantity, cartCafe } = useCart();

  const [cafe, setCafe] = useState(null);

  const parcelChargeMap = {
    'mayuri-special-block': 10,
    'mayuri': 10,
    'ab-dakshin': 5,
    'bistro': 15,
    'underbelly': 10
  };
  const currentParcelCharge = (cafe && cafe.slug) ? (parcelChargeMap[cafe.slug] || 0) : 0;
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Category filter scroll
  const filterScrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = useCallback(() => {
    const el = filterScrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  const scrollFilter = (dir) => {
    const el = filterScrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 180, behavior: 'smooth' });
  };

  // Rating modal state
  const [ratingModalItem, setRatingModalItem] = useState(null);
  useEffect(() => {
    const fetchCafeAndMenu = async () => {
      try {
        setLoading(true);
        const cafeRes = await API.get(`/cafes/${slug}`);
        if (cafeRes.data.success) {
          const cafeData = cafeRes.data.data;
          setCafe(cafeData);
          const menuRes = await API.get(`/cafes/${cafeData._id}/menu`);
          if (menuRes.data.success) {
            const items = menuRes.data.data;
            setMenuItems(items);
            const cats = ['All', ...new Set(items.map((item) => item.category))];
            setCategories(cats);
          }
        }
      } catch (err) {
        console.error('Error fetching menu details:', err);
        setError('Café not found or currently unavailable.');
      } finally {
        setLoading(false);
      }
    };
    fetchCafeAndMenu();
  }, [slug]);

  // Update scroll arrow visibility whenever categories change or on scroll
  useEffect(() => {
    const el = filterScrollRef.current;
    if (!el) return;
    updateScrollButtons();
    el.addEventListener('scroll', updateScrollButtons, { passive: true });
    return () => el.removeEventListener('scroll', updateScrollButtons);
  }, [categories, updateScrollButtons]);

  // Filter items based on active category
  const filteredItems = activeCategory === 'All'
    ? menuItems
    : menuItems.filter((item) => item.category === activeCategory);

  // Check quantity of an item currently in the cart
  const getItemQuantity = (itemId) => {
    const item = cartItems.find((i) => i.menuItemId === itemId);
    return item ? item.quantity : 0;
  };

  const handleAddToCart = (item) => {
    if (cafe && !cafe.isActive) {
      alert("This café is currently closed. You cannot add items to cart.");
      return;
    }
    addToCart(item, { _id: cafe._id, name: cafe.name, slug: cafe.slug });
  };

  const handleUpdateQuantity = (itemId, change) => {
    if (cafe && !cafe.isActive) {
      alert("This café is currently closed. You cannot modify the cart.");
      return;
    }
    updateQuantity(itemId, change);
  };

  // When a rating is submitted from the modal, update the local menuItems state
  const handleRatingSubmit = (menuItemId, newAvg, newTotal) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item._id === menuItemId
          ? { ...item, averageRating: newAvg, totalRatings: newTotal }
          : item
      )
    );
  };

  if (error) {
    return (
      <div className="max-w-xl mx-auto text-center py-12 space-y-4">
        <div className="text-accent-red font-bold text-lg">{error}</div>
        <Link to="/home" className="inline-block bg-stone-900 text-white font-bold py-3 px-6 rounded-xl hover:bg-stone-850">
          Back to Cafés
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 pt-2">
      {/* Header Info */}
      <div className="flex items-center space-x-3 text-stone-500 text-sm">
        <Link to="/home" className="hover:text-stone-800 flex items-center font-bold">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Cafés
        </Link>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="h-32 bg-stone-200 rounded-3xl animate-pulse" />
          <div className="flex space-x-3">
            <div className="w-16 h-8 bg-stone-200 rounded-lg animate-pulse" />
            <div className="w-24 h-8 bg-stone-200 rounded-lg animate-pulse" />
            <div className="w-20 h-8 bg-stone-200 rounded-lg animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MenuItemSkeleton />
            <MenuItemSkeleton />
            <MenuItemSkeleton />
            <MenuItemSkeleton />
          </div>
        </div>
      ) : (
        <>
          {cafe && !cafe.isActive && (
            <div className="bg-rose-50 border border-rose-250/20 text-rose-700 px-6 py-4 rounded-3xl flex items-center space-x-3 shadow-sm mb-4">
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse flex-shrink-0" />
              <span className="text-sm font-bold">
                This café is currently closed. You can browse the menu, but adding items to the cart or ordering is disabled.
              </span>
            </div>
          )}

          {/* Cafe Banner */}
          <div className="relative rounded-3xl overflow-hidden shadow-sm border border-stone-200/30 bg-white p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-3 max-w-lg">
              <span className="text-[10px] uppercase font-bold tracking-widest text-accent-orange bg-accent-orange/10 px-2.5 py-1 rounded-full">
                Campus Café
              </span>
              <h2 className="text-3xl font-extrabold text-stone-900 font-sans">{cafe.name}</h2>
              <p className="text-stone-500 text-sm leading-relaxed">{cafe.description}</p>
            </div>

            {/* Toggle Dine In vs Parcel */}
            <div className="flex flex-col items-end gap-1.5 w-full sm:w-auto">
              <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200/20 w-full sm:w-auto">
                <button
                  onClick={() => setOrderType('Dine In')}
                  className={`flex-1 sm:flex-initial py-2 px-4 rounded-lg text-xs font-bold transition-all duration-300 flex items-center justify-center space-x-1.5 cursor-pointer ${orderType === 'Dine In'
                      ? 'bg-accent-orange text-white shadow-md shadow-accent-orange/15'
                      : 'text-stone-500 hover:text-stone-850'
                    }`}
                >
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Dine In</span>
                </button>
                <button
                  onClick={() => setOrderType('Parcel')}
                  className={`flex-1 sm:flex-initial py-2 px-4 rounded-lg text-xs font-bold transition-all duration-300 flex items-center justify-center space-x-1.5 cursor-pointer ${orderType === 'Parcel'
                      ? 'bg-accent-orange text-white shadow-md shadow-accent-orange/15'
                      : 'text-stone-500 hover:text-stone-850'
                    }`}
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>Parcel</span>
                </button>
              </div>
              <span className="text-[10px] text-stone-400 font-semibold block text-right pr-2">
                * Parcel contains extra charges
              </span>
            </div>
          </div>

          {/* Categories Tab Bar with scroll arrows */}
          <div className="relative flex items-center w-full">

            {/* Left Arrow */}
            <button
              onClick={() => scrollFilter(-1)}
              className={`absolute left-1 top-1/2 -translate-y-[calc(50%+3px)] z-20
      flex items-center justify-center
      w-9 h-9
      bg-white
      border border-stone-200
      rounded-full
      shadow-md
      transition-all duration-200
      cursor-pointer
      ${canScrollLeft
                  ? 'opacity-100 hover:bg-stone-50 hover:shadow-lg'
                  : 'opacity-0 pointer-events-none'
                }`}
              aria-label="Scroll categories left"
            >
              <ChevronLeft className="w-4 h-4 text-stone-600" />
            </button>

            {/* Scrollable Pills */}
            <div
              ref={filterScrollRef}
              className="flex overflow-x-auto pb-1 scrollbar-none items-center space-x-2 pl-12 pr-12 w-full"
              onScroll={updateScrollButtons}
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold border transition-all duration-300 flex-shrink-0 cursor-pointer ${activeCategory === cat
                      ? 'bg-stone-900 border-stone-900 text-white shadow-sm'
                      : 'bg-white border-stone-200 text-stone-600 hover:border-stone-400 hover:text-stone-900'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Right Arrow */}
            <button
              onClick={() => scrollFilter(1)}
              className={`absolute right-1 top-1/2 -translate-y-[calc(50%+3px)] z-20
      flex items-center justify-center
      w-9 h-9
      bg-white
      border border-stone-200
      rounded-full
      shadow-md
      transition-all duration-200
      cursor-pointer
      ${canScrollRight
                  ? 'opacity-100 hover:bg-stone-50 hover:shadow-lg'
                  : 'opacity-0 pointer-events-none'
                }`}
              aria-label="Scroll categories right"
            >
              <ChevronRight className="w-4 h-4 text-stone-600" />
            </button>

          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map((item) => {
              const qty = getItemQuantity(item._id);
              const hasRatings = item.totalRatings > 0;

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-3xl p-4 border border-stone-200/40 shadow-sm flex flex-col group hover:shadow-premium hover:border-stone-200 transition-all duration-300"
                >
                  {/* Top row: image + details + add button */}
                  <div className="flex space-x-4 items-center">
                    {/* Left: Product Image */}
                    <div className="w-24 h-24 bg-stone-100 rounded-2xl overflow-hidden relative flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                        loading="lazy"
                      />
                      {/* Veg Badge */}
                      <div className="absolute top-1.5 left-1.5 bg-white/95 backdrop-blur-sm p-1 rounded-lg border border-stone-100/50 shadow-sm">
                        <div className={`w-3 h-3 rounded-full flex items-center justify-center border ${item.isVeg ? 'border-accent-green' : 'border-accent-red'
                          }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-accent-green' : 'bg-accent-red'
                            }`} />
                        </div>
                      </div>
                    </div>

                    {/* Middle: Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-stone-900 leading-snug font-sans">
                        {item.name}
                      </h4>
                      <p className="text-stone-400 text-[11px] mt-0.5 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Price */}
                      <div className="flex items-center space-x-2 mt-2">
                        {item.isMRP ? (
                          <span className="flex items-center space-x-1 text-xs font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-lg border border-stone-200/40">
                            <Tag className="w-3 h-3" />
                            <span>₹MRP</span>
                          </span>
                        ) : (
                          <span className="text-base font-extrabold text-stone-900 font-sans">
                            ₹{item.price}
                            {orderType === 'Parcel' && currentParcelCharge > 0 && ` + ₹${currentParcelCharge}`}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right: Add / Qty buttons */}
                    <div className="flex-shrink-0 self-center">
                      {item.isMRP ? (
                        <span className="text-[9px] font-bold text-stone-400 bg-stone-100 px-2 py-1 rounded-lg border border-stone-200/30 text-center block">
                          At MRP
                        </span>
                      ) : !item.isAvailable ? (
                        <span className="text-[10px] font-bold text-stone-400 bg-stone-100 px-3 py-1.5 rounded-lg border border-stone-200/30">
                          Sold Out
                        </span>
                      ) : (cafe && !cafe.isActive) ? (
                        <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200/30">
                          Closed
                        </span>
                      ) : qty > 0 ? (
                        <div className="flex items-center space-x-2 bg-stone-900 text-white rounded-xl p-1 shadow-sm">
                          <button
                            onClick={() => handleUpdateQuantity(item._id, -1)}
                            className="p-1 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-bold px-1.5">{qty}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item._id, 1)}
                            className="p-1 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="py-2 px-4 border border-stone-200 hover:border-stone-450 hover:bg-stone-50 text-stone-800 font-bold rounded-xl transition-all duration-200 text-xs flex items-center space-x-1 shadow-sm cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5 mr-0.5 text-accent-orange" />
                          <span>Add</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Bottom row: Rating display + Rate & Review button */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-100">
                    {/* Rating info */}
                    <div className="flex items-center space-x-1.5">
                      {hasRatings ? (
                        <>
                          <MiniStars rating={item.averageRating} />
                          <span className="text-[11px] font-bold text-stone-700">
                            {item.averageRating.toFixed(1)}
                          </span>
                          <span className="text-[10px] text-stone-400 font-medium">
                            · {item.totalRatings} {item.totalRatings === 1 ? 'rating' : 'ratings'}
                          </span>
                        </>
                      ) : (
                        <>
                          <MiniStars rating={0} />
                          <span className="text-[10px] text-stone-400 font-medium">No ratings yet</span>
                        </>
                      )}
                    </div>

                    {/* Stock Status badge */}
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                      item.isAvailable
                        ? 'text-emerald-600 bg-emerald-50'
                        : 'text-rose-600 bg-rose-50'
                    }`}>
                      {item.isAvailable ? 'In Stock' : 'Out of Stock'}
                    </span>

                    {/* Rate & Review button */}
                    <button
                      onClick={() => setRatingModalItem(item)}
                      className="flex items-center space-x-1 text-[10px] font-bold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/60 px-2.5 py-1.5 rounded-lg transition-all duration-200 cursor-pointer"
                    >
                      <Star className="w-3 h-3" />
                      <span>Rate &amp; Review</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty state */}
          {filteredItems.length === 0 && (
            <div className="text-center py-12 space-y-2">
              <p className="text-stone-500 font-medium">No items found in this category.</p>
            </div>
          )}
        </>
      )}

      {/* Cart Navigation Helper */}
      {!loading && cartItems.length > 0 && cartCafe && String(cartCafe._id) === String(cafe?._id) && (
        <div className="fixed bottom-20 md:bottom-8 left-4 right-4 z-40 max-w-md mx-auto animate-slide-up">
          <Link
            to="/cart"
            className="flex items-center justify-between bg-stone-950 text-white p-4 rounded-2xl shadow-xl hover:bg-stone-900 transition-all duration-200"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-accent-orange rounded-xl flex items-center justify-center font-bold">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs text-stone-400 block font-medium">
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)} Items from {cafe.name}
                </span>
                <span className="text-sm font-bold">
                  ₹{cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) + Math.round(cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) * 0.05)} total
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-1 font-bold text-sm text-accent-orange">
              <span>View Cart</span>
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </div>
          </Link>
        </div>
      )}

      {/* Conflict Dialog */}
      <ConflictModal />

      {/* Rating Modal */}
      {ratingModalItem && (
        <RatingModal
          item={ratingModalItem}
          cafeName={cafe?.name || ''}
          onClose={() => setRatingModalItem(null)}
          onRatingSubmit={handleRatingSubmit}
        />
      )}
    </div>
  );
}
