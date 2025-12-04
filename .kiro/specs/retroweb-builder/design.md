# Design Document

## Overview

RetroWeb Builder is a Next.js 14 web application that enables users to create authentic 90s-style websites through AI-powered chat. The system uses Supabase for authentication and data persistence, Gemini 2.5 Flash for AI generation (user-provided API key), and GitHub API for deployment.

The application follows a client-heavy architecture where AI calls are made directly from the browser using the user's API key, minimizing backend costs while maintaining security for authentication and deployment flows.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client (Browser)                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │
│  │  Chat    │  │  Preview │  │  Code    │  │  Asset Manager   │ │
│  │  Panel   │  │  Iframe  │  │  View    │  │                  │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────────┬─────────┘ │
│       │             │             │                  │           │
│  ┌────┴─────────────┴─────────────┴──────────────────┴─────────┐ │
│  │                    State Management (Zustand)                │ │
│  └──────────────────────────────┬───────────────────────────────┘ │
│                                 │                                 │
│  ┌──────────────────────────────┴───────────────────────────────┐ │
│  │              Gemini API (Direct from browser)                 │ │
│  │              (User's API key in localStorage)                 │ │
│  └───────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Next.js API Routes                           │
├─────────────────────────────────────────────────────────────────┤
│  /api/auth/*     - Supabase auth callbacks                       │
│  /api/projects/* - CRUD operations for projects                  │
│  /api/deploy/*   - GitHub Pages deployment                       │
│  /api/preview/*  - Generate shareable preview links              │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Supabase                                 │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │     Auth     │  │   Database   │  │      Storage         │   │
│  │  (GitHub +   │  │  (Projects,  │  │  (Asset library,     │   │
│  │   Email)     │  │   Pages,     │  │   User uploads)      │   │
│  │              │  │   Assets)    │  │                      │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### Frontend Components

#### 1. AuthProvider
- Wraps application with Supabase auth context
- Handles session management and refresh
- Provides user state to all components

#### 2. ChatPanel
- Text input for user prompts
- Message history display
- Loading states during AI generation
- Error handling and retry options

#### 3. PreviewFrame
- Sandboxed iframe for rendering generated sites
- Viewport toggle (desktop/tablet/mobile)
- Refresh and fullscreen controls

#### 4. CodeEditor
- Tabbed view for HTML/CSS/JS
- Syntax highlighting (Prism.js or Shiki)
- Copy to clipboard functionality
- Read-only by default

#### 5. PageNavigator
- List of pages in current project
- Add/rename/delete page controls
- Active page indicator

#### 6. AssetLibrary
- Categorized grid of GIFs, cursors, audio
- Search and filter functionality
- Upload interface for custom assets
- Drag-and-drop to chat

#### 7. ThemeSelector
- Visual theme cards with previews
- Theme description and features
- Selection state management

#### 8. ProjectDashboard
- Grid of user's projects (max 3)
- Create new project button
- Project cards with preview thumbnails
- Delete project option

#### 9. SettingsPanel
- API key management
- Account settings
- Theme preferences

### API Interfaces

#### Projects API
```typescript
interface Project {
  id: string;
  user_id: string;
  name: string;
  theme: ThemeName;
  created_at: string;
  updated_at: string;
}

interface Page {
  id: string;
  project_id: string;
  name: string;
  slug: string;
  html: string;
  css: string;
  js: string;
  order: number;
}

interface ChatMessage {
  id: string;
  project_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

// API Routes
POST   /api/projects          - Create project
GET    /api/projects          - List user's projects
GET    /api/projects/:id      - Get project with pages
PUT    /api/projects/:id      - Update project
DELETE /api/projects/:id      - Delete project

POST   /api/projects/:id/pages     - Create page
PUT    /api/projects/:id/pages/:pageId - Update page
DELETE /api/projects/:id/pages/:pageId - Delete page
```

#### Deployment API
```typescript
interface DeployRequest {
  project_id: string;
  repo_name: string;
}

interface DeployResponse {
  success: boolean;
  repo_url: string;
  pages_url: string;
}

// API Routes
POST /api/deploy/github - Deploy to GitHub Pages
GET  /api/deploy/status/:id - Check deployment status
```

#### Preview API
```typescript
interface PreviewLink {
  id: string;
  project_id: string;
  token: string;
  expires_at: string;
}

// API Routes
POST /api/preview/create - Generate preview link
GET  /api/preview/:token - Render preview (public)
```

### AI Integration Interface

```typescript
interface AIContext {
  systemPrompt: string;
  themeCSS: string;
  currentCode: {
    html: string;
    css: string;
    js: string;
  };
  recentMessages: ChatMessage[]; // Last 10-15
  assetLibrary: AssetReference[];
}

interface AIResponse {
  message: string;
  code?: {
    html?: string;
    css?: string;
    js?: string;
  };
  suggestedAssets?: string[];
}

// Client-side function
async function generateWithAI(
  apiKey: string,
  userMessage: string,
  context: AIContext
): Promise<AIResponse>
```

## Data Models

### Database Schema (Supabase PostgreSQL)

```sql
-- Users (managed by Supabase Auth)
-- Extends auth.users with profile data

CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT,
  github_username TEXT,
  github_access_token TEXT, -- Encrypted, for deployment
  gemini_api_key_hash TEXT, -- Hash to verify, actual key in localStorage
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  theme TEXT NOT NULL DEFAULT 'geocities-chaos',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT max_projects CHECK (
    (SELECT COUNT(*) FROM projects WHERE user_id = projects.user_id) <= 3
  )
);

-- Pages
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'index',
  slug TEXT NOT NULL DEFAULT 'index',
  html TEXT DEFAULT '',
  css TEXT DEFAULT '',
  js TEXT DEFAULT '',
  page_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, slug)
);

-- Chat History
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Assets (uploads)
CREATE TABLE user_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('gif', 'image', 'audio', 'cursor')),
  storage_path TEXT NOT NULL,
  size_bytes INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Preview Links
CREATE TABLE preview_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Asset Library (curated, read-only for users)
CREATE TABLE asset_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('gif', 'audio', 'cursor')),
  category TEXT NOT NULL,
  tags TEXT[],
  storage_path TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE preview_links ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can CRUD own projects" ON projects
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can CRUD pages in own projects" ON pages
  FOR ALL USING (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can CRUD chat in own projects" ON chat_messages
  FOR ALL USING (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can CRUD own assets" ON user_assets
  FOR ALL USING (auth.uid() = user_id);

-- Asset library is readable by all authenticated users
CREATE POLICY "Asset library is public" ON asset_library
  FOR SELECT USING (true);
```

### TypeScript Types

```typescript
type ThemeName = 
  | 'geocities-chaos'
  | 'neon-cyber-2001'
  | 'pixel-arcade'
  | 'vhs-glitch'
  | 'vaporwave'
  | 'windows-95';

interface User {
  id: string;
  email: string;
  githubUsername?: string;
  hasGithubAuth: boolean;
}

interface Project {
  id: string;
  userId: string;
  name: string;
  theme: ThemeName;
  createdAt: Date;
  updatedAt: Date;
  pages: Page[];
}

interface Page {
  id: string;
  projectId: string;
  name: string;
  slug: string;
  html: string;
  css: string;
  js: string;
  order: number;
}

interface Asset {
  id: string;
  name: string;
  type: 'gif' | 'image' | 'audio' | 'cursor';
  category: string;
  url: string;
  tags: string[];
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}
```



## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Based on the prework analysis, the following properties have been identified for property-based testing:

### Property 1: Authenticated users see their projects
*For any* authenticated user, when they access the dashboard, the Builder should display exactly the projects belonging to that user and no projects from other users.
**Validates: Requirements 1.4**

### Property 2: Project limit enforcement
*For any* user with fewer than 3 projects, creating a new project should succeed and increment their project count by 1.
**Validates: Requirements 3.2**

### Property 3: Project loading completeness
*For any* project selection, the Builder should load all pages, all chat messages, and all assets associated with that project.
**Validates: Requirements 3.4**

### Property 4: Project deletion cascade
*For any* project deletion, all associated pages, chat messages, user assets, and preview links should also be deleted.
**Validates: Requirements 3.5**

### Property 5: AI context includes current code
*For any* message sent to the AI, the request payload should include the current HTML, CSS, and JS of the active page.
**Validates: Requirements 4.1**

### Property 6: AI response updates state
*For any* valid AI response containing code, the chat history should be updated and the preview should reflect the new code.
**Validates: Requirements 4.2**

### Property 7: Sliding window context limit
*For any* conversation with more than 15 messages, the AI context should include only the most recent 15 messages plus the current code state.
**Validates: Requirements 4.3**

### Property 8: Code extraction correctness
*For any* AI response containing code blocks, the Builder should correctly extract and separate HTML, CSS, and JS into their respective fields.
**Validates: Requirements 4.4**

### Property 9: Theme CSS inclusion
*For any* selected theme, the generated site should include the theme's base CSS in the output.
**Validates: Requirements 5.2**

### Property 10: Theme instructions in prompt
*For any* AI request, the system prompt should include instructions specific to the currently selected theme.
**Validates: Requirements 5.3**

### Property 11: Preview updates on code change
*For any* code modification (from AI or direct update), the preview iframe should re-render with the new code.
**Validates: Requirements 6.1**

### Property 12: Viewport toggle dimensions
*For any* viewport toggle action, the preview iframe dimensions should match the expected size for that viewport (desktop: 1200px, tablet: 768px, mobile: 375px).
**Validates: Requirements 6.3**

### Property 13: Preview error resilience
*For any* malformed HTML/CSS/JS, the preview should render what it can without crashing the application.
**Validates: Requirements 6.4**

### Property 14: Code view synchronization
*For any* code update, the code view should display the exact same content as stored in the page state.
**Validates: Requirements 7.4**

### Property 15: Page creation adds to project
*For any* new page creation, the project's page list should increase by 1 and contain the new page.
**Validates: Requirements 8.1**

### Property 16: Page switching updates view
*For any* page switch action, both the preview and code view should display content from the newly selected page.
**Validates: Requirements 8.3**

### Property 17: Navigation links validity
*For any* generated navigation, all internal links should reference valid page slugs within the project.
**Validates: Requirements 8.4**

### Property 18: Asset context availability
*For any* AI request, the context should include references to available assets from the library.
**Validates: Requirements 9.3**

### Property 19: User upload storage
*For any* successful asset upload, a corresponding entry should exist in the user_assets table with correct metadata.
**Validates: Requirements 9.4**

### Property 20: Table layout instruction
*For any* AI request, the system prompt should include instructions to use table-based layouts.
**Validates: Requirements 10.1**

### Property 21: Retro tags in output
*For any* generated HTML with text effects, the output should contain at least one of: marquee, blink, or center tags.
**Validates: Requirements 10.2**

### Property 22: Tiled backgrounds
*For any* generated CSS with background images, the CSS should include background-repeat property.
**Validates: Requirements 10.4**

### Property 23: Responsive by default
*For any* generated CSS, it should include at least one @media query for mobile responsiveness unless explicitly disabled.
**Validates: Requirements 10.5**

### Property 24: ZIP completeness
*For any* export action, the generated ZIP should contain all HTML files, CSS files, JS files, and referenced assets from the project.
**Validates: Requirements 11.1**

### Property 25: Multi-page ZIP inclusion
*For any* project with multiple pages, the ZIP should contain one HTML file per page with correct filenames.
**Validates: Requirements 11.3**

### Property 26: Asset bundling in ZIP
*For any* project using library or uploaded assets, the ZIP should include copies of those assets in an assets folder.
**Validates: Requirements 11.4**

### Property 27: Preview token uniqueness
*For any* share action, the generated preview token should be unique across all preview links.
**Validates: Requirements 13.1**

### Property 28: Preview reflects current state
*For any* preview link access, the rendered content should match the current state of the project.
**Validates: Requirements 13.4**

## Error Handling

### Client-Side Errors

| Error Type | Handling Strategy |
|------------|-------------------|
| Invalid API Key | Display error toast, prompt for re-entry, clear stored key |
| API Rate Limit | Display warning, implement exponential backoff, show retry button |
| Network Failure | Show offline indicator, queue messages, retry on reconnect |
| Invalid AI Response | Log error, show generic message, allow retry |
| Storage Quota Exceeded | Warn user, suggest deleting old projects/assets |
| Clipboard API Failure | Fallback to select-all, show manual copy instructions |

### Server-Side Errors

| Error Type | Handling Strategy |
|------------|-------------------|
| Database Connection | Return 503, show maintenance message |
| Auth Failure | Clear session, redirect to login |
| GitHub API Error | Return specific error, show troubleshooting steps |
| Storage Upload Failure | Return error with details, allow retry |
| Rate Limiting | Return 429 with retry-after header |

### Validation Errors

| Validation | Error Response |
|------------|----------------|
| Project name empty | "Project name is required" |
| Project name too long | "Project name must be under 50 characters" |
| Invalid theme | "Please select a valid theme" |
| File too large | "File exceeds maximum size of 5MB" |
| Invalid file type | "Only GIF, PNG, JPG, MP3, WAV, and CUR files are allowed" |
| Project limit reached | "You've reached the maximum of 3 projects. Delete one to create a new project." |

## Testing Strategy

### Dual Testing Approach

The project uses both unit tests and property-based tests for comprehensive coverage:

- **Unit tests** verify specific examples, edge cases, and error conditions
- **Property tests** verify universal properties that should hold across all inputs
- Together they provide comprehensive coverage: unit tests catch concrete bugs, property tests verify general correctness

### Testing Framework

- **Vitest** - Unit testing framework
- **fast-check** - Property-based testing library
- **React Testing Library** - Component testing
- **MSW (Mock Service Worker)** - API mocking

### Property-Based Testing Requirements

- Each property-based test MUST run a minimum of 100 iterations
- Each property-based test MUST be tagged with a comment referencing the correctness property: `**Feature: retroweb-builder, Property {number}: {property_text}**`
- Each correctness property MUST be implemented by a SINGLE property-based test

### Test Categories

#### 1. State Management Tests
- Project CRUD operations
- Page management
- Chat history management
- Asset management

#### 2. AI Integration Tests
- Context construction
- Response parsing
- Code extraction
- Error handling

#### 3. Component Tests
- ChatPanel rendering and interaction
- PreviewFrame updates
- CodeEditor display
- AssetLibrary browsing

#### 4. API Route Tests
- Authentication flows
- Project endpoints
- Deployment endpoints
- Preview endpoints

#### 5. Integration Tests
- Full chat-to-preview flow
- Export ZIP generation
- GitHub deployment flow

### Test File Structure

```
retroweb-builder/
├── __tests__/
│   ├── unit/
│   │   ├── state/
│   │   │   ├── projects.test.ts
│   │   │   ├── pages.test.ts
│   │   │   └── chat.test.ts
│   │   ├── ai/
│   │   │   ├── context.test.ts
│   │   │   ├── parser.test.ts
│   │   │   └── extraction.test.ts
│   │   └── utils/
│   │       ├── zip.test.ts
│   │       └── validation.test.ts
│   ├── property/
│   │   ├── project-limits.property.test.ts
│   │   ├── context-window.property.test.ts
│   │   ├── code-extraction.property.test.ts
│   │   ├── zip-completeness.property.test.ts
│   │   └── preview-sync.property.test.ts
│   ├── components/
│   │   ├── ChatPanel.test.tsx
│   │   ├── PreviewFrame.test.tsx
│   │   ├── CodeEditor.test.tsx
│   │   └── AssetLibrary.test.tsx
│   └── api/
│       ├── projects.test.ts
│       ├── deploy.test.ts
│       └── preview.test.ts
```
