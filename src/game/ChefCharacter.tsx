import { useEffect, useState } from 'react';
import type { ChefFacing, ChefAnimation, HeldFoodItem } from './types';

interface ChefCharacterProps {
  facing: ChefFacing;
  anim: ChefAnimation;
  heldItem: HeldFoodItem | null;
  energy: number;
  isMoving: boolean;
  flowLevel: number;
}

export function ChefCharacter({
  facing,
  anim,
  heldItem,
  energy,
  isMoving,
  flowLevel,
}: ChefCharacterProps) {
  const [frame, setFrame] = useState(0);

  // Bobbing animation timer
  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((f) => (f + 1) % 100);
    }, isMoving ? Math.max(70, 130 - flowLevel * 12) : 260);
    return () => clearInterval(interval);
  }, [isMoving, flowLevel]);

  const isFlip = facing === 'left';
  const walkBob = isMoving ? Math.sin(frame * 0.9) * 4 : Math.sin(frame * 0.1) * 1.5;
  const legSwing = isMoving ? Math.sin(frame * 0.9) * 9 : 0;
  const hatTilt = isMoving ? Math.sin(frame * 0.9) * 4 : Math.sin(frame * 0.1) * 1.5;

  const isBurnt = anim === 'burnt';
  const isChop = anim === 'chop';
  const isCook = anim === 'cook';
  const isCelebrate = anim === 'celebrate';
  const isDrink = anim === 'drink';
  const isTired = energy < 25;

  return (
    <div
      className="relative flex flex-col items-center justify-center pointer-events-none select-none"
      style={{
        transform: `scaleX(${isFlip ? -1 : 1})`,
        transition: 'transform 0.1s ease-out',
      }}
    >
      {/* Floor cast shadow */}
      <div
        className="absolute bottom-1 w-16 h-5 bg-black/45 rounded-full blur-[2px]"
        style={{
          transform: `scale(${1 + Math.abs(walkBob) * 0.05})`,
          transition: 'all 0.15s ease-out',
        }}
      />

      {/* Held item floating above chef hands if carrying */}
      {heldItem && (
        <div
          className="absolute -top-11 z-30 flex items-center gap-1 px-2.5 py-1 bg-neutral-900/90 border border-amber-400/40 rounded-full shadow-lg text-cream animate-bounce"
          style={{
            transform: `scaleX(${isFlip ? -1 : 1}) translateY(${walkBob}px)`,
          }}
        >
          <span className="text-xl leading-none">{heldItem.emoji}</span>
          <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 whitespace-nowrap">
            {heldItem.stage === 'raw' ? 'Raw' : heldItem.stage === 'prepped' ? 'Prepped' : heldItem.stage === 'cooked' ? 'Cooked' : heldItem.stage === 'plated' ? 'Plated' : 'Burnt'}
          </span>
        </div>
      )}

      {/* Expressive SVG Chef Vector */}
      <div
        className="relative z-10 w-24 h-28"
        style={{ transform: `translateY(${walkBob}px)` }}
      >
        <svg
          viewBox="0 0 100 120"
          className="w-full h-full drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* ── LEGS & SHOES ─────────────────────── */}
          <g>
            {/* Left Leg */}
            <rect
              x="36"
              y="92"
              width="10"
              height="18"
              rx="4"
              fill="#262626"
              transform={`rotate(${legSwing}, 41, 92)`}
            />
            {/* Left Clog / Shoe */}
            <path
              d="M32 108 C32 105, 46 105, 48 108 L49 114 C49 116, 32 116, 32 114 Z"
              fill="#171717"
              transform={`rotate(${legSwing}, 41, 92)`}
            />

            {/* Right Leg */}
            <rect
              x="54"
              y="92"
              width="10"
              height="18"
              rx="4"
              fill="#262626"
              transform={`rotate(${-legSwing}, 59, 92)`}
            />
            {/* Right Clog / Shoe */}
            <path
              d="M50 108 C50 105, 64 105, 66 108 L67 114 C67 116, 50 116, 50 114 Z"
              fill="#171717"
              transform={`rotate(${-legSwing}, 59, 92)`}
            />
          </g>

          {/* ── CHEF TORSO & COAT ───────────────── */}
          <g>
            {/* White Double-Breasted Chef Jacket */}
            <path
              d="M30 52 C30 48, 70 48, 70 52 L73 88 C73 93, 27 93, 27 88 Z"
              fill={isBurnt ? '#6b7280' : '#f8fafc'}
              stroke="#cbd5e1"
              strokeWidth="1.5"
            />
            {/* Coat Flap */}
            <path
              d="M48 50 L53 92"
              stroke="#94a3b8"
              strokeWidth="1.5"
              strokeDasharray="2 2"
            />
            {/* Black Coat Buttons (double breasted) */}
            <circle cx="43" cy="58" r="2" fill="#334155" />
            <circle cx="56" cy="58" r="2" fill="#334155" />
            <circle cx="43" cy="68" r="2" fill="#334155" />
            <circle cx="56" cy="68" r="2" fill="#334155" />
            <circle cx="43" cy="78" r="2" fill="#334155" />
            <circle cx="56" cy="78" r="2" fill="#334155" />

            {/* Apron */}
            <path
              d="M34 72 L66 72 L64 92 L36 92 Z"
              fill="#1e293b"
            />
            <line x1="30" y1="72" x2="70" y2="72" stroke="#0f172a" strokeWidth="2.5" />
            {/* Apron Pocket */}
            <rect x="42" y="78" width="16" height="10" rx="1.5" fill="#334155" />

            {/* Red Neckerchief / Scarf */}
            <path
              d="M40 48 C46 54, 54 54, 60 48 L53 58 C51 60, 49 60, 47 58 Z"
              fill="#dc2626"
            />
          </g>

          {/* ── ARMS & PROPS (CHOP, STIR, CARRY) ── */}
          <g>
            {/* Left Arm */}
            {isCelebrate ? (
              <path d="M30 54 L18 36 L14 40" stroke="#f8fafc" strokeWidth="7" strokeLinecap="round" />
            ) : isDrink ? (
              <path d="M30 56 L38 48 L46 44" stroke="#f8fafc" strokeWidth="6" strokeLinecap="round" />
            ) : (
              <path
                d="M30 54 L22 68 L32 74"
                stroke={isBurnt ? '#6b7280' : '#f8fafc'}
                strokeWidth="6"
                strokeLinecap="round"
              />
            )}

            {/* Right Arm */}
            {isCelebrate ? (
              <path d="M70 54 L82 36 L86 40" stroke="#f8fafc" strokeWidth="7" strokeLinecap="round" />
            ) : isChop ? (
              <g transform={`rotate(${Math.sin(frame * 1.5) * 20}, 70, 56)`}>
                <path d="M70 54 L82 66 L74 78" stroke="#f8fafc" strokeWidth="6" strokeLinecap="round" />
                {/* Kitchen Knife */}
                <rect x="73" y="75" width="4" height="7" fill="#854d0e" rx="1" />
                <path d="M75 82 L75 96 L82 92 Z" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="0.8" />
              </g>
            ) : isCook ? (
              <g transform={`rotate(${Math.sin(frame * 0.8) * 12}, 70, 56)`}>
                <path d="M70 54 L82 68 L72 74" stroke="#f8fafc" strokeWidth="6" strokeLinecap="round" />
                {/* Pan Handle & Frying Pan */}
                <rect x="72" y="73" width="16" height="4" rx="1" fill="#475569" />
                <ellipse cx="94" cy="75" rx="12" ry="6" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
                {/* Sizzling food inside pan */}
                <circle cx="93" cy="75" r="3.5" fill="#f97316" />
              </g>
            ) : isBurnt ? (
              <path d="M70 54 L86 44 L80 34" stroke="#6b7280" strokeWidth="6" strokeLinecap="round" />
            ) : (
              <path
                d="M70 54 L78 68 L68 74"
                stroke={isBurnt ? '#6b7280' : '#f8fafc'}
                strokeWidth="6"
                strokeLinecap="round"
              />
            )}
          </g>

          {/* ── HEAD & EXPRESSIVE FACE ──────────── */}
          <g transform={`translate(0, ${isChop ? Math.sin(frame * 1.2) * 1.5 : 0})`}>
            {/* Neck */}
            <rect x="45" y="44" width="10" height="8" rx="2" fill="#fcd34d" />

            {/* Head Face Base */}
            <circle
              cx="50"
              cy="34"
              r="17"
              fill={isBurnt ? '#9ca3af' : '#fed7aa'}
              stroke={isBurnt ? '#4b5563' : '#fba359'}
              strokeWidth="1.2"
            />

            {/* Ears */}
            <circle cx="33" cy="34" r="3.5" fill={isBurnt ? '#9ca3af' : '#fed7aa'} />
            <circle cx="67" cy="34" r="3.5" fill={isBurnt ? '#9ca3af' : '#fed7aa'} />

            {/* Rosy Cheeks */}
            {!isBurnt && (
              <>
                <ellipse cx="40" cy="38" rx="3" ry="1.5" fill="#fca5a5" opacity="0.6" />
                <ellipse cx="60" cy="38" rx="3" ry="1.5" fill="#fca5a5" opacity="0.6" />
              </>
            )}

            {/* Eyebrows */}
            {isBurnt ? (
              <>
                <path d="M38 23 L44 26" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" />
                <path d="M62 23 L56 26" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" />
              </>
            ) : isTired ? (
              <>
                <path d="M38 27 L44 25" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
                <path d="M62 27 L56 25" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
              </>
            ) : (
              <>
                <path d="M38 24 Q41 22 45 24" stroke="#78350f" strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d="M62 24 Q59 22 55 24" stroke="#78350f" strokeWidth="2" strokeLinecap="round" fill="none" />
              </>
            )}

            {/* Eyes */}
            {isBurnt ? (
              // Wide shocked eyes
              <>
                <circle cx="42" cy="30" r="4.5" fill="#ffffff" stroke="#111827" strokeWidth="1" />
                <circle cx="42" cy="30" r="1.5" fill="#111827" />
                <circle cx="58" cy="30" r="4.5" fill="#ffffff" stroke="#111827" strokeWidth="1" />
                <circle cx="58" cy="30" r="1.5" fill="#111827" />
              </>
            ) : isCelebrate ? (
              // Happy squinting eyes (^ ^)
              <>
                <path d="M38 31 Q42 27 45 31" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <path d="M55 31 Q58 27 62 31" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              </>
            ) : isTired ? (
              // Droopy tired eyes
              <>
                <line x1="38" y1="31" x2="45" y2="31" stroke="#451a03" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="55" y1="31" x2="62" y2="31" stroke="#451a03" strokeWidth="2.5" strokeLinecap="round" />
              </>
            ) : (
              // Crisp alert eyes
              <>
                <circle cx="42" cy="30" r="3" fill="#1c1917" />
                <circle cx="43" cy="29" r="1" fill="#ffffff" />
                <circle cx="58" cy="30" r="3" fill="#1c1917" />
                <circle cx="59" cy="29" r="1" fill="#ffffff" />
              </>
            )}

            {/* Nose */}
            <ellipse cx="50" cy="34" rx="2" ry="1.5" fill="#ea580c" opacity="0.7" />

            {/* Mouth */}
            {isBurnt ? (
              // Big O mouth
              <ellipse cx="50" cy="40" rx="3.5" ry="4.5" fill="#7f1d1d" stroke="#1f2937" strokeWidth="1" />
            ) : isCelebrate ? (
              // Wide joyful smile
              <path d="M43 38 Q50 46 57 38" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round" fill="#b91c1c" />
            ) : (
              // Confident friendly smile
              <path d="M44 38 Q50 43 56 38" stroke="#1c1917" strokeWidth="2" strokeLinecap="round" fill="none" />
            )}

            {/* Mustache detail */}
            <path
              d="M44 36 C47 37, 49 35, 50 36 C51 35, 53 37, 56 36 C54 39, 46 39, 44 36 Z"
              fill="#78350f"
            />
          </g>

          {/* ── CHEF HAT (TOQUE) ───────────────── */}
          <g transform={`rotate(${hatTilt}, 50, 20)`}>
            {/* Hat Band */}
            <rect
              x="36"
              y="18"
              width="28"
              height="6"
              rx="1.5"
              fill={isBurnt ? '#6b7280' : '#f8fafc'}
              stroke="#cbd5e1"
              strokeWidth="1.5"
            />
            {/* Puffed Hat Crown */}
            <path
              d="M36 18 C28 14, 28 -2, 42 2 C44 -6, 56 -6, 58 2 C72 -2, 72 14, 64 18 Z"
              fill={isBurnt ? '#4b5563' : '#ffffff'}
              stroke={isBurnt ? '#374151' : '#cbd5e1'}
              strokeWidth="1.8"
            />
            {/* Hat pleat creases */}
            <path d="M44 3 L44 18" stroke="#e2e8f0" strokeWidth="1" opacity={isBurnt ? 0.2 : 0.8} />
            <path d="M50 0 L50 18" stroke="#e2e8f0" strokeWidth="1" opacity={isBurnt ? 0.2 : 0.8} />
            <path d="M56 3 L56 18" stroke="#e2e8f0" strokeWidth="1" opacity={isBurnt ? 0.2 : 0.8} />
          </g>

          {/* Smoke clouds if burnt */}
          {isBurnt && (
            <g className="animate-steam">
              <circle cx="34" cy="10" r="5" fill="#4b5563" opacity="0.6" />
              <circle cx="66" cy="6" r="6" fill="#374151" opacity="0.6" />
              <circle cx="50" cy="-6" r="8" fill="#1f2937" opacity="0.5" />
            </g>
          )}
        </svg>
      </div>

      {/* Turbo Flow Sparks when Flow >= 3 */}
      {flowLevel >= 3 && (
        <div className="absolute -bottom-2 flex gap-1 pointer-events-none">
          <span className="text-xs animate-ping">🔥</span>
          <span className="text-xs animate-pulse">⚡</span>
        </div>
      )}
    </div>
  );
}
