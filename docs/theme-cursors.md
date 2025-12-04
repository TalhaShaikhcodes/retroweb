# Theme-Specific Cursors

Each RetroWeb theme now has its own unique cursor to match the aesthetic!

## Cursor Mapping

### Geocities Chaos Mode
- **Cursor**: `sparkle` (sparkle-cursor.png)
- **Style**: Sparkly, glittery cursor with star effects
- **Matches**: The chaotic, maximalist Geocities aesthetic

### Neon Cyber 2001
- **Cursor**: `neonPointer` (neon-pointer-cursor.png)
- **Style**: Glowing neon pointer with cyberpunk vibes
- **Matches**: The futuristic neon grid and cyber aesthetic

### Pixel Arcade
- **Cursor**: `pixelHand` (pixel-hand-cursor.png)
- **Style**: 8-bit pixelated hand cursor
- **Matches**: The retro gaming and pixel art theme

### VHS Analog Glitch
- **Cursor**: `glitchCursor` (glitch-cursor.png)
- **Style**: Distorted, glitchy cursor with VHS artifacts
- **Matches**: The analog glitch and VHS scanline aesthetic

### Stickerbomb Maximalist
- **Cursor**: `stickerCursor` (sticker-cursor.png)
- **Style**: Colorful sticker-style cursor
- **Matches**: The maximalist sticker collage theme

### Windows 95/98
- **Cursor**: `win95Arrow` (win95-arrow-cursor.png)
- **Style**: Classic Windows 95 arrow cursor
- **Matches**: The retro Windows desktop aesthetic

## Implementation

Cursors are automatically applied when a theme is selected. The cursor type is defined in each theme's configuration in `src/themes.ts`:

```typescript
cursor: 'sparkle' // or 'neonPointer', 'pixelHand', etc.
```

## Asset Registry

All cursor assets are registered in `src/assetRegistry.ts` with:
- `url`: Path to the cursor image file
- `hotspot`: Click point coordinates [x, y]

## Files

Cursor image files are located in `assets/`:
- `sparkle-cursor.png`
- `rainbow-cursor.png`
- `animated-cursor.png`
- `neon-pointer-cursor.png`
- `pixel-hand-cursor.png`
- `glitch-cursor.png`
- `sticker-cursor.png`
- `win95-arrow-cursor.png`

## Future Enhancements

- Animated cursor GIFs for more dynamic effects
- Cursor trail colors matching theme colors
- Theme-specific cursor trail particle shapes
- Multiple cursor options per theme
