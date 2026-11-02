# The Guildhall

An interactive Bartle player-type test built with React, TypeScript, Vite, and Tailwind CSS. Its question flow uses an original set of choices, with results organized around the four player types in Richard Bartle's taxonomy.

## Quick Start

```bash
npm install
npm run dev
```

## Installation

Use Node.js 20.19+ or 22.12+, then install dependencies with `npm install`. Tailwind utilities are compiled through the Vite plugin. To create and preview a production build:

```bash
npm run build
npm run preview
```

## Environment Variables

No environment variables are required.

Vercel's Content Security Policy allows Google Fonts from `fonts.gstatic.com` and embedded `data:` font resources.

## Editing the Test

Edit [`src/modules/bartle/data/test.config.json`](./src/modules/bartle/data/test.config.json) to change the player types, questions, answer choices, or scoring rules. Each answer has a `scores` object whose keys are player type IDs and whose values are the points awarded for selecting that answer. The current results divide each type's earned points by the total points earned and display the result as a percentage.

Use [`src/i18n/locales/en-US/common.json`](./src/i18n/locales/en-US/common.json) for interface labels and player-type descriptions.
Translated interface text is in `src/i18n/locales/{pt-BR,fr-FR,de-DE}/common.json`. Question and answer translations live in each locale's `questions.json`; scoring rules and stable question IDs remain in `src/modules/bartle/data/test.config.json`. Use the language selector in the page header on desktop or the hamburger menu on mobile to switch between English, Portuguese, French, and German.

The UI uses Tailwind utility classes for standard layout, spacing, typography, colors, and responsive styling. Component Sass modules are reserved for bespoke visual effects and animation.

Test progress is saved in the current browser tab and restored after a page reload. The **Reset test** action clears the saved answers and starts again from the first question.

## Scoring

Each selected answer awards the configured points to its player type. The test calculates each type's share of all points earned, so the four percentages sum to 100%. The result screen also shows the raw point totals.
