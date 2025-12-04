# GIF Feature - Complete Implementation Guide

## 🎉 Implementation 100% Complete! (All Phases)

The GIF feature is now **fully functional** with all enhancements:

✅ **AI can now use 92 retro GIFs** from the library
✅ **Users can upload custom GIFs** (5 per project, 1MB max)
✅ **AI receives GIF context** with every generation
✅ **Unlimited GIF usage** when user requests it
✅ **Complete GIF removal** when user requests it
✅ **API routes** for GIF management
✅ **Visual GIF gallery** with search and filters
✅ **Browse all 92 GIFs** by category and theme
✅ **Manage custom GIFs** with delete functionality

### What Works Now:
- AI automatically selects appropriate GIFs based on theme
- Users can upload GIFs via file upload button
- Uploaded GIFs appear in AI context as "Custom"
- AI respects user's GIF quantity preferences (2-5 default, unlimited on request)
- User can say "remove all GIFs" to clear them from page
- **NEW:** Click 🎨 button to browse all 92 GIFs in visual gallery
- **NEW:** Filter GIFs by category (animations, buttons, decorations)
- **NEW:** Filter GIFs by theme (geocities, cyber, vaporwave, etc.)
- **NEW:** Search GIFs by name or tags
- **NEW:** View and manage custom uploaded GIFs
- **NEW:** Click any GIF to insert it into chat message

## ✅ Already Complete

1. **Database**: `user_gifs` table with 5 GIF limit per project
2. **Storage**: `user-gifs` bucket (1MB max per file)
3. **Library**: 92 retro GIFs in `retro-gifs` bucket
4. **Registry**: `gifRegistry.ts` with all GIF metadata
5. **AI Integration**: GIF context passed to Gemini API
6. **User Uploads**: GIF upload API and hook implemented

## 🎯 Implementation Tasks

### Task 1: Update File Upload to Handle GIFs

**File**: `retroweb-builder/src/components/builder/ChatPanel.tsx`

**Current**: File upload handles images and documents
**Update**: Detect GIF uploads and store them in `user-gifs` bucket + database

```typescript
// In handleFileSelect function, add GIF handling:
if (file.type === 'image/gif') {
  // Check project GIF limit (5 max)
  // Upload to user-gifs bucket: user-gifs/{userId}/{projectId}/{filename}
  // Save to user_gifs table
  // Show in attachments with special "GIF" badge
}
```

### Task 2: Update AI Context with GIF Library

**File**: `retroweb-builder/src/lib/ai/types.ts`

Add to `AIContext`:
```typescript
export interface AIContext {
  // ... existing fields
  availableGifs?: {
    library: Array<{ id: string; name: string; url: string; tags: string[] }>;
    userGifs: Array<{ id: string; name: string; url: string }>;
  };
}
```

### Task 3: Update AI Prompts with GIF Guidelines

**File**: `retroweb-builder/src/lib/ai/prompts.ts`

Add to `RETRO_SYSTEM_PROMPT`:
```markdown
## USING RETRO GIFS

You have access to a library of authentic retro GIFs. Use them appropriately:

### GIF Usage Rules:
- **Default**: Use 2-5 GIFs per page (balanced retro aesthetic)
- **CRITICAL - User Override**: ALWAYS honor user's explicit requests, ignoring all limits:
  - "Add more GIFs" → Use 6-10 GIFs
  - "Add lots of GIFs" → Use 10-15+ GIFs
  - "Add even more" / "Go crazy" → Use 20-30+ GIFs (NO MAXIMUM LIMIT!)
  - "Remove all GIFs" → Remove EVERY SINGLE GIF tag from the page
  - "No GIFs" → Don't include any GIFs
  - "Minimal GIFs" → Use 1-2 GIFs only
- Match GIFs to theme and content
- Use full CDN URLs provided in context
- Read existing page HTML to see current GIF count before adding/removing
- Common placements:
  - Under construction signs for WIP sections
  - Email icons near contact info
  - NEW badges for announcements
  - Arrows for navigation
  - Decorative elements in headers/footers

### Available GIFs:
{GIF_LIBRARY_CONTEXT}

### User's Custom GIFs:
{USER_GIFS_CONTEXT}

### Example Usage:
<img src="https://xsuxxzzsqfvyvqyxswme.supabase.co/storage/v1/object/public/retro-gifs/animations/under-construction.gif" alt="Under Construction">

### When User Attaches a GIF:
- User can upload GIFs via file attachment
- User can select GIFs from gallery and describe what to do
- Implement exactly what user requests with the GIF
- Use the provided GIF URL in your generated code
```

### Task 4: Pass GIF Context to AI

**File**: `retroweb-builder/src/lib/ai/gemini.ts`

In `generateWithGemini`, build GIF context:
```typescript
// Get library GIFs for current theme
const themeGifs = getGifsByTheme(context.systemPrompt).slice(0, 20); // Top 20 for theme

// Get user's custom GIFs for this project
const userGifs = await fetchUserGifs(projectId);

const gifContext = `
AVAILABLE RETRO GIFS (use these URLs):
${themeGifs.map(g => `- ${g.name}: ${getGifUrl(g.path)} [${g.tags.join(', ')}]`).join('\n')}

USER'S CUSTOM GIFS:
${userGifs.map(g => `- ${g.name}: ${g.url} [Custom]`).join('\n')}
`;

// Add to system prompt or user message
```

### Task 5: Create GIF Gallery Modal

**File**: `retroweb-builder/src/components/builder/GifGalleryModal.tsx`

```typescript
export function GifGalleryModal({ isOpen, onClose, onSelect }) {
  // Features:
  // - Show all 92 library GIFs
  // - Show user's 5 custom GIFs with "Custom" badge
  // - Filter by category (animations, buttons, decorations)
  // - Filter by theme
  // - Search by name/tags
  // - Click GIF to select and close modal
  // - onSelect returns GIF URL
}
```

### Task 6: Add GIF Gallery Button to ChatPanel

**File**: `retroweb-builder/src/components/builder/ChatPanel.tsx`

Add button next to file upload:
```typescript
<button onClick={() => setShowGifGallery(true)}>
  🎨 GIFs
</button>

{showGifGallery && (
  <GifGalleryModal
    isOpen={showGifGallery}
    onClose={() => setShowGifGallery(false)}
    onSelect={(gifUrl) => {
      // Add to message: "Use this GIF: {gifUrl}"
      // Or insert into input
    }}
  />
)}
```

### Task 7: Create User GIF API Routes

**File**: `retroweb-builder/src/app/api/projects/[id]/gifs/route.ts`

```typescript
// GET - List user's GIFs for project
export async function GET(req, { params }) {
  const { id: projectId } = params;
  // Query user_gifs table
  // Return array of GIF metadata with CDN URLs
}

// POST - Upload new GIF
export async function POST(req, { params }) {
  const { id: projectId } = params;
  const formData = await req.formData();
  const file = formData.get('file');
  
  // Validate:
  // - File is GIF
  // - Size <= 1MB
  // - User has < 5 GIFs for this project
  
  // Upload to: user-gifs/{userId}/{projectId}/{filename}
  // Save to user_gifs table
  // Return GIF metadata with CDN URL
}

// DELETE - Remove GIF
export async function DELETE(req, { params }) {
  // Delete from storage and database
}
```

### Task 8: Create useUserGifs Hook

**File**: `retroweb-builder/src/hooks/useUserGifs.ts`

```typescript
export function useUserGifs(projectId: string) {
  const [userGifs, setUserGifs] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const fetchGifs = async () => {
    const res = await fetch(`/api/projects/${projectId}/gifs`);
    const data = await res.json();
    setUserGifs(data.gifs);
  };
  
  const uploadGif = async (file: File) => {
    // Upload with progress
    // Refresh list
  };
  
  const deleteGif = async (gifId: string) => {
    // Delete and refresh
  };
  
  return { userGifs, loading, uploadGif, deleteGif, refresh: fetchGifs };
}
```

## 🎨 User Experience Flow

### Scenario 1: AI Auto-Selects GIFs
1. User: "Create a homepage with under construction sign"
2. AI sees available GIFs in context
3. AI picks appropriate GIF and uses URL in generated code
4. Result: Page has under-construction.gif

### Scenario 2: User Uploads Custom GIF
1. User clicks file upload button
2. Selects their custom GIF (e.g., company logo.gif)
3. System uploads to user-gifs bucket
4. Shows in attachments with "GIF" badge
5. User: "Add this GIF to the header"
6. AI uses the uploaded GIF URL in code

### Scenario 3: User Browses Gallery
1. User clicks "🎨 GIFs" button
2. Gallery modal opens showing all GIFs
3. User filters by theme or searches
4. User clicks a GIF
5. GIF URL added to chat input or message
6. User: "Use this for the email button"
7. AI implements with selected GIF

## 📊 Implementation Status

**Phase 1 (Critical): ✅ COMPLETE**
1. ✅ Database & storage (DONE)
2. ✅ Update AI prompts with GIF guidelines (DONE)
3. ✅ Pass GIF library to AI context (DONE)

**Phase 2 (Important): ✅ COMPLETE**
4. ✅ Handle GIF uploads in existing file upload (DONE)
5. ✅ Create user GIF API routes (DONE)
6. ✅ Show user GIFs in AI context (DONE)

**Phase 3 (Enhancement): ✅ COMPLETE**
7. ✅ Create GIF gallery modal (DONE)
8. ✅ Add gallery button to ChatPanel (DONE)
9. ✅ Polish UX and styling (DONE)

## 🚀 Quick Start Commands

```bash
# Test GIF library
npx tsx -e "import { gifLibrary } from './src/lib/gifRegistry'; console.log('GIFs:', gifLibrary.length);"

# Generate test page
npx tsx scripts/generate-test-page.ts

# View test page
open http://localhost:3000/test-gifs.html
```

## 📝 Notes

- User GIFs stored separately from library GIFs
- 5 GIF limit enforced at database level
- 1MB size limit enforced at storage level
- All GIFs publicly accessible via CDN
- User GIFs tagged as "Custom" in gallery
- AI should use 2-5 GIFs per page by default
- **User requests override all limits** - if user wants 50 GIFs, AI adds 50 GIFs
- If user says "remove all GIFs", AI removes every single GIF from the page
- Match GIF style to theme (geocities = more, minimal = fewer) unless user specifies otherwise

## ✅ Testing Checklist

- [ ] AI can see and use library GIFs
- [ ] AI uses appropriate GIFs for theme
- [ ] AI doesn't overuse GIFs (2-5 per page)
- [ ] Users can upload GIFs via file button
- [ ] Upload enforces 5 GIF limit
- [ ] Upload enforces 1MB size limit
- [ ] User GIFs appear in gallery with "Custom" badge
- [ ] Gallery filters work (category, theme, search)
- [ ] Selecting GIF from gallery works
- [ ] AI can use user-uploaded GIFs
- [ ] User can tell AI what to do with selected GIF
- [ ] GIF URLs work in generated code
- [ ] GIFs display correctly in preview

---

**Status**: Database ready, implementation guide complete
**Next**: Execute tasks 2-8 to complete feature
