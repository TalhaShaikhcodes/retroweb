// Asset registry mapping theme elements to file paths
import { AssetRegistry } from './types';

export const assetRegistry: AssetRegistry = {
  gifs: {
    construction: {
      url: 'assets/construction.gif',
      width: 100,
      height: 100
    },
    dancingBaby: {
      url: 'assets/dancing-baby.gif',
      width: 80,
      height: 120
    },
    spinningLogo: {
      url: 'assets/spinning-logo.gif',
      width: 64,
      height: 64
    },
    pixelArt: {
      url: 'assets/pixel-art.gif',
      width: 96,
      height: 96
    }
  },
  backgrounds: {
    // Image-based backgrounds (existing)
    stars: {
      url: 'assets/stars-bg.gif',
      tileSize: 256
    },
    glitter: {
      url: 'assets/glitter-bg.gif',
      tileSize: 128
    },
    gradient: {
      url: 'assets/gradient-bg.gif',
      tileSize: 512
    },
    geometric: {
      url: 'assets/geometric-bg.gif',
      tileSize: 200
    },
    neonGrid: {
      url: 'assets/neon-grid-bg.gif',
      tileSize: 256
    },
    pixel: {
      url: 'assets/pixel-bg.gif',
      tileSize: 64
    },
    vhsScanlines: {
      url: 'assets/vhs-scanlines-bg.gif',
      tileSize: 512
    },
    stickerPattern: {
      url: 'assets/sticker-pattern-bg.gif',
      tileSize: 300
    },
    
    // CSS-generated backgrounds (new - Geocities Chaos theme)
    checkerboard: {
      css: 'repeating-conic-gradient(#ff00ff 0% 25%, #00ffff 0% 50%) 50% / 40px 40px',
      tileSize: 40
    },
    diagonalStripes: {
      css: 'repeating-linear-gradient(45deg, #ff1493 0px, #ff1493 10px, #ffd700 10px, #ffd700 20px)',
      tileSize: 20
    },
    polkaDots: {
      css: 'radial-gradient(circle, #ff69b4 25%, transparent 25%), radial-gradient(circle, #ff69b4 25%, transparent 25%)',
      cssSize: '20px 20px',
      cssPosition: '0 0, 10px 10px',
      tileSize: 20
    },
    rainbowWaves: {
      css: 'repeating-linear-gradient(0deg, #ff0000 0px, #ff7f00 50px, #ffff00 100px, #00ff00 150px, #0000ff 200px, #4b0082 250px, #9400d3 300px)',
      tileSize: 300
    },
    hearts: {
      css: 'radial-gradient(ellipse at 25% 40%, #ff1493 0%, #ff1493 40%, transparent 40%), radial-gradient(ellipse at 75% 40%, #ff1493 0%, #ff1493 40%, transparent 40%), linear-gradient(135deg, transparent 48%, #ff1493 48%, #ff1493 52%, transparent 52%)',
      cssSize: '30px 30px',
      tileSize: 30
    },
    
    // CSS-generated backgrounds (Neon Cyber theme)
    cyberGrid: {
      css: 'linear-gradient(0deg, transparent 24%, rgba(0, 255, 0, 0.3) 25%, rgba(0, 255, 0, 0.3) 26%, transparent 27%, transparent 74%, rgba(0, 255, 0, 0.3) 75%, rgba(0, 255, 0, 0.3) 76%, transparent 77%), linear-gradient(90deg, transparent 24%, rgba(0, 255, 0, 0.3) 25%, rgba(0, 255, 0, 0.3) 26%, transparent 27%, transparent 74%, rgba(0, 255, 0, 0.3) 75%, rgba(0, 255, 0, 0.3) 76%, transparent 77%)',
      cssSize: '50px 50px',
      tileSize: 50
    },
    neonHex: {
      css: 'radial-gradient(circle at 50% 50%, transparent 40%, #00ff00 40%, #00ff00 42%, transparent 42%)',
      cssSize: '60px 60px',
      tileSize: 60
    },
    circuitBoard: {
      css: 'linear-gradient(90deg, #0f0 1px, transparent 1px), linear-gradient(0deg, #0f0 1px, transparent 1px), linear-gradient(90deg, #0f0 2px, transparent 2px) 25px 25px, linear-gradient(0deg, #0f0 2px, transparent 2px) 25px 25px',
      cssSize: '50px 50px',
      tileSize: 50
    },
    matrixRain: {
      css: 'repeating-linear-gradient(0deg, #001100 0px, #003300 2px, #001100 4px)',
      tileSize: 4
    },
    digitalCamo: {
      css: 'repeating-conic-gradient(from 45deg at 10% 50%, #00ff00 0deg 90deg, #003300 90deg 180deg, #00ff00 180deg 270deg, #006600 270deg 360deg)',
      cssSize: '80px 80px',
      tileSize: 80
    },
    
    // CSS-generated backgrounds (Pixel Arcade theme)
    pixelCheckers: {
      css: 'repeating-conic-gradient(#ff0000 0% 25%, #ffff00 0% 50%) 50% / 16px 16px',
      tileSize: 16
    },
    arcadeCarpet: {
      css: 'repeating-linear-gradient(45deg, #ff00ff 0px, #ff00ff 8px, #00ffff 8px, #00ffff 16px, #ffff00 16px, #ffff00 24px)',
      tileSize: 24
    },
    pixelDots: {
      css: 'radial-gradient(circle, #ff0000 20%, transparent 20%), radial-gradient(circle, #00ff00 20%, transparent 20%), radial-gradient(circle, #0000ff 20%, transparent 20%)',
      cssSize: '12px 12px',
      cssPosition: '0 0, 6px 6px, 12px 0',
      tileSize: 12
    },
    retroBlocks: {
      css: 'linear-gradient(90deg, #ff0000 25%, #00ff00 25%, #00ff00 50%, #0000ff 50%, #0000ff 75%, #ffff00 75%)',
      cssSize: '32px 32px',
      tileSize: 32
    },
    eightBitGrid: {
      css: 'linear-gradient(0deg, #000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
      cssSize: '8px 8px',
      tileSize: 8
    },
    
    // CSS-generated backgrounds (VHS Glitch theme)
    scanlines: {
      css: 'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.15) 0px, rgba(0, 0, 0, 0.15) 1px, transparent 1px, transparent 2px)',
      tileSize: 2
    },
    vhsNoise: {
      css: 'repeating-linear-gradient(90deg, rgba(255, 0, 128, 0.1) 0px, rgba(0, 255, 170, 0.1) 1px, rgba(255, 0, 128, 0.1) 2px)',
      tileSize: 2
    },
    glitchBars: {
      css: 'repeating-linear-gradient(0deg, #ff0080 0px, #ff0080 20px, #00ffaa 20px, #00ffaa 40px, #ff0080 40px, #ff0080 60px)',
      tileSize: 60
    },
    analogStatic: {
      css: 'repeating-radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05) 0px, rgba(0, 0, 0, 0.05) 1px, rgba(255, 255, 255, 0.05) 2px)',
      tileSize: 2
    },
    chromaAberration: {
      css: 'linear-gradient(90deg, rgba(255, 0, 0, 0.1) 0%, rgba(0, 255, 0, 0.1) 50%, rgba(0, 0, 255, 0.1) 100%)',
      cssSize: '100% 100%',
      tileSize: 100
    },
    
    // CSS-generated backgrounds (Stickerbomb theme)
    confetti: {
      css: 'radial-gradient(circle, #ff0000 10%, transparent 10%), radial-gradient(circle, #00ff00 10%, transparent 10%), radial-gradient(circle, #0000ff 10%, transparent 10%), radial-gradient(circle, #ffff00 10%, transparent 10%), radial-gradient(circle, #ff00ff 10%, transparent 10%)',
      cssSize: '40px 40px',
      cssPosition: '0 0, 20px 20px, 10px 30px, 30px 10px, 15px 15px',
      tileSize: 40
    },
    stickerGrid: {
      css: 'repeating-linear-gradient(45deg, #ff6600 0px, #ff6600 10px, #ffff00 10px, #ffff00 20px, #00ff00 20px, #00ff00 30px, #00ffff 30px, #00ffff 40px)',
      tileSize: 40
    },
    bubbleGum: {
      css: 'radial-gradient(circle at 30% 30%, #ff69b4 0%, #ff69b4 30%, transparent 30%), radial-gradient(circle at 70% 70%, #ffd700 0%, #ffd700 25%, transparent 25%)',
      cssSize: '50px 50px',
      tileSize: 50
    },
    rainbowDiagonal: {
      css: 'repeating-linear-gradient(135deg, #ff0000 0px, #ff7f00 20px, #ffff00 40px, #00ff00 60px, #0000ff 80px, #4b0082 100px, #9400d3 120px)',
      tileSize: 120
    },
    maximalistDots: {
      css: 'radial-gradient(circle, #ff0000 15%, transparent 15%), radial-gradient(circle, #ff7f00 15%, transparent 15%), radial-gradient(circle, #ffff00 15%, transparent 15%), radial-gradient(circle, #00ff00 15%, transparent 15%)',
      cssSize: '25px 25px',
      cssPosition: '0 0, 12px 12px, 6px 18px, 18px 6px',
      tileSize: 25
    },
    
    // CSS-generated backgrounds (Windows 95/98 theme)
    win95Teal: {
      css: 'linear-gradient(135deg, #008080 0%, #008080 100%)',
      cssSize: '100% 100%',
      tileSize: 100
    },
    win95Gray: {
      css: 'linear-gradient(135deg, #c0c0c0 0%, #c0c0c0 100%)',
      cssSize: '100% 100%',
      tileSize: 100
    },
    win95Desktop: {
      css: 'repeating-linear-gradient(45deg, #008080 0px, #008080 2px, #006666 2px, #006666 4px)',
      tileSize: 4
    },
    win95Clouds: {
      css: 'radial-gradient(ellipse at 30% 40%, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.3) 30%, transparent 30%), radial-gradient(ellipse at 70% 60%, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.2) 40%, transparent 40%)',
      cssSize: '200px 200px',
      tileSize: 200
    },
    win95Bricks: {
      css: 'repeating-linear-gradient(0deg, #808080 0px, #808080 20px, #a0a0a0 20px, #a0a0a0 22px), repeating-linear-gradient(90deg, #808080 0px, #808080 40px, #a0a0a0 40px, #a0a0a0 42px)',
      cssSize: '80px 40px',
      tileSize: 40
    },
    win95Tiles: {
      css: 'repeating-conic-gradient(#c0c0c0 0% 25%, #808080 0% 50%) 50% / 20px 20px',
      tileSize: 20
    },
    win95Weave: {
      css: 'linear-gradient(45deg, #808080 25%, transparent 25%, transparent 75%, #808080 75%), linear-gradient(-45deg, #808080 25%, transparent 25%, transparent 75%, #808080 75%)',
      cssSize: '20px 20px',
      tileSize: 20
    },
    win95Plaid: {
      css: 'repeating-linear-gradient(90deg, #008080 0px, #008080 10px, #006666 10px, #006666 20px), repeating-linear-gradient(0deg, transparent 0px, transparent 10px, rgba(0, 102, 102, 0.5) 10px, rgba(0, 102, 102, 0.5) 20px)',
      cssSize: '20px 20px',
      tileSize: 20
    },
    win95Boxes: {
      css: 'linear-gradient(135deg, #c0c0c0 25%, transparent 25%), linear-gradient(225deg, #c0c0c0 25%, transparent 25%), linear-gradient(45deg, #c0c0c0 25%, transparent 25%), linear-gradient(315deg, #c0c0c0 25%, #808080 25%)',
      cssSize: '40px 40px',
      tileSize: 40
    },
    win95Grid: {
      css: 'linear-gradient(0deg, #808080 1px, transparent 1px), linear-gradient(90deg, #808080 1px, transparent 1px)',
      cssSize: '20px 20px',
      tileSize: 20
    },

    // CSS-generated backgrounds (Vaporwave theme)
    vaporwaveGrid: {
      css: 'linear-gradient(0deg, #ff71ce 1px, transparent 1px), linear-gradient(90deg, #ff71ce 1px, transparent 1px), linear-gradient(180deg, #2d1b4e 0%, #1a0a2e 100%)',
      cssSize: '40px 40px, 40px 40px, 100% 100%',
      tileSize: 40
    },
    vaporwaveSunset: {
      css: 'linear-gradient(180deg, #ff71ce 0%, #b967ff 25%, #05ffa1 50%, #01cdfe 75%, #fffb96 100%)',
      cssSize: '100% 100%',
      tileSize: 100
    },
    vaporwavePalm: {
      css: 'linear-gradient(180deg, #2d1b4e 0%, #ff71ce 50%, #01cdfe 100%)',
      cssSize: '100% 100%',
      tileSize: 100
    },
    vaporwaveWaves: {
      css: 'repeating-linear-gradient(0deg, transparent 0px, transparent 20px, rgba(255, 113, 206, 0.3) 20px, rgba(255, 113, 206, 0.3) 22px), linear-gradient(180deg, #2d1b4e 0%, #1a0a2e 100%)',
      cssSize: '100% 100%',
      tileSize: 22
    },
    vaporwaveStars: {
      css: 'radial-gradient(circle, #ffffff 1px, transparent 1px), radial-gradient(circle, #ff71ce 1px, transparent 1px), linear-gradient(180deg, #0d0221 0%, #2d1b4e 100%)',
      cssSize: '50px 50px, 30px 30px, 100% 100%',
      cssPosition: '0 0, 25px 25px, 0 0',
      tileSize: 50
    }
  },
  cursors: {
    sparkle: {
      url: 'assets/sparkle-cursor.png',
      hotspot: [8, 8]
    },
    rainbow: {
      url: 'assets/rainbow-cursor.png',
      hotspot: [8, 8]
    },
    animated: {
      url: 'assets/animated-cursor.png',
      hotspot: [8, 8]
    },
    neonPointer: {
      url: 'assets/neon-pointer-cursor.png',
      hotspot: [4, 4]
    },
    pixelHand: {
      url: 'assets/pixel-hand-cursor.png',
      hotspot: [8, 8]
    },
    glitchCursor: {
      url: 'assets/glitch-cursor.png',
      hotspot: [8, 8]
    },
    stickerCursor: {
      url: 'assets/sticker-cursor.png',
      hotspot: [8, 8]
    },
    win95Arrow: {
      url: 'assets/win95-arrow-cursor.png',
      hotspot: [0, 0]
    },
    vaporwaveCursor: {
      url: 'assets/vaporwave-cursor.png',
      hotspot: [8, 8]
    }
  },
  stickers: {
    netscapeBadge: {
      url: 'assets/netscape-badge.gif',
      width: 88,
      height: 31
    },
    awardRibbon: {
      url: 'assets/award-ribbon.gif',
      width: 100,
      height: 100
    }
  }
};
