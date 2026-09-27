interface StartScreenProps {
  onStart: () => void;
  shiftNumber: number;
}

export function StartScreen({ onStart, shiftNumber }: StartScreenProps) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-[#0c0a09] select-none px-4">
      {/* Background Kitchen Canvas with Atmospheric Vignette */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 filter brightness-75 contrast-125"
        style={{
          backgroundImage: `url(/src/assets/images/kitchen_rush_scene_1790510824191.jpg)`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-[#0c0a09]/80 to-transparent" />

      {/* Floating Kitchen Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25">
        {['🍅', '🍳', '🍝', '🍕', '🥩', '🧂', '🛎️'].map((emoji, i) => (
          <div
            key={i}
            className="absolute text-4xl animate-float"
            style={{
              left: `${12 + i * 13}%`,
              top: `${20 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${3.5 + (i % 2)}s`,
            }}
          >
            {emoji}
          </div>
        ))}
      </div>

      {/* Main Content Box */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-xl">
        {/* Chef Avatar Hero */}
        <div className="relative mb-4">
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.5)] overflow-hidden bg-neutral-900 animate-pop">
            <img
              src="/src/assets/images/chef_character_hero_1790510837055.jpg"
              alt="Chef"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-2 -right-1 bg-amber-500 text-neutral-950 font-black text-xs px-2.5 py-0.5 rounded-full border border-yellow-200 shadow uppercase tracking-wider">
            FLOW ARCADE
          </div>
        </div>

        {/* Title */}
        <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-orange-500 tracking-tighter mb-1">
          KITCHEN RUSH
        </h1>

        {/* Core Loop Concept Subtitle */}
        <div className="text-amber-200/90 text-sm md:text-base font-black uppercase tracking-[0.25em] mb-4">
          CONVEYOR RUSH · RIDDLE SERVING
        </div>

        {/* The Flow Kitchen Mechanic Callout */}
        <div className="bg-neutral-900/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 mb-6 text-left w-full shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2.5">
            <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>⚡</span> SPEED REFLEXES + FOOD RIDDLES
            </span>
            <span className="text-[11px] font-bold text-slate-400">
              Shift {shiftNumber}
            </span>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed">
            1. An order appears on the screen with required ingredients.<br/>
            2. Run alongside the <strong className="text-amber-400">conveyor belt</strong> and snatch passing ingredients with <strong className="text-white">SPACE / CLICK</strong> before time runs out!<br/>
            3. When assembled, solve the customer's <strong className="text-amber-400">food riddle MCQ</strong> to deliver the dish!
          </p>
        </div>

        {/* Big Start Button */}
        <button
          onClick={onStart}
          className="group relative px-12 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 rounded-2xl text-neutral-950 font-black text-2xl uppercase tracking-wider shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all transform hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-3"
        >
          <span>START SHIFT</span>
          <span className="text-xl">🛎️</span>
        </button>

        {/* Controls Note */}
        <div className="mt-5 text-slate-400 text-xs font-medium tracking-wide flex items-center gap-3">
          <span>🎮 <strong className="text-white">WASD / ARROW KEYS</strong> to move</span>
          <span>·</span>
          <span><strong className="text-white">SPACE</strong> to interact</span>
        </div>
      </div>
    </div>
  );
}
