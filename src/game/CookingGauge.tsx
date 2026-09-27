import { useEffect, useRef, useState } from 'react';

interface CookingGaugeProps {
  onComplete: (quality: 'perfect' | 'good' | 'burnt') => void;
  speedMultiplier?: number;
}

export function CookingGauge({ onComplete, speedMultiplier = 1 }: CookingGaugeProps) {
  const [needleAngle, setNeedleAngle] = useState(0); // 0 to 180 degrees
  const reqRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(performance.now());
  const completedRef = useRef<boolean>(false);

  // The Green Zone is between 90 and 130 degrees (the sweet spot)
  const GREEN_START = 85;
  const GREEN_END = 125;
  const DURATION_MS = 2400 / Math.min(2, Math.max(0.8, speedMultiplier));

  useEffect(() => {
    startTimeRef.current = performance.now();
    completedRef.current = false;

    const tick = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const progress = elapsed / DURATION_MS;

      if (progress >= 1.25) {
        // Overshot! Food Burnt!
        if (!completedRef.current) {
          completedRef.current = true;
          onComplete('burnt');
        }
        return;
      }

      // Sweep from 0 to 180 degrees
      const angle = Math.min(180, progress * 150);
      setNeedleAngle(angle);

      if (!completedRef.current) {
        reqRef.current = requestAnimationFrame(tick);
      }
    };

    reqRef.current = requestAnimationFrame(tick);
    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, [DURATION_MS, onComplete]);

  // Handle SPACE keypress or click to stop the needle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !completedRef.current) {
        e.preventDefault();
        e.stopPropagation();
        completedRef.current = true;
        if (reqRef.current) cancelAnimationFrame(reqRef.current);

        // Evaluate angle
        if (needleAngle >= GREEN_START && needleAngle <= GREEN_END) {
          onComplete('perfect');
        } else if (needleAngle >= GREEN_START - 25 && needleAngle <= GREEN_END + 25) {
          onComplete('good');
        } else {
          onComplete('burnt');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [needleAngle, onComplete]);

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        if (completedRef.current) return;
        completedRef.current = true;
        if (reqRef.current) cancelAnimationFrame(reqRef.current);
        if (needleAngle >= GREEN_START && needleAngle <= GREEN_END) {
          onComplete('perfect');
        } else if (needleAngle >= GREEN_START - 25 && needleAngle <= GREEN_END + 25) {
          onComplete('good');
        } else {
          onComplete('burnt');
        }
      }}
      className="absolute -top-24 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center cursor-pointer pointer-events-auto filter drop-shadow-xl animate-pop select-none"
    >
      <div className="relative w-28 h-16 bg-neutral-900/95 border-2 border-amber-400 rounded-t-full flex items-end justify-center overflow-hidden px-2 pt-1 pb-1">
        {/* Semi-circular color zones */}
        <svg viewBox="0 0 100 50" className="w-full h-full">
          {/* Base Track */}
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="#374151"
            strokeWidth="12"
          />

          {/* Yellow/Early Zone */}
          <path
            d="M 10 50 A 40 40 0 0 1 35 15"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="12"
          />

          {/* GREEN ZONE (Sweet Spot) */}
          <path
            d="M 35 15 A 40 40 0 0 1 72 17"
            fill="none"
            stroke="#10b981"
            strokeWidth="14"
          />

          {/* Red/Burnt Zone */}
          <path
            d="M 72 17 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="#ef4444"
            strokeWidth="12"
          />

          {/* Needle pivot and arm */}
          <g
            transform={`rotate(${needleAngle - 90}, 50, 50)`}
            style={{ transition: 'none' }}
          >
            <line
              x1="50"
              y1="50"
              x2="50"
              y2="14"
              stroke="#ffffff"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <circle cx="50" cy="50" r="5" fill="#f59e0b" />
          </g>
        </svg>

        {/* Small label inside meter */}
        <div className="absolute top-2 text-[9px] font-black tracking-widest text-emerald-300 uppercase">
          PERFECT ZONE
        </div>
      </div>

      {/* SPACE action prompt button */}
      <div className="mt-1 px-3 py-1 bg-amber-500 text-neutral-950 font-black text-[11px] rounded-full shadow-lg border border-yellow-200 uppercase tracking-wider animate-pulse">
        [SPACE] HIT GREEN!
      </div>
    </div>
  );
}
