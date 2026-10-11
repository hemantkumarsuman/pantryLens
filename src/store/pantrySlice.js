import { createSlice } from '@reduxjs/toolkit';

const SAMPLE_INGREDIENTS = [
  { id: '1', name: 'Eggs', category: 'protein', icon: '🥚' },
  { id: '2', name: 'Avocado', category: 'produce', icon: '🥑' },
  { id: '3', name: 'Cherry Tomatoes', category: 'produce', icon: '🍅' },
  { id: '4', name: 'Sourdough Bread', category: 'bakery', icon: '🍞' },
  { id: '5', name: 'Garlic', category: 'pantry', icon: '🧄' },
  { id: '6', name: 'Baby Spinach', category: 'produce', icon: '🥬' },
  { id: '7', name: 'Olive Oil', category: 'pantry', icon: '🫒' },
  { id: '8', name: 'Parmesan Cheese', category: 'dairy', icon: '🧀' },
];

const SAMPLE_RECIPES = [
  {
    id: 'sample-1',
    title: 'Rustic Poached Egg & Charred Tomato Tartine',
    tagline: 'Artisanal sourdough topped with wilted spinach, blistered cherry tomatoes, and runny eggs',
    cuisine: 'Mediterranean Bistro',
    prepTime: 10,
    cookTime: 12,
    difficulty: 'Easy',
    servings: 2,
    matchPercentage: 96,
    caloriesPerServing: 380,
    macros: { protein: 21, carbs: 32, fat: 19, fiber: 7 },
    flavorProfile: { savory: 85, umami: 75, fresh: 90, spicy: 20, sweet: 30 },
    chefSecret: 'Blister the tomatoes on high heat without moving them for 2 minutes to concentrate natural sugars.',
    usedIngredients: ['Eggs', 'Sourdough Bread', 'Baby Spinach', 'Cherry Tomatoes', 'Garlic', 'Olive Oil', 'Parmesan Cheese'],
    missingIngredients: ['Balsamic glaze (optional)'],
    instructions: [
      {
        step: 1,
        title: 'Toast & Garlic Rub',
        text: 'Thickly slice the sourdough. Toast until golden brown and crusty. While steaming hot, rub a raw garlic clove directly across the rough surface of the toast.',
        durationMinutes: 4,
        tip: 'The rough bread acts like a grater, infusing rich roasted garlic aroma without biting chunks.'
      },
      {
        step: 2,
        title: 'Blister Tomatoes & Wilt Greens',
        text: 'Heat olive oil in a skillet over medium-high heat. Add whole cherry tomatoes until skins begin to burst and char (3 mins). Toss in spinach and a pinch of salt until tender (1 min).',
        durationMinutes: 4,
        tip: 'Do not crowd the skillet to ensure blistered charring instead of steaming.'
      },
      {
        step: 3,
        title: 'Poach or Fry the Eggs',
        text: 'In the same pan, gently crack eggs. Cook sunny-side up with crispy lace edges, or gently poach in simmering water for 3 minutes until yolks are silky soft.',
        durationMinutes: 3,
        tip: 'Baste the egg whites with hot oil for golden crispy edges.'
      },
      {
        step: 4,
        title: 'Assemble & Garnish',
        text: 'Layer the toasted sourdough with wilted spinach, blistered tomatoes, and top with the warm eggs. Shave fresh parmesan and crack black pepper over the top.',
        durationMinutes: 2,
        tip: 'Finish with a drizzle of extra virgin olive oil.'
      }
    ]
  },
  {
    id: 'sample-2',
    title: 'Silky Avocado & Spinach Green Goddess Scramble',
    tagline: 'Velvety folded eggs with ripe avocado cubes, fresh spinach ribbons, and melted parmesan',
    cuisine: 'California Brunch',
    prepTime: 8,
    cookTime: 8,
    difficulty: 'Easy',
    servings: 2,
    matchPercentage: 92,
    caloriesPerServing: 340,
    macros: { protein: 24, carbs: 12, fat: 22, fiber: 6 },
    flavorProfile: { savory: 80, umami: 70, fresh: 95, spicy: 15, sweet: 15 },
    chefSecret: 'Remove the pan from heat when the eggs look 80% done; residual pan heat will finish cooking them to silkiness.',
    usedIngredients: ['Eggs', 'Avocado', 'Baby Spinach', 'Olive Oil', 'Parmesan Cheese'],
    missingIngredients: ['Chives or microgreens (optional)'],
    instructions: [
      {
        step: 1,
        title: 'Prep Ingredients',
        text: 'Whisk eggs vigorously with a tablespoon of cold water and a pinch of salt until frothy. Dice the avocado and roughly shred the spinach.',
        durationMinutes: 3,
        tip: 'Cold water creates steam as eggs cook, resulting in cloud-like fluffy texture.'
      },
      {
        step: 2,
        title: 'Gentle Low-Heat Fold',
        text: 'Set nonstick skillet to medium-low heat with olive oil. Pour in whisked eggs and let sit for 20 seconds. Use a spatula to gently pull curds toward the center.',
        durationMinutes: 3,
        tip: 'Keep the heat gentle to prevent eggs from weeping or rubberizing.'
      },
      {
        step: 3,
        title: 'Fold Greens & Avocado',
        text: 'When eggs are soft curds, fold in spinach ribbons and diced avocado. Take off heat, sprinkle parmesan cheese, and cover with a lid for 60 seconds.',
        durationMinutes: 2,
        tip: 'The avocado warms through gently without getting bitter.'
      }
    ]
  },
  {
    id: 'sample-3',
    title: 'Crispy Garlic Parmesan Sourdough Panzanella',
    tagline: 'Warm Tuscan bread salad with blistered tomatoes, fresh spinach, and soft egg ribbons',
    cuisine: 'Tuscan Italian',
    prepTime: 12,
    cookTime: 15,
    difficulty: 'Intermediate',
    servings: 2,
    matchPercentage: 88,
    caloriesPerServing: 420,
    macros: { protein: 18, carbs: 44, fat: 20, fiber: 8 },
    flavorProfile: { savory: 90, umami: 85, fresh: 75, spicy: 35, sweet: 45 },
    chefSecret: 'Allow the warm crusty sourdough croutons to absorb the warm tomato juices in the bowl.',
    usedIngredients: ['Sourdough Bread', 'Cherry Tomatoes', 'Garlic', 'Baby Spinach', 'Olive Oil', 'Parmesan Cheese', 'Eggs'],
    missingIngredients: ['Red wine vinegar', 'Fresh basil'],
    instructions: [
      {
        step: 1,
        title: 'Golden Garlic Croutons',
        text: 'Tear sourdough into bite-sized rustic chunks. Sauté with olive oil and crushed garlic over medium heat until deeply golden and crunchy on the outside.',
        durationMinutes: 6,
        tip: 'Tearing bread rather than cutting creates craggy pockets that hold dressing.'
      },
      {
        step: 2,
        title: 'Warm Tomato Vinaigrette',
        text: 'In the warm skillet, add cherry tomatoes and cook until they release sweet juices. Mash a few lightly with a wooden spoon.',
        durationMinutes: 4,
        tip: 'The warm tomato juice emulsifies naturally with the olive oil.'
      },
      {
        step: 3,
        title: 'Toss & Plate',
        text: 'In a large bowl, toss the warm croutons, spinach, and tomato reduction. Top with medium-boiled egg halves and shaved parmesan.',
        durationMinutes: 3,
        tip: 'Serve immediately while croutons have both crunch and sauce-soaked tenderness.'
      }
    ]
  }
];

const initialState = {
  apiKey: localStorage.getItem('pantrylens_gemini_key') || '',
  ingredients: SAMPLE_INGREDIENTS,
  recipes: SAMPLE_RECIPES,
  selectedRecipe: null,
  activeFilter: 'all', // 'all' | 'high-protein' | 'under-25m' | 'vegetarian' | 'low-carb'
  servingsMultiplier: 2,
  isCookingMode: false,
  cookingStepIndex: 0,
  uploadedImage: null,
  isAnalyzing: false,
  analysisStatus: '',
  error: null,
};

export const pantrySlice = createSlice({
  name: 'pantry',
  initialState,
  reducers: {
    setApiKey: (state, action) => {
      state.apiKey = action.payload;
      if (action.payload) {
        localStorage.setItem('pantrylens_gemini_key', action.payload);
      } else {
        localStorage.removeItem('pantrylens_gemini_key');
      }
    },
    addIngredient: (state, action) => {
      const name = action.payload.trim();
      if (!name) return;
      const exists = state.ingredients.some(i => i.name.toLowerCase() === name.toLowerCase());
      if (!exists) {
        state.ingredients.push({
          id: Date.now().toString(),
          name: name,
          category: 'pantry',
          icon: '✨'
        });
      }
    },
    removeIngredient: (state, action) => {
      state.ingredients = state.ingredients.filter(i => i.id !== action.payload);
    },
    clearIngredients: (state) => {
      state.ingredients = [];
    },
    setIngredients: (state, action) => {
      state.ingredients = action.payload;
    },
    setRecipes: (state, action) => {
      state.recipes = action.payload;
    },
    selectRecipe: (state, action) => {
      state.selectedRecipe = action.payload;
    },
    clearSelectedRecipe: (state) => {
      state.selectedRecipe = null;
    },
    setActiveFilter: (state, action) => {
      state.activeFilter = action.payload;
    },
    setServingsMultiplier: (state, action) => {
      state.servingsMultiplier = Math.max(1, Math.min(8, action.payload));
    },
    startCookingMode: (state, action) => {
      state.selectedRecipe = action.payload;
      state.isCookingMode = true;
      state.cookingStepIndex = 0;
    },
    closeCookingMode: (state) => {
      state.isCookingMode = false;
      state.cookingStepIndex = 0;
    },
    setCookingStep: (state, action) => {
      state.cookingStepIndex = action.payload;
    },
    nextCookingStep: (state) => {
      if (state.selectedRecipe && state.cookingStepIndex < state.selectedRecipe.instructions.length - 1) {
        state.cookingStepIndex += 1;
      }
    },
    prevCookingStep: (state) => {
      if (state.cookingStepIndex > 0) {
        state.cookingStepIndex -= 1;
      }
    },
    setUploadedImage: (state, action) => {
      state.uploadedImage = action.payload;
    },
    setIsAnalyzing: (state, action) => {
      state.isAnalyzing = action.payload;
    },
    setAnalysisStatus: (state, action) => {
      state.analysisStatus = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    loadDemoKitchen: (state) => {
      state.ingredients = SAMPLE_INGREDIENTS;
      state.recipes = SAMPLE_RECIPES;
      state.error = null;
      state.uploadedImage = null;
    }
  },
});

export const {
  setApiKey,
  addIngredient,
  removeIngredient,
  clearIngredients,
  setIngredients,
  setRecipes,
  selectRecipe,
  clearSelectedRecipe,
  setActiveFilter,
  setServingsMultiplier,
  startCookingMode,
  closeCookingMode,
  setCookingStep,
  nextCookingStep,
  prevCookingStep,
  setUploadedImage,
  setIsAnalyzing,
  setAnalysisStatus,
  setError,
  loadDemoKitchen,
} = pantrySlice.actions;

export default pantrySlice.reducer;
