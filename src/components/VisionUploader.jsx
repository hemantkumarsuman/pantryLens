import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Camera, Upload, Sparkles, Image as ImageIcon, Flame, CheckCircle2 } from 'lucide-react';
import { analyzePantryImage, getCategoryIcon } from '../services/geminiService';
import {
  setUploadedImage,
  setIsAnalyzing,
  setAnalysisStatus,
  setIngredients,
  setRecipes,
  setError,
} from '../store/pantrySlice';

// Sample pantry presets with realistic culinary ingredients
const SAMPLE_PRESETS = [
  {
    name: 'Farmhouse Breakfast',
    icon: '🍳',
    ingredients: [
      { id: 'p1', name: 'Eggs', category: 'protein', icon: '🥚' },
      { id: 'p2', name: 'Avocado', category: 'produce', icon: '🥑' },
      { id: 'p3', name: 'Sourdough Bread', category: 'bakery', icon: '🍞' },
      { id: 'p4', name: 'Baby Spinach', category: 'produce', icon: '🥬' },
      { id: 'p5', name: 'Cherry Tomatoes', category: 'produce', icon: '🍅' },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Midnight Bistro Pasta',
    icon: '🍝',
    ingredients: [
      { id: 'p6', name: 'Fettuccine Pasta', category: 'pantry', icon: '🍝' },
      { id: 'p7', name: 'Garlic', category: 'pantry', icon: '🧄' },
      { id: 'p8', name: 'Extra Virgin Olive Oil', category: 'pantry', icon: '🫒' },
      { id: 'p9', name: 'Parmigiano Reggiano', category: 'dairy', icon: '🧀' },
      { id: 'p10', name: 'Red Chili Flakes', category: 'pantry', icon: '🌶️' },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Crispy Stir-Fry Wok',
    icon: '🥢',
    ingredients: [
      { id: 'p11', name: 'Firm Tofu', category: 'protein', icon: '🧈' },
      { id: 'p12', name: 'Broccoli Florets', category: 'produce', icon: '🥦' },
      { id: 'p13', name: 'Bell Peppers', category: 'produce', icon: '🫑' },
      { id: 'p14', name: 'Soy Sauce', category: 'pantry', icon: '🥢' },
      { id: 'p15', name: 'Sesame Seeds', category: 'pantry', icon: '✨' },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80',
  },
];

export default function VisionUploader({ onOpenApiKeyModal }) {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const { apiKey, uploadedImage, isAnalyzing, analysisStatus } = useSelector((state) => state.pantry);
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processImageFile(file);
  };

  const processImageFile = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result;
      dispatch(setUploadedImage(dataUrl));
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processImageFile(file);
    }
  };

  const handleAnalyzeWithGemini = async () => {
    if (!apiKey) {
      onOpenApiKeyModal();
      return;
    }

    if (!uploadedImage) {
      dispatch(setError('Please upload or select an image of your ingredients first!'));
      return;
    }

    try {
      dispatch(setIsAnalyzing(true));
      dispatch(setError(null));
      dispatch(setAnalysisStatus('Scanning ingredients with Gemini Vision...'));

      // Extract base64 without prefix
      const match = uploadedImage.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
      let mimeType = 'image/jpeg';
      let base64Data = '';

      if (match) {
        mimeType = match[1];
        base64Data = match[2];
      } else {
        // Fallback fetch if it was a URL
        const res = await fetch(uploadedImage);
        const blob = await res.blob();
        mimeType = blob.type || 'image/jpeg';
        const buffer = await blob.arrayBuffer();
        base64Data = btoa(
          new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
      }

      dispatch(setAnalysisStatus('Detecting culinary ingredients & flavors...'));
      const result = await analyzePantryImage(apiKey, base64Data, mimeType);

      dispatch(setAnalysisStatus('Crafting 3 Michelin-grade recipes...'));

      if (result.detectedIngredients && result.detectedIngredients.length > 0) {
        const formattedIngredients = result.detectedIngredients.map((item, idx) => ({
          id: `detected-${idx}-${Date.now()}`,
          name: item.name,
          category: item.category || 'produce',
          icon: getCategoryIcon(item.category, item.name),
        }));
        dispatch(setIngredients(formattedIngredients));
      }

      if (result.recipes && result.recipes.length > 0) {
        dispatch(setRecipes(result.recipes));
      }

      dispatch(setIsAnalyzing(false));
      dispatch(setAnalysisStatus(''));
    } catch (err) {
      dispatch(setIsAnalyzing(false));
      dispatch(setAnalysisStatus(''));
      dispatch(setError(err.message || 'Analysis failed. Please verify your Gemini API key.'));
    }
  };

  const applyPreset = (preset) => {
    dispatch(setUploadedImage(preset.imageUrl));
    dispatch(setIngredients(preset.ingredients));
  };

  return (
    <div className="w-full glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
      {/* Background ambient decorative glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
        
        {/* Left: Dropzone / Preview */}
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`w-full aspect-[4/3] rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center p-4 relative overflow-hidden group ${
              dragOver
                ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
                : uploadedImage
                ? 'border-white/20 bg-slate-900/60'
                : 'border-white/15 bg-white/[0.02] hover:border-amber-500/50 hover:bg-white/[0.04]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            {uploadedImage ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={uploadedImage}
                  alt="Pantry Upload"
                  className="w-full h-full object-cover rounded-xl shadow-lg"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl backdrop-blur-xs">
                  <span className="px-4 py-2 rounded-xl bg-black/80 text-white text-xs font-semibold flex items-center gap-2 border border-white/20">
                    <Camera className="w-4 h-4 text-amber-400" />
                    Change Image
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center p-6 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                  <Upload className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    Drop a photo of your fridge or pantry
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    PNG, JPG, or WEBP • Drag & drop or click to browse
                  </p>
                </div>
                <span className="text-[11px] px-3 py-1 rounded-full bg-white/5 text-amber-300/80 border border-white/10">
                  ✨ Gemini Vision detects ingredients automatically
                </span>
              </div>
            )}
          </div>

          {/* Quick Presets */}
          <div className="w-full mt-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Or try a ready pantry scene:
            </p>
            <div className="grid grid-cols-3 gap-2">
              {SAMPLE_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="px-2.5 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-amber-500/40 text-left transition-all flex items-center gap-2 group"
                >
                  <span className="text-lg group-hover:scale-125 transition-transform">{preset.icon}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-200 truncate">{preset.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{preset.ingredients.length} items</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Action & Explanation */}
        <div className="w-full md:w-1/2 flex flex-col justify-between space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold mb-3">
              <Flame className="w-3.5 h-3.5" />
              Zero Food Waste Cooking
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              Turn Whatever's In Your Fridge Into a <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Gourmet Feast</span>.
            </h1>
            <p className="text-sm text-slate-300 mt-3 leading-relaxed">
              Upload a snapshot of your refrigerator or pantry. Gemini AI extracts every visible ingredient, computes macronutrient ratios, and invents creative recipes in seconds.
            </p>
          </div>

          {/* Analysis Button */}
          <div className="space-y-3">
            <button
              onClick={handleAnalyzeWithGemini}
              disabled={isAnalyzing}
              className={`w-full py-4 px-6 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-3 transition-all duration-300 ${
                isAnalyzing
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-white/10'
                  : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:via-orange-400 hover:to-amber-500 text-black shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.01]'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                  <span>{analysisStatus || 'Analyzing with Gemini Vision...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-black" />
                  <span>{uploadedImage ? 'Analyze Ingredients with Gemini Vision' : 'Select Photo & Generate Recipes'}</span>
                </>
              )}
            </button>

            {!apiKey && (
              <p className="text-center text-xs text-amber-400/90 flex items-center justify-center gap-1.5">
                <span>Free Gemini API Key needed for live AI.</span>
                <button
                  onClick={onOpenApiKeyModal}
                  className="underline font-semibold hover:text-amber-300"
                >
                  Enter key here
                </button>
              </p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
