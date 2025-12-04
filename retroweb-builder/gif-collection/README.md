# GIF Collection Folder

## 📁 Save Your GIFs Here!

This folder is where you should save all your retro GIFs before uploading them to Supabase Storage.

### Folder Structure

```
gif-collection/
├── animations/       ← Animated elements
│   ├── under-construction.gif
│   ├── new-badge.gif
│   ├── email-icon.gif
│   └── blinking-text.gif
│
├── backgrounds/      ← Tiled background patterns
│   ├── stars.gif
│   ├── flames.gif
│   ├── sparkles.gif
│   └── geometric-pattern.gif
│
├── buttons/          ← Button and icon GIFs
│   ├── home-button.gif
│   ├── email-button.gif
│   ├── back-button.gif
│   └── next-button.gif
│
├── decorations/      ← Decorative elements
│   ├── dancing-baby.gif
│   ├── spinning-logo.gif
│   ├── rainbow-line.gif
│   └── sparkle-divider.gif
│
└── themes/          ← Theme-specific GIFs
    ├── geocities/   ← Geocities-style GIFs
    ├── cyber/       ← Cyber/Matrix style GIFs
    └── vaporwave/   ← Vaporwave aesthetic GIFs
```

## 🎯 What to Put in Each Folder

### animations/
- Under construction signs
- "NEW!" badges
- Blinking text
- Email envelopes
- Animated arrows
- Loading spinners

### backgrounds/
- Starfield patterns
- Flame patterns
- Geometric patterns
- Sparkle effects
- Tiled textures
- Space backgrounds

### buttons/
- Home buttons
- Email buttons
- Navigation arrows
- Social media icons
- Download buttons
- Back/Next buttons

### decorations/
- Dancing baby
- Spinning logos
- Rainbow dividers
- Sparkle effects
- Animated borders
- Decorative lines

### themes/geocities/
- Rainbow text effects
- Visitor counters
- Guestbook signs
- Webring badges
- "Best viewed in..." badges

### themes/cyber/
- Matrix-style effects
- Terminal cursors
- Glitch effects
- Scanline overlays

### themes/vaporwave/
- Aesthetic text effects
- Retro computer graphics
- Palm tree animations
- Sunset gradients

## 📥 Where to Find Retro GIFs

### Best Sources:

1. **GifCities** - https://gifcities.org
   - Search archived Geocities GIFs
   - Download directly from archive

2. **Archive.org Geocities**
   - Browse old Geocities pages
   - Right-click and save GIFs

3. **GitHub Collections**
   - Search "retro gifs" or "geocities gifs"
   - Many curated collections available

4. **Create Your Own**
   - Use GIMP or Photoshop
   - Online tools like ezgif.com

## 📝 File Naming Guidelines

- Use lowercase with hyphens: `under-construction.gif`
- Be descriptive: `spinning-earth.gif` not `img1.gif`
- No spaces: `email-icon.gif` not `email icon.gif`
- Keep it short but clear

## ✅ After Adding GIFs

Once you've saved your GIFs in these folders, run:

```bash
cd retroweb-builder
npx tsx scripts/bulk-upload-gifs.ts ./gif-collection
```

This will:
1. Upload all GIFs to Supabase Storage
2. Generate registry entries
3. Make them available via CDN

## 🎨 Recommended Starter Collection

### Essential GIFs (20-30 to start):

**Animations (5-7):**
- under-construction.gif
- new-badge.gif
- email-icon.gif
- blinking-new.gif
- animated-arrow.gif

**Backgrounds (5-7):**
- stars.gif
- flames.gif
- sparkles.gif
- geometric-pattern.gif
- space-bg.gif

**Buttons (3-5):**
- home-button.gif
- email-button.gif
- back-button.gif

**Decorations (5-7):**
- dancing-baby.gif
- spinning-logo.gif
- rainbow-line.gif
- sparkle-divider.gif
- animated-border.gif

**Theme-specific (5-7):**
- geocities/visitor-counter.gif
- geocities/guestbook-sign.gif
- cyber/matrix-text.gif
- vaporwave/palm-tree.gif

## 💡 Tips

- Keep file sizes under 100KB when possible
- Max 5MB per file (Supabase limit)
- Optimize GIFs using ezgif.com
- Test GIFs in browser before uploading
- Organize as you download

## 🚀 Quick Start

1. Download 5-10 essential GIFs from gifcities.org
2. Save them in appropriate folders here
3. Run the upload script
4. Start using them in your builder!

---

**Status**: Ready for GIFs! Start adding files to these folders.
