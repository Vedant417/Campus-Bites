import React from 'react';
import { useCart } from '../context/CartContext';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function ConflictModal() {
  const { conflict, resolveConflict } = useCart();

  if (!conflict) return null;

  const currentCafeName = conflict.pendingCafe.name; // Mayuri
  const existingCafeName = conflict.pendingItem.cafeName || 'another cafe'; // Bistro (passed down or resolved)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl animate-scale-in border border-stone-100">
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 bg-accent-orange/10 rounded-full flex items-center justify-center text-accent-orange">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <button
            onClick={() => resolveConflict(false)}
            className="p-1 hover:bg-stone-100 rounded-full transition-colors text-stone-400 hover:text-stone-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h3 className="text-xl font-bold text-stone-900 mb-2 font-sans">
          Start a new order?
        </h3>
        <p className="text-sm text-stone-600 mb-6 leading-relaxed">
          Your cart currently contains items from <span className="font-semibold text-stone-800">{existingCafeName}</span>. 
          Adding this item will discard your current selections. Would you like to start a new order from <span className="font-semibold text-stone-800">{currentCafeName}</span>?
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => resolveConflict(true)}
            className="flex-1 bg-accent-orange hover:bg-accent-orange-dark text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-md shadow-accent-orange/20 flex items-center justify-center space-x-2 text-sm"
          >
            <Trash2 className="w-4 h-4" />
            <span>Start New Order</span>
          </button>
          <button
            onClick={() => resolveConflict(false)}
            className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold py-3 px-4 rounded-xl transition-all duration-200 text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
