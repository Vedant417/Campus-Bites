import React from 'react';

export function CafeCardSkeleton() {
  return (
    <div className="w-full bg-white rounded-3xl overflow-hidden border border-stone-200/40 p-4 shadow-premium animate-pulse">
      <div className="w-full h-48 bg-stone-200 rounded-2xl mb-4" />
      <div className="h-6 bg-stone-200 rounded-lg w-1/3 mb-2" />
      <div className="h-4 bg-stone-200 rounded-lg w-2/3 mb-4" />
      <div className="h-10 bg-stone-200 rounded-xl w-full" />
    </div>
  );
}

export function MenuItemSkeleton() {
  return (
    <div className="bg-white rounded-3xl p-4 border border-stone-200/40 shadow-sm flex items-center space-x-4 animate-pulse">
      <div className="w-24 h-24 bg-stone-200 rounded-2xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-5 bg-stone-200 rounded w-1/2" />
        <div className="h-4 bg-stone-200 rounded w-5/6" />
        <div className="h-5 bg-stone-200 rounded w-1/4" />
      </div>
      <div className="w-20 h-9 bg-stone-200 rounded-xl" />
    </div>
  );
}

export function OrderCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl p-5 border border-stone-200/40 shadow-sm animate-pulse space-y-3">
      {/* Top Row: Cafe Name & Status */}
      <div className="flex justify-between items-center">
        <div className="space-y-2 w-1/3">
          <div className="h-5 bg-stone-200 rounded w-full" />
          <div className="h-3 bg-stone-200 rounded w-2/3" />
        </div>
        <div className="h-7 bg-stone-200 rounded-full w-20" />
      </div>
      
      {/* Items Summary & Date */}
      <div className="flex justify-between items-center pt-3 border-t border-stone-100">
        <div className="h-4 bg-stone-200 rounded w-1/3" />
        <div className="h-4 bg-stone-200 rounded w-12" />
      </div>
      
      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <div className="flex-1 h-9 bg-stone-200 rounded-xl" />
        <div className="flex-1 h-9 bg-stone-200 rounded-xl" />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 shadow-premium border border-stone-200/40 animate-pulse space-y-6">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-stone-200 rounded-full" />
        <div className="space-y-2 flex-1">
          <div className="h-5 bg-stone-200 rounded w-1/3" />
          <div className="h-4 bg-stone-200 rounded w-1/4" />
        </div>
      </div>
      <div className="space-y-3 pt-4 border-t border-stone-100">
        <div className="h-4 bg-stone-200 rounded w-2/3" />
        <div className="h-4 bg-stone-200 rounded w-1/2" />
      </div>
    </div>
  );
}
