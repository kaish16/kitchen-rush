import type { DishRecipe, SpecialEvent } from './types';

// ── Ingredients ──────────────────────────────────────────────
export const INGREDIENTS: Record<string, { name: string; emoji: string; color: string }> = {
  tomato: { name: 'Tomato', emoji: '🍅', color: '#e74c3c' },
  lettuce: { name: 'Lettuce', emoji: '🥬', color: '#27ae60' },
  cheese: { name: 'Cheese', emoji: '🧀', color: '#f1c40f' },
  meat: { name: 'Beef', emoji: '🥩', color: '#8b4513' },
  fish: { name: 'Fish', emoji: '🐟', color: '#3498db' },
  rice: { name: 'Rice', emoji: '🍚', color: '#fffde7' },
  egg: { name: 'Egg', emoji: '🥚', color: '#fff3b0' },
  noodle: { name: 'Noodles', emoji: '🍜', color: '#e67e22' },
  pepper: { name: 'Pepper', emoji: '🫑', color: '#f39c12' },
  onion: { name: 'Onion', emoji: '🧅', color: '#bdc3c7' },
  garlic: { name: 'Garlic', emoji: '🧄', color: '#ecf0f1' },
  bread: { name: 'Bread', emoji: '🍞', color: '#deb887' },
  chicken: { name: 'Chicken', emoji: '🍗', color: '#d4a373' },
  shrimp: { name: 'Shrimp', emoji: '🦐', color: '#ff6b6b' },
  avocado: { name: 'Avocado', emoji: '🥑', color: '#7cb342' },
  lime: { name: 'Lime', emoji: '🍋', color: '#fdd835' },
  herbs: { name: 'Herbs', emoji: '🌿', color: '#66bb6a' },
  chili: { name: 'Chili', emoji: '🌶️', color: '#e53935' },
};

// ── Recipes ──────────────────────────────────────────────────
export const RECIPES: DishRecipe[] = [
  {
    id: 'burger',
    name: 'Classic Burger',
    emoji: '🍔',
    ticketColor: '#e74c3c',
    steps: [
      { type: 'chop', label: 'Chop Tomato', target: 6 },
      { type: 'cook', label: 'Grill Beef', target: 4 },
      { type: 'plate', label: 'Assemble Burger', target: 4 },
    ],
    reward: 18,
    patience: 45,
  },
  {
    id: 'salad',
    name: 'Garden Salad',
    emoji: '🥗',
    ticketColor: '#27ae60',
    steps: [
      { type: 'chop', label: 'Chop Lettuce', target: 5 },
      { type: 'chop', label: 'Chop Tomato', target: 4 },
      { type: 'season', label: 'Season Salad', target: 3 },
      { type: 'plate', label: 'Plate Salad', target: 3 },
    ],
    reward: 14,
    patience: 40,
  },
  {
    id: 'pasta',
    name: 'Seafood Pasta',
    emoji: '🍝',
    ticketColor: '#e67e22',
    steps: [
      { type: 'cook', label: 'Boil Noodles', target: 5 },
      { type: 'cook', label: 'Sauté Shrimp', target: 4 },
      { type: 'season', label: 'Add Garlic & Chili', target: 4 },
      { type: 'plate', label: 'Plate Pasta', target: 3 },
    ],
    reward: 22,
    patience: 50,
  },
  {
    id: 'sushi',
    name: 'Sushi Roll',
    emoji: '🍣',
    ticketColor: '#9b59b6',
    steps: [
      { type: 'chop', label: 'Slice Fish', target: 7 },
      { type: 'chop', label: 'Cut Avocado', target: 5 },
      { type: 'plate', label: 'Roll & Plate', target: 5 },
      { type: 'season', label: 'Add Lime', target: 2 },
    ],
    reward: 25,
    patience: 48,
  },
  {
    id: 'steak',
    name: 'Grilled Steak',
    emoji: '🥩',
    ticketColor: '#c0392b',
    steps: [
      { type: 'season', label: 'Season Steak', target: 3 },
      { type: 'cook', label: 'Grill Steak', target: 6 },
      { type: 'plate', label: 'Plate Steak', target: 3 },
    ],
    reward: 28,
    patience: 42,
  },
  {
    id: 'taco',
    name: 'Street Tacos',
    emoji: '🌮',
    ticketColor: '#f39c12',
    steps: [
      { type: 'chop', label: 'Chop Onion', target: 4 },
      { type: 'cook', label: 'Cook Chicken', target: 4 },
      { type: 'plate', label: 'Assemble Tacos', target: 4 },
      { type: 'season', label: 'Add Lime & Chili', target: 3 },
    ],
    reward: 16,
    patience: 40,
  },
  {
    id: 'omelette',
    name: 'Cheese Omelette',
    emoji: '🍳',
    ticketColor: '#f1c40f',
    steps: [
      { type: 'cook', label: 'Cook Eggs', target: 4 },
      { type: 'season', label: 'Add Cheese', target: 2 },
      { type: 'plate', label: 'Fold & Plate', target: 3 },
    ],
    reward: 15,
    patience: 38,
  },
  {
    id: 'curry',
    name: 'Red Curry',
    emoji: '🍛',
    ticketColor: '#d35400',
    steps: [
      { type: 'chop', label: 'Chop Chicken', target: 5 },
      { type: 'cook', label: 'Simmer Curry', target: 6 },
      { type: 'season', label: 'Add Chili & Herbs', target: 4 },
      { type: 'plate', label: 'Plate with Rice', target: 3 },
    ],
    reward: 24,
    patience: 52,
  },
];

// ── Special Events ───────────────────────────────────────────
export const SPECIAL_EVENTS: SpecialEvent[] = [
  {
    id: 'vip',
    label: 'VIP CUSTOMER',
    description: 'A VIP just walked in! Big tip bonus for perfect dishes!',
    color: '#f1c40f',
    duration: 15,
  },
  {
    id: 'table12',
    label: 'TABLE 12 IS WAITING',
    description: 'Waiter needs an order NOW! Patience drains faster!',
    color: '#e74c3c',
    duration: 12,
  },
  {
    id: 'overheat',
    label: 'OVEN OVERHEATING',
    description: 'The oven is overheating! Food burns twice as fast!',
    color: '#e67e22',
    duration: 10,
  },
  {
    id: 'shortage',
    label: 'INGREDIENT SHORTAGE',
    description: 'Ingredients are running low! Orders take longer!',
    color: '#95a5a6',
    duration: 12,
  },
  {
    id: 'critic',
    label: 'FOOD CRITIC ARRIVED',
    description: 'A food critic is here! Perfect dishes = huge reputation!',
    color: '#9b59b6',
    duration: 20,
  },
  {
    id: 'double',
    label: 'DOUBLE ORDER',
    description: 'Two orders at once! Keep up!',
    color: '#3498db',
    duration: 8,
  },
];

// ── Achievements ─────────────────────────────────────────────
export interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  check: (stats: {
    ordersCompleted: number;
    bestCombo: number;
    accuracy: number;
    tips: number;
    reputation: number;
  }) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_blood',
    name: 'First Plate',
    description: 'Complete your first order',
    emoji: '🏅',
    check: (s) => s.ordersCompleted >= 1,
  },
  {
    id: 'combo_master',
    name: 'Combo Master',
    description: 'Reach a 5x combo',
    emoji: '🔥',
    check: (s) => s.bestCombo >= 5,
  },
  {
    id: 'flawless',
    name: 'Flawless Hands',
    description: 'Finish with 90%+ accuracy',
    emoji: '✨',
    check: (s) => s.accuracy >= 90,
  },
  {
    id: 'survivor',
    name: 'Shift Survivor',
    description: 'Complete 10 orders in one shift',
    emoji: '💪',
    check: (s) => s.ordersCompleted >= 10,
  },
  {
    id: 'big_tips',
    name: 'Big Tipper',
    description: 'Earn $200+ in tips',
    emoji: '💰',
    check: (s) => s.tips >= 200,
  },
  {
    id: 'legend',
    name: 'Kitchen Legend',
    description: 'Reach max reputation',
    emoji: '👑',
    check: (s) => s.reputation >= 100,
  },
];
