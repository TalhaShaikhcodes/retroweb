// Predefined theme configurations
import { ThemeConfig } from './types';

export const themes: Record<string, ThemeConfig> = {
  'geocities-chaos': {
    name: 'Geocities Chaos Mode',
    gifs: ['construction', 'dancingBaby', 'spinningLogo', 'pixelArt'],
    background: 'stars',
    fonts: {
      heading: 'Comic Sans MS, cursive',
      body: 'Arial, sans-serif'
    },
    cursor: 'sparkle',
    colors: {
      neonBorder: '#ff00ff',
      textGlow: '#00ffff'
    },
    vintage: {
      counter: true,
      stickers: ['netscapeBadge', 'awardRibbon'],
      sounds: true
    }
  },
  'neon-cyber-2001': {
    name: 'Neon Cyber 2001',
    gifs: ['spinningLogo', 'pixelArt'],
    background: 'neonGrid',
    fonts: {
      heading: 'Impact, fantasy',
      body: 'Courier New, monospace'
    },
    cursor: 'neonPointer',
    colors: {
      neonBorder: '#00ff00',
      textGlow: '#ff00ff'
    },
    vintage: {
      counter: true,
      stickers: ['netscapeBadge'],
      sounds: false
    }
  },
  'pixel-arcade': {
    name: 'Pixel Arcade',
    gifs: ['pixelArt', 'spinningLogo'],
    background: 'pixel',
    fonts: {
      heading: 'Press Start 2P, cursive',
      body: 'Courier New, monospace'
    },
    cursor: 'pixelHand',
    colors: {
      neonBorder: '#ffff00',
      textGlow: '#ff0000'
    },
    vintage: {
      counter: true,
      stickers: ['awardRibbon'],
      sounds: true
    }
  },
  'vhs-glitch': {
    name: 'VHS Analog Glitch',
    gifs: ['construction', 'dancingBaby'],
    background: 'vhsScanlines',
    fonts: {
      heading: 'Arial Black, sans-serif',
      body: 'Verdana, sans-serif'
    },
    cursor: 'glitchCursor',
    colors: {
      neonBorder: '#ff0080',
      textGlow: '#00ffaa'
    },
    vintage: {
      counter: true,
      stickers: ['netscapeBadge', 'awardRibbon'],
      sounds: false
    }
  },
  'vaporwave': {
    name: 'Vaporwave A E S T H E T I C',
    gifs: ['spinningLogo', 'pixelArt'],
    background: 'vaporwaveGrid',
    fonts: {
      heading: 'Arial Black, Impact, sans-serif',
      body: 'Arial, Helvetica, sans-serif'
    },
    cursor: 'vaporwaveCursor',
    colors: {
      neonBorder: '#ff71ce',
      textGlow: '#01cdfe'
    },
    vintage: {
      counter: true,
      stickers: ['netscapeBadge'],
      sounds: false
    }
  },
  'windows-95': {
    name: 'Windows 95/98',
    gifs: ['construction', 'spinningLogo'],
    background: 'win95Teal',
    fonts: {
      heading: 'MS Sans Serif, Tahoma, Arial, sans-serif',
      body: 'MS Sans Serif, Tahoma, Arial, sans-serif'
    },
    cursor: 'win95Arrow',
    colors: {
      neonBorder: '#808080',
      textGlow: 'none'
    },
    vintage: {
      counter: true,
      stickers: ['netscapeBadge'],
      sounds: false
    }
  }
};

// Background options per theme (10-15 backgrounds each)
export const themeBackgrounds: Record<string, string[]> = {
  'geocities-chaos': [
    'stars',           // Original GIF
    'glitter',         // Original GIF
    'gradient',        // Original GIF
    'checkerboard',    // CSS
    'diagonalStripes', // CSS
    'polkaDots',       // CSS
    'rainbowWaves',    // CSS
    'hearts',          // CSS
    'geometric',       // Original GIF
    'confetti',        // CSS (shared with stickerbomb)
    'rainbowDiagonal', // CSS (shared with stickerbomb)
    'bubbleGum'        // CSS (shared with stickerbomb)
  ],
  'neon-cyber-2001': [
    'neonGrid',        // Original GIF
    'cyberGrid',       // CSS
    'neonHex',         // CSS
    'circuitBoard',    // CSS
    'matrixRain',      // CSS
    'digitalCamo',     // CSS
    'geometric',       // Original GIF (shared)
    'pixel',           // Original GIF (shared)
    'checkerboard',    // CSS (shared, works with neon)
    'scanlines',       // CSS (shared with VHS)
    'glitchBars'       // CSS (shared with VHS)
  ],
  'pixel-arcade': [
    'pixel',           // Original GIF
    'pixelCheckers',   // CSS
    'arcadeCarpet',    // CSS
    'pixelDots',       // CSS
    'retroBlocks',     // CSS
    'eightBitGrid',    // CSS
    'geometric',       // Original GIF (shared)
    'checkerboard',    // CSS (shared)
    'diagonalStripes', // CSS (shared with geocities)
    'confetti',        // CSS (shared)
    'gradient'         // Original GIF (shared)
  ],
  'vhs-glitch': [
    'vhsScanlines',    // Original GIF
    'scanlines',       // CSS
    'vhsNoise',        // CSS
    'glitchBars',      // CSS
    'analogStatic',    // CSS
    'chromaAberration',// CSS
    'gradient',        // Original GIF (shared)
    'geometric',       // Original GIF (shared)
    'neonGrid',        // Original GIF (shared with cyber)
    'cyberGrid',       // CSS (shared with cyber)
    'matrixRain'       // CSS (shared with cyber)
  ],
  'vaporwave': [
    'vaporwaveGrid',     // CSS - Pink/purple grid
    'vaporwaveSunset',   // CSS - Sunset gradient
    'vaporwavePalm',     // CSS - Palm tree silhouette pattern
    'vaporwaveWaves',    // CSS - Wavy lines
    'vaporwaveStars',    // CSS - Starfield
    'gradient',          // Original GIF (shared)
    'neonGrid',          // Original GIF (shared with cyber)
    'glitter',           // Original GIF (shared)
    'stars'              // Original GIF (shared)
  ],
  'windows-95': [
    'win95Teal',       // CSS - Classic Windows 95 teal
    'win95Gray',       // CSS - Windows gray
    'win95Desktop',    // CSS - Desktop pattern
    'win95Clouds',     // CSS - Cloud pattern
    'win95Bricks',     // CSS - Brick pattern
    'win95Tiles',      // CSS - Tile pattern
    'win95Weave',      // CSS - Weave pattern
    'win95Plaid',      // CSS - Plaid pattern
    'win95Boxes',      // CSS - 3D boxes
    'win95Grid',       // CSS - Simple grid
    'checkerboard',    // CSS (shared)
    'diagonalStripes', // CSS (shared)
    'geometric'        // Original GIF (shared)
  ]
};

// Helper function to get theme by name
export function getTheme(themeName: string): ThemeConfig | undefined {
  return themes[themeName];
}

// Helper function to get all theme names
export function getThemeNames(): string[] {
  return Object.keys(themes);
}

// Helper function to get all themes
export function getAllThemes(): ThemeConfig[] {
  return Object.values(themes);
}

// Helper function to get all available backgrounds for a theme
export function getThemeBackgrounds(themeName: string): string[] {
  return themeBackgrounds[themeName] || [];
}

// Helper function to get a random background for a theme
export function getRandomThemeBackground(themeName: string): string {
  const backgrounds = themeBackgrounds[themeName];
  if (!backgrounds || backgrounds.length === 0) {
    // Fallback to theme's default background
    const theme = themes[themeName];
    return theme?.background || 'stars';
  }
  return backgrounds[Math.floor(Math.random() * backgrounds.length)];
}
