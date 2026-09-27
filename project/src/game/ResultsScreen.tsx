import { ACHIEVEMENTS } from './data';
import type { GameStats } from './types';

interface ResultsScreenProps {
  stats: GameStats;
  onRestart: () => void;
}

export function ResultsScreen({ stats, onRestart }: ResultsScreenProps) {
  const earned = ACHIEVEMENTS.filter((a) =>
    a.check({
      ordersCompleted: stats.ordersCompleted,
      bestCombo: stats.bestCombo,
      accuracy: stats.accuracy,
      tips: stats.tips,
      reputation: stats.reputation,
    })
  );

  const rank = stats.reputation >= 90 ? 'KITCHEN LEGEND' : stats.reputation >= 70 ? 'HEAD CHEF' : stats.reputation >= 50 ? 'SOUS CHEF' : stats.reputation >= 30 ? 'LINE COOK' : 'DISHWASHER';

  const accuracyColor = stats.accuracy >= 80 ? '#2ecc71' : stats.accuracy >= 60 ? '#f1c40f' : '#e74c3c';

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-y-auto py-8 px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a0a0a] via-[#2d0a1e] to-[#0a0a0a]" />
      {/* Confetti */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-2xl animate-confetti"
            style={{
              left: `${(i * 17) % 100}%`,
              top: '-20px',
              animationDelay: `${i * 0.15}s`,
              animationDuration: `${2 + (i % 3)}s`,
            }}
          >
            {['🎉', '⭐', '🔥', '💰', '✨', '🏆'][i % 6]}
          </div>
        ))}
      </div>

      <div className="relative z-10 text-center max-w-2xl w-full">
        <div className="text-orange-400 text-sm font-bold uppercase tracking-[0.3em] mb-2 animate-fade-in">Shift Complete</div>
        <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 mb-4 animate-title-pop tracking-tighter">
          SHIFT OVER
        </h1>

        {/* Rank */}
        <div className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 to-purple-800 border-2 border-yellow-400/50 mb-6">
          <span className="text-yellow-300 font-black text-xl uppercase tracking-widest">{rank}</span>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          <StatCard label="Orders Served" value={stats.ordersCompleted} emoji="🍽️" color="#2ecc71" />
          <StatCard label="Orders Failed" value={stats.ordersFailed} emoji="💀" color="#e74c3c" />
          <StatCard label="Tips Earned" value={`$${stats.tips}`} emoji="💰" color="#f1c40f" />
          <StatCard label="Best Combo" value={`${stats.bestCombo}x`} emoji="🔥" color="#e67e22" />
          <StatCard label="Accuracy" value={`${stats.accuracy}%`} emoji="🎯" color={accuracyColor} />
          <StatCard label="Reputation" value={`${Math.round(stats.reputation)}/100`} emoji="⭐" color="#9b59b6" />
          <StatCard label="XP Earned" value={stats.xp} emoji="✨" color="#3498db" />
          <StatCard label="Total Actions" value={stats.totalActions} emoji="⚡" color="#1abc9c" />
          <StatCard label="Correct" value={stats.correctActions} emoji="✅" color="#2ecc71" />
        </div>

        {/* Achievements */}
        <div className="mb-6">
          <div className="text-cream/60 text-sm font-bold uppercase tracking-widest mb-3">Achievements Unlocked</div>
          <div className="flex flex-wrap justify-center gap-2">
            {earned.length === 0 && <span className="text-cream/30 text-sm">No achievements this shift. Try harder!</span>}
            {earned.map((a) => (
              <div key={a.id} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 animate-pop">
                <span className="text-2xl">{a.emoji}</span>
                <div className="text-left">
                  <div className="text-yellow-300 font-bold text-sm">{a.name}</div>
                  <div className="text-cream/50 text-[10px]">{a.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onRestart}
          className="px-10 py-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl text-cream font-black text-xl uppercase tracking-wider hover:scale-105 transition-transform shadow-2xl shadow-orange-500/30"
        >
          COOK AGAIN
        </button>
      </div>
    </div>
  );
}

function StatCard({ label, value, emoji, color }: { label: string; value: string | number; emoji: string; color: string }) {
  return (
    <div className="bg-black/40 rounded-xl p-3 border border-cream/10 text-center">
      <div className="text-2xl mb-1">{emoji}</div>
      <div className="text-2xl font-black" style={{ color }}>{value}</div>
      <div className="text-cream/40 text-[10px] uppercase tracking-wider">{label}</div>
    </div>
  );
}
