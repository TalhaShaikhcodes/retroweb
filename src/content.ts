/**
 * Content Script
 * Main entry point for retro transformation on target pages
 */

import { Settings } from './types';
import { getTheme } from './themes';
import { assetRegistry } from './assetRegistry';

/**
 * ResourceLoader - Handles resource loading with retry logic and fallbacks
 * Provides resilient asset loading for GIFs, backgrounds, and cursors
 */
class ResourceLoader {
  private readonly MAX_RETRIES = 1;
  private readonly RETRY_DELAY = 1000; // milliseconds
  private loadedResources: Map<string, boolean> = new Map();
  private failedResources: Set<string> = new Set();

  /**
   * Load an image resource with retry logic and fallback
   * @param url URL of the resource to load
   * @param fallbackData Optional base64 fallback data
   * @returns Promise that resolves to the loaded URL or fallback
   */
  async loadImageResource(url: string, fallbackData?: string): Promise<string> {
    // Check if already loaded successfully
    if (this.loadedResources.get(url)) {
      return url;
    }

    // Check if previously failed
    if (this.failedResources.has(url)) {
      console.warn(`RetroWeb: Resource previously failed, using fallback: ${url}`);
      return this.getFallbackUrl(fallbackData);
    }

    // Attempt to load the resource
    try {
      const loadedUrl = await this.attemptLoad(url, 0);
      this.loadedResources.set(url, true);
      return loadedUrl;
    } catch (error) {
      console.error(`RetroWeb: Failed to load resource after retries: ${url}`, error);
      this.failedResources.add(url);
      return this.getFallbackUrl(fallbackData);
    }
  }

  /**
   * Attempt to load a resource with retries
   */
  private async attemptLoad(url: string, attempt: number): Promise<string> {
    try {
      await this.testImageLoad(url);
      console.log(`RetroWeb: Successfully loaded resource: ${url}`);
      return url;
    } catch (error) {
      if (attempt < this.MAX_RETRIES) {
        console.warn(`RetroWeb: Load attempt ${attempt + 1} failed for ${url}, retrying...`);
        await this.delay(this.RETRY_DELAY);
        return this.attemptLoad(url, attempt + 1);
      }
      throw error;
    }
  }

  /**
   * Test if an image can be loaded
   */
  private testImageLoad(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      img.src = url;
    });
  }

  /**
   * Get fallback URL (base64 or simple colored square)
   */
  private getFallbackUrl(fallbackData?: string): string {
    if (fallbackData) {
      return fallbackData;
    }

    // Return a simple 1x1 transparent pixel as ultimate fallback
    return 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  }

  /**
   * Delay helper for retries
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Clear the resource cache
   */
  clearCache(): void {
    this.loadedResources.clear();
    this.failedResources.clear();
  }

  /**
   * Get statistics about resource loading
   */
  getStats(): { loaded: number; failed: number } {
    return {
      loaded: this.loadedResources.size,
      failed: this.failedResources.size
    };
  }
}

// Create singleton resource loader
const resourceLoader = new ResourceLoader();

/**
 * Base64 fallback assets for when resources fail to load
 * These are minimal, embedded images that ensure the extension continues to work
 */
const fallbackAssets = {
  // Simple animated GIF (8x8 spinning square)
  gif: 'data:image/gif;base64,R0lGODlhCAAIAIABAP///wAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJCgABACwAAAAACAAIAAACCYSPqcvtD6OcFQA7',
  
  // Simple tiled background pattern (4x4 checkerboard)
  background: 'data:image/gif;base64,R0lGODlhBAAEAIABAAAAAP///yH5BAEKAAEALAAAAAAEAAQAAAIIhI+py+0PYysAOw==',
  
  // Simple cursor (8x8 arrow)
  cursor: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAFElEQVQYV2P8//8/AzJgHBUwKgAAVuYC/QEpPPYAAAAASUVORK5CYII=',
  
  // Simple sticker (16x16 badge)
  sticker: 'data:image/gif;base64,R0lGODlhEAAQAIABAP///wAAACH5BAEKAAEALAAAAAAQABAAAAIRhI+py+0Po5y02ouz3rz7DxYAOw=='
};
/**
 * ElementDetector - Identifies hero sections, sidebars, footers, and other page regions
 * Provides smart element detection for applying different styling based on element importance
 */
class ElementDetector {
  /**
   * Detect hero sections on the page
   * Hero sections are typically large, prominent sections at the top of the page
   * @returns Array of detected hero section elements
   */
  detectHeroSections(): Element[] {
    const heroes: Element[] = [];
    
    try {
      console.log('ElementDetector: Detecting hero sections');

      // Common hero section selectors
      const heroSelectors = [
        '[class*="hero"]',
        '[id*="hero"]',
        '[class*="banner"]',
        '[id*="banner"]',
        '[class*="jumbotron"]',
        '[id*="jumbotron"]',
        '[role="banner"]',
        'header > section:first-child',
        'main > section:first-child',
        'main > div:first-child'
      ];

      // Find elements matching hero selectors
      heroSelectors.forEach(selector => {
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach(element => {
            if (!heroes.includes(element)) {
              heroes.push(element);
            }
          });
        } catch (error) {
          // Ignore selector errors
        }
      });

      // Heuristic detection: large sections near the top of the page
      const sections = document.querySelectorAll('section, div[class], div[id]');
      sections.forEach(section => {
        try {
          const rect = section.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const absoluteTop = rect.top + scrollTop;

          // Check if element is:
          // 1. Near the top of the page (within first 1000px)
          // 2. Large enough (width > 50% viewport, height > 200px)
          // 3. Not already identified as hero
          if (
            absoluteTop < 1000 &&
            rect.width > window.innerWidth * 0.5 &&
            rect.height > 200 &&
            !heroes.includes(section)
          ) {
            heroes.push(section);
          }
        } catch (error) {
          // Ignore individual element errors
        }
      });

      console.log(`ElementDetector: Found ${heroes.length} hero sections`);
      return heroes;
    } catch (error) {
      console.error('ElementDetector: Error detecting hero sections:', error);
      return heroes;
    }
  }

  /**
   * Detect sidebar elements on the page
   * Sidebars are typically narrow columns on the left or right side
   * @returns Array of detected sidebar elements
   */
  detectSidebars(): Element[] {
    const sidebars: Element[] = [];
    
    try {
      console.log('ElementDetector: Detecting sidebars');

      // Common sidebar selectors
      const sidebarSelectors = [
        '[class*="sidebar"]',
        '[id*="sidebar"]',
        '[class*="side-bar"]',
        '[id*="side-bar"]',
        'aside',
        '[role="complementary"]',
        '[class*="navigation"]',
        '[id*="navigation"]',
        'nav:not(header nav):not(footer nav)'
      ];

      // Find elements matching sidebar selectors
      sidebarSelectors.forEach(selector => {
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach(element => {
            if (!sidebars.includes(element)) {
              sidebars.push(element);
            }
          });
        } catch (error) {
          // Ignore selector errors
        }
      });

      // Heuristic detection: narrow vertical elements
      const candidates = document.querySelectorAll('aside, section, div[class], div[id], nav');
      candidates.forEach(candidate => {
        try {
          const rect = candidate.getBoundingClientRect();
          const viewportWidth = window.innerWidth;

          // Check if element is:
          // 1. Narrow (width < 30% of viewport)
          // 2. Tall (height > 400px)
          // 3. Positioned on left or right edge
          // 4. Not already identified as sidebar
          if (
            rect.width < viewportWidth * 0.3 &&
            rect.width > 150 && // Minimum width
            rect.height > 400 &&
            (rect.left < 50 || rect.right > viewportWidth - 50) &&
            !sidebars.includes(candidate)
          ) {
            sidebars.push(candidate);
          }
        } catch (error) {
          // Ignore individual element errors
        }
      });

      console.log(`ElementDetector: Found ${sidebars.length} sidebars`);
      return sidebars;
    } catch (error) {
      console.error('ElementDetector: Error detecting sidebars:', error);
      return sidebars;
    }
  }

  /**
   * Detect footer elements on the page
   * Footers are typically at the bottom of the page
   * @returns Array of detected footer elements
   */
  detectFooters(): Element[] {
    const footers: Element[] = [];
    
    try {
      console.log('ElementDetector: Detecting footers');

      // Common footer selectors
      const footerSelectors = [
        'footer',
        '[class*="footer"]',
        '[id*="footer"]',
        '[role="contentinfo"]',
        '[class*="bottom"]',
        '[id*="bottom"]'
      ];

      // Find elements matching footer selectors
      footerSelectors.forEach(selector => {
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach(element => {
            if (!footers.includes(element)) {
              footers.push(element);
            }
          });
        } catch (error) {
          // Ignore selector errors
        }
      });

      // Heuristic detection: elements near the bottom of the page
      const sections = document.querySelectorAll('section, div[class], div[id]');
      const documentHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );

      sections.forEach(section => {
        try {
          const rect = section.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const absoluteTop = rect.top + scrollTop;
          const absoluteBottom = absoluteTop + rect.height;

          // Check if element is:
          // 1. Near the bottom of the page (within last 1000px)
          // 2. Wide enough (width > 50% viewport)
          // 3. Not already identified as footer
          if (
            absoluteBottom > documentHeight - 1000 &&
            rect.width > window.innerWidth * 0.5 &&
            rect.height > 50 &&
            !footers.includes(section)
          ) {
            footers.push(section);
          }
        } catch (error) {
          // Ignore individual element errors
        }
      });

      console.log(`ElementDetector: Found ${footers.length} footers`);
      return footers;
    } catch (error) {
      console.error('ElementDetector: Error detecting footers:', error);
      return footers;
    }
  }

  /**
   * Detect main content area (excluding hero, sidebar, footer)
   * @returns Array of main content elements
   */
  detectMainContent(): Element[] {
    const mainContent: Element[] = [];
    
    try {
      console.log('ElementDetector: Detecting main content');

      // Get hero, sidebar, and footer elements to exclude
      const heroes = this.detectHeroSections();
      const sidebars = this.detectSidebars();
      const footers = this.detectFooters();
      const excludedElements = new Set([...heroes, ...sidebars, ...footers]);

      // Common main content selectors
      const mainSelectors = [
        'main',
        '[role="main"]',
        '[class*="content"]',
        '[id*="content"]',
        'article',
        '[class*="main"]',
        '[id*="main"]'
      ];

      // Find elements matching main content selectors
      mainSelectors.forEach(selector => {
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach(element => {
            if (!mainContent.includes(element) && !excludedElements.has(element)) {
              mainContent.push(element);
            }
          });
        } catch (error) {
          // Ignore selector errors
        }
      });

      console.log(`ElementDetector: Found ${mainContent.length} main content areas`);
      return mainContent;
    } catch (error) {
      console.error('ElementDetector: Error detecting main content:', error);
      return mainContent;
    }
  }

  /**
   * Get all detected page regions with labels
   * @returns Object containing all detected regions
   */
  getAllRegions(): {
    heroes: Element[];
    sidebars: Element[];
    footers: Element[];
    mainContent: Element[];
  } {
    return {
      heroes: this.detectHeroSections(),
      sidebars: this.detectSidebars(),
      footers: this.detectFooters(),
      mainContent: this.detectMainContent()
    };
  }

  /**
   * Mark detected regions with data attributes for CSS targeting
   */
  markRegions(): void {
    try {
      console.log('ElementDetector: Marking detected regions');

      const regions = this.getAllRegions();

      // Mark hero sections
      regions.heroes.forEach((hero, index) => {
        (hero as HTMLElement).setAttribute('data-retro-region', 'hero');
        (hero as HTMLElement).setAttribute('data-retro-region-index', index.toString());
      });

      // Mark sidebars
      regions.sidebars.forEach((sidebar, index) => {
        (sidebar as HTMLElement).setAttribute('data-retro-region', 'sidebar');
        (sidebar as HTMLElement).setAttribute('data-retro-region-index', index.toString());
      });

      // Mark footers
      regions.footers.forEach((footer, index) => {
        (footer as HTMLElement).setAttribute('data-retro-region', 'footer');
        (footer as HTMLElement).setAttribute('data-retro-region-index', index.toString());
      });

      // Mark main content
      regions.mainContent.forEach((content, index) => {
        (content as HTMLElement).setAttribute('data-retro-region', 'main-content');
        (content as HTMLElement).setAttribute('data-retro-region-index', index.toString());
      });

      console.log('ElementDetector: Region marking complete');
    } catch (error) {
      console.error('ElementDetector: Error marking regions:', error);
    }
  }

  /**
   * Remove region markers
   */
  unmarkRegions(): void {
    try {
      console.log('ElementDetector: Removing region markers');

      const markedElements = document.querySelectorAll('[data-retro-region]');
      markedElements.forEach(element => {
        element.removeAttribute('data-retro-region');
        element.removeAttribute('data-retro-region-index');
      });

      console.log('ElementDetector: Region markers removed');
    } catch (error) {
      console.error('ElementDetector: Error removing region markers:', error);
    }
  }
}

/**
 * BackgroundStyler - Manages background patterns, neon borders, and contrast adjustments
 * Handles tiled backgrounds, readability preservation, and dark theme adaptation
 */
class BackgroundStyler {
  private readonly BACKGROUND_CLASS = 'retroweb-background';
  private readonly OVERLAY_CLASS = 'retroweb-overlay';
  private readonly NEON_BORDER_CLASS = 'retroweb-neon-border';
  private appliedBackground: string | null = null;
  private appliedOverlay: HTMLElement | null = null;
  private borderedElements: Element[] = [];

  /**
   * Apply a tiled background pattern to the page body
   * Supports both image-based and CSS-generated backgrounds
   * @param pattern Background pattern name from asset registry
   */
  async applyTiledBackground(pattern: string): Promise<void> {
    try {
      console.log(`RetroWeb: Applying tiled background: ${pattern}`);

      if (!document.body) {
        console.warn('RetroWeb: Document body not available');
        return;
      }

      // Get background asset
      const backgroundInfo = assetRegistry.backgrounds[pattern];
      if (!backgroundInfo) {
        console.warn(`RetroWeb: Background pattern not found: ${pattern}`);
        return;
      }

      // Check if this is a CSS-generated background or image-based
      if (backgroundInfo.css) {
        // Apply CSS-generated background
        document.body.style.backgroundImage = backgroundInfo.css;
        document.body.style.backgroundRepeat = 'repeat';
        document.body.style.backgroundAttachment = 'fixed';
        
        // Apply optional CSS size and position
        if (backgroundInfo.cssSize) {
          document.body.style.backgroundSize = backgroundInfo.cssSize;
        }
        if (backgroundInfo.cssPosition) {
          document.body.style.backgroundPosition = backgroundInfo.cssPosition;
        }
        
        console.log(`RetroWeb: Applied CSS background: ${pattern}`);
      } else if (backgroundInfo.url) {
        // Apply image-based background
        const backgroundUrl = chrome.runtime.getURL(backgroundInfo.url);
        
        // Load resource with fallback
        const loadedUrl = await resourceLoader.loadImageResource(backgroundUrl, fallbackAssets.background);

        // Apply tiled background to body
        document.body.style.backgroundImage = `url("${loadedUrl}")`;
        document.body.style.backgroundRepeat = 'repeat';
        document.body.style.backgroundAttachment = 'fixed';
        
        console.log(`RetroWeb: Applied image background: ${pattern}`);
      } else {
        console.warn(`RetroWeb: Background has neither CSS nor URL: ${pattern}`);
        return;
      }

      document.body.classList.add(this.BACKGROUND_CLASS);
      document.body.setAttribute('data-retroweb', 'background');
      this.appliedBackground = pattern;

      // Apply contrast adjustment for readability
      this.adjustContrast();

      console.log(`RetroWeb: Background ${pattern} applied successfully`);
    } catch (error) {
      console.error('RetroWeb: Error applying tiled background:', error);
    }
  }

  /**
   * Apply colorful neon borders to major content sections
   * @param color Neon border color (hex format)
   */
  applyNeonBorders(color: string = '#ff00ff'): void {
    try {
      console.log(`RetroWeb: Applying neon borders with color: ${color}`);

      // Select major content sections
      const selectors = [
        'main',
        'article',
        'section',
        'aside',
        'nav',
        'header',
        'footer',
        'div[role="main"]',
        'div[role="article"]',
        'div[role="complementary"]'
      ];

      const elements: Element[] = [];
      selectors.forEach(selector => {
        try {
          const found = document.querySelectorAll(selector);
          elements.push(...Array.from(found));
        } catch (error) {
          // Ignore selector errors
        }
      });

      // Apply neon borders to elements
      elements.forEach(element => {
        try {
          const htmlElement = element as HTMLElement;
          
          // Skip if element is too small or not visible
          const rect = htmlElement.getBoundingClientRect();
          if (rect.width < 100 || rect.height < 100) {
            return;
          }

          // Apply neon border styling
          htmlElement.style.border = `3px solid ${color}`;
          htmlElement.style.boxShadow = `0 0 10px ${color}, inset 0 0 10px ${color}`;
          htmlElement.classList.add(this.NEON_BORDER_CLASS);
          htmlElement.setAttribute('data-retroweb-border', 'true');

          this.borderedElements.push(element);
        } catch (error) {
          console.warn('RetroWeb: Failed to apply border to element:', error);
        }
      });

      console.log(`RetroWeb: Applied neon borders to ${this.borderedElements.length} elements`);
    } catch (error) {
      console.error('RetroWeb: Error applying neon borders:', error);
    }
  }

  /**
   * Adjust contrast and add overlay for text readability
   * Detects dark themes and adapts accordingly
   */
  adjustContrast(): void {
    try {
      console.log('RetroWeb: Adjusting contrast for readability');

      if (!document.body) {
        console.warn('RetroWeb: Document body not available');
        return;
      }

      // Detect if page has dark theme
      const isDarkTheme = this.detectDarkTheme();
      console.log(`RetroWeb: Dark theme detected: ${isDarkTheme}`);

      // Create semi-transparent overlay for readability
      const overlay = document.createElement('div');
      overlay.className = this.OVERLAY_CLASS;
      overlay.setAttribute('data-retroweb', 'overlay');
      
      // Style overlay
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.pointerEvents = 'none';
      overlay.style.zIndex = '1';
      
      // Adjust overlay opacity based on theme
      if (isDarkTheme) {
        // For dark themes, use a lighter overlay
        overlay.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
      } else {
        // For light themes, use a darker overlay
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
      }

      // Insert overlay as first child of body
      if (document.body.firstChild) {
        document.body.insertBefore(overlay, document.body.firstChild);
      } else {
        document.body.appendChild(overlay);
      }

      this.appliedOverlay = overlay;

      console.log('RetroWeb: Contrast adjustment applied');
    } catch (error) {
      console.error('RetroWeb: Error adjusting contrast:', error);
    }
  }

  /**
   * Detect if the page uses a dark theme
   * @returns true if dark theme is detected
   */
  detectDarkTheme(): boolean {
    try {
      if (!document.body) {
        return false;
      }

      // Get computed background color of body
      const computedStyle = window.getComputedStyle(document.body);
      const backgroundColor = computedStyle.backgroundColor;

      // Parse RGB values
      const rgbMatch = backgroundColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (!rgbMatch) {
        return false;
      }

      const r = parseInt(rgbMatch[1], 10);
      const g = parseInt(rgbMatch[2], 10);
      const b = parseInt(rgbMatch[3], 10);

      // Calculate relative luminance (simplified)
      // Using the formula: L = 0.299*R + 0.587*G + 0.114*B
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

      // Consider dark if luminance is less than 0.3
      return luminance < 0.3;
    } catch (error) {
      console.warn('RetroWeb: Error detecting dark theme:', error);
      return false;
    }
  }

  /**
   * Remove all background styling and overlays
   */
  removeBackgrounds(): void {
    try {
      console.log('RetroWeb: Removing backgrounds and overlays');

      // Remove background from body
      if (document.body) {
        document.body.style.backgroundImage = '';
        document.body.style.backgroundRepeat = '';
        document.body.style.backgroundAttachment = '';
        document.body.style.backgroundSize = '';
        document.body.style.backgroundPosition = '';
        document.body.classList.remove(this.BACKGROUND_CLASS);
        document.body.removeAttribute('data-retroweb');
      }

      // Remove overlay
      if (this.appliedOverlay) {
        this.appliedOverlay.remove();
        this.appliedOverlay = null;
      }

      // Remove neon borders
      this.borderedElements.forEach(element => {
        try {
          const htmlElement = element as HTMLElement;
          htmlElement.style.border = '';
          htmlElement.style.boxShadow = '';
          htmlElement.classList.remove(this.NEON_BORDER_CLASS);
          htmlElement.removeAttribute('data-retroweb-border');
        } catch (error) {
          console.warn('RetroWeb: Failed to remove border from element:', error);
        }
      });

      this.borderedElements = [];
      this.appliedBackground = null;

      console.log('RetroWeb: Backgrounds removed');
    } catch (error) {
      console.error('RetroWeb: Error removing backgrounds:', error);
    }
  }

  /**
   * Get the currently applied background pattern
   */
  getAppliedBackground(): string | null {
    return this.appliedBackground;
  }

  /**
   * Get the count of elements with neon borders
   */
  getBorderedElementCount(): number {
    return this.borderedElements.length;
  }
}

/**
 * WindowsCrashEffect - Creates the iconic Windows crash/freeze trail effect
 * When modals open on Windows 95 theme, moving the cursor leaves ghost copies
 * of the modal everywhere, recreating the classic "frozen window" experience
 */
class WindowsCrashEffect {
  private isActive: boolean = false;
  private ghostElements: HTMLElement[] = [];
  private currentModal: HTMLElement | null = null;
  private mouseMoveHandler: ((e: MouseEvent) => void) | null = null;
  private clickHandler: ((e: MouseEvent) => void) | null = null;
  private modalCheckInterval: number | null = null;
  private readonly MAX_GHOSTS = 50;
  private readonly GHOST_OPACITY = 0.85;
  private lastX: number = 0;
  private lastY: number = 0;
  private readonly MIN_MOVE_DISTANCE = 15; // Minimum pixels to move before creating new ghost

  /**
   * Start the crash effect for a modal element
   * @param modalElement The modal/dialog element to create ghosts of
   */
  startCrashEffect(modalElement: HTMLElement): void {
    if (this.isActive) {
      this.stopCrashEffect();
    }

    console.log('RetroWeb: Starting Windows crash effect (Double-click to dismiss)');
    
    this.isActive = true;
    this.currentModal = modalElement;
    this.lastX = 0;
    this.lastY = 0;

    // Create mouse move handler
    this.mouseMoveHandler = (e: MouseEvent) => {
      this.handleMouseMove(e);
    };

    // Create double-click handler to fully stop the effect
    // Using double-click so it doesn't interfere with normal modal interactions
    this.clickHandler = () => {
      // Double-click anywhere stops the crash effect completely
      console.log('RetroWeb: Double-click detected, stopping crash effect');
      this.stopCrashEffect();
    };

    document.addEventListener('mousemove', this.mouseMoveHandler);
    document.addEventListener('dblclick', this.clickHandler);

    // Watch for modal being removed/hidden
    this.startModalWatcher();
  }

  /**
   * Watch for the modal being closed/removed
   */
  private startModalWatcher(): void {
    // Check periodically if modal is still visible
    this.modalCheckInterval = window.setInterval(() => {
      if (!this.currentModal) {
        this.stopCrashEffect();
        return;
      }

      // Check if modal is still in DOM
      if (!document.body.contains(this.currentModal)) {
        console.log('RetroWeb: Modal removed from DOM, stopping crash effect');
        this.stopCrashEffect();
        return;
      }

      // Check if modal is hidden
      const style = window.getComputedStyle(this.currentModal);
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
        console.log('RetroWeb: Modal hidden, stopping crash effect');
        this.stopCrashEffect();
        return;
      }
    }, 500);
  }

  /**
   * Handle mouse movement to create ghost trails
   */
  private handleMouseMove(e: MouseEvent): void {
    if (!this.isActive || !this.currentModal) return;

    // Calculate distance moved
    const dx = e.clientX - this.lastX;
    const dy = e.clientY - this.lastY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Only create ghost if moved enough distance
    if (distance < this.MIN_MOVE_DISTANCE && this.lastX !== 0) return;

    this.lastX = e.clientX;
    this.lastY = e.clientY;

    // Create a ghost copy of the modal
    this.createGhost(e.clientX, e.clientY);
  }

  /**
   * Create a ghost copy of the modal at the cursor position
   */
  private createGhost(x: number, y: number): void {
    if (!this.currentModal) return;

    // Limit number of ghosts
    if (this.ghostElements.length >= this.MAX_GHOSTS) {
      const oldGhost = this.ghostElements.shift();
      if (oldGhost && oldGhost.parentElement) {
        oldGhost.remove();
      }
    }

    // Clone the modal
    const ghost = this.currentModal.cloneNode(true) as HTMLElement;
    
    // Style the ghost
    ghost.style.position = 'fixed';
    ghost.style.left = `${x - 50}px`; // Offset from cursor
    ghost.style.top = `${y - 20}px`;
    ghost.style.opacity = String(this.GHOST_OPACITY);
    ghost.style.pointerEvents = 'none';
    ghost.style.zIndex = '999990';
    ghost.style.transform = 'none';
    ghost.style.margin = '0';
    ghost.style.maxWidth = '300px';
    ghost.style.maxHeight = '200px';
    ghost.style.overflow = 'hidden';
    ghost.setAttribute('data-retroweb', 'crash-ghost');
    ghost.classList.add('retroweb-crash-ghost');

    // Remove any animations from the ghost
    ghost.style.animation = 'none';
    
    // Make it look like a frozen Windows dialog
    ghost.style.background = '#c0c0c0';
    ghost.style.border = '2px solid';
    ghost.style.borderColor = '#ffffff #808080 #808080 #ffffff';
    ghost.style.boxShadow = '1px 1px 0 #000000';

    document.body.appendChild(ghost);
    this.ghostElements.push(ghost);
  }

  /**
   * Stop the crash effect and clean up
   */
  stopCrashEffect(): void {
    if (!this.isActive && this.ghostElements.length === 0) return;
    
    console.log('RetroWeb: Stopping Windows crash effect');
    
    this.isActive = false;
    this.currentModal = null;

    // Remove mouse listener
    if (this.mouseMoveHandler) {
      document.removeEventListener('mousemove', this.mouseMoveHandler);
      this.mouseMoveHandler = null;
    }

    // Remove double-click listener
    if (this.clickHandler) {
      document.removeEventListener('dblclick', this.clickHandler);
      this.clickHandler = null;
    }

    // Stop modal watcher
    if (this.modalCheckInterval !== null) {
      clearInterval(this.modalCheckInterval);
      this.modalCheckInterval = null;
    }

    // Remove all ghost elements
    this.ghostElements.forEach(ghost => {
      if (ghost.parentElement) {
        ghost.remove();
      }
    });
    this.ghostElements = [];
    this.lastX = 0;
    this.lastY = 0;
  }

  /**
   * Check if the crash effect is currently active
   */
  isEffectActive(): boolean {
    return this.isActive;
  }

  /**
   * Get the number of ghost elements currently displayed
   */
  getGhostCount(): number {
    return this.ghostElements.length;
  }
}

/**
 * FontTransformer - Manages font replacements and text effects
 * Handles retro fonts, neon glow, marquees, and blinking text
 */
class FontTransformer {
  private readonly FONT_CLASS = 'retroweb-font';
  private readonly GLOW_CLASS = 'retroweb-glow';
  private readonly MARQUEE_CLASS = 'retroweb-marquee';
  private readonly BLINK_CLASS = 'retroweb-blink';
  private modifiedElements: HTMLElement[] = [];
  private marqueeElements: HTMLElement[] = [];
  private originalFonts: Map<HTMLElement, string> = new Map();

  /**
   * Apply retro fonts to page text elements
   * @param fontStyle Font style to apply ('comic-sans', 'pixel', 'decorative')
   */
  applyRetroFonts(fontStyle: string = 'comic-sans'): void {
    try {
      console.log(`RetroWeb: Applying retro fonts: ${fontStyle}`);

      if (!document.body) {
        console.warn('RetroWeb: Document body not available');
        return;
      }

      // Map font styles to actual font families
      const fontMap: Record<string, string> = {
        'comic-sans': '"Comic Sans MS", "Comic Sans", cursive',
        'pixel': '"Press Start 2P", "Courier New", monospace',
        'decorative': '"Papyrus", "Brush Script MT", cursive'
      };

      const fontFamily = fontMap[fontStyle] || fontMap['comic-sans'];

      // Apply font to body (cascades to all children)
      const originalBodyFont = document.body.style.fontFamily;
      if (originalBodyFont) {
        this.originalFonts.set(document.body, originalBodyFont);
      }
      
      document.body.style.fontFamily = fontFamily;
      document.body.classList.add(this.FONT_CLASS);
      document.body.setAttribute('data-retroweb-font', fontStyle);

      // Also apply to specific text elements to override any inline styles
      const textElements = document.querySelectorAll('p, span, div, a, li, td, th, label, button');
      textElements.forEach(element => {
        try {
          const htmlElement = element as HTMLElement;
          
          // Skip if element has no text content
          if (!htmlElement.textContent?.trim()) {
            return;
          }

          // Store original font
          const originalFont = htmlElement.style.fontFamily;
          if (originalFont) {
            this.originalFonts.set(htmlElement, originalFont);
          }

          // Apply retro font
          htmlElement.style.fontFamily = fontFamily;
          htmlElement.classList.add(this.FONT_CLASS);
          
          this.modifiedElements.push(htmlElement);
        } catch (error) {
          // Ignore errors for individual elements
        }
      });

      // Validate layout to prevent overflow
      this.validateLayout();

      console.log(`RetroWeb: Applied retro fonts to ${this.modifiedElements.length + 1} elements`);
    } catch (error) {
      console.error('RetroWeb: Error applying retro fonts:', error);
    }
  }

  /**
   * Add neon glow effects to heading elements
   * @param glowColor Color for the glow effect (hex format)
   */
  addNeonGlow(glowColor: string = '#00ffff'): void {
    try {
      console.log(`RetroWeb: Adding neon glow to headings: ${glowColor}`);

      // Select all heading elements
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      
      let glowCount = 0;
      headings.forEach(heading => {
        try {
          const htmlHeading = heading as HTMLElement;
          
          // Skip if heading has no text
          if (!htmlHeading.textContent?.trim()) {
            return;
          }

          // Apply neon glow effect using text-shadow
          const glowEffect = `
            0 0 5px ${glowColor},
            0 0 10px ${glowColor},
            0 0 15px ${glowColor},
            0 0 20px ${glowColor}
          `.trim();
          
          htmlHeading.style.textShadow = glowEffect;
          htmlHeading.classList.add(this.GLOW_CLASS);
          htmlHeading.setAttribute('data-retroweb-glow', 'true');
          
          this.modifiedElements.push(htmlHeading);
          glowCount++;
        } catch (error) {
          // Ignore errors for individual headings
        }
      });

      console.log(`RetroWeb: Applied neon glow to ${glowCount} headings`);
    } catch (error) {
      console.error('RetroWeb: Error adding neon glow:', error);
    }
  }

  /**
   * Create scrolling text marquee banners
   * @param text Text to display in marquee (default: "WELCOME TO MY PAGE")
   * @param count Number of marquees to create (default: 1)
   */
  createMarquee(text: string = 'WELCOME TO MY PAGE', count: number = 1): void {
    try {
      console.log(`RetroWeb: Creating ${count} marquee(s)`);

      if (!document.body) {
        console.warn('RetroWeb: Document body not available');
        return;
      }

      for (let i = 0; i < count; i++) {
        // Create marquee container
        const marquee = document.createElement('div');
        marquee.className = this.MARQUEE_CLASS;
        marquee.setAttribute('data-retroweb', 'marquee');
        
        // Style marquee with authentic 90s look - EXTRA BOLD
        marquee.style.position = 'fixed';
        marquee.style.width = '100%';
        marquee.style.backgroundColor = '#ff00ff';
        marquee.style.color = '#ffff00';
        marquee.style.fontFamily = '"Impact", "Arial Black", "Haettenschweiler", sans-serif';
        marquee.style.fontSize = '32px';
        marquee.style.fontWeight = '900';
        marquee.style.fontStretch = 'ultra-condensed';
        marquee.style.letterSpacing = '4px';
        marquee.style.textTransform = 'uppercase';
        marquee.style.padding = '15px 0';
        marquee.style.zIndex = '10000';
        marquee.style.overflow = 'hidden';
        marquee.style.whiteSpace = 'nowrap';
        marquee.style.pointerEvents = 'none';
        marquee.style.border = '4px solid #00ffff';
        marquee.style.borderLeft = 'none';
        marquee.style.borderRight = 'none';
        marquee.style.boxShadow = '0 0 25px rgba(255, 0, 255, 0.9), inset 0 0 25px rgba(255, 0, 255, 0.4)';
        marquee.style.textShadow = '3px 3px 0 #ff0000, -3px -3px 0 #00ff00, 0 0 15px #ffff00, 4px 4px 8px rgba(0,0,0,0.8)';
        marquee.style.webkitTextStroke = '1px #000000';
        
        // Position marquees at different vertical positions
        if (i === 0) {
          marquee.style.top = '0';
        } else {
          marquee.style.bottom = '0';
        }

        // Create scrolling text element
        const scrollText = document.createElement('div');
        scrollText.textContent = text;
        scrollText.style.display = 'inline-block';
        scrollText.style.paddingLeft = '100%';
        scrollText.style.animation = 'retroweb-marquee 15s linear infinite';
        
        marquee.appendChild(scrollText);
        
        // Add marquee to page
        document.body.appendChild(marquee);
        this.marqueeElements.push(marquee);
      }

      // Add CSS animation for marquee if not already present
      this.addMarqueeAnimation();

      console.log(`RetroWeb: Created ${this.marqueeElements.length} marquee(s)`);
    } catch (error) {
      console.error('RetroWeb: Error creating marquee:', error);
    }
  }

  /**
   * Add blinking text animation to selected elements
   * @param selector CSS selector for elements to make blink (default: random selection)
   */
  addBlinkingText(selector?: string): void {
    try {
      console.log('RetroWeb: Adding blinking text effects');

      let elements: NodeListOf<Element>;
      
      if (selector) {
        elements = document.querySelectorAll(selector);
      } else {
        // Select random text elements if no selector provided
        const allTextElements = document.querySelectorAll('p, span, a, li');
        const randomElements: Element[] = [];
        
        // Select up to 5 random elements
        const count = Math.min(5, allTextElements.length);
        const indices = new Set<number>();
        
        while (indices.size < count && indices.size < allTextElements.length) {
          indices.add(Math.floor(Math.random() * allTextElements.length));
        }
        
        indices.forEach(index => {
          randomElements.push(allTextElements[index]);
        });
        
        elements = {
          length: randomElements.length,
          item: (index: number) => randomElements[index],
          forEach: (callback: (element: Element, index: number) => void) => {
            randomElements.forEach(callback);
          },
          [Symbol.iterator]: function* () {
            for (const element of randomElements) {
              yield element;
            }
          }
        } as NodeListOf<Element>;
      }

      let blinkCount = 0;
      elements.forEach(element => {
        try {
          const htmlElement = element as HTMLElement;
          
          // Skip if element has no text
          if (!htmlElement.textContent?.trim()) {
            return;
          }

          // Apply blinking animation
          htmlElement.style.animation = 'retroweb-blink 1s step-start infinite';
          htmlElement.classList.add(this.BLINK_CLASS);
          htmlElement.setAttribute('data-retroweb-blink', 'true');
          
          this.modifiedElements.push(htmlElement);
          blinkCount++;
        } catch (error) {
          // Ignore errors for individual elements
        }
      });

      // Add CSS animation for blinking if not already present
      this.addBlinkAnimation();

      console.log(`RetroWeb: Applied blinking effect to ${blinkCount} elements`);
    } catch (error) {
      console.error('RetroWeb: Error adding blinking text:', error);
    }
  }

  /**
   * Validate layout to prevent overflow issues
   */
  validateLayout(): void {
    try {
      // Check for elements that overflow their containers
      this.modifiedElements.forEach(element => {
        try {
          const rect = element.getBoundingClientRect();
          const parent = element.parentElement;
          
          if (parent) {
            const parentRect = parent.getBoundingClientRect();
            
            // Check if element overflows parent horizontally
            if (rect.width > parentRect.width * 1.2) {
              // Add word-wrap to prevent overflow
              element.style.wordWrap = 'break-word';
              element.style.overflowWrap = 'break-word';
            }
          }
        } catch (error) {
          // Ignore errors for individual elements
        }
      });
    } catch (error) {
      console.warn('RetroWeb: Error validating layout:', error);
    }
  }

  /**
   * Remove all font transformations and text effects
   */
  removeFonts(): void {
    try {
      console.log('RetroWeb: Removing font transformations');

      // Restore original fonts
      this.originalFonts.forEach((originalFont, element) => {
        try {
          element.style.fontFamily = originalFont;
        } catch (error) {
          // Ignore errors
        }
      });
      this.originalFonts.clear();

      // Remove font styling from body
      if (document.body) {
        document.body.style.fontFamily = '';
        document.body.classList.remove(this.FONT_CLASS);
        document.body.removeAttribute('data-retroweb-font');
      }

      // Remove modifications from all elements
      this.modifiedElements.forEach(element => {
        try {
          element.style.fontFamily = '';
          element.style.textShadow = '';
          element.style.animation = '';
          element.style.wordWrap = '';
          element.style.overflowWrap = '';
          element.classList.remove(this.FONT_CLASS, this.GLOW_CLASS, this.BLINK_CLASS);
          element.removeAttribute('data-retroweb-glow');
          element.removeAttribute('data-retroweb-blink');
        } catch (error) {
          // Ignore errors
        }
      });
      this.modifiedElements = [];

      // Remove marquees
      this.marqueeElements.forEach(marquee => {
        try {
          marquee.remove();
        } catch (error) {
          // Ignore errors
        }
      });
      this.marqueeElements = [];

      // Remove animation styles
      this.removeAnimationStyles();

      console.log('RetroWeb: Font transformations removed');
    } catch (error) {
      console.error('RetroWeb: Error removing fonts:', error);
    }
  }

  /**
   * Add marquee animation CSS to the page
   */
  private addMarqueeAnimation(): void {
    try {
      // Check if animation already exists
      if (document.getElementById('retroweb-marquee-style')) {
        return;
      }

      const style = document.createElement('style');
      style.id = 'retroweb-marquee-style';
      style.textContent = `
        @keyframes retroweb-marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `;
      document.head.appendChild(style);
    } catch (error) {
      console.warn('RetroWeb: Error adding marquee animation:', error);
    }
  }

  /**
   * Add blink animation CSS to the page
   */
  private addBlinkAnimation(): void {
    try {
      // Check if animation already exists
      if (document.getElementById('retroweb-blink-style')) {
        return;
      }

      const style = document.createElement('style');
      style.id = 'retroweb-blink-style';
      style.textContent = `
        @keyframes retroweb-blink {
          0%, 49% {
            opacity: 1;
          }
          50%, 100% {
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    } catch (error) {
      console.warn('RetroWeb: Error adding blink animation:', error);
    }
  }

  /**
   * Remove animation style elements
   */
  private removeAnimationStyles(): void {
    try {
      const marqueeStyle = document.getElementById('retroweb-marquee-style');
      if (marqueeStyle) {
        marqueeStyle.remove();
      }

      const blinkStyle = document.getElementById('retroweb-blink-style');
      if (blinkStyle) {
        blinkStyle.remove();
      }
    } catch (error) {
      console.warn('RetroWeb: Error removing animation styles:', error);
    }
  }

  /**
   * Get count of modified elements
   */
  getModifiedElementCount(): number {
    return this.modifiedElements.length;
  }

  /**
   * Get count of marquee elements
   */
  getMarqueeCount(): number {
    return this.marqueeElements.length;
  }
}

/**
 * CursorCustomizer - Manages custom cursor images and trail effects
 * Handles cursor replacement, trail animation, and interactive element preservation
 */
class CursorCustomizer {
  private readonly CURSOR_CLASS = 'retroweb-cursor';
  private readonly TRAIL_PARTICLE_CLASS = 'retroweb-trail-particle';
  private trailEnabled: boolean = false;
  private trailParticles: HTMLElement[] = [];
  private animationFrameId: number | null = null;
  private particlePool: HTMLElement[] = [];
  private readonly MAX_TRAIL_PARTICLES = 20;
  private readonly PARTICLE_LIFETIME = 500; // milliseconds
  private originalCursor: string = '';

  /**
   * Set custom cursor image
   * @param cursorType Cursor type from asset registry ('sparkle', 'rainbow', 'animated')
   */
  async setCursor(cursorType: string): Promise<void> {
    try {
      console.log(`RetroWeb: Setting custom cursor: ${cursorType}`);

      if (!document.body) {
        console.warn('RetroWeb: Document body not available');
        return;
      }

      // Get cursor asset
      const cursorInfo = assetRegistry.cursors[cursorType];
      if (!cursorInfo || !cursorInfo.url) {
        console.warn(`RetroWeb: Cursor type not found or has no URL: ${cursorType}`);
        return;
      }

      // Store original cursor
      if (!this.originalCursor) {
        this.originalCursor = document.body.style.cursor || 'auto';
      }

      // Get the full URL for the cursor image
      const cursorUrl = chrome.runtime.getURL(cursorInfo.url);
      const hotspot = cursorInfo.hotspot || [0, 0];
      
      // Load resource with fallback
      const loadedUrl = await resourceLoader.loadImageResource(cursorUrl, fallbackAssets.cursor);

      // Apply custom cursor to body
      document.body.style.cursor = `url("${loadedUrl}") ${hotspot[0]} ${hotspot[1]}, auto`;
      document.body.classList.add(this.CURSOR_CLASS);
      document.body.setAttribute('data-retroweb-cursor', cursorType);

      // Ensure interactive elements maintain pointer cursor
      this.preserveInteractiveCursors();

      console.log(`RetroWeb: Custom cursor ${cursorType} applied`);
    } catch (error) {
      console.error('RetroWeb: Error setting cursor:', error);
    }
  }

  /**
   * Enable cursor trail effect
   */
  enableTrail(): void {
    try {
      if (this.trailEnabled) {
        console.log('RetroWeb: Cursor trail already enabled');
        return;
      }

      console.log('RetroWeb: Enabling cursor trail');

      this.trailEnabled = true;

      // Add mousemove listener
      document.addEventListener('mousemove', this.handleMouseMove);

      // Start animation loop
      this.startTrailAnimation();

      console.log('RetroWeb: Cursor trail enabled');
    } catch (error) {
      console.error('RetroWeb: Error enabling cursor trail:', error);
    }
  }

  /**
   * Update cursor trail position
   * @param x Mouse X coordinate
   * @param y Mouse Y coordinate
   */
  updateTrail(x: number, y: number): void {
    try {
      if (!this.trailEnabled) {
        return;
      }

      // Create new trail particle
      this.createTrailParticle(x, y);
    } catch (error) {
      console.error('RetroWeb: Error updating trail:', error);
    }
  }

  /**
   * Remove cursor trail effect
   */
  removeTrail(): void {
    try {
      if (!this.trailEnabled) {
        return;
      }

      console.log('RetroWeb: Removing cursor trail');

      this.trailEnabled = false;

      // Remove mousemove listener
      document.removeEventListener('mousemove', this.handleMouseMove);

      // Stop animation loop
      if (this.animationFrameId !== null) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }

      // Remove all trail particles
      this.trailParticles.forEach(particle => {
        try {
          particle.remove();
        } catch (error) {
          console.warn('RetroWeb: Failed to remove trail particle:', error);
        }
      });
      this.trailParticles = [];

      // Clear particle pool
      this.particlePool.forEach(particle => {
        try {
          particle.remove();
        } catch (error) {
          console.warn('RetroWeb: Failed to remove pooled particle:', error);
        }
      });
      this.particlePool = [];

      console.log('RetroWeb: Cursor trail removed');
    } catch (error) {
      console.error('RetroWeb: Error removing trail:', error);
    }
  }

  /**
   * Remove all cursor customizations
   */
  removeCursor(): void {
    try {
      console.log('RetroWeb: Removing cursor customizations');

      // Remove trail first
      this.removeTrail();

      // Restore original cursor
      if (document.body) {
        document.body.style.cursor = this.originalCursor || '';
        document.body.classList.remove(this.CURSOR_CLASS);
        document.body.removeAttribute('data-retroweb-cursor');
      }

      // Remove cursor preservation styles
      const styleElement = document.getElementById('retroweb-cursor-preserve-style');
      if (styleElement) {
        styleElement.remove();
      }

      this.originalCursor = '';

      console.log('RetroWeb: Cursor customizations removed');
    } catch (error) {
      console.error('RetroWeb: Error removing cursor:', error);
    }
  }

  /**
   * Handle mouse move events
   */
  private handleMouseMove = (event: MouseEvent): void => {
    this.updateTrail(event.clientX, event.clientY);
  };

  /**
   * Create a trail particle at the specified position
   */
  private createTrailParticle(x: number, y: number): void {
    try {
      // Limit number of active particles
      if (this.trailParticles.length >= this.MAX_TRAIL_PARTICLES) {
        // Reuse oldest particle
        const oldestParticle = this.trailParticles.shift();
        if (oldestParticle) {
          this.repositionParticle(oldestParticle, x, y);
          this.trailParticles.push(oldestParticle);
          return;
        }
      }

      // Get particle from pool or create new one
      let particle = this.particlePool.pop();
      if (!particle) {
        particle = this.createParticleElement();
      }

      // Position particle
      this.repositionParticle(particle, x, y);

      // Add to DOM if not already present
      if (!particle.parentElement) {
        document.body.appendChild(particle);
      }

      // Track particle
      this.trailParticles.push(particle);

      // Schedule particle removal
      setTimeout(() => {
        this.removeParticle(particle!);
      }, this.PARTICLE_LIFETIME);
    } catch (error) {
      console.warn('RetroWeb: Error creating trail particle:', error);
    }
  }

  /**
   * Create a new particle element
   */
  private createParticleElement(): HTMLElement {
    const particle = document.createElement('div');
    particle.className = this.TRAIL_PARTICLE_CLASS;
    particle.setAttribute('data-retroweb', 'cursor-trail');

    // Style particle
    particle.style.position = 'fixed';
    particle.style.width = '8px';
    particle.style.height = '8px';
    particle.style.borderRadius = '50%';
    particle.style.backgroundColor = '#ffff00';
    particle.style.boxShadow = '0 0 10px #ffff00, 0 0 20px #ffff00';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '9999';
    particle.style.opacity = '1';
    particle.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
    particle.style.transform = 'scale(1)';

    return particle;
  }

  /**
   * Reposition a particle to a new location
   */
  private repositionParticle(particle: HTMLElement, x: number, y: number): void {
    particle.style.left = `${x - 4}px`;
    particle.style.top = `${y - 4}px`;
    particle.style.opacity = '1';
    particle.style.transform = 'scale(1)';

    // Trigger fade out animation
    requestAnimationFrame(() => {
      particle.style.opacity = '0';
      particle.style.transform = 'scale(0.5)';
    });
  }

  /**
   * Remove a particle from the trail
   */
  private removeParticle(particle: HTMLElement): void {
    try {
      const index = this.trailParticles.indexOf(particle);
      if (index > -1) {
        this.trailParticles.splice(index, 1);
      }

      // Return to pool instead of removing from DOM
      if (this.particlePool.length < this.MAX_TRAIL_PARTICLES * 2) {
        this.particlePool.push(particle);
      } else {
        particle.remove();
      }
    } catch (error) {
      console.warn('RetroWeb: Error removing particle:', error);
    }
  }

  /**
   * Start the trail animation loop using requestAnimationFrame
   */
  private startTrailAnimation(): void {
    const animate = () => {
      if (!this.trailEnabled) {
        return;
      }

      // Animation loop continues even if no new particles are created
      // This ensures smooth 60fps rendering
      this.animationFrameId = requestAnimationFrame(animate);
    };

    this.animationFrameId = requestAnimationFrame(animate);
  }

  /**
   * Preserve pointer cursor for interactive elements
   */
  private preserveInteractiveCursors(): void {
    try {
      // Check if style already exists
      if (document.getElementById('retroweb-cursor-preserve-style')) {
        return;
      }

      // Create style element to preserve pointer cursor on interactive elements
      const style = document.createElement('style');
      style.id = 'retroweb-cursor-preserve-style';
      style.textContent = `
        a[href],
        button,
        input[type="button"],
        input[type="submit"],
        input[type="reset"],
        select,
        [role="button"],
        [role="link"],
        [onclick],
        [tabindex]:not([tabindex="-1"]) {
          cursor: pointer !important;
        }
        
        input[type="text"],
        input[type="email"],
        input[type="password"],
        input[type="search"],
        input[type="tel"],
        input[type="url"],
        textarea {
          cursor: text !important;
        }
      `;
      document.head.appendChild(style);

      console.log('RetroWeb: Interactive cursor preservation applied');
    } catch (error) {
      console.warn('RetroWeb: Error preserving interactive cursors:', error);
    }
  }

  /**
   * Check if trail is currently enabled
   */
  isTrailEnabled(): boolean {
    return this.trailEnabled;
  }

  /**
   * Get count of active trail particles
   */
  getTrailParticleCount(): number {
    return this.trailParticles.length;
  }
}

/**
 * VintageElements - Manages vintage web elements like visitor counters and retro stickers
 * Handles counter display, sticker placement, and sound effects
 */
class VintageElements {
  private readonly COUNTER_CLASS = 'retroweb-visitor-counter';
  private readonly STICKER_CLASS = 'retroweb-sticker';
  private counterElement: HTMLElement | null = null;
  private stickerElements: HTMLElement[] = [];
  private visitorCount: number = 0;
  private audioContext: AudioContext | null = null;
  private hasUserInteracted: boolean = false;

  constructor() {
    // Initialize visitor count with a random number
    this.visitorCount = Math.floor(Math.random() * 999999) + 100000;
    
    // Listen for user interaction to enable sound effects
    this.setupUserInteractionListener();
  }

  /**
   * Create and display a visitor counter with segmented digit display
   */
  createVisitorCounter(): void {
    try {
      console.log('RetroWeb: Creating visitor counter');

      if (!document.body) {
        console.warn('RetroWeb: Document body not available');
        return;
      }

      // Remove existing counter if present
      if (this.counterElement) {
        this.counterElement.remove();
      }

      // Create counter container
      const counter = document.createElement('div');
      counter.className = this.COUNTER_CLASS;
      counter.setAttribute('data-retroweb', 'visitor-counter');

      // Style counter container
      counter.style.position = 'fixed';
      counter.style.bottom = '10px';
      counter.style.right = '10px';
      counter.style.backgroundColor = '#000000';
      counter.style.border = '3px solid #808080';
      counter.style.borderRadius = '5px';
      counter.style.padding = '10px 15px';
      counter.style.fontFamily = '"Courier New", monospace';
      counter.style.fontSize = '14px';
      counter.style.color = '#00ff00';
      counter.style.zIndex = '10000';
      counter.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.5), inset 0 0 10px rgba(0, 255, 0, 0.2)';
      counter.style.pointerEvents = 'none';
      counter.style.userSelect = 'none';

      // Create label
      const label = document.createElement('div');
      label.textContent = 'VISITORS:';
      label.style.fontSize = '10px';
      label.style.marginBottom = '5px';
      label.style.letterSpacing = '1px';
      label.style.color = '#00ff00';
      label.style.textAlign = 'center';

      // Create digit display container
      const digitDisplay = document.createElement('div');
      digitDisplay.style.display = 'flex';
      digitDisplay.style.gap = '3px';
      digitDisplay.style.justifyContent = 'center';

      // Convert count to string and pad to 6 digits
      const countStr = this.visitorCount.toString().padStart(6, '0');

      // Create segmented digit displays
      for (let i = 0; i < countStr.length; i++) {
        const digit = this.createSegmentedDigit(countStr[i]);
        digitDisplay.appendChild(digit);
      }

      // Assemble counter
      counter.appendChild(label);
      counter.appendChild(digitDisplay);

      // Add to page
      document.body.appendChild(counter);
      this.counterElement = counter;

      // Increment counter periodically
      this.startCounterIncrement();

      console.log(`RetroWeb: Visitor counter created with count: ${this.visitorCount}`);
    } catch (error) {
      console.error('RetroWeb: Error creating visitor counter:', error);
    }
  }

  /**
   * Create a segmented digit display for a single digit
   */
  private createSegmentedDigit(digit: string): HTMLElement {
    const digitContainer = document.createElement('div');
    digitContainer.style.width = '20px';
    digitContainer.style.height = '30px';
    digitContainer.style.backgroundColor = '#0a0a0a';
    digitContainer.style.border = '1px solid #333333';
    digitContainer.style.borderRadius = '3px';
    digitContainer.style.display = 'flex';
    digitContainer.style.alignItems = 'center';
    digitContainer.style.justifyContent = 'center';
    digitContainer.style.fontFamily = '"Courier New", monospace';
    digitContainer.style.fontSize = '20px';
    digitContainer.style.fontWeight = 'bold';
    digitContainer.style.color = '#00ff00';
    digitContainer.style.textShadow = '0 0 5px #00ff00, 0 0 10px #00ff00';
    digitContainer.style.boxShadow = 'inset 0 0 5px rgba(0, 255, 0, 0.3)';
    digitContainer.textContent = digit;

    return digitContainer;
  }

  /**
   * Start incrementing the visitor counter periodically
   */
  private startCounterIncrement(): void {
    // Increment counter every 5-10 seconds
    const incrementInterval = setInterval(() => {
      if (!this.counterElement || !this.counterElement.parentElement) {
        clearInterval(incrementInterval);
        return;
      }

      // Increment count
      this.visitorCount++;

      // Update display
      const digitDisplay = this.counterElement.querySelector('div:last-child');
      if (digitDisplay) {
        // Clear existing digits
        digitDisplay.innerHTML = '';

        // Create new digits
        const countStr = this.visitorCount.toString().padStart(6, '0');
        for (let i = 0; i < countStr.length; i++) {
          const digit = this.createSegmentedDigit(countStr[i]);
          digitDisplay.appendChild(digit);
        }
      }
    }, Math.random() * 5000 + 5000); // Random interval between 5-10 seconds
  }

  /**
   * Add retro stickers (badges and ribbons) to the page
   * @param stickerTypes Array of sticker type names to use
   */
  async addRetroStickers(stickerTypes: string[]): Promise<void> {
    try {
      console.log('RetroWeb: Adding retro stickers', stickerTypes);

      if (!document.body) {
        console.warn('RetroWeb: Document body not available');
        return;
      }

      // Get available sticker assets
      const availableStickers = this.getAvailableStickers(stickerTypes);
      if (availableStickers.length === 0) {
        console.warn('RetroWeb: No sticker assets available');
        return;
      }

      // Place 2-4 stickers in corners/edges
      const stickerCount = Math.floor(Math.random() * 3) + 2; // 2-4 stickers
      const positions = this.getCornerEdgePositions(stickerCount);

      const stickerPromises: Promise<void>[] = [];
      for (let i = 0; i < stickerCount && i < availableStickers.length; i++) {
        const stickerKey = availableStickers[i % availableStickers.length];
        const stickerInfo = assetRegistry.stickers[stickerKey];
        const position = positions[i];

        if (stickerInfo && position) {
          stickerPromises.push(this.createAndPositionSticker(stickerKey, stickerInfo, position));
        }
      }

      // Wait for all stickers to be placed (with fallbacks if needed)
      await Promise.allSettled(stickerPromises);

      console.log(`RetroWeb: Added ${this.stickerElements.length} retro stickers`);
    } catch (error) {
      console.error('RetroWeb: Error adding retro stickers:', error);
    }
  }

  /**
   * Play a retro 8-bit sound effect
   * @param action Action type that triggered the sound ('click', 'hover', 'load')
   */
  playSoundEffect(action: string): void {
    try {
      // Only play sounds after user interaction (browser requirement)
      if (!this.hasUserInteracted) {
        console.log('RetroWeb: Waiting for user interaction before playing sounds');
        return;
      }

      console.log(`RetroWeb: Playing sound effect for action: ${action}`);

      // Initialize AudioContext if needed
      if (!this.audioContext) {
        try {
          this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        } catch (audioError) {
          console.warn('RetroWeb: AudioContext creation blocked (likely CSP restriction):', audioError);
          console.log('RetroWeb: Sound effects will be disabled, but other features will continue');
          return;
        }
      }

      // Generate 8-bit style sound based on action
      const now = this.audioContext.currentTime;
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Configure sound based on action type
      switch (action) {
        case 'click':
          // Short beep
          oscillator.frequency.setValueAtTime(800, now);
          oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.1);
          gainNode.gain.setValueAtTime(0.3, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
          oscillator.start(now);
          oscillator.stop(now + 0.1);
          break;

        case 'hover':
          // Quick blip
          oscillator.frequency.setValueAtTime(600, now);
          gainNode.gain.setValueAtTime(0.2, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
          oscillator.start(now);
          oscillator.stop(now + 0.05);
          break;

        case 'load':
          // Startup chime
          oscillator.frequency.setValueAtTime(400, now);
          oscillator.frequency.exponentialRampToValueAtTime(800, now + 0.2);
          gainNode.gain.setValueAtTime(0.3, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
          oscillator.start(now);
          oscillator.stop(now + 0.3);
          break;

        default:
          // Default beep
          oscillator.frequency.setValueAtTime(500, now);
          gainNode.gain.setValueAtTime(0.2, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
          oscillator.start(now);
          oscillator.stop(now + 0.1);
      }

      console.log('RetroWeb: Sound effect played');
    } catch (error) {
      // Check if this is a CSP error
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();
        if (errorMessage.includes('content security policy') || 
            errorMessage.includes('csp') ||
            errorMessage.includes('blocked')) {
          console.warn('RetroWeb: Sound effect blocked by CSP, continuing with other features');
        } else {
          console.error('RetroWeb: Error playing sound effect:', error);
        }
      } else {
        console.error('RetroWeb: Error playing sound effect:', error);
      }
    }
  }

  /**
   * Remove all vintage elements from the page
   */
  removeVintageElements(): void {
    try {
      console.log('RetroWeb: Removing vintage elements');

      // Remove visitor counter
      if (this.counterElement) {
        this.counterElement.remove();
        this.counterElement = null;
      }

      // Remove stickers
      this.stickerElements.forEach(sticker => {
        try {
          sticker.remove();
        } catch (error) {
          console.warn('RetroWeb: Failed to remove sticker:', error);
        }
      });
      this.stickerElements = [];

      // Close audio context
      if (this.audioContext) {
        this.audioContext.close();
        this.audioContext = null;
      }

      console.log('RetroWeb: Vintage elements removed');
    } catch (error) {
      console.error('RetroWeb: Error removing vintage elements:', error);
    }
  }

  /**
   * Get available sticker assets based on requested types
   */
  private getAvailableStickers(stickerTypes: string[]): string[] {
    const allStickerKeys = Object.keys(assetRegistry.stickers);

    if (stickerTypes.length === 0) {
      return allStickerKeys;
    }

    // Map friendly names to asset keys
    const typeMapping: Record<string, string> = {
      'netscape-badge': 'netscapeBadge',
      'award-ribbon': 'awardRibbon'
    };

    const requestedKeys = stickerTypes
      .map(type => typeMapping[type] || type)
      .filter(key => allStickerKeys.includes(key));

    return requestedKeys.length > 0 ? requestedKeys : allStickerKeys;
  }

  /**
   * Get corner and edge positions for sticker placement
   */
  private getCornerEdgePositions(count: number): Array<{ position: string; offset: { x: number; y: number } }> {
    const positions = [
      { position: 'top-left', offset: { x: 10, y: 10 } },
      { position: 'top-right', offset: { x: -10, y: 10 } },
      { position: 'bottom-left', offset: { x: 10, y: -10 } },
      { position: 'bottom-right', offset: { x: -10, y: -10 } }
    ];

    // Shuffle positions and return requested count
    const shuffled = positions.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  /**
   * Create and position a single sticker element
   */
  private async createAndPositionSticker(
    stickerKey: string,
    stickerInfo: { url?: string; width?: number; height?: number },
    position: { position: string; offset: { x: number; y: number } }
  ): Promise<void> {
    try {
      // Skip if no URL provided
      if (!stickerInfo.url) {
        console.warn(`RetroWeb: Sticker ${stickerKey} has no URL`);
        return;
      }

      // Create sticker container
      const sticker = document.createElement('div');
      sticker.className = this.STICKER_CLASS;
      sticker.setAttribute('data-retroweb', 'sticker');
      sticker.setAttribute('data-sticker-type', stickerKey);

      // Create img element
      const img = document.createElement('img');
      img.alt = 'Retro sticker';
      
      // Load resource with fallback
      const resourceUrl = chrome.runtime.getURL(stickerInfo.url);
      const loadedUrl = await resourceLoader.loadImageResource(resourceUrl, fallbackAssets.sticker);
      img.src = loadedUrl;

      // Set dimensions if available
      if (stickerInfo.width) {
        img.style.width = `${stickerInfo.width}px`;
      }
      if (stickerInfo.height) {
        img.style.height = `${stickerInfo.height}px`;
      }

      // Style container for fixed positioning
      sticker.style.position = 'fixed';
      sticker.style.pointerEvents = 'none';
      sticker.style.zIndex = '9999';
      sticker.style.userSelect = 'none';

      // Position based on corner/edge
      const pos = position.position;
      if (pos.includes('top')) {
        sticker.style.top = `${Math.abs(position.offset.y)}px`;
      } else {
        sticker.style.bottom = `${Math.abs(position.offset.y)}px`;
      }

      if (pos.includes('left')) {
        sticker.style.left = `${Math.abs(position.offset.x)}px`;
      } else {
        sticker.style.right = `${Math.abs(position.offset.x)}px`;
      }

      // Add image to container
      sticker.appendChild(img);

      // Add to page
      document.body.appendChild(sticker);

      // Track sticker
      this.stickerElements.push(sticker);
    } catch (error) {
      console.error('RetroWeb: Error creating sticker:', error);
    }
  }

  /**
   * Setup listener for user interaction to enable sound effects
   */
  private setupUserInteractionListener(): void {
    const enableSounds = () => {
      this.hasUserInteracted = true;
      console.log('RetroWeb: User interaction detected, sounds enabled');

      // Remove listeners after first interaction
      document.removeEventListener('click', enableSounds);
      document.removeEventListener('keydown', enableSounds);
      document.removeEventListener('touchstart', enableSounds);
    };

    document.addEventListener('click', enableSounds, { once: true });
    document.addEventListener('keydown', enableSounds, { once: true });
    document.addEventListener('touchstart', enableSounds, { once: true });
  }

  /**
   * Get the current visitor count
   */
  getVisitorCount(): number {
    return this.visitorCount;
  }

  /**
   * Get count of placed stickers
   */
  getStickerCount(): number {
    return this.stickerElements.length;
  }

  /**
   * Check if counter is currently displayed
   */
  hasCounter(): boolean {
    return this.counterElement !== null && this.counterElement.parentElement !== null;
  }
}

/**
 * ElementTransformer - Transforms divs, buttons, links, inputs, and images with theme-specific styles
 * Handles comprehensive element styling while preserving functionality
 */
class ElementTransformer {
  private transformedElements: Set<Element> = new Set();
  private originalStyles: Map<Element, string> = new Map();
  private currentTheme: string = '';
  private readonly TRANSFORM_CLASSES = {
    div: 'retro-div',
    button: 'retro-button',
    link: 'retro-link',
    input: 'retro-input',
    image: 'retro-image',
    interactive: 'retro-interactive',
    preserve: 'retro-preserve-function'
  };

  /**
   * Apply theme-specific transformations to all page elements
   * @param themeName Theme identifier for CSS class application
   */
  applyTransformations(themeName: string): void {
    try {
      console.log(`ElementTransformer: Applying transformations for theme: ${themeName}`);

      if (!document.body) {
        console.warn('ElementTransformer: Document body not available');
        return;
      }

      // Store current theme
      this.currentTheme = themeName;

      // Set theme attribute on body for CSS targeting
      document.body.setAttribute('data-retro-theme', themeName);
      console.log(`ElementTransformer: Set body attribute data-retro-theme="${themeName}"`);

      // Transform different element types
      this.transformDivs();
      this.transformButtons();
      this.transformLinks();
      this.transformInputs();
      this.transformImages();

      console.log(`ElementTransformer: Transformed ${this.transformedElements.size} total elements`);
      
      // Log what was actually transformed
      const divs = document.querySelectorAll('.retro-div').length;
      const buttons = document.querySelectorAll('.retro-button').length;
      const links = document.querySelectorAll('.retro-link').length;
      const inputs = document.querySelectorAll('.retro-input').length;
      const images = document.querySelectorAll('.retro-image').length;
      console.log(`ElementTransformer: Applied classes - divs: ${divs}, buttons: ${buttons}, links: ${links}, inputs: ${inputs}, images: ${images}`);
    } catch (error) {
      console.error('ElementTransformer: Error applying transformations:', error);
    }
  }

  /**
   * Transform major content divs and sections
   */
  private transformDivs(): void {
    try {
      const selectors = [
        'main',
        'article',
        'section',
        'aside',
        'nav',
        'header',
        'footer',
        '.content',
        '.container',
        '[role="main"]',
        '[role="article"]',
        '[role="complementary"]'
      ];

      const elements: Element[] = [];
      selectors.forEach(selector => {
        try {
          const found = document.querySelectorAll(selector);
          elements.push(...Array.from(found));
        } catch (error) {
          // Ignore selector errors
        }
      });

      elements.forEach(element => {
        try {
          // Skip if already transformed or too small
          if (this.transformedElements.has(element)) return;

          const rect = element.getBoundingClientRect();
          if (rect.width < 100 || rect.height < 50) return;

          // Store original style
          const htmlElement = element as HTMLElement;
          this.originalStyles.set(element, htmlElement.getAttribute('style') || '');

          // Apply retro styling
          htmlElement.classList.add(this.TRANSFORM_CLASSES.div);
          htmlElement.setAttribute('data-retro-transformed', 'div');

          // Adaptive text color and background based on theme
          // Detect if the original site has a dark or light theme
          const computedStyle = window.getComputedStyle(htmlElement);
          const bgColor = computedStyle.backgroundColor;
          
          // For Windows 95 theme, ALWAYS force gray background
          if (this.currentTheme === 'windows-95') {
            htmlElement.style.setProperty('background-color', '#c0c0c0', 'important');
            htmlElement.style.setProperty('background-image', 'none', 'important');
            htmlElement.style.setProperty('color', '#000000', 'important');
          }
          
          // For other themes, adapt text color based on background luminance
          if (bgColor && bgColor !== 'transparent' && bgColor !== 'rgba(0, 0, 0, 0)') {
            const rgbMatch = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
            if (rgbMatch) {
              const r = parseInt(rgbMatch[1], 10);
              const g = parseInt(rgbMatch[2], 10);
              const b = parseInt(rgbMatch[3], 10);
              const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
              
              // Geocities Chaos theme - ensure readable text
              if (this.currentTheme === 'geocities-chaos') {
                if (luminance < 0.3) {
                  // Very dark background - use bright text
                  htmlElement.style.setProperty('color', '#ffff00', 'important');
                } else if (luminance < 0.5) {
                  // Dark background - use white text
                  htmlElement.style.setProperty('color', '#ffffff', 'important');
                } else {
                  // Light background - use dark text
                  htmlElement.style.setProperty('color', '#000000', 'important');
                }
              }
              
              // Neon Cyber theme - ensure text is visible
              if (this.currentTheme === 'neon-cyber-2001') {
                if (luminance > 0.5) {
                  // Light background - use green text
                  htmlElement.style.setProperty('color', '#00ff00', 'important');
                } else {
                  // Dark background - use cyan text
                  htmlElement.style.setProperty('color', '#00ffff', 'important');
                }
              }
              
              // Pixel Arcade theme - ensure text contrast
              if (this.currentTheme === 'pixel-arcade') {
                if (luminance > 0.5) {
                  // Light background - use dark blue text
                  htmlElement.style.setProperty('color', '#000080', 'important');
                } else {
                  // Dark background - use yellow text
                  htmlElement.style.setProperty('color', '#ffff00', 'important');
                }
              }
              
              // VHS Glitch theme - ensure text contrast
              if (this.currentTheme === 'vhs-glitch') {
                if (luminance > 0.5) {
                  // Light background - use dark text
                  htmlElement.style.setProperty('color', '#000000', 'important');
                } else {
                  // Dark background - use white text
                  htmlElement.style.setProperty('color', '#ffffff', 'important');
                }
              }
              
              // Stickerbomb theme - ensure text contrast
              if (this.currentTheme === 'stickerbomb') {
                if (luminance > 0.5) {
                  // Light background - use dark text
                  htmlElement.style.setProperty('color', '#000000', 'important');
                } else {
                  // Dark background - use white text
                  htmlElement.style.setProperty('color', '#ffffff', 'important');
                }
              }
            }
          }

          this.transformedElements.add(element);
        } catch (error) {
          // Ignore individual element errors
        }
      });

      console.log(`ElementTransformer: Transformed ${elements.length} divs/sections`);
    } catch (error) {
      console.error('ElementTransformer: Error transforming divs:', error);
    }
  }

  /**
   * Transform buttons with theme-specific styling
   */
  private transformButtons(): void {
    try {
      const buttons = document.querySelectorAll('button, input[type="button"], input[type="submit"], input[type="reset"], [role="button"]');

      let count = 0;
      buttons.forEach(button => {
        try {
          if (this.transformedElements.has(button)) return;

          const htmlButton = button as HTMLElement;
          
          // Store original style
          this.originalStyles.set(button, htmlButton.getAttribute('style') || '');

          // Apply retro styling
          htmlButton.classList.add(this.TRANSFORM_CLASSES.button, this.TRANSFORM_CLASSES.interactive, this.TRANSFORM_CLASSES.preserve);
          htmlButton.setAttribute('data-retro-transformed', 'button');

          this.transformedElements.add(button);
          count++;
        } catch (error) {
          // Ignore individual element errors
        }
      });

      console.log(`ElementTransformer: Transformed ${count} buttons`);
    } catch (error) {
      console.error('ElementTransformer: Error transforming buttons:', error);
    }
  }

  /**
   * Transform links with theme-specific styling
   */
  private transformLinks(): void {
    try {
      const links = document.querySelectorAll('a[href], [role="link"]');

      let count = 0;
      links.forEach(link => {
        try {
          if (this.transformedElements.has(link)) return;

          const htmlLink = link as HTMLElement;
          
          // Skip if link has no text content
          if (!htmlLink.textContent?.trim()) return;

          // Store original style
          this.originalStyles.set(link, htmlLink.getAttribute('style') || '');

          // Apply retro styling
          htmlLink.classList.add(this.TRANSFORM_CLASSES.link, this.TRANSFORM_CLASSES.interactive, this.TRANSFORM_CLASSES.preserve);
          htmlLink.setAttribute('data-retro-transformed', 'link');

          this.transformedElements.add(link);
          count++;
        } catch (error) {
          // Ignore individual element errors
        }
      });

      console.log(`ElementTransformer: Transformed ${count} links`);
    } catch (error) {
      console.error('ElementTransformer: Error transforming links:', error);
    }
  }

  /**
   * Transform form inputs with theme-specific styling
   */
  private transformInputs(): void {
    try {
      const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], input[type="search"], input[type="tel"], input[type="url"], input[type="number"], textarea, select');

      let count = 0;
      inputs.forEach(input => {
        try {
          if (this.transformedElements.has(input)) return;

          const htmlInput = input as HTMLElement;
          
          // Store original style
          this.originalStyles.set(input, htmlInput.getAttribute('style') || '');

          // Apply retro styling
          htmlInput.classList.add(this.TRANSFORM_CLASSES.input, this.TRANSFORM_CLASSES.interactive, this.TRANSFORM_CLASSES.preserve);
          htmlInput.setAttribute('data-retro-transformed', 'input');

          this.transformedElements.add(input);
          count++;
        } catch (error) {
          // Ignore individual element errors
        }
      });

      console.log(`ElementTransformer: Transformed ${count} inputs`);
    } catch (error) {
      console.error('ElementTransformer: Error transforming inputs:', error);
    }
  }

  /**
   * Transform images with theme-specific borders and effects
   */
  private transformImages(): void {
    try {
      const images = document.querySelectorAll('img');

      let count = 0;
      images.forEach(image => {
        try {
          if (this.transformedElements.has(image)) return;

          const htmlImage = image as HTMLElement;
          
          // Skip if image is too small (likely icon or decoration)
          const rect = htmlImage.getBoundingClientRect();
          if (rect.width < 50 || rect.height < 50) return;

          // Store original style
          this.originalStyles.set(image, htmlImage.getAttribute('style') || '');

          // Apply retro styling
          htmlImage.classList.add(this.TRANSFORM_CLASSES.image);
          htmlImage.setAttribute('data-retro-transformed', 'image');

          this.transformedElements.add(image);
          count++;
        } catch (error) {
          // Ignore individual element errors
        }
      });

      console.log(`ElementTransformer: Transformed ${count} images`);
    } catch (error) {
      console.error('ElementTransformer: Error transforming images:', error);
    }
  }

  /**
   * Remove all transformations and restore original styles
   */
  removeTransformations(): void {
    try {
      console.log('ElementTransformer: Removing transformations');

      // Remove theme attribute from body
      if (document.body) {
        document.body.removeAttribute('data-retro-theme');
      }

      // Restore all transformed elements
      this.transformedElements.forEach(element => {
        try {
          const htmlElement = element as HTMLElement;
          
          // Remove retro classes
          Object.values(this.TRANSFORM_CLASSES).forEach(className => {
            htmlElement.classList.remove(className);
          });

          // Remove retro attribute
          htmlElement.removeAttribute('data-retro-transformed');

          // Restore original style
          const originalStyle = this.originalStyles.get(element);
          if (originalStyle !== undefined) {
            if (originalStyle) {
              htmlElement.setAttribute('style', originalStyle);
            } else {
              htmlElement.removeAttribute('style');
            }
          }
        } catch (error) {
          console.warn('ElementTransformer: Failed to restore element:', error);
        }
      });

      // Clear tracking
      this.transformedElements.clear();
      this.originalStyles.clear();

      console.log('ElementTransformer: All transformations removed');
    } catch (error) {
      console.error('ElementTransformer: Error removing transformations:', error);
    }
  }

  /**
   * Get count of transformed elements
   */
  getTransformedCount(): number {
    return this.transformedElements.size;
  }

  /**
   * Transform newly added elements (for dynamic content)
   * @param themeName Current theme name
   * @param elements Array of elements to transform
   */
  transformNewElements(themeName: string, elements: Element[]): void {
    try {
      if (!document.body) return;

      // Ensure theme attribute is set
      document.body.setAttribute('data-retro-theme', themeName);

      elements.forEach(element => {
        try {
          // Skip if already transformed
          if (this.transformedElements.has(element)) return;

          const htmlElement = element as HTMLElement;
          const tagName = element.tagName.toLowerCase();

          // Determine element type and apply appropriate styling
          if (tagName === 'button' || element.getAttribute('role') === 'button') {
            this.originalStyles.set(element, htmlElement.getAttribute('style') || '');
            htmlElement.classList.add(this.TRANSFORM_CLASSES.button, this.TRANSFORM_CLASSES.interactive, this.TRANSFORM_CLASSES.preserve);
            htmlElement.setAttribute('data-retro-transformed', 'button');
            this.transformedElements.add(element);
          } else if (tagName === 'a' && element.hasAttribute('href')) {
            if (htmlElement.textContent?.trim()) {
              this.originalStyles.set(element, htmlElement.getAttribute('style') || '');
              htmlElement.classList.add(this.TRANSFORM_CLASSES.link, this.TRANSFORM_CLASSES.interactive, this.TRANSFORM_CLASSES.preserve);
              htmlElement.setAttribute('data-retro-transformed', 'link');
              this.transformedElements.add(element);
            }
          } else if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
            this.originalStyles.set(element, htmlElement.getAttribute('style') || '');
            htmlElement.classList.add(this.TRANSFORM_CLASSES.input, this.TRANSFORM_CLASSES.interactive, this.TRANSFORM_CLASSES.preserve);
            htmlElement.setAttribute('data-retro-transformed', 'input');
            this.transformedElements.add(element);
          } else if (tagName === 'img') {
            const rect = htmlElement.getBoundingClientRect();
            if (rect.width >= 50 && rect.height >= 50) {
              this.originalStyles.set(element, htmlElement.getAttribute('style') || '');
              htmlElement.classList.add(this.TRANSFORM_CLASSES.image);
              htmlElement.setAttribute('data-retro-transformed', 'image');
              this.transformedElements.add(element);
            }
          }
        } catch (error) {
          // Ignore individual element errors
        }
      });
    } catch (error) {
      console.error('ElementTransformer: Error transforming new elements:', error);
    }
  }
}

/**
 * RetroTransformer - Main controller for retro transformations
 * Manages activation, deactivation, theme application, and settings updates
 */
class RetroTransformer {
  private isActive: boolean = false;
  private currentSettings: Settings | null = null;
  private originalDOMState: {
    bodyClasses: string[];
    bodyStyles: string;
    documentTitle: string;
  } | null = null;
  private backgroundStyler: BackgroundStyler = new BackgroundStyler();
  private fontTransformer: FontTransformer = new FontTransformer();
  private cursorCustomizer: CursorCustomizer = new CursorCustomizer();
  private vintageElements: VintageElements = new VintageElements();
  private elementTransformer: ElementTransformer = new ElementTransformer();
  private elementDetector: ElementDetector = new ElementDetector();
  private windowsCrashEffect: WindowsCrashEffect = new WindowsCrashEffect();
  
  // Compatibility features
  private mutationObserver: MutationObserver | null = null;
  private lastUrl: string = '';
  private debounceTimer: number | null = null;
  private periodicScanInterval: number | null = null;
  private readonly DEBOUNCE_DELAY = 100; // milliseconds - reduced for faster response
  private readonly PERIODIC_SCAN_INTERVAL = 1000; // scan every 1 second

  /**
   * Detect incompatibilities with the current page structure
   * @returns Object describing detected incompatibilities
   */
  private detectIncompatibilities(): {
    hasIssues: boolean;
    critical: boolean;
    issues: string[];
    warnings: string[];
  } {
    const result = {
      hasIssues: false,
      critical: false,
      issues: [] as string[],
      warnings: [] as string[]
    };

    try {
      console.log('RetroWeb: Detecting page incompatibilities');

      // Check if document.body exists
      if (!document.body) {
        result.hasIssues = true;
        result.critical = true;
        result.issues.push('Document body not available');
        return result;
      }

      // Check for heavy use of Shadow DOM
      const shadowRoots = this.countShadowRoots();
      if (shadowRoots > 10) {
        result.hasIssues = true;
        result.warnings.push(`Heavy Shadow DOM usage detected (${shadowRoots} shadow roots). Some styling may not apply.`);
      }

      // Check for iframes
      const iframes = document.querySelectorAll('iframe').length;
      if (iframes > 5) {
        result.hasIssues = true;
        result.warnings.push(`Multiple iframes detected (${iframes}). Retro effects will not apply inside iframes.`);
      }

      // Check for very complex DOM (performance concern)
      const elementCount = document.querySelectorAll('*').length;
      if (elementCount > 10000) {
        result.hasIssues = true;
        result.warnings.push(`Very large DOM detected (${elementCount} elements). Performance may be impacted.`);
      }

      // Check for strict CSP
      const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
      if (cspMeta) {
        const cspContent = cspMeta.getAttribute('content') || '';
        if (cspContent.includes("'none'") || cspContent.includes('strict-dynamic')) {
          result.hasIssues = true;
          result.warnings.push('Strict Content Security Policy detected. Some features may be limited.');
        }
      }

      // Check for canvas-heavy pages (WebGL apps, games)
      const canvases = document.querySelectorAll('canvas').length;
      if (canvases > 3) {
        result.hasIssues = true;
        result.warnings.push(`Canvas-heavy page detected (${canvases} canvases). Retro effects may interfere with rendering.`);
      }

      // Check for full-screen video players
      const videos = document.querySelectorAll('video');
      videos.forEach(video => {
        const rect = video.getBoundingClientRect();
        if (rect.width > window.innerWidth * 0.8 && rect.height > window.innerHeight * 0.8) {
          result.hasIssues = true;
          result.warnings.push('Full-screen video player detected. Retro overlays may interfere with playback.');
        }
      });

      // Check for React/Vue/Angular apps with frequent re-renders
      const hasReact = !!(window as any).React || document.querySelector('[data-reactroot]');
      const hasVue = !!(window as any).Vue || document.querySelector('[data-v-]');
      const hasAngular = !!(window as any).ng || document.querySelector('[ng-version]');
      
      if (hasReact || hasVue || hasAngular) {
        result.hasIssues = true;
        result.warnings.push('SPA framework detected. Dynamic content observer will handle re-renders.');
      }

      // Check for pages that override cursor globally
      const bodyStyle = window.getComputedStyle(document.body);
      if (bodyStyle.cursor && bodyStyle.cursor !== 'auto' && bodyStyle.cursor !== 'default') {
        result.hasIssues = true;
        result.warnings.push('Page has custom cursor styling. Retro cursor may conflict.');
      }

      if (result.issues.length > 0 || result.warnings.length > 0) {
        result.hasIssues = true;
      }

      console.log('RetroWeb: Incompatibility detection complete:', result);
      return result;
    } catch (error) {
      console.error('RetroWeb: Error detecting incompatibilities:', error);
      return result;
    }
  }

  /**
   * Count shadow roots in the document
   */
  private countShadowRoots(): number {
    let count = 0;
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_ELEMENT,
      null
    );

    let node: Node | null = walker.currentNode;
    while (node) {
      if ((node as Element).shadowRoot) {
        count++;
      }
      node = walker.nextNode();
    }

    return count;
  }

  /**
   * Notify background script about incompatibilities
   * This allows the popup UI to display warnings to the user
   */
  private notifyIncompatibilities(incompatibilities: {
    hasIssues: boolean;
    critical: boolean;
    issues: string[];
    warnings: string[];
  }): void {
    try {
      chrome.runtime.sendMessage({
        type: 'INCOMPATIBILITY_DETECTED',
        incompatibilities
      }).catch((error) => {
        // Silently ignore if background script is not available
        console.debug('RetroWeb: Could not notify background script:', error);
      });
    } catch (error) {
      console.debug('RetroWeb: Error notifying incompatibilities:', error);
    }
  }

  /**
   * Activate the retro layer on the current page
   */
  async activate(): Promise<void> {
    try {
      if (this.isActive) {
        console.log('RetroWeb: Already active, skipping activation');
        return;
      }

      console.log('RetroWeb: Activating retro layer');

      // Detect incompatibilities before activation
      const incompatibilities = this.detectIncompatibilities();
      if (incompatibilities.hasIssues) {
        console.warn('RetroWeb: Incompatibilities detected:', incompatibilities);
        
        // Notify background script about incompatibilities
        this.notifyIncompatibilities(incompatibilities);
        
        // Continue with activation unless critical issues found
        if (incompatibilities.critical) {
          console.error('RetroWeb: Critical incompatibilities found, activation aborted');
          return;
        }
      }

      // Capture original DOM state for round-trip verification
      this.captureDOMState();

      // Apply current theme or default settings
      if (this.currentSettings) {
        await this.applyCurrentSettings();
      }

      // Ensure interactive elements remain accessible
      this.ensureInteractiveAccessibility();

      // Verify interactive elements are functional
      const verification = this.verifyInteractiveElements();
      if (!verification.allFunctional) {
        console.warn('RetroWeb: Some interactive elements may be blocked:', verification);
      }

      this.isActive = true;
      console.log('RetroWeb: Activation complete');
    } catch (error) {
      this.handleError('activate', error);
    }
  }

  /**
   * Deactivate the retro layer and restore original page state
   */
  deactivate(): void {
    try {
      if (!this.isActive) {
        console.log('RetroWeb: Not active, skipping deactivation');
        return;
      }

      console.log('RetroWeb: Deactivating retro layer');

      // Stop observing dynamic content
      this.stopDynamicContentObserver();

      // Restore interactive element properties
      this.restoreInteractiveProperties();

      // Remove all retro elements and restore original state
      this.removeAllRetroElements();
      this.restoreDOMState();

      this.isActive = false;
      console.log('RetroWeb: Deactivation complete');
    } catch (error) {
      this.handleError('deactivate', error);
    }
  }

  /**
   * Apply a specific theme configuration
   */
  applyTheme(themeName: string): void {
    try {
      console.log(`RetroWeb: Applying theme: ${themeName}`);

      const theme = getTheme(themeName);
      if (!theme) {
        console.error(`RetroWeb: Theme not found: ${themeName}`);
        return;
      }

      // Remove existing retro elements before applying new theme
      if (this.isActive) {
        this.removeAllRetroElements();
      }

      // Apply theme-specific transformations
      // Note: Actual transformation logic will be implemented in later tasks
      // This method sets up the framework for theme application
      console.log(`RetroWeb: Theme ${themeName} applied`);
    } catch (error) {
      this.handleError('applyTheme', error);
    }
  }

  /**
   * Update settings dynamically without full reactivation
   */
  updateSettings(settings: Settings): void {
    try {
      console.log('RetroWeb: Updating settings', settings);

      this.currentSettings = settings;

      // If active, reapply with new settings
      if (this.isActive) {
        this.removeAllRetroElements();
        this.applyCurrentSettings();
        
        // Re-ensure interactive accessibility after applying new settings
        this.ensureInteractiveAccessibility();
      }

      console.log('RetroWeb: Settings updated successfully');
    } catch (error) {
      this.handleError('updateSettings', error);
    }
  }

  /**
   * Check if the retro layer is currently active
   */
  isRetroActive(): boolean {
    return this.isActive;
  }

  /**
   * Get current settings
   */
  getCurrentSettings(): Settings | null {
    return this.currentSettings;
  }

  /**
   * Capture the original DOM state for round-trip verification
   */
  private captureDOMState(): void {
    try {
      if (!document.body) {
        console.warn('RetroWeb: Document body not available for state capture');
        return;
      }

      this.originalDOMState = {
        bodyClasses: this.safeDOMOperation(
          () => Array.from(document.body.classList),
          [],
          'capture body classes'
        ),
        bodyStyles: this.safeDOMOperation(
          () => document.body.getAttribute('style') || '',
          '',
          'capture body styles'
        ),
        documentTitle: this.safeDOMOperation(
          () => document.title,
          '',
          'capture document title'
        )
      };
      console.log('RetroWeb: DOM state captured');
    } catch (error) {
      this.handleError('captureDOMState', error);
    }
  }

  /**
   * Restore the original DOM state
   */
  private restoreDOMState(): void {
    try {
      if (!this.originalDOMState) {
        console.warn('RetroWeb: No original DOM state to restore');
        return;
      }

      if (!document.body) {
        console.warn('RetroWeb: Document body not available for state restoration');
        return;
      }

      // Restore body classes
      this.safeDOMOperation(() => {
        document.body.className = '';
        this.originalDOMState!.bodyClasses.forEach(cls => {
          try {
            document.body.classList.add(cls);
          } catch (classError) {
            console.warn(`RetroWeb: Failed to restore class ${cls}:`, classError);
          }
        });
      }, undefined, 'restore body classes');

      // Restore body styles
      this.safeDOMOperation(() => {
        if (this.originalDOMState!.bodyStyles) {
          document.body.setAttribute('style', this.originalDOMState!.bodyStyles);
        } else {
          document.body.removeAttribute('style');
        }
      }, undefined, 'restore body styles');

      console.log('RetroWeb: DOM state restored');
    } catch (error) {
      this.handleError('restoreDOMState', error);
    }
  }

  /**
   * Apply current settings to the page
   */
  private async applyCurrentSettings(): Promise<void> {
    try {
      if (!this.currentSettings) {
        console.warn('RetroWeb: No settings to apply');
        return;
      }

      // Detect and mark page regions for smart styling
      console.log('RetroWeb: Detecting page regions for smart styling');
      this.elementDetector.markRegions();
      const regions = this.elementDetector.getAllRegions();
      console.log(`RetroWeb: Detected ${regions.heroes.length} heroes, ${regions.sidebars.length} sidebars, ${regions.footers.length} footers, ${regions.mainContent.length} main content areas`);

      // Get theme configuration
      let themeConfig: ReturnType<typeof getTheme> = undefined;
      if (this.currentSettings.currentTheme) {
        themeConfig = getTheme(this.currentSettings.currentTheme);
      }

      // Apply background if enabled
      if (this.currentSettings.customSettings.background.enabled) {
        const pattern = this.currentSettings.customSettings.background.pattern || 
                       (themeConfig?.background ?? 'stars');
        await this.backgroundStyler.applyTiledBackground(pattern);
        
        // Apply neon borders if theme has neon colors
        if (themeConfig?.colors?.neonBorder) {
          this.backgroundStyler.applyNeonBorders(themeConfig.colors.neonBorder);
        }
      }

      // Apply element transformations (divs, buttons, links, inputs, images)
      if (this.currentSettings.currentTheme) {
        this.elementTransformer.applyTransformations(this.currentSettings.currentTheme);
      }

      // Apply fonts if enabled
      if (this.currentSettings.customSettings.fonts.enabled) {
        const fontStyle = this.currentSettings.customSettings.fonts.style || 'comic-sans';
        this.fontTransformer.applyRetroFonts(fontStyle);
        
        // Apply neon glow to headings if theme has text glow color
        if (themeConfig?.colors?.textGlow && themeConfig.colors.textGlow !== 'none') {
          this.fontTransformer.addNeonGlow(themeConfig.colors.textGlow);
        }
        
        // Add blinking text to random elements (skip for Windows 95 theme)
        if (this.currentSettings.currentTheme !== 'windows-95') {
          this.fontTransformer.addBlinkingText();
        }
      }

      // Apply cursor customization if enabled
      if (this.currentSettings.customSettings.cursor.enabled) {
        const cursorType = this.currentSettings.customSettings.cursor.type || 'sparkle';
        await this.cursorCustomizer.setCursor(cursorType);
        
        // Enable cursor trail if configured
        if (this.currentSettings.customSettings.cursor.trail) {
          this.cursorCustomizer.enableTrail();
        }
      }

      // Apply vintage elements if enabled
      if (this.currentSettings.customSettings.vintage.counter) {
        this.vintageElements.createVisitorCounter();
      }

      if (this.currentSettings.customSettings.vintage.stickers) {
        const stickerTypes = themeConfig?.vintage?.stickers || ['netscape-badge', 'award-ribbon'];
        await this.vintageElements.addRetroStickers(stickerTypes);
      }

      if (this.currentSettings.customSettings.vintage.sounds) {
        // Play startup sound
        this.vintageElements.playSoundEffect('load');
      }

      console.log('RetroWeb: Current settings applied');
      
      // Log resource loading statistics
      const stats = resourceLoader.getStats();
      console.log(`RetroWeb: Resource loading stats - Loaded: ${stats.loaded}, Failed: ${stats.failed}`);
    } catch (error) {
      this.handleError('applyCurrentSettings', error);
    }
  }

  /**
   * Remove all retro elements from the page
   */
  private removeAllRetroElements(): void {
    try {
      // Remove region markers
      this.elementDetector.unmarkRegions();

      // Remove element transformations
      this.elementTransformer.removeTransformations();

      // Remove backgrounds and overlays
      this.backgroundStyler.removeBackgrounds();

      // Remove font transformations
      this.fontTransformer.removeFonts();

      // Remove cursor customizations
      this.cursorCustomizer.removeCursor();

      // Stop Windows crash effect if active
      this.windowsCrashEffect.stopCrashEffect();

      // Remove vintage elements
      this.vintageElements.removeVintageElements();

      // Remove all elements with retro-specific classes
      const retroElements = document.querySelectorAll('[data-retroweb]');
      retroElements.forEach(element => {
        try {
          element.remove();
        } catch (removeError) {
          console.warn('RetroWeb: Failed to remove element:', removeError);
        }
      });

      // Remove retro-specific classes from body
      if (document.body) {
        document.body.classList.remove('retroweb-active');
      }

      console.log('RetroWeb: All retro elements removed');
    } catch (error) {
      this.handleError('removeAllRetroElements', error);
    }
  }

  /**
   * Safe DOM operation wrapper
   */
  private safeDOMOperation<T>(operation: () => T, fallback: T, operationName: string): T {
    try {
      return operation();
    } catch (error) {
      console.warn(`RetroWeb: DOM operation failed (${operationName}):`, error);
      return fallback;
    }
  }

  /**
   * Handle errors with proper isolation and logging
   */
  private handleError(method: string, error: unknown): void {
    // Log error without breaking page functionality
    console.error(`RetroWeb Error in ${method}:`, error);

    // Check for CSP errors
    if (error instanceof Error) {
      if (this.isCSPError(error)) {
        console.warn('RetroWeb: CSP restriction detected, some features may be limited');
        this.handleCSPError(error, method);
      }
    }

    // Error is isolated - page functionality continues
  }

  /**
   * Detect if an error is related to Content Security Policy
   */
  private isCSPError(error: Error): boolean {
    const errorMessage = error.message.toLowerCase();
    const cspIndicators = [
      'content security policy',
      'csp',
      'unsafe-inline',
      'unsafe-eval',
      'refused to execute inline script',
      'refused to load',
      'blocked by content security policy',
      'violates the following content security policy directive'
    ];

    return cspIndicators.some(indicator => errorMessage.includes(indicator));
  }

  /**
   * Handle Content Security Policy errors specifically
   * Logs the error and attempts to continue with CSP-compatible features
   */
  private handleCSPError(error: Error, method: string): void {
    try {
      console.group('RetroWeb: CSP Error Details');
      console.warn(`Method: ${method}`);
      console.warn(`Error: ${error.message}`);
      console.warn('Stack:', error.stack);
      console.groupEnd();

      console.log('RetroWeb: Attempting to continue with CSP-compatible features');
      
      // CSP errors are logged but don't stop execution
      // Compatible effects will continue to be applied
      // Features that may be affected:
      // - Inline styles (we use external stylesheets and style attributes)
      // - External resources (we use chrome.runtime.getURL for assets)
      // - Audio context (may be blocked, but we handle gracefully)
      
      // Mark that we've encountered CSP issues for this session
      if (!this.currentSettings) {
        return;
      }

      // Log which features might be affected
      console.log('RetroWeb: CSP-compatible features will continue to work:');
      console.log('  ✓ GIF injections (using chrome.runtime.getURL)');
      console.log('  ✓ Background patterns (using chrome.runtime.getURL)');
      console.log('  ✓ Font replacements (using CSS)');
      console.log('  ✓ Cursor customization (using chrome.runtime.getURL)');
      console.log('  ✓ Vintage elements (DOM manipulation)');
      console.log('  ⚠ Sound effects (may be blocked by CSP)');
      
    } catch (fallbackError) {
      console.error('RetroWeb: CSP error handling failed:', fallbackError);
    }
  }

  /**
   * Detect when page finishes loading and apply effects if enabled
   * Handles different page load states (loading, interactive, complete)
   */
  detectPageLoad(): void {
    try {
      console.log(`RetroWeb: Detecting page load state: ${document.readyState}`);

      if (document.readyState === 'complete') {
        // Page is already fully loaded
        this.handlePageLoaded();
      } else if (document.readyState === 'interactive') {
        // DOM is ready but resources may still be loading
        // Wait for full load
        window.addEventListener('load', () => this.handlePageLoaded(), { once: true });
      } else {
        // Page is still loading
        // Wait for DOMContentLoaded first, then full load
        document.addEventListener('DOMContentLoaded', () => {
          console.log('RetroWeb: DOM content loaded');
        }, { once: true });
        
        window.addEventListener('load', () => this.handlePageLoaded(), { once: true });
      }
    } catch (error) {
      this.handleError('detectPageLoad', error);
    }
  }

  /**
   * Handle page loaded event
   */
  private handlePageLoaded(): void {
    try {
      console.log('RetroWeb: Page fully loaded');

      // Apply effects if extension is enabled
      if (this.currentSettings?.enabled && !this.isActive) {
        console.log('RetroWeb: Auto-applying effects after page load');
        this.activate();
      }

      // Start observing for SPA navigation and dynamic content
      this.startSPANavigationDetection();
      this.startDynamicContentObserver();
    } catch (error) {
      this.handleError('handlePageLoaded', error);
    }
  }

  /**
   * Start detecting SPA navigation changes using MutationObserver and history API
   * Reapplies effects when SPA navigates to new view
   */
  startSPANavigationDetection(): void {
    try {
      console.log('RetroWeb: Starting SPA navigation detection');

      // Store current URL for comparison
      this.lastUrl = window.location.href;

      // Listen for history API changes (pushState, replaceState)
      const originalPushState = history.pushState;
      const originalReplaceState = history.replaceState;

      history.pushState = (...args) => {
        originalPushState.apply(history, args);
        this.handleNavigationChange();
      };

      history.replaceState = (...args) => {
        originalReplaceState.apply(history, args);
        this.handleNavigationChange();
      };

      // Listen for popstate events (back/forward navigation)
      window.addEventListener('popstate', () => {
        this.handleNavigationChange();
      });

      // Also observe URL changes via MutationObserver on title element
      // (many SPAs update the title on navigation)
      const titleObserver = new MutationObserver(() => {
        const currentUrl = window.location.href;
        if (currentUrl !== this.lastUrl) {
          this.lastUrl = currentUrl;
          this.handleNavigationChange();
        }
      });

      const titleElement = document.querySelector('title');
      if (titleElement) {
        titleObserver.observe(titleElement, {
          childList: true,
          characterData: true,
          subtree: true
        });
      }

      console.log('RetroWeb: SPA navigation detection started');
    } catch (error) {
      this.handleError('startSPANavigationDetection', error);
    }
  }

  /**
   * Handle SPA navigation change
   */
  private handleNavigationChange(): void {
    try {
      const currentUrl = window.location.href;
      
      if (currentUrl !== this.lastUrl) {
        console.log(`RetroWeb: SPA navigation detected: ${this.lastUrl} -> ${currentUrl}`);
        this.lastUrl = currentUrl;

        // Reapply effects if active
        if (this.isActive && this.currentSettings) {
          console.log('RetroWeb: Reapplying effects after SPA navigation');
          
          // Delay to let SPA render new content (increased for better reliability)
          setTimeout(async () => {
            this.removeAllRetroElements();
            await this.applyCurrentSettings();
          }, 500);
        }
      }
    } catch (error) {
      this.handleError('handleNavigationChange', error);
    }
  }

  /**
   * Start observing DOM for dynamic content changes
   * Applies retro styling to dynamically added elements
   * Uses debouncing to optimize performance
   */
  startDynamicContentObserver(): void {
    try {
      console.log('RetroWeb: Starting dynamic content observer');

      // Don't start if already observing
      if (this.mutationObserver) {
        console.log('RetroWeb: Dynamic content observer already running');
        return;
      }

      // Create mutation observer with debounced callback
      this.mutationObserver = new MutationObserver((mutations) => {
        // Only process if retro layer is active
        if (!this.isActive) {
          return;
        }

        // Check if mutations include significant changes
        const hasSignificantChanges = mutations.some(mutation => {
          // Ignore our own retro elements
          if (mutation.target instanceof Element) {
            if (mutation.target.hasAttribute('data-retroweb') ||
                mutation.target.classList.contains('retroweb-gif-container') ||
                mutation.target.classList.contains('retroweb-trail-particle')) {
              return false;
            }
          }

          // Check for attribute changes that indicate visibility changes (modals, dropdowns)
          if (mutation.type === 'attributes') {
            const target = mutation.target as Element;
            // Check if element became visible or is a modal/dialog
            if (target.matches('[role="dialog"], [role="alertdialog"], [aria-modal="true"], [class*="modal"], [class*="dialog"], [class*="popup"], [class*="dropdown"], [class*="menu"]')) {
              return true;
            }
            // Check for visibility-related attribute changes
            if (mutation.attributeName === 'aria-hidden' || 
                mutation.attributeName === 'hidden' ||
                mutation.attributeName === 'open' ||
                mutation.attributeName === 'aria-expanded') {
              return true;
            }
            // Check for class changes that might indicate showing/hiding
            if (mutation.attributeName === 'class' || mutation.attributeName === 'style') {
              const htmlTarget = target as HTMLElement;
              const rect = htmlTarget.getBoundingClientRect();
              // If element is now visible and reasonably sized, it might be a modal
              if (rect.width > 100 && rect.height > 100) {
                return true;
              }
            }
          }

          // Check for added nodes
          if (mutation.addedNodes.length > 0) {
            for (const node of Array.from(mutation.addedNodes)) {
              if (node instanceof Element) {
                // Ignore our own elements
                if (node.hasAttribute('data-retroweb') ||
                    node.classList.contains('retroweb-gif-container') ||
                    node.classList.contains('retroweb-trail-particle')) {
                  continue;
                }
                return true;
              }
            }
          }

          return false;
        });

        if (hasSignificantChanges) {
          this.debouncedHandleDynamicContent();
        }
      });

      // Start observing the document body
      if (document.body) {
        this.mutationObserver.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['class', 'style', 'aria-hidden', 'hidden', 'open', 'aria-expanded'],
          characterData: false
        });

        // Also observe document.documentElement for portals that attach outside body
        this.mutationObserver.observe(document.documentElement, {
          childList: true,
          subtree: false,
          attributes: false
        });

        console.log('RetroWeb: Dynamic content observer started (with attribute tracking)');

        // Start periodic scanner for elements that mutation observer might miss
        this.startPeriodicScanner();
      } else {
        console.warn('RetroWeb: Document body not available for observation');
      }
    } catch (error) {
      this.handleError('startDynamicContentObserver', error);
    }
  }

  /**
   * Stop the dynamic content observer
   */
  stopDynamicContentObserver(): void {
    try {
      if (this.mutationObserver) {
        console.log('RetroWeb: Stopping dynamic content observer');
        this.mutationObserver.disconnect();
        this.mutationObserver = null;
      }

      // Stop periodic scanner
      this.stopPeriodicScanner();

      // Clear any pending debounce timer
      if (this.debounceTimer !== null) {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = null;
      }
    } catch (error) {
      this.handleError('stopDynamicContentObserver', error);
    }
  }

  /**
   * Start periodic scanner to catch elements that mutation observer might miss
   */
  private startPeriodicScanner(): void {
    if (this.periodicScanInterval !== null) {
      return; // Already running
    }

    console.log('RetroWeb: Starting periodic DOM scanner');
    
    this.periodicScanInterval = window.setInterval(() => {
      if (this.isActive && this.currentSettings) {
        this.scanAndTransformAll();
      }
    }, this.PERIODIC_SCAN_INTERVAL);
  }

  /**
   * Stop the periodic scanner
   */
  private stopPeriodicScanner(): void {
    if (this.periodicScanInterval !== null) {
      console.log('RetroWeb: Stopping periodic DOM scanner');
      clearInterval(this.periodicScanInterval);
      this.periodicScanInterval = null;
    }
  }

  /**
   * Scan entire DOM and transform any untransformed elements
   * Only transforms TOP-LEVEL containers to avoid nested border chaos
   */
  private scanAndTransformAll(): void {
    try {
      if (!this.isActive || !this.currentSettings?.currentTheme) {
        return;
      }

      let transformedCount = 0;

      // Only transform semantic containers and modals - NOT generic divs
      const majorContainers = document.querySelectorAll(`
        main:not([data-retro-transformed]):not([data-retroweb]),
        article:not([data-retro-transformed]):not([data-retroweb]),
        section:not([data-retro-transformed]):not([data-retroweb]),
        aside:not([data-retro-transformed]):not([data-retroweb]),
        nav:not([data-retro-transformed]):not([data-retroweb]),
        header:not([data-retro-transformed]):not([data-retroweb]),
        footer:not([data-retro-transformed]):not([data-retroweb]),
        [role="dialog"]:not([data-retro-transformed]),
        [role="alertdialog"]:not([data-retro-transformed]),
        [aria-modal="true"]:not([data-retro-transformed]),
        [role="main"]:not([data-retro-transformed]),
        [role="navigation"]:not([data-retro-transformed]),
        [role="complementary"]:not([data-retro-transformed])
      `);

      majorContainers.forEach(element => {
        const htmlElement = element as HTMLElement;
        const rect = htmlElement.getBoundingClientRect();

        // Skip small or invisible elements
        if (rect.width < 150 || rect.height < 100) return;
        if (rect.width === 0 || rect.height === 0) return;
        if (htmlElement.classList.contains('retroweb-gif-container')) return;

        // Skip if parent is already transformed (avoid nested styling)
        const parent = htmlElement.parentElement;
        if (parent && parent.hasAttribute('data-retro-transformed')) return;

        htmlElement.classList.add('retro-div');
        htmlElement.setAttribute('data-retro-transformed', 'scanned');
        transformedCount++;
      });

      // Transform standalone interactive elements (buttons, links, inputs)
      document.querySelectorAll('button:not([data-retro-transformed]):not([data-retroweb])').forEach(btn => {
        btn.classList.add('retro-button', 'retro-interactive');
        btn.setAttribute('data-retro-transformed', 'button');
        transformedCount++;
      });

      document.querySelectorAll('a[href]:not([data-retro-transformed]):not([data-retroweb])').forEach(link => {
        link.classList.add('retro-link', 'retro-interactive');
        link.setAttribute('data-retro-transformed', 'link');
        transformedCount++;
      });

      document.querySelectorAll('input:not([data-retro-transformed]):not([data-retroweb]), textarea:not([data-retro-transformed]):not([data-retroweb]), select:not([data-retro-transformed]):not([data-retroweb])').forEach(input => {
        input.classList.add('retro-input', 'retro-interactive');
        input.setAttribute('data-retro-transformed', 'input');
        transformedCount++;
      });

      if (transformedCount > 0) {
        console.log(`RetroWeb: Periodic scan transformed ${transformedCount} elements`);
      }
    } catch (error) {
      // Silent fail for periodic scan
    }
  }

  /**
   * Handle dynamic content changes with debouncing
   */
  private debouncedHandleDynamicContent(): void {
    // Clear existing timer
    if (this.debounceTimer !== null) {
      clearTimeout(this.debounceTimer);
    }

    // Set new timer
    this.debounceTimer = window.setTimeout(() => {
      this.handleDynamicContent();
      this.debounceTimer = null;
    }, this.DEBOUNCE_DELAY);
  }

  /**
   * Apply retro styling to dynamically added elements
   */
  private handleDynamicContent(): void {
    try {
      if (!this.isActive || !this.currentSettings) {
        return;
      }

      console.log('RetroWeb: Applying styling to dynamic content');

      // Transform new interactive elements (buttons, links, inputs, images)
      if (this.currentSettings.currentTheme) {
        const newElements = document.querySelectorAll('button, a[href], input, textarea, select, img, [role="button"], [role="link"]');
        const elementsToTransform: Element[] = [];
        
        newElements.forEach(element => {
          // Skip if already transformed or is a retro element
          if (!element.hasAttribute('data-retro-transformed') && 
              !element.hasAttribute('data-retroweb')) {
            elementsToTransform.push(element);
          }
        });

        if (elementsToTransform.length > 0) {
          this.elementTransformer.transformNewElements(this.currentSettings.currentTheme, elementsToTransform);
          console.log(`RetroWeb: Transformed ${elementsToTransform.length} new elements`);
        }

        // Transform new container elements (divs, modals, sidebars, dialogs)
        this.transformDynamicContainers();
      }

      // Apply font styling to new text elements
      if (this.currentSettings.customSettings.fonts.enabled) {
        const fontStyle = this.currentSettings.customSettings.fonts.style || 'comic-sans';
        const fontMap: Record<string, string> = {
          'comic-sans': '"Comic Sans MS", "Comic Sans", cursive',
          'pixel': '"Press Start 2P", "Courier New", monospace',
          'decorative': '"Papyrus", "Brush Script MT", cursive'
        };
        const fontFamily = fontMap[fontStyle] || fontMap['comic-sans'];

        // Find new text elements that don't have retro fonts applied
        const newTextElements = document.querySelectorAll('p, span, div, a, li, td, th, label, button');
        newTextElements.forEach(element => {
          try {
            const htmlElement = element as HTMLElement;
            
            // Skip if already has retro font class or is a retro element
            if (htmlElement.classList.contains('retroweb-font') ||
                htmlElement.hasAttribute('data-retroweb')) {
              return;
            }

            // Skip if element has no text content
            if (!htmlElement.textContent?.trim()) {
              return;
            }

            // Apply retro font
            htmlElement.style.fontFamily = fontFamily;
            htmlElement.classList.add('retroweb-font');
          } catch (error) {
            // Ignore errors for individual elements
          }
        });
      }

      // Apply neon borders to new major content sections
      if (this.currentSettings.customSettings.background.enabled) {
        const themeConfig = this.currentSettings.currentTheme ? 
                           getTheme(this.currentSettings.currentTheme) : undefined;
        
        if (themeConfig?.colors?.neonBorder) {
          const selectors = ['main', 'article', 'section', 'aside', 'nav', 'header', 'footer'];
          const newSections: Element[] = [];
          
          selectors.forEach(selector => {
            try {
              const elements = document.querySelectorAll(selector);
              elements.forEach(element => {
                // Skip if already has neon border
                if (!element.hasAttribute('data-retroweb-border')) {
                  newSections.push(element);
                }
              });
            } catch (error) {
              // Ignore selector errors
            }
          });

          // Apply neon borders to new sections
          newSections.forEach(element => {
            try {
              const htmlElement = element as HTMLElement;
              const rect = htmlElement.getBoundingClientRect();
              
              // Skip if element is too small
              if (rect.width < 100 || rect.height < 100) {
                return;
              }

              const color = themeConfig.colors.neonBorder;
              htmlElement.style.border = `3px solid ${color}`;
              htmlElement.style.boxShadow = `0 0 10px ${color}, inset 0 0 10px ${color}`;
              htmlElement.classList.add('retroweb-neon-border');
              htmlElement.setAttribute('data-retroweb-border', 'true');
            } catch (error) {
              // Ignore errors for individual elements
            }
          });
        }
      }

      console.log('RetroWeb: Dynamic content styling applied');
    } catch (error) {
      this.handleError('handleDynamicContent', error);
    }
  }

  /**
   * Transform dynamically added containers like modals, dialogs, sidebars, and popups
   */
  private transformDynamicContainers(): void {
    try {
      if (!this.currentSettings?.currentTheme) return;

      // Selectors for modals, dialogs, sidebars, and dynamic containers
      const containerSelectors = [
        // Modals and dialogs
        '[role="dialog"]',
        '[role="alertdialog"]',
        '[aria-modal="true"]',
        '.modal',
        '.dialog',
        '.popup',
        '.overlay',
        '.lightbox',
        '[class*="modal"]',
        '[class*="dialog"]',
        '[class*="popup"]',
        '[class*="overlay"]',
        '[class*="drawer"]',
        '[class*="sidebar"]',
        '[class*="panel"]',
        '[class*="dropdown"]',
        '[class*="menu"]',
        '[class*="tooltip"]',
        // Common framework modals
        '.MuiModal-root',
        '.MuiDialog-root',
        '.MuiDrawer-root',
        '.MuiPopover-root',
        '.chakra-modal__content',
        '.ant-modal',
        '.ant-drawer',
        '.ant-popover',
        '[data-radix-portal]',
        '[data-reach-dialog-content]',
        // Generic containers
        'aside',
        'nav',
        'section',
        'article',
        'main',
        'header',
        'footer',
        'div[role="navigation"]',
        'div[role="complementary"]',
        'div[role="region"]'
      ];

      let transformedCount = 0;

      containerSelectors.forEach(selector => {
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach(element => {
            // Skip if already transformed or is a retro element
            if (element.hasAttribute('data-retro-transformed') ||
                element.hasAttribute('data-retroweb') ||
                element.classList.contains('retroweb-gif-container')) {
              return;
            }

            const htmlElement = element as HTMLElement;
            const rect = htmlElement.getBoundingClientRect();

            // Skip very small or invisible elements
            if (rect.width < 50 || rect.height < 30) return;
            if (rect.width === 0 || rect.height === 0) return;

            // Apply retro-div class for theme styling
            htmlElement.classList.add('retro-div');
            htmlElement.setAttribute('data-retro-transformed', 'container');

            // Windows 95 crash effect: trigger on modal/dialog detection
            if (this.currentSettings?.currentTheme === 'windows-95') {
              const isModal = element.matches('[role="dialog"], [role="alertdialog"], [aria-modal="true"], .modal, .dialog, [class*="modal"], [class*="dialog"], .MuiModal-root, .MuiDialog-root, .chakra-modal__content, .ant-modal, [data-radix-portal], [data-reach-dialog-content]');
              if (isModal && rect.width > 150 && rect.height > 100) {
                // Start the iconic Windows crash trail effect
                this.windowsCrashEffect.startCrashEffect(htmlElement);
              }
            }

            // Also transform child interactive elements
            const childButtons = htmlElement.querySelectorAll('button:not([data-retro-transformed])');
            const childLinks = htmlElement.querySelectorAll('a[href]:not([data-retro-transformed])');
            const childInputs = htmlElement.querySelectorAll('input:not([data-retro-transformed]), textarea:not([data-retro-transformed]), select:not([data-retro-transformed])');

            childButtons.forEach(btn => {
              btn.classList.add('retro-button', 'retro-interactive');
              btn.setAttribute('data-retro-transformed', 'button');
            });

            childLinks.forEach(link => {
              link.classList.add('retro-link', 'retro-interactive');
              link.setAttribute('data-retro-transformed', 'link');
            });

            childInputs.forEach(input => {
              input.classList.add('retro-input', 'retro-interactive');
              input.setAttribute('data-retro-transformed', 'input');
            });

            transformedCount++;
          });
        } catch (error) {
          // Ignore selector errors
        }
      });

      if (transformedCount > 0) {
        console.log(`RetroWeb: Transformed ${transformedCount} dynamic containers`);
      }
    } catch (error) {
      console.error('RetroWeb: Error transforming dynamic containers:', error);
    }
  }

  /**
   * Verify that all interactive elements remain functional after transformation
   * Checks clickability, form inputs, and event handlers
   * @returns Object with verification results
   */
  verifyInteractiveElements(): {
    clickableElements: number;
    blockedElements: number;
    formInputs: number;
    blockedInputs: number;
    eventHandlers: number;
    allFunctional: boolean;
  } {
    try {
      console.log('RetroWeb: Verifying interactive element preservation');

      const results = {
        clickableElements: 0,
        blockedElements: 0,
        formInputs: 0,
        blockedInputs: 0,
        eventHandlers: 0,
        allFunctional: true
      };

      // Get all clickable elements
      const clickableSelectors = [
        'a[href]',
        'button',
        '[role="button"]',
        '[role="link"]',
        '[onclick]',
        '[tabindex]:not([tabindex="-1"])'
      ];

      clickableSelectors.forEach(selector => {
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach(element => {
            // Skip our own retro elements
            if (element.hasAttribute('data-retroweb')) {
              return;
            }

            results.clickableElements++;

            // Check if element is blocked by retro elements
            if (this.isElementBlocked(element as HTMLElement)) {
              results.blockedElements++;
              results.allFunctional = false;
              console.warn('RetroWeb: Clickable element is blocked:', element);
            }

            // Check if element has event listeners (basic check)
            const hasOnClick = element.hasAttribute('onclick');
            if (hasOnClick) {
              results.eventHandlers++;
            }
          });
        } catch (error) {
          console.warn(`RetroWeb: Error checking selector ${selector}:`, error);
        }
      });

      // Get all form inputs and controls
      const formSelectors = [
        'input',
        'textarea',
        'select',
        'button[type="submit"]',
        'button[type="reset"]'
      ];

      formSelectors.forEach(selector => {
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach(element => {
            // Skip our own retro elements
            if (element.hasAttribute('data-retroweb')) {
              return;
            }

            results.formInputs++;

            // Check if input is blocked
            if (this.isElementBlocked(element as HTMLElement)) {
              results.blockedInputs++;
              results.allFunctional = false;
              console.warn('RetroWeb: Form input is blocked:', element);
            }
          });
        } catch (error) {
          console.warn(`RetroWeb: Error checking form selector ${selector}:`, error);
        }
      });

      console.log('RetroWeb: Interactive element verification complete:', results);
      return results;
    } catch (error) {
      this.handleError('verifyInteractiveElements', error);
      return {
        clickableElements: 0,
        blockedElements: 0,
        formInputs: 0,
        blockedInputs: 0,
        eventHandlers: 0,
        allFunctional: false
      };
    }
  }

  /**
   * Check if an element is blocked by retro overlays
   * @param element Element to check
   * @returns true if element is blocked
   */
  private isElementBlocked(element: HTMLElement): boolean {
    try {
      const rect = element.getBoundingClientRect();
      
      // Skip elements that are not visible
      if (rect.width === 0 || rect.height === 0) {
        return false;
      }

      // Get the center point of the element
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Get the element at the center point
      const elementAtPoint = document.elementFromPoint(centerX, centerY);

      if (!elementAtPoint) {
        return false;
      }

      // Check if the element at the point is the target element or a descendant
      if (elementAtPoint === element || element.contains(elementAtPoint)) {
        return false;
      }

      // Check if the blocking element is a retro element
      if (elementAtPoint.hasAttribute('data-retroweb') ||
          elementAtPoint.classList.contains('retroweb-gif-container') ||
          elementAtPoint.classList.contains('retroweb-overlay') ||
          elementAtPoint.classList.contains('retroweb-marquee') ||
          elementAtPoint.classList.contains('retroweb-trail-particle')) {
        // Element is blocked by a retro element
        return true;
      }

      return false;
    } catch (error) {
      console.warn('RetroWeb: Error checking if element is blocked:', error);
      return false;
    }
  }

  /**
   * Ensure all interactive elements remain accessible
   * Adjusts z-index and pointer-events to preserve functionality
   */
  ensureInteractiveAccessibility(): void {
    try {
      console.log('RetroWeb: Ensuring interactive element accessibility');

      // Get all interactive elements
      const interactiveSelectors = [
        'a[href]',
        'button',
        'input',
        'textarea',
        'select',
        '[role="button"]',
        '[role="link"]',
        '[onclick]',
        '[tabindex]:not([tabindex="-1"])',
        'video',
        'audio',
        '[controls]'
      ];

      const interactiveElements: HTMLElement[] = [];
      interactiveSelectors.forEach(selector => {
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach(element => {
            // Skip our own retro elements
            if (!element.hasAttribute('data-retroweb')) {
              interactiveElements.push(element as HTMLElement);
            }
          });
        } catch (error) {
          // Ignore selector errors
        }
      });

      // Ensure interactive elements have appropriate z-index
      interactiveElements.forEach(element => {
        try {
          const computedStyle = window.getComputedStyle(element);
          const currentZIndex = computedStyle.zIndex;

          // If element has a low or auto z-index, boost it
          if (currentZIndex === 'auto' || parseInt(currentZIndex, 10) < 1000) {
            // Store original z-index for restoration
            if (!element.hasAttribute('data-retroweb-original-zindex')) {
              element.setAttribute('data-retroweb-original-zindex', currentZIndex);
            }

            // Set higher z-index to ensure it's above retro elements
            element.style.zIndex = '10001';
            element.setAttribute('data-retroweb-zindex-boosted', 'true');
          }

          // Ensure pointer-events are enabled
          if (computedStyle.pointerEvents === 'none') {
            // Store original pointer-events for restoration
            if (!element.hasAttribute('data-retroweb-original-pointer-events')) {
              element.setAttribute('data-retroweb-original-pointer-events', 'none');
            }

            element.style.pointerEvents = 'auto';
            element.setAttribute('data-retroweb-pointer-events-restored', 'true');
          }
        } catch (error) {
          // Ignore errors for individual elements
        }
      });

      console.log(`RetroWeb: Ensured accessibility for ${interactiveElements.length} interactive elements`);
    } catch (error) {
      this.handleError('ensureInteractiveAccessibility', error);
    }
  }

  /**
   * Restore original z-index and pointer-events for interactive elements
   */
  private restoreInteractiveProperties(): void {
    try {
      console.log('RetroWeb: Restoring interactive element properties');

      // Find all elements with boosted z-index
      const boostedElements = document.querySelectorAll('[data-retroweb-zindex-boosted]');
      boostedElements.forEach(element => {
        try {
          const htmlElement = element as HTMLElement;
          const originalZIndex = htmlElement.getAttribute('data-retroweb-original-zindex');
          
          if (originalZIndex) {
            if (originalZIndex === 'auto') {
              htmlElement.style.zIndex = '';
            } else {
              htmlElement.style.zIndex = originalZIndex;
            }
          } else {
            htmlElement.style.zIndex = '';
          }

          htmlElement.removeAttribute('data-retroweb-original-zindex');
          htmlElement.removeAttribute('data-retroweb-zindex-boosted');
        } catch (error) {
          // Ignore errors for individual elements
        }
      });

      // Find all elements with restored pointer-events
      const restoredElements = document.querySelectorAll('[data-retroweb-pointer-events-restored]');
      restoredElements.forEach(element => {
        try {
          const htmlElement = element as HTMLElement;
          const originalPointerEvents = htmlElement.getAttribute('data-retroweb-original-pointer-events');
          
          if (originalPointerEvents) {
            htmlElement.style.pointerEvents = originalPointerEvents;
          } else {
            htmlElement.style.pointerEvents = '';
          }

          htmlElement.removeAttribute('data-retroweb-original-pointer-events');
          htmlElement.removeAttribute('data-retroweb-pointer-events-restored');
        } catch (error) {
          // Ignore errors for individual elements
        }
      });

      console.log('RetroWeb: Interactive element properties restored');
    } catch (error) {
      this.handleError('restoreInteractiveProperties', error);
    }
  }
}

// Create singleton instance
const retroTransformer = new RetroTransformer();

// Global error boundary to prevent extension errors from affecting the page
window.addEventListener('error', (event) => {
  // Only handle errors from our extension code
  if (event.filename && event.filename.includes('chrome-extension://')) {
    console.error('RetroWeb: Caught global error:', event.error);
    event.stopPropagation();
    // Don't prevent default - let Chrome handle it, but log it
  }
}, true);

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  // Check if rejection is from our code
  if (event.reason && event.reason.stack && event.reason.stack.includes('RetroTransformer')) {
    console.error('RetroWeb: Caught unhandled promise rejection:', event.reason);
    event.stopPropagation();
  }
}, true);

// Listen for CSP violations
document.addEventListener('securitypolicyviolation', (event) => {
  // Check if violation is related to our extension
  if (event.blockedURI && event.blockedURI.includes('chrome-extension://')) {
    console.group('RetroWeb: CSP Violation Detected');
    console.warn('Violated Directive:', event.violatedDirective);
    console.warn('Blocked URI:', event.blockedURI);
    console.warn('Original Policy:', event.originalPolicy);
    console.warn('Source File:', event.sourceFile);
    console.warn('Line Number:', event.lineNumber);
    console.groupEnd();
    console.log('RetroWeb: Continuing with CSP-compatible features');
  }
});

console.log('RetroWeb content script loaded');

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'ACTIVATE') {
    console.log('RetroWeb: Received ACTIVATE message');
    retroTransformer.activate();
    sendResponse({ success: true });
  }

  if (message.type === 'DEACTIVATE') {
    console.log('RetroWeb: Received DEACTIVATE message');
    retroTransformer.deactivate();
    sendResponse({ success: true });
  }

  if (message.type === 'SETTINGS_UPDATED') {
    console.log('RetroWeb: Received SETTINGS_UPDATED message', message.settings);
    retroTransformer.updateSettings(message.settings);
    sendResponse({ success: true });
  }

  return true; // Keep message channel open for async responses
});

// Initialize page load detection
retroTransformer.detectPageLoad();

// Check if extension should be active on page load
// Wrap in try-catch and handle connection errors gracefully
try {
  chrome.runtime.sendMessage({ type: 'GET_SETTINGS' }, (response) => {
    // Check for connection errors (background script not ready)
    if (chrome.runtime.lastError) {
      // Silently ignore "Receiving end does not exist" errors during page load
      const errorMessage = chrome.runtime.lastError.message || '';
      if (!errorMessage.includes('Receiving end does not exist')) {
        console.warn('RetroWeb: Could not get settings on page load:', errorMessage);
      }
      return;
    }

    if (response?.settings) {
      retroTransformer.updateSettings(response.settings);
      
      if (response.settings.enabled) {
        console.log('RetroWeb: Auto-activating on page load');
        // Don't activate here - let detectPageLoad handle it after page is fully loaded
      }
    }
  });
} catch (error) {
  // Silently handle any connection errors during initialization
  console.debug('RetroWeb: Background script not available during page load');
}
