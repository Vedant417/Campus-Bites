import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import API from '../services/api';
import { CafeCardSkeleton } from '../components/SkeletonLoader';
import { MapPin, Clock, ArrowRight, Utensils, Box } from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();
  const { orderType, setOrderType } = useCart();
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCafes = async () => {
      try {
        const res = await API.get('/cafes');
        if (res.data.success) {
          setCafes(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching cafes:', err);
        setError('Could not load cafés list. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchCafes();
  }, []);

  return (
    <div className="space-y-10 pb-12 pt-4">
      {/* Greetings Header */}
      <section className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-premium">
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-y-4 translate-x-4">
          <Utensils className="w-64 h-64" />
        </div>
        <div className="relative z-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans">
            Hey, {user ? user.name.split(' ')[0] : 'Craver'} 👋
          </h2>
          <p className="text-stone-300 text-sm sm:text-base max-w-md">
            What are you craving today? Order from the best campus spots without leaving your seat.
          </p>
        </div>
      </section>

      {/* Order Type Selector */}
      <section className="space-y-4">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-500 block">
          Select Order Type
        </h3>
        <div className="flex flex-col items-start gap-1.5 w-full max-w-sm">
          <div className="flex bg-stone-200/50 p-1.5 rounded-2xl w-full border border-stone-200/20">
            <button
              onClick={() => setOrderType('Dine In')}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer ${
                orderType === 'Dine In'
                  ? 'bg-accent-orange text-white shadow-md shadow-accent-orange/15'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Utensils className="w-4 h-4" />
              <span>Dine In</span>
            </button>
            <button
              onClick={() => setOrderType('Parcel')}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer ${
                orderType === 'Parcel'
                  ? 'bg-accent-orange text-white shadow-md shadow-accent-orange/15'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Box className="w-4 h-4" />
              <span>Parcel</span>
            </button>
          </div>
          <span className="text-[10px] text-stone-400 font-semibold block pl-58">
            * Parcel contains extra charges
          </span>
        </div>
      </section>

      {/* Cafe Grid List */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-2xl font-extrabold text-stone-900 font-sans">Campus Cafés</h3>
            <p className="text-sm text-stone-500 mt-0.5">Choose a café to explore the fresh menu.</p>
          </div>
        </div>

        {error && (
          <div className="bg-accent-red-light/20 border border-accent-red/20 text-accent-red p-4 rounded-2xl text-center text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <CafeCardSkeleton />
            <CafeCardSkeleton />
            <CafeCardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {cafes.map((cafe) => (
              <div
                key={cafe._id}
                className="bg-white rounded-3xl overflow-hidden border border-stone-200/40 shadow-sm hover:shadow-premium transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="relative h-48 bg-stone-100 overflow-hidden">
                  <img
                    src={cafe.image}
                    alt={cafe.name}
                    className={`w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ${
                      !cafe.isActive && 'grayscale opacity-75'
                    }`}
                  />
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-stone-800 text-[10px] font-bold tracking-wider px-2.5 py-1.5 rounded-full flex items-center shadow-sm">
                    <MapPin className="w-3 h-3 text-accent-orange mr-1" />
                    <span>{cafe.location || 'Special Block'}</span>
                  </div>
                  <div className={`absolute top-4 right-4 backdrop-blur-sm text-[10px] font-extrabold tracking-wider px-2.5 py-1.5 rounded-full shadow-sm z-20 ${
                    cafe.isActive
                      ? 'bg-emerald-500/90 text-white'
                      : 'bg-rose-500/90 text-white'
                  }`}>
                    {cafe.isActive ? 'Open' : 'Closed'}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <h4 className="text-xl font-extrabold text-stone-900 font-sans">
                      {cafe.name}
                    </h4>
                    <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">
                      {cafe.description}
                    </p>
                  </div>

                  {cafe.isActive ? (
                    <Link
                      to={`/cafe/${cafe.slug}`}
                      className="w-full py-3 bg-stone-50 group-hover:bg-accent-orange hover:!bg-accent-orange-dark group-hover:text-white text-center font-bold text-stone-800 rounded-xl transition-all duration-350 flex items-center justify-center space-x-1.5 text-sm cursor-pointer"
                    >
                      <span>Browse Menu</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 duration-200" />
                    </Link>
                  ) : (
                    <Link
                      to={`/cafe/${cafe.slug}`}
                      className="w-full py-3 bg-stone-100 border border-stone-200 text-center font-bold text-stone-500 rounded-xl transition-all duration-300 flex items-center justify-center space-x-1.5 text-sm cursor-pointer hover:bg-stone-200"
                    >
                      <span>Browse Menu</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* How it works section */}
      <section className="bg-stone-950 text-white rounded-[2.5rem] py-16 px-8 max-w-7xl mx-auto space-y-12 mt-12 animate-fade-in">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-3xl font-bold font-sans">How Campus Bites Works</h2>
          <p className="text-stone-400 text-sm">Getting your meal has never been this smooth.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { num: '01', title: 'Choose Café', desc: 'Select from Mayuri - Special Block, Bistro, AB Dakshin, Mayuri, or Underbelly.' },
            { num: '02', title: 'Pick Your Food', desc: 'Select items, customize quantities and choices.' },
            { num: '03', title: 'Pay Online', desc: 'Fast, secure mock checkout session.' },
            { num: '04', title: 'Grab Your Order', desc: 'Skip the queues and collect when notified.' },
          ].map((step) => (
            <div key={step.num} className="space-y-4 p-4 border-l border-stone-800">
              <span className="text-4xl font-extrabold text-accent-orange block">{step.num}</span>
              <h3 className="text-lg font-bold text-white">{step.title}</h3>
              <p className="text-stone-400 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200/50 pt-8 mt-12 text-center space-y-2">
        <p className="text-xs font-extrabold text-stone-500 uppercase tracking-widest font-sans">
          Made for students. Built for campus life.
        </p>
        <p className="text-[10px] text-stone-400 font-semibold font-sans">
          © {new Date().getFullYear()} CAMPUS BITES. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
