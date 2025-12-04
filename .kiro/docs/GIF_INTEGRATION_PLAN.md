# GIF Integration Implementation Plan

## ✅ Completed

### Database & Storage
- ✅ Created `user_gifs` table with 5 GIF limit per project
- ✅ Created `user-gifs` storage bucket (1MB max per file)
- ✅ Set up RLS policies for security
- ✅ Added trigger to enforce 5 GIF limit

## 🚧 In Progress

### Phase 2: AI Integration
**Update AI prompts to:**
- Include available GIFs in context
- Use GIFs appropriately (2-5 per page max)
- Match GIFs to theme and content
- Provide GIF URLs in generated code

**Files to update:**
- `src/lib/ai/prompts.ts` - Add GIF usage guidelines
- `src/lib/ai/gemini.ts` - Pass GIF library in context
- `src/lib/ai/types.ts` - Add GIF context type

### Phase 3: GIF Gallery Modal
**Create UI component:**
- Browse all 92 library GIFs
- Filter by theme/category
- Search by tags
- Show user-uploaded GIFs with "Custom" badge
- Click to insert GIF URL into code
- Preview GIF on hover

**Files to create:**
- `src/components/builder/GifGalleryModal.tsx`
- `src/components/builder/GifCard.tsx`
- `src/hooks/useUserGifs.ts`

### Phase 4: GIF Upload Feature
**Allow users to upload custom GIFs:**
- Upload button in GIF gallery
- 5 GIF limit per project
- 1MB max file size
- Show upload progress
- Validate GIF format

**Files to create:**
- `src/components/builder/GifUploader.tsx`
- `src/app/api/projects/[id]/gifs/route.ts`

### Phase 5: Integration with ChatPanel
**Add GIF gallery button:**
- Button in chat input area
- Opens GIF gallery modal
- Insert selected GIF into message
- AI can see selected GIF in context

## Implementation Order

1. ✅ Database schema
2. Update AI prompts with GIF guidelines
3. Create GIF gallery modal UI
4. Add GIF upload functionality
5. Integrate with ChatPanel
6. Test end-to-end

## API Endpoints Needed

```
GET    /api/projects/[id]/gifs          - List user GIFs
POST   /api/projects/[id]/gifs          - Upload GIF
DELETE /api/projects/[id]/gifs/[gifId] - Delete GIF
```

## Key Features

### AI GIF Usage Rules
- Max 2-5 GIFs per page
- Match theme (geocities = more GIFs, minimalist = fewer)
- Use appropriate GIFs:
  - Construction signs for WIP sections
  - Email icons for contact
  - NEW badges for announcements
  - Arrows for navigation
  - Decorative elements sparingly

### User GIF Management
- 5 custom GIFs per project
- 1MB max per file
- Stored in `user-gifs/{userId}/{projectId}/{filename}`
- Tagged as "Custom" in gallery
- Can be deleted by user

### GIF Gallery Features
- Filter: All, Animations, Buttons, Decorations
- Theme filter: Geocities, Cyber, Vaporwave, etc.
- Search by name/tags
- Preview on hover
- Copy URL button
- Insert into code button

## Next Steps

Run this to continue implementation:
```bash
# This plan is ready - implementation continues in code
```
