// Parse AI responses and extract code blocks
import { NewPageRequest } from './types';

export interface ParsedResponse {
  message: string;
  code: {
    html?: string;
    css?: string;
    js?: string;
  };
  newPages?: NewPageRequest[];
}

/**
 * Extract code blocks from AI response
 * Supports ```html, ```css, ```javascript, ```js formats
 * Handles both with and without newline after language identifier
 */
export function parseAIResponse(response: string): ParsedResponse {
  // More flexible regex: newline after language is optional, also handles \r\n
  const codeBlockRegex = /```(\w+)[\r\n]*([\s\S]*?)```/g;
  const code: ParsedResponse['code'] = {};
  let message = response;

  let match;
  while ((match = codeBlockRegex.exec(response)) !== null) {
    const [fullMatch, language, content] = match;
    const trimmedContent = content.trim();

    switch (language.toLowerCase()) {
      case 'html':
        code.html = trimmedContent;
        break;
      case 'css':
        code.css = trimmedContent;
        break;
      case 'javascript':
      case 'js':
        code.js = trimmedContent;
        break;
    }

    // Remove code block from message
    message = message.replace(fullMatch, '').trim();
  }

  // Clean up extra whitespace in message
  message = message.replace(/\n{3,}/g, '\n\n').trim();

  // Extract new page markers from HTML
  const newPages = extractNewPageMarkers(code.html || '');

  return { message, code, newPages: newPages.length > 0 ? newPages : undefined };
}

/**
 * Extract NEW_PAGE markers from HTML
 * Format: <!-- NEW_PAGE: slug | Page Name -->
 */
export function extractNewPageMarkers(html: string): NewPageRequest[] {
  const newPageRegex = /<!--\s*NEW_PAGE:\s*(\S+)\s*\|\s*([^>]+?)\s*-->/g;
  const pages: NewPageRequest[] = [];
  const seen = new Set<string>();

  let match;
  while ((match = newPageRegex.exec(html)) !== null) {
    const slug = match[1].toLowerCase().trim();
    const name = match[2].trim();
    
    if (!seen.has(slug)) {
      seen.add(slug);
      pages.push({ slug, name });
    }
  }

  return pages;
}

/**
 * Check if response contains any code
 */
export function hasCode(parsed: ParsedResponse): boolean {
  return !!(parsed.code.html || parsed.code.css || parsed.code.js);
}

/**
 * Merge new code with existing code
 * Only updates fields that are present in the new code
 */
export function mergeCode(
  existing: { html: string; css: string; js: string },
  newCode: ParsedResponse['code']
): { html: string; css: string; js: string } {
  return {
    html: newCode.html ?? existing.html,
    css: newCode.css ?? existing.css,
    js: newCode.js ?? existing.js,
  };
}
