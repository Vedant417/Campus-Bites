import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { ArrowRight, Coffee, ShieldCheck, Zap, Sparkles, MapPin } from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated, user } = useAuth();
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(true);

  if (isAuthenticated && user) {
    if (user.role === 'cafe_staff') {
      return <Navigate to="/staff" replace />;
    }
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/home" replace />;
  }

  const cafeStyles = {
    'mayuri-special-block': {
      tagline: 'Fresh • Fast • Campus Favourite',
      color: 'from-orange-500/10 to-amber-500/10',
    },
    'bistro': {
      tagline: 'Pizzas • Pastas • Chinese • Coffee',
      color: 'from-amber-600/10 to-stone-700/10',
    },
    'ab-dakshin': {
      tagline: 'Dosas • Idlis • Multi-Cuisine Specialities',
      color: 'from-green-600/10 to-emerald-700/10',
    },
    'mayuri': {
      tagline: 'Classic • Quick • Comfort Food',
      color: 'from-yellow-500/10 to-orange-500/10',
    },
    'underbelly': {
      tagline: 'Burgers • Wraps • Pasta • Shakes',
      color: 'from-stone-900/10 to-amber-700/10',
    }
  };

  useEffect(() => {
    const fetchCafes = async () => {
      try {
        const res = await API.get('/cafes');
        if (res.data.success) {
          const merged = res.data.data.map(c => {
            const style = cafeStyles[c.slug] || {
              tagline: 'Delicious • Fast • Hot',
              color: 'from-stone-900/10 to-amber-750/10',
            };
            return {
              ...c,
              tagline: style.tagline,
              color: style.color,
            };
          });
          setCafes(merged);
        }
      } catch (err) {
        console.error('Error fetching cafes on landing page:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCafes();
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Hero Text */}
          <div className="flex-1 space-y-6 text-center md:text-left max-w-2xl">
            <div className="inline-flex items-center space-x-1.5 bg-accent-orange/10 text-accent-orange px-3 py-1.5 rounded-full text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Modern Campus Ordering Platform</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-stone-900 leading-tight">
              Your Campus.<br />
              <span className="text-accent-orange">Your Cafés.</span><br />
              Your Order.
            </h1>
            
            <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
              Skip the queue. Pick your favorite café, order your food, pay online securely, and grab it when it's hot and ready. Built exclusively for students.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-2">
              <Link
                to={isAuthenticated ? "/home" : "/login"}
                className="w-full sm:w-auto bg-stone-900 text-white hover:bg-stone-800 text-center font-bold px-8 py-4 rounded-2xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-stone-900/10 text-base"
              >
                <span>Order Now</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#cafes"
                className="w-full sm:w-auto bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 font-bold px-8 py-4 rounded-2xl transition-all text-center duration-200 block text-base"
              >
                Explore Cafés
              </a>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="flex-1 relative w-full max-w-md md:max-w-lg">
            <div className="absolute inset-0 bg-gradient-to-tr from-accent-orange/10 to-amber-500/10 rounded-[2.5rem] transform rotate-3" />
            <img
              src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80"
              alt="Campus Dining"
              className="rounded-[2.5rem] shadow-premium relative z-10 w-full h-[300px] sm:h-[400px] object-cover border border-white/50 transform -rotate-1 hover:rotate-0 transition-transform duration-300"
            />
          </div>
        </div>
      </section>

      {/* Feature Badges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white/50 border border-stone-200/50 p-6 md:p-8 rounded-3xl shadow-sm glass-panel">
          <div className="flex space-x-4 items-start">
            <div className="p-3 bg-accent-orange/10 text-accent-orange rounded-2xl">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-stone-900">Zero Wait Times</h3>
              <p className="text-stone-600 text-sm mt-1">Place your order digitally and avoid waiting in long queues at the counter.</p>
            </div>
          </div>
          <div className="flex space-x-4 items-start">
            <div className="p-3 bg-accent-orange/10 text-accent-orange rounded-2xl">
              <Coffee className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-stone-900">Multiple Cafes, One App</h3>
              <p className="text-stone-600 text-sm mt-1">Browse menus of all our campus cafés in a single place.</p>
            </div>
          </div>
          <div className="flex space-x-4 items-start">
            <div className="p-3 bg-accent-orange/10 text-accent-orange rounded-2xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-stone-900">Secure Payments</h3>
              <p className="text-stone-600 text-sm mt-1">Seamless digital checkouts that make cashless ordering simple and robust.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Cafes Section */}
      <section id="cafes" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-3xl font-extrabold text-stone-900">Explore Campus Cafés</h2>
          <p className="text-stone-600 mt-2">Pick your vibe for today's lunch or tea break.</p>
        </div>

        {loading ? (
          <div className="py-12 text-center">
            <div className="w-8 h-8 border-3 border-accent-orange border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-stone-500 mt-3 text-sm">Loading campus cafés...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {cafes.map((cafe) => (
              <div
                key={cafe.slug}
                className={`rounded-3xl border border-stone-200/40 overflow-hidden bg-gradient-to-b ${cafe.color} flex flex-col justify-between h-[450px] shadow-sm hover:shadow-premium transition-all duration-300 group`}
              >
                <div className="relative h-48 overflow-hidden bg-stone-100">
                  <img
                    src={cafe.image}
                    alt={cafe.name}
                    className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
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

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-accent-orange">
                      {cafe.tagline}
                    </span>
                    <h3 className="text-2xl font-bold text-stone-900">{cafe.name}</h3>
                    <p className="text-stone-600 text-sm leading-relaxed line-clamp-3">{cafe.description}</p>
                  </div>

                  {cafe.isActive ? (
                    <Link
                      to={isAuthenticated ? `/cafe/${cafe.slug}` : `/login?redirect=/cafe/${cafe.slug}`}
                      className="mt-6 w-full py-3 bg-white border border-stone-200 text-center font-bold text-stone-850 hover:bg-stone-900 hover:text-white rounded-xl transition-all duration-300 text-sm block cursor-pointer"
                    >
                      Explore Menu
                    </Link>
                  ) : (
                    <Link
                      to={isAuthenticated ? `/cafe/${cafe.slug}` : `/login?redirect=/cafe/${cafe.slug}`}
                      className="mt-6 w-full py-3 bg-stone-100 border border-stone-200 text-center font-bold text-stone-500 hover:bg-stone-200 rounded-xl transition-all duration-300 text-sm block cursor-pointer"
                    >
                      Explore Menu
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* How it works section */}
      <section className="bg-stone-950 text-white rounded-[2.5rem] py-16 px-8 max-w-7xl mx-auto space-y-12">
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
          {String.fromCharCode(66, 117, 105, 108, 116, 32, 38, 32, 68, 101, 115, 105, 103, 110, 101, 100, 32, 98, 121, 32, 86, 101, 100, 97, 110, 116, 32, 86, 121, 97, 115, 32, 169, 32, 50, 48, 50, 54)}
        </p>
      </footer>
    </div>
  );
}
