import { MealPlan } from './types';

export const placeholderMealPlan: MealPlan = {
  lunch: {
    id: 'lunch-1',
    name: 'Mediterranean Chicken & Quinoa Bowls',
    description: 'Bright, herb-forward grain bowls with tender chicken thighs, cucumber, tomatoes, and a lemon-tahini dressing. Meal preps beautifully for 3 days.',
    cookTime: '45 minutes',
    servings: '6 servings (3 days for 2 people)',
    ingredients: [
      '2 lbs boneless skinless chicken thighs',
      '2 cups quinoa',
      '2 English cucumbers, diced',
      '1 pint cherry tomatoes, halved',
      '1 red onion, thinly sliced',
      '1 cup kalamata olives',
      '6 oz feta cheese, crumbled',
      '1/2 cup tahini',
      '3 lemons, juiced',
      '4 cloves garlic, minced',
      '1/4 cup olive oil',
      'Fresh dill and parsley',
      'Salt and pepper'
    ],
    steps: [
      'Cook quinoa according to package directions. Let cool slightly.',
      'Season chicken thighs generously with salt, pepper, and half the garlic. Grill or pan-sear until cooked through, about 6-7 minutes per side. Let rest, then slice.',
      'Make the dressing: whisk tahini, lemon juice, remaining garlic, and 1/4 cup water until smooth. Season to taste.',
      'Prep all vegetables and herbs. Store separately from grains.',
      'To assemble: layer quinoa, sliced chicken, vegetables, olives, and feta. Drizzle with tahini dressing.',
      'Store components separately in airtight containers. Keeps well for 3 days refrigerated.'
    ]
  },
  dinner: {
    id: 'dinner-1',
    name: 'Korean Beef Bulgogi with Sesame Vegetables',
    description: 'Sweet-savory marinated beef with a rainbow of roasted vegetables. The marinade doubles as a sauce, and everything reheats perfectly.',
    cookTime: '1 hour (plus 2+ hours marinating)',
    servings: '6 servings (3 days for 2 people)',
    ingredients: [
      '2.5 lbs flank steak or sirloin, thinly sliced',
      '1 Asian pear or apple, grated',
      '1/2 cup soy sauce',
      '3 tbsp sesame oil',
      '4 tbsp brown sugar',
      '6 cloves garlic, minced',
      '2 inch ginger, grated',
      '2 lbs broccoli florets',
      '1 lb carrots, sliced on bias',
      '1 bunch scallions',
      '2 tbsp vegetable oil',
      'Sesame seeds',
      'Steamed rice (optional)'
    ],
    steps: [
      'Make marinade: combine grated pear, soy sauce, sesame oil, brown sugar, garlic, and ginger.',
      'Add sliced beef to marinade, ensuring all pieces are coated. Refrigerate at least 2 hours, ideally overnight.',
      'Preheat oven to 425°F. Toss broccoli and carrots with vegetable oil, salt, and pepper. Roast 25-30 minutes until charred edges form.',
      'Heat a large skillet or wok over high heat. Cook beef in batches (don\'t crowd the pan) until caramelized, about 2-3 minutes per side.',
      'Slice scallions. Toss roasted vegetables with a drizzle of sesame oil and sesame seeds.',
      'Serve beef over rice if desired, with vegetables alongside. Store beef and vegetables separately for best reheating results.'
    ]
  },
  groceryList: [
    {
      category: 'Produce',
      items: [
        '2 English cucumbers',
        '1 pint cherry tomatoes',
        '1 red onion',
        'Fresh dill (1 bunch)',
        'Fresh parsley (1 bunch)',
        '3 lemons',
        '1 Asian pear or apple',
        '2 lbs broccoli florets',
        '1 lb carrots',
        '1 bunch scallions',
        '2 inch fresh ginger',
        '10 cloves garlic'
      ]
    },
    {
      category: 'Meat',
      items: [
        '2 lbs boneless skinless chicken thighs',
        '2.5 lbs flank steak or sirloin'
      ]
    },
    {
      category: 'Dairy',
      items: [
        '6 oz feta cheese'
      ]
    },
    {
      category: 'Pantry',
      items: [
        '2 cups quinoa',
        '1 cup kalamata olives',
        '1/2 cup tahini',
        '1/2 cup soy sauce',
        '4 tbsp brown sugar',
        'Sesame seeds',
        'Olive oil',
        'Sesame oil (3 tbsp + extra)',
        'Vegetable oil'
      ]
    }
  ]
};
