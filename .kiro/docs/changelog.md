# RetroWeb Extension - Changelog

## Session: November 29, 2025

### Theme Enhancements

#### Theme-Specific Cursors
- Added unique cursor for each theme:
  - Geocities: `sparkle` cursor
  - Neon Cyber: `neonPointer` cursor
  - Pixel Arcade: `pixelHand` cursor
  - VHS Glitch: `glitchCursor` cursor
  - Vaporwave: `vaporwaveCursor` cursor
  - Windows 95: `win95Arrow` cursor
- Created placeholder cursor PNG files in `assets/`
- Updated `src/assetRegistry.ts` with cursor definitions
- Updated `src/themes.ts` with cursor assignments

#### Enhanced Theme Styling
- **Geocities Chaos**: Added rainbow animated headings, brighter colors, classic blue links
- **Neon Cyber 2001**: Added CRT scanline overlay, neon flicker animation, matrix-style fonts
- **Pixel Arcade**: Added pixelated rendering, 8-bit color scheme, arcade-style blinking
- **VHS Glitch**: Added VHS tracking lines, chromatic aberration text effect, glitch animations
- **Windows 95/98**: Fixed 3D beveled borders, proper gray panel styling, classic button states

#### New Theme: Vaporwave A E S T H E T I C
- Replaced Stickerbomb Maximalist theme
- Features:
  - VHS scanline overlay effect
  - CRT screen curvature simulation
  - 80s chrome/neon heading styles with glow animation
  - Chromatic aberration on containers
  - Pink/purple/teal color palette (#ff71ce, #01cdfe, #b967ff)
  - Retro terminal-style inputs
  - Custom scrollbar styling
  - VHS filter on images
- Added vaporwave backgrounds: grid, sunset, palm, waves, stars

### Dynamic Content Handling

#### Improved MutationObserver
- Reduced debounce delay from 300ms to 100ms
- Added attribute change tracking for visibility changes
- Now observes `document.documentElement` for React/Vue portals

#### Periodic DOM Scanner
- Added 1-second interval scanner for missed elements
- Transforms semantic containers (main, article, section, aside, nav)
- Handles modals, dialogs, and dynamically added content
- Transforms child interactive elements automatically

#### Fixed Nested Border Issue
- Added CSS rules to prevent nested `.retro-div` styling
- Only top-level containers get full retro treatment
- Nested elements inherit parent styles cleanly

### Files Modified

#### Source Files
- `src/themes.ts` - Theme configurations and cursor assignments
- `src/assetRegistry.ts` - Cursor and background asset definitions
- `src/retro.css` - All theme CSS styling
- `src/content.ts` - Dynamic content handling improvements
- `popup/App.tsx` - Updated theme dropdown

#### Assets
- Created cursor placeholder files:
  - `assets/neon-pointer-cursor.png`
  - `assets/pixel-hand-cursor.png`
  - `assets/glitch-cursor.png`
  - `assets/vaporwave-cursor.png`
  - `assets/win95-arrow-cursor.png`

#### Documentation
- `README.md` - Updated theme list
- `docs/theme-cursors.md` - Cursor documentation
- `.kiro/steering/product.md` - Updated product overview
- `.kiro/specs/retroweb-extension/todo.md` - Marked completed items
- `.kiro/docs/kiro-development-guide.md` - Kiro features documentation
- `.kiro/docs/changelog.md` - This file

### Test Results
- All 49 tests passing
- Build successful (content.js: 80KB)
