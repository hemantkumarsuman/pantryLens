import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveFilter } from '../store/pantrySlice';

const FILTERS = [
  { id: 'all', label: 'All Recipes', icon: '✨' },
  { id: 'high-protein', label: 'High Protein', icon: '💪' },
  { id: 'under-25m', label: 'Quick (< 25 min)', icon: '⏱️' },
  { id: 'vegetarian', label: 'Vegetarian', icon: '🥑' },
  { id: 'low-carb', label: 'Low Carb', icon: '🥩' },
];

export default function DietaryFilters() {
  const dispatch = useDispatch();
  const activeFilter = useSelector((state) => state.pantry.activeFilter);

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {FILTERS.map((f) => {
        const isActive = activeFilter === f.id;
        return (
          <button
            key={f.id}
            onClick={() => dispatch(setActiveFilter(f.id))}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
              isActive
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/25 scale-[1.02]'
                : 'bg-white/[0.03] text-slate-300 hover:bg-white/[0.08] border border-white/10'
            }`}
          >
            <span>{f.icon}</span>
            <span>{f.label}</span>
          </button>
        );
      })}
    </div>
  );
}
