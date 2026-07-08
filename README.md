# Layerbox

> A professional CSS `box-shadow` generator with multi-layer control, real-time preview, and cross-format code export.

Layerbox is a browser-based design tool for creating, visualizing, and exporting complex box-shadow stacks. It provides polar angle/distance controls, material simulation, a light source engine, shadow morphing, depth generation, and a comprehensive preset library -- all without a backend. The application runs entirely on the client using Next.js and React.

**Live site**: [layerbox.vercel.app](https://layerbox.vercel.app/)

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Core Types](#core-types)
- [State Management](#state-management)
- [Modules Reference](#modules-reference)
- [Component Architecture](#component-architecture)
- [Export Format System](#export-format-system)
- [Development Guide](#development-guide)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Architecture Overview

Layerbox follows a unidirectional data flow pattern:

```
User Interaction
       |
       v
  Component Layer (React)
       |
       v
  State Hook (useShadowState)
       |
       v
  Lib Modules (pure functions)
       |
       v
  CSS Output / Canvas Rendering
```

- **State** is centralized in a single `useShadowState` hook that manages shadow layers, undo/redo history, and URL synchronization.
- **Pure functions** in `lib/` handle all transformations: CSS generation, format conversion, encoding/decoding, material color modulation, and natural language parsing.
- **Components** are split into three categories: controls (user input), preview (canvas rendering), and code (output display).
- **URL state** is the persistence mechanism -- the entire shadow configuration is serialized into the `?s=` query parameter, enabling shareable URLs without a server.

### Data Flow Detail

1. User adjusts a control (blur, color, position, etc.)
2. Component calls `updateLayer(id, patch)` on the state hook
3. Hook applies the patch, pushes the new state to undo history, and triggers re-render
4. `computeShadow()` applies light source offsets if active
5. Preview canvas re-renders with the updated shadow layers
6. `useEffect` encodes the new state to the URL query parameter
7. Code output panel regenerates the formatted code string

---

## Core Types

### `Shadow`

```typescript
type Shadow = {
  id: string;       // Unique identifier (random alphanumeric)
  x: number;        // Horizontal offset in px
  y: number;        // Vertical offset in px
  blur: number;     // Blur radius in px (0-200)
  spread: number;   // Spread radius in px (-50 to 100)
  opacity: number;  // Opacity 0-1
  color: string;    // Hex color (#RRGGBB or #RGB)
  inset: boolean;   // True for inset shadow
  visible: boolean; // Visibility toggle
};
```

This is the fundamental data type throughout the application. Every shadow layer is represented by this interface.

### `PreviewShape`

```typescript
type PreviewShape = "box" | "circle" | "button" | "card";
```

Controls the shape of the element rendered on the preview canvas.

### `ExportFormat`

```typescript
type ExportFormat = "css" | "tailwind" | "tailwind-config" | "scss" | "css-var" | "js" | "flutter";
```

### Other Key Types

- **`LightState`**: `{ active: boolean, lx: number, ly: number }` -- normalized light position for the light source engine.
- **`GradientShadowParams`**: `{ layers, falloff, depth, color, xOffset, yOffset }` -- configuration for the gradient shadow generator.
- **`DepthConfig`**: `{ depth: number (0-1), color: string }` -- input to the depth meter engine.
- **`Material`**: `{ id, name, badge, elementBg, shadowLightness, shadowOpacity, elementExtra?, description }` -- material definition for the material system.
- **`PaletteEntry`**: `{ name, dotColor, description, shadow }` -- single entry in the generated shadow palette.
- **`Preset`**: `{ name, category, shadows: Shadow[] }` -- a named preset for the gallery.

---

## State Management

### `useShadowState` Hook

`hooks/useShadowState.ts` is the single source of truth for all shadow data. It is a custom React hook that encapsulates:

- Shadow layer array state
- Active layer selection
- Undo/redo history with configurable depth (default: 30 states)
- Light source state
- URL synchronization

#### Returned API

| Method | Signature | Description |
|--------|-----------|-------------|
| `shadows` | `Shadow[]` | Current shadow layers |
| `activeId` | `string` | ID of the selected layer |
| `setActiveId` | `(id: string) => void` | Change active layer |
| `addLayer` | `() => void` | Append a new layer with defaults |
| `removeLayer` | `(id: string) => void` | Remove a layer (minimum 1 preserved) |
| `updateLayer` | `(id: string, patch: Partial<Shadow>) => void` | Apply partial update to a layer |
| `duplicateLayer` | `(id: string) => void` | Clone a layer and insert after it |
| `toggleLayerVisibility` | `(id: string) => void` | Toggle a layer's visible flag |
| `reorderLayers` | `(newOrder: Shadow[]) => void` | Replace entire order (for drag-to-reorder) |
| `loadPreset` | `(presetShadows: Shadow[]) => void` | Load a preset, resetting history |
| `computeShadow` | `(s: Shadow) => Shadow` | Apply light source offsets to a shadow |
| `lightState` | `LightState` | Current light source position and active state |
| `toggleLight` | `() => void` | Toggle light source on/off |
| `setLightPosition` | `(lx: number, ly: number) => void` | Set light source coordinates |
| `undo` | `() => void` | Pop undo stack |
| `redo` | `() => void` | Push redo stack forward |
| `canUndo` | `boolean` | Whether undo is available |
| `canRedo` | `boolean` | Whether redo is available |
| `getShareUrl` | `() => string` | Returns the current URL with encoded state |

#### Undo/Redo Implementation

The hook maintains a `useRef`-based history array with a cursor index. Every state mutation (except undo/redo themselves) pushes the new state onto the history stack. When the user performs an undo, the cursor moves backward and the state is replaced with the historical snapshot. A `skipHistory` ref prevents undo/redo actions from creating duplicate history entries.

History is trimmed to `MAX_HISTORY (30)` entries. Forward history is discarded when a new action is taken after an undo (standard branching behavior).

#### URL Synchronization

On mount, the hook reads `?s=` from the URL and decodes it into shadow layers. On every state change, it writes the encoded state back to the URL via `history.replaceState`. This enables shareable links and browser back/forward navigation.

---

## Modules Reference

All modules in `lib/` are pure functions with no React dependencies. They can be imported and tested independently.

### `shadowUtils.ts` -- Core Utilities

| Function | Signature | Description |
|----------|-----------|-------------|
| `hexToRgba` | `(hex: string, opacity: number) => string` | Convert hex color + opacity to `rgba()` string |
| `shadowToCss` | `(s: Shadow) => string` | Single shadow layer to CSS `box-shadow` value fragment |
| `shadowsToCssValue` | `(shadows: Shadow[]) => string` | All visible layers to comma-separated CSS value |
| `shadowsToCssRule` | `(shadows: Shadow[]) => string` | Full `box-shadow: ...;` CSS rule |
| `shadowsToTailwind` | `(shadows: Shadow[]) => string` | Tailwind arbitrary `shadow-[...]` class |
| `encodeShadows` | `(shadows: Shadow[]) => string` | JSON encode + URI encode shadows for URL |
| `decodeShadows` | `(str: string) => Shadow[] | null` | Inverse of encodeShadows |
| `genId` | `() => string` | Generate a random 7-character alphanumeric ID |

### `exportFormats.ts` -- Code Format Generators

| Function | Signature | Description |
|----------|-----------|-------------|
| `toCss` | `(shadows: Shadow[]) => string` | Standard CSS rule |
| `toTailwind` | `(shadows: Shadow[]) => string` | Tailwind arbitrary class syntax |
| `toTailwindConfig` | `(shadows: Shadow[], name?: string) => string` | Tailwind config theme extension |
| `toScss` | `(shadows: Shadow[], name?: string) => string` | SCSS variable |
| `toCssVar` | `(shadows: Shadow[], name?: string) => string` | CSS custom property |
| `toJs` | `(shadows: Shadow[]) => string` | React inline style object |
| `toFlutter` | `(shadows: Shadow[]) => string` | Flutter `BoxDecoration` with `BoxShadow` list |
| `getFormatCode` | `(format: ExportFormat, shadows: Shadow[]) => string` | Dispatch function for all formats |

Each generator produces human-readable, syntactically correct code for its target format. The Flutter generator includes a note about inset shadow support limitations.

### `lightSource.ts` -- Light Position Engine

| Function | Signature | Description |
|----------|-----------|-------------|
| `lightOffsets` | `(lx: number, ly: number, lift: number, maxOffset: number) => { x, y }` | Compute shadow offsets from light position and layer lift |
| `lightAngle` | `(lx: number, ly: number) => number` | Compute display angle in degrees (0 = top) |

The light source engine models a point light in 2D space. The shadow direction is computed as the vector from the light position toward the element center, scaled by the layer's lift (how high the element is above the surface). This creates physically plausible shadow behavior as the light moves.

### `depthMeter.ts` -- Depth Generation

| Function | Signature | Description |
|----------|-----------|-------------|
| `generateDepthShadows` | `(depth: number, color: string, baseOpacity?: number) => Shadow[]` | Generate 3-5 shadow layers from depth value |
| `depthLabel` | `(depth: number) => string` | Human-readable label: Flat, Raised, Lifted, Floating, Hovering, Levitated |

Depth is normalized 0-1. Layer count increases with depth (3 at shallow, up to 5 at deep). Each layer has distinct blur, offset, and opacity characteristics mimicking real-world light falloff.

### `gradientShadow.ts` -- Gradient Falloff Generator

| Function | Signature | Description |
|----------|-----------|-------------|
| `generateGradientShadow` | `(params: GradientShadowParams) => Shadow[]` | Generate N-layer gradient shadow stack |

Each layer is progressively more blurred and transparent, following a power curve defined by the falloff parameter. This creates natural glow effects that single shadows cannot achieve.

### `naturalLanguage.ts` -- Parser Engine

| Function | Signature | Description |
|----------|-----------|-------------|
| `parseNaturalLanguage` | `(input: string) => Shadow[] | null` | Parse English text to shadow layers |
| `getExamples` | `() => string[]` | Return list of example phrases |

The parser operates in three stages:

1. **Tokenisation**: Splits input into words and classifies each as intensity, direction, style, color, or layer keyword.
2. **Parsing**: Converts tokens into a `ParsedIntent` with normalized intensity, direction, style, layer count, and color hint.
3. **Generation**: Maps the intent to concrete shadow parameters using predefined intensity/offset/blur/opacity tables. Handles special cases for inset, glow, floating, and multi-layer styles.

### `materials.ts` -- Material Simulation

| Function | Signature | Description |
|----------|-----------|-------------|
| `getMaterial` | `(id: string) => Material` | Lookup material by ID |
| `applyMaterialToColor` | `(rgba: string, material: Material) => string` | Apply material lightness/opacity modifiers to a color string |

Six materials are defined: Paper, Glass, Metal, Frosted, Fabric, Plastic. Each defines an element background color, shadow lightness multiplier, shadow opacity multiplier, and optional extra CSS. The material system modifies how shadows render by adjusting their perceived lightness and opacity based on surface reflectivity.

### `shadowDna.ts` -- Compact Encoding

| Function | Signature | Description |
|----------|-----------|-------------|
| `encodeDNA` | `(shadows: Shadow[]) => string` | Encode visible shadows to compact pipe-delimited string |
| `decodeDNA` | `(dna: string) => Shadow[] | null` | Decode DNA string back to shadow layers |
| `compressDNA` | `(dna: string) => string` | Placeholder for further compression |
| `expandDNA` | `(compressed: string) => string` | Placeholder for decompression |

Each layer is encoded as `x_y_blur_spread_opacity_hex_inset_visible` using base62 for numeric fields. Layers are joined with `|`. The resulting string is URL-safe without additional encoding.

### `shadowPalette.ts` -- Variation Generator

| Function | Signature | Description |
|----------|-----------|-------------|
| `generatePalette` | `(seed: Shadow) => PaletteEntry[]` | Generate 6 harmonized shadow variations |
| `paletteShadowCss` | `(entry: PaletteEntry) => string` | Convert palette entry to CSS value string |

Six variations: Subtle, Bold, Ethereal, Sharp, Warm, Cool. Each is generated by scaling offset/blur/opacity and shifting color channels using predefined transform rules.

### `syntaxHighlight.ts` -- Code Tokenizer

| Function | Signature | Description |
|----------|-----------|-------------|
| `highlightCode` | `(code: string) => string` | Tokenize and wrap in semantic `<span>` elements |

A hand-written tokenizer supporting CSS, JavaScript/TypeScript, Dart/Flutter, JSON, and SCSS. Token types: keyword, string, number/hex, property, function, comment, operator, CSS pseudo/directive, type/class. Output is HTML with inline CSS custom property colors (defined in `globals.css`).

### `presets.ts` -- Preset Library

| Export | Type | Description |
|--------|------|-------------|
| `PRESETS` | `Preset[]` | 40+ curated presets across 10 categories |
| `Preset` | `{ name, category, shadows }` | Preset data structure |

Categories: Subtle, Elevated, Material, Apple, Soft UI, Glassmorphism, Neumorphism, Dashboard, Colored, Inset. Each preset is defined via a shorthand `s()` helper that creates a `Shadow` with default `id` and `visible`.

---

## Component Architecture

### Component Tree

```
RootLayout (layout.tsx)
  themeScript (inline <script> prevents flash)
  Home (page.tsx)
    useShadowState (hook)
    |
    ├── Header
    │   ├── Logo / Title
    │   ├── Tab Switcher (Controls / Scale)
    │   ├── Undo / Redo buttons
    │   ├── Light Source toggle
    │   ├── Panel Toggle
    │   └── Theme toggle (light/dark)
    │
    ├── Left Panel
    │   ├── ShadowLayerList
    │   │   └── Drag-to-reorder, visibility toggle, duplicate, delete
    │   └── ShadowLayerControls
    │       ├── Angle/Distance polar widget
    │       ├── Blur slider
    │       ├── Spread slider
    │       ├── Opacity slider
    │       ├── Color picker (react-colorful)
    │       └── Inset toggle
    │
    ├── Center Canvas (ShadowPreview)
    │   ├── Draggable/pannable viewport
    │   ├── Element renderer (box/circle/button/card)
    │   ├── Light Source Overlay (when active)
    │   ├── Material simulation
    │   ├── Hover/Focus/Active state preview
    │   ├── Element size & rotation controls
    │   ├── Split view (dark/light comparison)
    │   └── Background preset selector
    │
    ├── Right Panel
    │   ├── ShadowInspector (real-time statistics)
    │   ├── NaturalLanguageInput
    │   ├── ShadowMorph
    │   ├── DepthMeter
    │   ├── GradientShadow
    │   ├── ShadowDNA
    │   ├── FocusRingGenerator
    │   └── ShadowPalette
    │
    └── Bottom Panel (CodeOutput)
        ├── Format selector (css/tailwind/scss/js/flutter)
        ├── Syntax-highlighted code display
        ├── Copy to clipboard
        └── Shadow scale page (alternate tab)
```

### Key Component Responsibilities

| Component | File | Responsibility |
|-----------|------|----------------|
| `ShadowLayerList` | `components/controls/ShadowLayerList.tsx` | Render and reorder layers, visibility toggle, duplicate, delete |
| `ShadowLayerControls` | `components/controls/ShadowLayerControls.tsx` | Per-layer property editors |
| `ShadowPreview` | `components/preview/ShadowPreview.tsx` | Live canvas with element rendering, dragging, background |
| `LightSourceOverlay` | `components/preview/LightSourceOverlay.tsx` | Draggable light orb and ray visualization |
| `CodeOutput` | `components/code/CodeOutput.tsx` | Format switcher, code generation, syntax highlighting, copy |
| `ShadowDNA` | `components/code/ShadowDNA.tsx` | DNA encode/decode UI |
| `NaturalLanguageInput` | `components/controls/NaturalLanguageInput.tsx` | NL parser UI with example prompts |
| `ShadowMorph` | `components/controls/ShadowMorph.tsx` | A/B state animation controls |
| `DepthMeter` | `components/controls/DepthMeter.tsx` | Depth slider and apply button |
| `GradientShadow` | `components/controls/GradientShadow.tsx` | Gradient parameter controls |
| `ShadowInspector` | `components/controls/ShadowInspector.tsx` | Real-time statistics display |
| `FocusRingGenerator` | `components/controls/FocusRingGenerator.tsx` | Focus-visible ring CSS generator |
| `ShadowPalette` | `components/controls/ShadowPalette.tsx` | 6-variation palette display |
| `PresetsGallery` | `components/controls/PresetsGallery.tsx` | Preset browser with categories |
| `ShadowScale` | `components/scale/ShadowScale.tsx` | Side-by-side elevation visualization |

---

## Export Format System

The export system follows a strategy pattern. Each format is implemented as a pure function with the same signature:

```typescript
(shadows: Shadow[], ...options) => string
```

Formats:

| Format | Function | Use Case |
|--------|----------|----------|
| CSS | `toCss()` | Standard web development |
| Tailwind | `toTailwind()` | Tailwind CSS projects |
| Tailwind Config | `toTailwindConfig()` | Tailwind theme customization |
| SCSS | `toScss()` | SCSS-based projects |
| CSS Variable | `toCssVar()` | Design system tokens |
| JavaScript | `toJs()` | React inline styles |
| Flutter | `toFlutter()` | Flutter/Dart mobile apps |

The `getFormatCode()` dispatch function selects the appropriate generator based on the `ExportFormat` enum. All generated code is then passed through the syntax highlighter for display.

---

## Mobile Responsiveness

Layerbox uses a responsive layout that adapts to the viewport width, with a breakpoint at 1024px.

### Desktop (1024px and above)

- Three floating panels overlaid on the canvas:
  - **Left panel** (270px): Layer list + per-layer controls
  - **Right panel** (270px): Tools (inspector, NL input, morph, depth, gradient, DNA, focus ring, palette)
  - **Bottom panel**: Code output with format switching (CSS, Tailwind, SCSS, JS, Flutter)
- Canvas is fully interactive with drag-to-pan, double-click to reset
- All toolbar overlays (material, shape, interaction state, background selector, size/rotation) are centered horizontally above the canvas
- Panel toggle button in the header hides all panels for a distraction-free full-canvas view

### Mobile (below 1024px)

- Side panels are replaced with a bottom tab bar containing four tabs:
  - **Layers**: Layer list with drag-to-reorder, visibility toggle, duplicate, delete
  - **Controls**: Per-layer property editors (angle/distance, blur, spread, opacity, color, inset)
  - **Tools**: Full right-panel tool suite in a scrollable sheet
  - **Code**: Syntax-highlighted code output with format switching and copy
- Each tab opens a slide-up bottom sheet overlay (max 55vh) above the tab bar
- Tap the active tab again or the close button to dismiss the sheet
- The tab bar stays visible while a panel is open
- Header buttons are compacted (smaller icons, no tab switcher)
- All floating canvas toolbars are horizontally scrollable with hidden scrollbar
- Presets and Scale pages are accessible via quick-access buttons next to the tab bar
- The page uses `100dvh` (dynamic viewport height) and `overflow: hidden` to prevent browser chrome scroll flicker

### Implementation

- Desktop/mobile detection in `app/page.tsx` via a `useMobile()` hook that checks `window.innerWidth`
- CSS: `overflow: hidden` and `overscroll-behavior: none` on `html/body` to lock the viewport
- Canvas toolbars in `ShadowPreview.tsx` use `overflow-x: auto` with `scrollbar-width: none` for horizontal scrolling

---

## Development Guide

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm (ships with Node.js)

### Setup

```bash
git clone https://github.com/Appaxaap/Layerbox.git
cd Layerbox
npm install
npm run dev
```

The development server starts at `http://localhost:3000`.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js development server with hot module replacement |
| `npm run build` | Create optimized production build |
| `npm run start` | Start production server (run `build` first) |
| `npm run lint` | Run ESLint across the project |

### Code Style

- **TypeScript** with strict mode enabled
- **React functional components** with hooks (no class components)
- **Tailwind CSS v4** for styling -- use utility classes directly in JSX
- **CSS custom properties** defined in `globals.css` for theming (light/dark)
- **Lucide React** for all icons
- Custom hooks prefixed with `use` and placed in `hooks/`
- Pure utility functions placed in `lib/`
- No third-party state management -- `useShadowState` handles all state

### Theming

The application supports light and dark themes. Theme is stored in `localStorage` under the key `sg-theme`. An inline script in `layout.tsx` applies the theme class before the first paint to prevent flash.

CSS custom properties for theme colors are defined in `globals.css`:

```css
:root {
  --bg-primary: #0f0f0f;       /* Dark theme background */
  --bg-secondary: #1a1a1a;
  --text-primary: #f5f5f5;
  --text-secondary: #a0a0a0;
  --border: #2a2a2a;
  /* ... */
}

:root.light {
  --bg-primary: #f8f8f8;       /* Light theme background */
  --bg-secondary: #ffffff;
  --text-primary: #1a1a1a;
  --text-secondary: #6b6b6b;
  --border: #e5e5e5;
  /* ... */
}
```

### Build Verification

Always run `npm run build` before committing to catch TypeScript errors and Turbopack compilation issues. The project uses Next.js 16 with Turbopack for development and the standard Webpack-based compiler for production builds.

---

## Project Structure

```
app/
  globals.css                    -- Global styles, CSS custom properties, theme variables, animations
  layout.tsx                     -- Root layout: metadata, font loading, inline theme script
  page.tsx                       -- Main page: composes all components, manages local UI state
components/
  code/
    CodeOutput.tsx               -- Code export panel: format switching, syntax highlighting, clipboard copy
    ShadowDNA.tsx                -- Shadow DNA encode/decode panel
  controls/
    DepthMeter.tsx               -- Depth-to-multi-layer-shadow generator
    FocusRingGenerator.tsx       -- WCAG-compliant focus-visible ring CSS generator
    GradientShadow.tsx           -- Multi-layer gradient falloff shadow generator
    NaturalLanguageInput.tsx     -- Plain English to shadow layer parser
    PresetsGallery.tsx           -- Preset browser with category navigation and mini-previews
    ShadowInspector.tsx          -- Real-time shadow statistics panel
    ShadowLayerControls.tsx      -- Per-layer property controls (angle, blur, spread, opacity, color, inset)
    ShadowLayerList.tsx          -- Layer list with drag-to-reorder, visibility, duplication, deletion
    ShadowMorph.tsx              -- A to B shadow transition with animation controls
    ShadowPalette.tsx            -- Six harmonized variation generator
  preview/
    LightSourceOverlay.tsx       -- Draggable light orb on the preview canvas
    ShadowPreview.tsx            -- Live preview surface with element rendering and canvas controls
  scale/
    ShadowScale.tsx              -- Side-by-side elevation visualization page
hooks/
  useShadowState.ts              -- Central state management with undo/redo, URL sync, light source
lib/
  depthMeter.ts                  -- Depth-to-multi-layer-shadow algorithm
  exportFormats.ts               -- All export format generators (CSS, TW, SCSS, JS, Flutter)
  gradientShadow.ts              -- Gradient shadow parameter types and generator
  lightSource.ts                 -- Light position to shadow offset calculation
  materials.ts                   -- Material definitions and color modifiers
  naturalLanguage.ts             -- Tokenizer, parser, and generator for NL input
  presets.ts                     -- 40+ curated preset definitions across categories
  shadowDna.ts                   -- Base62 encode/decode for compact sharing
  shadowPalette.ts               -- Palette generation (Subtle, Bold, Ethereal, Sharp, Warm, Cool)
  shadowUtils.ts                 -- Core utilities: CSS string gen, hex/rgba conversion, URL encode/decode
  syntaxHighlight.ts             -- Custom tokenizer for syntax-highlighted code output
  types.ts                       -- TypeScript type definitions
```

---

## Contributing

Contributions are welcome. The project follows a standard fork-and-PR workflow.

### Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Make your changes following the code style guidelines
4. Run the linter: `npm run lint`
5. Build to verify: `npm run build`
6. Commit with a conventional commit message: `git commit -m "feat: add my feature"`
7. Push to your fork: `git push origin feat/my-feature`
8. Open a Pull Request

### Commit Conventions

Use conventional commit prefixes:

- `feat:` -- New feature
- `fix:` -- Bug fix
- `docs:` -- Documentation changes
- `chore:` -- Maintenance, tooling, dependencies
- `refactor:` -- Code restructuring without behavior change
- `style:` -- Code formatting (not CSS styling)

### Guidelines

- Keep changes focused -- avoid refactoring unrelated code
- Maintain the existing code style: TypeScript, functional components, CSS custom properties for theming
- Test your changes by running `npm run build` and visually verifying in the browser
- For bug reports or feature ideas, open a [GitHub Issue](https://github.com/Appaxaap/Layerbox/issues)

---

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

---
