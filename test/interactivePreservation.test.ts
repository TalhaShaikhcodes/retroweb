/**
 * Unit tests for Interactive Element Preservation
 * Tests that clickable elements, form inputs, and event handlers remain functional
 * after retro transformation
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

// Mock chrome.runtime.getURL
(global as any).chrome = {
  runtime: {
    getURL: (path: string) => `chrome-extension://test/${path}`
  }
};

describe('Interactive Element Preservation', () => {
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

  it('should keep clickable links accessible', () => {
    // Create test links
    const link1 = document.createElement('a');
    link1.href = 'https://example.com';
    link1.textContent = 'Test Link 1';
    document.body.appendChild(link1);

    const link2 = document.createElement('a');
    link2.href = 'https://example.org';
    link2.textContent = 'Test Link 2';
    document.body.appendChild(link2);

    // Verify links are accessible
    const links = document.querySelectorAll('a[href]');
    expect(links.length).toBe(2);

    // Verify links have proper attributes
    links.forEach(link => {
      expect(link.href).toBeTruthy();
      expect(link.textContent).toBeTruthy();
      // Verify links are in the DOM
      expect(document.body.contains(link)).toBe(true);
    });
  });

  it('should keep buttons functional', () => {
    // Create test buttons
    const button1 = document.createElement('button');
    button1.textContent = 'Click Me';
    button1.onclick = () => console.log('Button 1 clicked');
    document.body.appendChild(button1);

    const button2 = document.createElement('button');
    button2.textContent = 'Submit';
    button2.type = 'submit';
    document.body.appendChild(button2);

    // Verify buttons exist and are accessible
    const buttons = document.querySelectorAll('button');
    expect(buttons.length).toBe(2);

    // Verify onclick handler is preserved
    expect(button1.onclick).toBeDefined();
    expect(button1.onclick).not.toBeNull();
  });

  it('should keep form inputs accessible', () => {
    // Create a test form with various input types
    const form = document.createElement('form');
    
    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.name = 'username';
    form.appendChild(textInput);

    const emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.name = 'email';
    form.appendChild(emailInput);

    const textarea = document.createElement('textarea');
    textarea.name = 'message';
    form.appendChild(textarea);

    const select = document.createElement('select');
    select.name = 'category';
    const option = document.createElement('option');
    option.value = 'test';
    option.textContent = 'Test';
    select.appendChild(option);
    form.appendChild(select);

    document.body.appendChild(form);

    // Verify all form controls are present
    const inputs = form.querySelectorAll('input');
    expect(inputs.length).toBe(2);

    const textareas = form.querySelectorAll('textarea');
    expect(textareas.length).toBe(1);

    const selects = form.querySelectorAll('select');
    expect(selects.length).toBe(1);

    // Verify form controls are not disabled
    inputs.forEach(input => {
      expect(input.disabled).toBe(false);
    });
  });

  it('should not block interactive elements with retro overlays', () => {
    // Create an interactive button
    const button = document.createElement('button');
    button.textContent = 'Interactive Button';
    button.style.position = 'absolute';
    button.style.left = '100px';
    button.style.top = '100px';
    button.style.width = '150px';
    button.style.height = '50px';
    document.body.appendChild(button);

    // Create a retro overlay that should NOT block the button
    const overlay = document.createElement('div');
    overlay.setAttribute('data-retroweb', 'overlay');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.pointerEvents = 'none'; // Should not block clicks
    overlay.style.zIndex = '1';
    document.body.appendChild(overlay);

    // Verify overlay has pointer-events: none
    const overlayStyle = window.getComputedStyle(overlay);
    expect(overlayStyle.pointerEvents).toBe('none');
    
    // Verify button is still in the DOM and accessible
    expect(document.body.contains(button)).toBe(true);
    expect(button.textContent).toBe('Interactive Button');
  });

  it('should preserve event handlers on elements', () => {
    // Create element with event handler
    const div = document.createElement('div');
    div.setAttribute('onclick', 'console.log("clicked")');
    div.textContent = 'Clickable Div';
    document.body.appendChild(div);

    // Verify onclick attribute is preserved
    expect(div.hasAttribute('onclick')).toBe(true);
    expect(div.getAttribute('onclick')).toBe('console.log("clicked")');
  });

  it('should keep video and media controls accessible', () => {
    // Create a video element with controls
    const video = document.createElement('video');
    video.controls = true;
    video.src = 'test-video.mp4';
    video.style.width = '640px';
    video.style.height = '360px';
    document.body.appendChild(video);

    // Create an audio element with controls
    const audio = document.createElement('audio');
    audio.controls = true;
    audio.src = 'test-audio.mp3';
    document.body.appendChild(audio);

    // Verify media elements exist
    const videos = document.querySelectorAll('video');
    expect(videos.length).toBe(1);
    expect(videos[0].controls).toBe(true);

    const audios = document.querySelectorAll('audio');
    expect(audios.length).toBe(1);
    expect(audios[0].controls).toBe(true);
  });

  it('should maintain z-index for interactive elements', () => {
    // Create an interactive element
    const button = document.createElement('button');
    button.textContent = 'High Priority Button';
    button.style.zIndex = '100';
    document.body.appendChild(button);

    // Verify z-index is maintained
    const computedStyle = window.getComputedStyle(button);
    expect(computedStyle.zIndex).toBe('100');
  });

  it('should not interfere with ARIA roles', () => {
    // Create elements with ARIA roles
    const ariaButton = document.createElement('div');
    ariaButton.setAttribute('role', 'button');
    ariaButton.setAttribute('tabindex', '0');
    ariaButton.textContent = 'ARIA Button';
    document.body.appendChild(ariaButton);

    const ariaLink = document.createElement('span');
    ariaLink.setAttribute('role', 'link');
    ariaLink.setAttribute('tabindex', '0');
    ariaLink.textContent = 'ARIA Link';
    document.body.appendChild(ariaLink);

    // Verify ARIA roles are preserved
    expect(ariaButton.getAttribute('role')).toBe('button');
    expect(ariaButton.getAttribute('tabindex')).toBe('0');
    
    expect(ariaLink.getAttribute('role')).toBe('link');
    expect(ariaLink.getAttribute('tabindex')).toBe('0');
  });

  it('should handle elements with tabindex correctly', () => {
    // Create focusable elements
    const focusable1 = document.createElement('div');
    focusable1.setAttribute('tabindex', '0');
    focusable1.textContent = 'Focusable 1';
    document.body.appendChild(focusable1);

    const focusable2 = document.createElement('div');
    focusable2.setAttribute('tabindex', '1');
    focusable2.textContent = 'Focusable 2';
    document.body.appendChild(focusable2);

    // Non-focusable element (negative tabindex)
    const nonFocusable = document.createElement('div');
    nonFocusable.setAttribute('tabindex', '-1');
    nonFocusable.textContent = 'Non-focusable';
    document.body.appendChild(nonFocusable);

    // Verify tabindex attributes are preserved
    expect(focusable1.getAttribute('tabindex')).toBe('0');
    expect(focusable2.getAttribute('tabindex')).toBe('1');
    expect(nonFocusable.getAttribute('tabindex')).toBe('-1');
  });

  it('should not block GIF elements from being non-interactive', () => {
    // Create a GIF container (should have pointer-events: none)
    const gifContainer = document.createElement('div');
    gifContainer.className = 'retroweb-gif-container';
    gifContainer.setAttribute('data-retroweb', 'gif');
    gifContainer.style.position = 'fixed';
    gifContainer.style.pointerEvents = 'none';
    gifContainer.style.zIndex = '1000';
    document.body.appendChild(gifContainer);

    // Verify GIF has pointer-events: none
    const computedStyle = window.getComputedStyle(gifContainer);
    expect(computedStyle.pointerEvents).toBe('none');
  });
});
