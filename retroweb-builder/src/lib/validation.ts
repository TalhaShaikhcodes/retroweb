// Input validation and sanitization helpers

export const MAX_PROJECT_NAME_LENGTH = 50;
export const MAX_PAGE_NAME_LENGTH = 100;
export const MAX_SLUG_LENGTH = 100;
export const MAX_HTML_LENGTH = 500000; // 500KB
export const MAX_CSS_LENGTH = 100000; // 100KB
export const MAX_JS_LENGTH = 100000; // 100KB
export const MAX_MESSAGE_LENGTH = 10000; // 10KB
export const MAX_PROJECTS_PER_USER = 3;
export const MAX_GIF_SIZE = 1048576; // 1MB

/**
 * Validate project name
 */
export function validateProjectName(name: string): string | null {
  if (!name || name.trim().length === 0) {
    return 'Project name is required';
  }
  if (name.length > MAX_PROJECT_NAME_LENGTH) {
    return `Project name cannot exceed ${MAX_PROJECT_NAME_LENGTH} characters`;
  }
  return null;
}

/**
 * Validate page name
 */
export function validatePageName(name: string): string | null {
  if (!name || name.trim().length === 0) {
    return 'Page name is required';
  }
  if (name.length > MAX_PAGE_NAME_LENGTH) {
    return `Page name cannot exceed ${MAX_PAGE_NAME_LENGTH} characters`;
  }
  return null;
}

/**
 * Validate and sanitize slug
 */
export function validateSlug(slug: string): { valid: boolean; sanitized: string; error?: string } {
  if (!slug || slug.trim().length === 0) {
    return { valid: false, sanitized: '', error: 'Slug is required' };
  }

  const sanitized = sanitizeSlug(slug);

  if (sanitized.length === 0) {
    return { valid: false, sanitized: '', error: 'Slug contains no valid characters' };
  }

  if (sanitized.length > MAX_SLUG_LENGTH) {
    return { 
      valid: false, 
      sanitized: sanitized.slice(0, MAX_SLUG_LENGTH), 
      error: `Slug cannot exceed ${MAX_SLUG_LENGTH} characters` 
    };
  }

  return { valid: true, sanitized };
}

/**
 * Sanitize slug to only contain lowercase letters, numbers, and hyphens
 */
export function sanitizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, '-') // Replace invalid chars with hyphen
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Validate page content (HTML, CSS, JS)
 */
export function validatePageContent(
  html: string,
  css: string,
  js: string
): string | null {
  if (html.length > MAX_HTML_LENGTH) {
    return `HTML cannot exceed ${MAX_HTML_LENGTH} characters (${Math.round(MAX_HTML_LENGTH / 1000)}KB)`;
  }
  if (css.length > MAX_CSS_LENGTH) {
    return `CSS cannot exceed ${MAX_CSS_LENGTH} characters (${Math.round(MAX_CSS_LENGTH / 1000)}KB)`;
  }
  if (js.length > MAX_JS_LENGTH) {
    return `JavaScript cannot exceed ${MAX_JS_LENGTH} characters (${Math.round(MAX_JS_LENGTH / 1000)}KB)`;
  }
  return null;
}

/**
 * Validate chat message content
 */
export function validateMessageContent(content: string): string | null {
  if (!content || content.trim().length === 0) {
    return 'Message content is required';
  }
  if (content.length > MAX_MESSAGE_LENGTH) {
    return `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters (${Math.round(MAX_MESSAGE_LENGTH / 1000)}KB)`;
  }
  return null;
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  if (password.length > 72) {
    errors.push('Password cannot exceed 72 characters');
  }
  // Add more rules as needed
  // if (!/[A-Z]/.test(password)) {
  //   errors.push('Password must contain at least one uppercase letter');
  // }
  // if (!/[a-z]/.test(password)) {
  //   errors.push('Password must contain at least one lowercase letter');
  // }
  // if (!/[0-9]/.test(password)) {
  //   errors.push('Password must contain at least one number');
  // }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Sanitize HTML to prevent XSS (basic)
 * Note: For production, use a library like DOMPurify
 */
export function sanitizeHtml(html: string): string {
  // This is a basic sanitization - consider using DOMPurify for production
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // Remove inline event handlers
    .replace(/javascript:/gi, ''); // Remove javascript: protocol
}

/**
 * Validate file size
 */
export function validateFileSize(size: number, maxSize: number = MAX_GIF_SIZE): string | null {
  if (size > maxSize) {
    return `File size cannot exceed ${Math.round(maxSize / 1024 / 1024)}MB`;
  }
  return null;
}

/**
 * Validate MIME type
 */
export function validateMimeType(mimeType: string, allowedTypes: string[]): boolean {
  return allowedTypes.includes(mimeType);
}

/**
 * Rate limit helper (simple in-memory implementation)
 * For production, use Redis or a proper rate limiting service
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000 // 1 minute
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetAt) {
    // Create new record
    const resetAt = now + windowMs;
    rateLimitMap.set(identifier, { count: 1, resetAt });
    return { allowed: true, remaining: maxRequests - 1, resetAt };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }

  // Increment count
  record.count++;
  rateLimitMap.set(identifier, record);
  return { allowed: true, remaining: maxRequests - record.count, resetAt: record.resetAt };
}

/**
 * Clean up expired rate limit records (call periodically)
 */
export function cleanupRateLimits(): void {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetAt) {
      rateLimitMap.delete(key);
    }
  }
}

// Clean up every 5 minutes
if (typeof window === 'undefined') {
  // Only run on server
  setInterval(cleanupRateLimits, 5 * 60 * 1000);
}
