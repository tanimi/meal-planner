import { NextRequest, NextResponse } from 'next/server';
import { generateFullMealPlan } from '@/lib/claude';

export async function POST(request: NextRequest) {
  try {
    const mealPlan = await generateFullMealPlan();
    
    return NextResponse.json({
      success: true,
      data: mealPlan
    });
  } catch (error) {
    console.error('Error generating meal plan:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate meal plan'
      },
      { status: 500 }
    );
  }
}
