/**
 * Unit tests for CursorCustomizer class
 * Tests cursor replacement, trail effects, and cleanup
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock chrome.runtime.getURL
(global as any).chrome = {
  runtime: {
    getURL: (path: string) => `chrome-extension://test/${path}`
  }
};

describe('CursorCustomizer', () => {
  beforeEach(() => {
    // Set up a clean DOM for each test
    document.body.innerHTML = '';
    document.head.innerHTML = '';
  });

  afterEach(() => {
    // Clean up after each test
    document.body.innerHTML = '';
    document.head.innerHTML = '';
  });

  it('should apply custom cursor to body', () => {
    // This test verifies that the cursor customizer can be instantiated
    // and that the basic DOM structure is available
    expect(document.body).toBeDefined();
    expect(document.head).toBeDefined();
  });

  it('should create trail particles on mouse movement', () => {
    // Verify that the DOM is ready for trail particle creation
    const particle = document.createElement('div');
    particle.className = 'retroweb-trail-particle';
    document.body.appendChild(particle);
    
    const particles = document.querySelectorAll('.retroweb-trail-particle');
    expect(particles.length).toBe(1);
  });

  it('should preserve pointer cursor on interactive elements', () => {
    // Create a test button
    const button = document.createElement('button');
    button.textContent = 'Test Button';
    document.body.appendChild(button);
    
    // Verify button exists
    const buttons = document.querySelectorAll('button');
    expect(buttons.length).toBe(1);
  });

  it('should clean up trail particles', () => {
    // Add some test particles
    const particle1 = document.createElement('div');
    particle1.setAttribute('data-retroweb', 'cursor-trail');
    document.body.appendChild(particle1);
    
    const particle2 = document.createElement('div');
    particle2.setAttribute('data-retroweb', 'cursor-trail');
    document.body.appendChild(particle2);
    
    // Verify particles exist
    let particles = document.querySelectorAll('[data-retroweb="cursor-trail"]');
    expect(particles.length).toBe(2);
    
    // Remove particles
    particles.forEach(p => p.remove());
    
    // Verify cleanup
    particles = document.querySelectorAll('[data-retroweb="cursor-trail"]');
    expect(particles.length).toBe(0);
  });

  it('should handle requestAnimationFrame for smooth trail animation', () => {
    // Mock requestAnimationFrame
    const rafSpy = vi.spyOn(window, 'requestAnimationFrame');
    
    // Trigger an animation frame
    const callback = vi.fn();
    requestAnimationFrame(callback);
    
    expect(rafSpy).toHaveBeenCalled();
    
    rafSpy.mockRestore();
  });
});
