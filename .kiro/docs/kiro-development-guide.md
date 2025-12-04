# RetroWeb Extension - Kiro Development Guide

## Overview

This document describes how Kiro IDE features were used to build and maintain the RetroWeb Chrome extension. Kiro's AI-assisted development capabilities significantly accelerated the development process.

## Kiro Features Used

### 1. Specs (Structured Feature Development)

Location: `.kiro/specs/retroweb-extension/`

The spec system was used to formally define and track the extension's development:

#### requirements.md
- Defined 12 user stories with detailed acceptance criteria
- Covered all major features: activation, GIFs, backgrounds, fonts, cursors, themes, etc.
- Each requirement has testable acceptance criteria

#### design.md
- Documented architecture (Manifest V3, content scripts, popup UI)
- Defined 47 correctness properties for property-based testing
- Specified component interfaces and data models
- Outlined error handling strategies

#### tasks.md
- Broke down implementation into 20 major tasks
- Tracked completion status with checkboxes
- Linked tasks to requirements for traceability

#### todo.md
- Feature roadmap with prioritization
- Organized by impact/effort categories
- Tracks completed vs planned features

### 2. Steering Rules

Location: `.kiro/steering/`

Steering files provide persistent context for all AI interactions:

#### product.md
- Product overview and core features
- Target experience description
- Helps AI understand the "why" behind decisions

#### structure.md
- Project directory organization
- Architecture patterns (background worker, content script, popup)
- Code conventions and message passing patterns

#### tech.md
- Technology stack (TypeScript, React, Vite, Vitest)
- Build system configuration
- Common commands for development

### 3. How Kiro Helped Build Features

#### Theme System Development
1. Read existing code structure via `readFile` and `grepSearch`
2. Modified `src/themes.ts` to add/remove themes
3. Updated `src/assetRegistry.ts` for theme assets
4. Enhanced `src/retro.css` with theme-specific styles
5. Updated `popup/App.tsx` for UI changes

#### Dynamic Content Handling
1. Analyzed `src/content.ts` MutationObserver implementation
2. Added periodic DOM scanner for missed elements
3. Improved modal/sidebar detection
4. Fixed nested element styling issues

#### Cursor Customization
1. Added theme-specific cursors to asset registry
2. Created cursor placeholder files
3. Updated theme configurations

## Development Workflow with Kiro

### Typical Feature Addition Flow

```
1. User describes feature requirement
2. Kiro reads relevant files (themes.ts, retro.css, etc.)
3. Kiro proposes and implements changes
4. Build verification: npm run build
5. Test verification: npm test
6. User tests in browser
7. Iterate based on feedback
```

### Code Modification Pattern

```
1. grepSearch - Find relevant code sections
2. readFile - Understand current implementation
3. strReplace - Make targeted changes
4. executePwsh - Build and test
5. getDiagnostics - Check for errors
```

## Best Practices Learned

### 1. Steering Rules Are Essential
- Keep product.md, structure.md, tech.md up to date
- They provide crucial context for every interaction
- Reduces need to re-explain project structure

### 2. Specs Enable Complex Features
- Break features into requirements → design → tasks
- Correctness properties guide testing
- Task tracking prevents scope creep

### 3. Incremental Development
- Make small, testable changes
- Build and test after each modification
- Fix issues before moving forward

### 4. File Organization Matters
- Clear separation: src/, popup/, assets/, test/
- Consistent naming conventions
- Centralized type definitions

## Commands Reference

```bash
npm install          # Install dependencies
npm run build        # Production build
npm run dev          # Development mode
npm test             # Run tests once
npm run test:watch   # Watch mode for tests
```

## Future Kiro Enhancements

### Potential Hooks
- Auto-run tests on file save
- Auto-build on TypeScript changes
- Lint checking on commit

### Additional Steering
- Testing conventions
- CSS naming patterns
- Performance guidelines
