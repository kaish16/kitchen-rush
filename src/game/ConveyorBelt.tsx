import type { ConveyorItem } from './types';

interface ConveyorBeltProps {
  items: ConveyorItem[];
  neededIds: string[];
  onGrabItem: (item: ConveyorItem) => void;
  speedMultiplier: number;
  chefX: number; // percentage X position of the chef
}

export function ConveyorBelt({
  items,
  neededIds,
  onGrabItem,
  speedMultiplier,
  chefX,
}: ConveyorBeltProps) {
  return (
    <div className="relative w-full max-w-4xl mx-auto h-32 px-4 select-none">
      {/* ── CONVEYOR FRAME & HOOD ──────────────────────────────── */}
      <div className="relative w-full h-full rounded-2xl bg-gradient-to-b from-[#333842] via-[#22262e] to-[#15171c] border-2 border-slate-600/80 shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Top Header Rail with LED Status & Speed */}
        <div className="w-full h-7 bg-[#1a1c22] border-b border-slate-700/80 px-3 flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400">
              CONVEYOR BELT ACTIVE
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/60 border border-slate-700 text-[10px] font-black tracking-wider text-amber-300">
              <span>SPEED:</span>
              <span className="tabular-nums">{(speedMultiplier).toFixed(1)}x</span>
            </div>
            {/* Caution hazard stripes */}
            <div className="flex h-3 w-16 overflow-hidden rounded opacity-60">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(-45deg, #eab308, #eab308 6px, #000 6px, #000 12px)',
                }}
              />
            </div>
          </div>
        </div>

        {/* ── MOVING TREAD BELT SURFACE ─────────────────────────── */}
        <div className="relative flex-1 w-full overflow-hidden bg-[#1a1c20] flex items-center">
          {/* Animated treadmill rubber lines */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                'repeating-linear-gradient(90deg, #fff 0, #fff 3px, transparent 3px, transparent 24px)',
              backgroundSize: '24px 100%',
              animation: `slideRight ${0.6 / speedMultiplier}s linear infinite`,
            }}
          />

          {/* Roller wheels visible on left and right edges */}
          <div className="absolute left-1 top-1 bottom-1 w-4 rounded bg-slate-700 border border-slate-500 flex flex-col justify-around py-1 shadow-inner">
            <div className="w-full h-1 bg-slate-900 rounded" />
            <div className="w-full h-1 bg-slate-900 rounded" />
          </div>
          <div className="absolute right-1 top-1 bottom-1 w-4 rounded bg-slate-700 border border-slate-500 flex flex-col justify-around py-1 shadow-inner">
            <div className="w-full h-1 bg-slate-900 rounded" />
            <div className="w-full h-1 bg-slate-900 rounded" />
          </div>

          {/* ── MOVING INGREDIENTS ON BELT ──────────────────────── */}
          {items.map((item) => {
            const isNeeded = neededIds.includes(item.typeId);
            // Check if chef is positioned right below this item
            const isChefInRange = Math.abs(item.x - chefX) < 14;

            return (
              <div
                key={item.id}
                onClick={() => onGrabItem(item)}
                className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-pointer transition-transform group ${
                  isChefInRange ? 'scale-110 z-30' : 'z-20 hover:scale-105'
                }`}
                style={{ left: `${item.x}%` }}
              >
                {/* Needed Highlight Aura Beacon */}
                {isNeeded && (
                  <div className="absolute -inset-2 rounded-2xl bg-amber-400/30 border-2 border-amber-400 animate-pulse shadow-[0_0_15px_#f59e0b] pointer-events-none" />
                )}

                {/* Conveyor Plate Tray */}
                <div
                  className={`relative px-3 py-1.5 rounded-xl border-2 flex items-center gap-1.5 shadow-xl transition-all ${
                    isNeeded
                      ? 'bg-neutral-900/95 border-amber-400 text-amber-200'
                      : 'bg-neutral-800/90 border-slate-600 text-slate-300'
                  }`}
                >
                  <span className="text-2xl leading-none filter drop-shadow">{item.emoji}</span>
                  <div className="flex flex-col text-left">
                    <span className="text-[11px] font-black tracking-wide leading-tight whitespace-nowrap">
                      {item.name}
                    </span>
                    {isNeeded ? (
                      <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider">
                        NEEDED!
                      </span>
                    ) : (
                      <span className="text-[8px] font-medium text-slate-400 uppercase">
                        OPTIONAL
                      </span>
                    )}
                  </div>
                </div>

                {/* Grab Cue Indicator when in range */}
                {isChefInRange && isNeeded && (
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-amber-500 text-neutral-950 font-black text-[9px] uppercase tracking-wider shadow whitespace-nowrap animate-bounce pointer-events-none">
                    [SPACE] GRAB
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Stainless Support Lip */}
        <div className="w-full h-3 bg-gradient-to-r from-slate-400 via-slate-200 to-slate-400 border-t border-slate-500 flex justify-between items-center px-4">
          <div className="w-2 h-1.5 bg-slate-600 rounded-sm" />
          <div className="w-2 h-1.5 bg-slate-600 rounded-sm" />
          <div className="w-2 h-1.5 bg-slate-600 rounded-sm" />
        </div>
      </div>
    </div>
  );
}
