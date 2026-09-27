import { useCallback, useEffect, useReducer, useRef } from 'react';
import type { GamePhase, GameStats, Order, Particle, SpecialEvent } from './types';
import { RECIPES, SPECIAL_EVENTS } from './data';

// ── State ────────────────────────────────────────────────────
export interface GameState {
  phase: GamePhase;
  timeLeft: number;
  shiftLength: number;
  dinnerRush: boolean;
  orders: Order[];
  selectedOrderId: string | null;
  chaos: number;
  stats: GameStats;
  activeEvent: SpecialEvent | null;
  eventTimer: number;
  particles: Particle[];
  comboFlash: number;
  scoreFlash: number;
  flashColor: string;
  floatingTexts: { id: number; text: string; color: string; x: number; y: number; life: number }[];
  eventBanner: { text: string; color: string; life: number } | null;
  shake: number;
  gameOver: boolean;
  nextOrderIn: number;
  particleId: number;
  textId: number;
  orderIdCounter: number;
  lastAchievements: string[];
}

type Action =
  | { type: 'START' }
  | { type: 'TICK'; dt: number }
  | { type: 'SELECT_ORDER'; id: string | null }
  | { type: 'STEP_PROGRESS'; amount: number; correct: boolean }
  | { type: 'SERVE_ORDER' }
  | { type: 'FAIL_ORDER'; id: string }
  | { type: 'SPAWN_PARTICLES'; x: number; y: number; color: string; count: number; emoji?: string }
  | { type: 'UPDATE_PARTICLES'; dt: number }
  | { type: 'FLOAT_TEXT'; text: string; color: string; x: number; y: number }
  | { type: 'CLEAR_FLASH' }
  | { type: 'RESET' };

const SHIFT_LENGTH = 150; // 2.5 minutes
const DINNER_RUSH_START = 90; // last 60s
const MAX_ORDERS = 6;

function initialState(): GameState {
  return {
    phase: 'start',
    timeLeft: SHIFT_LENGTH,
    shiftLength: SHIFT_LENGTH,
    dinnerRush: false,
    orders: [],
    selectedOrderId: null,
    chaos: 0,
    stats: {
      ordersCompleted: 0,
      ordersFailed: 0,
      tips: 0,
      combo: 0,
      bestCombo: 0,
      accuracy: 100,
      reputation: 50,
      xp: 0,
      totalActions: 0,
      correctActions: 0,
    },
    activeEvent: null,
    eventTimer: 0,
    particles: [],
    comboFlash: 0,
    scoreFlash: 0,
    flashColor: '#f1c40f',
    floatingTexts: [],
    eventBanner: null,
    shake: 0,
    gameOver: false,
    nextOrderIn: 3,
    particleId: 0,
    textId: 0,
    orderIdCounter: 0,
    lastAchievements: [],
  };
}

function pickRecipe() {
  return RECIPES[Math.floor(Math.random() * RECIPES.length)];
}

function makeOrder(id: number, special?: 'vip' | 'double' | 'critic'): Order {
  const recipe = pickRecipe();
  let bonus = 1;
  if (special === 'vip') bonus = 2.5;
  if (special === 'critic') bonus = 3;
  if (special === 'double') bonus = 1.5;
  return {
    id: `order-${id}`,
    recipe,
    stepIndex: 0,
    stepProgress: 0,
    patienceLeft: recipe.patience,
    state: 'waiting',
    burnLevel: 0,
    special,
    bonusMultiplier: bonus,
  };
}

function spawnParticles(state: GameState, x: number, y: number, color: string, count: number, emoji?: string): Particle[] {
  const newParts: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 80 + Math.random() * 180;
    newParts.push({
      id: state.particleId++,
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 60,
      life: 0.6 + Math.random() * 0.4,
      maxLife: 1,
      color,
      size: 4 + Math.random() * 6,
      emoji: i === 0 && emoji ? emoji : undefined,
    });
  }
  return newParts;
}

function triggerEvent(state: GameState): GameState {
  const event = SPECIAL_EVENTS[Math.floor(Math.random() * SPECIAL_EVENTS.length)];
  let orders = state.orders;
  let chaos = state.chaos;

  // Apply event effects
  if (event.id === 'double') {
    const newOrder = makeOrder(state.orderIdCounter++);
    orders = [...orders, newOrder];
  }
  if (event.id === 'overheat') chaos = Math.min(100, chaos + 15);
  if (event.id === 'table12') chaos = Math.min(100, chaos + 10);

  return {
    ...state,
    activeEvent: event,
    eventTimer: event.duration,
    eventBanner: { text: event.label, color: event.color, life: 3 },
    orders,
    chaos,
  };
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'START':
      return { ...initialState(), phase: 'playing', orders: [makeOrder(0), makeOrder(1)], orderIdCounter: 2, nextOrderIn: 4 };

    case 'RESET':
      return initialState();

    case 'TICK': {
      if (state.phase !== 'playing' || state.gameOver) return state;
      const dt = action.dt;
      let timeLeft = state.timeLeft - dt;
      let dinnerRush = state.dinnerRush;
      if (timeLeft <= DINNER_RUSH_START && !dinnerRush) dinnerRush = true;

      // Chaos rises over time, faster during dinner rush
      let chaos = state.chaos + (dinnerRush ? 3 : 1.5) * dt;
      if (state.activeEvent?.id === 'overheat') chaos += 2 * dt;
      chaos = Math.min(100, chaos);
      // Chaos decays when orders are low
      if (state.orders.length <= 2) chaos = Math.max(0, chaos - 1 * dt);

      // Event timer
      let activeEvent = state.activeEvent;
      let eventTimer = state.eventTimer;
      if (activeEvent) {
        eventTimer -= dt;
        if (eventTimer <= 0) {
          activeEvent = null;
          eventTimer = 0;
        }
      }

      // Spawn orders
      let nextOrderIn = state.nextOrderIn - dt;
      let orders = state.orders;
      let orderIdCounter = state.orderIdCounter;
      const spawnRate = dinnerRush ? 2.5 : Math.max(4, 7 - chaos * 0.03);
      if (nextOrderIn <= 0 && orders.length < MAX_ORDERS) {
        const special = activeEvent?.id === 'vip' ? 'vip' : activeEvent?.id === 'critic' ? 'critic' : undefined;
        orders = [...orders, makeOrder(orderIdCounter++, special)];
        nextOrderIn = spawnRate;
      }

      // Tick order patience
      const patienceDrainMult = activeEvent?.id === 'table12' ? 1.5 : 1;
      const updatedOrders = orders.map((o) => {
        if (o.state === 'served' || o.state === 'failed') return o;
        const patienceLeft = o.patienceLeft - dt * patienceDrainMult;
        let burnLevel = o.burnLevel;
        // Burn increases on cook steps if not progressing
        const currentStep = o.recipe.steps[o.stepIndex];
        if (currentStep?.type === 'cook' && o.state === 'preparing') {
          burnLevel = Math.min(1, burnLevel + dt * (activeEvent?.id === 'overheat' ? 0.15 : 0.07));
        }
        if (patienceLeft <= 0) {
          return { ...o, state: 'failed' as const, patienceLeft: 0 };
        }
        return { ...o, patienceLeft, burnLevel };
      });

      // Remove failed/served after a delay
      const filteredOrders = updatedOrders.filter((o) => {
        if (o.state === 'failed' || o.state === 'served') return false;
        return true;
      });

      // Count failures from patience
      let ordersFailed = state.stats.ordersFailed;
      let combo = state.stats.combo;
      let reputation = state.stats.reputation;
      for (const o of updatedOrders) {
        if (o.state === 'failed' && state.orders.find((oo) => oo.id === o.id)?.state !== 'failed') {
          ordersFailed++;
          combo = 0;
          reputation = Math.max(0, reputation - 3);
        }
      }

      // Event banner timer
      let eventBanner = state.eventBanner;
      if (eventBanner) {
        eventBanner = { ...eventBanner, life: eventBanner.life - dt };
        if (eventBanner.life <= 0) eventBanner = null;
      }

      // Random event trigger
      let newState = { ...state, timeLeft, dinnerRush, chaos, activeEvent, eventTimer, orders: filteredOrders, nextOrderIn, orderIdCounter, eventBanner };
      if (!activeEvent && Math.random() < dt * 0.04 && timeLeft < state.shiftLength - 10) {
        newState = triggerEvent(newState);
      }

      // Game over
      const gameOver = timeLeft <= 0;
      if (gameOver) {
        return { ...newState, phase: 'results', gameOver: true, timeLeft: 0 };
      }

      return {
        ...newState,
        stats: { ...newState.stats, ordersFailed, combo, reputation },
        shake: Math.max(0, state.shake - dt * 3),
        comboFlash: Math.max(0, state.comboFlash - dt * 2),
        scoreFlash: Math.max(0, state.scoreFlash - dt * 2),
      };
    }

    case 'SELECT_ORDER': {
      if (action.id === null) {
        return { ...state, selectedOrderId: null };
      }
      const order = state.orders.find((o) => o.id === action.id);
      if (!order || order.state === 'served' || order.state === 'failed') return state;
      return { ...state, selectedOrderId: action.id, orders: state.orders.map((o) => o.id === action.id ? { ...o, state: 'preparing' as const } : (o.state === 'preparing' ? { ...o, state: 'waiting' as const } : o)) };
    }

    case 'STEP_PROGRESS': {
      if (!state.selectedOrderId) return state;
      const order = state.orders.find((o) => o.id === state.selectedOrderId);
      if (!order || order.state !== 'preparing') return state;

      const step = order.recipe.steps[order.stepIndex];
      if (!step) return state;

      let stepProgress = order.stepProgress + (action.correct ? action.amount : 0);
      let stepIndex = order.stepIndex;
      let burnLevel = order.burnLevel;
      let combo = state.stats.combo;
      let correctActions = state.stats.correctActions;
      let totalActions = state.stats.totalActions;
      let tips = state.stats.tips;
      let xp = state.stats.xp;
      let reputation = state.stats.reputation;
      let comboFlash = state.comboFlash;
      let scoreFlash = state.scoreFlash;
      let flashColor = state.flashColor;
      let floatingTexts = state.floatingTexts;
      let textId = state.textId;
      let particles = state.particles;
      let particleId = state.particleId;
      let shake = state.shake;

      if (action.correct) {
        totalActions++;
        correctActions++;
        combo++;
        const comboBonus = 1 + (combo - 1) * 0.1;
        tips += Math.round(2 * comboBonus);
        xp += 10 + combo * 2;
        reputation = Math.min(100, reputation + 0.5);
        comboFlash = 1;
        scoreFlash = 1;
        flashColor = '#f1c40f';
        floatingTexts = [...floatingTexts, { id: textId++, text: `+${Math.round(2 * comboBonus)}`, color: '#f1c40f', x: 50, y: 40, life: 1 }];
      } else {
        totalActions++;
        combo = 0;
        reputation = Math.max(0, reputation - 1);
        shake = 1;
        flashColor = '#e74c3c';
        floatingTexts = [...floatingTexts, { id: textId++, text: 'MISS!', color: '#e74c3c', x: 50, y: 40, life: 1 }];
      }

      if (stepProgress >= step.target) {
        // Step complete
        stepIndex++;
        stepProgress = 0;
        burnLevel = 0;
        particles = [...particles, ...spawnParticles({ ...state, particleId }, 50, 50, '#f39c12', 12)];
        particleId += 12;
        floatingTexts = [...floatingTexts, { id: textId++, text: 'STEP!', color: '#2ecc71', x: 50, y: 35, life: 1 }];

        if (stepIndex >= order.recipe.steps.length) {
          // Order complete!
          const baseReward = order.recipe.reward * order.bonusMultiplier;
          const comboMult = 1 + (combo - 1) * 0.1;
          const finalReward = Math.round(baseReward * comboMult);
          tips += finalReward;
          xp += 50 + combo * 5;
          reputation = Math.min(100, reputation + 2);
          const bestCombo = Math.max(state.stats.bestCombo, combo);
          const ordersCompleted = state.stats.ordersCompleted + 1;
          floatingTexts = [...floatingTexts, { id: textId++, text: `SERVED! +$${finalReward}`, color: '#2ecc71', x: 50, y: 30, life: 1.5 }];
          particles = [...particles, ...spawnParticles({ ...state, particleId }, 50, 50, '#2ecc71', 20, order.recipe.emoji)];
          particleId += 20;
          scoreFlash = 1.5;

          return {
            ...state,
            selectedOrderId: null,
            orders: state.orders.map((o) => o.id === order.id ? { ...o, state: 'served' as const } : o),
            stats: {
              ...state.stats,
              ordersCompleted,
              tips,
              combo,
              bestCombo,
              reputation,
              xp,
              totalActions,
              correctActions,
              accuracy: totalActions > 0 ? Math.round((correctActions / totalActions) * 100) : 100,
            },
            comboFlash,
            scoreFlash,
            flashColor,
            floatingTexts,
            particles,
            particleId,
            shake,
          };
        }
      }

      return {
        ...state,
        orders: state.orders.map((o) => o.id === order.id ? { ...o, stepIndex, stepProgress, burnLevel } : o),
        stats: {
          ...state.stats,
          tips,
          combo,
          reputation,
          xp,
          totalActions,
          correctActions,
          accuracy: totalActions > 0 ? Math.round((correctActions / totalActions) * 100) : 100,
          bestCombo: Math.max(state.stats.bestCombo, combo),
        },
        comboFlash,
        scoreFlash,
        flashColor,
        floatingTexts,
        particles,
        particleId,
        shake,
      };
    }

    case 'FAIL_ORDER': {
      const order = state.orders.find((o) => o.id === action.id);
      if (!order || order.state === 'failed') return state;
      return {
        ...state,
        selectedOrderId: state.selectedOrderId === action.id ? null : state.selectedOrderId,
        orders: state.orders.map((o) => o.id === action.id ? { ...o, state: 'failed' as const, patienceLeft: 0 } : o),
        stats: {
          ...state.stats,
          ordersFailed: state.stats.ordersFailed + 1,
          combo: 0,
          reputation: Math.max(0, state.stats.reputation - 5),
        },
        shake: 1,
        flashColor: '#e74c3c',
        floatingTexts: [...state.floatingTexts, { id: state.textId++, text: 'FAILED!', color: '#e74c3c', x: 50, y: 35, life: 1.5 }],
      };
    }

    case 'SPAWN_PARTICLES': {
      const parts = spawnParticles(state, action.x, action.y, action.color, action.count, action.emoji);
      return { ...state, particles: [...state.particles, ...parts], particleId: state.particleId + action.count };
    }

    case 'UPDATE_PARTICLES': {
      const dt = action.dt;
      const particles = state.particles
        .map((p) => ({
          ...p,
          x: p.x + (p.vx * dt),
          y: p.y + (p.vy * dt),
          vy: p.vy + 200 * dt,
          life: p.life - dt,
        }))
        .filter((p) => p.life > 0);
      const floatingTexts = state.floatingTexts
        .map((t) => ({ ...t, life: t.life - dt, y: t.y - 3 * dt }))
        .filter((t) => t.life > 0);
      return { ...state, particles, floatingTexts };
    }

    case 'FLOAT_TEXT':
      return { ...state, floatingTexts: [...state.floatingTexts, { id: state.textId++, text: action.text, color: action.color, x: action.x, y: action.y, life: 1 }] };

    case 'CLEAR_FLASH':
      return { ...state, comboFlash: 0, scoreFlash: 0 };

    default:
      return state;
  }
}

// ── Hook ─────────────────────────────────────────────────────
export function useGame() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const lastTime = useRef<number>(0);
  const rafRef = useRef<number>(0);

  // Game loop
  useEffect(() => {
    if (state.phase !== 'playing') return;
    const loop = (time: number) => {
      if (lastTime.current === 0) lastTime.current = time;
      const dt = Math.min(0.05, (time - lastTime.current) / 1000);
      lastTime.current = time;
      dispatch({ type: 'TICK', dt });
      dispatch({ type: 'UPDATE_PARTICLES', dt });
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      lastTime.current = 0;
    };
  }, [state.phase]);

  const start = useCallback(() => dispatch({ type: 'START' }), []);
  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);
  const selectOrder = useCallback((id: string | null) => dispatch({ type: 'SELECT_ORDER', id }), []);
  const stepProgress = useCallback((amount: number, correct: boolean) => dispatch({ type: 'STEP_PROGRESS', amount, correct }), []);
  const failOrder = useCallback((id: string) => dispatch({ type: 'FAIL_ORDER', id }), []);
  const spawnParticles = useCallback((x: number, y: number, color: string, count: number, emoji?: string) => dispatch({ type: 'SPAWN_PARTICLES', x, y, color, count, emoji }), []);

  return { state, start, reset, selectOrder, stepProgress, failOrder, spawnParticles };
}
