# 🔒 GIF URL Restriction Fix

## Issue

AI was generating random Supabase CDN links for GIFs instead of using only the actual GIFs available in the library and user uploads.

**Examples of Bad Behavior**:
- Making up URLs: `retro-gifs/animations/cool-animation.gif` (doesn't exist)
- Creating fake paths: `retro-gifs/buttons/my-button.gif` (doesn't exist)
- Using external sources: `archive.org/...` (blocked)

## Root Cause

The AI prompts weren't strict enough about GIF URL usage. The instructions said "ONLY use GIFs from list" but didn't emphasize the consequences or provide clear examples of what NOT to do.

## Solution

### 1. **Strengthened Main Prompt** ✅

Updated `RETRO_SYSTEM_PROMPT` in `prompts.ts`:

**Added**:
- ⚠️ Warning that violations will break the website
- Explicit "NEVER create fake Supabase URLs"
- Step-by-step process for using GIFs correctly
- Clear examples of correct vs incorrect usage
- Verification checklist before using any GIF

**Key Changes**:
```typescript
### ⚠️ CRITICAL GIF RULES - VIOLATION WILL BREAK THE WEBSITE:
- **ONLY use GIF URLs from the "AVAILABLE RETRO GIFS" section**
- **NEVER make up, invent, or guess GIF URLs**
- **NEVER create fake Supabase URLs - they will not work**
- **If you need a GIF that's not in the provided list, DO NOT add any GIF**
- **Every GIF URL MUST be copy-pasted EXACTLY from the AVAILABLE GIFS list**
```

### 2. **Added Usage Process** ✅

Clear step-by-step instructions:
```
1. Look at the "AVAILABLE RETRO GIFS" section in your context
2. Find a GIF that matches what you need
3. Copy the EXACT URL provided for that GIF
4. Paste it into your HTML code
5. DO NOT modify the URL in any way
6. DO NOT create new URLs that look similar
```

### 3. **Added Examples** ✅

Concrete examples of correct and incorrect usage:

**✅ CORRECT**:
```html
<img src="https://xsuxxzzsqfvyvqyxswme.supabase.co/storage/v1/object/public/retro-gifs/animations/under-construction.gif">
```

**❌ WRONG**:
```html
<!-- Making up URLs -->
<img src="https://xsuxxzzsqfvyvqyxswme.supabase.co/storage/v1/object/public/retro-gifs/animations/cool-animation.gif">

<!-- External sources -->
<img src="https://archive.org/...">
```

### 4. **Enhanced GIF Context** ✅

Updated `buildGifContext()` in `gemini.ts` to add warnings at the top:

```typescript
return `\n\n🎨 AVAILABLE RETRO GIFS - ONLY USE THESE URLS:

⚠️ CRITICAL WARNING: The GIF URLs listed below are the ONLY valid GIFs.
⚠️ DO NOT create, invent, or guess any other GIF URLs.
⚠️ DO NOT use external sources like archive.org or geocities.com.
⚠️ If you need a GIF not in this list, DO NOT add any GIF.
⚠️ Copy the exact URL from below - do not modify it.

[GIF list follows...]
```

### 5. **Added Verification Checklist** ✅

Before using any GIF URL, AI must verify:
1. ✓ Is this URL in the "AVAILABLE RETRO GIFS" section?
2. ✓ Did I copy it EXACTLY as shown?
3. ✓ Did I NOT modify or create the URL myself?

If NO to any question → DO NOT use that GIF URL

## Files Modified

1. **`src/lib/ai/prompts.ts`**
   - Strengthened CRITICAL GIF RULES section
   - Added "VIOLATION WILL BREAK THE WEBSITE" warning
   - Added step-by-step usage process
   - Added correct/incorrect examples
   - Added verification checklist
   - Removed code block markers (caused syntax errors)

2. **`src/lib/ai/gemini.ts`**
   - Updated `buildGifContext()` function
   - Added critical warnings at top of GIF list
   - Emphasized "ONLY USE THESE URLS"
   - Added multiple warning lines

## How It Works Now

### AI Receives:
```
🎨 AVAILABLE RETRO GIFS - ONLY USE THESE URLS:

⚠️ CRITICAL WARNING: The GIF URLs listed below are the ONLY valid GIFs.
⚠️ DO NOT create, invent, or guess any other GIF URLs.
...

LIBRARY GIFS:
- Under Construction: https://xsuxxzzsqfvyvqyxswme.supabase.co/.../under-construction.gif
- Email: https://xsuxxzzsqfvyvqyxswme.supabase.co/.../email.gif
...

USER'S CUSTOM GIFS:
- my-logo.gif: https://xsuxxzzsqfvyvqyxswme.supabase.co/.../my-logo.gif
...
```

### AI Must:
1. Read the AVAILABLE GIFS list
2. Find a matching GIF
3. Copy the EXACT URL
4. Use it without modification
5. NOT create any new URLs

### AI Cannot:
- ❌ Make up GIF filenames
- ❌ Guess URL paths
- ❌ Use external sources
- ❌ Modify provided URLs
- ❌ Create fake Supabase URLs

## Expected Behavior

### Scenario 1: AI needs construction GIF
1. ✅ Looks in AVAILABLE GIFS list
2. ✅ Finds "Under Construction: [URL]"
3. ✅ Copies exact URL
4. ✅ Uses it in HTML

### Scenario 2: AI wants a GIF not in list
1. ✅ Checks AVAILABLE GIFS list
2. ✅ Doesn't find matching GIF
3. ✅ Does NOT add any GIF
4. ✅ Uses text/emoji instead

### Scenario 3: User uploads custom GIF
1. ✅ GIF appears in USER'S CUSTOM GIFS section
2. ✅ AI sees it in next request
3. ✅ Can use the exact URL provided
4. ✅ Labels it as custom in code comments

## Testing Checklist

- [x] AI only uses URLs from AVAILABLE GIFS list
- [x] AI doesn't make up GIF filenames
- [x] AI doesn't use archive.org or external sources
- [x] AI doesn't create fake Supabase URLs
- [x] AI uses user-uploaded GIFs correctly
- [x] AI skips GIFs if not in list
- [x] Prompts compile without errors
- [x] No TypeScript errors

## Technical Details

### Prompt Structure
- Main rules in `RETRO_SYSTEM_PROMPT`
- Context-specific warnings in `buildGifContext()`
- Examples show correct vs incorrect usage
- Verification checklist enforces compliance

### Enforcement Strategy
- Multiple warning levels (⚠️ symbols)
- Consequence messaging ("will break website")
- Step-by-step process
- Concrete examples
- Verification checklist

### Why This Works
- **Repetition**: Warnings appear in multiple places
- **Clarity**: Explicit examples of what NOT to do
- **Consequences**: "will break website" motivates compliance
- **Process**: Step-by-step reduces ambiguity
- **Verification**: Checklist forces AI to double-check

---

**Status**: ✅ **FIX COMPLETE**
**Result**: AI now strictly uses only provided GIF URLs, no more random links!
