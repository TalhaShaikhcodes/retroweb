# Technology Stack

## Core Technologies

- **TypeScript** - Strict mode enabled with comprehensive linting rules
- **React 18** - For popup UI only (not used in content scripts)
- **Vite** - Build tool and bundler
- **Vanilla CSS** - No CSS frameworks or preprocessors
- **Chrome Extension Manifest V3** - Latest extension API

## Testing

- **Vitest** - Unit testing framework
- **fast-check** - Property-based testing
- **@testing-library/react** - React component testing
- **jsdom** - DOM environment for tests

## Build System

Vite handles multi-entry bundling with specific output structure:
- `background.js` - Service worker (root)
- `content.js` - Content script (root)
- `popup/` - React app with HTML, JS, CSS
- `assets/` - Static resources (GIFs, images)
- `retro.css` - Base styles (root)

## Common Commands

```bash
npm install          # Install dependencies
npm run build        # Production build (TypeScript compile + Vite build)
npm run dev          # Development mode with Vite
npm test             # Run tests once
npm run test:watch   # Run tests in watch mode
```

## Loading Extension in Chrome

1. Build: `npm run build`
2. Navigate to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the `dist/` folder

## TypeScript Configuration

- Target: ES2020
- Module: ESNext with bundler resolution
- Strict mode enabled
- JSX: react-jsx
- Types: chrome, vite/client
- No unused locals/parameters allowed
