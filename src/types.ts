export interface Recipe {
  id: string;
  name: string;
  description: string;
  cookTime: string;
  servings: string;
  ingredients: string[];
  steps: string[];
}

export interface MealPlan {
  lunches: Recipe[];
  dinners: Recipe[];
  groceryList: GrocerySection[];
}

export interface GrocerySection {
  category: string;
  items: string[];
}

// API request/response types
export interface GenerateRequest {
  type: 'full' | 'regenerate';
  mealType?: 'lunch' | 'dinner';
  recipeIndex?: number;
  feedback?: string;
  currentPlan?: {
    lunches: Recipe[];
    dinners: Recipe[];
  };
}

export interface GenerateResponse {
  success: boolean;
  data?: MealPlan | Recipe;
  error?: string;
}
