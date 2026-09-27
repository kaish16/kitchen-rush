// Core type definitions for KITCHEN RUSH: CONVEYOR RUSH + RIDDLE MASTER

export type GamePhase = 'start' | 'intro' | 'playing' | 'results';

export interface ConveyorItem {
  id: string;
  typeId: string;
  name: string;
  emoji: string;
  x: number; // 0% to 100% along conveyor belt
  speed: number; // percentage speed per second
  isBad?: boolean; // spoiled or fly on ingredient
}

export interface FoodRiddle {
  id: string;
  customerName: string;
  customerAvatar: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ConveyorDishRecipe {
  id: string;
  name: string;
  emoji: string;
  reward: number;
  patience: number;
  ingredients: Array<{
    id: string;
    name: string;
    emoji: string;
  }>;
}

export interface ActiveConveyorOrder {
  id: string;
  recipe: ConveyorDishRecipe;
  collectedIds: string[];
  patienceLeft: number;
  maxPatience: number;
  riddle: FoodRiddle;
  state: 'collecting' | 'riddle' | 'served' | 'failed';
  isVip?: boolean;
}

export interface GameParticle {
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

export interface GenZReaction {
  id: number;
  text: string;
  kind: 'clean' | 'flow' | 'fail' | 'vip';
  x: number;
  y: number;
  life: number;
  maxLife: number;
}

export interface KitchenRushStats {
  shiftNumber: number;
  money: number;
  ordersServed: number;
  ordersFailed: number;
  riddlesSolved: number;
  conveyorGrabs: number;
  maxFlow: number;
  timeSurvived: number;
  xpEarned: number;
}

export interface GameAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}
