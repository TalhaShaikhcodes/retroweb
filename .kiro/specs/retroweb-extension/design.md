# Design Document

## Overview

RetroWeb is a Chrome extension that transforms modern websites into nostalgic late 90s/early 2000s internet experiences. The extension uses Chrome's Manifest V3 architecture with content scripts to inject visual overlays, animations, and styling onto target pages while preserving their underlying functionality. The design emphasizes modularity, performance, and user customization through a theme-based system.

## Architecture

### Extension Structure

The extension follows Chrome's Manifest V3 architecture with the following components:

1. **Background Service Worker**: Manages extension lifecycle, handles installation, and coordinates between components
2. **Content Scripts**: Injected into target pages to apply retro transformations
3. **Popup UI**: Provides user controls for theme selection and customization
4. **Asset Library**: Collection of GIFs, backgrounds, fonts, and cursor images
5. **Storage Layer**: Persists user preferences and per-domain settings

### Component Interaction Flow

```
User clicks extension icon
    ↓
Popup UI opens
    ↓
User selects theme/settings
    ↓
Message sent to Background Service Worker
    ↓
Service Worker sends message to Content Script
    ↓
Content Script applies retro transformation
    ↓
DOM is modified with retro elements
```

### Technology Stack

- **Manifest Version**: V3
- **Content Script Language**: JavaScript (ES6+)
- **Styling**: CSS3 with animations and transforms
- **Storage**: Chrome Storage API (sync and local)
- **Asset Format**: GIF, PNG, CSS fonts
- **Build Tool**: Webpack or Rollup for bundling

## Components and Interfaces

### 1. Manifest Configuration

```json
{
  "manifest_version": 3,
  "name": "RetroWeb",
  "version": "1.0.0",
  "permissions": ["storage", "activeTab"],
  "host_permissions": ["<all_urls>"],
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["content.js"],
    "css": ["retro.css"],
    "run_at": "document_idle"
  }],
  "action": {
    "default_popup": "popup.html"
  },
  "web_accessible_resources": [{
    "resources": ["assets/*"],
    "matches": ["<all_urls>"]
  }]
}
```

### 2. Background Service Worker

**Responsibilities**:
- Handle extension installation and updates
- Manage message passing between popup and content scripts
- Coordinate state across tabs
- Handle settings migration

**Key Functions**:
- `onInstalled()`: Initialize default settings
- `onMessage()`: Route messages between components
- `migrateSettings()`: Handle version updates

### 3. Content Script

**Responsibilities**:
- Apply retro transformations to target pages
- Inject and position visual elements
- Observe DOM changes for dynamic content
- Handle cleanup on deactivation

**Core Modules**:

#### RetroTransformer (Main Controller)
```javascript
class RetroTransformer {
  constructor(config)
  activate()
  deactivate()
  applyTheme(themeName)
  updateSettings(settings)
}
```

#### GifInjector
```javascript
class GifInjector {
  injectGifs(count, positions)
  removeGifs()
  repositionOnScroll()
  getRandomGif()
}
```

#### BackgroundStyler
```javascript
class BackgroundStyler {
  applyTiledBackground(pattern)
  applyNeonBorders()
  adjustContrast()
  removeBackgrounds()
}
```

#### FontTransformer
```javascript
class FontTransformer {
  applyRetroFonts()
  createMarquee(text)
  addBlinkingText()
  addNeonGlow()
}
```

#### CursorCustomizer
```javascript
class CursorCustomizer {
  setCursor(cursorType)
  enableTrail()
  updateTrail(x, y)
  removeTrail()
}
```

#### VintageElements
```javascript
class VintageElements {
  createVisitorCounter()
  addRetroStickers()
  playSoundEffect(action)
  positionElements()
}
```

### 4. Popup UI

**Responsibilities**:
- Display theme selection interface in retro Geocities style
- Provide toggles for individual elements with nostalgic UI controls
- Show intensity sliders with retro styling
- Display current activation status with vintage indicators

**Retro Styling Approach**:
The popup UI itself will embrace the Geocities aesthetic to create an immersive nostalgic experience:
- Tiled background (stars, glitter, or geometric patterns)
- Comic Sans or pixel fonts for all text
- Neon-colored borders and buttons
- Animated GIF decorations (small construction signs, spinning icons)
- Retro color scheme (bright colors, gradients)
- "Under Construction" banner or similar nostalgic elements
- Visitor counter display showing extension usage
- Retro-styled checkboxes and radio buttons
- Gradient or textured buttons with 90s styling

**Interface Elements**:
- Theme dropdown/grid with retro card designs
- Element category toggles (GIFs, backgrounds, fonts, cursors, vintage) styled as 90s checkboxes
- Intensity sliders with colorful gradient tracks
- Quick disable button styled as a chunky 90s button
- Per-domain settings toggle with retro switch design
- Status indicator using retro badges or animated GIFs

### 5. Theme System

**Theme Structure**:
```javascript
{
  name: "Geocities Chaos Mode",
  gifs: ["construction.gif", "dancing-baby.gif", "spinning-logo.gif"],
  background: "stars-tile.gif",
  fonts: {
    heading: "Comic Sans MS",
    body: "Arial"
  },
  cursor: "sparkle-trail",
  colors: {
    neonBorder: "#ff00ff",
    textGlow: "#00ffff"
  },
  vintage: {
    counter: true,
    stickers: ["netscape-badge", "award-ribbon"],
    sounds: true
  }
}
```

**Predefined Themes**:
1. **Geocities Chaos Mode**: Maximum nostalgia with all elements enabled
2. **Neon Cyber 2001**: Cyberpunk aesthetic with neon colors and grid backgrounds
3. **Pixel Arcade**: 8-bit pixel art and retro gaming elements
4. **VHS Analog Glitch**: Scan lines, color distortion, and VHS artifacts
5. **Stickerbomb Maximalist**: Dense sticker coverage with minimal animation

## Data Models

### Settings Object
```javascript
{
  enabled: boolean,
  currentTheme: string,
  customSettings: {
    gifs: {
      enabled: boolean,
      count: number,
      types: string[]
    },
    background: {
      enabled: boolean,
      pattern: string
    },
    fonts: {
      enabled: boolean,
      style: string
    },
    cursor: {
      enabled: boolean,
      type: string,
      trail: boolean
    },
    vintage: {
      counter: boolean,
      stickers: boolean,
      sounds: boolean
    }
  },
  perDomainSettings: {
    [domain]: {
      enabled: boolean,
      theme: string,
      customSettings: object
    }
  }
}
```

### Asset Registry
```javascript
{
  gifs: {
    construction: { url: string, width: number, height: number },
    dancingBaby: { url: string, width: number, height: number },
    // ... more GIFs
  },
  backgrounds: {
    stars: { url: string, tileSize: number },
    glitter: { url: string, tileSize: number },
    // ... more backgrounds
  },
  cursors: {
    sparkle: { url: string, hotspot: [x, y] },
    rainbow: { url: string, hotspot: [x, y] },
    // ... more cursors
  }
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Activation and Deactivation Properties

Property 1: Activation applies retro elements
*For any* target page, when the extension is activated, the DOM should contain retro elements (GIFs, backgrounds, fonts, cursors, or vintage elements) that were not present before activation.
**Validates: Requirements 1.1**

Property 2: Active state shows visual indicator
*For any* extension state, when the retro layer is active, a visual indicator element should be present in the extension UI.
**Validates: Requirements 1.2**

Property 3: Activation and deactivation round-trip
*For any* target page, capturing the DOM state, activating the retro layer, then deactivating it should restore the DOM to its original state with all retro elements removed.
**Validates: Requirements 1.3, 2.5**

Property 4: Interactive functionality preservation
*For any* target page with interactive elements (buttons, links, forms), after applying the retro layer, all interactive elements should remain clickable and functional with event handlers intact.
**Validates: Requirements 1.5, 10.1**

### GIF Injection Properties

Property 5: GIF count within range
*For any* target page with retro layer active, the count of injected GIF elements should be between 5 and 15 inclusive.
**Validates: Requirements 2.1**

Property 6: GIF positioning avoids interactive elements
*For any* target page with retro layer active, injected GIF elements should not overlap with interactive elements (buttons, links, form inputs, video controls) by more than 10% of the interactive element's area.
**Validates: Requirements 2.2, 10.2, 10.3**

Property 7: GIF viewport positioning on scroll
*For any* target page with GIFs injected, scrolling the page should maintain GIF positions relative to the viewport (fixed positioning).
**Validates: Requirements 2.3**

Property 8: GIF type diversity
*For any* set of injected GIFs, the collection should include at least two different categories from: construction signs, dancing figures, spinning logos, and pixel art.
**Validates: Requirements 2.4**

### Background and Styling Properties

Property 9: Background pattern application
*For any* target page with retro layer active, the body element should have a CSS background property set to a repeating tiled pattern.
**Validates: Requirements 3.1**

Property 10: Background variety availability
*For any* theme or custom configuration, the available background options should include at least one from each category: glitter textures, starry skies, rainbow gradients, and geometric patterns.
**Validates: Requirements 3.2**

Property 11: Readability preservation with backgrounds
*For any* target page with background modifications, either a contrast adjustment or semi-transparent overlay should be applied to ensure text remains readable.
**Validates: Requirements 3.3**

Property 12: Neon border application
*For any* target page with neon borders enabled, major content sections (divs, articles, sections) should have colorful border CSS properties applied.
**Validates: Requirements 3.4**

Property 13: Dark theme adaptation
*For any* target page with dark background colors (luminance < 0.3), retro elements should have adjusted colors or opacity to maintain visual compatibility.
**Validates: Requirements 3.5**

### Font and Text Properties

Property 14: Font replacement
*For any* target page with retro layer active, text elements should have font-family CSS properties modified to include retro fonts (Comic Sans, pixel fonts, or decorative typefaces).
**Validates: Requirements 4.1**

Property 15: Heading glow effects
*For any* target page with text effects enabled, heading elements (h1-h6) should have text-shadow or glow CSS properties applied.
**Validates: Requirements 4.2**

Property 16: Marquee creation
*For any* target page with marquee effects enabled, at least one scrolling text banner element should be present in the DOM.
**Validates: Requirements 4.3**

Property 17: Blinking text animation
*For any* target page with blinking text enabled, selected text elements should have CSS animation properties that periodically change visibility or opacity.
**Validates: Requirements 4.4**

Property 18: Layout preservation with font changes
*For any* target page, applying font replacements should not cause element overflow or layout breaks (elements should remain within viewport bounds or parent containers).
**Validates: Requirements 4.5**

### Cursor Customization Properties

Property 19: Cursor replacement
*For any* target page with retro layer active, the body element should have a cursor CSS property set to a custom retro cursor image URL.
**Validates: Requirements 5.1**

Property 20: Cursor trail rendering
*For any* target page with cursor trails enabled, moving the cursor should create trail elements in the DOM that follow the cursor path.
**Validates: Requirements 5.2**

Property 21: Cursor type availability
*For any* cursor configuration, the available cursor options should include sparkly stars, rainbow trails, and animated icons.
**Validates: Requirements 5.4**

Property 22: Interactive element cursor preservation
*For any* target page with custom cursors applied, hovering over clickable elements should maintain pointer cursor feedback (cursor: pointer).
**Validates: Requirements 5.5**

### Vintage Elements Properties

Property 23: Visitor counter display
*For any* target page with retro layer active, a visitor counter element should be present in the DOM displaying a numeric value.
**Validates: Requirements 6.1**

Property 24: Counter styling authenticity
*For any* visitor counter element, it should use CSS classes or styles that create segmented digit displays characteristic of retro counters.
**Validates: Requirements 6.2**

Property 25: Retro sticker placement
*For any* target page with retro stickers enabled, decorative elements containing text like "Best Viewed in Netscape" or award ribbons should be present in the DOM.
**Validates: Requirements 6.3**

Property 26: Sound effect playback
*For any* target page with sound effects enabled and user interaction occurred, audio elements should be created and play methods should be invoked on specific user actions.
**Validates: Requirements 6.4**

Property 27: Vintage element positioning
*For any* target page with vintage elements, these elements should be positioned in corner or edge regions (within 100px of viewport edges).
**Validates: Requirements 6.5**

### Popup UI Retro Styling Properties

Property 28: Popup background styling
*For any* popup UI instance, the popup should have a CSS background property set to a tiled retro pattern (stars, glitter, or geometric).
**Validates: Requirements 11.1**

Property 29: Popup retro fonts
*For any* text element in the popup UI, the font-family should be set to retro fonts (Comic Sans, pixel fonts, or similar nostalgic typefaces).
**Validates: Requirements 11.2**

Property 30: Popup control styling
*For any* interactive control in the popup UI (buttons, toggles, sliders), the element should have 90s-era styling including neon colors, gradients, or chunky borders.
**Validates: Requirements 11.3**

Property 31: Popup GIF decorations
*For any* popup UI instance, at least one small animated GIF decoration (construction sign, spinning icon, etc.) should be present.
**Validates: Requirements 11.4**

Property 32: Popup status indicators
*For any* status information displayed in the popup UI, retro-styled indicators (vintage badges, animated elements) should be used instead of modern UI elements.
**Validates: Requirements 11.5**

### Theme System Properties

Property 33: Theme count minimum
*For any* extension installation, the available themes list should contain at least 5 predefined themes.
**Validates: Requirements 7.3**

Property 34: Theme persistence round-trip
*For any* theme selection, saving the theme choice to storage and then loading settings should retrieve the same theme name.
**Validates: Requirements 7.4**

Property 35: Theme switching without reload
*For any* target page, switching from one theme to another should not trigger a page reload (navigation event should not fire).
**Validates: Requirements 7.5**

### Customization Properties

Property 36: Selective element removal
*For any* target page with multiple retro element categories active, toggling one category off should remove only elements from that category while elements from other categories remain present.
**Validates: Requirements 8.2**

Property 37: Intensity adjustment effect
*For any* target page with intensity sliders, increasing a slider value should increase the count or prominence of corresponding visual elements.
**Validates: Requirements 8.3**

Property 38: Per-domain settings isolation
*For any* two different domains, custom settings saved for domain A should not affect the settings applied to domain B.
**Validates: Requirements 8.4**

Property 39: Domain-specific settings persistence
*For any* domain with custom settings, saving settings for that domain and then revisiting the domain should apply the same custom settings automatically.
**Validates: Requirements 8.5**

### Compatibility Properties

Property 40: Page load effect application
*For any* target page that loads with extension enabled, retro effects should be present in the DOM after the page load completes.
**Validates: Requirements 9.2**

Property 41: SPA navigation persistence
*For any* single-page application, simulating a navigation event should maintain or reapply retro effects on the new view.
**Validates: Requirements 9.3**

Property 42: Dynamic content styling
*For any* target page with retro layer active, dynamically adding new elements to the DOM should result in those elements receiving retro styling within a reasonable time.
**Validates: Requirements 9.5**

### Error Handling Properties

Property 43: CSP error resilience
*For any* target page with Content Security Policy restrictions, CSP errors should be caught, logged, and not prevent the application of compatible retro effects.
**Validates: Requirements 12.1**

Property 44: Resource load fallback
*For any* retro asset that fails to load, a fallback asset should be used instead, and the transformation should continue without breaking.
**Validates: Requirements 12.2**

Property 45: Incompatibility detection
*For any* target page with incompatible structure, the extension should detect the incompatibility and display a notification in the popup UI.
**Validates: Requirements 12.3**

Property 46: Error isolation
*For any* JavaScript error occurring in the content script, the error should not propagate to the target page's JavaScript context or break page functionality.
**Validates: Requirements 12.4**

Property 47: Settings migration preservation
*For any* extension update with settings format changes, old settings should be migrated to the new format without data loss (all user preferences preserved).
**Validates: Requirements 12.5**

## Error Handling

### Content Security Policy (CSP) Handling

The extension must gracefully handle CSP restrictions that prevent inline styles or external resource loading:

1. **Detection**: Catch CSP violation errors in content script
2. **Fallback**: Use alternative methods (CSS classes instead of inline styles)
3. **Logging**: Record CSP violations for debugging
4. **User Notification**: Inform user if major features are blocked

### Resource Loading Failures

When GIFs, backgrounds, or other assets fail to load:

1. **Retry Logic**: Attempt to reload failed resources once
2. **Fallback Assets**: Use embedded base64 fallback images
3. **Graceful Degradation**: Continue transformation with available assets
4. **Error Reporting**: Log failures without breaking user experience

### DOM Manipulation Errors

Handle cases where DOM manipulation fails:

1. **Try-Catch Blocks**: Wrap all DOM operations in error handlers
2. **Validation**: Check element existence before manipulation
3. **Rollback**: Remove partially applied effects if critical errors occur
4. **Isolation**: Prevent errors from affecting target page functionality

### Incompatible Page Structures

For pages with unusual structures or frameworks:

1. **Detection**: Identify shadow DOM, iframes, and complex frameworks
2. **Adaptation**: Use appropriate selectors and traversal methods
3. **Notification**: Alert user if transformation is limited
4. **Manual Override**: Provide option to force transformation

## Testing Strategy

### Unit Testing

Unit tests will verify specific examples and edge cases for individual components:

**GifInjector Tests**:
- Test GIF injection with empty page
- Test GIF injection with page containing many interactive elements
- Test GIF removal leaves no artifacts
- Test GIF positioning with small viewport

**BackgroundStyler Tests**:
- Test background application on page with existing background
- Test contrast adjustment with white text on white background
- Test neon border application on nested elements

**FontTransformer Tests**:
- Test font replacement on page with custom fonts
- Test marquee creation with special characters
- Test layout preservation with very long text

**CursorCustomizer Tests**:
- Test cursor trail with rapid mouse movement
- Test cursor preservation on disabled buttons
- Test cursor cleanup on deactivation

**VintageElements Tests**:
- Test visitor counter increments correctly
- Test sticker positioning on small viewport
- Test sound playback after user interaction

**Theme System Tests**:
- Test theme switching between all predefined themes
- Test theme loading with corrupted settings
- Test custom theme creation and application

**Storage Tests**:
- Test settings persistence across browser restart
- Test per-domain settings with subdomain variations
- Test settings migration from version 1.0 to 2.0

### Property-Based Testing

Property-based tests will verify universal properties across many randomly generated inputs using **fast-check** (JavaScript property-based testing library). Each property test will run a minimum of 100 iterations.

**Test Configuration**:
```javascript
import fc from 'fast-check';

// Configure to run 100 iterations minimum
fc.assert(
  fc.property(/* generators */, /* test function */),
  { numRuns: 100 }
);
```

**Property Test Generators**:

```javascript
// Generate random DOM structures
const domGenerator = fc.record({
  tagName: fc.constantFrom('div', 'span', 'p', 'article', 'section'),
  children: fc.nat(10),
  hasInteractive: fc.boolean(),
  hasBackground: fc.boolean()
});

// Generate random theme configurations
const themeGenerator = fc.record({
  name: fc.string(),
  gifCount: fc.integer(5, 15),
  backgroundType: fc.constantFrom('stars', 'glitter', 'gradient', 'geometric'),
  fontStyle: fc.constantFrom('comic-sans', 'pixel', 'decorative'),
  cursorType: fc.constantFrom('sparkle', 'rainbow', 'animated')
});

// Generate random settings
const settingsGenerator = fc.record({
  enabled: fc.boolean(),
  theme: fc.string(),
  customSettings: fc.record({
    gifs: fc.record({ enabled: fc.boolean(), count: fc.integer(5, 15) }),
    background: fc.record({ enabled: fc.boolean() }),
    fonts: fc.record({ enabled: fc.boolean() }),
    cursor: fc.record({ enabled: fc.boolean(), trail: fc.boolean() }),
    vintage: fc.record({ counter: fc.boolean(), stickers: fc.boolean() })
  })
});
```

**Property Test Implementation**:

Each correctness property will be implemented as a property-based test with explicit tagging:

```javascript
// Example property test structure
describe('RetroWeb Property Tests', () => {
  it('Property 3: Activation and deactivation round-trip', () => {
    // **Feature: retroweb-extension, Property 3: Activation and deactivation round-trip**
    fc.assert(
      fc.property(domGenerator, (domConfig) => {
        const page = createTestPage(domConfig);
        const originalState = captureDOM(page);
        
        activateRetroLayer(page);
        deactivateRetroLayer(page);
        
        const finalState = captureDOM(page);
        return deepEqual(originalState, finalState);
      }),
      { numRuns: 100 }
    );
  });
});
```

All property-based tests will follow this pattern:
1. Generate random valid inputs
2. Apply operations
3. Verify the property holds
4. Tag with feature name and property number

### Integration Testing

Integration tests will verify end-to-end workflows:

- Install extension → activate on page → verify all elements present
- Change theme → verify all visual elements update
- Toggle individual elements → verify selective updates
- Navigate SPA → verify effects persist
- Encounter CSP page → verify graceful degradation

### Browser Compatibility Testing

Test across Chrome versions and Chromium-based browsers:

- Chrome stable, beta, and dev channels
- Microsoft Edge
- Brave Browser
- Opera

### Performance Testing

Monitor performance metrics:

- Extension activation time (target: < 2 seconds)
- Memory usage with retro layer active
- CPU usage during cursor trail rendering
- Impact on page load time

## Implementation Notes

### Performance Optimizations

1. **Lazy Loading**: Load GIF assets only when needed
2. **Debouncing**: Debounce scroll and resize handlers
3. **RequestAnimationFrame**: Use RAF for cursor trail animations
4. **CSS Transforms**: Use GPU-accelerated transforms for animations
5. **Event Delegation**: Use delegated event handlers instead of individual listeners

### Accessibility Considerations

1. **Reduced Motion**: Respect prefers-reduced-motion media query
2. **Screen Readers**: Ensure retro elements have appropriate ARIA labels
3. **Keyboard Navigation**: Maintain tab order and focus indicators
4. **Color Contrast**: Ensure text remains WCAG AA compliant

### Security Considerations

1. **Content Script Isolation**: Run in isolated world to prevent page script access
2. **CSP Compliance**: Use extension resources instead of inline scripts
3. **XSS Prevention**: Sanitize any user-provided custom text
4. **Permission Minimization**: Request only necessary permissions

### Browser Storage Strategy

1. **Sync Storage**: Use chrome.storage.sync for theme preferences (limited to 100KB)
2. **Local Storage**: Use chrome.storage.local for per-domain settings and asset cache
3. **Storage Quotas**: Monitor storage usage and implement cleanup for old domains
4. **Migration Strategy**: Version settings schema and provide migration functions
