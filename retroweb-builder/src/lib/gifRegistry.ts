// Retro GIF Library Registry - Complete Collection (92 GIFs)
// All GIFs uploaded to Supabase Storage and accessible via CDN

export interface RetroGif {
  id: string;
  name: string;
  category: 'animation' | 'button' | 'decoration';
  themes: string[];
  tags: string[];
  path: string;
  width: number;
  height: number;
  fileSize: number;
  description?: string;
}

// Helper to create GIF entries quickly
const gif = (
  id: string,
  name: string,
  category: 'animation' | 'button' | 'decoration',
  themes: string[],
  tags: string[],
  path: string,
  fileSize: number,
  description = ''
): RetroGif => ({
  id, name, category, themes, tags, path,
  width: 0, // Update with actual dimensions if needed
  height: 0, // Update with actual dimensions if needed
  fileSize, description
});

export const gifLibrary: RetroGif[] = [
  // ANIMATIONS (42 GIFs)
  gif('angel-award', 'Angel Award', 'animation', ['geocities-chaos', 'all'], ['award', 'angel', 'badge'], 'animations/angel-award.gif', 3878),
  gif('arrow', 'Arrow', 'animation', ['all'], ['arrow', 'pointer', 'direction'], 'animations/arrow.gif', 1353),
  gif('awards', 'Awards', 'animation', ['geocities-chaos', 'all'], ['award', 'trophy', 'winner'], 'animations/awards.gif', 7381),
  gif('bew4-large-gif', 'Best of Web', 'animation', ['geocities-chaos'], ['award', 'best', 'web'], 'animations/bew4-large-gif.gif', 15657),
  gif('cool', 'Cool', 'animation', ['geocities-chaos', 'all'], ['cool', 'badge', 'awesome'], 'animations/cool.gif', 4517),
  gif('cool2', 'Cool 2', 'animation', ['geocities-chaos', 'vaporwave'], ['cool', 'badge'], 'animations/cool2.gif', 5223),
  gif('email-geocities', 'Email Geocities', 'animation', ['geocities-chaos'], ['email', 'mail', 'contact'], 'animations/email-geocities.gif', 18506),
  gif('email-vaporwave', 'Email Vaporwave', 'animation', ['vaporwave'], ['email', 'mail', 'aesthetic'], 'animations/email-vaporwave.gif', 30988),
  gif('email-vaporwave2', 'Email Vaporwave 2', 'animation', ['vaporwave'], ['email', 'mail'], 'animations/email-vaporwave2.gif', 9282),
  gif('email', 'Email', 'animation', ['all'], ['email', 'mail', 'contact'], 'animations/email.gif', 1353),
  gif('email2', 'Email 2', 'animation', ['geocities-chaos'], ['email', 'mail'], 'animations/email2.gif', 56287),
  gif('email3', 'Email 3', 'animation', ['all'], ['email', 'mail'], 'animations/email3.gif', 7711),
  gif('email4-windowstheme', 'Email Windows', 'animation', ['windows-95'], ['email', 'mail', 'windows'], 'animations/email4-windowstheme.gif', 181705),
  gif('hot', 'Hot', 'animation', ['geocities-chaos', 'all'], ['hot', 'fire', 'popular'], 'animations/hot.gif', 122670),
  gif('left-arrow', 'Left Arrow', 'animation', ['all'], ['arrow', 'left', 'back', 'navigation'], 'animations/left-arrow.gif', 3332),
  gif('loading-vaporwave', 'Loading Vaporwave', 'animation', ['vaporwave'], ['loading', 'spinner', 'wait'], 'animations/loading-vaporwave.gif', 22087),
  gif('loading-vhs', 'Loading VHS', 'animation', ['vhs-glitch'], ['loading', 'vhs', 'retro'], 'animations/loading-vhs.gif', 4771),
  gif('loading-vhs2', 'Loading VHS 2', 'animation', ['vhs-glitch'], ['loading', 'vhs'], 'animations/loading-vhs2.gif', 14026),
  gif('loading-windowstheme', 'Loading Windows', 'animation', ['windows-95'], ['loading', 'windows', 'hourglass'], 'animations/loading-windowstheme.gif', 12474),
  gif('mail', 'Mail', 'animation', ['all'], ['mail', 'email', 'letter'], 'animations/mail.gif', 5565),
  gif('mail2', 'Mail 2', 'animation', ['geocities-chaos'], ['mail', 'email'], 'animations/mail2.gif', 38278),
  gif('new', 'New', 'animation', ['geocities-chaos', 'all'], ['new', 'badge', 'announcement'], 'animations/new.gif', 2546),
  gif('new2', 'New 2', 'animation', ['geocities-chaos', 'all'], ['new', 'badge', 'fresh'], 'animations/new2.gif', 55035),
  gif('new3-cyber', 'New Cyber', 'animation', ['neon-cyber-2001'], ['new', 'cyber', 'badge'], 'animations/new3-cyber.gif', 9281),
  gif('right-arrow', 'Right Arrow', 'animation', ['all'], ['arrow', 'right', 'next', 'navigation'], 'animations/right-arrow.gif', 3319),
  gif('sign-button', 'Sign Button', 'animation', ['geocities-chaos'], ['sign', 'guestbook', 'button'], 'animations/sign-button.gif', 18061),
  gif('thankyou', 'Thank You', 'animation', ['all'], ['thanks', 'thankyou', 'gratitude'], 'animations/thankyou.gif', 3810),
  gif('thankyou2', 'Thank You 2', 'animation', ['geocities-chaos'], ['thanks', 'thankyou'], 'animations/thankyou2.gif', 12428),
  gif('under-construction', 'Under Construction', 'animation', ['geocities-chaos', 'all'], ['construction', 'wip', 'building'], 'animations/under-construction.gif', 23919),
  gif('under-construction2', 'Under Construction 2', 'animation', ['geocities-chaos', 'all'], ['construction', 'wip'], 'animations/under-construction2.gif', 13806),
  gif('under-construction3', 'Under Construction 3', 'animation', ['geocities-chaos', 'all'], ['construction', 'wip'], 'animations/under-construction3.gif', 5318),
  gif('update-coolgirls', 'Update Cool', 'animation', ['geocities-chaos'], ['update', 'cool', 'badge'], 'animations/update-coolgirls.gif', 7818),
  gif('updated-geocities', 'Updated Geocities', 'animation', ['geocities-chaos'], ['updated', 'new', 'fresh'], 'animations/updated-geocities.gif', 5223),
  gif('updated-neoncyber', 'Updated Cyber', 'animation', ['neon-cyber-2001'], ['updated', 'cyber', 'new'], 'animations/updated-neoncyber.gif', 577),
  gif('updated', 'Updated', 'animation', ['all'], ['updated', 'new', 'fresh'], 'animations/updated.gif', 7381),
  gif('welcome-geocities', 'Welcome Geocities', 'animation', ['geocities-chaos'], ['welcome', 'greeting', 'hello'], 'animations/welcome-geocities.gif', 15657),
  gif('welcome-geocities2', 'Welcome Geocities 2', 'animation', ['geocities-chaos'], ['welcome', 'greeting'], 'animations/welcome-geocities2.gif', 18506),
  gif('welcome-geocities3', 'Welcome Geocities 3', 'animation', ['geocities-chaos'], ['welcome', 'greeting'], 'animations/welcome-geocities3.gif', 85837),
  gif('welcome-to-hell', 'Welcome to Hell', 'animation', ['geocities-chaos'], ['welcome', 'hell', 'edgy'], 'animations/welcome-to-hell.gif', 35844),
  gif('welcome-vaporwave', 'Welcome Vaporwave', 'animation', ['vaporwave'], ['welcome', 'aesthetic', 'greeting'], 'animations/welcome-vaporwave.gif', 30988),
  gif('winner2', 'Winner', 'animation', ['geocities-chaos', 'all'], ['winner', 'award', 'champion'], 'animations/winner2.gif', 28908),
  gif('winners', 'Winners', 'animation', ['geocities-chaos', 'all'], ['winner', 'trophy', 'award'], 'animations/winners.gif', 15355),

  // BUTTONS (25 GIFs)
  gif('back-button-geocities', 'Back Geocities', 'button', ['geocities-chaos'], ['back', 'navigation', 'button'], 'buttons/back-button-geocities.gif', 12142),
  gif('back-button-neoncyber', 'Back Cyber', 'button', ['neon-cyber-2001'], ['back', 'navigation', 'cyber'], 'buttons/back-button-neoncyber.gif', 10129),
  gif('back-button-vaporwave', 'Back Vaporwave', 'button', ['vaporwave'], ['back', 'navigation', 'aesthetic'], 'buttons/back-button-vaporwave.gif', 31917),
  gif('back-button', 'Back', 'button', ['all'], ['back', 'navigation', 'return'], 'buttons/back-button.gif', 68536),
  gif('blue-button', 'Blue Button', 'button', ['all'], ['button', 'blue', 'click'], 'buttons/blue-button.gif', 4517),
  gif('click-here-banner', 'Click Here Banner', 'button', ['geocities-chaos'], ['click', 'banner', 'cta'], 'buttons/click-here-banner.gif', 165327),
  gif('click-here-button', 'Click Here', 'button', ['geocities-chaos', 'all'], ['click', 'button', 'cta'], 'buttons/click-here-button.gif', 4777),
  gif('download-button', 'Download', 'button', ['all'], ['download', 'button', 'save'], 'buttons/download-button.gif', 8990),
  gif('download-button2', 'Download 2', 'button', ['geocities-chaos'], ['download', 'button'], 'buttons/download-button2.gif', 26733),
  gif('dowwnload-screen', 'Download Screen', 'button', ['windows-95'], ['download', 'windows', 'screen'], 'buttons/dowwnload-screen.gif', 58193),
  gif('enter-button', 'Enter', 'button', ['all'], ['enter', 'button', 'go'], 'buttons/enter-button.gif', 7557),
  gif('home-button', 'Home', 'button', ['all'], ['home', 'button', 'navigation'], 'buttons/home-button.gif', 2201),
  gif('home-button2', 'Home 2', 'button', ['all'], ['home', 'button'], 'buttons/home-button2.gif', 2754),
  gif('links-button-vaporwave', 'Links Vaporwave', 'button', ['vaporwave'], ['links', 'button', 'aesthetic'], 'buttons/links-button-vaporwave.gif', 7098),
  gif('links-button', 'Links', 'button', ['all'], ['links', 'button', 'navigation'], 'buttons/links-button.gif', 8821),
  gif('menu-buton-vaporwave', 'Menu Vaporwave', 'button', ['vaporwave'], ['menu', 'button', 'aesthetic'], 'buttons/menu-buton-vaporwave.gif', 9822),
  gif('menu-button-windows', 'Menu Windows', 'button', ['windows-95'], ['menu', 'button', 'windows'], 'buttons/menu-button-windows.gif', 2868),
  gif('menu-button', 'Menu', 'button', ['all'], ['menu', 'button', 'navigation'], 'buttons/menu-button.gif', 5068),
  gif('next-button-vaporwave', 'Next Vaporwave', 'button', ['vaporwave'], ['next', 'button', 'aesthetic'], 'buttons/next-button-vaporwave.gif', 4336),
  gif('next-button', 'Next', 'button', ['all'], ['next', 'button', 'forward'], 'buttons/next-button.gif', 3685),
  gif('next-button2', 'Next 2', 'button', ['all'], ['next', 'button'], 'buttons/next-button2.gif', 802),
  gif('play-button-neoncyber', 'Play Cyber', 'button', ['neon-cyber-2001'], ['play', 'button', 'cyber'], 'buttons/play-button-neoncyber.gif', 3302),
  gif('playback-button', 'Playback', 'button', ['vhs-glitch'], ['play', 'button', 'vhs'], 'buttons/playback-button.gif', 33592),
  gif('submit-button', 'Submit', 'button', ['all'], ['submit', 'button', 'send'], 'buttons/submit-button.gif', 2513),
  gif('submit-button2', 'Submit 2', 'button', ['all'], ['submit', 'button'], 'buttons/submit-button2.gif', 2658),

  // DECORATIONS (25 GIFs)
  gif('4th-of-july-banner', '4th of July', 'decoration', ['geocities-chaos'], ['banner', 'july', 'america', 'holiday'], 'decorations/4th-of-july-banner.gif', 60058),
  gif('binary-divider', 'Binary Divider', 'decoration', ['neon-cyber-2001'], ['divider', 'binary', 'cyber', 'line'], 'decorations/binary-divider.gif', 20371),
  gif('boring-site-divider', 'Boring Site', 'decoration', ['geocities-chaos'], ['divider', 'funny', 'line'], 'decorations/boring-site-divider.gif', 16949),
  gif('colorful-spinner', 'Colorful Spinner', 'decoration', ['geocities-chaos', 'vaporwave'], ['spinner', 'loading', 'colorful'], 'decorations/colorful-spinner.gif', 33539),
  gif('computer-laughing', 'Computer Laughing', 'decoration', ['geocities-chaos'], ['computer', 'funny', 'laugh'], 'decorations/computer-laughing.gif', 46091),
  gif('couple-dance', 'Couple Dancing', 'decoration', ['geocities-chaos'], ['dance', 'couple', 'people'], 'decorations/couple-dance.gif', 29341),
  gif('dancing-baby', 'Dancing Baby', 'decoration', ['geocities-chaos', 'all'], ['dance', 'baby', 'classic', 'famous'], 'decorations/dancing-baby.gif', 201207),
  gif('dog-walking-banner', 'Dog Walking', 'decoration', ['geocities-chaos'], ['dog', 'banner', 'animal'], 'decorations/dog-walking-banner.gif', 43490),
  gif('flower-vaporwave', 'Flower Vaporwave', 'decoration', ['vaporwave'], ['flower', 'aesthetic', 'nature'], 'decorations/flower-vaporwave.gif', 14056),
  gif('flower', 'Flower', 'decoration', ['geocities-chaos', 'all'], ['flower', 'nature', 'plant'], 'decorations/flower.gif', 10477),
  gif('footer-divider', 'Footer Divider', 'decoration', ['all'], ['divider', 'footer', 'line'], 'decorations/footer-divider.gif', 52197),
  gif('girl-danace', 'Girl Dancing', 'decoration', ['geocities-chaos'], ['dance', 'girl', 'people'], 'decorations/girl-danace.gif', 94498),
  gif('happy new year', 'Happy New Year', 'decoration', ['geocities-chaos'], ['newyear', 'holiday', 'celebration'], 'decorations/happy new year.gif', 116802),
  gif('heart', 'Heart', 'decoration', ['all'], ['heart', 'love', 'romance'], 'decorations/heart.gif', 3727),
  gif('heart2', 'Heart 2', 'decoration', ['geocities-chaos'], ['heart', 'love'], 'decorations/heart2.gif', 27711),
  gif('hearts-banner', 'Hearts Banner', 'decoration', ['geocities-chaos'], ['heart', 'banner', 'love'], 'decorations/hearts-banner.gif', 2650),
  gif('neoncyber-divider', 'Neon Divider', 'decoration', ['neon-cyber-2001'], ['divider', 'neon', 'cyber', 'line'], 'decorations/neoncyber-divider.gif', 4488),
  gif('newspaper-boy', 'Newspaper Boy', 'decoration', ['geocities-chaos'], ['newspaper', 'boy', 'retro'], 'decorations/newspaper-boy.gif', 48363),
  gif('respect-banner-small', 'Respect Banner', 'decoration', ['geocities-chaos'], ['respect', 'banner', 'badge'], 'decorations/respect-banner-small.gif', 2640),
  gif('ribbons', 'Ribbons', 'decoration', ['geocities-chaos', 'all'], ['ribbon', 'decoration', 'award'], 'decorations/ribbons.gif', 34915),
  gif('smiley-banner', 'Smiley Banner', 'decoration', ['geocities-chaos'], ['smiley', 'banner', 'happy'], 'decorations/smiley-banner.gif', 6628),
  gif('smiley', 'Smiley', 'decoration', ['geocities-chaos', 'all'], ['smiley', 'happy', 'face'], 'decorations/smiley.gif', 4134),
  gif('spinning', 'Spinning', 'decoration', ['geocities-chaos', 'all'], ['spinning', 'rotate', 'animation'], 'decorations/spinning.gif', 99194),
  gif('spinning2', 'Spinning 2', 'decoration', ['geocities-chaos'], ['spinning', 'rotate'], 'decorations/spinning2.gif', 81192),
  gif('winner-banner', 'Winner Banner', 'decoration', ['geocities-chaos'], ['winner', 'banner', 'award'], 'decorations/winner-banner.gif', 10141),
];

/**
 * Get GIFs by category
 */
export function getGifsByCategory(category: RetroGif['category']): RetroGif[] {
  return gifLibrary.filter(gif => gif.category === category);
}

/**
 * Get GIFs by theme
 */
export function getGifsByTheme(theme: string): RetroGif[] {
  return gifLibrary.filter(gif => 
    gif.themes.includes(theme) || gif.themes.includes('all')
  );
}

/**
 * Search GIFs by tags or name
 */
export function searchGifs(query: string): RetroGif[] {
  const lowerQuery = query.toLowerCase();
  return gifLibrary.filter(gif =>
    gif.tags.some(tag => tag.includes(lowerQuery)) ||
    gif.name.toLowerCase().includes(lowerQuery) ||
    gif.description?.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get GIF by ID
 */
export function getGifById(id: string): RetroGif | undefined {
  return gifLibrary.find(gif => gif.id === id);
}

/**
 * Get random GIFs from a theme
 */
export function getRandomGifs(theme: string, count: number = 5): RetroGif[] {
  const themeGifs = getGifsByTheme(theme);
  const shuffled = [...themeGifs].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Get GIF statistics
 */
export function getGifStats() {
  return {
    total: gifLibrary.length,
    byCategory: {
      animation: getGifsByCategory('animation').length,
      button: getGifsByCategory('button').length,
      decoration: getGifsByCategory('decoration').length,
    },
    byTheme: {
      'geocities-chaos': getGifsByTheme('geocities-chaos').length,
      'neon-cyber-2001': getGifsByTheme('neon-cyber-2001').length,
      'vaporwave': getGifsByTheme('vaporwave').length,
      'vhs-glitch': getGifsByTheme('vhs-glitch').length,
      'windows-95': getGifsByTheme('windows-95').length,
      'all': getGifsByTheme('all').length,
    },
  };
}
