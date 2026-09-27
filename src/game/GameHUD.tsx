import type { ActiveOrder, StationType } from './types';
import { sounds } from './sound';
import { Volume2, VolumeX, Shuffle, RotateCcw } from 'lucide-react';
import { useState } from 'react';

interface GameHUDProps {
  energy: number;
  maxEnergy: number;
  money: number;
  flowLevel: number;
  activeOrder: ActiveOrder | null;
  shiftProgress: number; // 0 to 100% of shift
  shiftTimeText: string;
  contextualPrompt: string | null;
  nearStation: StationType | null;
  isRearranging: boolean;
  onToggleRearrange: () => void;
  onResetLayout: () => void;
  onVirtualMove?: (dx: number, dy: number) => void;
  onVirtualAction?: () => void;
}

export function GameHUD({
  energy,
  money,
  flowLevel,
  activeOrder,
  shiftTimeText,
  contextualPrompt,
  isRearranging,
  onToggleRearrange,
  onResetLayout,
  onVirtualMove,
  onVirtualAction,
}: GameHUDProps) {
  const [soundOn, setSoundOn] = useState(true);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    sounds.enabled = next;
  };

  const energyPct = Math.max(0, Math.min(100, energy));
  const isTired = energy < 25;

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-4 select-none">
      {/* ── TOP HUD (3 ZONES) ─────────────────────────────────── */}
      <div className="flex items-start justify-between w-full">
        {/* 1. TOP LEFT: ❤️ ENERGY & SHIFT CLOCK */}
        <div className="flex flex-col gap-1.5 pointer-events-auto">
          {/* Energy Bar */}
          <div className="flex items-center gap-2 bg-neutral-900/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
            <span className="text-sm">❤️</span>
            <div className="w-28 h-2.5 bg-neutral-800 rounded-full overflow-hidden border border-white/10">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  isTired
                    ? 'bg-red-500 animate-pulse'
                    : energy > 50
                    ? 'bg-gradient-to-r from-emerald-500 to-green-400'
                    : 'bg-gradient-to-r from-amber-500 to-yellow-400'
                }`}
                style={{ width: `${energyPct}%` }}
              />
            </div>
            <span className="text-[11px] font-black tracking-wider text-slate-300 tabular-nums">
              {Math.round(energy)}%
            </span>
          </div>

          {/* Shift Time Badge */}
          <div className="flex items-center gap-1.5 bg-neutral-900/85 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 shadow text-xs font-bold text-slate-300">
            <span className="text-amber-400">🕒</span>
            <span className="tracking-wider">{shiftTimeText}</span>
          </div>

          {isTired && (
            <div className="px-2 py-0.5 bg-red-900/90 text-red-200 border border-red-500 text-[10px] font-black rounded uppercase tracking-wider animate-bounce">
              CAFFEINE REQUIRED ☕
            </div>
          )}
        </div>

        {/* 2. TOP CENTER: ACTIVE ORDER (ONE PROMINENT ORDER) ──── */}
        <div className="flex flex-col items-center pointer-events-auto">
          {activeOrder ? (
            <div
              className={`relative bg-neutral-900/95 backdrop-blur-md px-5 py-2.5 rounded-2xl border-2 shadow-2xl transition-all flex flex-col items-center min-w-[280px] max-w-[340px] ${
                activeOrder.isVip
                  ? 'border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.4)]'
                  : 'border-amber-500/70 shadow-orange-950/40'
              }`}
            >
              {/* Order Header */}
              <div className="flex items-center justify-between w-full gap-2 mb-1.5 border-b border-white/10 pb-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl leading-none">{activeOrder.recipe.emoji}</span>
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-black text-white tracking-wide leading-tight">
                      {activeOrder.recipe.name}
                    </span>
                    {activeOrder.isVip && (
                      <span className="text-[9px] font-black text-yellow-400 uppercase tracking-widest">
                        ⭐ VIP GUEST
                      </span>
                    )}
                  </div>
                </div>
                {/* Reward payout */}
                <div className="flex items-center gap-0.5 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full text-xs font-black">
                  +${activeOrder.recipe.reward * activeOrder.rewardMultiplier}
                </div>
              </div>

              {/* Steps Flow Chain (Visible Workflow) */}
              <div className="flex items-center gap-1.5 w-full justify-between pt-1">
                {activeOrder.recipe.steps.map((st, idx) => {
                  const isDone = idx < activeOrder.currentStepIndex;
                  const isCurrent = idx === activeOrder.currentStepIndex;

                  return (
                    <div key={idx} className="flex items-center gap-1 flex-1">
                      <div
                        className={`flex-1 flex flex-col items-center justify-center py-1 rounded-lg border text-center transition-all ${
                          isDone
                            ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                            : isCurrent
                            ? 'bg-amber-500 text-neutral-950 border-white shadow-[0_0_12px_#f59e0b] scale-105 font-black'
                            : 'bg-neutral-800/80 border-neutral-700 text-neutral-400'
                        }`}
                      >
                        <span className="text-sm leading-none">{st.icon}</span>
                        <span className="text-[8px] font-black uppercase tracking-tighter truncate max-w-[55px] mt-0.5">
                          {st.shortTag.replace('PICK UP ', '').replace('AT ', '')}
                        </span>
                      </div>
                      {idx < activeOrder.recipe.steps.length - 1 && (
                        <span className="text-neutral-500 text-[10px]">→</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Patience Timer line */}
              <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden mt-2 border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-red-500 transition-all duration-300"
                  style={{
                    width: `${Math.max(0, (activeOrder.patienceLeft / activeOrder.maxPatience) * 100)}%`,
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="bg-neutral-900/80 backdrop-blur-md px-6 py-2 rounded-2xl border border-white/10 shadow text-xs font-bold text-slate-400 uppercase tracking-widest">
              NEXT ORDER INCOMING...
            </div>
          )}
        </div>

        {/* 3. TOP RIGHT: 💰 MONEY & FLOW LEVEL ───────────────── */}
        <div className="flex flex-col items-end gap-1.5 pointer-events-auto">
          {/* Money display */}
          <div className="flex items-center gap-2 bg-neutral-900/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-amber-400/40 shadow-xl">
            <span className="text-base text-yellow-400 font-black">💰</span>
            <span className="text-lg font-black tracking-tight text-white tabular-nums">
              ${money}
            </span>
          </div>

          {/* FLOW Badge */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border font-black text-xs uppercase tracking-widest shadow-lg transition-all ${
              flowLevel >= 4
                ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white border-yellow-300 shadow-[0_0_15px_#f97316] animate-pulse scale-105'
                : flowLevel >= 2
                ? 'bg-amber-600/90 text-yellow-200 border-amber-300'
                : 'bg-neutral-800/80 text-slate-400 border-white/10'
            }`}
          >
            <span>FLOW x{flowLevel}</span>
            {flowLevel >= 3 && <span>🔥</span>}
          </div>

          {/* Quick Controls: Audio & Rearrange Mode */}
          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={toggleSound}
              className="p-1.5 rounded-full bg-neutral-900/80 border border-white/10 text-slate-300 hover:text-white hover:bg-neutral-800 transition-colors"
              title="Toggle Audio"
            >
              {soundOn ? <Volume2 size={14} /> : <VolumeX size={14} className="text-red-400" />}
            </button>

            <button
              onClick={onToggleRearrange}
              className={`flex items-center gap-1 px-2 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider transition-colors ${
                isRearranging
                  ? 'bg-blue-600 text-white border-blue-400 shadow-md animate-pulse'
                  : 'bg-neutral-900/80 text-slate-300 border-white/10 hover:bg-neutral-800'
              }`}
              title="Optimize Kitchen Route"
            >
              <Shuffle size={11} />
              <span>{isRearranging ? 'DONE' : 'ROUTE'}</span>
            </button>

            {isRearranging && (
              <button
                onClick={onResetLayout}
                className="p-1.5 rounded-full bg-neutral-900/80 border border-white/10 text-slate-300 hover:text-white"
                title="Reset Stations"
              >
                <RotateCcw size={12} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── BOTTOM CONTEXTUAL ACTION HINT ───────────────────────── */}
      <div className="flex flex-col items-center pointer-events-auto">
        {contextualPrompt ? (
          <div className="mb-2 px-5 py-2 rounded-2xl bg-neutral-950/90 backdrop-blur-md border-2 border-amber-400 text-cream font-black text-sm uppercase tracking-wider shadow-2xl flex items-center gap-2 animate-bounce">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span>{contextualPrompt}</span>
          </div>
        ) : (
          <div className="mb-1 text-[11px] font-medium text-slate-500/70 tracking-widest uppercase">
            WASD / ARROWS to walk · SPACE to interact
          </div>
        )}

        {/* ── MOBILE ON-SCREEN TOUCH CONTROLS (for tablets / touch users) ── */}
        <div className="w-full flex justify-between items-end px-2 pb-1 md:hidden">
          {/* Virtual D-Pad */}
          <div className="grid grid-cols-3 gap-1 bg-black/40 p-2 rounded-2xl border border-white/10">
            <div />
            <button
              onPointerDown={() => onVirtualMove && onVirtualMove(0, -1)}
              className="w-11 h-11 bg-neutral-800 active:bg-amber-600 text-white rounded-xl flex items-center justify-center font-black"
            >
              ▲
            </button>
            <div />
            <button
              onPointerDown={() => onVirtualMove && onVirtualMove(-1, 0)}
              className="w-11 h-11 bg-neutral-800 active:bg-amber-600 text-white rounded-xl flex items-center justify-center font-black"
            >
              ◀
            </button>
            <div />
            <button
              onPointerDown={() => onVirtualMove && onVirtualMove(1, 0)}
              className="w-11 h-11 bg-neutral-800 active:bg-amber-600 text-white rounded-xl flex items-center justify-center font-black"
            >
              ▶
            </button>
            <div />
            <button
              onPointerDown={() => onVirtualMove && onVirtualMove(0, 1)}
              className="w-11 h-11 bg-neutral-800 active:bg-amber-600 text-white rounded-xl flex items-center justify-center font-black"
            >
              ▼
            </button>
            <div />
          </div>

          {/* Big Action Button */}
          <button
            onPointerDown={() => onVirtualAction && onVirtualAction()}
            className="w-20 h-20 bg-gradient-to-tr from-amber-500 to-orange-600 active:scale-90 text-neutral-950 font-black rounded-full border-2 border-yellow-200 shadow-2xl flex flex-col items-center justify-center text-xs tracking-wider"
          >
            <span className="text-xl">⚡</span>
            <span>ACTION</span>
          </button>
        </div>
      </div>
    </div>
  );
}
