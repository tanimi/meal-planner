import { NextRequest, NextResponse } from 'next/server';
import { regenerateRecipe, regenerateGroceryList } from '@/lib/claude';
import { Recipe } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      originalRecipe, 
      feedback, 
      mealType,
      allLunches,
      allDinners
    } = body as {
      originalRecipe: Recipe;
      feedback: string;
      mealType: 'lunch' | 'dinner';
      allLunches: Recipe[];
      allDinners: Recipe[];
    };

    // Generate the new recipe
    const newRecipe = await regenerateRecipe(originalRecipe, feedback, mealType);

    // Update the recipe arrays with the new recipe
    const updatedLunches = mealType === 'lunch'
      ? allLunches.map(r => r.id === originalRecipe.id ? newRecipe : r)
      : allLunches;
    
    const updatedDinners = mealType === 'dinner'
      ? allDinners.map(r => r.id === originalRecipe.id ? newRecipe : r)
      : allDinners;

    // Regenerate the grocery list with updated recipes
    const groceryList = await regenerateGroceryList(updatedLunches, updatedDinners);

    return NextResponse.json({
      success: true,
      data: {
        recipe: newRecipe,
        groceryList
      }
    });
  } catch (error) {
    console.error('Error regenerating recipe:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to regenerate recipe'
      },
      { status: 500 }
    );
  }
}
