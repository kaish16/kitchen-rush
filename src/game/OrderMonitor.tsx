import type { ActiveConveyorOrder } from './types';
import { CheckCircle2, Clock } from 'lucide-react';

interface OrderMonitorProps {
  order: ActiveConveyorOrder | null;
  onServeClick: () => void;
}

export function OrderMonitor({ order, onServeClick }: OrderMonitorProps) {
  if (!order) {
    return (
      <div className="w-full max-w-xl mx-auto bg-neutral-900/90 border border-slate-700 rounded-2xl p-4 text-center shadow-xl select-none">
        <span className="text-xs font-black uppercase tracking-widest text-slate-400">
          WAITING FOR NEXT ORDER...
        </span>
      </div>
    );
  }

  const recipe = order.recipe;
  const isComplete = order.collectedIds.length >= recipe.ingredients.length;
  const patiencePct = (order.patienceLeft / order.maxPatience) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 select-none">
      {/* ── KITCHEN ORDER SCREEN MONITOR ───────────────────────── */}
      <div
        className={`relative bg-neutral-900/95 border-2 rounded-2xl p-3.5 shadow-2xl transition-all ${
          isComplete
            ? 'border-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.3)]'
            : 'border-amber-400/80 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
        }`}
      >
        {/* Monitor Top Frame */}
        <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-3xl leading-none">{recipe.emoji}</span>
            <div className="flex flex-col text-left">
              <span className="text-base font-black text-white tracking-wide">
                {recipe.name}
              </span>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                {order.isVip ? '⭐ VIP GUEST ORDER' : 'CUSTOMER ORDER'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Payout */}
            <div className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-black">
              +${recipe.reward}
            </div>

            {/* Patience Clock */}
            <div className="flex items-center gap-1 text-xs font-bold text-slate-300">
              <Clock size={13} className={patiencePct < 25 ? 'text-red-400 animate-pulse' : 'text-amber-400'} />
              <span className="tabular-nums">{Math.ceil(order.patienceLeft)}s</span>
            </div>
          </div>
        </div>

        {/* Ingredients Checklist Chips */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {recipe.ingredients.map((ing) => {
            const isCollected = order.collectedIds.includes(ing.id);

            return (
              <div
                key={ing.id}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-black transition-all ${
                  isCollected
                    ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300 shadow-sm'
                    : 'bg-neutral-800/90 border-amber-400/60 text-white animate-pulse'
                }`}
              >
                <span className="text-base">{ing.emoji}</span>
                <span>{ing.name}</span>
                {isCollected ? (
                  <CheckCircle2 size={13} className="text-emerald-400 ml-0.5" />
                ) : (
                  <span className="text-[9px] text-amber-400 font-bold ml-0.5">NEED</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Status / Action Cue */}
        {isComplete ? (
          <button
            onClick={onServeClick}
            className="w-full mt-1 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-neutral-950 font-black text-sm uppercase tracking-wider rounded-xl shadow-lg transition-transform transform active:scale-95 cursor-pointer flex items-center justify-center gap-2 animate-bounce"
          >
            <span>🛎️ SERVE DISH · SOLVE CUSTOMER RIDDLE!</span>
          </button>
        ) : (
          <div className="w-full flex items-center justify-between text-[11px] font-bold text-slate-400 px-1 pt-0.5">
            <span>
              Catch passing ingredients from conveyor belt ({order.collectedIds.length}/{recipe.ingredients.length})
            </span>
            <span className="text-amber-300">
              Press [SPACE] or Click when aligned!
            </span>
          </div>
        )}

        {/* Patience progress bar */}
        <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden mt-2">
          <div
            className={`h-full transition-all duration-300 ${
              patiencePct > 50
                ? 'bg-emerald-400'
                : patiencePct > 25
                ? 'bg-amber-400'
                : 'bg-red-500 animate-pulse'
            }`}
            style={{ width: `${Math.max(0, patiencePct)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
