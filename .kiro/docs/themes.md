# RetroWeb Extension - Theme Documentation

## Available Themes

### 1. Geocities Chaos Mode
**ID:** `geocities-chaos`

**Aesthetic:** Maximum 90s homepage chaos - ugly and proud!

**Colors:**
- Primary: `#ff00ff` (Magenta)
- Secondary: `#00ffff` (Cyan)
- Accent: `#ffff00` (Yellow)

**Features:**
- Rainbow animated headings
- Ridge borders with black drop shadows
- Comic Sans font throughout
- Classic blue underlined links
- Outset/inset button effects

**Cursor:** `sparkle`

---

### 2. Neon Cyber 2001
**ID:** `neon-cyber-2001`

**Aesthetic:** Early 2000s hacker/matrix aesthetic

**Colors:**
- Primary: `#00ff00` (Green)
- Secondary: `#ff00ff` (Magenta)
- Accent: `#00ffff` (Cyan)

**Features:**
- CRT scanline overlay effect
- Neon flickering text animation
- Monospace fonts (Courier New)
- Green-tinted image filter
- Glowing green borders

**Cursor:** `neonPointer`

---

### 3. Pixel Arcade
**ID:** `pixel-arcade`

**Aesthetic:** 8-bit retro gaming

**Colors:**
- Primary: `#ffff00` (Yellow)
- Secondary: `#ff0000` (Red)
- Accent: `#00ff00` (Green)
- Background: `#000080` (Navy)

**Features:**
- Pixelated rendering on all elements
- Chunky pixel shadows
- Blinking arcade-style headings
- Bold 8-bit color scheme

**Cursor:** `pixelHand`

---

### 4. VHS Analog Glitch
**ID:** `vhs-glitch`

**Aesthetic:** Analog video distortion

**Colors:**
- Primary: `#ff0080` (Hot Pink)
- Secondary: `#00ffaa` (Mint)
- Accent: `#8000ff` (Purple)

**Features:**
- VHS tracking line overlay
- Chromatic aberration text effect (RGB split)
- Glitch animation on headings
- Color-shifted image borders

**Cursor:** `glitchCursor`

---

### 5. Vaporwave A E S T H E T I C
**ID:** `vaporwave`

**Aesthetic:** 80s/90s nostalgia, VHS, early digital

**Colors:**
- Primary: `#ff71ce` (Pink)
- Secondary: `#01cdfe` (Cyan)
- Accent: `#b967ff` (Purple)
- Background: `#2d1b4e` (Dark Purple)

**Features:**
- VHS scanline overlay
- CRT screen curvature effect
- 80s chrome/neon headings with glow animation
- Chromatic aberration on containers
- Retro terminal-style inputs
- Custom pink/purple scrollbars
- VHS filter on images

**Cursor:** `vaporwaveCursor`

---

### 6. Windows 95/98
**ID:** `windows-95`

**Aesthetic:** Classic Windows desktop

**Colors:**
- Primary: `#000080` (Navy)
- Secondary: `#c0c0c0` (Silver/Gray)
- Accent: `#008080` (Teal)

**Features:**
- 3D beveled borders (white/gray)
- Classic gray panel backgrounds
- Tahoma/MS Sans Serif fonts
- Blue underlined links
- Sunken input fields
- Pressed button states

**Cursor:** `win95Arrow`

---

## Theme Configuration Structure

Each theme is defined in `src/themes.ts`:

```typescript
{
  name: 'Display Name',
  gifs: ['gif1', 'gif2'],
  background: 'backgroundName',
  fonts: {
    heading: 'Font Family',
    body: 'Font Family'
  },
  cursor: 'cursorName',
  colors: {
    neonBorder: '#hexcolor',
    textGlow: '#hexcolor'
  },
  vintage: {
    counter: true/false,
    stickers: ['sticker1'],
    sounds: true/false
  }
}
```

## Adding New Themes

1. Add theme config to `src/themes.ts`
2. Add backgrounds to `themeBackgrounds` in `src/themes.ts`
3. Add CSS styles to `src/retro.css`
4. Add cursor to `src/assetRegistry.ts`
5. Create cursor PNG in `assets/`
6. Update dropdown in `popup/App.tsx`
7. Update documentation
