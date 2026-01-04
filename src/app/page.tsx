'use client';

import { useState } from 'react';
import { Recipe, MealPlan, GrocerySection } from '@/types';
import styles from './page.module.css';

function RecipeCard({ 
  recipe, 
  mealType,
  onRegenerate,
  isRegenerating
}: { 
  recipe: Recipe; 
  mealType: 'lunch' | 'dinner';
  onRegenerate: (feedback: string) => Promise<void>;
  isRegenerating: boolean;
}) {
  const [feedback, setFeedback] = useState('');

  const handleRegenerate = async () => {
    if (!feedback.trim()) return;
    await onRegenerate(feedback);
    setFeedback('');
  };

  return (
    <div className={styles.recipeCard}>
      <div className={styles.recipeHeader}>
        <span className={styles.mealLabel}>{mealType}</span>
        <h2 className={styles.recipeName}>{recipe.name}</h2>
        <p className={styles.recipeDescription}>{recipe.description}</p>
        <div className={styles.recipeMeta}>
          <span>⏱ {recipe.cookTime}</span>
          <span>🍽 {recipe.servings}</span>
        </div>
      </div>

      <div className={styles.recipeSection}>
        <h3>Ingredients</h3>
        <ul className={styles.ingredientList}>
          {recipe.ingredients.map((ing, i) => (
            <li key={i}>{ing}</li>
          ))}
        </ul>
      </div>

      <div className={styles.recipeSection}>
        <h3>Steps</h3>
        <ol className={styles.stepList}>
          {recipe.steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </div>

      <div className={styles.regenerateSection}>
        <textarea
          placeholder="Want changes? E.g., 'make it spicier' or 'use chicken instead'..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          disabled={isRegenerating}
        />
        <button 
          onClick={handleRegenerate}
          disabled={!feedback.trim() || isRegenerating}
          className={styles.regenerateButton}
        >
          {isRegenerating ? 'Regenerating...' : 'Regenerate'}
        </button>
      </div>
    </div>
  );
}

function GroceryList({ sections }: { sections: GrocerySection[] }) {
  return (
    <div className={styles.groceryList}>
      <h2 className={styles.groceryTitle}>Grocery List</h2>
      {sections.map((section, i) => (
        <div key={i} className={styles.grocerySection}>
          <h3>{section.category}</h3>
          <ul>
            {section.items.map((item, j) => (
              <li key={j}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function formatMealPlanAsText(mealPlan: MealPlan): string {
  const formatRecipe = (recipe: Recipe) => {
    return `${recipe.name}

${recipe.description}

Time: ${recipe.cookTime}
Servings: ${recipe.servings}

INGREDIENTS:
${recipe.ingredients.map(i => `• ${i}`).join('\n')}

STEPS:
${recipe.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}`;
  };

  const formatGroceryList = (sections: GrocerySection[]) => {
    return sections.map(section => 
      `${section.category.toUpperCase()}:\n${section.items.map(i => `  • ${i}`).join('\n')}`
    ).join('\n\n');
  };

  const lunchesFormatted = mealPlan.lunches.map((r, i) => 
    `=== LUNCH ${mealPlan.lunches.length > 1 ? i + 1 : ''} ===\n${formatRecipe(r)}`
  ).join('\n\n');

  const dinnersFormatted = mealPlan.dinners.map((r, i) => 
    `=== DINNER ${mealPlan.dinners.length > 1 ? i + 1 : ''} ===\n${formatRecipe(r)}`
  ).join('\n\n');

  return `MEAL PLAN (3 Days)
Generated ${new Date().toLocaleDateString()}

${lunchesFormatted}

${dinnersFormatted}

=== GROCERY LIST ===

${formatGroceryList(mealPlan.groceryList)}`;
}

export default function Home() {
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const result = await response.json();
      
      if (result.success) {
        setMealPlan(result.data);
      } else {
        setError(result.error || 'Failed to generate meal plan');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = async (
    recipe: Recipe, 
    mealType: 'lunch' | 'dinner', 
    feedback: string
  ) => {
    if (!mealPlan) return;
    
    setRegeneratingId(recipe.id);
    setError(null);
    
    try {
      const response = await fetch('/api/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalRecipe: recipe,
          feedback,
          mealType,
          allLunches: mealPlan.lunches,
          allDinners: mealPlan.dinners
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        const { recipe: newRecipe, groceryList } = result.data;
        
        setMealPlan(prev => {
          if (!prev) return prev;
          
          return {
            lunches: mealType === 'lunch'
              ? prev.lunches.map(r => r.id === recipe.id ? newRecipe : r)
              : prev.lunches,
            dinners: mealType === 'dinner'
              ? prev.dinners.map(r => r.id === recipe.id ? newRecipe : r)
              : prev.dinners,
            groceryList
          };
        });
      } else {
        setError(result.error || 'Failed to regenerate recipe');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error(err);
    } finally {
      setRegeneratingId(null);
    }
  };

  const handleCopyAll = async () => {
    if (!mealPlan) return;
    const text = formatMealPlanAsText(mealPlan);
    await navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1>Meal Planner</h1>
        <p>Healthy batch cooking for the week ahead</p>
      </header>

      <div className={styles.generateSection}>
        <button 
          onClick={handleGenerate} 
          disabled={isGenerating}
          className={styles.generateButton}
        >
          {isGenerating ? 'Generating...' : mealPlan ? 'Generate New Plan' : 'Generate Meal Plan'}
        </button>
        
        {isGenerating && (
          <p className={styles.loadingText}>
            Creating your personalized meal plan... This may take 15-30 seconds.
          </p>
        )}
      </div>

      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      {mealPlan && (
        <>
          <div className={styles.mealSection}>
            <h2 className={styles.sectionTitle}>Lunches</h2>
            <div className={styles.recipes}>
              {mealPlan.lunches.map((recipe) => (
                <RecipeCard 
                  key={recipe.id}
                  recipe={recipe} 
                  mealType="lunch"
                  isRegenerating={regeneratingId === recipe.id}
                  onRegenerate={(feedback) => handleRegenerate(recipe, 'lunch', feedback)}
                />
              ))}
            </div>
          </div>

          <div className={styles.mealSection}>
            <h2 className={styles.sectionTitle}>Dinners</h2>
            <div className={styles.recipes}>
              {mealPlan.dinners.map((recipe) => (
                <RecipeCard 
                  key={recipe.id}
                  recipe={recipe} 
                  mealType="dinner"
                  isRegenerating={regeneratingId === recipe.id}
                  onRegenerate={(feedback) => handleRegenerate(recipe, 'dinner', feedback)}
                />
              ))}
            </div>
          </div>

          <GroceryList sections={mealPlan.groceryList} />

          <div className={styles.exportSection}>
            <button 
              onClick={handleCopyAll}
              className={styles.copyButton}
            >
              {copySuccess ? '✓ Copied!' : 'Copy All to Clipboard'}
            </button>
          </div>
        </>
      )}
    </main>
  );
}
