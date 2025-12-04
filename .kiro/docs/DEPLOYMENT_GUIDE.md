# Vercel Deployment Guide - RetroWeb Builder

## Complete Step-by-Step Deployment Instructions

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure:
- ✅ All security fixes applied (see `SECURITY_FIXES_APPLIED.md`)
- ✅ Leaked password protection enabled in Supabase
- ✅ Code committed to Git repository
- ✅ Supabase project is active and healthy
- ✅ You have a Vercel account

---

## 🚀 STEP 1: Prepare Your Repository

### 1.1 Create .gitignore (if not exists)

Make sure these are in your `.gitignore`:

```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Next.js
.next/
out/
build/
dist/

# Environment variables
.env
.env*.local
.env.production

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Vercel
.vercel

# Supabase
.supabase/
```

### 1.2 Create .env.example

Create a template for environment variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Supabase Service Role (KEEP SECRET - Server-side only)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Site URL (for redirects)
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

### 1.3 Commit and Push to GitHub

```bash
cd retroweb-builder
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

---

## 🔑 STEP 2: Get Your Supabase Credentials

### 2.1 Get Supabase URL and Keys

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your `retroweb-builder` project
3. Go to **Settings** → **API**
4. Copy these values:

**Project URL:**
```
https://xsuxxzzsqfvyvqyxswme.supabase.co
```

**Anon/Public Key:** (starts with `eyJ...`)
```
This is safe to expose in client-side code
```

**Service Role Key:** (starts with `eyJ...`)
```
⚠️ KEEP THIS SECRET! Never expose in client-side code
```

### 2.2 Update Supabase Redirect URLs

1. In Supabase Dashboard → **Authentication** → **URL Configuration**
2. Add your Vercel domain to **Redirect URLs**:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://your-app.vercel.app/auth/callback`
3. Set **Site URL** to your production domain:
   - `https://your-app.vercel.app`

---

## 🌐 STEP 3: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

#### 3.1 Connect Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Select the `retroweb-builder` folder as the root directory

#### 3.2 Configure Project

**Framework Preset:** Next.js (auto-detected)

**Root Directory:** `retroweb-builder` (if in monorepo)

**Build Command:** `npm run build` (default)

**Output Directory:** `.next` (default)

**Install Command:** `npm install` (default)

#### 3.3 Add Environment Variables

Click **"Environment Variables"** and add:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xsuxxzzsqfvyvqyxswme.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your anon key | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service role key | Production, Preview, Development |
| `NEXT_PUBLIC_SITE_URL` | `https://your-app.vercel.app` | Production |

**Important:** 
- Check all three environments (Production, Preview, Development)
- Service role key should be marked as "Sensitive"

#### 3.4 Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. Your app will be live at `https://your-app.vercel.app`

---

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (from retroweb-builder directory)
cd retroweb-builder
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name? retroweb-builder
# - Directory? ./
# - Override settings? No

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add NEXT_PUBLIC_SITE_URL

# Deploy to production
vercel --prod
```

---

## 🔧 STEP 4: Post-Deployment Configuration

### 4.1 Update Supabase URLs (IMPORTANT!)

After deployment, update Supabase with your actual Vercel URL:

1. Go to Supabase Dashboard → **Authentication** → **URL Configuration**
2. Update **Site URL**: `https://your-actual-domain.vercel.app`
3. Update **Redirect URLs**: Add `https://your-actual-domain.vercel.app/auth/callback`
4. Click **Save**

### 4.2 Update Environment Variable

In Vercel Dashboard:
1. Go to your project → **Settings** → **Environment Variables**
2. Edit `NEXT_PUBLIC_SITE_URL`
3. Change to your actual Vercel URL: `https://your-actual-domain.vercel.app`
4. Click **Save**
5. Redeploy: **Deployments** → **...** → **Redeploy**

### 4.3 Enable Leaked Password Protection

1. Go to Supabase Dashboard → **Authentication** → **Policies**
2. Enable **"Leaked Password Protection"**
3. Click **Save**

---

## ✅ STEP 5: Verify Deployment

### 5.1 Test Core Functionality

Visit your deployed site and test:

- [ ] Landing page loads correctly
- [ ] Sign up with new account
- [ ] Check email for confirmation (if enabled)
- [ ] Log in with credentials
- [ ] Create a new project
- [ ] Open builder and chat with AI
- [ ] Preview generated website
- [ ] Export project
- [ ] Deploy to GitHub (if configured)
- [ ] Log out and log back in

### 5.2 Test Security Features

- [ ] Try creating 4th project (should be blocked)
- [ ] Try rapid API requests (should get rate limited)
- [ ] Check browser console for errors
- [ ] Verify HTTPS is working

### 5.3 Check Logs

In Vercel Dashboard:
1. Go to your project → **Deployments** → Click latest deployment
2. Click **"View Function Logs"**
3. Check for any errors

---

## 🎨 STEP 6: Custom Domain (Optional)

### 6.1 Add Custom Domain

1. In Vercel Dashboard → Your Project → **Settings** → **Domains**
2. Click **"Add"**
3. Enter your domain: `retroweb.yourdomain.com`
4. Follow DNS configuration instructions

### 6.2 Update Supabase URLs

After adding custom domain:
1. Update Supabase **Site URL** to your custom domain
2. Add custom domain to **Redirect URLs**
3. Update `NEXT_PUBLIC_SITE_URL` in Vercel environment variables
4. Redeploy

---

## 🔍 STEP 7: Monitoring & Maintenance

### 7.1 Set Up Monitoring

**Vercel Analytics** (Recommended):
1. Go to your project → **Analytics**
2. Enable Web Analytics
3. Monitor traffic and performance

**Supabase Monitoring**:
1. Go to Supabase Dashboard → **Reports**
2. Monitor database usage
3. Check API requests
4. Review auth activity

### 7.2 Regular Maintenance

**Weekly:**
- Check Vercel deployment logs
- Review Supabase usage metrics
- Monitor error rates

**Monthly:**
- Review security advisors in Supabase
- Update dependencies: `npm update`
- Check for Next.js updates

---

## 🐛 Troubleshooting

### Issue: "Unauthorized" errors

**Solution:**
- Verify environment variables are set correctly
- Check Supabase URL and keys
- Ensure redirect URLs include your domain

### Issue: Email confirmation not working

**Solution:**
- Check Supabase email settings
- Verify redirect URL includes `/auth/callback`
- Check spam folder

### Issue: Rate limiting too strict

**Solution:**
- Adjust limits in `src/middleware.ts`
- Redeploy after changes

### Issue: Build fails on Vercel

**Solution:**
- Check build logs for specific error
- Verify all dependencies in `package.json`
- Try building locally: `npm run build`

### Issue: Environment variables not working

**Solution:**
- Ensure variables are set for correct environment
- Redeploy after adding variables
- Check variable names match exactly (case-sensitive)

---

## 📊 Environment Variables Reference

### Required Variables

| Variable | Description | Where to Get | Sensitive? |
|----------|-------------|--------------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Supabase Dashboard → Settings → API | No |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key | Supabase Dashboard → Settings → API | No |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key | Supabase Dashboard → Settings → API | **YES** |
| `NEXT_PUBLIC_SITE_URL` | Your production URL | Your Vercel deployment URL | No |

### Optional Variables (Future)

| Variable | Description | When Needed |
|----------|-------------|-------------|
| `UPSTASH_REDIS_REST_URL` | Redis for rate limiting | High traffic |
| `UPSTASH_REDIS_REST_TOKEN` | Redis token | High traffic |
| `SENTRY_DSN` | Error tracking | Production monitoring |

---

## 🚀 Quick Deploy Checklist

Use this for future deployments:

- [ ] Code committed and pushed to GitHub
- [ ] Environment variables configured in Vercel
- [ ] Supabase redirect URLs updated
- [ ] Leaked password protection enabled
- [ ] Deployed to Vercel
- [ ] Tested core functionality
- [ ] Checked logs for errors
- [ ] Updated documentation

---

## 📞 Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Vercel Support:** https://vercel.com/support
- **Supabase Support:** https://supabase.com/support

---

## 🎉 Congratulations!

Your RetroWeb Builder is now live and secure! 

**Next Steps:**
1. Share your app with users
2. Monitor usage and performance
3. Gather feedback
4. Iterate and improve

**Your deployment URL:** `https://your-app.vercel.app`

---

**Deployment Guide Version:** 1.0
**Last Updated:** December 3, 2025
**Status:** Production Ready ✅
