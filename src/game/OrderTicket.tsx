import type { Order } from './types';

interface OrderTicketProps {
  order: Order;
  selected: boolean;
  onClick: () => void;
}

export function OrderTicket({ order, selected, onClick }: OrderTicketProps) {
  const patiencePct = Math.max(0, (order.patienceLeft / order.recipe.patience) * 100);
  const patienceColor = patiencePct > 50 ? '#2ecc71' : patiencePct > 25 ? '#f1c40f' : '#e74c3c';

  const specialBadge = order.special === 'vip' ? '⭐ VIP' : order.special === 'critic' ? '📝 CRITIC' : order.special === 'double' ? '2x DOUBLE' : null;

  return (
    <button
      onClick={onClick}
      className={`relative text-left rounded-lg p-3 border-2 transition-all min-w-[140px] max-w-[180px] ${selected ? 'scale-105 ring-4 ring-yellow-300/50' : 'hover:scale-102'} ${order.state === 'preparing' ? 'border-orange-400' : 'border-cream/20'}`}
      style={{ background: `linear-gradient(135deg, ${order.recipe.ticketColor}33, #1a1a1a)` }}
    >
      {/* Special badge */}
      {specialBadge && (
        <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-black bg-yellow-400 text-black animate-pulse">
          {specialBadge}
        </div>
      )}
      {/* Burn indicator */}
      {order.burnLevel > 0.3 && (
        <div className="absolute -top-2 -left-2 px-2 py-0.5 rounded-full text-[10px] font-black bg-red-600 text-white animate-pulse">
          🔥 BURNING
        </div>
      )}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-2xl">{order.recipe.emoji}</span>
        <div>
          <div className="text-cream font-bold text-sm leading-tight">{order.recipe.name}</div>
          <div className="text-cream/50 text-[10px]">${order.recipe.reward} × {order.bonusMultiplier.toFixed(1)}</div>
        </div>
      </div>
      {/* Step progress */}
      <div className="flex gap-1 mb-1.5">
        {order.recipe.steps.map((s, i) => (
          <div
            key={i}
            className={`flex-1 h-1.5 rounded-full ${i < order.stepIndex ? 'bg-green-400' : i === order.stepIndex ? 'bg-orange-400' : 'bg-cream/10'}`}
          />
        ))}
      </div>
      {/* Patience bar */}
      <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
        <div className="h-full transition-all duration-200" style={{ width: `${patiencePct}%`, background: patienceColor }} />
      </div>
      <div className="text-[10px] text-cream/40 mt-0.5">{Math.ceil(order.patienceLeft)}s left</div>
      {selected && (
        <div className="absolute inset-0 rounded-lg border-2 border-yellow-300 animate-pulse pointer-events-none" />
      )}
    </button>
  );
}
