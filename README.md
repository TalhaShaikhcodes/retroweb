# 🌟 RetroWeb - Bringing the 90s Web Back to Life 🌟

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Kiroween 2025](https://img.shields.io/badge/Kiroween-2025-purple.svg)](https://kiroween.dev)

> **Kiroween 2025 Submission** - Category: "Resurrection: Bring your favorite dead technology back to life"

RetroWeb is a dual-project submission that resurrects the aesthetic and spirit of the late 90s/early 2000s internet. It consists of two interconnected products:

1. **RetroWeb Chrome Extension** - Transform any modern website into a nostalgic retro experience
2. **RetroWeb Builder** - An AI-powered website builder for creating authentic retro websites

## 🔗 Live Links

- **RetroWeb Builder**: [https://retroweb-builder.vercel.app/](https://retroweb-builder.vercel.app/)
- **Chrome Extension**: [Chrome Web Store Link](https://chromewebstore.google.com/detail/blcpkmpoajokmglipcngegcnfocklplp?utm_source=item-share-cb) *(placeholder)*
- **GitHub Repository**: [https://github.com/TalhaShaikhcodes/retroweb](https://github.com/TalhaShaikhcodes/retroweb)

## 📖 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Chrome Extension Setup](#chrome-extension-setup)
  - [Website Builder Setup](#website-builder-setup)
- [Development with Kiro](#development-with-kiro)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## 🎯 About the Project

### The Resurrection

Remember the wild, chaotic, and wonderfully creative web of the late 90s? Geocities homepages with tiled backgrounds, animated GIFs everywhere, Comic Sans text, and visitor counters? RetroWeb brings that era back to life with modern technology.

This project was built for **Kiroween 2025** in the "Resurrection" category, reimagining the obsolete aesthetic of early web design with today's innovations:

- Modern TypeScript and React
- AI-powered content generation (Google Gemini)
- Real-time collaboration features
- Cloud storage and authentication (Supabase)
- Chrome Extension Manifest V3

### Why This Matters

The early web was a place of unbridled creativity and personal expression. Every homepage was unique, chaotic, and full of personality. RetroWeb celebrates that spirit while making it accessible with modern tools and AI assistance.

## ✨ Features

### RetroWeb Chrome Extension

Transform any modern website into a retro experience with:

- **6 Authentic Themes**:
  - Geocities Chaos Mode - Maximum 90s homepage chaos
  - Neon Cyber 2001 - Matrix/hacker aesthetic with CRT scanlines
  - Pixel Arcade - 8-bit retro gaming vibes
  - VHS Analog Glitch - VHS tracking lines and chromatic aberration
  - Vaporwave A E S T H E T I C - 80s/90s dreamscape
  - Windows 95/98 - Classic gray panels with 3D beveled borders

- **Per-Tab Independence**: Each browser tab maintains its own theme and state
- **Customizable Elements**: Toggle backgrounds, fonts, cursors, and vintage elements
- **Theme-Specific Cursors**: Authentic retro cursor designs for each theme
- **Non-Destructive**: Overlay system that doesn't modify original page content
- **Smart Element Detection**: Automatically identifies and styles page regions

### RetroWeb Builder

Create authentic retro websites with AI assistance:

- **AI-Powered Generation**: Chat with Google Gemini to build your site
- **Authentic Retro Templates**: Pre-built templates for different retro styles
- **Visual GIF Gallery**: Browse and insert authentic 90s GIFs
- **Real-Time Preview**: See your changes instantly
- **Multi-Page Support**: Build complete websites with navigation
- **GitHub Integration**: OAuth authentication and one-click deployment to GitHub Pages
- **Export Options**: Download HTML or deploy directly to GitHub Pages
- **User Authentication**: Save and manage your projects with Supabase Auth
- **Retro GIF Library**: Curated collection of authentic 90s animated GIFs

## 🛠 Technology Stack

### Chrome Extension
- **TypeScript** - Type-safe development
- **React 18** - Popup UI
- **Vite** - Build tool and bundler
- **Vanilla CSS** - Authentic retro styling
- **Chrome Extension Manifest V3** - Latest extension API
- **Vitest** - Unit testing

### Website Builder
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Supabase** - Backend (PostgreSQL, Auth, Storage)
  - **User Authentication**: Secure session management with email/password and GitHub OAuth
  - **Project Storage**: Complete HTML/CSS code, project metadata, and settings
  - **AI Chat History**: Persistent conversation threads with context
  - **User-Uploaded GIFs**: Custom GIF storage with metadata and categorization
  - **GitHub Deployment Data**: Repository links, deployment status, and configuration
  - **Multi-Page Websites**: Page hierarchy, navigation structure, and routing data
  - **User Preferences**: Theme settings, API keys (encrypted), and UI preferences
- **Google Gemini 2.5 Flash** - AI model for intelligent code generation, natural language understanding, and contextual chat responses
- **GitHub OAuth** - Seamless authentication and repository access
- **GitHub Pages** - One-click deployment with automatic repository creation
- **Tailwind CSS** - Utility-first styling
- **Zustand** - State management
- **Vercel** - Deployment platform
- **GIF Assets** - Authentic 90s animated GIFs sourced from [gifcities.org](https://gifcities.org) by [Archive.org](https://archive.org)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Chrome browser (for extension development)
- Git

### Chrome Extension Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/TalhaShaikhcodes/retroweb.git
   cd retroweb
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the extension**
   ```bash
   npm run build
   ```

4. **Load in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `dist/` folder from the project

5. **Development mode** (with hot reload)
   ```bash
   npm run dev
   ```

6. **Run tests**
   ```bash
   npm test
   ```

### Website Builder Setup

1. **Navigate to the builder directory**
   ```bash
   cd retroweb-builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your credentials:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   
   # Google Gemini AI (optional - for AI features)
   GEMINI_API_KEY=your_gemini_api_key
   
   # GitHub (optional - for deployment features)
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   ```

4. **Set up Supabase database**
   
   Run the SQL migrations in your Supabase project:
   ```bash
   # The SQL files are in retroweb-builder/supabase/migrations/
   # Execute them in order in your Supabase SQL editor
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

6. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## 🤖 Development with Kiro

This entire project was built using **Kiro**, an AI-powered IDE that revolutionized my development workflow. Here's how Kiro helped me bring RetroWeb to life:

### Specs-Driven Development

I used Kiro's **Specs** feature to structure the entire project:

- **Requirements Documents**: Defined user stories and acceptance criteria in `.kiro/specs/*/requirements.md`
- **Design Documents**: Architected the system with component designs and data flows in `.kiro/specs/*/design.md`
- **Task Breakdown**: Broke down implementation into manageable tasks in `.kiro/specs/*/tasks.md`

This structured approach kept me focused and ensured nothing was missed. Kiro helped me iterate on requirements, refine designs, and track progress throughout development.

### Steering Documents

I created **Steering Docs** in `.kiro/steering/` to guide Kiro's assistance:

- `product.md` - Product vision and core features
- `structure.md` - Project architecture and file organization
- `tech.md` - Technology stack and common commands

These docs acted as persistent context, ensuring Kiro always understood the project's goals and conventions. Every time I asked for help, Kiro referenced these docs to provide consistent, contextual assistance.

### Supabase MCP Integration

One of the most powerful features was the **Supabase MCP (Model Context Protocol)** integration:

- **Direct Database Access**: Kiro could query my Supabase database, inspect tables, and suggest schema improvements
- **Migration Generation**: Generated SQL migrations for new features
- **Security Audits**: Ran security advisors to identify missing RLS policies and vulnerabilities
- **Real-Time Debugging**: Checked logs and helped troubleshoot production issues

#### Security & Protection

Kiro's Supabase MCP integration was crucial for maintaining security:

- **Identified Missing RLS Policies**: Kiro scanned my database and found tables without Row Level Security policies, preventing unauthorized data access
- **SQL Injection Prevention**: Helped implement parameterized queries and input validation across all API endpoints
- **Rate Limiting**: Suggested and implemented rate limiting to prevent abuse
- **Data Validation**: Added comprehensive input validation and sanitization
- **Authentication Checks**: Ensured all sensitive operations required proper authentication
- **Database Constraints**: Added foreign key constraints and check constraints to maintain data integrity

Example security audit workflow:
```
Me: "Check if my database is secure"

Kiro (via Supabase MCP):
1. Ran security advisors
2. Found 3 tables without RLS policies
3. Identified missing indexes on foreign keys
4. Suggested input validation improvements
5. Generated SQL to fix all issues
6. Verified fixes were applied correctly
```

Configuration in `.kiro/settings/mcp.json`:
```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-supabase"],
      "env": {
        "SUPABASE_URL": "your_url",
        "SUPABASE_SERVICE_ROLE_KEY": "your_key"
      }
    }
  }
}
```

### Vibe Coding

The development process was pure **vibe coding** - I described what I wanted in natural language, and Kiro:

1. **Understood Context**: Referenced specs and steering docs automatically
2. **Generated Code**: Wrote TypeScript, React components, SQL migrations
3. **Fixed Issues**: Debugged errors, optimized performance, improved UX
4. **Iterated Quickly**: Made changes based on my feedback in real-time

Example conversation flow:
```
Me: "Add a promotional button in the popup linking to the builder website"
Kiro: *Reads popup/App.tsx, understands structure, adds styled button with proper React patterns*

Me: "The site becomes uninteractive when extension is active"
Kiro: *Searches CSS for pointer-events issues, identifies problem, fixes with targeted CSS rules*

Me: "Make extension work per-tab instead of globally"
Kiro: *Refactors background.ts, updates types, implements tab lifecycle management*
```

### What I Learned

Working with Kiro taught me:

- **Specs are powerful**: Taking time to write requirements and design docs upfront saved hours of confusion later
- **Context is everything**: Steering docs made Kiro's assistance incredibly relevant and consistent
- **AI as a pair programmer**: Kiro wasn't just autocomplete - it was a thoughtful collaborator that understood architecture and best practices
- **Security by default**: Kiro's MCP integration caught security issues I would have missed, making the app production-ready
- **Rapid iteration**: I could try ideas, get feedback, and pivot quickly without losing momentum

## 📁 Project Structure

```
retroweb/
├── .kiro/                          # Kiro IDE configuration
│   ├── specs/                      # Specs for both projects
│   │   ├── retroweb-extension/     # Extension specs
│   │   └── retroweb-builder/       # Builder specs
│   ├── steering/                   # Steering documents
│   │   ├── product.md
│   │   ├── structure.md
│   │   └── tech.md
│   ├── settings/                   # IDE settings
│   │   └── mcp.json                # MCP server configuration
│   └── docs/                       # Project documentation
│
├── src/                            # Extension source code
│   ├── background.ts               # Service worker
│   ├── content.ts                  # Content script
│   ├── types.ts                    # TypeScript types
│   ├── themes.ts                   # Theme configurations
│   ├── assetRegistry.ts            # Asset metadata
│   └── retro.css                   # Retro styling
│
├── popup/                          # Extension popup UI
│   ├── App.tsx                     # React app
│   ├── main.tsx                    # Entry point
│   └── popup.css                   # Popup styles
│
├── assets/                         # Static assets (GIFs, images)
├── test/                           # Test files
├── dist/                           # Build output (gitignored)
│
└── retroweb-builder/               # Website builder application
    ├── src/
    │   ├── app/                    # Next.js app router
    │   ├── components/             # React components
    │   ├── lib/                    # Utilities and services
    │   ├── hooks/                  # Custom React hooks
    │   └── stores/                 # State management
    ├── public/                     # Static files
    └── supabase/                   # Database migrations
```

## 🚀 What's Next

RetroWeb is just getting started! Here are some exciting features and improvements planned for future releases:

### Chrome Extension Enhancements
- **Cross-Browser Support**: Firefox and Edge extension versions
- **Custom Theme Creator**: Build and save your own retro themes
- **Animation Controls**: Adjust speed and intensity of retro effects
- **Theme Marketplace**: Share and download community-created themes
- **Keyboard Shortcuts**: Quick theme switching and toggle controls
- **Advanced Customization**: Per-element styling controls and CSS overrides

### Website Builder Features
- **Template Marketplace**: Browse and use community-created retro templates
- **Collaborative Editing**: Real-time multi-user editing with live cursors
- **Mobile Responsive Preview**: Test your retro sites on different screen sizes
- **SEO Optimization Tools**: Meta tags, sitemaps, and retro-friendly SEO
- **Custom Domain Support**: Connect your own domain to deployed sites
- **Version History**: Time-travel through your project's edit history
- **Component Library**: Reusable retro UI components (guestbooks, hit counters, marquees)
- **Advanced AI Features**: 
  - Multi-page site generation from a single prompt
  - Style transfer from uploaded images
  - Automatic retro color palette generation
- **More Retro Themes**: 
  - MySpace 2005
  - Netscape Navigator
  - AOL Instant Messenger
  - Windows XP Luna
  - Mac OS 9

### Community Features
- **User-Submitted Content**: Upload and share your own retro GIFs and assets
- **Project Gallery**: Showcase your retro websites to the community
- **Remix Culture**: Fork and remix other users' projects
- **Retro Web Awards**: Monthly contests for best retro designs
- **Tutorial System**: Interactive guides for creating specific retro effects

### Technical Improvements
- **Performance Optimization**: Faster rendering and reduced memory usage
- **Offline Mode**: Work on projects without internet connection
- **Export Formats**: PDF, PNG screenshots, and video recordings of your sites
- **API Access**: Programmatic access to builder features
- **Webhook Integration**: Connect to external services and automation tools

Want to help build these features? Check out our [Contributing Guide](CONTRIBUTING.md)!

## 🤝 Contributing

Contributions are welcome! This project is open source and built for the community.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure:
- Code follows existing patterns and conventions
- Tests pass (`npm test`)
- TypeScript compiles without errors (`npm run build`)
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Kiroween 2025** - For the amazing hackathon and theme
- **Kiro IDE** - For revolutionizing how I build software
- **The 90s Web** - For the inspiration and nostalgia
- **Geocities, Angelfire, and all the early web pioneers** - For showing us that the web could be fun, creative, and personal

## 📧 Contact

Built with ❤️ and nostalgia by Talha Shaikh

- GitHub: [@TalhaShaikhcodes](https://github.com/TalhaShaikhcodes)
- Project Link: [https://github.com/TalhaShaikhcodes/retroweb](https://github.com/TalhaShaikhcodes/retroweb)

---

**Remember**: The web was better when it was weird. Let's bring that back. 🌈✨🎉
