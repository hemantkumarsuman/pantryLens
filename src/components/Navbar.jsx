import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Key, Sparkles, RefreshCw, ChefHat } from 'lucide-react';
import { loadDemoKitchen } from '../store/pantrySlice';

export default function Navbar({ onOpenApiKeyModal }) {
  const dispatch = useDispatch();
  const apiKey = useSelector((state) => state.pantry.apiKey);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0B0F17]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 p-0.5 shadow-lg shadow-orange-500/20">
            <div className="w-full h-full bg-[#0B0F17] rounded-[10px] flex items-center justify-center text-xl">
              🍳
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                PantryLens
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-widest">
                AI Vision
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Culinary Vision & Smart Kitchen Engine
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          {/* Quick Demo Reload */}
          <button
            onClick={() => dispatch(loadDemoKitchen())}
            title="Load sample fresh pantry & recipes"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Demo Kitchen</span>
          </button>

          {/* API Key Status / Config */}
          <button
            onClick={onOpenApiKeyModal}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              apiKey
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${apiKey ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <Key className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {apiKey ? 'Gemini Connected' : 'Set Gemini Key'}
            </span>
          </button>
        </div>

      </div>
    </header>
  );
}
