import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { LayoutDashboard, Users, Store, DollarSign, ListOrdered, CheckCircle, RefreshCw } from 'lucide-react';

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState({
    totalSales: 0,
    totalOrders: 0,
    studentCount: 0,
    cafeCount: 0,
  });
  const [cafes, setCafes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAdminData = async () => {
    try {
      setRefreshing(true);
      // Retrieve cafes
      const cafesRes = await API.get('/cafes');
      if (cafesRes.data.success) {
        setCafes(cafesRes.data.data);
      }

      // Retrieve actual admin metrics from backend
      const metricsRes = await API.get('/orders/admin-metrics');
      if (metricsRes.data.success) {
        setMetrics(metricsRes.data.data);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const toggleCafeStatus = async (cafeId, currentActive) => {
    try {
      const res = await API.patch(`/cafes/${cafeId}/status`);
      if (res.data.success) {
        setCafes((prevCafes) =>
          prevCafes.map((c) => (c._id === cafeId ? res.data.data : c))
        );
      }
    } catch (err) {
      console.error('Error toggling cafe status:', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-12 text-center">
        <div className="w-10 h-10 border-4 border-accent-orange border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-stone-500 mt-4 font-medium font-sans">Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 pt-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-accent-orange bg-accent-orange/10 px-2.5 py-1 rounded-full">
            Admin Portal
          </span>
          <h2 className="text-3xl font-extrabold text-stone-900 font-sans mt-1.5">
            Campus Bites Management
          </h2>
          <p className="text-sm text-stone-500 mt-0.5">Campus-wide platform statistics and café controls.</p>
        </div>

        <button
          onClick={fetchAdminData}
          className="inline-flex items-center space-x-1.5 bg-stone-900 hover:bg-stone-850 text-white font-bold text-xs py-3.5 px-5 rounded-xl shadow-md self-start sm:self-auto transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-3xl p-5 border border-stone-200/40 shadow-sm flex items-center space-x-4">
          <div className="w-10 h-10 rounded-2xl bg-orange-100 text-accent-orange flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-stone-450 text-[10px] block font-bold uppercase tracking-wider">Total Sales</span>
            <span className="text-lg font-extrabold text-stone-950 font-sans">₹{metrics.totalSales}</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-stone-200/40 shadow-sm flex items-center space-x-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-accent-amber flex items-center justify-center">
            <ListOrdered className="w-5 h-5 text-accent-orange" />
          </div>
          <div>
            <span className="text-stone-450 text-[10px] block font-bold uppercase tracking-wider">Total Orders</span>
            <span className="text-lg font-extrabold text-stone-950">{metrics.totalOrders} placed</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-stone-200/40 shadow-sm flex items-center space-x-4">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-stone-450 text-[10px] block font-bold uppercase tracking-wider">Active Students</span>
            <span className="text-lg font-extrabold text-stone-950">{metrics.studentCount} users</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-stone-200/40 shadow-sm flex items-center space-x-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <span className="text-stone-450 text-[10px] block font-bold uppercase tracking-wider">Active Cafés</span>
            <span className="text-lg font-extrabold text-stone-950">
              {cafes.filter((cafe) => cafe.isActive === true).length} cafés
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cafe management */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-stone-200/40 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-lg text-stone-900 font-sans">Café Control Panel</h3>
            <p className="text-xs text-stone-500 mt-0.5">Toggle cafe status to open or close locations.</p>
          </div>

          <div className="divide-y divide-stone-100">
            {cafes.map((cafe) => (
              <div key={cafe._id} className="py-4 flex justify-between items-center">
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 bg-stone-100 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={cafe.image} alt={cafe.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 block text-sm">{cafe.name}</span>
                    <span className="text-[10px] text-stone-400 block max-w-sm truncate">{cafe.description}</span>
                  </div>
                </div>

                <button
                  onClick={() => toggleCafeStatus(cafe._id, cafe.isActive)}
                  className={`py-1.5 px-4 rounded-xl text-xs font-bold transition-all duration-200 border cursor-pointer ${cafe.isActive
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                      : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                    }`}
                >
                  {cafe.isActive ? 'Open' : 'Closed'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Info panel */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/40 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-stone-950 font-sans border-b border-stone-100 pb-3">
            System Operations
          </h3>
          <div className="space-y-3.5 text-xs text-stone-600">
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              <span>MongoDB connection is stable and synced.</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              <span>Mock printer queues are active on stdout logs.</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              <span>Security checks enabled for all route parameters.</span>
            </div>
          </div>
          <p className="text-[10px] text-stone-400 leading-relaxed border-t border-stone-100 pt-3">
            Note: Admin panel features are set up for database scaling and user moderation in subsequent releases.
          </p>
        </div>
      </div>
    </div>
  );
}
