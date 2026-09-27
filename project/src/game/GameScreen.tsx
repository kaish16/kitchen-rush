import { useMemo } from 'react';
import type { GameState } from './engine';
import type { useGame } from './engine';
import { OrderTicket } from './OrderTicket';
import { PrepStation } from './PrepStation';

interface GameScreenProps {
  state: GameState;
  actions: ReturnType<typeof useGame>;
}

export function GameScreen({ state, actions }: GameScreenProps) {
  const { selectOrder, stepProgress, failOrder } = actions;
  const selectedOrder = state.orders.find((o) => o.id === state.selectedOrderId) || null;
  const currentStep = selectedOrder && selectedOrder.stepIndex < selectedOrder.recipe.steps.length
    ? selectedOrder.recipe.steps[selectedOrder.stepIndex]
    : null;

  const timePct = (state.timeLeft / state.shiftLength) * 100;
  const chaosColor = state.chaos > 75 ? '#e74c3c' : state.chaos > 50 ? '#e67e22' : state.chaos > 25 ? '#f1c40f' : '#2ecc71';

  const shakeStyle = useMemo(() => {
    if (state.shake <= 0) return {};
    const x = (Math.random() - 0.5) * state.shake * 12;
    const y = (Math.random() - 0.5) * state.shake * 12;
    return { transform: `translate(${x}px, ${y}px)` };
  }, [state.shake]);

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden" style={shakeStyle}>
      {/* Kitchen background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#2a1a0a] via-[#1a0a0a] to-[#0a0505]" />
      {/* Kitchen tiles pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%), linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%)',
        backgroundSize: '40px 40px',
        backgroundPosition: '0 0, 20px 20px',
      }} />
      {/* Steam effects */}
      <div className="absolute top-0 left-1/4 w-40 h-60 bg-gradient-to-t from-white/5 to-transparent rounded-full blur-3xl animate-steam" />
      <div className="absolute top-0 right-1/4 w-40 h-60 bg-gradient-to-t from-orange-500/5 to-transparent rounded-full blur-3xl animate-steam" style={{ animationDelay: '1s' }} />

      {/* ── TOP HUD ─────────────────────────────── */}
      <div className="relative z-20 flex items-center justify-between px-4 py-2 bg-black/60 border-b border-cream/10">
        {/* Time */}
        <div className="flex items-center gap-3">
          <div className="text-cream/50 text-[10px] uppercase tracking-widest">Time</div>
          <div className="w-32 h-3 bg-black/50 rounded-full overflow-hidden border border-cream/10">
            <div className={`h-full transition-all ${state.dinnerRush ? 'bg-red-500 animate-pulse' : 'bg-orange-400'}`} style={{ width: `${timePct}%` }} />
          </div>
          <div className={`font-black text-lg ${state.dinnerRush ? 'text-red-400 animate-pulse' : 'text-cream'}`}>
            {Math.ceil(state.timeLeft)}s
          </div>
        </div>

        {/* Chaos meter */}
        <div className="flex items-center gap-2">
          <span className="text-cream/50 text-[10px] uppercase tracking-widest">Chaos</span>
          <div className="relative w-32 h-4 bg-black/50 rounded-full overflow-hidden border border-cream/10">
            <div className="h-full transition-all duration-300" style={{ width: `${state.chaos}%`, background: `linear-gradient(90deg, #2ecc71, #f1c40f, #e67e22, #e74c3c)` }} />
            {state.chaos > 80 && <div className="absolute inset-0 bg-red-500/20 animate-pulse" />}
          </div>
          <span className="font-black text-sm" style={{ color: chaosColor }}>{Math.round(state.chaos)}%</span>
        </div>

        {/* Tips & Combo */}
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-cream/50 text-[10px] uppercase tracking-widest">Tips</div>
            <div className="font-black text-lg text-yellow-400">${state.stats.tips}</div>
          </div>
          <div className="text-center">
            <div className="text-cream/50 text-[10px] uppercase tracking-widest">Combo</div>
            <div className={`font-black text-lg ${state.comboFlash > 0 ? 'scale-125 text-orange-400' : 'text-cream'}`} style={{ transition: 'all 0.15s' }}>
              {state.stats.combo}x
            </div>
          </div>
          <div className="text-center">
            <div className="text-cream/50 text-[10px] uppercase tracking-widest">Rep</div>
            <div className="font-black text-lg text-purple-400">{Math.round(state.stats.reputation)}</div>
          </div>
        </div>
      </div>

      {/* ── DINNER RUSH BANNER ──────────────────── */}
      {state.dinnerRush && (
        <div className="relative z-20 bg-red-600/30 border-y border-red-500/50 text-center py-1">
          <span className="text-red-300 font-black text-sm uppercase tracking-widest animate-pulse">🔥 DINNER RUSH — Orders incoming fast! 🔥</span>
        </div>
      )}

      {/* ── EVENT BANNER ────────────────────────── */}
      {state.eventBanner && (
        <div className="relative z-30 top-2 mx-auto" style={{ pointerEvents: 'none' }}>
          <div
            className="px-6 py-3 rounded-xl border-2 shadow-2xl text-center animate-banner-pop"
            style={{ background: `${state.eventBanner.color}22`, borderColor: state.eventBanner.color, boxShadow: `0 0 30px ${state.eventBanner.color}44` }}
          >
            <div className="font-black text-xl uppercase tracking-widest" style={{ color: state.eventBanner.color }}>
              ⚡ {state.eventBanner.text} ⚡
            </div>
          </div>
        </div>
      )}

      {/* ── ACTIVE EVENT INDICATOR ──────────────── */}
      {state.activeEvent && !state.eventBanner && (
        <div className="relative z-20 mx-auto mt-2 px-4 py-1.5 rounded-full border" style={{ background: `${state.activeEvent.color}11`, borderColor: `${state.activeEvent.color}44` }}>
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: state.activeEvent.color }}>
            {state.activeEvent.label} — {Math.ceil(state.eventTimer)}s
          </span>
        </div>
      )}

      {/* ── ORDER RAIL ─────────────────────────── */}
      <div className="relative z-10 px-4 pt-3 pb-2">
        <div className="text-cream/40 text-[10px] uppercase tracking-widest mb-1.5 flex items-center gap-2">
          <span>📋 Order Rail</span>
          <span className="text-cream/30">— {state.orders.length} active</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin' }}>
          {state.orders.length === 0 && (
            <div className="text-cream/30 text-sm py-4">No orders — catch your breath!</div>
          )}
          {state.orders.map((order: typeof state.orders[number]) => (
            <OrderTicket
              key={order.id}
              order={order}
              selected={order.id === state.selectedOrderId}
              onClick={() => selectOrder(order.id === state.selectedOrderId ? null : order.id)}
            />
          ))}
        </div>
      </div>

      {/* ── PREP STATION ────────────────────────── */}
      <div className="relative z-10 flex-1 px-4 pb-3 flex flex-col">
        {selectedOrder && currentStep ? (
          <div className="flex-1 flex flex-col">
            <PrepStation
              order={selectedOrder}
              step={currentStep}
              onProgress={(amt, correct) => stepProgress(amt, correct)}
              onBurn={() => failOrder(selectedOrder.id)}
            />
            {/* Step indicator dots */}
            <div className="flex justify-center gap-2 mt-2">
              {selectedOrder.recipe.steps.map((s: typeof selectedOrder.recipe.steps[number], i: number) => (
                <div key={i} className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${i < selectedOrder.stepIndex ? 'bg-green-600 text-cream' : i === selectedOrder.stepIndex ? 'bg-orange-500 text-cream animate-pulse' : 'bg-cream/10 text-cream/40'}`}>
                  {s.type === 'chop' ? '🔪' : s.type === 'cook' ? '🍳' : s.type === 'season' ? '🧂' : '🍽️'} {s.label}
                </div>
              ))}
            </div>
            <button
              onClick={() => failOrder(selectedOrder.id)}
              className="mx-auto mt-2 px-4 py-1.5 rounded-lg bg-red-900/50 border border-red-500/30 text-red-400 text-xs font-bold uppercase hover:bg-red-900/80"
            >
              ✗ Cancel Order
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="text-6xl mb-3 opacity-30">👨‍🍳</div>
            <div className="text-cream/50 text-lg font-bold uppercase tracking-wider">Select an order to start cooking</div>
            <div className="text-cream/30 text-sm mt-1">Tap a ticket above to begin preparation</div>
          </div>
        )}
      </div>

      {/* ── PARTICLES ──────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
        {state.particles.map((p: typeof state.particles[number]) => (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.emoji ? 'auto' : `${p.size}px`,
              height: p.emoji ? 'auto' : `${p.size}px`,
              background: p.emoji ? 'transparent' : p.color,
              opacity: p.life,
              transform: 'translate(-50%, -50%)',
              fontSize: p.emoji ? '24px' : undefined,
            }}
          >
            {p.emoji}
          </div>
        ))}
      </div>

      {/* ── FLOATING TEXTS ─────────────────────── */}
      <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
        {state.floatingTexts.map((t: typeof state.floatingTexts[number]) => (
          <div
            key={t.id}
            className="absolute font-black text-2xl"
            style={{
              left: `${t.x}%`,
              top: `${t.y}%`,
              color: t.color,
              opacity: t.life,
              transform: 'translate(-50%, -50%) scale(1)',
              textShadow: `0 0 10px ${t.color}88`,
            }}
          >
            {t.text}
          </div>
        ))}
      </div>

      {/* ── SCORE FLASH ────────────────────────── */}
      {state.scoreFlash > 0 && (
        <div className="absolute inset-0 pointer-events-none z-50" style={{ background: `radial-gradient(circle at 50% 50%, ${state.flashColor}15, transparent 70%)`, opacity: state.scoreFlash * 0.5 }} />
      )}
    </div>
  );
}
