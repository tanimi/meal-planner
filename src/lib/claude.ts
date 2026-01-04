import Anthropic from '@anthropic-ai/sdk';
import { Recipe, MealPlan, GrocerySection } from '@/types';

// Initialize the Anthropic client
// API key is read from ANTHROPIC_API_KEY environment variable
const anthropic = new Anthropic();

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Claude sometimes wraps JSON in markdown code fences even when asked not to.
 * This strips them out so we can parse the JSON.
 */
function extractJSON(text: string): string {
  // Remove ```json or ``` at the start and ``` at the end
  let cleaned = text.trim();
  
  // Handle ```json\n...\n``` format
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3);
  }
  
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3);
  }
  
  return cleaned.trim();
}

// =============================================================================
// SYSTEM PROMPT
// This encodes all the preferences and constraints for meal generation.
// Edit this to change the "personality" of the meal suggestions.
// =============================================================================

const SYSTEM_PROMPT = `You are a helpful meal planning assistant. You create healthy, whole-food batch cooking meal plans for a couple in their early 30s living in Brooklyn.

KEY CONSTRAINTS:
- All meals should be healthy and use whole, unprocessed ingredients
- Recipes should be batch-cooking friendly (cook once, eat multiple times)
- Total cook time for all recipes combined should be 1-4 hours
- Lunches should be lighter (lower carb when possible)
- Dinners can be heartier
- No dietary restrictions to worry about

YOUR TASK:
Generate meal plans that cover 3 days of eating. You decide the optimal number of recipes based on complexity:
- For lunches: 1-3 recipes depending on variety and prep simplicity
- For dinners: 2-3 recipes depending on complexity

For example:
- A simple grain bowl that works for 3 days = 1 lunch recipe
- Two different salads that keep well = 2 lunch recipes
- One complex braise + one quick stir-fry = 2 dinner recipes

Prioritize:
1. Flavor and inspiration (these should be meals they're excited to eat)
2. Practical batch cooking (ingredients that keep well, reheat nicely)
3. Variety across the plan (different cuisines, proteins, flavor profiles)

OUTPUT FORMAT:
Always respond with valid JSON matching this exact structure:
{
  "lunches": [
    {
      "id": "lunch-1",
      "name": "Recipe Name",
      "description": "2-3 sentence description including why it batch cooks well",
      "cookTime": "X minutes",
      "servings": "X servings (X days for 2 people)",
      "ingredients": ["ingredient with quantity", ...],
      "steps": ["Step 1 instruction", "Step 2 instruction", ...]
    }
  ],
  "dinners": [
    {
      "id": "dinner-1", 
      "name": "Recipe Name",
      "description": "2-3 sentence description",
      "cookTime": "X minutes",
      "servings": "X servings (X days for 2 people)",
      "ingredients": ["ingredient with quantity", ...],
      "steps": ["Step 1 instruction", ...]
    }
  ]
}

Important:
- IDs should be "lunch-1", "lunch-2", etc. and "dinner-1", "dinner-2", etc.
- Ingredients should include specific quantities
- Steps should be clear and actionable
- Only output the JSON, no other text`;

const REGENERATE_PROMPT = `You are a helpful meal planning assistant. A user wants to regenerate ONE recipe from their meal plan based on their feedback.

Keep the same general format and style as the original recipe, but incorporate their feedback to create something different.

OUTPUT FORMAT:
Respond with valid JSON for a single recipe:
{
  "id": "KEEP_SAME_ID",
  "name": "New Recipe Name",
  "description": "2-3 sentence description",
  "cookTime": "X minutes", 
  "servings": "X servings (X days for 2 people)",
  "ingredients": ["ingredient with quantity", ...],
  "steps": ["Step 1 instruction", ...]
}

Only output the JSON, no other text.`;

// =============================================================================
// GROCERY LIST GENERATION
// Consolidates ingredients from all recipes and organizes by store section
// =============================================================================

const GROCERY_SYSTEM_PROMPT = `You consolidate recipe ingredients into an organized grocery list.

Given a list of all ingredients from multiple recipes, you should:
1. Combine duplicate ingredients (e.g., "2 cloves garlic" + "4 cloves garlic" = "6 cloves garlic")
2. Organize by grocery store section
3. Use consistent formatting

OUTPUT FORMAT:
{
  "groceryList": [
    {
      "category": "Produce",
      "items": ["item with quantity", ...]
    },
    {
      "category": "Meat & Seafood",
      "items": [...]
    },
    {
      "category": "Dairy",
      "items": [...]
    },
    {
      "category": "Pantry",
      "items": [...]
    },
    {
      "category": "Frozen",
      "items": [...]
    },
    {
      "category": "Other",
      "items": [...]
    }
  ]
}

Only include categories that have items. Only output JSON, no other text.`;

// =============================================================================
// API FUNCTIONS
// These are the main exports used by the API routes
// =============================================================================

export async function generateFullMealPlan(): Promise<MealPlan> {
  // Generate recipes
  const recipeResponse = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: 'Generate a fresh meal plan for the next 3 days. Be creative and inspiring!'
      }
    ]
  });

  const recipeText = recipeResponse.content[0].type === 'text' 
    ? recipeResponse.content[0].text 
    : '';
  
  const recipes = JSON.parse(extractJSON(recipeText)) as { lunches: Recipe[]; dinners: Recipe[] };

  // Generate consolidated grocery list
  const allIngredients = [
    ...recipes.lunches.flatMap(r => r.ingredients),
    ...recipes.dinners.flatMap(r => r.ingredients)
  ];

  const groceryResponse = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    system: GROCERY_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Consolidate these ingredients into an organized grocery list:\n\n${allIngredients.join('\n')}`
      }
    ]
  });

  const groceryText = groceryResponse.content[0].type === 'text'
    ? groceryResponse.content[0].text
    : '';
  
  const { groceryList } = JSON.parse(extractJSON(groceryText)) as { groceryList: GrocerySection[] };

  return {
    lunches: recipes.lunches,
    dinners: recipes.dinners,
    groceryList
  };
}

export async function regenerateRecipe(
  originalRecipe: Recipe,
  feedback: string,
  mealType: 'lunch' | 'dinner'
): Promise<Recipe> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    system: REGENERATE_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Here's the original ${mealType} recipe:
${JSON.stringify(originalRecipe, null, 2)}

User feedback: "${feedback}"

Generate a new recipe that addresses their feedback. Keep the same ID (${originalRecipe.id}).`
      }
    ]
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  return JSON.parse(extractJSON(text)) as Recipe;
}

export async function regenerateGroceryList(
  lunches: Recipe[],
  dinners: Recipe[]
): Promise<GrocerySection[]> {
  const allIngredients = [
    ...lunches.flatMap(r => r.ingredients),
    ...dinners.flatMap(r => r.ingredients)
  ];

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    system: GROCERY_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Consolidate these ingredients into an organized grocery list:\n\n${allIngredients.join('\n')}`
      }
    ]
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  const { groceryList } = JSON.parse(extractJSON(text)) as { groceryList: GrocerySection[] };
  
  return groceryList;
}