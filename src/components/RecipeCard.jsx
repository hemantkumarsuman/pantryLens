import React from 'react';
import { useDispatch } from 'react-redux';
import { Clock, Flame, ChevronRight, Play, ChefHat, Sparkles } from 'lucide-react';
import { selectRecipe, startCookingMode } from '../store/pantrySlice';
import FlavorRadarChart from './FlavorRadarChart';

export default function RecipeCard({ recipe }) {
  const dispatch = useDispatch();

  const totalTime = (recipe.prepTime || 10) + (recipe.cookTime || 15);
  const match = recipe.matchPercentage || 92;

  return (
    <div className="group glass-panel rounded-3xl p-6 border border-white/10 hover:border-amber-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col justify-between relative overflow-hidden">
      {/* Subtle top accent gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 opacity-60 group-hover:opacity-100 transition-opacity" />

      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
              {recipe.cuisine || 'Gourmet Bistro'}
            </span>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/10">
              {recipe.difficulty || 'Easy'}
            </span>
          </div>

          {/* Match Score */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
            <Sparkles className="w-3 h-3" />
            <span>{match}% Match</span>
          </div>
        </div>

        {/* Title & Tagline */}
        <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors tracking-tight line-clamp-1">
          {recipe.title}
        </h3>
        <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
          {recipe.tagline}
        </p>

        {/* Time & Calories bar */}
        <div className="flex items-center gap-4 text-xs text-slate-400 mt-4 py-2 border-y border-white/5">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{totalTime} mins</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>{recipe.caloriesPerServing || 380} kcal</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <ChefHat className="w-3.5 h-3.5 text-rose-400" />
            <span>{recipe.instructions?.length || 4} steps</span>
          </div>
        </div>

        {/* Center: Flavor Profile & Macros split */}
        <div className="my-4 flex items-center justify-between gap-2 bg-slate-900/40 rounded-2xl p-3 border border-white/5">
          {/* Mini Radar Chart */}
          <div className="flex flex-col items-center">
            <FlavorRadarChart profile={recipe.flavorProfile} size={110} isMini={true} />
            <span className="text-[10px] text-slate-400 mt-1 font-semibold uppercase tracking-wider">
              Flavor Matrix
            </span>
          </div>

          {/* Macros summary */}
          <div className="flex-1 pl-3 grid grid-cols-2 gap-2 text-center">
            <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="block text-[10px] text-slate-400 uppercase">Protein</span>
              <span className="text-sm font-bold text-amber-400">{recipe.macros?.protein || 22}g</span>
            </div>
            <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="block text-[10px] text-slate-400 uppercase">Carbs</span>
              <span className="text-sm font-bold text-sky-400">{recipe.macros?.carbs || 30}g</span>
            </div>
            <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="block text-[10px] text-slate-400 uppercase">Fats</span>
              <span className="text-sm font-bold text-emerald-400">{recipe.macros?.fat || 16}g</span>
            </div>
            <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="block text-[10px] text-slate-400 uppercase">Fiber</span>
              <span className="text-sm font-bold text-purple-400">{recipe.macros?.fiber || 5}g</span>
            </div>
          </div>
        </div>

        {/* Used Ingredients preview */}
        <div className="text-xs text-slate-400 mb-4">
          <span className="font-semibold text-slate-300">Uses: </span>
          <span className="text-slate-400">
            {recipe.usedIngredients?.slice(0, 4).join(', ')}
            {recipe.usedIngredients?.length > 4 ? ` +${recipe.usedIngredients.length - 4} more` : ''}
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2 pt-2">
        <button
          onClick={() => dispatch(selectRecipe(recipe))}
          className="flex-1 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold border border-white/10 flex items-center justify-center gap-1.5 transition-colors"
        >
          <span>View Recipe</span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => dispatch(startCookingMode(recipe))}
          title="Launch Step-by-Step Cooking HUD"
          className="py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black text-xs font-bold shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-all"
        >
          <Play className="w-3.5 h-3.5 fill-black" />
          <span>Cook HUD</span>
        </button>
      </div>
    </div>
  );
}
