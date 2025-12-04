# Requirements Document

## Introduction

RetroWeb Builder is an AI-powered website builder that generates authentic late 90s/early 2000s Geocities-style websites. Users provide their own Gemini API key and interact with an AI chat interface to create, customize, and deploy nostalgic retro websites. The platform supports user authentication, project management, and deployment to GitHub Pages.

## Glossary

- **Builder**: The RetroWeb Builder web application
- **User**: A person using the Builder to create retro websites
- **Project**: A saved website configuration including all pages, assets, and chat history
- **Generated Site**: The HTML/CSS/JS output created by the AI
- **Theme**: A predefined visual style (Geocities Chaos, Neon Cyber, etc.)
- **Asset**: GIFs, images, audio files, or cursors used in generated sites
- **BYOK**: Bring Your Own Key - users provide their own Gemini API key
- **Preview**: Live iframe rendering of the generated site
- **Deploy**: Publishing the generated site to GitHub Pages

## Requirements

### Requirement 1: User Authentication

**User Story:** As a visitor, I want to create an account and sign in, so that I can save my projects and access them later.

#### Acceptance Criteria

1. WHEN a visitor accesses the Builder THEN the Builder SHALL display options to sign in with GitHub or email/password
2. WHEN a user signs up with email THEN the Builder SHALL send a verification email and create the account upon verification
3. WHEN a user signs in with GitHub THEN the Builder SHALL authenticate via Supabase OAuth and create/link the account
4. WHEN a user is authenticated THEN the Builder SHALL display the user's dashboard with their projects
5. WHEN a user signs out THEN the Builder SHALL clear the session and redirect to the landing page

### Requirement 2: API Key Management

**User Story:** As a user, I want to securely store my Gemini API key, so that I can use the AI features without re-entering it each session.

#### Acceptance Criteria

1. WHEN a user accesses the builder for the first time THEN the Builder SHALL prompt for their Gemini API key
2. WHEN a user enters their API key THEN the Builder SHALL validate the key by making a test API call
3. WHEN the API key is valid THEN the Builder SHALL store it securely in the user's browser localStorage
4. WHEN the API key is invalid THEN the Builder SHALL display an error message and prompt for re-entry
5. WHEN a user wants to update their API key THEN the Builder SHALL provide a settings option to change it

### Requirement 3: Project Management

**User Story:** As a user, I want to create, save, and manage multiple website projects, so that I can work on different sites.

#### Acceptance Criteria

1. WHEN a user creates a new project THEN the Builder SHALL prompt for project name and theme selection
2. WHEN a user has fewer than 3 projects THEN the Builder SHALL allow creating a new project
3. WHEN a user has 3 projects THEN the Builder SHALL prevent creating new projects and display a limit message
4. WHEN a user selects a project THEN the Builder SHALL load the project's pages, assets, and chat history
5. WHEN a user deletes a project THEN the Builder SHALL remove all associated data after confirmation

### Requirement 4: AI Chat Interface

**User Story:** As a user, I want to describe my website in natural language, so that the AI can generate it for me.

#### Acceptance Criteria

1. WHEN a user sends a message THEN the Builder SHALL send the prompt to Gemini 2.5 Flash with appropriate context
2. WHEN the AI generates a response THEN the Builder SHALL display the response and update the preview
3. WHEN the user requests changes THEN the Builder SHALL maintain conversation context using sliding window approach
4. WHEN the AI generates code THEN the Builder SHALL extract and store HTML/CSS/JS separately
5. WHEN an API error occurs THEN the Builder SHALL display a user-friendly error message

### Requirement 5: Theme Selection

**User Story:** As a user, I want to choose from predefined retro themes, so that my site has a consistent nostalgic aesthetic.

#### Acceptance Criteria

1. WHEN a user creates a project THEN the Builder SHALL display 6 theme options with visual previews
2. WHEN a user selects a theme THEN the Builder SHALL apply the theme's base CSS to generated sites
3. WHEN the AI generates content THEN the Builder SHALL instruct it to use theme-appropriate styling
4. WHEN a user wants to change themes THEN the Builder SHALL allow theme switching with regeneration option

### Requirement 6: Live Preview

**User Story:** As a user, I want to see my website update in real-time, so that I can visualize changes immediately.

#### Acceptance Criteria

1. WHEN the AI generates or updates code THEN the Builder SHALL render it in an iframe preview
2. WHEN the preview loads THEN the Builder SHALL display the site at desktop viewport by default
3. WHEN a user toggles viewport THEN the Builder SHALL resize the preview to mobile or tablet dimensions
4. WHEN the preview contains errors THEN the Builder SHALL display them without crashing the preview

### Requirement 7: Code View

**User Story:** As a user, I want to view the generated code, so that I can understand and learn from it.

#### Acceptance Criteria

1. WHEN a user opens code view THEN the Builder SHALL display HTML, CSS, and JS in tabbed panels
2. WHEN code is displayed THEN the Builder SHALL apply syntax highlighting
3. WHEN a user copies code THEN the Builder SHALL copy to clipboard and show confirmation
4. WHEN the AI updates code THEN the Builder SHALL reflect changes in the code view

### Requirement 8: Multi-Page Support

**User Story:** As a user, I want to create multiple pages for my website, so that I can build a complete site with navigation.

#### Acceptance Criteria

1. WHEN a user requests a new page THEN the Builder SHALL create it and add to the page list
2. WHEN a user has multiple pages THEN the Builder SHALL display a page navigator/tabs
3. WHEN a user switches pages THEN the Builder SHALL update preview and code view for that page
4. WHEN the AI generates navigation THEN the Builder SHALL create working links between pages

### Requirement 9: Asset Library

**User Story:** As a user, I want to browse and use retro GIFs, cursors, and audio, so that I can enhance my site with nostalgic elements.

#### Acceptance Criteria

1. WHEN a user opens the asset library THEN the Builder SHALL display categorized GIFs, cursors, and audio
2. WHEN a user selects an asset THEN the Builder SHALL provide options to add it to the current page
3. WHEN the AI generates content THEN the Builder SHALL be able to reference and include library assets
4. WHEN a user uploads a custom asset THEN the Builder SHALL store it in their project's asset folder

### Requirement 10: Retro Elements

**User Story:** As a user, I want my generated site to include authentic retro elements, so that it feels like a real 90s website.

#### Acceptance Criteria

1. WHEN the AI generates layouts THEN the Builder SHALL instruct it to use table-based layouts
2. WHEN the AI generates text effects THEN the Builder SHALL include marquee, blink, and center tags
3. WHEN the AI generates widgets THEN the Builder SHALL include fake hit counters and guestbook visuals
4. WHEN the AI generates backgrounds THEN the Builder SHALL use tiled background images
5. WHEN the AI generates sites THEN the Builder SHALL make them mobile-responsive by default

### Requirement 11: Export to ZIP

**User Story:** As a user, I want to download my website as a ZIP file, so that I can host it anywhere.

#### Acceptance Criteria

1. WHEN a user clicks export THEN the Builder SHALL generate a ZIP containing all HTML, CSS, JS, and assets
2. WHEN the ZIP is generated THEN the Builder SHALL trigger a browser download
3. WHEN the site has multiple pages THEN the Builder SHALL include all pages in the ZIP
4. WHEN the site uses library assets THEN the Builder SHALL include copies in the ZIP

### Requirement 12: GitHub Pages Deployment

**User Story:** As a user, I want to deploy my site to GitHub Pages with one click, so that it's live on the internet.

#### Acceptance Criteria

1. WHEN a user clicks deploy THEN the Builder SHALL check for GitHub authentication
2. IF the user is not GitHub-authenticated THEN the Builder SHALL initiate GitHub OAuth flow
3. WHEN GitHub is authenticated THEN the Builder SHALL create a new repository with the site files
4. WHEN the repository is created THEN the Builder SHALL enable GitHub Pages automatically
5. WHEN deployment completes THEN the Builder SHALL display the live URL to the user

### Requirement 13: Share Preview

**User Story:** As a user, I want to share a preview link of my site, so that others can see it before I deploy.

#### Acceptance Criteria

1. WHEN a user clicks share THEN the Builder SHALL generate a unique preview URL
2. WHEN someone visits the preview URL THEN the Builder SHALL render the site in read-only mode
3. WHEN the preview is accessed THEN the Builder SHALL not require authentication
4. WHEN the user updates the site THEN the Builder SHALL update the preview automatically
