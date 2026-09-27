import type { StationConfig, StationType } from './types';

interface KitchenEnvironmentProps {
  stations: StationConfig[];
  activeStation: StationType | null;
  targetStation: StationType | null;
  isRearranging: boolean;
  onStationDrag?: (id: StationType, newX: number, newY: number) => void;
  stoveCooking: boolean;
  ovenCooking: boolean;
  powerFlicker: boolean;
}

export function KitchenEnvironment({
  stations,
  activeStation,
  targetStation,
  isRearranging,
  onStationDrag,
  stoveCooking,
  ovenCooking,
  powerFlicker,
}: KitchenEnvironmentProps) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden select-none transition-opacity duration-300 ${
        powerFlicker ? 'opacity-40 filter brightness-50' : 'opacity-100'
      }`}
    >
      {/* ── 1. KITCHEN FLOOR (Checkerboard & Warm Wood Planks with Studio Lights) ── */}
      <div className="absolute inset-0 bg-[#14100e]">
        {/* Subtle diagonal warm checkerboard tiles */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `
              linear-gradient(45deg, #382d24 25%, transparent 25%),
              linear-gradient(-45deg, #382d24 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #382d24 75%),
              linear-gradient(-45deg, transparent 75%, #382d24 75%)
            `,
            backgroundSize: '48px 48px',
            backgroundPosition: '0 0, 0 24px, 24px -24px, -24px 0px',
          }}
        />

        {/* Ambient warm overhead spotlights on the kitchen floor */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl h-48 bg-amber-400/5 blur-3xl pointer-events-none" />
      </div>

      {/* ── 2. BACK WALL & STAINLESS STEEL SPLASHBACK ──────────── */}
      <div className="absolute top-0 left-0 right-0 h-44 bg-gradient-to-b from-[#1b1c1e] to-[#25282c] border-b-4 border-[#3a3f45] shadow-xl">
        {/* Subway tiles texture */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '36px 18px',
          }}
        />

        {/* Stainless Steel Kitchen Exhaust Hood over Stove Area */}
        <div className="absolute top-0 left-[52%] -translate-x-1/2 w-64 h-24 bg-gradient-to-b from-[#4a515a] via-[#333942] to-[#242930] rounded-b-xl border border-slate-500/40 shadow-2xl flex flex-col items-center justify-end pb-2">
          {/* Commercial hood filters & grease vents */}
          <div className="w-11/12 h-4 bg-[#181c20] rounded flex justify-around items-center px-1">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="w-3.5 h-2 bg-[#333a42] rounded-sm transform skew-x-12" />
            ))}
          </div>
          {/* Spinning ventilation fan indicator */}
          <div className="absolute top-2 w-6 h-6 rounded-full border border-slate-600 flex items-center justify-center">
            <div className="w-4 h-4 border-t-2 border-r-2 border-amber-400/60 rounded-full animate-spin" />
          </div>
        </div>

        {/* Hanging utensil rack with copper pans & ladles */}
        <div className="absolute top-14 left-[20%] w-48 h-2 bg-[#475569] rounded-full shadow flex justify-around items-center px-2">
          {['🥄', '🍳', '🔪', '🥢', '🥘'].map((item, i) => (
            <div
              key={i}
              className="text-base transform origin-top animate-float"
              style={{ animationDelay: `${i * 0.4}s`, animationDuration: '4s' }}
            >
              {item}
            </div>
          ))}
        </div>

        {/* Restaurant Pass Window (to Dining Room) on Right */}
        <div className="absolute top-4 right-10 w-52 h-32 bg-[#120d09] rounded-t-xl border-4 border-amber-900/60 shadow-inner flex flex-col justify-between overflow-hidden">
          {/* Warm dining room lights inside window */}
          <div className="relative w-full h-full bg-gradient-to-b from-amber-900/40 via-amber-700/20 to-transparent flex items-center justify-center">
            <span className="text-amber-200/40 text-[10px] font-black uppercase tracking-widest">
              DINING ROOM PASS
            </span>
            {/* Waiter passing silhouette animation */}
            <div
              className="absolute bottom-1 w-8 h-12 bg-amber-400/10 rounded-full blur-sm"
              style={{
                animation: 'float 8s ease-in-out infinite',
              }}
            />
          </div>
          {/* Pass Stainless Shelf */}
          <div className="w-full h-4 bg-gradient-to-r from-slate-400 via-slate-200 to-slate-400 border-t border-slate-500" />
        </div>

        {/* Overhead Hanging Pendant Lamps */}
        <div className="absolute top-0 left-[25%] flex flex-col items-center pointer-events-none">
          <div className="w-0.5 h-14 bg-neutral-600" />
          <div className="w-12 h-6 bg-amber-800 rounded-t-full border border-amber-600/50 shadow-lg flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-amber-200 shadow-[0_0_15px_#f59e0b]" />
          </div>
        </div>
        <div className="absolute top-0 left-[68%] flex flex-col items-center pointer-events-none">
          <div className="w-0.5 h-14 bg-neutral-600" />
          <div className="w-12 h-6 bg-amber-800 rounded-t-full border border-amber-600/50 shadow-lg flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-amber-200 shadow-[0_0_15px_#f59e0b]" />
          </div>
        </div>
      </div>

      {/* ── 3. INTERACTIVE KITCHEN STATIONS ─────────────────────── */}
      {stations.map((st) => {
        const isTarget = targetStation === st.id;
        const isCurrent = activeStation === st.id;

        return (
          <div
            key={st.id}
            className={`absolute flex flex-col items-center transition-all duration-200 ${
              isRearranging && st.isMovable ? 'cursor-grab active:cursor-grabbing hover:scale-105' : ''
            }`}
            style={{
              left: `${st.x}%`,
              top: `${st.y}%`,
              width: `${st.width}%`,
              height: `${st.height}%`,
              transform: 'translate(-50%, -50%)',
            }}
            onMouseDown={(e) => {
              if (!isRearranging || !st.isMovable || !onStationDrag) return;
              e.preventDefault();
              const startX = e.clientX;
              const startY = e.clientY;
              const origX = st.x;
              const origY = st.y;
              const parent = e.currentTarget.parentElement;
              if (!parent) return;
              const rect = parent.getBoundingClientRect();

              const handleMouseMove = (moveEvent: MouseEvent) => {
                const deltaX = ((moveEvent.clientX - startX) / rect.width) * 100;
                const deltaY = ((moveEvent.clientY - startY) / rect.height) * 100;
                const newX = Math.min(88, Math.max(12, Math.round(origX + deltaX)));
                const newY = Math.min(82, Math.max(26, Math.round(origY + deltaY)));
                onStationDrag(st.id, newX, newY);
              };

              const handleMouseUp = () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
              };

              window.addEventListener('mousemove', handleMouseMove);
              window.addEventListener('mouseup', handleMouseUp);
            }}
          >
            {/* Target Glowing Aura Beacon if this is the next step or tutorial */}
            {isTarget && (
              <div className="absolute -inset-3 rounded-2xl bg-amber-400/20 border-2 border-amber-400/80 animate-pulse shadow-[0_0_25px_rgba(251,191,36,0.6)] pointer-events-none" />
            )}

            {/* Proximity Ring when Chef is near */}
            {isCurrent && !isTarget && (
              <div className="absolute -inset-2 rounded-2xl border-2 border-emerald-400/60 shadow-[0_0_15px_rgba(52,211,153,0.4)] pointer-events-none" />
            )}

            {/* Station Countertop Construction */}
            <div className="relative w-full h-full rounded-xl flex flex-col overflow-hidden shadow-2xl transition-all border border-slate-700/60 bg-gradient-to-b from-[#2e3440] via-[#232731] to-[#1a1d24]">
              {/* Stainless Steel Table Top Chamfer */}
              <div className="w-full h-3 bg-gradient-to-r from-slate-400 via-slate-200 to-slate-400 border-b border-slate-500 shadow-sm flex items-center justify-between px-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
              </div>

              {/* Station Body Graphic Details based on Type */}
              <div className="relative flex-1 flex flex-col items-center justify-center p-1">
                {/* 1. PANTRY */}
                {st.id === 'pantry' && (
                  <div className="flex flex-col items-center">
                    <div className="flex gap-1 text-lg">
                      <span>🍞</span>
                      <span>🍝</span>
                      <span>🥩</span>
                    </div>
                    <div className="w-11/12 h-2 bg-amber-900/60 rounded-sm mt-1 border-t border-amber-700/40" />
                  </div>
                )}

                {/* 2. PREP TABLE */}
                {st.id === 'prep' && (
                  <div className="flex flex-col items-center">
                    {/* Hardwood Butcher Block Cutting Board */}
                    <div className="w-11/12 h-7 bg-[#a26839] rounded border border-[#6b4221] shadow-inner flex items-center justify-center gap-1.5 px-1">
                      <span className="text-sm">🔪</span>
                      <span className="text-sm">🍅</span>
                      <span className="text-xs">🧅</span>
                    </div>
                  </div>
                )}

                {/* 3. STOVE BURNER */}
                {st.id === 'cook' && (
                  <div className="flex flex-col items-center">
                    <div className="relative w-14 h-9 bg-[#111317] rounded-lg border border-slate-600 flex items-center justify-center shadow-inner">
                      {/* Burner coil */}
                      <div className="w-8 h-8 rounded-full border-2 border-slate-500 flex items-center justify-center">
                        {/* Blue & Orange Flickering Gas Flame */}
                        <div
                          className={`w-5 h-5 rounded-full transition-all ${
                            stoveCooking
                              ? 'bg-gradient-to-tr from-blue-500 via-orange-500 to-yellow-300 animate-ping shadow-[0_0_15px_#f97316]'
                              : 'bg-blue-500/40 animate-pulse'
                          }`}
                        />
                      </div>
                      <span className="absolute text-sm">🍳</span>
                    </div>
                    {/* Steam puff if actively cooking */}
                    {stoveCooking && (
                      <div className="absolute -top-6 text-sm animate-steam">💨</div>
                    )}
                  </div>
                )}

                {/* 4. STONE OVEN */}
                {st.id === 'oven' && (
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-9 bg-[#1c1917] rounded border-2 border-amber-900/80 flex items-center justify-center overflow-hidden">
                      <div
                        className={`w-10 h-6 rounded bg-gradient-to-t from-red-600 via-orange-500 to-amber-300 flex items-center justify-center ${
                          ovenCooking ? 'animate-pulse shadow-[0_0_20px_#ea580c]' : 'opacity-70'
                        }`}
                      >
                        <span className="text-xs">🔥</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. PLATING DOCK */}
                {st.id === 'plate' && (
                  <div className="flex flex-col items-center">
                    {/* Stack of crisp white porcelain plates */}
                    <div className="flex items-center gap-1">
                      <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-slate-300 shadow-md flex items-center justify-center">
                        <span className="text-sm">🍽️</span>
                      </div>
                      <div className="w-7 h-7 rounded-full bg-slate-200 border border-slate-300 shadow -ml-4" />
                    </div>
                  </div>
                )}

                {/* 6. SERVICE PASS WITH BRASS SERVICE BELL */}
                {st.id === 'serve' && (
                  <div className="flex flex-col items-center">
                    {/* Brass Bell */}
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-b from-amber-300 via-yellow-500 to-amber-700 border border-yellow-200 shadow-lg flex items-center justify-center active:scale-90 transition-transform">
                        <span className="text-xs font-black text-amber-950">🛎️</span>
                      </div>
                      <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                        PASS
                      </span>
                    </div>
                  </div>
                )}

                {/* 7. COFFEE MACHINE */}
                {st.id === 'coffee' && (
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-8 bg-red-900/80 rounded border border-red-700 flex flex-col items-center justify-center shadow-inner">
                      <span className="text-sm">☕</span>
                      <div className="w-6 h-1 bg-black/40 rounded mt-0.5" />
                    </div>
                  </div>
                )}

                {/* 8. TRASH BIN */}
                {st.id === 'trash' && (
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-lg bg-neutral-800 border border-neutral-600 flex items-center justify-center shadow-inner">
                      <span className="text-xs">🗑️</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Station Label Footer */}
              <div className="w-full bg-black/70 py-0.5 px-1 border-t border-slate-700/50 flex flex-col items-center">
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-200 truncate">
                  {st.label}
                </span>
              </div>
            </div>

            {/* Movable Badge indicator when in Rearrange Mode */}
            {isRearranging && st.isMovable && (
              <div className="absolute -top-3 px-2 py-0.5 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow border border-blue-300 animate-bounce">
                DRAG
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
