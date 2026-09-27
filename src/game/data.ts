import type { ConveyorDishRecipe, FoodRiddle, GameAchievement } from './types';

// ── AVAILABLE INGREDIENTS POOL ──────────────────────────────
export const INGREDIENT_ITEMS = [
  { id: 'bread', name: 'Artisan Bun', emoji: '🍞' },
  { id: 'beef', name: 'Prime Beef', emoji: '🥩' },
  { id: 'cheese', name: 'Cheddar Cheese', emoji: '🧀' },
  { id: 'tomato', name: 'Ripe Tomato', emoji: '🍅' },
  { id: 'lettuce', name: 'Crisp Lettuce', emoji: '🥬' },
  { id: 'onion', name: 'Sweet Onion', emoji: '🧅' },
  { id: 'pasta', name: 'Fresh Pasta', emoji: '🍝' },
  { id: 'shrimp', name: 'Tiger Shrimp', emoji: '🦐' },
  { id: 'dough', name: 'Pizza Dough', emoji: '🫓' },
  { id: 'pepperoni', name: 'Pepperoni', emoji: '🍕' },
  { id: 'noodles', name: 'Ramen Noodles', emoji: '🍜' },
  { id: 'egg', name: 'Soft Boiled Egg', emoji: '🥚' },
  { id: 'fish', name: 'Fresh Salmon', emoji: '🐟' },
  { id: 'rice', name: 'Sushi Rice', emoji: '🍚' },
  { id: 'avocado', name: 'Hass Avocado', emoji: '🥑' },
];

// ── DISH RECIPES ────────────────────────────────────────────
export const CONVEYOR_RECIPES: ConveyorDishRecipe[] = [
  {
    id: 'burger',
    name: 'Classic Smash Burger',
    emoji: '🍔',
    reward: 25,
    patience: 35,
    ingredients: [
      { id: 'bread', name: 'Artisan Bun', emoji: '🍞' },
      { id: 'beef', name: 'Prime Beef', emoji: '🥩' },
      { id: 'cheese', name: 'Cheddar Cheese', emoji: '🧀' },
      { id: 'tomato', name: 'Ripe Tomato', emoji: '🍅' },
    ],
  },
  {
    id: 'pasta',
    name: 'Garlic Butter Pasta',
    emoji: '🍝',
    reward: 30,
    patience: 38,
    ingredients: [
      { id: 'pasta', name: 'Fresh Pasta', emoji: '🍝' },
      { id: 'shrimp', name: 'Tiger Shrimp', emoji: '🦐' },
      { id: 'tomato', name: 'Ripe Tomato', emoji: '🍅' },
      { id: 'cheese', name: 'Cheddar Cheese', emoji: '🧀' },
    ],
  },
  {
    id: 'pizza',
    name: 'Pepperoni Slice Pizza',
    emoji: '🍕',
    reward: 35,
    patience: 40,
    ingredients: [
      { id: 'dough', name: 'Pizza Dough', emoji: '🫓' },
      { id: 'tomato', name: 'Ripe Tomato', emoji: '🍅' },
      { id: 'cheese', name: 'Cheddar Cheese', emoji: '🧀' },
      { id: 'pepperoni', name: 'Pepperoni', emoji: '🍕' },
    ],
  },
  {
    id: 'ramen',
    name: 'Tonkotsu Ramen Bowl',
    emoji: '🍜',
    reward: 40,
    patience: 38,
    ingredients: [
      { id: 'noodles', name: 'Ramen Noodles', emoji: '🍜' },
      { id: 'egg', name: 'Soft Boiled Egg', emoji: '🥚' },
      { id: 'onion', name: 'Sweet Onion', emoji: '🧅' },
      { id: 'beef', name: 'Prime Beef', emoji: '🥩' },
    ],
  },
  {
    id: 'sushi',
    name: 'Salmon Avocado Roll',
    emoji: '🍣',
    reward: 45,
    patience: 36,
    ingredients: [
      { id: 'rice', name: 'Sushi Rice', emoji: '🍚' },
      { id: 'fish', name: 'Fresh Salmon', emoji: '🐟' },
      { id: 'avocado', name: 'Hass Avocado', emoji: '🥑' },
    ],
  },
  {
    id: 'sandwich',
    name: 'Club Deluxe Sandwich',
    emoji: '🥪',
    reward: 32,
    patience: 36,
    ingredients: [
      { id: 'bread', name: 'Artisan Bun', emoji: '🍞' },
      { id: 'lettuce', name: 'Crisp Lettuce', emoji: '🥬' },
      { id: 'tomato', name: 'Ripe Tomato', emoji: '🍅' },
      { id: 'beef', name: 'Prime Beef', emoji: '🥩' },
    ],
  },
];

// ── MCQ FOOD RIDDLES BANK ───────────────────────────────────
export const FOOD_RIDDLES: FoodRiddle[] = [
  {
    id: 'riddle-1',
    customerName: 'Marcus the Foodie',
    customerAvatar: '🧐',
    prompt:
      'I have seeds inside, I wear a red coat, and botanists call me a fruit while chefs cook me as a vegetable. What am I?',
    options: ['Tomato', 'Strawberry', 'Red Bell Pepper', 'Radish'],
    correctIndex: 0,
    explanation: 'Tomatoes are botanically fruits (berries!) but culinarily treated as vegetables.',
  },
  {
    id: 'riddle-2',
    customerName: 'Grillmaster Dave',
    customerAvatar: '🥩',
    prompt:
      'I tell the waiter: "Cook my steak so rare that a skilled vet could still save it!" How do I want it served?',
    options: ['Well Done', 'Medium', 'Rare / Blue Rare', 'Charred Black'],
    correctIndex: 2,
    explanation: '"Blue rare" or very rare means seared quickly on the outside while cool and red inside!',
  },
  {
    id: 'riddle-3',
    customerName: 'Chef Pierre',
    customerAvatar: '👨‍🍳',
    prompt:
      'Why do classic French chefs famously prepare an omelette using only one single egg?',
    options: [
      'Eggs are too expensive',
      'Because one egg is "un œuf" (enough)!',
      'The French frying pan is tiny',
      'French law restricts eggs',
    ],
    correctIndex: 1,
    explanation: 'In French, "un œuf" sounds exactly like "enough" in English!',
  },
  {
    id: 'riddle-4',
    customerName: 'Nonna Lucia',
    customerAvatar: '👵',
    prompt:
      'What Italian culinary phrase literally translates to "to the tooth", describing pasta with a firm bite?',
    options: ['Presto', 'Al Dente', 'Bravissimo', 'Dolce Vita'],
    correctIndex: 1,
    explanation: '"Al dente" literally means "to the tooth" in Italian!',
  },
  {
    id: 'riddle-5',
    customerName: 'Sous Chef Sam',
    customerAvatar: '🧅',
    prompt:
      'I cry when you slice me open, but you are the one shedding tears! Which vegetable am I?',
    options: ['Onion', 'Garlic', 'Jalapeño', 'Cucumber'],
    correctIndex: 0,
    explanation: 'Cutting onions releases syn-propanethial-S-oxide, stimulating our tear glands!',
  },
  {
    id: 'riddle-6',
    customerName: 'Sofia from Milan',
    customerAvatar: '☕',
    prompt:
      'Which famous coffee-flavored Italian dessert literally translates to "pick me up" or "lift me up"?',
    options: ['Cannoli', 'Gelato', 'Tiramisu', 'Panna Cotta'],
    correctIndex: 2,
    explanation: '"Tiramisù" in Italian translates to "pick me up" due to its rich espresso and cocoa!',
  },
  {
    id: 'riddle-7',
    customerName: 'Diner Regular Joe',
    customerAvatar: '🍔',
    prompt:
      'At the diner counter, a customer says: "Give me a smash burger, and hold the mayo." What does "hold" mean?',
    options: [
      'Squeeze the mayo bottle',
      'Do not include any mayo',
      'Serve mayo on the side',
      'Double the mayo amount',
    ],
    correctIndex: 1,
    explanation: 'In kitchen and diner slang, "hold" means to omit or withhold an ingredient.',
  },
  {
    id: 'riddle-8',
    customerName: 'Guacamole Enthusiast Ana',
    customerAvatar: '🥑',
    prompt:
      'I look like green butter, have a giant wooden pit, and I am the creamy star of guacamole. What am I?',
    options: ['Lime', 'Avocado', 'Kiwi', 'Zucchini'],
    correctIndex: 1,
    explanation: 'Avocado is rich in healthy fats, giving it its iconic buttery texture!',
  },
  {
    id: 'riddle-9',
    customerName: 'Historian Oliver',
    customerAvatar: '🎩',
    prompt:
      'Why do traditional tall chef hats (toques) have exactly 100 pleated folds?',
    options: [
      'They represent 100 ways to cook an egg',
      'It takes 100 days to become a chef',
      'To hold 100 grams of flour',
      'To celebrate the year 1900',
    ],
    correctIndex: 0,
    explanation: 'Historically, the 100 folds represented the master chef’s mastery of 100 different egg recipes!',
  },
  {
    id: 'riddle-10',
    customerName: 'Italian Cheese Critic',
    customerAvatar: '🧀',
    prompt:
      'Which granular, hard cow’s milk cheese aged in massive wheels is celebrated worldwide as the "King of Cheeses"?',
    options: ['Brie', 'Parmigiano-Reggiano', 'Feta', 'Mozzarella'],
    correctIndex: 1,
    explanation: 'Parmigiano-Reggiano from Emilia-Romagna is crowned the King of Cheeses!',
  },
  {
    id: 'riddle-11',
    customerName: 'Health-Conscious Guest',
    customerAvatar: '🥗',
    prompt:
      'A guest arrives and announces: "I have celiac disease and must strictly avoid gluten!" Which item is dangerous?',
    options: ['Fresh lettuce', 'Artisan wheat bread', 'Grilled salmon', 'Olive oil'],
    correctIndex: 1,
    explanation: 'Wheat bread contains gluten, which causes severe immune reactions in celiac disease.',
  },
  {
    id: 'riddle-12',
    customerName: 'Sushi Master Kenji',
    customerAvatar: '🍣',
    prompt:
      'What pungent green condiment served with sushi is traditionally grated using shark skin from a real root?',
    options: ['Matcha', 'Wasabi', 'Guacamole', 'Pesto'],
    correctIndex: 1,
    explanation: 'Authentic wasabi is grated from the wasabia japonica rhizome using an oroshigane grater.',
  },
  {
    id: 'riddle-13',
    customerName: 'French Gourmet Chloe',
    customerAvatar: '🥐',
    prompt:
      'When butter and flour are cooked together in equal parts to thicken sauces, what is this foundation called?',
    options: ['Roux', 'Coulis', 'Mirepoix', 'Ganache'],
    correctIndex: 0,
    explanation: 'A roux is the classic culinary thickener made from equal parts fat and flour.',
  },
  {
    id: 'riddle-14',
    customerName: 'Potato Fan Spud',
    customerAvatar: '🍟',
    prompt:
      'I have eyes but cannot see, grow asleep under the dark earth, and get chopped into golden crispy fries. What am I?',
    options: ['Carrot', 'Beetroot', 'Potato', 'Turnip'],
    correctIndex: 2,
    explanation: 'Potatoes feature small sprouting buds known botanically as "eyes"!',
  },
  {
    id: 'riddle-15',
    customerName: 'Spice Explorer Raj',
    customerAvatar: '🌶️',
    prompt:
      'I was so valuable in ancient times that I was used as currency and nicknamed "Black Gold". What spice am I?',
    options: ['Black Peppercorn', 'Cinnamon', 'Turmeric', 'Cumin'],
    correctIndex: 0,
    explanation: 'Black peppercorns were historically so precious they were traded as money and dowries!',
  },
];

// ── GEN-Z REACTIONS ─────────────────────────────────────────
export const GEN_Z_REACTIONS = {
  success: ['CLEAN', 'NICE', 'COOKING 🔥', 'WE MOVE', 'PERFECT', "CHEF'S KISS", 'LOCKED IN'],
  perfect: ['5-STAR BEHAVIOR', 'ABSOLUTE CHEF', 'PERFECT FLIP ⭐', 'MICHELIN ENERGY', 'MASTERCLASS'],
  highFlow: ['BRO IS COOKING', 'THE FLOW IS FLOWING', 'UNSTOPPABLE 🔥', 'HIM DUNCAN CHEF', 'TURBO LOCKED IN'],
  mistake: ['BRUH 💀', "WE'RE COOKED", 'NAHHH', 'WHO LET HIM COOK', 'NOT THE PASTA 😭'],
  burnt: ['BRO BURNED IT 💀', 'THE FIRE WON', 'CRISPY ACCIDENT', 'CALL THE BRIGADE 😭'],
  vip: ['VIP PULLED UP 💼', 'BIG BAG ALERT 💰', 'DO NOT DROP THIS'],
};

// ── ACHIEVEMENTS ────────────────────────────────────────────
export const ACHIEVEMENTS_LIST: GameAchievement[] = [
  {
    id: 'first_dish',
    title: 'First Delivery',
    description: 'Solve your first customer food riddle and serve the order.',
    icon: '🍽️',
    unlocked: false,
  },
  {
    id: 'chefs_kiss',
    title: 'Trivia Master',
    description: 'Solve 5 customer food riddles with 100% accuracy.',
    icon: '🧠',
    unlocked: false,
  },
  {
    id: 'flow_state',
    title: 'Conveyor Demon',
    description: 'Reach maximum conveyor speed FLOW x5.',
    icon: '⚡',
    unlocked: false,
  },
  {
    id: 'no_burnt',
    title: 'Flawless Shift',
    description: 'Complete a shift with zero failed orders or wrong ingredients.',
    icon: '🛡️',
    unlocked: false,
  },
  {
    id: 'who_let_him_cook',
    title: 'Master Chef',
    description: 'Deliver 10 completed dishes in a single shift.',
    icon: '👨‍🍳',
    unlocked: false,
  },
  {
    id: 'kitchen_demon',
    title: 'VIP Favorite',
    description: 'Successfully complete all orders without letting the timer expire.',
    icon: '🔥',
    unlocked: false,
  },
];

