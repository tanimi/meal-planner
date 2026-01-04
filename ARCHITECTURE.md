# Architecture & Design Decisions

This document captures the key decisions made during the design phase and how they're reflected in the codebase.

## LLM Integration Approach

### Decision: Claude-specific, but cleanly organized

We considered two approaches:

1. **Provider-agnostic abstraction**: Build an interface layer that could swap between OpenAI, Anthropic, local models, etc.
2. **Claude-specific with clean structure**: Use Anthropic's SDK directly, but keep all LLM-related code isolated.

**We chose option 2** because:
- This is a personal project for 2 users, not a product for distribution
- The abstraction layer adds complexity with no immediate benefit (YAGNI)
- If you ever need to switch providers, the refactor is manageable

### How "clean structure" manifests in the code:

All Claude API interactions live in **one file**: `src/lib/claude.ts`

This file exports simple functions like:
- `generateMealPlan()` 
- `regenerateRecipe(existingRecipe, feedback)`

The rest of the app doesn't know or care that Claude is involved—it just calls these functions and gets back typed data. If you ever wanted to swap providers, you'd only touch this one file.

The system prompt (which encodes your preferences about healthy food, batch cooking, etc.) is also defined in this file, making it easy to tweak.

## Data Flow

```
User clicks "Generate"
        ↓
page.tsx calls generateMealPlan()
        ↓
lib/claude.ts sends request to /api/generate
        ↓
API route calls Anthropic SDK with system prompt
        ↓
Claude returns JSON matching our MealPlan type
        ↓
UI renders the recipes and grocery list
```

## State Management

We use simple React useState for everything:
- `mealPlan`: The current generated plan (or null)
- `isGenerating`: Loading state for the main generate button
- Per-recipe: `feedback` text and `isRegenerating` state

No need for Redux, Zustand, or other state libraries for an app this simple.

## Styling Approach

We use CSS Modules (`page.module.css`) for component-scoped styles plus a global CSS file for design tokens and base styles.

Design tokens in `globals.css`:
- Colors, typography, spacing are defined as CSS variables
- This makes it easy to tweak the visual design in one place

The aesthetic is intentionally understated: warm neutrals, serif headings for a "cookbook" feel, clean UI elements. It's a utility app, not a showpiece.

## API Key Security

The Anthropic API key is stored in `.env.local` (never committed to git) and only accessed server-side in the API route. The client-side code never sees the key.

## File Organization

```
src/
├── app/                    # Next.js app router pages
│   ├── api/
│   │   ├── generate/       # POST - generates full meal plan
│   │   └── regenerate/     # POST - regenerates single recipe + grocery list
│   ├── page.tsx            # Main UI
│   └── ...
├── lib/
│   └── claude.ts           # All Claude/LLM integration (THE file to edit if switching providers)
└── types.ts                # Shared TypeScript types
```

## How to Switch LLM Providers (if ever needed)

Since all Claude-specific code lives in `src/lib/claude.ts`, here's what you'd change:

1. Replace the `@anthropic-ai/sdk` import with the new provider's SDK
2. Update the three exported functions to use the new SDK:
   - `generateFullMealPlan()`
   - `regenerateRecipe()`
   - `regenerateGroceryList()`
3. Keep the same function signatures and return types
4. Adapt the system prompts if the new model needs different formatting

The rest of the app (UI, API routes) wouldn't need to change.

## Future Considerations

Things we explicitly decided NOT to build now, but could add later:
- User authentication (if sharing beyond you and Danielle)
- Recipe history/favorites
- Preference learning ("remember I don't like cilantro")
- Email integration (currently just copy/paste export)
- Configurable number of days (hardcoded to 3)
