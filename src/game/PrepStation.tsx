import { useEffect, useRef, useState, useCallback } from 'react';
import type { Order, PrepStep } from './types';

interface PrepStationProps {
  order: Order;
  step: PrepStep;
  onProgress: (amount: number, correct: boolean) => void;
  onBurn: () => void;
}

// ── CHOP: rapid click/tap ────────────────────────────────────
function ChopGame({ step, onProgress }: { step: PrepStep; onProgress: (n: number, b: boolean) => void }) {
  const [taps, setTaps] = useState(0);
  const [hitFlash, setHitFlash] = useState(false);
  const target = step.target;

  const handleTap = useCallback(() => {
    setTaps((t) => {
      const nt = t + 1;
      setHitFlash(true);
      setTimeout(() => setHitFlash(false), 80);
      onProgress(1, true);
      return nt;
    });
  }, [onProgress]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-cream/80 text-sm uppercase tracking-widest">Rapid Tap to Chop!</div>
      <div className="text-cream/50 text-xs">{taps} / {target} chops</div>
      <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-green-400 to-yellow-400 transition-all duration-100" style={{ width: `${Math.min(100, (taps / target) * 100)}%` }} />
      </div>
      <button
        onClick={handleTap}
        className={`relative w-32 h-32 rounded-full bg-gradient-to-br from-red-500 to-orange-600 border-4 border-cream/30 active:scale-90 transition-transform shadow-lg ${hitFlash ? 'ring-8 ring-yellow-300/60' : ''}`}
      >
        <span className="text-5xl">🔪</span>
        <span className="absolute inset-0 flex items-center justify-center text-3xl opacity-40">CHOP!</span>
      </button>
    </div>
  );
}

// ── COOK: temperature control + flip timing ─────────────────
function CookGame({ step, onProgress, onBurn, burnLevel }: { step: PrepStep; onProgress: (n: number, b: boolean) => void; onBurn: () => void; burnLevel: number }) {
  const [temp, setTemp] = useState(50);
  const [cooking, setCooking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [flipWindow, setFlipWindow] = useState(false);
  const [, setFlipTimer] = useState(0);
  const [flips, setFlips] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const target = step.target;
  const idealMin = 40;
  const idealMax = 70;

  useEffect(() => {
    if (!cooking) return;
    intervalRef.current = window.setInterval(() => {
      setProgress((p) => {
        const inRange = temp >= idealMin && temp <= idealMax;
        if (inRange) {
          return Math.min(target, p + 0.15);
        } else if (temp > idealMax) {
          onBurn();
        }
        return p;
      });
      setFlipTimer((ft) => {
        if (ft > 0) {
          if (ft <= 0.1) {
            // Flip window open!
            setFlipWindow(true);
            setTimeout(() => setFlipWindow(false), 600);
          }
          return Math.max(0, ft - 0.1);
        }
        // Trigger next flip window
        return 1.5 + Math.random();
      });
    }, 100);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [cooking, temp, target, onBurn]);

  useEffect(() => {
    if (progress >= target) {
      onProgress(target, true);
      setCooking(false);
    }
  }, [progress, target, onProgress]);

  const handleFlip = () => {
    if (flipWindow) {
      setFlips((f) => f + 1);
      onProgress(0.5, true);
      setFlipWindow(false);
      setFlipTimer(1.5 + Math.random());
    } else {
      onProgress(0, false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-cream/80 text-sm uppercase tracking-widest">Control Heat & Flip!</div>
      <div className="text-cream/50 text-xs">Cooking: {progress.toFixed(1)} / {target}s | Flips: {flips}</div>
      {/* Temperature gauge */}
      <div className="w-full flex items-center gap-2">
        <span className="text-blue-400 text-xs w-8">COOL</span>
        <input
          type="range"
          min={0}
          max={100}
          value={temp}
          onChange={(e) => setTemp(Number(e.target.value))}
          className="flex-1 accent-orange-500"
        />
        <span className="text-red-400 text-xs w-8">HOT</span>
      </div>
      <div className="text-xs" style={{ color: temp >= idealMin && temp <= idealMax ? '#2ecc71' : '#e74c3c' }}>
        {temp < idealMin ? 'TOO COLD' : temp > idealMax ? 'TOO HOT — BURNING!' : 'PERFECT HEAT'}
      </div>
      {/* Burn bar */}
      <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-yellow-600 to-red-700 transition-all" style={{ width: `${burnLevel * 100}%` }} />
      </div>
      {/* Pan */}
      <button
        onClick={handleFlip}
        disabled={!cooking}
        className={`relative w-28 h-28 rounded-full border-4 transition-all active:scale-90 ${flipWindow ? 'border-yellow-300 ring-8 ring-yellow-300/50 animate-pulse' : 'border-cream/20'} ${cooking ? 'bg-gradient-to-br from-gray-700 to-gray-900' : 'bg-gray-800'}`}
      >
        <span className="text-4xl">🍳</span>
        {flipWindow && <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-yellow-300 font-bold text-sm animate-bounce">FLIP!</span>}
      </button>
      {!cooking && (
        <button onClick={() => setCooking(true)} className="px-6 py-2 bg-orange-600 rounded-lg text-cream font-bold uppercase tracking-wide hover:bg-orange-500">
          Start Cooking
        </button>
      )}
    </div>
  );
}

// ── SEASON: timing-based click ───────────────────────────────
function SeasonGame({ step, onProgress }: { step: PrepStep; onProgress: (n: number, b: boolean) => void }) {
  const [position, setPosition] = useState(0);
  const [seasons, setSeasons] = useState(0);
  const [feedback, setFeedback] = useState<'perfect' | 'ok' | 'miss' | null>(null);
  const target = step.target;
  const rafRef = useRef<number>(0);

  useEffect(() => {
    let pos = 0;
    let d = 1;
    const animate = () => {
      pos += d * 1.8;
      if (pos >= 100) { pos = 100; d = -1; }
      if (pos <= 0) { pos = 0; d = 1; }
      setPosition(pos);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Target zone: 40-60
  const handleSeason = () => {
    if (position >= 40 && position <= 60) {
      setFeedback('perfect');
      onProgress(1, true);
      setSeasons((s) => s + 1);
    } else if (position >= 30 && position <= 70) {
      setFeedback('ok');
      onProgress(0.5, true);
      setSeasons((s) => s + 1);
    } else {
      setFeedback('miss');
      onProgress(0, false);
    }
    setTimeout(() => setFeedback(null), 300);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-cream/80 text-sm uppercase tracking-widest">Hit the Sweet Spot!</div>
      <div className="text-cream/50 text-xs">{seasons} / {target} seasons</div>
      <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-green-400 to-yellow-400 transition-all duration-100" style={{ width: `${Math.min(100, (seasons / target) * 100)}%` }} />
      </div>
      {/* Slider track */}
      <div className="relative w-full h-12 bg-black/50 rounded-lg overflow-hidden border-2 border-cream/10">
        {/* Target zone */}
        <div className="absolute top-0 bottom-0 bg-green-500/30 border-x-2 border-green-400" style={{ left: '40%', width: '20%' }} />
        <div className="absolute top-0 bottom-0 bg-yellow-500/20 border-x-2 border-yellow-400/50" style={{ left: '30%', width: '40%' }} />
        {/* Moving marker */}
        <div className="absolute top-0 bottom-0 w-1.5 bg-yellow-300 shadow-lg shadow-yellow-300/50" style={{ left: `${position}%` }} />
      </div>
      <button
        onClick={handleSeason}
        className={`px-8 py-3 rounded-lg font-bold uppercase tracking-wide transition-all active:scale-90 ${feedback === 'perfect' ? 'bg-green-500 text-black' : feedback === 'miss' ? 'bg-red-600' : 'bg-purple-600 text-cream hover:bg-purple-500'}`}
      >
        {feedback === 'perfect' ? 'PERFECT!' : feedback === 'ok' ? 'OK!' : feedback === 'miss' ? 'MISS!' : 'SEASON! 🧂'}
      </button>
    </div>
  );
}

// ── PLATE: drag ingredients in order ─────────────────────────
function PlateGame({ step, onProgress }: { step: PrepStep; onProgress: (n: number, b: boolean) => void }) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [next, setNext] = useState(0);
  const target = step.target;
  const items = Array.from({ length: target }, (_, i) => i);
  const [wrongFlash, setWrongFlash] = useState(false);

  const handleClick = (item: number) => {
    if (item === next) {
      const ns = [...sequence, item];
      setSequence(ns);
      setNext(next + 1);
      onProgress(1, true);
      if (ns.length >= target) {
        setSequence([]);
        setNext(0);
      }
    } else {
      setWrongFlash(true);
      setTimeout(() => setWrongFlash(false), 300);
      onProgress(0, false);
      setSequence([]);
      setNext(0);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-cream/80 text-sm uppercase tracking-widest">Tap in Order!</div>
      <div className="text-cream/50 text-xs">{sequence.length} / {target} placed</div>
      <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-green-400 to-yellow-400 transition-all duration-100" style={{ width: `${(sequence.length / target) * 100}%` }} />
      </div>
      <div className={`grid grid-cols-4 gap-3 ${wrongFlash ? 'animate-shake' : ''}`}>
        {items.map((item) => {
          const placed = sequence.includes(item);
          const isNext = item === next;
          return (
            <button
              key={item}
              onClick={() => handleClick(item)}
              disabled={placed}
              className={`w-16 h-16 rounded-lg border-2 flex items-center justify-center text-2xl transition-all active:scale-90 ${placed ? 'bg-green-600/40 border-green-400 opacity-30' : isNext ? 'bg-orange-600 border-yellow-300 ring-4 ring-yellow-300/30 animate-pulse' : 'bg-gray-700 border-cream/20 hover:bg-gray-600'}`}
            >
              {placed ? '✓' : ['🍞', '🥬', '🥩', '🧀', '🍅', '🥒', '🧅', '🫑'][item % 8]}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Main PrepStation ─────────────────────────────────────────
export function PrepStation({ order, step, onProgress, onBurn }: PrepStationProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-center">
        <div className="text-cream/50 text-xs uppercase tracking-widest mb-1">Now Preparing</div>
        <div className="text-2xl font-black text-cream">{order.recipe.emoji} {order.recipe.name}</div>
        <div className="text-orange-400 text-sm font-bold mt-1">Step {order.stepIndex + 1}/{order.recipe.steps.length}: {step.label}</div>
      </div>
      <div className="bg-black/30 rounded-xl p-4 border border-cream/10">
        {step.type === 'chop' && <ChopGame step={step} onProgress={onProgress} />}
        {step.type === 'cook' && <CookGame step={step} onProgress={onProgress} onBurn={onBurn} burnLevel={order.burnLevel} />}
        {step.type === 'season' && <SeasonGame step={step} onProgress={onProgress} />}
        {step.type === 'plate' && <PlateGame step={step} onProgress={onProgress} />}
      </div>
    </div>
  );
}
