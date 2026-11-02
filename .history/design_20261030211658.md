---
version: "alpha"
name: "Natural Aesthetic System"
description: "Design guidelines focused on imperfect beauty, natural elements, contemplative compositions, and earthy/organic tones."
colors:
  light:
    primary: "#68b0ab"      # Tropical Teal
    secondary: "#8fc0a9"    # Muted Teal
    tertiary: "#c8d5b9"     # Tea Green
    neutral: "#4a7c59"      # Jungle Teal
    surface: "#faf3dd"      # Vanilla Cream
  dark:
    primary: "#68b0ab"      # Tropical Teal (Retained for identity)
    secondary: "#8fc0a9"    # Muted Teal (Retained for supporting elements)
    neutral: "#253f2d"      # Soft Moss (Elevated surface/cards)
    surface: "#1c3022"      # Deep Forest (Main background)
    text: "#faf3dd"         # Vanilla Cream (Inverted for soft reading)
typography:
  h1:
    fontFamily: "Plus Jakarta Sans"
    fontSize: 2.25rem
    fontWeight: 700
  body-md:
    fontFamily: "Plus Jakarta Sans"
    fontSize: 1rem
    fontWeight: 400
components:
  button-primary:
    backgroundColor: "{colors.light.primary}"
    textColor: "{colors.light.surface}"
    padding: 12px
---

## Overview

This visual system focuses on minimalist, organic, and contemplative layouts, emphasizing asymmetry, natural textures, and matte finishes.

- Density: 3/10 — Airy (Spacious and light)
- Variance: 8/10 — Expressive (Organic and variable)
- Motion: 4/10 — Subtle (Smooth and slow transitions)

- **Style:** Imperfect, Natural, Contemplative
- **Keywords:** organic, natural, contemplative, earth tones, handcrafted, organic textures, minimalist
- **Era:** Timeless Aesthetic
- **Light/Dark:** ✓ Full / ✓ Full (Optimized for both serene light and deep matte dark themes)

## Colors

### Light Mode Palette
- **Vanilla Cream** (#faf3dd) — Main surface, card backgrounds, and clean reading areas.
- **Tea Green** (#c8d5b9) — Secondary supporting elements, soft dividers, and calming states.
- **Muted Teal** (#8fc0a9) — Secondary elements, selected borders, and supporting text.
- **Tropical Teal** (#68b0ab) — Primary accent color, active links, and main focal elements.
- **Jungle Teal** (#4a7c59) — Main body text, dark high-contrast surfaces, and stable structural indicators.

### Dark Mode Palette (Deep Forest Concept)
- **Deep Forest** (#1c3022) — Main background. A heavily darkened variant of Jungle Teal that feels organic, calming, and avoids harsh digital greys.
- **Soft Moss** (#253f2d) — Card backgrounds and elevated surfaces to create depth with a matte finish.
- **Vanilla Cream** (#faf3dd) — Inverted to act as the primary text color. It provides high contrast while remaining soft and easy on the eyes.
- **Muted Teal** (#8fc0a9) — Retained for secondary text, labels, subheadings, and low-contrast borders.
- **Tropical Teal** (#68b0ab) — Retained as the primary accent color to maintain brand identity and high interactive contrast.

## Typography

- **Display / Hero:** Plus Jakarta Sans — Weight 700, tight tracking, used for high-impact headlines.
- **Body:** Plus Jakarta Sans — Weight 400, 16px base size with 1.6 line-height, recommended maximum of 72 characters per line for comfortable reading.
- **UI Labels / Captions:** Plus Jakarta Sans — 0.875rem, weight 500, slight letter-spacing for interface legibility.
- **Monospace:** JetBrains Mono — Used for metadata, technical values, raw numbers, or code blocks.

Scale:
- Hero: clamp(2.5rem, 5vw, 4rem)
- H1: 2.25rem
- H2: 1.5rem
- Body: 1rem / 1.6
- Small: 0.875rem

## Layout

- **Grid:** CSS Grid primary. Max-width containment at 1280px centered, with 1.5rem side padding.
- **Spacing Rhythm:** Balanced rhythm. Base unit: 0.5rem (8px).
- **Section Vertical Gaps:** clamp(4rem, 8vw, 8rem).
- **Hero Layout:** Asymmetric compositions (e.g., breaking symmetry between text blocks and media).
- **Feature Sections:** Asymmetric grids with varied card sizes. Avoid rigid, perfectly symmetrical 3-column layouts.
- **Responsiveness:** All multi-column layouts collapse vertically below 768px. Strict prevention of horizontal overflow.
- **Z-Index Contract:** base (0) / sticky-nav (100) / overlay (200) / modal (300) / toast (500).

## Elevation & Depth

Subtle organic micro-textures, soft asymmetric shapes, gentle earth-tone gradients, slightly imperfect borders, extremely soft shadow layering, and matte finishes.

- **Physics:** Ease-out curves, 200ms to 300ms duration. Smooth, predictable, and organic movements.
- **Entry Animations:** Fade + vertical translation on the Y-axis (16px → 0) over 420ms (ease-out). Staggered cascade effect for lists: 80ms delay between items.
- **Hover States:** Subtle color shift coupled with a gentle drop shadow adjustment over 200ms.
- **Page Transitions:** Opacity-only transition (200ms Fade).
- **Performance:** Only `transform` and `opacity` properties should be animated to guarantee a smooth 60fps.

## Shapes

Base corner radius: 0px to 4px (Sharp and slightly softened edges, simulating natural, precise cuts).

## Components

- **Primary Button:** Sharp or slightly softened edges (max 4px). Filled with the primary accent color (Tropical Teal). Hover: subtle darkening (8%) + slight shadow elevation. Active: tactile click effect reducing 1px on vertical translation. Font weight: 600.
- **Secondary / Ghost Button:** Outline variant. 1.5px border in a soft/neutral tone. Text in the primary color. Hover: subtle background fill.
- **Cards:** Sharp edges (0px to 4px). Background in surface color (Vanilla Cream in Light, Soft Moss in Dark). Extremely subtle shadow (`0 2px 12px rgba(0,0,0,0.04)`). Thin 1px border.
- **Inputs:** Label always positioned above the input. Thin 1px border. Focus ring: 2px offset with 2px thickness in the primary color. Error message below the input in a semantic red/warning tone.
- **Navigation:** Matte surface background. Active item marked by a subtle indicator in the primary color. Font weight 500 when active.
- **Skeletons:** Soft pulse animation (shimmer) matching the exact dimensions of the component. No circular spinning loaders.

## Do's and Don'ts

- Do not use emojis in the user interface — strictly adopt a unified vector icon system (e.g., Lucide).
- Do not use overly saturated or purely decorative gradients — prioritize matte fills and flat colors.
- Do not apply heavy or dark shadows — the strict upper limit is `0 2px 8px rgba(0,0,0,0.06)`.
- Do not use pure black (#000000) or pure white (#FFFFFF) — apply variations of Vanilla Cream, Deep Forest, and Jungle Teal.
- Do not create symmetrical layouts perfectly split into 3 equal-width columns — prefer dynamic, fluid arrangements.
- Do not use `h-screen` for viewport structures — prioritize `min-h-[100dvh]`.
- Do not use generic corporate copy jargon in interface texts ("Next-Gen", "Seamless", "Unleash").
- Do not use traditional lorem ipsum text in live demos.

- Do use micro-textures and matte finishes.
- Do use balanced asymmetry and generous whitespace.
- Do use simple, clean annotations in the UI.
- Do use thin borders with low contrast.

## Use Case

Modern web applications, portfolios, conceptual landing pages, and SaaS systems focused on calm productivity or well-being.
