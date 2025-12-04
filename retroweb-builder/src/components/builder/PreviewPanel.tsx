'use client';

import { useMemo, useEffect, useRef, useState, useCallback } from 'react';
import { useBuilderStore } from '@/stores/builderStore';

const VIEWPORT_SIZES = {
  desktop: { width: '100%', maxWidth: '100%' },
  tablet: { width: '768px', maxWidth: '768px' },
  mobile: { width: '375px', maxWidth: '375px' },
};

export function PreviewPanel() {
  const { viewportSize, project, setCurrentPage, currentPageId, isStreamingCode } = useBuilderStore();
  // Derive currentPage from currentPageId to ensure reactivity
  const currentPage = project?.pages.find(p => p.id === currentPageId) || null;
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const wasStreamingRef = useRef(false);

  // Refresh preview function
  const refreshPreview = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  // Auto-refresh when code generation completes
  useEffect(() => {
    if (wasStreamingRef.current && !isStreamingCode) {
      // Code generation just finished, refresh preview
      refreshPreview();
    }
    wasStreamingRef.current = isStreamingCode;
  }, [isStreamingCode, refreshPreview]);

  // Handle Escape key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Handle navigation messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log('[RetroWeb Parent] Message received:', event.data);
      
      if (event.data?.type === 'navigate' && event.data?.page) {
        const targetSlug = event.data.page;
        console.log('[RetroWeb Parent] Looking for page with slug:', targetSlug);
        console.log('[RetroWeb Parent] Available pages:', project?.pages.map(p => ({ name: p.name, slug: p.slug })));
        
        const targetPage = project?.pages.find(p => p.slug.toLowerCase() === targetSlug.toLowerCase());
        console.log('[RetroWeb Parent] Found page:', targetPage);
        
        if (targetPage) {
          console.log('[RetroWeb Parent] Navigating to page ID:', targetPage.id);
          setCurrentPage(targetPage.id);
        } else {
          console.log('[RetroWeb Parent] Page not found!');
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [project, setCurrentPage]);

  const previewContent = useMemo(() => {
    if (!currentPage) {
      return `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                margin: 0;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                font-family: system-ui, sans-serif;
                color: #888;
              }
              .placeholder {
                text-align: center;
              }
              .placeholder h2 {
                color: #a855f7;
                margin-bottom: 8px;
              }
            </style>
          </head>
          <body>
            <div class="placeholder">
              <h2>Start Building</h2>
              <p>Use the chat to describe your website</p>
            </div>
          </body>
        </html>
      `;
    }

    // Get all page slugs for dynamic navigation
    const pageSlugs = project?.pages.map(p => p.slug) || [];

    // Navigation script - dynamically checks against actual page slugs
    const pageSlugsJson = JSON.stringify(pageSlugs.map(s => s.toLowerCase()));
    const navigationScript = `
      (function() {
        // Available pages in this project (all lowercase for comparison)
        var PAGE_SLUGS = ${pageSlugsJson};
        console.log('[RetroWeb Nav] Available pages:', PAGE_SLUGS);
        
        // Extract slug from various href formats
        function extractSlug(href) {
          if (!href) return null;
          var cleaned = href;
          // Remove leading ./ or /
          if (cleaned.indexOf('./') === 0) cleaned = cleaned.substring(2);
          if (cleaned.indexOf('/') === 0) cleaned = cleaned.substring(1);
          // Remove .html or .htm extension
          cleaned = cleaned.replace('.html', '').replace('.htm', '');
          // Remove # prefix if present
          if (cleaned.indexOf('#') === 0) cleaned = cleaned.substring(1);
          // Remove any query string or hash
          if (cleaned.indexOf('?') > -1) cleaned = cleaned.split('?')[0];
          if (cleaned.indexOf('#') > -1) cleaned = cleaned.split('#')[0];
          return cleaned.toLowerCase().trim();
        }
        
        // Intercept ALL clicks on the document
        document.addEventListener('click', function(e) {
          console.log('[RetroWeb Nav] Click detected on:', e.target);
          
          // Check for data-page attribute first (explicit navigation)
          var dataPageLink = e.target.closest ? e.target.closest('[data-page]') : null;
          if (dataPageLink) {
            e.preventDefault();
            e.stopPropagation();
            var page = dataPageLink.getAttribute('data-page').toLowerCase();
            console.log('[RetroWeb Nav] data-page navigation to:', page);
            window.parent.postMessage({ type: 'navigate', page: page }, '*');
            return false;
          }
          
          // Check for anchor links
          var anchor = e.target.closest ? e.target.closest('a[href]') : (e.target.tagName === 'A' ? e.target : null);
          if (anchor) {
            var href = anchor.getAttribute('href') || '';
            console.log('[RetroWeb Nav] Anchor clicked, href:', href);
            
            // Skip external links, mailto, tel, javascript, etc.
            if (href.indexOf('http') === 0 || href.indexOf('mailto:') === 0 || 
                href.indexOf('tel:') === 0 || href.indexOf('javascript:') === 0 ||
                href === '#' || href === '') {
              console.log('[RetroWeb Nav] Skipping external/special link');
              return;
            }
            
            // Extract potential slug from href
            var slug = extractSlug(href);
            console.log('[RetroWeb Nav] Extracted slug:', slug, 'from href:', href);
            
            // Check if this slug exists in our pages
            if (slug && PAGE_SLUGS.indexOf(slug) > -1) {
              console.log('[RetroWeb Nav] Navigating to page:', slug);
              e.preventDefault();
              e.stopPropagation();
              window.parent.postMessage({ type: 'navigate', page: slug }, '*');
              return false;
            } else {
              console.log('[RetroWeb Nav] Slug not found in pages:', slug);
            }
          }
        }, true);
        
        console.log('[RetroWeb Nav] Navigation script initialized');
      })();
    `;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            ${currentPage.css || ''}
          </style>
        </head>
        <body>
          ${currentPage.html || ''}
          <script>
            ${navigationScript}
            ${currentPage.js || ''}
          </script>
        </body>
      </html>
    `;
  }, [currentPage, project?.pages]);

  const viewportStyle = VIEWPORT_SIZES[viewportSize];

  // Fullscreen preview
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-gray-950 flex flex-col">
        {/* Fullscreen Header */}
        <div className="h-12 border-b border-gray-800 bg-gray-900 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <span className="text-white font-medium">Preview</span>
            <span className="text-gray-500 text-sm">{currentPage?.name || 'No page'}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refreshPreview}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              title="Refresh Preview"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button
              onClick={() => setIsFullscreen(false)}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              title="Exit Fullscreen (Esc)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Fullscreen Preview */}
        <div className="flex-1 overflow-auto custom-scrollbar">
          <iframe
            key={`fullscreen-${refreshKey}`}
            srcDoc={previewContent}
            className="w-full h-full border-0 bg-white"
            sandbox="allow-scripts allow-same-origin"
            title="Preview Fullscreen"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-950">
      {/* Preview Toolbar */}
      <div className="h-10 border-b border-gray-800 bg-gray-900 flex items-center justify-between px-3">
        <span className="text-gray-400 text-sm">Preview</span>
        <div className="flex items-center gap-1">
          <button
            onClick={refreshPreview}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
            title="Refresh Preview"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button
            onClick={() => setIsFullscreen(true)}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
            title="Fullscreen Preview"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-auto custom-scrollbar">
        <div
          className="bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300"
          style={{
            width: viewportStyle.width,
            maxWidth: viewportStyle.maxWidth,
            height: viewportSize === 'desktop' ? '100%' : 'auto',
            minHeight: viewportSize === 'desktop' ? '100%' : '600px',
          }}
        >
          <iframe
            ref={iframeRef}
            key={refreshKey}
            srcDoc={previewContent}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin"
            title="Preview"
          />
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-8 border-t border-gray-800 bg-gray-900 flex items-center justify-between px-4 text-xs text-gray-500">
        <span>
          {viewportSize.charAt(0).toUpperCase() + viewportSize.slice(1)} Preview
        </span>
        <span>
          {currentPage ? currentPage.name : 'No page selected'}
        </span>
      </div>
    </div>
  );
}
