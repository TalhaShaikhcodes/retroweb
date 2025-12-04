# Security Audit & Fixes - RetroWeb Builder

## Executive Summary

Security audit completed on December 3, 2025. Found **5 critical issues** and **4 warnings** that need immediate attention before production deployment.

---

## 🚨 CRITICAL ISSUES (Must Fix Before Deploy)

### 1. RLS Disabled on `profiles` Table ⚠️ CRITICAL

**Issue**: Row Level Security is disabled on the `profiles` table, which contains sensitive user data including GitHub access tokens.

**Risk**: Any authenticated user can read/modify ANY user's profile data, including stealing GitHub tokens.

**Fix Required**:
```sql
-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Verify policies exist (they do according to Supabase)
-- Policies: "Users can view own profile", "Users can update own profile"
```

**How to Apply**:
1. Go to Supabase Dashboard → SQL Editor
2. Run the above SQL command
3. Verify RLS is enabled in Table Editor

---

### 2. No Rate Limiting on API Routes ⚠️ CRITICAL

**Issue**: API routes have no rate limiting, allowing unlimited requests.

**Risk**: 
- DDoS attacks
- Database overload
- Excessive Supabase costs
- AI API abuse (Gemini calls)

**Fix Required**: Implement rate limiting middleware

**Solution**: Add rate limiting using Vercel Edge Config or Upstash Redis

```typescript
// retroweb-builder/src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Create rate limiter (requires Upstash Redis)
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests per 10 seconds
  analytics: true,
});

export async function middleware(request: NextRequest) {
  // Only rate limit API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.ip ?? '127.0.0.1';
    const { success, limit, reset, remaining } = await ratelimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
          },
        }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
```

**Alternative (Simple)**: Use Vercel's built-in rate limiting (Pro plan) or implement IP-based tracking in memory for development.

---

### 3. Missing Input Validation & Sanitization ⚠️ HIGH

**Issue**: User inputs are not properly validated or sanitized.

**Risk**:
- XSS attacks through HTML/CSS/JS injection
- SQL injection (mitigated by Supabase but still risky)
- Excessive data storage

**Vulnerable Endpoints**:
- `/api/projects/[id]/pages/[pageId]` - No HTML sanitization
- `/api/projects/[id]/messages` - No content length limit
- `/api/projects` - No name length validation

**Fix Required**:

```typescript
// Add validation helper
// retroweb-builder/src/lib/validation.ts
export const MAX_PROJECT_NAME_LENGTH = 50;
export const MAX_PAGE_NAME_LENGTH = 100;
export const MAX_HTML_LENGTH = 500000; // 500KB
export const MAX_CSS_LENGTH = 100000; // 100KB
export const MAX_JS_LENGTH = 100000; // 100KB
export const MAX_MESSAGE_LENGTH = 10000; // 10KB

export function validateProjectName(name: string): string | null {
  if (!name || name.trim().length === 0) {
    return 'Project name is required';
  }
  if (name.length > MAX_PROJECT_NAME_LENGTH) {
    return `Project name cannot exceed ${MAX_PROJECT_NAME_LENGTH} characters`;
  }
  return null;
}

export function validatePageContent(html: string, css: string, js: string): string | null {
  if (html.length > MAX_HTML_LENGTH) {
    return `HTML cannot exceed ${MAX_HTML_LENGTH} characters`;
  }
  if (css.length > MAX_CSS_LENGTH) {
    return `CSS cannot exceed ${MAX_CSS_LENGTH} characters`;
  }
  if (js.length > MAX_JS_LENGTH) {
    return `JavaScript cannot exceed ${MAX_JS_LENGTH} characters`;
  }
  return null;
}

export function sanitizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
```

---

### 4. Leaked Password Protection Disabled ⚠️ MEDIUM

**Issue**: Supabase Auth is not checking passwords against HaveIBeenPwned database.

**Risk**: Users can use compromised passwords.

**Fix Required**:
1. Go to Supabase Dashboard → Authentication → Policies
2. Enable "Leaked Password Protection"
3. This will check passwords against HaveIBeenPwned.org

---

### 5. Function Search Path Mutable ⚠️ MEDIUM

**Issue**: Database functions don't have fixed search_path, making them vulnerable to search_path attacks.

**Affected Functions**:
- `check_user_gif_limit`
- `check_project_limit`
- `update_updated_at_column`

**Fix Required**:
```sql
-- Fix search_path for functions
ALTER FUNCTION public.check_user_gif_limit() SET search_path = public, pg_temp;
ALTER FUNCTION public.check_project_limit() SET search_path = public, pg_temp;
ALTER FUNCTION public.update_updated_at_column() SET search_path = public, pg_temp;
```

---

## ⚠️ WARNINGS (Recommended Fixes)

### 6. No CORS Configuration

**Issue**: No explicit CORS headers set.

**Risk**: Potential CORS issues in production.

**Fix**: Add CORS headers in `next.config.js`:

```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: process.env.NEXT_PUBLIC_SITE_URL || '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PATCH,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};
```

---

### 7. No Content Security Policy (CSP)

**Issue**: No CSP headers to prevent XSS attacks.

**Risk**: XSS vulnerabilities in user-generated content.

**Fix**: Add CSP headers in `next.config.js`:

```javascript
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https:;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`;

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\n/g, ''),
          },
        ],
      },
    ];
  },
};
```

---

### 8. GitHub Token Stored in Database

**Issue**: GitHub access tokens stored in plaintext in `profiles.github_access_token`.

**Risk**: If database is compromised, tokens are exposed.

**Recommendation**: 
- Encrypt tokens before storing
- Or use Supabase Vault for sensitive data
- Or don't store tokens, use session-only storage

---

### 9. No Logging/Monitoring

**Issue**: No security event logging or monitoring.

**Risk**: Can't detect or respond to attacks.

**Recommendation**:
- Add logging for failed auth attempts
- Monitor rate limit violations
- Track suspicious activity patterns
- Use Vercel Analytics or Sentry

---

## ✅ GOOD SECURITY PRACTICES FOUND

1. ✅ Authentication checks on all API routes
2. ✅ Project ownership verification before operations
3. ✅ RLS enabled on most tables (except profiles)
4. ✅ Foreign key constraints properly set
5. ✅ Project limit enforcement (3 max)
6. ✅ File size limits on GIF uploads (1MB)
7. ✅ Using Supabase server-side client (not exposing keys)
8. ✅ Email confirmation available

---

## 🔧 IMMEDIATE ACTION ITEMS (Before Deploy)

### Priority 1 (MUST FIX):
1. ✅ Enable RLS on `profiles` table
2. ✅ Add rate limiting middleware
3. ✅ Add input validation and length limits
4. ✅ Enable leaked password protection

### Priority 2 (SHOULD FIX):
5. ✅ Fix function search_path
6. ✅ Add CORS configuration
7. ✅ Add CSP headers
8. ✅ Add basic logging

### Priority 3 (NICE TO HAVE):
9. ⚪ Encrypt GitHub tokens
10. ⚪ Add monitoring/alerting
11. ⚪ Add security headers (HSTS, X-Frame-Options, etc.)
12. ⚪ Implement API key rotation

---

## 📋 DEPLOYMENT CHECKLIST

Before deploying to production:

- [ ] Enable RLS on profiles table
- [ ] Set up rate limiting (Upstash Redis or alternative)
- [ ] Add input validation to all API routes
- [ ] Enable leaked password protection in Supabase
- [ ] Fix database function search_path
- [ ] Configure CORS headers
- [ ] Add CSP headers
- [ ] Set up error logging (Sentry/Vercel)
- [ ] Review and rotate any exposed API keys
- [ ] Test authentication flows
- [ ] Test rate limiting
- [ ] Verify RLS policies work correctly
- [ ] Set up monitoring/alerts

---

## 🔐 ENVIRONMENT VARIABLES TO SECURE

Ensure these are set in production:

```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key # Keep secret!

# Recommended for rate limiting
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token

# Optional
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

**NEVER commit these to Git!**

---

## 📚 RESOURCES

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/database/database-linter)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Vercel Security](https://vercel.com/docs/security)
- [Upstash Rate Limiting](https://upstash.com/docs/redis/features/ratelimiting)

---

## 🎯 CONCLUSION

Your application has good foundational security but requires immediate fixes before production deployment. The most critical issue is the disabled RLS on the profiles table, which could lead to data breaches.

**Estimated Time to Fix**: 2-4 hours for Priority 1 items.

**Next Steps**:
1. Apply SQL fixes in Supabase Dashboard
2. Implement rate limiting
3. Add validation helpers
4. Test thoroughly
5. Deploy with confidence! 🚀
