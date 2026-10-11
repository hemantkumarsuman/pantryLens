import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setApiKey } from '../store/pantrySlice';
import { Key, ExternalLink, CheckCircle, AlertCircle, X, ShieldCheck } from 'lucide-react';

export default function ApiKeyModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const currentKey = useSelector((state) => state.pantry.apiKey);
  const [keyValue, setKeyValue] = useState(currentKey);
  const [testStatus, setTestStatus] = useState(null); // 'testing' | 'success' | 'error' | null
  const [testMessage, setTestMessage] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    dispatch(setApiKey(keyValue.trim()));
    onClose();
  };

  const handleClear = () => {
    setKeyValue('');
    dispatch(setApiKey(''));
    setTestStatus(null);
  };

  const testConnection = async () => {
    if (!keyValue.trim()) {
      setTestStatus('error');
      setTestMessage('Please enter an API key first.');
      return;
    }

    setTestStatus('testing');
    setTestMessage('Pinging Gemini Flash...');

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${keyValue.trim()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Respond with just one word: Culinary.' }] }],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      setTestStatus('success');
      setTestMessage(`Connected successfully! Gemini replied: "${reply?.trim() || 'OK'}"`);
    } catch (err) {
      setTestStatus('error');
      setTestMessage(err.message || 'Connection failed. Verify your key.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg p-6 rounded-2xl glass-panel-glow border border-white/10 text-white shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Gemini API Key</h2>
            <p className="text-xs text-slate-400">Free Tier friendly (15 requests/minute, no credit card required)</p>
          </div>
        </div>

        <p className="text-sm text-slate-300 mb-4 leading-relaxed">
          PantryLens uses Google Gemini 1.5/2.0 Flash for instant ingredient recognition and gourmet recipe generation. Your API key is stored locally in your browser.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              API Key (AIzaSy...)
            </label>
            <input
              type="password"
              value={keyValue}
              onChange={(e) => {
                setKeyValue(e.target.value);
                setTestStatus(null);
              }}
              placeholder="Paste your Gemini API key here"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono text-sm text-white placeholder-slate-600 transition-all"
            />
          </div>

          {/* Test Status feedback */}
          {testStatus && (
            <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              testStatus === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' :
              testStatus === 'error' ? 'bg-rose-500/10 border border-rose-500/30 text-rose-300' :
              'bg-amber-500/10 border border-amber-500/30 text-amber-300'
            }`}>
              {testStatus === 'success' && <CheckCircle className="w-4 h-4 shrink-0" />}
              {testStatus === 'error' && <AlertCircle className="w-4 h-4 shrink-0" />}
              {testStatus === 'testing' && <div className="w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin shrink-0" />}
              <span className="truncate">{testMessage}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 underline underline-offset-4"
            >
              Get free Gemini API Key at Google AI Studio
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              type="button"
              onClick={testConnection}
              disabled={testStatus === 'testing'}
              className="text-xs px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors"
            >
              {testStatus === 'testing' ? 'Testing...' : 'Test Key'}
            </button>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-slate-500 hover:text-rose-400 transition-colors"
            >
              Clear Stored Key
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black shadow-lg shadow-amber-500/20 transition-all font-bold"
              >
                Save & Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
