# ElementDetector Usage Guide

The `ElementDetector` class provides smart detection of page regions including hero sections, sidebars, footers, and main content areas. This enables the RetroWeb extension to apply different styling based on element importance.

## Features

### 1. Hero Section Detection
Detects prominent sections at the top of pages using:
- Class/ID patterns: `hero`, `banner`, `jumbotron`
- Semantic HTML: `[role="banner"]`
- Heuristics: Large sections (>50% viewport width, >200px height) within first 1000px of page

### 2. Sidebar Detection
Identifies navigation and complementary content using:
- Class/ID patterns: `sidebar`, `side-bar`, `navigation`
- Semantic HTML: `<aside>`, `[role="complementary"]`
- Heuristics: Narrow vertical elements (<30% viewport width, >400px height) on page edges

### 3. Footer Detection
Locates page footers using:
- Semantic HTML: `<footer>`, `[role="contentinfo"]`
- Class/ID patterns: `footer`, `bottom`
- Heuristics: Wide sections (>50% viewport width) within last 1000px of page

### 4. Main Content Detection
Identifies primary content areas using:
- Semantic HTML: `<main>`, `<article>`, `[role="main"]`
- Class/ID patterns: `content`, `main`
- Exclusion: Automatically excludes detected heroes, sidebars, and footers

## API Reference

```typescript
class ElementDetector {
  // Detect specific regions
  detectHeroSections(): Element[]
  detectSidebars(): Element[]
  detectFooters(): Element[]
  detectMainContent(): Element[]
  
  // Get all regions at once
  getAllRegions(): {
    heroes: Element[];
    sidebars: Element[];
    footers: Element[];
    mainContent: Element[];
  }
  
  // Mark regions with data attributes for CSS targeting
  markRegions(): void
  
  // Remove region markers
  unmarkRegions(): void
}
```

## Usage Example

```typescript
// Create detector instance
const detector = new ElementDetector();

// Detect all regions
const regions = detector.getAllRegions();

console.log(`Found ${regions.heroes.length} hero sections`);
console.log(`Found ${regions.sidebars.length} sidebars`);
console.log(`Found ${regions.footers.length} footers`);
console.log(`Found ${regions.mainContent.length} main content areas`);

// Mark regions with data attributes
detector.markRegions();

// Now you can target regions with CSS:
// [data-retro-region="hero"] { ... }
// [data-retro-region="sidebar"] { ... }
// [data-retro-region="footer"] { ... }
// [data-retro-region="main-content"] { ... }

// Clean up when done
detector.unmarkRegions();
```

## Integration with RetroWeb

The ElementDetector is currently instantiated in the `BackgroundStyler` class but can be used throughout the extension to:

1. **Apply different styling based on importance**
   - Less aggressive effects on hero sections
   - Preserve sidebar navigation clarity
   - Lighter styling on main content for readability

2. **Preserve critical UI elements**
   - Avoid placing GIFs over hero CTAs
   - Keep sidebar navigation functional
   - Maintain footer link accessibility

3. **Smart GIF placement**
   - Position decorative GIFs in less important areas
   - Avoid obscuring main content
   - Respect page hierarchy

## Future Enhancements

- [ ] Apply different styling based on element importance
- [ ] Preserve critical UI elements automatically
- [ ] Detect and handle modals/overlays better
- [ ] Smart form field detection
- [ ] Integration with theme system for region-specific effects

## Testing

Comprehensive tests are available in `test/elementDetector.test.ts` covering:
- Hero section detection (class names, heuristics, semantic HTML)
- Sidebar detection (narrow elements, semantic HTML)
- Footer detection (bottom positioning, semantic HTML)
- Main content detection (exclusion logic)
- Region marking and unmarking
- Integration scenarios (multiple regions, nested structures)

Run tests with:
```bash
npm test elementDetector.test.ts
```
