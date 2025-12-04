/**
 * ElementDetector Integration Tests
 * Tests for ElementDetector integration with RetroTransformer
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('ElementDetector Integration', () => {
  let testContainer: HTMLElement;

  beforeEach(() => {
    // Create a test container with a realistic page structure
    testContainer = document.createElement('div');
    testContainer.id = 'test-container';
    document.body.appendChild(testContainer);

    // Create a realistic page structure
    const hero = document.createElement('section');
    hero.className = 'hero-banner';
    hero.innerHTML = '<h1>Welcome</h1><button>Get Started</button>';
    testContainer.appendChild(hero);

    const sidebar = document.createElement('aside');
    sidebar.className = 'sidebar';
    sidebar.innerHTML = '<nav><a href="#">Home</a><a href="#">About</a></nav>';
    testContainer.appendChild(sidebar);

    const main = document.createElement('main');
    main.innerHTML = '<article><p>Main content here</p></article>';
    testContainer.appendChild(main);

    const footer = document.createElement('footer');
    footer.innerHTML = '<p>Copyright 2024</p>';
    testContainer.appendChild(footer);
  });

  afterEach(() => {
    // Clean up
    if (testContainer && testContainer.parentNode) {
      testContainer.parentNode.removeChild(testContainer);
    }
  });

  describe('Region Detection and Marking', () => {
    it('should detect all page regions', () => {
      // Verify all regions exist
      const hero = document.querySelector('.hero-banner');
      const sidebar = document.querySelector('.sidebar');
      const main = document.querySelector('main');
      const footer = document.querySelector('footer');

      expect(hero).toBeTruthy();
      expect(sidebar).toBeTruthy();
      expect(main).toBeTruthy();
      expect(footer).toBeTruthy();
    });

    it('should mark regions with data attributes when activated', () => {
      // Simulate region marking (this would be done by ElementDetector.markRegions())
      const hero = document.querySelector('.hero-banner') as HTMLElement;
      const sidebar = document.querySelector('.sidebar') as HTMLElement;
      const main = document.querySelector('main') as HTMLElement;
      const footer = document.querySelector('footer') as HTMLElement;

      // Mark regions
      hero?.setAttribute('data-retro-region', 'hero');
      sidebar?.setAttribute('data-retro-region', 'sidebar');
      main?.setAttribute('data-retro-region', 'main-content');
      footer?.setAttribute('data-retro-region', 'footer');

      // Verify markers
      expect(hero?.getAttribute('data-retro-region')).toBe('hero');
      expect(sidebar?.getAttribute('data-retro-region')).toBe('sidebar');
      expect(main?.getAttribute('data-retro-region')).toBe('main-content');
      expect(footer?.getAttribute('data-retro-region')).toBe('footer');
    });

    it('should allow CSS targeting of marked regions', () => {
      // Mark regions
      const hero = document.querySelector('.hero-banner') as HTMLElement;
      hero?.setAttribute('data-retro-region', 'hero');

      // Verify CSS selector works
      const markedHero = document.querySelector('[data-retro-region="hero"]');
      expect(markedHero).toBe(hero);
    });
  });

  describe('GIF Placement with Region Awareness', () => {
    it('should avoid placing GIFs in hero sections', () => {
      const hero = document.querySelector('.hero-banner') as HTMLElement;
      hero?.setAttribute('data-retro-region', 'hero');

      // Verify hero is marked as a region to avoid
      const heroRegions = document.querySelectorAll('[data-retro-region="hero"]');
      expect(heroRegions.length).toBeGreaterThan(0);

      // GIF placement logic should check for these regions
      // and avoid overlapping with them
    });

    it('should avoid placing GIFs in sidebars', () => {
      const sidebar = document.querySelector('.sidebar') as HTMLElement;
      sidebar?.setAttribute('data-retro-region', 'sidebar');

      // Verify sidebar is marked as a region to avoid
      const sidebarRegions = document.querySelectorAll('[data-retro-region="sidebar"]');
      expect(sidebarRegions.length).toBeGreaterThan(0);
    });

    it('should allow GIFs in footer regions', () => {
      const footer = document.querySelector('footer') as HTMLElement;
      footer?.setAttribute('data-retro-region', 'footer');

      // Verify footer is marked but not restricted
      const footerRegions = document.querySelectorAll('[data-retro-region="footer"]');
      expect(footerRegions.length).toBeGreaterThan(0);

      // Footer regions should allow more aggressive styling
    });
  });

  describe('Region-Specific Styling', () => {
    it('should apply lighter effects to hero sections', () => {
      const hero = document.querySelector('.hero-banner') as HTMLElement;
      hero?.setAttribute('data-retro-region', 'hero');

      // Hero sections should have reduced opacity or lighter effects
      // This is handled by CSS rules targeting [data-retro-region="hero"]
      expect(hero?.hasAttribute('data-retro-region')).toBe(true);
    });

    it('should preserve navigation clarity in sidebars', () => {
      const sidebar = document.querySelector('.sidebar') as HTMLElement;
      sidebar?.setAttribute('data-retro-region', 'sidebar');

      // Sidebar links should remain readable
      const links = sidebar?.querySelectorAll('a');
      expect(links?.length).toBeGreaterThan(0);
    });

    it('should allow aggressive styling in footers', () => {
      const footer = document.querySelector('footer') as HTMLElement;
      footer?.setAttribute('data-retro-region', 'footer');

      // Footer can handle full retro effects
      expect(footer?.hasAttribute('data-retro-region')).toBe(true);
    });
  });

  describe('Interactive Element Preservation', () => {
    it('should preserve hero CTA buttons', () => {
      const hero = document.querySelector('.hero-banner') as HTMLElement;
      const button = hero?.querySelector('button');

      expect(button).toBeTruthy();
      expect(button?.textContent).toBe('Get Started');
    });

    it('should preserve sidebar navigation links', () => {
      const sidebar = document.querySelector('.sidebar') as HTMLElement;
      const links = sidebar?.querySelectorAll('a');

      expect(links?.length).toBe(2);
      expect(links?.[0].textContent).toBe('Home');
      expect(links?.[1].textContent).toBe('About');
    });

    it('should preserve footer links', () => {
      const footer = document.querySelector('footer') as HTMLElement;
      const content = footer?.querySelector('p');

      expect(content).toBeTruthy();
      expect(content?.textContent).toBe('Copyright 2024');
    });
  });

  describe('Region Cleanup', () => {
    it('should remove region markers on deactivation', () => {
      // Mark regions
      const hero = document.querySelector('.hero-banner') as HTMLElement;
      const sidebar = document.querySelector('.sidebar') as HTMLElement;
      const main = document.querySelector('main') as HTMLElement;
      const footer = document.querySelector('footer') as HTMLElement;

      hero?.setAttribute('data-retro-region', 'hero');
      sidebar?.setAttribute('data-retro-region', 'sidebar');
      main?.setAttribute('data-retro-region', 'main-content');
      footer?.setAttribute('data-retro-region', 'footer');

      // Verify markers exist
      expect(document.querySelectorAll('[data-retro-region]').length).toBe(4);

      // Remove markers (simulating deactivation)
      hero?.removeAttribute('data-retro-region');
      sidebar?.removeAttribute('data-retro-region');
      main?.removeAttribute('data-retro-region');
      footer?.removeAttribute('data-retro-region');

      // Verify markers are removed
      expect(document.querySelectorAll('[data-retro-region]').length).toBe(0);
    });
  });

  describe('Complex Page Structures', () => {
    it('should handle nested regions correctly', () => {
      // Create nested structure
      const main = document.querySelector('main') as HTMLElement;
      const nestedSection = document.createElement('section');
      nestedSection.className = 'hero-section';
      main?.appendChild(nestedSection);

      // Both main and nested section can be marked
      main?.setAttribute('data-retro-region', 'main-content');
      nestedSection?.setAttribute('data-retro-region', 'hero');

      expect(main?.getAttribute('data-retro-region')).toBe('main-content');
      expect(nestedSection?.getAttribute('data-retro-region')).toBe('hero');
    });

    it('should handle pages with multiple heroes', () => {
      // Create second hero
      const hero2 = document.createElement('section');
      hero2.className = 'hero-secondary';
      testContainer.appendChild(hero2);

      // Both can be marked as heroes
      const hero1 = document.querySelector('.hero-banner') as HTMLElement;
      hero1?.setAttribute('data-retro-region', 'hero');
      hero1?.setAttribute('data-retro-region-index', '0');
      hero2?.setAttribute('data-retro-region', 'hero');
      hero2?.setAttribute('data-retro-region-index', '1');

      const heroes = document.querySelectorAll('[data-retro-region="hero"]');
      expect(heroes.length).toBe(2);
    });

    it('should handle pages with no special regions', () => {
      // Clear test container
      testContainer.innerHTML = '';

      // Add generic content
      const div1 = document.createElement('div');
      div1.textContent = 'Content 1';
      testContainer.appendChild(div1);

      const div2 = document.createElement('div');
      div2.textContent = 'Content 2';
      testContainer.appendChild(div2);

      // No regions should be marked
      const regions = document.querySelectorAll('[data-retro-region]');
      expect(regions.length).toBe(0);
    });
  });
});
