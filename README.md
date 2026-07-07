# Layerbox

A professional CSS box-shadow generator with multi-layer support, real-time preview, and code export in multiple formats.

Built with Next.js 16, React 19, and Tailwind CSS v4.

## Features

- **Multi-layer shadows** -- add, remove, reorder, duplicate, and toggle visibility of individual shadow layers
- **Full control** -- adjust X/Y offset, blur, spread, opacity, color, and inset for each layer
- **Real-time preview** -- see your shadow on configurable surfaces (box, circle, button, card) with light, dark, or gradient backgrounds
- **Multiple export formats** -- CSS, Tailwind (arbitrary class or config), SCSS, CSS custom properties, JavaScript/React inline styles, and Flutter BoxShadow
- **Presets gallery** -- 40+ curated presets across categories: Subtle, Elevated, Material, Apple, Soft UI, Glassmorphism, Neumorphism, Dashboard, Colored, and Inset
- **Shadow scale** -- visualize all your layers side-by-side with elevation labels
- **Dark / Light theme** -- toggle between themes with persistent preference
- **URL sharing** -- encode your shadow configuration into the URL for easy sharing
- **Undo / Redo** -- full history with undo/redo support

## Tech Stack

- **Framework** -- Next.js 16 (App Router)
- **UI Library** -- React 19
- **Styling** -- Tailwind CSS v4 with CSS custom properties
- **Language** -- TypeScript
- **Font** -- Satoshi (display) + Instrument Serif (accent)
- **Icons** -- Lucide React
- **Color Picker** -- react-colorful
- **Components** -- Radix UI Slider

## Prerequisites

- [Node.js](https://nodejs.org) 18 or later

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Usage

### Editor

The main editor is divided into three columns:

1. **Left sidebar** -- layer list (add, reorder, duplicate, delete layers) and per-layer controls (offset, blur, spread, opacity, color, inset toggle)
2. **Center** -- live preview surface with configurable shape and background
3. **Right panel** -- code output in your chosen format with copy-to-clipboard

### Export Formats

- **CSS** -- standard `box-shadow` rule
- **Tailwind** -- arbitrary `shadow-[...]` class or `tailwind.config.js` theme extension
- **SCSS** -- variable with `$` prefix
- **CSS Variable** -- `--shadow-*` custom property
- **JavaScript** -- React inline style object
- **Flutter** -- `BoxDecoration` with `BoxShadow` list

### Presets

Browse 40+ presets organized by category. Click any preset to load it into the editor.

### Shadow Scale

View all your shadow layers as individual samples with elevation labels -- useful for designing consistent shadow systems.

### Sharing

Your shadow configuration is automatically encoded into the URL query parameter `?s=...`. Copy the URL to share your design.

## Project Structure

```
app/
  globals.css        -- global styles and CSS custom properties
  layout.tsx         -- root layout with metadata and theme script
  page.tsx           -- main page composing all components
components/
  code/CodeOutput.tsx         -- code export panel with format switching
  controls/PresetsGallery.tsx  -- preset browser
  controls/ShadowLayerControls.tsx -- per-layer control panel
  controls/ShadowLayerList.tsx    -- layer list with drag-to-reorder
  preview/ShadowPreview.tsx       -- live shadow preview
  scale/ShadowScale.tsx          -- side-by-side shadow scale
hooks/
  useShadowState.ts  -- shared state management with undo/redo and URL sync
lib/
  types.ts           -- TypeScript types (Shadow, PreviewShape, etc.)
  shadowUtils.ts     -- CSS string generation, hex-to-rgba, encoding
  exportFormats.ts   -- all export format generators
  presets.ts         -- 40+ preset definitions
```

## Contributing

Bug reports and feature requests are welcome via [GitHub Issues](https://github.com/Appaxaap/shadow/issues).

## License

Distributed under the [MIT License](LICENSE).
