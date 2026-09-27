// Core type definitions for KITCHEN RUSH

export type GamePhase = 'start' | 'playing' | 'results';

export type PrepType = 'chop' | 'cook' | 'season' | 'plate';

export interface Ingredient {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface PrepStep {
  type: PrepType;
  label: string;
  /** Number of taps needed for chop, seconds for cook, etc. */
  target: number;
}

export interface DishRecipe {
  id: string;
  name: string;
  emoji: string;
  ticketColor: string;
  steps: PrepStep[];
  reward: number;
  /** Seconds before the customer leaves */
  patience: number;
}

export interface Order {
  id: string;
  recipe: DishRecipe;
  stepIndex: number;
  stepProgress: number;
  /** Remaining patience in seconds */
  patienceLeft: number;
  state: 'waiting' | 'preparing' | 'ready' | 'served' | 'failed';
  /** 0–1 progress for the current step */
  burnLevel: number;
  /** Whether this order is a VIP/double/etc. flagged by an event */
  special?: 'vip' | 'double' | 'critic';
  bonusMultiplier: number;
}

export interface SpecialEvent {
  id: string;
  label: string;
  description: string;
  color: string;
  duration: number;
}

export interface GameStats {
  ordersCompleted: number;
  ordersFailed: number;
  tips: number;
  combo: number;
  bestCombo: number;
  accuracy: number;
  reputation: number;
  xp: number;
  totalActions: number;
  correctActions: number;
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  emoji?: string;
}
