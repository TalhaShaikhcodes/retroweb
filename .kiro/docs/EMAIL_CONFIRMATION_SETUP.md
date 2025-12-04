# Email Confirmation Setup Guide

## Overview
Email confirmation has been implemented for new user signups. Users must verify their email address before accessing the application.

## Supabase Configuration (Required)

### 1. Enable Email Confirmation

Go to your Supabase Dashboard:

1. Navigate to **Authentication** → **Providers** → **Email**
2. Toggle **"Confirm email"** to ON
3. Save changes

### 2. Configure URL Settings

In **Authentication** → **URL Configuration**:

**Development:**
- Site URL: `http://localhost:3000`
- Redirect URLs: Add `http://localhost:3000/auth/callback`

**Production:**
- Site URL: `https://yourdomain.com`
- Redirect URLs: Add `https://yourdomain.com/auth/callback`

### 3. Customize Email Templates (Optional)

In **Authentication** → **Email Templates**, you can customize:
- **Confirm signup** - The email sent to new users
- Subject line
- Email body (supports HTML and variables like `{{ .ConfirmationURL }}`)

Example template:
```html
<h2>Welcome to RetroWeb Builder!</h2>
<p>Click the link below to confirm your email address:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm Email</a></p>
<p>If you didn't create an account, you can safely ignore this email.</p>
```

## Implementation Details

### Files Modified

1. **`src/contexts/AuthContext.tsx`**
   - Updated `signUpWithEmail` to return `needsEmailConfirmation` flag
   - Detects when Supabase requires email confirmation (user exists but no session)

2. **`src/app/signup/page.tsx`**
   - Shows "Check Your Email" screen when confirmation is required
   - Displays user's email address
   - Provides link back to login

3. **`src/app/auth/callback/route.ts`** (NEW)
   - Handles email confirmation callback
   - Exchanges confirmation code for session
   - Redirects to dashboard on success
   - Redirects to login with error on failure

4. **`src/app/login/page.tsx`**
   - Shows error message if callback fails
   - Handles `?error=auth_callback_error` query parameter

## User Flow

### With Email Confirmation Enabled

1. User fills out signup form
2. User submits form
3. Account is created in Supabase (unconfirmed)
4. "Check Your Email" screen appears
5. User receives confirmation email
6. User clicks link in email
7. Browser redirects to `/auth/callback?code=...`
8. Callback route exchanges code for session
9. User is redirected to dashboard (logged in)

### Without Email Confirmation (Development)

1. User fills out signup form
2. User submits form
3. Account is created and session starts immediately
4. "Account Created!" success screen appears
5. User is redirected to dashboard (logged in)

## Testing

### Test Email Confirmation Flow

1. Enable email confirmation in Supabase dashboard
2. Sign up with a real email address
3. Check your inbox for confirmation email
4. Click the confirmation link
5. Verify you're redirected to dashboard and logged in

### Test Without Email Confirmation

1. Disable email confirmation in Supabase dashboard
2. Sign up with any email
3. Verify immediate redirect to dashboard

## Environment Variables

No additional environment variables needed. The callback URL is automatically constructed using `window.location.origin`.

## Security Notes

- Email confirmation prevents spam accounts
- Unconfirmed users cannot access protected routes
- Confirmation links expire after 24 hours (Supabase default)
- Users can request a new confirmation email via Supabase Auth API

## Troubleshooting

### "Email confirmation failed" error

**Causes:**
- Confirmation link expired (>24 hours old)
- Invalid or tampered confirmation code
- Network issues during callback

**Solution:**
- User needs to sign up again
- Or implement "Resend confirmation email" feature

### Email not received

**Causes:**
- Email in spam folder
- Invalid email address
- Supabase email service issues

**Solution:**
- Check spam folder
- Verify email address is correct
- Check Supabase logs in dashboard

### Immediate login without confirmation

**Cause:**
- Email confirmation is disabled in Supabase

**Solution:**
- Enable "Confirm email" in Supabase dashboard

## Future Enhancements

Consider adding:
- Resend confirmation email button
- Email verification status indicator
- Custom confirmation page with branding
- Rate limiting for signup attempts
- Email change confirmation flow
