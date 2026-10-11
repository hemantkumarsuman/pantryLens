import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ChefHat, Sparkles, AlertCircle, Key, Info } from 'lucide-react';
import Navbar from './components/Navbar';
import VisionUploader from './components/VisionUploader';
import IngredientMatrix from './components/IngredientMatrix';
import DietaryFilters from './components/DietaryFilters';
import RecipeCard from './components/RecipeCard';
import RecipeDetailModal from './components/RecipeDetailModal';
import HandsFreeCookingHUD from './components/HandsFreeCookingHUD';
import ApiKeyModal from './components/ApiKeyModal';
import { setError } from './store/pantrySlice';

export default function App() {
  const dispatch = useDispatch();
  const { recipes, activeFilter, error, apiKey } = useSelector((state) => state.pantry);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  // Filter recipes according to dietary preference
  const filteredRecipes = recipes.filter((recipe) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'high-protein') return (recipe.macros?.protein || 0) >= 20;
    if (activeFilter === 'under-25m') return ((recipe.prepTime || 10) + (recipe.cookTime || 15)) <= 25;
    if (activeFilter === 'vegetarian') {
      const title = recipe.title.toLowerCase();
      const ingredients = recipe.usedIngredients?.join(' ').toLowerCase() || '';
      return !ingredients.includes('beef') && !ingredients.includes('chicken') && !ingredients.includes('pork') && !ingredients.includes('fish');
    }
    if (activeFilter === 'low-carb') return (recipe.macros?.carbs || 50) <= 25;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col antialiased selection:bg-amber-500 selection:text-black">
      
      {/* Top Navbar */}
      <Navbar onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-10">

        {/* Error notification banner if any */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start justify-between gap-3 animate-fade-in shadow-lg shadow-rose-500/5">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <p className="text-xs sm:text-sm font-medium">{error}</p>
            </div>
            <button
              onClick={() => dispatch(setError(null))}
              className="text-xs text-rose-400 hover:text-white underline underline-offset-4 font-semibold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Hero Vision Section */}
        <section>
          <VisionUploader onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)} />
        </section>

        {/* Pantry & Ingredient Matrix */}
        <section>
          <IngredientMatrix onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)} />
        </section>

        {/* Recipe Grid Header & Dietary Filters */}
        <section className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-amber-400" />
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  Chef-Crafted Creations
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {filteredRecipes.length} available
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Zero waste recipes dynamically generated from your detected ingredients
              </p>
            </div>

            <DietaryFilters />
          </div>

          {/* Recipe Cards List */}
          {filteredRecipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl glass-panel border border-white/10 space-y-3">
              <span className="text-3xl">🍳</span>
              <h3 className="text-base font-bold text-white">No recipes match this filter</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try switching the filter back to "All Recipes" or click "Generate Recipes" to create fresh meals.
              </p>
            </div>
          )}
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#0B0F17]/90 py-8 px-4 text-center text-xs text-slate-500 space-y-2">
        <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400 font-medium">
          <span>React 19</span>
          <span>•</span>
          <span>Tailwind CSS</span>
          <span>•</span>
          <span>Redux Toolkit</span>
          <span>•</span>
          <span>Gemini 1.5 Flash Vision</span>
          <span>•</span>
          <span>Web Audio API</span>
          <span>•</span>
          <span>Speech Synthesis</span>
        </div>
        <p>Built for Frontend Engineers • Free Tier Optimized with Zero Waste Cooking</p>
      </footer>

      {/* Modals & Overlays */}
      <RecipeDetailModal />
      <HandsFreeCookingHUD />
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />

    </div>
  );
}
