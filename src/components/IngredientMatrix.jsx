import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, X, Trash2, RefreshCw, Sparkles, ChefHat } from 'lucide-react';
import { addIngredient, removeIngredient, clearIngredients, setRecipes, setIsAnalyzing, setAnalysisStatus, setError } from '../store/pantrySlice';
import { generateRecipesFromTags } from '../services/geminiService';

export default function IngredientMatrix({ onOpenApiKeyModal }) {
  const dispatch = useDispatch();
  const { ingredients, apiKey, activeFilter, isAnalyzing } = useSelector((state) => state.pantry);
  const [newTag, setNewTag] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (newTag.trim()) {
      dispatch(addIngredient(newTag.trim()));
      setNewTag('');
    }
  };

  const handleRegenerateFromTags = async () => {
    if (!apiKey) {
      onOpenApiKeyModal();
      return;
    }

    if (ingredients.length === 0) {
      dispatch(setError('Please add at least 2 ingredients before generating recipes.'));
      return;
    }

    try {
      dispatch(setIsAnalyzing(true));
      dispatch(setError(null));
      dispatch(setAnalysisStatus('Creating bespoke recipes from pantry items...'));

      const names = ingredients.map((i) => i.name);
      const result = await generateRecipesFromTags(apiKey, names, activeFilter);

      if (result.recipes && result.recipes.length > 0) {
        dispatch(setRecipes(result.recipes));
      }

      dispatch(setIsAnalyzing(false));
      dispatch(setAnalysisStatus(''));
    } catch (err) {
      dispatch(setIsAnalyzing(false));
      dispatch(setAnalysisStatus(''));
      dispatch(setError(err.message || 'Failed to generate recipes. Check your API key.'));
    }
  };

  return (
    <div className="w-full glass-panel rounded-3xl p-6 sm:p-7 border border-white/10 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>🥫</span>
              <span>Available Pantry & Fridge Inventory</span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {ingredients.length} items
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Add or remove items to customize what Gemini cooks with
          </p>
        </div>

        <div className="flex items-center gap-2">
          {ingredients.length > 0 && (
            <button
              onClick={() => dispatch(clearIngredients())}
              className="text-xs px-3 py-1.5 rounded-xl bg-white/5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-white/10 transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}

          <button
            onClick={handleRegenerateFromTags}
            disabled={isAnalyzing || ingredients.length === 0}
            className="text-xs px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-semibold flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Generate Recipes ({ingredients.length})</span>
          </button>
        </div>
      </div>

      {/* Ingredient Tag Chips */}
      <div className="pt-4 flex flex-wrap gap-2.5 min-h-[50px] items-center">
        {ingredients.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-2">
            No ingredients in the basket. Add some below or upload a photo above!
          </p>
        ) : (
          ingredients.map((item) => (
            <div
              key={item.id}
              className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-amber-500/30 text-sm text-slate-200 transition-all shadow-sm"
            >
              <span className="text-base">{item.icon || '✨'}</span>
              <span className="font-medium text-xs sm:text-sm">{item.name}</span>
              <button
                onClick={() => dispatch(removeIngredient(item.id))}
                className="text-slate-500 hover:text-rose-400 p-0.5 rounded transition-colors"
                title={`Remove ${item.name}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Input Form to add manually */}
      <form onSubmit={handleAdd} className="mt-4 pt-4 border-t border-white/5 flex gap-2">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="Type an ingredient (e.g. Honey, Greek Yogurt, Basil)..."
          className="flex-1 px-4 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-colors border border-white/10"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Add</span>
        </button>
      </form>
    </div>
  );
}
