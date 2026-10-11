import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Timer,
  Sparkles,
  ChefHat
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  closeCookingMode,
  setCookingStep,
  nextCookingStep,
  prevCookingStep,
} from '../store/pantrySlice';

/**
 * Web Audio API gentle kitchen chime
 */
function playChime() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5

    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 1.2);
  } catch (e) {
    console.warn('Audio chime unsupported:', e);
  }
}

export default function HandsFreeCookingHUD() {
  const dispatch = useDispatch();
  const { isCookingMode, selectedRecipe: recipe, cookingStepIndex } = useSelector(
    (state) => state.pantry
  );

  const [timeLeft, setTimeLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const timerRef = useRef(null);

  const instructions = recipe?.instructions || [];
  const currentStep = instructions[cookingStepIndex] || null;
  const isLastStep = cookingStepIndex === instructions.length - 1;

  // Sync step duration when step index changes
  useEffect(() => {
    if (currentStep) {
      const minutes = currentStep.durationMinutes || 3;
      setTimeLeft(minutes * 60);
      setTimerRunning(false);
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
    }
  }, [cookingStepIndex, currentStep]);

  // Countdown timer effect
  useEffect(() => {
    if (timerRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setTimerRunning(false);
            playChime();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [timerRunning, timeLeft]);

  // Handle TTS
  const speakCurrentStep = () => {
    if (!('speechSynthesis' in window) || !currentStep) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToRead = `Step ${cookingStepIndex + 1}: ${currentStep.title}. ${currentStep.text} Chef's tip: ${currentStep.tip || ''}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleFinish = () => {
    // Launch celebratory confetti
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F59E0B', '#10B981', '#38BDF8', '#F43F5E'],
    });
    playChime();
  };

  if (!isCookingMode || !recipe || !currentStep) return null;

  const initialDuration = (currentStep.durationMinutes || 3) * 60;
  const progressPercent = initialDuration > 0 ? ((initialDuration - timeLeft) / initialDuration) * 100 : 0;

  const minutesDisplay = Math.floor(timeLeft / 60);
  const secondsDisplay = (timeLeft % 60).toString().padStart(2, '0');

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0F17] flex flex-col justify-between p-4 sm:p-8 text-white select-none overflow-hidden">
      
      {/* Top Bar: Progress and Controls */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight truncate max-w-xs sm:max-w-md">
              {recipe.title}
            </h1>
            <p className="text-xs text-amber-400 font-semibold">
              Step {cookingStepIndex + 1} of {instructions.length}
            </p>
          </div>
        </div>

        {/* Exit & TTS */}
        <div className="flex items-center gap-3">
          <button
            onClick={speakCurrentStep}
            className={`p-3 rounded-2xl border transition-all flex items-center gap-2 text-xs font-bold ${
              isSpeaking
                ? 'bg-amber-500 text-black border-amber-400 animate-pulse'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
            }`}
            title="Read instructions aloud (Text-to-Speech)"
          >
            {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-amber-400" />}
            <span className="hidden sm:inline">{isSpeaking ? 'Mute Voice' : 'Read Aloud'}</span>
          </button>

          <button
            onClick={() => {
              window.speechSynthesis?.cancel();
              dispatch(closeCookingMode());
            }}
            className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors"
            title="Exit HUD"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Step Progress Dots */}
      <div className="max-w-5xl mx-auto w-full my-4">
        <div className="flex items-center gap-2">
          {instructions.map((_, idx) => (
            <div
              key={idx}
              onClick={() => dispatch(setCookingStep(idx))}
              className={`h-2 rounded-full flex-1 cursor-pointer transition-all duration-300 ${
                idx === cookingStepIndex
                  ? 'bg-amber-500 shadow-md shadow-amber-500/50'
                  : idx < cookingStepIndex
                  ? 'bg-emerald-500/70'
                  : 'bg-white/10'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Center Stage: High-contrast, large-format step card */}
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col justify-center items-center text-center my-auto py-6 space-y-6">
        
        {/* Step Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs uppercase tracking-widest">
          <Sparkles className="w-4 h-4" />
          <span>{currentStep.title || `Phase ${cookingStepIndex + 1}`}</span>
        </div>

        {/* Large readable text */}
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight max-w-3xl">
          {currentStep.text}
        </h2>

        {/* Chef tip */}
        {currentStep.tip && (
          <div className="max-w-xl mx-auto p-4 rounded-2xl bg-slate-900/80 border border-white/10 text-slate-300 text-sm sm:text-base flex items-center justify-center gap-3">
            <span className="text-xl">💡</span>
            <span className="italic text-slate-300">"{currentStep.tip}"</span>
          </div>
        )}

        {/* Integrated Step Timer Widget */}
        <div className="flex flex-col items-center pt-2">
          <div className="flex items-center gap-4 bg-slate-900/90 px-6 py-3.5 rounded-3xl border border-white/10 shadow-2xl">
            <div className="flex items-center gap-2">
              <Timer className={`w-5 h-5 ${timeLeft === 0 ? 'text-emerald-400 animate-bounce' : 'text-amber-400'}`} />
              <span className="text-2xl sm:text-3xl font-mono font-bold tracking-wider text-white">
                {minutesDisplay}:{secondsDisplay}
              </span>
            </div>

            <div className="flex items-center gap-2 border-l border-white/10 pl-4">
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className={`p-2.5 rounded-xl text-xs font-bold transition-all ${
                  timerRunning
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
                title={timerRunning ? 'Pause' : 'Start Timer'}
              >
                {timerRunning ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-white" />}
              </button>

              <button
                onClick={() => {
                  setTimeLeft((currentStep.durationMinutes || 3) * 60);
                  setTimerRunning(false);
                }}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Bar: Prev / Next / Complete */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between border-t border-white/10 pt-4">
        <button
          onClick={() => dispatch(prevCookingStep())}
          disabled={cookingStepIndex === 0}
          className="px-6 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm flex items-center gap-2 transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-white/10"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Previous Step</span>
        </button>

        {isLastStep ? (
          <button
            onClick={handleFinish}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold text-sm flex items-center gap-2 shadow-xl shadow-emerald-500/25 transition-all transform hover:scale-105"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Finish Recipe & Celebrate 🎉</span>
          </button>
        ) : (
          <button
            onClick={() => dispatch(nextCookingStep())}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold text-sm flex items-center gap-2 shadow-xl shadow-amber-500/25 transition-all transform hover:scale-105"
          >
            <span>Next Step</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

    </div>
  );
}
