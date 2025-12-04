// CDN GIF Registry - Uses Supabase Storage CDN
// This replaces local GIF assets with CDN-hosted GIFs from the RetroWeb Builder

export interface CdnGif {
  id: string;
  name: string;
  category: 'animation' | 'button' | 'decoration';
  themes: string[];
  tags: string[];
  url: string; // Full CDN URL
  width?: number;
  height?: number;
}

// Supabase Storage CDN base URL
const CDN_BASE_URL = 'https://xsuxxzzsqfvyvqyxswme.supabase.co/storage/v1/object/public/retro-gifs';

/**
 * Helper to create CDN GIF URL
 */
function cdnUrl(path: string): string {
  return `${CDN_BASE_URL}/${path}`;
}

/**
 * CDN GIF Library - Curated selection for extension
 * Using the most popular and theme-appropriate GIFs from the builder
 */
export const cdnGifLibrary: CdnGif[] = [
  // ANIMATIONS - Popular badges and indicators
  {
    id: 'under-construction',
    name: 'Under Construction',
    category: 'animation',
    themes: ['geocities-chaos', 'all'],
    tags: ['construction', 'wip', 'building'],
    url: cdnUrl('animations/under-construction.gif'),
  },
  {
    id: 'under-construction2',
    name: 'Under Construction 2',
    category: 'animation',
    themes: ['geocities-chaos', 'all'],
    tags: ['construction', 'wip'],
    url: cdnUrl('animations/under-construction2.gif'),
  },
  {
    id: 'new',
    name: 'New',
    category: 'animation',
    themes: ['geocities-chaos', 'all'],
    tags: ['new', 'badge', 'announcement'],
    url: cdnUrl('animations/new.gif'),
  },
  {
    id: 'new2',
    name: 'New 2',
    category: 'animation',
    themes: ['geocities-chaos', 'all'],
    tags: ['new', 'badge', 'fresh'],
    url: cdnUrl('animations/new2.gif'),
  },
  {
    id: 'hot',
    name: 'Hot',
    category: 'animation',
    themes: ['geocities-chaos', 'all'],
    tags: ['hot', 'fire', 'popular'],
    url: cdnUrl('animations/hot.gif'),
  },
  {
    id: 'cool',
    name: 'Cool',
    category: 'animation',
    themes: ['geocities-chaos', 'all'],
    tags: ['cool', 'badge', 'awesome'],
    url: cdnUrl('animations/cool.gif'),
  },
  {
    id: 'email',
    name: 'Email',
    category: 'animation',
    themes: ['all'],
    tags: ['email', 'mail', 'contact'],
    url: cdnUrl('animations/email.gif'),
  },
  {
    id: 'email-geocities',
    name: 'Email Geocities',
    category: 'animation',
    themes: ['geocities-chaos'],
    tags: ['email', 'mail', 'contact'],
    url: cdnUrl('animations/email-geocities.gif'),
  },
  {
    id: 'email-vaporwave',
    name: 'Email Vaporwave',
    category: 'animation',
    themes: ['vaporwave'],
    tags: ['email', 'mail', 'aesthetic'],
    url: cdnUrl('animations/email-vaporwave.gif'),
  },
  {
    id: 'loading-vaporwave',
    name: 'Loading Vaporwave',
    category: 'animation',
    themes: ['vaporwave'],
    tags: ['loading', 'spinner', 'wait'],
    url: cdnUrl('animations/loading-vaporwave.gif'),
  },
  {
    id: 'loading-vhs',
    name: 'Loading VHS',
    category: 'animation',
    themes: ['vhs-glitch'],
    tags: ['loading', 'vhs', 'retro'],
    url: cdnUrl('animations/loading-vhs.gif'),
  },
  {
    id: 'loading-windowstheme',
    name: 'Loading Windows',
    category: 'animation',
    themes: ['windows-95'],
    tags: ['loading', 'windows', 'hourglass'],
    url: cdnUrl('animations/loading-windowstheme.gif'),
  },

  // DECORATIONS - Classic retro elements
  {
    id: 'dancing-baby',
    name: 'Dancing Baby',
    category: 'decoration',
    themes: ['geocities-chaos', 'all'],
    tags: ['dance', 'baby', 'classic', 'famous'],
    url: cdnUrl('decorations/dancing-baby.gif'),
  },
  {
    id: 'smiley',
    name: 'Smiley',
    category: 'decoration',
    themes: ['geocities-chaos', 'all'],
    tags: ['smiley', 'happy', 'face'],
    url: cdnUrl('decorations/smiley.gif'),
  },
  {
    id: 'heart',
    name: 'Heart',
    category: 'decoration',
    themes: ['all'],
    tags: ['heart', 'love', 'romance'],
    url: cdnUrl('decorations/heart.gif'),
  },
  {
    id: 'flower',
    name: 'Flower',
    category: 'decoration',
    themes: ['geocities-chaos', 'all'],
    tags: ['flower', 'nature', 'plant'],
    url: cdnUrl('decorations/flower.gif'),
  },
  {
    id: 'flower-vaporwave',
    name: 'Flower Vaporwave',
    category: 'decoration',
    themes: ['vaporwave'],
    tags: ['flower', 'aesthetic', 'nature'],
    url: cdnUrl('decorations/flower-vaporwave.gif'),
  },
  {
    id: 'spinning',
    name: 'Spinning',
    category: 'decoration',
    themes: ['geocities-chaos', 'all'],
    tags: ['spinning', 'rotate', 'animation'],
    url: cdnUrl('decorations/spinning.gif'),
  },
  {
    id: 'ribbons',
    name: 'Ribbons',
    category: 'decoration',
    themes: ['geocities-chaos', 'all'],
    tags: ['ribbon', 'decoration', 'award'],
    url: cdnUrl('decorations/ribbons.gif'),
  },
  {
    id: 'colorful-spinner',
    name: 'Colorful Spinner',
    category: 'decoration',
    themes: ['geocities-chaos', 'vaporwave'],
    tags: ['spinner', 'loading', 'colorful'],
    url: cdnUrl('decorations/colorful-spinner.gif'),
  },

  // BUTTONS - Navigation and interaction
  {
    id: 'click-here-button',
    name: 'Click Here',
    category: 'button',
    themes: ['geocities-chaos', 'all'],
    tags: ['click', 'button', 'cta'],
    url: cdnUrl('buttons/click-here-button.gif'),
  },
  {
    id: 'home-button',
    name: 'Home',
    category: 'button',
    themes: ['all'],
    tags: ['home', 'button', 'navigation'],
    url: cdnUrl('buttons/home-button.gif'),
  },
  {
    id: 'back-button',
    name: 'Back',
    category: 'button',
    themes: ['all'],
    tags: ['back', 'navigation', 'return'],
    url: cdnUrl('buttons/back-button.gif'),
  },
  {
    id: 'next-button',
    name: 'Next',
    category: 'button',
    themes: ['all'],
    tags: ['next', 'button', 'forward'],
    url: cdnUrl('buttons/next-button.gif'),
  },
  {
    id: 'back-button-vaporwave',
    name: 'Back Vaporwave',
    category: 'button',
    themes: ['vaporwave'],
    tags: ['back', 'navigation', 'aesthetic'],
    url: cdnUrl('buttons/back-button-vaporwave.gif'),
  },
  {
    id: 'menu-button-windows',
    name: 'Menu Windows',
    category: 'button',
    themes: ['windows-95'],
    tags: ['menu', 'button', 'windows'],
    url: cdnUrl('buttons/menu-button-windows.gif'),
  },
];

/**
 * Get GIFs by theme
 */
export function getCdnGifsByTheme(theme: string): CdnGif[] {
  return cdnGifLibrary.filter(gif => 
    gif.themes.includes(theme) || gif.themes.includes('all')
  );
}

/**
 * Get GIFs by category
 */
export function getCdnGifsByCategory(category: CdnGif['category']): CdnGif[] {
  return cdnGifLibrary.filter(gif => gif.category === category);
}

/**
 * Get random GIFs for a theme
 */
export function getRandomCdnGifs(theme: string, count: number = 5): CdnGif[] {
  const themeGifs = getCdnGifsByTheme(theme);
  const shuffled = [...themeGifs].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Get GIF by ID
 */
export function getCdnGifById(id: string): CdnGif | undefined {
  return cdnGifLibrary.find(gif => gif.id === id);
}

/**
 * Search GIFs by tags or name
 */
export function searchCdnGifs(query: string): CdnGif[] {
  const lowerQuery = query.toLowerCase();
  return cdnGifLibrary.filter(gif =>
    gif.tags.some(tag => tag.includes(lowerQuery)) ||
    gif.name.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Map old local asset IDs to CDN GIF IDs
 * This helps maintain compatibility with existing theme configurations
 */
export const assetToCdnMapping: Record<string, string> = {
  'construction': 'under-construction',
  'dancingBaby': 'dancing-baby',
  'spinningLogo': 'spinning',
  'pixelArt': 'colorful-spinner',
};

/**
 * Get CDN GIF URL from old asset ID
 */
export function getCdnUrlFromAssetId(assetId: string): string | undefined {
  const cdnId = assetToCdnMapping[assetId] || assetId;
  const gif = getCdnGifById(cdnId);
  return gif?.url;
}
