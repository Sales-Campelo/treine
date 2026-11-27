---
name: Kinetic Amber
colors:
  surface: '#151311'
  surface-dim: '#151311'
  surface-bright: '#3c3936'
  surface-container-lowest: '#100e0c'
  surface-container-low: '#1d1b19'
  surface-container: '#221f1d'
  surface-container-high: '#2c2927'
  surface-container-highest: '#373432'
  on-surface: '#e8e1dd'
  on-surface-variant: '#dcc1b0'
  inverse-surface: '#e8e1dd'
  inverse-on-surface: '#33302d'
  outline: '#a48c7c'
  outline-variant: '#564336'
  surface-tint: '#ffb783'
  primary: '#ffb783'
  on-primary: '#4f2500'
  primary-container: '#f28522'
  on-primary-container: '#5a2b00'
  inverse-primary: '#934b00'
  secondary: '#cfc5bd'
  on-secondary: '#352f2a'
  secondary-container: '#4f4842'
  on-secondary-container: '#c0b7af'
  tertiary: '#cfc4be'
  on-tertiary: '#362f2b'
  tertiary-container: '#a99f99'
  on-tertiary-container: '#3d3732'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdcc5'
  primary-fixed-dim: '#ffb783'
  on-primary-fixed: '#301400'
  on-primary-fixed-variant: '#703700'
  secondary-fixed: '#ebe0d9'
  secondary-fixed-dim: '#cfc5bd'
  on-secondary-fixed: '#201b16'
  on-secondary-fixed-variant: '#4c4640'
  tertiary-fixed: '#ece0da'
  tertiary-fixed-dim: '#cfc4be'
  on-tertiary-fixed: '#201a17'
  on-tertiary-fixed-variant: '#4d4541'
  background: '#151311'
  on-background: '#e8e1dd'
  surface-variant: '#373432'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.03em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '800'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 30px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 26px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  metric-display:
    fontFamily: Plus Jakarta Sans
    fontSize: 44px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

The design system establishes a high-performance, focused environment tailored for athletes and everyday fitness enthusiasts who value discipline, progression, and clarity. The aesthetic combines **Modern High-Contrast Minimalism** with subtle tactile warmth, leaning away from cold, generic neon-cyan tech tropes into an earthy, disciplined charcoal and amber visual language.

The emotional core is defined by:
- **Momentum and Precision:** Rapidly scannable data layouts, immediate metric legibility during strenuous physical exertion, and uninhibited flow.
- **Understated Resilience:** The deep charcoal and warm-toned dark surfaces evoke a dedicated, premium gym space free of visual distraction.
- **Active Guidance:** Vibrant burnt orange is deployed strictly as a kinetic vector—guiding the eye toward timers, PR indicators, active lifts, and interactive triggers.

Micro-interactions are snappy and physical: haptic feedback on rep completions, smooth radial fills on rest intervals, and clean vector states optimized for one-handed thumb-reach interactions.

## Colors

The palette is engineered specifically for dark environments and outdoor training screens with high glare resistance:

- **Primary Accent (`#F28522`):** Burnt orange. Reserved exclusively for core actions, running timers, completion milestones, active tab indicators, and progress rings. Never applied to bulk static background cards.
- **Primary Canvas (`#12100E`):** Deep charcoal with warm undertones, reducing eye strain and panel burn-in on OLED screens.
- **Surface & Containers (`#1E1A17`):** Elevated dark brown-gray card layers offering natural structural contrast without harsh borders.
- **Sub-Surface Tier (`#2A2420`):** Used for elevated sub-elements, unselected state pills, input fields, and metric backings.
- **Primary Text & High Empathy (`#FFFFFF`):** Crisp white for critical metrics (weights, reps, active time, headings).
- **Secondary Text & Structural Anchors (`#9E958E`):** Muted warm gray for muscle group metadata, inactive navigation items, date stamps, and secondary values.
- **Status Accents:**
  - *Success / PR hit:* Warm olive green (`#4E9F3D`).
  - *Alert / Missed set:* Coral red (`#D34537`).

## Typography

Typography relies on **Plus Jakarta Sans** across all levels, capitalizing on its wide horizontal apertures, modern geometric balance, and robust weight rendering under inverted dark-mode values.

- **Metric Display (`44px` / `800`):** Used for large-scale digits such as live workout timers, total volume moved, and heart rate readings. Numbers use tabular figures (`font-variant-numeric: tabular-nums`) to prevent horizontal jitter during active counting.
- **Headlines:** Dense tracking on display and level headers conveys confidence and athletic momentum.
- **Labels & Microcopy:** Portuguese interface strings (e.g., *Treinos, Séries, Descanso, Carga*) are rendered with explicit medium-to-semibold weights to prevent anti-aliasing blurring against dark card backgrounds.

## Layout & Spacing

The layout is built for mobile ergonomics, prioritizing thumb zones for interaction during motion.

- **Grid System:** Single-column layout on mobile with an internal 4-column metric fluid split. Screen margin is strictly pinned at `1.25rem` (`20px`) from device edges.
- **Vertical Rhythm:**
  - `space-xs` (4px): Micro gaps between metric labels and numeric values.
  - `space-sm` (8px): Spacing inside compact lists, chips, and set check rows.
  - `space-md` (16px): Standard internal padding for cards and modular workout blocks.
  - `space-lg` (24px): Structural separation between different muscle sections and exercise modules.
  - `space-xl` (32px): Clearances above bottom app sheets and sticky floating action controls.
- **Device Adaptation:** On compact phone screens, multi-stat cards display 2x2 grids; on larger screens and tablets, metrics reflow into a clean horizontal strip with uniform `gutter` distribution.

## Elevation & Depth

Visual hierarchy uses **tonal layering** and subtle surface luminance instead of heavy physical shadows, maintaining total visual clarity:

- **Base Layer (Canvas):** `#12100E`. Pure ground state.
- **Layer 1 (Cards & Structural Containers):** `#1E1A17` with a low-contrast 1px border (`rgba(255, 255, 255, 0.05)`). No drop shadows are cast at rest to prevent muddy dark artifacts.
- **Layer 2 (Interactive Modules, Inputs, Modal Sheets):** `#2A2420` surface color. 
- **Layer 3 (Floating Bars & Bottom Navigation):** Backdrop blur of `16px` with an 85% opacity surface fill (`rgba(18, 16, 14, 0.85)`), layered over the scrolling viewport with a crisp top border (`rgba(255, 255, 255, 0.08)`).
- **Glow Accents:** High-intensity active timers or completed workout triggers gain a localized ambient drop shadow: `0 8px 24px rgba(242, 133, 34, 0.25)`.

## Shapes

The design uses a clean visual contrast between structural containers and interaction targets:

- **Cards & Dashboard Panels:** Enforce a strict `16px` (`rounded-lg`) corner radius. This softens the charcoal panels, creating an approachable and polished framework.
- **Interactive Triggers (Buttons & Tags):** Pure pill shapes (`border-radius: 9999px`). Action surfaces stand out immediately against rectilinear content modules.
- **Checkboxes & Data Rings:** Squircle or circular contours that visually reinforce physical completion dials and weights.

## Components

### Buttons & Interactive Controls
- **Primary CTA:** Fully pill-shaped with background `#F28522` and high-contrast `#FFFFFF` or deep charcoal `#12100E` typography (`label-lg`). Minimum tap target is 52px height for rapid one-handed engagement mid-workout (e.g., *"Iniciar Treino"*, *"Concluir Série"*).
- **Secondary / Ghost Button:** Transparent background with a `1.5px` border in `#9E958E` (or `#2A2420`) and white text.
- **Quick-Action Steppers:** Circular buttons (`36px × 36px`) in `#2A2420` with crisp white `+` and `−` minimalist glyphs for instant weight and repetition tweaking.

### Bottom Navigation Bar
- Anchored to the viewport bottom with safe area padding.
- Height: 64px (excluding safe-area insert).
- Composed of 5 balanced destinations:
  1. **Treinos** (Dumbbell icon)
  2. **Atividades** (Pulse/Activity icon)
  3. **Explorar** (Compass/Grid icon)
  4. **Exercícios** (Book/Catalog icon)
  5. **Corpo** (User silhouette/Metric icon)
- States: Unselected items render in `#9E958E` at 20px size with `body-sm` typography; the active tab transitions to `#F28522` with a subtle 4px dot indicator underneath.

### Cards & Workout Blocks
- Surface set to `#1E1A17` with a 16px radius and internal padding of `space-md` (16px).
- Header row contains exercise name (`headline-md`), targeted muscle badge, and an options overflow icon.
- Content rows (Set / Reps / Weight / Status) use clean monospaced layout alignment with tabular numbering.

### Chips & Filter Tags
- Fully rounded pill containers.
- Inactive state: `#2A2420` surface with `#9E958E` text.
- Active state: `#F28522` background with `#FFFFFF` text. Used for muscle grouping (*Peito*, *Costas*, *Pernas*) and equipment filters.

### Input Fields & Set Trackers
- Minimal inline fields for quick numerical entry.
- Background: `#12100E` inset inside cards, with an active border highlight in `#F28522`.
- Focus states trigger native numeric keyboards with direct confirm triggers.

### Checkboxes & Set Completion
- 28px circular tap targets.
- Empty state: `#2A2420` fill with 1.5px border in `#9E958E`.
- Completed state: Spring-animated transition to `#F28522` fill with a crisp white minimalist check icon.