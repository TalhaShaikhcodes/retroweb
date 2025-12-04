# GIF Upload Guide

This guide explains how to upload retro GIFs to Supabase Storage for use in the RetroWeb Builder.

## Setup Complete ✅

The Supabase Storage bucket `retro-gifs` has been created with:
- Public read access
- 5MB max file size per GIF
- Only GIF files allowed

## Folder Structure

GIFs are organized by category:
```
retro-gifs/
├── animations/       # Animated elements (construction, new badges, etc.)
├── backgrounds/      # Tiled background patterns
├── buttons/          # Button and icon GIFs
├── decorations/      # Decorative elements (flames, sparkles, etc.)
└── themes/          # Theme-specific GIFs
    ├── geocities/
    ├── cyber/
    └── vaporwave/
```

## How to Upload GIFs

### Method 1: Single File Upload

Upload one GIF at a time:

```bash
npx tsx scripts/upload-gif.ts <category> <file-path>
```

**Example:**
```bash
npx tsx scripts/upload-gif.ts animations ./construction.gif
```

**Categories:**
- `animations`
- `backgrounds`
- `buttons`
- `decorations`
- `themes`

### Method 2: Bulk Upload

Upload multiple GIFs organized in folders:

1. **Organize your GIFs:**
```
my-retro-gifs/
├── animations/
│   ├── construction.gif
│   ├── new-badge.gif
│   └── email.gif
├── backgrounds/
│   ├── stars.gif
│   └── flames.gif
├── buttons/
│   └── home-button.gif
└── decorations/
    └── sparkles.gif
```

2. **Run bulk upload:**
```bash
npx tsx scripts/bulk-upload-gifs.ts ./my-retro-gifs
```

3. **Copy the generated registry entries** to `src/lib/gifRegistry.ts`

### Method 3: Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Select your "retroweb-builder" project
3. Navigate to Storage → retro-gifs bucket
4. Click "Upload file"
5. Select your GIF and choose the appropriate folder
6. Manually add entry to `gifRegistry.ts`

## After Uploading

### 1. Update the Registry

Add your GIF to `src/lib/gifRegistry.ts`:

```typescript
{
  id: 'my-gif',
  name: 'My Awesome GIF',
  category: 'animation',
  themes: ['geocities-chaos', 'all'],
  tags: ['cool', 'awesome', 'retro'],
  path: 'animations/my-gif.gif',
  width: 100,
  height: 50,
  fileSize: 15000,
  description: 'An awesome retro GIF'
}
```

### 2. Get the CDN URL

Use the helper function:

```typescript
import { getGifUrl } from '@/lib/gifCdn';

const url = getGifUrl('animations/construction.gif');
// Returns: https://your-project.supabase.co/storage/v1/object/public/retro-gifs/animations/construction.gif
```

## Finding Retro GIFs

### Free Sources:

1. **GifCities** - https://gifcities.org
   - Search archived Geocities GIFs
   - Authentic 90s content

2. **Archive.org** - https://archive.org
   - Geocities archives
   - Old website captures

3. **GitHub Collections**
   - Search for "retro gifs" or "geocities gifs"
   - Many curated collections available

4. **Create Your Own**
   - Use GIMP, Photoshop, or online tools
   - Keep file size under 5MB
   - Optimize for web (256 colors max)

## Best Practices

### File Naming
- Use lowercase with hyphens: `under-construction.gif`
- Be descriptive: `spinning-earth.gif` not `img1.gif`
- Avoid spaces and special characters

### File Size
- Keep under 100KB when possible
- Max 5MB (bucket limit)
- Optimize with tools like ezgif.com

### Dimensions
- Common sizes: 32x32, 50x50, 100x100, 150x50
- Backgrounds: 100x100 or smaller (for tiling)
- Buttons: 32x32 to 100x50
- Decorations: Varies

### Tagging
Add relevant tags for AI search:
- Descriptive: `construction`, `email`, `stars`
- Functional: `button`, `icon`, `background`
- Emotional: `exciting`, `warning`, `fun`
- Theme-related: `90s`, `retro`, `cyber`

## CDN URLs

All uploaded GIFs are automatically available via CDN:

```
https://xsuxxzzsqfvyvqyxswme.supabase.co/storage/v1/object/public/retro-gifs/{path}
```

**Examples:**
- `animations/construction.gif`
- `backgrounds/stars.gif`
- `buttons/email-icon.gif`
- `themes/geocities/rainbow-line.gif`

## Troubleshooting

### Upload fails with "File too large"
- Reduce file size to under 5MB
- Use GIF optimization tools

### Upload fails with "Invalid file type"
- Ensure file is actually a GIF
- Check file extension is `.gif`

### Can't see uploaded GIF
- Check the public URL in browser
- Verify bucket policy is set correctly
- Clear browser cache

## Next Steps

After uploading GIFs:
1. ✅ Update `gifRegistry.ts` with metadata
2. 🎨 Build GIF picker UI component
3. 🤖 Integrate with AI for smart GIF selection
4. 📊 Add GIF gallery in builder

## Need Help?

- Check Supabase Storage docs: https://supabase.com/docs/guides/storage
- View uploaded files: https://supabase.com/dashboard/project/xsuxxzzsqfvyvqyxswme/storage/buckets/retro-gifs
