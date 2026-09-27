import type { KitchenRushStats, GameAchievement } from './types';
import { ACHIEVEMENTS_LIST } from './data';
import { Trophy, ArrowRight, RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ResultsScreenProps {
  stats: KitchenRushStats;
  onNextShift: () => void;
  onRestart: () => void;
}

export function ResultsScreen({ stats, onNextShift, onRestart }: ResultsScreenProps) {
  const [animatedMoney, setAnimatedMoney] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      setAnimatedMoney(Math.floor(progress * stats.money));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [stats.money]);

  // Check achievements earned
  const earnedAchievements: GameAchievement[] = ACHIEVEMENTS_LIST.map((ach) => {
    let unlocked = false;
    if (ach.id === 'first_dish' && stats.ordersServed >= 1) unlocked = true;
    if (ach.id === 'chefs_kiss' && stats.perfectCooks >= 5) unlocked = true;
    if (ach.id === 'flow_state' && stats.maxFlow >= 5) unlocked = true;
    if (ach.id === 'no_burnt' && stats.burntCount === 0 && stats.ordersServed >= 3) unlocked = true;
    if (ach.id === 'who_let_him_cook' && stats.ordersServed >= 10) unlocked = true;
    if (ach.id === 'kitchen_demon' && stats.ordersFailed === 0 && stats.ordersServed >= 5) unlocked = true;
    return { ...ach, unlocked };
  }).filter((a) => a.unlocked);

  const shiftRating =
    stats.ordersServed >= 5 && stats.ordersFailed === 0
      ? '⭐⭐⭐ 3-STAR MASTER CHEF'
      : stats.ordersServed >= 3
      ? '⭐⭐ EXECUTIVE CHEF'
      : '⭐ LINE COOK';

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#0a0505] overflow-y-auto p-4 select-none">
      {/* Background Dim Kitchen */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20 filter brightness-50"
        style={{
          backgroundImage: `url(/src/assets/images/kitchen_rush_scene_1790510824191.jpg)`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />

      {/* Main Results Container */}
      <div className="relative z-10 max-w-xl w-full flex flex-col items-center text-center animate-fade-in py-6">
        {/* Chef Mascot Avatar */}
        <div className="w-24 h-24 rounded-full border-4 border-amber-400 overflow-hidden shadow-2xl mb-2 bg-neutral-900">
          <img
            src="/src/assets/images/chef_character_hero_1790510837055.jpg"
            alt="Chef"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="text-amber-400 text-xs font-black uppercase tracking-[0.3em] mb-1">
          SHIFT {stats.shiftNumber} · 6:00 PM
        </div>

        <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 tracking-tight mb-2">
          SHIFT COMPLETE
        </h1>

        <div className="px-4 py-1 rounded-full bg-neutral-900 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-wider mb-6">
          {shiftRating}
        </div>

        {/* Clean Stats Grid (4 Primary Cards) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full mb-6">
          <div className="bg-neutral-900/90 border border-white/10 rounded-2xl p-3 flex flex-col items-center">
            <span className="text-xl mb-1">🍽️</span>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              ORDERS SERVED
            </span>
            <span className="text-2xl font-black text-white tabular-nums">
              {stats.ordersServed}
            </span>
          </div>

          <div className="bg-neutral-900/90 border border-amber-500/30 rounded-2xl p-3 flex flex-col items-center shadow-lg">
            <span className="text-xl mb-1">💰</span>
            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
              MONEY EARNED
            </span>
            <span className="text-2xl font-black text-amber-300 tabular-nums">
              ${animatedMoney}
            </span>
          </div>

          <div className="bg-neutral-900/90 border border-white/10 rounded-2xl p-3 flex flex-col items-center">
            <span className="text-xl mb-1">🧠</span>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              RIDDLES SOLVED
            </span>
            <span className="text-2xl font-black text-emerald-400 tabular-nums">
              {stats.riddlesSolved}
            </span>
          </div>

          <div className="bg-neutral-900/90 border border-white/10 rounded-2xl p-3 flex flex-col items-center">
            <span className="text-xl mb-1">⚡</span>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              MAX SPEED FLOW
            </span>
            <span className="text-2xl font-black text-orange-400 tabular-nums">
              x{stats.maxFlow}
            </span>
          </div>
        </div>

        {/* Achievements Earned */}
        {earnedAchievements.length > 0 && (
          <div className="w-full bg-neutral-900/80 border border-amber-400/20 rounded-2xl p-4 mb-6 text-left">
            <div className="flex items-center gap-2 mb-2 text-xs font-black uppercase tracking-wider text-amber-300">
              <Trophy size={14} />
              <span>ACHIEVEMENTS UNLOCKED</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {earnedAchievements.map((ach) => (
                <div
                  key={ach.id}
                  className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-400/30 rounded-xl"
                >
                  <span className="text-base">{ach.icon}</span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-amber-200">{ach.title}</span>
                    <span className="text-[9px] text-slate-400">{ach.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onRestart}
            className="px-6 py-3.5 bg-neutral-800 hover:bg-neutral-700 text-slate-300 hover:text-white font-bold text-sm rounded-xl border border-white/10 transition-colors flex items-center gap-2"
          >
            <RotateCcw size={16} />
            <span>REPLAY SHIFT</span>
          </button>

          <button
            onClick={onNextShift}
            className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-neutral-950 font-black text-base uppercase tracking-wider rounded-xl shadow-lg transition-transform transform hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <span>NEXT SHIFT</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
