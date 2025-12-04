# Implementation Plan

## Phase 1: Project Setup and Core Infrastructure

- [x] 1. Initialize Next.js project with TypeScript



  - Create new Next.js 14 app with App Router in `retroweb-builder/` directory
  - Configure TypeScript strict mode
  - Set up ESLint and Prettier
  - Install core dependencies (zustand, @supabase/supabase-js, etc.)
  - _Requirements: N/A (infrastructure)_

- [x] 2. Set up Supabase integration



  - [x] 2.1 Create Supabase client configuration


    - Create lib/supabase/client.ts for browser client
    - Create lib/supabase/server.ts for server-side client
    - Set up environment variables
    - _Requirements: 1.1, 1.2, 1.3_
  - [x] 2.2 Create database schema


    - Create SQL migration for profiles, projects, pages, chat_messages tables
    - Create SQL migration for user_assets, preview_links, asset_library tables
    - Set up Row Level Security policies
    - _Requirements: 3.1, 3.2, 3.3_
  - [ ]* 2.3 Write property test for project limit enforcement
    - **Property 2: Project limit enforcement**
    - **Validates: Requirements 3.2**

- [x] 3. Implement authentication






  - [x] 3.1 Create auth provider and context




    - Create AuthProvider component wrapping Supabase auth
    - Create useAuth hook for accessing user state
    - _Requirements: 1.1, 1.4_

  - [x] 3.2 Create auth pages

    - Create /login page with GitHub and email options
    - Create /signup page with email registration
    - Create /auth/callback route for OAuth handling
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 3.3 Implement sign out functionality

    - Add sign out button to header
    - Clear session and redirect on sign out
    - _Requirements: 1.5_
  - [ ]* 3.4 Write unit tests for auth flows
    - Test login page renders both options
    - Test sign out clears session
    - _Requirements: 1.1, 1.5_

- [ ] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Phase 2: Project Management

- [x] 5. Create project dashboard


  - [x] 5.1 Create dashboard page layout


    - Create /dashboard page with project grid
    - Display user's projects as cards
    - Show create project button (disabled if 3 projects)
    - _Requirements: 1.4, 3.2, 3.3_

  - [x] 5.2 Implement project CRUD API routes
    - Create POST /api/projects for creating projects
    - Create GET /api/projects for listing projects
    - Create DELETE /api/projects/[id] for deletion
    - _Requirements: 3.1, 3.5_
  - [ ]* 5.3 Write property test for project loading
    - **Property 3: Project loading completeness**
    - **Validates: Requirements 3.4**
  - [ ]* 5.4 Write property test for project deletion
    - **Property 4: Project deletion cascade**
    - **Validates: Requirements 3.5**

- [x] 6. Create project creation flow
  - [x] 6.1 Create new project modal/page
    - Create project name input
    - Create theme selector with 6 theme cards
    - Validate project limit before creation
    - _Requirements: 3.1, 5.1_
  - [x] 6.2 Implement theme selection component
    - Display theme previews
    - Store selected theme in project
    - _Requirements: 5.1, 5.2_
  - [ ]* 6.3 Write unit tests for project creation
    - Test project creation with valid data
    - Test project limit enforcement
    - _Requirements: 3.1, 3.2, 3.3_

- [x] 7. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Phase 3: Builder Core UI

- [x] 8. Create builder page layout


  - [x] 8.1 Create main builder page structure


    - Create /builder/[projectId] page
    - Set up three-panel layout (chat, preview, code)
    - Add responsive layout handling
    - _Requirements: 4.1, 6.1, 7.1_

  - [x] 8.2 Create state management store


    - Create Zustand store for builder state
    - Include current page, chat history, code state
    - _Requirements: 4.1, 4.2, 4.3_

- [x] 9. Implement chat panel




  - [x] 9.1 Create ChatPanel component

    - Create message input with send button
    - Display message history with user/assistant styling
    - Show loading state during AI generation
    - _Requirements: 4.1, 4.2_

  - [x] 9.2 Implement message handling

    - Send messages to AI with context
    - Parse and display AI responses
    - Handle errors gracefully
    - _Requirements: 4.1, 4.2, 4.5_
  - [ ]* 9.3 Write property test for AI context
    - **Property 5: AI context includes current code**
    - **Validates: Requirements 4.1**

- [ ] 10. Implement preview panel
  - [ ] 10.1 Create PreviewFrame component
    - Create sandboxed iframe for rendering
    - Implement viewport toggle (desktop/tablet/mobile)
    - Add refresh and fullscreen controls
    - _Requirements: 6.1, 6.2, 6.3_
  - [ ] 10.2 Implement preview updates
    - Update iframe when code changes
    - Handle rendering errors gracefully
    - _Requirements: 6.1, 6.4_
  - [ ]* 10.3 Write property test for preview updates
    - **Property 11: Preview updates on code change**
    - **Validates: Requirements 6.1**
  - [ ]* 10.4 Write property test for viewport toggle
    - **Property 12: Viewport toggle dimensions**
    - **Validates: Requirements 6.3**

- [ ] 11. Implement code view panel
  - [ ] 11.1 Create CodeEditor component
    - Create tabbed view for HTML/CSS/JS
    - Add syntax highlighting with Prism.js
    - Implement copy to clipboard
    - _Requirements: 7.1, 7.2, 7.3_
  - [ ] 11.2 Implement code synchronization
    - Update code view when AI generates code
    - Keep tabs in sync with current page
    - _Requirements: 7.4_
  - [ ]* 11.3 Write property test for code sync
    - **Property 14: Code view synchronization**
    - **Validates: Requirements 7.4**

- [ ] 12. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Phase 4: AI Integration

- [ ] 13. Implement API key management
  - [ ] 13.1 Create API key input component
    - Create modal for API key entry
    - Validate key with test API call
    - Store valid key in localStorage
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  - [ ] 13.2 Create settings panel for key management
    - Add settings page/modal
    - Allow updating API key
    - _Requirements: 2.5_
  - [ ]* 13.3 Write unit tests for API key validation
    - Test valid key storage
    - Test invalid key error handling
    - _Requirements: 2.2, 2.3, 2.4_

- [ ] 14. Implement AI service
  - [ ] 14.1 Create Gemini API client
    - Create lib/ai/gemini.ts for API calls
    - Implement generateWithAI function
    - Handle API errors and rate limits
    - _Requirements: 4.1, 4.5_
  - [ ] 14.2 Create context builder
    - Build system prompt with theme instructions
    - Include current code in context
    - Implement sliding window for chat history
    - _Requirements: 4.1, 4.3, 5.3, 10.1_
  - [ ]* 14.3 Write property test for sliding window
    - **Property 7: Sliding window context limit**
    - **Validates: Requirements 4.3**
  - [ ]* 14.4 Write property test for theme instructions
    - **Property 10: Theme instructions in prompt**
    - **Validates: Requirements 5.3**

- [ ] 15. Implement code extraction
  - [ ] 15.1 Create response parser
    - Parse AI response for code blocks
    - Extract HTML, CSS, JS separately
    - Handle partial or malformed responses
    - _Requirements: 4.4_
  - [ ]* 15.2 Write property test for code extraction
    - **Property 8: Code extraction correctness**
    - **Validates: Requirements 4.4**

- [ ] 16. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Phase 5: Multi-Page Support

- [ ] 17. Implement page management
  - [ ] 17.1 Create PageNavigator component
    - Display list of pages in project
    - Add create/rename/delete page controls
    - Show active page indicator
    - _Requirements: 8.1, 8.2_
  - [ ] 17.2 Implement page CRUD operations
    - Create page API routes
    - Handle page switching in state
    - Update preview/code on page switch
    - _Requirements: 8.1, 8.3_
  - [ ]* 17.3 Write property test for page creation
    - **Property 15: Page creation adds to project**
    - **Validates: Requirements 8.1**
  - [ ]* 17.4 Write property test for page switching
    - **Property 16: Page switching updates view**
    - **Validates: Requirements 8.3**

- [ ] 18. Implement navigation generation
  - [ ] 18.1 Update AI prompts for navigation
    - Include page list in AI context
    - Instruct AI to generate valid navigation links
    - _Requirements: 8.4_
  - [ ]* 18.2 Write property test for navigation links
    - **Property 17: Navigation links validity**
    - **Validates: Requirements 8.4**

- [ ] 19. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Phase 6: Export and Deployment

- [ ] 20. Implement ZIP export
  - [ ] 20.1 Create ZIP generation utility
    - Use JSZip library to create ZIP
    - Include all HTML, CSS, JS files
    - Bundle referenced assets
    - _Requirements: 11.1, 11.3, 11.4_
  - [ ] 20.2 Implement download trigger
    - Create export button in UI
    - Trigger browser download on click
    - _Requirements: 11.2_
  - [ ]* 20.3 Write property test for ZIP completeness
    - **Property 24: ZIP completeness**
    - **Validates: Requirements 11.1**
  - [ ]* 20.4 Write property test for multi-page ZIP
    - **Property 25: Multi-page ZIP inclusion**
    - **Validates: Requirements 11.3**

- [ ] 21. Implement GitHub Pages deployment
  - [ ] 21.1 Create GitHub OAuth flow
    - Add GitHub OAuth to Supabase auth
    - Store GitHub access token securely
    - _Requirements: 12.1, 12.2_
  - [ ] 21.2 Create deployment API route
    - Create POST /api/deploy/github endpoint
    - Use GitHub API to create repository
    - Push site files to repository
    - Enable GitHub Pages
    - _Requirements: 12.3, 12.4_
  - [ ] 21.3 Create deployment UI
    - Add deploy button to builder
    - Show deployment progress
    - Display live URL on success
    - _Requirements: 12.1, 12.5_
  - [ ]* 21.4 Write unit tests for deployment flow
    - Test GitHub auth check
    - Test repo creation (mocked)
    - _Requirements: 12.1, 12.3_

- [ ] 22. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Phase 7: Asset Library and Sharing

- [ ] 23. Implement asset library
  - [ ] 23.1 Create AssetLibrary component
    - Display categorized assets (GIFs, cursors, audio)
    - Implement search and filter
    - Add asset selection UI
    - _Requirements: 9.1, 9.2_
  - [ ] 23.2 Seed asset library data
    - Upload curated GIFs to Supabase Storage
    - Upload curated cursors and audio
    - Create asset_library table entries
    - _Requirements: 9.1_
  - [ ] 23.3 Implement asset upload
    - Create upload UI for custom assets
    - Store uploads in Supabase Storage
    - Create user_assets entries
    - _Requirements: 9.4_
  - [ ]* 23.4 Write property test for asset upload
    - **Property 19: User upload storage**
    - **Validates: Requirements 9.4**

- [ ] 24. Implement share preview
  - [ ] 24.1 Create preview link generation
    - Create POST /api/preview/create endpoint
    - Generate unique token
    - Store preview link with expiration
    - _Requirements: 13.1_
  - [ ] 24.2 Create public preview route
    - Create /preview/[token] page
    - Render project in read-only mode
    - No authentication required
    - _Requirements: 13.2, 13.3_
  - [ ]* 24.3 Write property test for preview token
    - **Property 27: Preview token uniqueness**
    - **Validates: Requirements 13.1**
  - [ ]* 24.4 Write property test for preview sync
    - **Property 28: Preview reflects current state**
    - **Validates: Requirements 13.4**

- [ ] 25. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Phase 8: Retro Elements and Polish

- [ ] 26. Enhance AI prompts for retro output
  - [ ] 26.1 Create comprehensive system prompt
    - Include table layout instructions
    - Include retro tag instructions (marquee, blink, center)
    - Include responsive CSS instructions
    - _Requirements: 10.1, 10.2, 10.5_
  - [ ]* 26.2 Write property test for table layouts
    - **Property 20: Table layout instruction**
    - **Validates: Requirements 10.1**
  - [ ]* 26.3 Write property test for retro tags
    - **Property 21: Retro tags in output**
    - **Validates: Requirements 10.2**
  - [ ]* 26.4 Write property test for responsive CSS
    - **Property 23: Responsive by default**
    - **Validates: Requirements 10.5**

- [ ] 27. Implement retro widgets
  - [ ] 27.1 Create hit counter component
    - Generate fake hit counter HTML
    - Include in AI context as available widget
    - _Requirements: 10.3_
  - [ ] 27.2 Create guestbook visual
    - Generate fake guestbook HTML
    - Include in AI context as available widget
    - _Requirements: 10.3_

- [ ] 28. Final polish
  - [ ] 28.1 Add loading states and animations
    - Add skeleton loaders
    - Add transition animations
    - _Requirements: N/A (UX)_
  - [ ] 28.2 Implement error boundaries
    - Add React error boundaries
    - Create fallback UI for errors
    - _Requirements: 6.4_
  - [ ] 28.3 Add responsive design for builder
    - Make builder usable on tablet
    - Add mobile warning/redirect
    - _Requirements: N/A (UX)_

- [ ] 29. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
