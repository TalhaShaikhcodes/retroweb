# Project Structure

## Directory Organization

```
retroweb-extension/
├── src/                    # Core extension logic (TypeScript)
│   ├── background.ts       # Service worker (message passing, settings)
│   ├── content.ts          # Content script (DOM manipulation)
│   ├── types.ts            # Shared TypeScript interfaces
│   ├── themes.ts           # Theme configurations
│   ├── assetRegistry.ts    # Asset metadata and URLs
│   └── retro.css           # Base CSS injected into pages
├── popup/                  # React-based popup UI
│   ├── index.html          # Popup entry HTML
│   ├── App.tsx             # Main React component
│   ├── main.tsx            # React entry point
│   └── popup.css           # Popup-specific styles
├── assets/                 # Static resources (GIFs, images, icons)
├── test/                   # Test setup and utilities
├── dist/                   # Build output (gitignored)
└── manifest.json           # Chrome extension manifest (V3)
```

## Architecture Patterns

### Extension Components

1. **Background Service Worker** (`src/background.ts`)
   - Manages extension lifecycle and settings
   - Handles message passing between popup and content scripts
   - Coordinates chrome.storage.sync operations
   - Implements settings migration logic

2. **Content Script** (`src/content.ts`)
   - Injected into all web pages
   - Applies retro transformations to DOM
   - Listens for activation/deactivation messages
   - Responds to settings updates

3. **Popup UI** (`popup/`)
   - React-based configuration interface
   - Communicates with background script via chrome.runtime.sendMessage
   - Manages local state and syncs with chrome.storage

### Type System

- Centralized type definitions in `src/types.ts`
- Interfaces duplicated in background.ts and popup/App.tsx (intentional for isolation)
- Key types: `Settings`, `CustomSettings`, `ThemeConfig`, `AssetRegistry`

### Message Passing

Standard message types:
- `GET_SETTINGS` - Retrieve current settings
- `UPDATE_SETTINGS` - Update and broadcast settings
- `TOGGLE_EXTENSION` - Enable/disable extension
- `ACTIVATE` / `DEACTIVATE` - Control content script
- `SETTINGS_UPDATED` - Broadcast to all tabs

### Asset Management

- All assets in `assets/` directory
- Asset metadata in `src/assetRegistry.ts`
- Web-accessible resources declared in manifest
- Extension URLs resolved via `chrome.runtime.getURL()`

## Code Conventions

- Use async/await for Chrome API calls where possible
- Return `true` from message listeners for async responses
- Catch and ignore errors for tabs without content scripts
- Console.log for development debugging
- Strict TypeScript with no unused variables
- Functional React components with hooks
