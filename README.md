# Layerbox

> **A professional CSS `box-shadow` generator with multi-layer control, real-time preview, and cross-format code export.**

Design, visualize, and export complex box-shadow stacks with pixel-perfect precision. Layerbox gives you the tools of a professional design tool - polar angle/distance controls, material simulation, light sources, shadow morphing, and a depth engine - all in the browser. Live at [layerbox.vercel.app](https://layerbox.vercel.app/).

---

## Badges

```markdown
[![Build Status](https://img.shields.io/github/actions/workflow/status/Appaxaap/shadow/ci.yml?branch=main&label=build)](https://github.com/Appaxaap/shadow/actions)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/github/package-json/v/Appaxaap/shadow)](package.json)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
```

---

## Features

### 🎨 Multi-Layer Shadow Engine
- **Add, remove, reorder, duplicate**, and **toggle visibility** of individual shadow layers
- **Drag-to-reorder** layers with a grip handle
- Each layer gets its own full set of independent controls

### 🎛 Per-Layer Controls
- **Angle / Distance polar control** - a visual direction widget with NSEW labels replaces raw X/Y sliders
- **Blur radius** - 0–200px
- **Spread radius** - -50px to 100px
- **Opacity** - 0–100%
- **Color picker** - full `react-colorful` dialog with hex input
- **Inset toggle** - switch between drop shadow and inset shadow

### 💬 Natural Language Shadow Input
Describe shadows in plain English and let the parser generate layers automatically:

```
"soft drop shadow to the right"
"elevated card with a warm glow"
"pressed inset shadow on a button"
"deep multi-layer shadow bottom right"
```

A rule-based engine handles intensity, direction, style, layering, and color hints - no AI needed.

### ⏯ Shadow Morph (A -> B Transition)
Create animated shadow transitions between two states:
- Configure State B's blur, spread, opacity, color
- **Play / Pause** the morph animation
- Adjust **duration** (0.1s–3s)
- Choose **easing** function
- Output as CSS **transition** or **keyframe animation** with configurable iterations

### 🌈 Gradient Shadow Generator
Generate multi-layer shadow stacks that simulate smooth gradient falloff:
- **Depth** (5–100%)
- **Falloff rate** (0.5x–3.0x)
- **Layer count** (2–12)
- Base **color** control
- Each layer is progressively more blurred and transparent for a natural glow

### 📏 Depth Meter
A distance-from-surface slider (0–100%) that auto-generates 3–5 shadow layers:
- **Flat -> Raised -> Lifted -> Floating -> Hovering -> Levitated**
- Color picker for the shadow color
- Live mini-preview
- One-click **Apply Depth** to load the generated layers into the editor

### 🎨 Shadow Palette
Generate 6 harmonized variations from the currently selected layer:

| Variation | Style |
|-----------|-------|
| 🕊️ Subtle | Soft and gentle |
| 💪 Bold | Strong and deep |
| ☁️ Ethereal | Wide and floating |
| ⚡ Sharp | Tight and precise |
| 🌅 Warm | Amber-toned glow |
| ❄️ Cool | Blue-toned depth |

### 🔍 Focus Ring Generator
Generate WCAG-accessible `:focus-visible` rings based on the active layer's color:
- Two-layer ring (contrast + accent)
- Copy the CSS directly
- Live preview toggle

### 🧬 Shadow DNA
Encode/decode your entire shadow configuration as a compact, URL-safe string:
- **Export DNA** - copy the compact string
- **Import DNA** - paste a string to restore a configuration
- Perfect for sharing designs in a single line

### ↩️ Undo / Redo
Full history with keyboard shortcuts:
- `Ctrl/Cmd + Z` - Undo
- `Ctrl/Cmd + Shift + Z` - Redo
- `Ctrl/Cmd + Y` - Redo
- History depth: 30 states

### 📊 Smart Shadow Inspector
Real-time statistics for the current shadow configuration:
- **Layer count** (with hidden indicator)
- **CSS string length** (in characters)
- **Average opacity, blur, offset**
- **Inset layer count**
- **Dominant color** (opacity-weighted average)
- **Depth score** (0–100 with color-coded bar)
- **Tone classification** (light / dark)

### 🔄 Hover / Focus / Active State Preview
Simulate CSS interaction states directly on the preview canvas:
- **Normal -> Hover -> Focus -> Active**
- See the shadow and scale transform applied in real time
- CSS transition output shown below the canvas for the active state

### 📐 Element Size & Rotation
- **Preset sizes**: S (80px), M (128px), L (200px), XL (300px)
- **Custom size slider**: 40–400px
- **Rotation**: 0°, 45°, 90°, 180° applied to the preview element

### ☀🌙 Quick Theme Comparison (Split View)
Toggle split-view to see the same shadow rendered simultaneously on **dark** and **light** backgrounds - side by side.

### 🖱 Figma-Style Draggable Canvas
- **Pan** the canvas by dragging (mouse or touch)
- **Double-click** to reset the view
- Bounded mode keeps the element visible; **unbounded mode** (when panels are hidden) allows free roaming

### 🔲 Panel Toggle
Hide or show all panels with one click for a **full-canvas, distraction-free preview**.

### 💡 Light Source Overlay
- Toggle a draggable light orb on the canvas
- Drag the orb to control shadow direction in real time
- Angle readout displayed on the orb
- Light rays visualized from source to center

### 🧩 Material System
Simulate how different surfaces affect shadow appearance:

| Material | Icon | Effect |
|----------|------|--------|
| Paper | 📄 | Matte surface, natural absorption |
| Glass | 🪟 | Transparent, light passes through |
| Metal | ⚙️ | Reflective, high-contrast shadows |
| Frosted | 🧊 | Diffused, soft light transmission |
| Fabric | 🧵 | Textured, soft shadow edges |
| Plastic | 🧩 | Smooth, slightly glossy |

Each material modifies the shadow's lightness and opacity to match the surface.

### 📦 Preview Shapes
| Shape | Description |
|-------|-------------|
| Box | Square with rounded corners |
| Circle | Perfect circle |
| Button | Pill-shaped with label |
| Card | Content card mockup |

### 🎨 Background Presets
9 preset backgrounds: **Light, White, Dark, Black, Warm Gray, Cool Gray** (solids) + **Sunset, Ocean, Forest** (gradients).

### 🌗 Dark / Light Theme
- Toggle between themes with persistent `localStorage` preference
- Inline script prevents theme flash on page load

### 🗂 Presets Gallery (40+ Curated Shadows)
Browse and load presets organized by category with visual mini-previews:

**Subtle** · **Elevated** · **Material** · **Apple** · **Soft UI** · **Glassmorphism** · **Neumorphism** · **Dashboard** · **Colored** · **Inset**

### 📐 Shadow Scale Page
A dedicated page that visualizes all your shadow layers side-by-side with elevation labels - ideal for designing consistent shadow systems.

### 📋 Multiple Export Formats

| Format | Description |
|--------|-------------|
| **CSS** | Standard `box-shadow` rule |
| **Tailwind** | Arbitrary `shadow-[...]` class |
| **Tailwind Config** | `tailwind.config.js` theme extension |
| **SCSS** | Variable with `$` prefix |
| **CSS Variable** | `--shadow-*` custom property |
| **JavaScript** | React inline style object |
| **Flutter** | `BoxDecoration` with `BoxShadow` list |

All code output is **syntax-highlighted** with a custom tokenizer supporting CSS, JavaScript/TypeScript, Dart/Flutter, JSON, and SCSS.

### 🔗 URL-Based Sharing
Shadow state is automatically encoded into the URL query parameter `?s=...`. Copy the URL to share your exact configuration - no backend required.

---

## Tech Stack

| Technology | Use |
|------------|-----|
| [Next.js 16](https://nextjs.org/) (App Router) | Framework |
| [React 19](https://react.dev/) | UI Library |
| [TypeScript](https://www.typescriptlang.org/) | Language |
| [Tailwind CSS v4](https://tailwindcss.com/) | Styling |
| [Lucide React](https://lucide.dev/) | Icons |
| [react-colorful](https://github.com/omgovich/react-colorful) | Color Picker |
| [Radix UI Slider](https://www.radix-ui.com/primitives/docs/components/slider) | Range Slider |
| [clsx](https://github.com/lukeed/clsx) + [tailwind-merge](https://github.com/dcastil/tailwind-merge) | Class utilities |
| [Satoshi](https://fontshare.com/fonts/satoshi) | Display font |
| [Instrument Serif](https://fonts.google.com/specimen/Instrument+Serif) | Accent font |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- npm (ships with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/Appaxaap/shadow.git
cd shadow

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Usage

### Editor Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Header: Logo · Tab Switcher · Undo/Redo · Light · Panels · Theme  │
├────────────┬──────────────────────────────────┬────────────┤
│            │                                  │            │
│  LAYERS    │                                  │ INSPECTOR  │
│  Panel     │      PREVIEW CANVAS              │ NL Input   │
│  (list +   │      (draggable)                 │ Morph      │
│   drag)    │                                  │ Depth      │
│            │   ┌─── Element ───┐              │ Gradient   │
│  CONTROLS  │   │  with shadow │              │ Shadow DNA │
│  (angle,   │   └──────────────┘              │ Focus Ring │
│   blur,    │                                  │ Palette    │
│   spread,  │    ┌─── Size + Rot ───┐          │            │
│   opacity, │    │ S M L XL · 0°45°│          │            │
│   color,   │    └─────────────────┘          │            │
│   inset)   │                                  │            │
├────────────┼──────────────────────────────────┼────────────┤
│              CODE OUTPUT (CSS/TW/SCSS/JS/FL)              │
└────────────────────────────────────────────────────────────┘
```

### Screenshots

> _(Screenshots coming soon)_

```
![Editor Preview](https://layerbox.vercel.app/og.png)
![Shadow Scale](https://layerbox.vercel.app/og.png)
![Presets Gallery](https://layerbox.vercel.app/og.png)
```

---

## Project Structure

```
app/
  globals.css                    -- Global styles, CSS custom properties, animations
  layout.tsx                     -- Root layout with metadata and inline theme script
  page.tsx                       -- Main page composing all components
components/
  code/
    CodeOutput.tsx               -- Code export panel with format switching + copy
    ShadowDNA.tsx                -- Shadow DNA encode/decode panel
  controls/
    DepthMeter.tsx               -- Distance-from-surface -> auto-generated layers
    FocusRingGenerator.tsx       -- WCAG focus-visible ring generator
    GradientShadow.tsx           -- Multi-layer gradient falloff generator
    NaturalLanguageInput.tsx     -- Plain English -> shadow parser
    PresetsGallery.tsx           -- 40+ preset browser with categories
    ShadowInspector.tsx          -- Real-time stats panel
    ShadowLayerControls.tsx      -- Per-layer: angle/distance, blur, spread, opacity, color, inset
    ShadowLayerList.tsx          -- Layer list with drag-to-reorder
    ShadowMorph.tsx              -- A -> B shadow transition with animation output
    ShadowPalette.tsx            -- 6 harmonized variations from selected layer
  preview/
    LightSourceOverlay.tsx       -- Draggable light orb on the canvas
    ShadowPreview.tsx            -- Live preview surface with all controls
  scale/
    ShadowScale.tsx              -- Side-by-side elevation visualization page
hooks/
  useShadowState.ts              -- Shared state management with undo/redo + URL sync
lib/
  depthMeter.ts                  -- Depth-to-multi-layer-shadow algorithm
  exportFormats.ts               -- All export format generators (CSS, TW, SCSS, JS, Flutter)
  gradientShadow.ts              -- Gradient shadow parameter types + generator
  lightSource.ts                 -- Light position -> shadow offset calculation
  materials.ts                   -- Material definitions and color modifiers
  naturalLanguage.ts             -- Tokeniser + parser + generator for NL input
  presets.ts                     -- 40+ curated preset definitions across categories
  shadowDna.ts                   -- Base62 encode/decode for compact sharing
  shadowPalette.ts               -- Palette generation (Subtle, Bold, Ethereal, etc.)
  shadowUtils.ts                 -- CSS string generation, hex -> rgba, URL encode/decode
  syntaxHighlight.ts             -- Custom tokenizer for syntax-highlighted code
  types.ts                       -- TypeScript types (Shadow, PreviewShape, etc.)
```

---

## Export Formats Reference

### CSS
```css
box-shadow: 0px 10px 30px 0px rgba(0,0,0,0.15);
```

### Tailwind (arbitrary class)
```html
<div class="shadow-[0_10px_30px_0_rgba(0,0,0,0.15)]">
```

### Tailwind Config
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      boxShadow: {
        'primary': '0px 10px 30px 0px rgba(0,0,0,0.15)',
      },
    },
  },
};
```

### SCSS
```scss
$shadow-primary:
  0px 10px 30px 0px rgba(0,0,0,0.15);
```

### CSS Variable
```css
:root {
  --shadow-primary: 0px 10px 30px 0px rgba(0,0,0,0.15);
}
```

### JavaScript / React
```js
const style = {
  boxShadow: '0px 10px 30px 0px rgba(0,0,0,0.15)',
};
```

### Flutter
```dart
BoxDecoration(
  boxShadow: [
    BoxShadow(
      color: Color(0x26000000),
      blurRadius: 30,
      offset: Offset(0, 10),
    ),
  ],
)
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + Z` | Undo |
| `Ctrl/Cmd + Shift + Z` | Redo |
| `Ctrl/Cmd + Y` | Redo |
| `Escape` | Close color picker / NL panel |

---

## Contributing

Contributions are welcome and appreciated! Here's how to get started:

1. **Fork** the repository
2. **Create a feature branch**: `git checkout -b feat/my-feature`
3. **Make your changes**
4. **Run the linter**: `npm run lint`
5. **Build** to verify: `npm run build`
6. **Commit** with a clear message: `git commit -m "feat: add my feature"`
7. **Push** to your fork: `git push origin feat/my-feature`
8. **Open a Pull Request**

### Development Setup

```bash
git clone https://github.com/Appaxaap/shadow.git
cd shadow
npm install
npm run dev
```

### Guidelines

- Keep changes focused and surgical - avoid unnecessary refactoring of unrelated code
- Maintain the existing code style (TypeScript, functional components, CSS custom properties for theming)
- Test your changes by running `npm run build` and visually verifying the editor
- For bug reports or feature ideas, open a [GitHub Issue](https://github.com/Appaxaap/shadow/issues)

---

## License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for more information.

---

<p align="center">Built with ❄️ using Next.js 16, React 19, and Tailwind CSS v4</p>
