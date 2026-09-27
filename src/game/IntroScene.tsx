import { useEffect, useState } from 'react';
import { sounds } from './sound';

interface IntroSceneProps {
  onComplete: () => void;
  shiftNumber: number;
}

export function IntroScene({ onComplete, shiftNumber }: IntroSceneProps) {
  const [step, setStep] = useState(0); // 0 = dark, 1 = light 1, 2 = light 2, 3 = all lights, 4 = chef walks in, 5 = hat on, 6 = bell rings, 7 = ready
  const [chefX, setChefX] = useState(-20); // Walking in from left

  useEffect(() => {
    // Sequence timing
    const timers: NodeJS.Timeout[] = [];

    // Step 1: Light 1 (Click)
    timers.push(
      setTimeout(() => {
        setStep(1);
        sounds.step();
      }, 700)
    );

    // Step 2: Light 2 (Click)
    timers.push(
      setTimeout(() => {
        setStep(2);
        sounds.step();
      }, 1500)
    );

    // Step 3: All Lights ON (Full Kitchen Bright)
    timers.push(
      setTimeout(() => {
        setStep(3);
        sounds.plate();
      }, 2300)
    );

    // Step 4: Chef walks in
    timers.push(
      setTimeout(() => {
        setStep(4);
        setChefX(45); // Walk to center
        sounds.step();
      }, 3100)
    );

    // Step 5: Puts on Chef Hat
    timers.push(
      setTimeout(() => {
        setStep(5);
        sounds.pickup();
      }, 4500)
    );

    // Step 6: Restaurant Bell DING!
    timers.push(
      setTimeout(() => {
        setStep(6);
        sounds.serve();
      }, 5800)
    );

    // Step 7: Title Card: FIRST SHIFT / LET'S COOK
    timers.push(
      setTimeout(() => {
        setStep(7);
      }, 6700)
    );

    // Complete into gameplay
    timers.push(
      setTimeout(() => {
        onComplete();
      }, 8600)
    );

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  // Handle SPACE to skip
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'Enter') {
        e.preventDefault();
        onComplete();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onComplete]);

  return (
    <div
      onClick={onComplete}
      className="relative w-full h-full bg-[#0a0505] overflow-hidden flex flex-col items-center justify-center select-none cursor-pointer"
    >
      {/* Background Kitchen Scene */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{
          backgroundImage: `url(/src/assets/images/kitchen_rush_scene_1790510824191.jpg)`,
          opacity: step === 0 ? 0.05 : step === 1 ? 0.25 : step === 2 ? 0.55 : 0.9,
          filter: step < 3 ? 'brightness(40%) contrast(140%)' : 'brightness(95%) contrast(110%)',
        }}
      />

      {/* Lighting overlay effects */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent transition-opacity duration-700 pointer-events-none"
        style={{ opacity: step >= 3 ? 0.4 : 0.85 }}
      />

      {/* Spotlights coming on */}
      {step >= 1 && (
        <div className="absolute top-0 left-1/4 w-72 h-96 bg-amber-400/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      )}
      {step >= 2 && (
        <div className="absolute top-0 right-1/4 w-72 h-96 bg-amber-300/25 rounded-full blur-3xl pointer-events-none animate-pulse" />
      )}

      {/* Light CLICK text cues */}
      <div className="absolute top-16 z-20 flex gap-6 text-sm font-black uppercase tracking-[0.3em] text-amber-300/80">
        {step >= 1 && <span className="animate-pop">CLICK.</span>}
        {step >= 2 && <span className="animate-pop">CLICK.</span>}
        {step >= 3 && <span className="animate-pop">CLICK.</span>}
      </div>

      {/* Animated Walking Chef in center */}
      {step >= 4 && (
        <div
          className="absolute bottom-24 z-20 transition-all duration-1000 ease-out flex flex-col items-center"
          style={{ left: `${chefX}%` }}
        >
          {/* Chef Hat popping on */}
          {step >= 5 && (
            <div className="text-4xl -mb-4 z-30 animate-pop">👨‍🍳</div>
          )}

          {/* Expressive Chef Hero Portrait */}
          <div className="w-36 h-36 rounded-full border-4 border-amber-400/60 shadow-[0_0_30px_rgba(245,158,11,0.5)] overflow-hidden bg-neutral-900/90 animate-fade-in">
            <img
              src="/src/assets/images/chef_character_hero_1790510837055.jpg"
              alt="Chef"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="w-32 h-4 bg-black/60 rounded-full blur-sm mt-2" />
        </div>
      )}

      {/* Restaurant bell ring wave */}
      {step >= 6 && (
        <div className="absolute top-1/3 z-30 flex flex-col items-center animate-bounce">
          <div className="text-5xl mb-2">🛎️</div>
          <div className="text-xs font-black tracking-widest text-amber-300 uppercase px-3 py-1 bg-black/70 rounded-full border border-amber-400/40">
            * DING! ORDER UP *
          </div>
        </div>
      )}

      {/* Final Shift Title Card */}
      {step >= 7 && (
        <div className="relative z-40 text-center flex flex-col items-center animate-banner-pop px-6">
          <div className="text-amber-400 text-sm font-black uppercase tracking-[0.4em] mb-2">
            SHIFT {shiftNumber}
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 tracking-tighter mb-2">
            {shiftNumber === 1 ? 'FIRST SHIFT' : 'DINNER RUSH'}
          </h1>
          <div className="text-xl md:text-2xl font-black text-white tracking-widest uppercase">
            LET'S COOK.
          </div>
        </div>
      )}

      {/* Skip button hint */}
      <div className="absolute bottom-6 right-6 z-40 flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900/80 border border-white/20 text-xs font-black text-slate-300 hover:text-white uppercase tracking-wider">
        <span>SPACE — SKIP</span>
      </div>
    </div>
  );
}
