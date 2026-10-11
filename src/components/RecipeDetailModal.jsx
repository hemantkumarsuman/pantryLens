import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Clock, Flame, Users, ChefHat, Play, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { clearSelectedRecipe, startCookingMode, setServingsMultiplier } from '../store/pantrySlice';
import FlavorRadarChart from './FlavorRadarChart';

export default function RecipeDetailModal() {
  const dispatch = useDispatch();
  const { selectedRecipe: recipe, servingsMultiplier } = useSelector((state) => state.pantry);
  const [checkedIngredients, setCheckedIngredients] = useState({});

  if (!recipe) return null;

  const toggleCheck = (item) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const scale = servingsMultiplier / (recipe.servings || 2);
  const scaledCalories = Math.round((recipe.caloriesPerServing || 380) * (servingsMultiplier / 2));
  const totalTime = (recipe.prepTime || 10) + (recipe.cookTime || 15);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl glass-panel-glow border border-white/10 text-white shadow-2xl relative p-6 sm:p-8 space-y-6">
        
        {/* Close Button */}
        <button
          onClick={() => dispatch(clearSelectedRecipe())}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-2 pr-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
              {recipe.cuisine || 'Gourmet'}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10">
              {recipe.difficulty} Difficulty
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              {recipe.matchPercentage || 94}% Pantry Match
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {recipe.title}
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            {recipe.tagline}
          </p>
        </div>

        {/* Quick Stats & Servings Multiplier Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-900/60 border border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Time</p>
              <p className="text-sm font-bold text-white">{totalTime} mins</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Est. Energy</p>
              <p className="text-sm font-bold text-white">{scaledCalories} kcal</p>
            </div>
          </div>

          {/* Servings Multiplier */}
          <div className="flex items-center gap-3 col-span-2 sm:col-span-2 justify-between sm:justify-start">
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400">
              <Users className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-3">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Servings</p>
                <p className="text-sm font-bold text-white">{servingsMultiplier} Persons</p>
              </div>
              <div className="flex items-center gap-1 ml-2 bg-white/5 rounded-xl p-1 border border-white/10">
                <button
                  onClick={() => dispatch(setServingsMultiplier(servingsMultiplier - 1))}
                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-bold text-slate-300 flex items-center justify-center transition-colors"
                >
                  -
                </button>
                <span className="w-6 text-center text-xs font-bold text-amber-400">{servingsMultiplier}</span>
                <button
                  onClick={() => dispatch(setServingsMultiplier(servingsMultiplier + 1))}
                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-bold text-slate-300 flex items-center justify-center transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Two-Column Layout: Ingredients & Flavor Chart */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Left: Interactive Ingredient Checklist */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <span>📋</span>
              <span>Ingredients Required (Check off as prepped)</span>
            </h3>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {recipe.usedIngredients?.map((item, idx) => {
                const isChecked = !!checkedIngredients[item];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleCheck(item)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      isChecked
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : 'bg-white/[0.03] border-white/5 text-slate-200 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                        isChecked ? 'bg-emerald-500 border-emerald-400 text-black' : 'border-slate-500'
                      }`}>
                        {isChecked && <CheckCircle2 className="w-4 h-4 fill-emerald-500 text-black" />}
                      </div>
                      <span className={`text-sm ${isChecked ? 'line-through opacity-70' : ''}`}>
                        {item}
                      </span>
                    </div>
                    <span className="text-xs text-amber-400/80 font-mono">
                      Available
                    </span>
                  </div>
                );
              })}

              {recipe.missingIngredients && recipe.missingIngredients.length > 0 && (
                <div className="pt-2">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Optional Enhancements:
                  </p>
                  {recipe.missingIngredients.map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-300/80 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Chef Secret Box */}
            {recipe.chefSecret && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30">
                <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
                  <ChefHat className="w-4 h-4" />
                  <span>Chef's Pro Secret</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{recipe.chefSecret}"
                </p>
              </div>
            )}
          </div>

          {/* Right: Flavor Profile Radar & Macronutrients */}
          <div className="space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-3">
                <span>🎯</span>
                <span>Flavor Profile & Taste Balance</span>
              </h3>

              <div className="p-5 rounded-2xl bg-slate-900/50 border border-white/5 flex flex-col items-center justify-center">
                <FlavorRadarChart profile={recipe.flavorProfile} size={200} isMini={false} />
              </div>
            </div>

            {/* Macros Bar */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Macronutrients per serving:
              </span>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2 rounded-xl bg-slate-900 border border-white/5">
                  <span className="block text-[10px] text-slate-400">Protein</span>
                  <span className="text-base font-bold text-amber-400">{recipe.macros?.protein || 22}g</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-white/5">
                  <span className="block text-[10px] text-slate-400">Carbs</span>
                  <span className="text-base font-bold text-sky-400">{recipe.macros?.carbs || 30}g</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-white/5">
                  <span className="block text-[10px] text-slate-400">Fat</span>
                  <span className="text-base font-bold text-emerald-400">{recipe.macros?.fat || 16}g</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-white/5">
                  <span className="block text-[10px] text-slate-400">Fiber</span>
                  <span className="text-base font-bold text-purple-400">{recipe.macros?.fiber || 5}g</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* CTA Launch Cooking Mode */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400 text-center sm:text-left">
            Ready to cook? Launch hands-free mode for large-text step guides and audio timers.
          </p>

          <button
            onClick={() => dispatch(startCookingMode(recipe))}
            className="w-full sm:w-auto py-3.5 px-8 rounded-2xl font-bold text-sm bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-black shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2.5 transition-all transform hover:scale-[1.02]"
          >
            <Play className="w-4 h-4 fill-black" />
            <span>Start Hands-Free Cooking Mode</span>
          </button>
        </div>

      </div>
    </div>
  );
}
