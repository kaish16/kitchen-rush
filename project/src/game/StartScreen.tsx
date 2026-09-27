interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a0a0a] via-[#2d0a1e] to-[#0a0a0a]" />
      <div className="absolute inset-0 opacity-20">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-4xl animate-float"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${3 + (i % 4)}s`,
            }}
          >
            {['🍅', '🥬', '🧀', '🥩', '🐟', '🍚', '🥚', '🍜', '🌶️', '🧅'][i % 10]}
          </div>
        ))}
      </div>
      {/* Steam effect */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="absolute bottom-0 w-32 h-64 bg-gradient-to-t from-white/5 to-transparent rounded-full blur-2xl animate-steam"
            style={{ left: `${10 + i * 20}%`, animationDelay: `${i * 0.5}s` }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center px-6">
        <div className="text-orange-500 text-sm font-bold uppercase tracking-[0.3em] mb-2 animate-fade-in">JOBLESS 2.0 presents</div>
        <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 mb-2 animate-title-pop tracking-tighter">
          KITCHEN RUSH
        </h1>
        <div className="text-cream/60 text-lg mb-1 font-bold uppercase tracking-widest">The Chef Survival Shift</div>
        <div className="text-cream/40 text-sm mb-8 max-w-md mx-auto">
          You're an unemployed engineer. Tonight you survive your first shift as a professional chef.
          Chop, cook, season, and plate before the customers walk.
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 max-w-lg mx-auto">
          {['🔪 CHOP', '🍳 COOK', '🧂 SEASON', '🍽️ PLATE', '🔥 COMBOS', '⚡ CHAOS METER', '🎉 SPECIAL EVENTS', '🍽️ DINNER RUSH'].map((f) => (
            <span key={f} className="px-3 py-1 rounded-full bg-cream/5 border border-cream/10 text-cream/70 text-xs font-bold">
              {f}
            </span>
          ))}
        </div>

        <button
          onClick={onStart}
          className="group relative px-12 py-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl text-cream font-black text-2xl uppercase tracking-wider hover:scale-105 transition-transform shadow-2xl shadow-orange-500/30"
        >
          <span className="relative z-10">START SHIFT</span>
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>

        <div className="mt-8 text-cream/30 text-xs">Survive 2.5 minutes. Don't burn the food.</div>
      </div>
    </div>
  );
}
