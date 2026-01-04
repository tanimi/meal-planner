# Meal Planner

A simple web app for generating healthy, batch-cookable meal plans with consolidated grocery lists.

## Quick Start

### Prerequisites
- Node.js installed (v18 or later recommended)
- An Anthropic API key (get one at https://console.anthropic.com)

### Setup

1. **Navigate to the project folder** and install dependencies:
   ```bash
   cd meal-planner
   npm install
   ```

2. **Create a `.env.local` file** in the project root with your API key:
   ```
   ANTHROPIC_API_KEY=sk-ant-xxxxx
   ```
   
   To get an API key:
   - Go to https://console.anthropic.com
   - Sign up or log in
   - Go to "API Keys" and create a new key
   - Add some credits ($5-10 is plenty to start)

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** to http://localhost:3000

## How It Works

1. Click "Generate Meal Plan" to get 1-3 lunches and 2-3 dinners for 3 days
2. Don't like a recipe? Type feedback in the text box and click "Regenerate"
3. The grocery list automatically updates when you change any recipe
4. Click "Copy All to Clipboard" to export everything as text

## Project Structure

```
meal-planner/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── generate/     # POST endpoint for full meal plan
│   │   │   └── regenerate/   # POST endpoint for single recipe
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Main page component
│   │   └── page.module.css   # Page-specific styles
│   ├── lib/
│   │   └── claude.ts         # All Claude API integration
│   └── types.ts              # TypeScript type definitions
├── package.json
├── ARCHITECTURE.md           # Design decisions documentation
└── README.md
```

## Estimated Costs

Each "Generate" or "Regenerate" action costs roughly $0.01-0.03 in API usage.
At twice-weekly use with a few regenerations, expect ~$2-5/month.
