import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import type {
  ConveyorItem,
  ActiveConveyorOrder,
  GenZReaction,
  GameParticle,
  KitchenRushStats,
  ChefFacing,
  ChefAnimation,
} from './types';
import { CONVEYOR_RECIPES, INGREDIENT_ITEMS, FOOD_RIDDLES, GEN_Z_REACTIONS } from './data';
import { ConveyorBelt } from './ConveyorBelt';
import { OrderMonitor } from './OrderMonitor';
import { RiddleModal } from './RiddleModal';
import { ChefCharacter } from './ChefCharacter';
import { sounds } from './sound';
import { Volume2, VolumeX } from 'lucide-react';

interface GameScreenProps {
  shiftNumber: number;
  onShiftComplete: (stats: KitchenRushStats) => void;
}

export function GameScreen({ shiftNumber, onShiftComplete }: GameScreenProps) {
  // ── 1. ACTIVE ORDER & RECIPE QUEUE ────────────────────────────
  const [activeOrder, setActiveOrder] = useState<ActiveConveyorOrder | null>(null);
  const [orderRecipeIdx, setOrderRecipeIdx] = useState<number>(0);
  const [riddleIdx, setRiddleIdx] = useState<number>(0);
  const [showRiddleModal, setShowRiddleModal] = useState<boolean>(false);

  // ── 2. CONVEYOR BELT ITEMS & SPEED ────────────────────────────
  const [conveyorItems, setConveyorItems] = useState<ConveyorItem[]>([]);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0);
  const nextItemSpawnRef = useRef<number>(0.8);
  const itemIdCounter = useRef<number>(0);

  // ── 3. CHEF POSITION & ANIMATION ──────────────────────────────
  const [chefX, setChefX] = useState<number>(50); // 15% to 85%
  const [chefFacing, setChefFacing] = useState<ChefFacing>('right');
  const [chefAnim, setChefAnim] = useState<ChefAnimation>('idle');
  const [isMoving, setIsMoving] = useState<boolean>(false);

  // ── 4. STATS & FLOW ───────────────────────────────────────────
  const [money, setMoney] = useState<number>(0);
  const [flowLevel, setFlowLevel] = useState<number>(1);
  const [maxFlow, setMaxFlow] = useState<number>(1);
  const [ordersServed, setOrdersServed] = useState<number>(0);
  const [ordersFailed, setOrdersFailed] = useState<number>(0);
  const [riddlesSolved, setRiddlesSolved] = useState<number>(0);
  const [conveyorGrabs, setConveyorGrabs] = useState<number>(0);

  // ── 5. SHIFT CLOCK (12:00 PM to 6:00 PM) ──────────────────────
  const SHIFT_SECONDS = 120;
  const [shiftTimeLeft, setShiftTimeLeft] = useState<number>(SHIFT_SECONDS);
  const [soundOn, setSoundOn] = useState<boolean>(true);

  // ── 6. FLOATING REACTIONS & PARTICLES ─────────────────────────
  const [reactions, setReactions] = useState<GenZReaction[]>([]);
  const [particles, setParticles] = useState<GameParticle[]>([]);
  const reactionIdCounter = useRef<number>(0);
  const particleIdCounter = useRef<number>(0);

  const keysPressed = useRef<Set<string>>(new Set());
  const reqAnimRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  // ── HELPER: SPAWN REACTIONS & PARTICLES ───────────────────────
  const spawnReaction = useCallback(
    (text: string, kind: 'clean' | 'flow' | 'fail' | 'vip', x: number, y: number) => {
      const id = reactionIdCounter.current++;
      setReactions((prev) => [...prev, { id, text, kind, x, y, life: 1.1, maxLife: 1.1 }]);
    },
    []
  );

  const spawnParticlesAt = useCallback(
    (x: number, y: number, color: string, count = 10, emoji?: string) => {
      const newItems: GameParticle[] = [];
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 40 + Math.random() * 80;
        newItems.push({
          id: particleIdCounter.current++,
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 20,
          life: 0.6 + Math.random() * 0.4,
          maxLife: 1,
          color,
          size: 4 + Math.random() * 4,
          emoji: i === 0 ? emoji : undefined,
        });
      }
      setParticles((prev) => [...prev, ...newItems]);
    },
    []
  );

  // ── SPAWN NEW ORDER WITH RIDDLE ──────────────────────────────
  const spawnOrder = useCallback(
    (rIdx: number, qIdx: number) => {
      const recipe = CONVEYOR_RECIPES[rIdx % CONVEYOR_RECIPES.length];
      const riddle = FOOD_RIDDLES[qIdx % FOOD_RIDDLES.length];

      const newOrder: ActiveConveyorOrder = {
        id: `ord-${Date.now()}`,
        recipe,
        collectedIds: [],
        patienceLeft: recipe.patience,
        maxPatience: recipe.patience,
        riddle,
        state: 'collecting',
        isVip: rIdx % 3 === 2,
      };

      setActiveOrder(newOrder);
      setShowRiddleModal(false);
    },
    []
  );

  // Initial order
  useEffect(() => {
    spawnOrder(0, 0);
  }, [spawnOrder]);

  // ── INGREDIENT NEEDED IDS IN ACTIVE ORDER ─────────────────────
  const neededIds = useMemo(() => {
    return activeOrder
      ? activeOrder.recipe.ingredients
          .map((i) => i.id)
          .filter((id) => !activeOrder.collectedIds.includes(id))
      : [];
  }, [activeOrder]);

  // ── GRAB INGREDIENT ACTION ───────────────────────────────────
  const handleGrabItem = useCallback(
    (item: ConveyorItem) => {
      if (!activeOrder || activeOrder.state !== 'collecting' || showRiddleModal) return;

      const isNeeded = neededIds.includes(item.typeId);

      // Remove from conveyor
      setConveyorItems((prev) => prev.filter((i) => i.id !== item.id));

      if (isNeeded) {
        // Correct Grab!
        sounds.pickup();
        setChefAnim('chop');
        setTimeout(() => setChefAnim('idle'), 350);

        setConveyorGrabs((g) => g + 1);
        const nextFlow = Math.min(5, flowLevel + 1);
        setFlowLevel(nextFlow);
        setMaxFlow((m) => Math.max(m, nextFlow));
        sounds.flowUp(nextFlow);

        // Add to collected
        const nextCollected = [...activeOrder.collectedIds, item.typeId];
        const isAllCollected = nextCollected.length >= activeOrder.recipe.ingredients.length;

        setActiveOrder({
          ...activeOrder,
          collectedIds: nextCollected,
          state: isAllCollected ? 'riddle' : 'collecting',
        });

        // Speed ramp test!
        setSpeedMultiplier((s) => Math.min(2.4, s + 0.05));

        spawnReaction(`+1 ${item.name.toUpperCase()}!`, 'clean', chefX, 55);
        spawnParticlesAt(chefX, 50, '#34d399', 8, item.emoji);

        // If dish is complete, automatically prompt or trigger riddle!
        if (isAllCollected) {
          sounds.plate();
          spawnReaction('DISH READY! SOLVING RIDDLE...', 'flow', 50, 45);
          setTimeout(() => {
            setShowRiddleModal(true);
          }, 600);
        }
      } else {
        // Wrong grab or unnecessary item!
        sounds.burnt();
        setChefAnim('burnt');
        setTimeout(() => setChefAnim('idle'), 600);
        setFlowLevel(1); // Reset speed flow

        const failQuote =
          GEN_Z_REACTIONS.mistake[Math.floor(Math.random() * GEN_Z_REACTIONS.mistake.length)];
        spawnReaction(`NOT NEEDED! ${failQuote}`, 'fail', chefX, 55);
        spawnParticlesAt(chefX, 50, '#ef4444', 10, '❌');
      }
    },
    [activeOrder, showRiddleModal, neededIds, flowLevel, chefX, spawnReaction, spawnParticlesAt]
  );

  // ── GRAB CLOSEST NEEDED ITEM WITH SPACE KEY ──────────────────
  const handleSpaceGrab = useCallback(() => {
    if (showRiddleModal) return;

    // If order is ready and not yet in riddle modal, serve!
    if (activeOrder && activeOrder.collectedIds.length >= activeOrder.recipe.ingredients.length) {
      setShowRiddleModal(true);
      return;
    }

    // Find ingredient directly above chef
    const inRange = conveyorItems.filter((i) => Math.abs(i.x - chefX) < 14);
    if (inRange.length === 0) return;

    // Prioritize needed item if multiple in range
    const neededItem = inRange.find((i) => neededIds.includes(i.typeId));
    if (neededItem) {
      handleGrabItem(neededItem);
    } else {
      handleGrabItem(inRange[0]);
    }
  }, [showRiddleModal, activeOrder, conveyorItems, chefX, neededIds, handleGrabItem]);

  // ── RIDDLE ANSWERED CALLBACK ─────────────────────────────────
  const handleRiddleAnswer = (correct: boolean) => {
    setShowRiddleModal(false);

    if (correct && activeOrder) {
      // Success! Serve to customer!
      sounds.serve();
      setOrdersServed((s) => s + 1);
      setRiddlesSolved((r) => r + 1);

      const bonusMult = activeOrder.isVip ? 2.5 : 1;
      const flowBonus = flowLevel * 5;
      const totalReward = Math.round((activeOrder.recipe.reward + flowBonus) * bonusMult);

      setMoney((m) => m + totalReward);
      setChefAnim('celebrate');
      setTimeout(() => setChefAnim('idle'), 800);

      spawnReaction(`DELIVERED! +$${totalReward} 🌟 5-STAR IQ!`, 'clean', 50, 40);
      spawnParticlesAt(50, 40, '#fbbf24', 24, activeOrder.recipe.emoji);

      // Spawn next order!
      const nextR = orderRecipeIdx + 1;
      const nextQ = riddleIdx + 1;
      setOrderRecipeIdx(nextR);
      setRiddleIdx(nextQ);
      setTimeout(() => {
        spawnOrder(nextR, nextQ);
      }, 700);
    } else {
      // Failed riddle!
      sounds.burnt();
      setOrdersFailed((f) => f + 1);
      setFlowLevel(1);
      setChefAnim('burnt');
      setTimeout(() => setChefAnim('idle'), 800);

      spawnReaction('RIDDLE FAILED · CUSTOMER WALKED 💀', 'fail', 50, 40);

      // Next customer arrives
      const nextR = orderRecipeIdx + 1;
      const nextQ = riddleIdx + 1;
      setOrderRecipeIdx(nextR);
      setRiddleIdx(nextQ);
      setTimeout(() => {
        spawnOrder(nextR, nextQ);
      }, 700);
    }
  };

  // ── KEYBOARD CONTROLS (WASD / ARROWS / SPACE) ────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'KeyA', 'KeyD'].includes(e.code)) {
        keysPressed.current.add(e.code);
      }
      if (e.code === 'Space') {
        e.preventDefault();
        handleSpaceGrab();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.code);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleSpaceGrab]);

  // ── MAIN GAME LOOP: CONVEYOR MOTION & PATIENCE ────────────────
  useEffect(() => {
    const loop = (now: number) => {
      const dt = Math.min(0.1, (now - lastTimeRef.current) / 1000);
      lastTimeRef.current = now;

      // 1. Shift Timer Tick
      setShiftTimeLeft((prev) => {
        const next = prev - dt;
        if (next <= 0) {
          sounds.shiftComplete();
          onShiftComplete({
            shiftNumber,
            money,
            ordersServed,
            ordersFailed,
            riddlesSolved,
            conveyorGrabs,
            maxFlow,
            timeSurvived: SHIFT_SECONDS,
            xpEarned: ordersServed * 100 + riddlesSolved * 50 + money,
          });
          return 0;
        }
        return next;
      });

      // 2. Order Patience Countdown
      setActiveOrder((order) => {
        if (!order || order.state === 'served' || order.state === 'failed') return order;
        const newPatience = order.patienceLeft - dt;
        if (newPatience <= 0) {
          sounds.burnt();
          setOrdersFailed((f) => f + 1);
          setFlowLevel(1);
          spawnReaction('ORDER TIMED OUT! 💀', 'fail', 50, 40);

          const nextR = orderRecipeIdx + 1;
          const nextQ = riddleIdx + 1;
          setOrderRecipeIdx(nextR);
          setRiddleIdx(nextQ);
          setTimeout(() => spawnOrder(nextR, nextQ), 700);
          return null;
        }
        return { ...order, patienceLeft: newPatience };
      });

      // 3. Chef Movement (Left & Right along conveyor)
      let dx = 0;
      if (keysPressed.current.has('ArrowLeft') || keysPressed.current.has('KeyA')) dx -= 1;
      if (keysPressed.current.has('ArrowRight') || keysPressed.current.has('KeyD')) dx += 1;

      if (dx !== 0) {
        setIsMoving(true);
        if (dx < 0) setChefFacing('left');
        else setChefFacing('right');

        const moveSpeed = 45; // percentage width per second
        setChefX((x) => Math.min(85, Math.max(15, x + dx * moveSpeed * dt)));
      } else {
        setIsMoving(false);
      }

      // 4. Conveyor Items Movement & Spawning
      nextItemSpawnRef.current -= dt;
      if (nextItemSpawnRef.current <= 0) {
        // Spawn next ingredient at x = 0%
        // High probability of picking a needed ingredient to keep game snappy
        let itemTemplate = INGREDIENT_ITEMS[Math.floor(Math.random() * INGREDIENT_ITEMS.length)];

        if (neededIds.length > 0 && Math.random() < 0.6) {
          const neededId = neededIds[Math.floor(Math.random() * neededIds.length)];
          const matched = INGREDIENT_ITEMS.find((i) => i.id === neededId);
          if (matched) itemTemplate = matched;
        }

        const newItem: ConveyorItem = {
          id: `item-${itemIdCounter.current++}`,
          typeId: itemTemplate.id,
          name: itemTemplate.name,
          emoji: itemTemplate.emoji,
          x: -5, // starts slightly off-screen left
          speed: (14 + Math.random() * 4) * speedMultiplier,
        };

        setConveyorItems((prev) => [...prev, newItem]);
        nextItemSpawnRef.current = Math.max(0.6, (1.6 - flowLevel * 0.12) / speedMultiplier);
      }

      // Move items along the belt
      setConveyorItems((prev) =>
        prev
          .map((i) => ({ ...i, x: i.x + i.speed * dt }))
          .filter((i) => i.x <= 108) // filter out once they fall off right side
      );

      // 5. Update Reactions & Particles
      setReactions((prev) =>
        prev
          .map((r) => ({ ...r, y: r.y - 12 * dt, life: r.life - dt }))
          .filter((r) => r.life > 0)
      );

      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx * dt,
            y: p.y + p.vy * dt,
            life: p.life - dt,
          }))
          .filter((p) => p.life > 0)
      );

      reqAnimRef.current = requestAnimationFrame(loop);
    };

    reqAnimRef.current = requestAnimationFrame(loop);
    return () => {
      if (reqAnimRef.current) cancelAnimationFrame(reqAnimRef.current);
    };
  }, [
    speedMultiplier,
    flowLevel,
    neededIds,
    orderRecipeIdx,
    riddleIdx,
    shiftNumber,
    money,
    ordersServed,
    ordersFailed,
    riddlesSolved,
    conveyorGrabs,
    maxFlow,
    onShiftComplete,
    spawnOrder,
    spawnReaction,
  ]);

  // Convert shift seconds to clock (12:00 PM to 6:00 PM)
  const elapsedFraction = 1 - shiftTimeLeft / SHIFT_SECONDS;
  const currentHour = 12 + Math.floor(elapsedFraction * 6);
  const currentMin = Math.floor((elapsedFraction * 6 * 60) % 60);
  const timeString = `${currentHour > 12 ? currentHour - 12 : currentHour}:${currentMin.toString().padStart(2, '0')} PM`;

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-[#0a0505] flex flex-col justify-between p-3 md:p-6">
      {/* ── BACKGROUND ATMOSPHERIC KITCHEN CANVAS ───────────────── */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25 filter brightness-70"
        style={{
          backgroundImage: `url(/src/assets/images/kitchen_rush_scene_1790510824191.jpg)`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0505] via-[#0a0505]/70 to-[#0a0505]/40 pointer-events-none" />

      {/* ── TOP HUD HEADER: TIME · MONEY · FLOW ─────────────────── */}
      <div className="relative z-30 flex items-center justify-between w-full max-w-4xl mx-auto px-2">
        {/* Left: Clock */}
        <div className="flex items-center gap-2 bg-neutral-900/90 border border-white/10 px-4 py-1.5 rounded-full shadow-lg">
          <span className="text-amber-400">🕒</span>
          <span className="text-xs font-black tracking-wider text-slate-200">
            SHIFT {shiftNumber} · {timeString}
          </span>
        </div>

        {/* Center: Title / Concept Tag */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900/60 border border-amber-400/30 text-[11px] font-black uppercase tracking-widest text-amber-300">
          <span>⚡ CONVEYOR RUSH + RIDDLE SERVE</span>
        </div>

        {/* Right: Money & Speed Flow Multiplier */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-neutral-900/90 border border-amber-400/40 px-4 py-1.5 rounded-full shadow-lg">
            <span className="text-yellow-400">💰</span>
            <span className="text-sm font-black text-white tabular-nums">${money}</span>
          </div>

          <div
            className={`px-3 py-1 rounded-full border text-xs font-black uppercase tracking-wider transition-all ${
              flowLevel >= 3
                ? 'bg-orange-600 text-white border-yellow-300 shadow-[0_0_12px_#f97316] animate-pulse'
                : 'bg-neutral-900/80 text-amber-300 border-amber-400/30'
            }`}
          >
            FLOW x{flowLevel}
          </div>

          <button
            onClick={() => {
              const next = !soundOn;
              setSoundOn(next);
              sounds.enabled = next;
            }}
            className="p-2 rounded-full bg-neutral-900/90 border border-white/10 text-slate-300 hover:text-white"
          >
            {soundOn ? <Volume2 size={14} /> : <VolumeX size={14} className="text-red-400" />}
          </button>
        </div>
      </div>

      {/* ── MIDDLE 1: ACTIVE ORDER SCREEN MONITOR ───────────────── */}
      <div className="relative z-30 w-full my-1">
        <OrderMonitor
          order={activeOrder}
          onServeClick={() => setShowRiddleModal(true)}
        />
      </div>

      {/* ── MIDDLE 2: CONVEYOR BELT SECTION ─────────────────────── */}
      <div className="relative z-30 w-full my-1">
        <ConveyorBelt
          items={conveyorItems}
          neededIds={neededIds}
          onGrabItem={handleGrabItem}
          speedMultiplier={speedMultiplier}
          chefX={chefX}
        />
      </div>

      {/* ── BOTTOM CHEF PREP FLOOR ─────────────────────────────── */}
      <div className="relative z-20 w-full max-w-4xl mx-auto h-40 flex flex-col justify-end items-center">
        {/* Stainless Steel Prep Counter Floor Line */}
        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-slate-500 via-slate-300 to-slate-500 border-t border-slate-600 shadow-md flex items-center justify-around px-8">
          <div className="w-12 h-1.5 bg-slate-700/60 rounded" />
          <div className="w-12 h-1.5 bg-slate-700/60 rounded" />
          <div className="w-12 h-1.5 bg-slate-700/60 rounded" />
        </div>

        {/* The Chef Character following chefX */}
        <div
          className="absolute bottom-2 transition-transform pointer-events-none"
          style={{
            left: `${chefX}%`,
            transform: 'translateX(-50%)',
          }}
        >
          <ChefCharacter
            facing={chefFacing}
            anim={chefAnim}
            heldItem={
              activeOrder && activeOrder.collectedIds.length > 0
                ? {
                    id: 'dish',
                    name: activeOrder.recipe.name,
                    emoji: activeOrder.recipe.emoji,
                    stage:
                      activeOrder.collectedIds.length >= activeOrder.recipe.ingredients.length
                        ? 'plated'
                        : 'prepped',
                    recipeId: activeOrder.recipe.id,
                  }
                : null
            }
            energy={100}
            isMoving={isMoving}
            flowLevel={flowLevel}
          />
        </div>

        {/* Quick Keyboard Cue Footer */}
        <div className="relative z-10 mb-2 px-4 py-1 rounded-full bg-black/60 border border-white/10 text-xs font-bold text-slate-400">
          <span className="text-amber-300">A / D / ARROWS</span> to move chef ·{' '}
          <span className="text-amber-300">SPACE</span> or <span className="text-amber-300">CLICK</span> to grab passing ingredient!
        </div>
      </div>

      {/* ── PARTICLES & FLOATING REACTIONS LAYER ───────────────── */}
      <div className="absolute inset-0 pointer-events-none z-40">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              opacity: p.life / p.maxLife,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {p.emoji && <span className="text-base">{p.emoji}</span>}
          </div>
        ))}

        {reactions.map((r) => (
          <div
            key={r.id}
            className={`absolute px-3 py-1 rounded-full font-black text-xs md:text-sm uppercase tracking-wider shadow-2xl transition-all ${
              r.kind === 'clean'
                ? 'bg-emerald-500 text-neutral-950 border border-emerald-200'
                : r.kind === 'flow'
                ? 'bg-amber-500 text-neutral-950 border border-yellow-200 animate-pulse'
                : 'bg-red-600 text-white border border-red-300'
            }`}
            style={{
              left: `${r.x}%`,
              top: `${r.y}%`,
              transform: 'translate(-50%, -50%)',
              opacity: Math.max(0, r.life / r.maxLife),
            }}
          >
            {r.text}
          </div>
        ))}
      </div>

      {/* ── THE MCQ FOOD RIDDLE SERVING MODAL ───────────────────── */}
      {showRiddleModal && activeOrder && (
        <RiddleModal
          order={activeOrder}
          onAnswer={handleRiddleAnswer}
        />
      )}
    </div>
  );
}
