# Per-Tab Settings Implementation

## Summary

The RetroWeb extension now uses per-tab settings instead of global settings. Each browser tab maintains its own independent state for the extension.

## Key Changes

### 1. Per-Tab Independence
- **Each tab has its own settings**: Activating the extension on one tab doesn't affect other tabs
- **Different themes per tab**: You can have different themes active on different tabs simultaneously
- **New tabs start inactive**: Opening a new tab always starts with the extension disabled by default

### 2. Architecture Changes

#### New Type: `TabSettings`
```typescript
interface TabSettings {
  enabled: boolean;
  currentTheme: string;
  customSettings: CustomSettings;
  url: string;
  timestamp: number;
}
```

#### In-Memory Storage
- Tab settings are stored in-memory using a `Map<number, TabSettings>`
- Settings are automatically cleaned up when tabs are closed
- No persistent storage between browser sessions (intentional - fresh start each time)

### 3. Behavior

#### Tab Lifecycle
1. **New Tab Created**: Extension is inactive by default
2. **User Activates**: Settings are stored for that specific tab
3. **Tab Navigation**: If URL changes, extension resets to inactive
4. **Tab Closed**: Settings are removed from memory

#### User Experience
- ✅ Activate extension on Tab A with "Geocities Chaos" theme
- ✅ Switch to Tab B - extension is inactive
- ✅ Activate extension on Tab B with "Neon Cyber" theme
- ✅ Both tabs maintain their own themes independently
- ✅ Open new Tab C - extension is inactive by default
- ✅ Close Tab A - its settings are cleaned up

### 4. Code Changes

#### `src/types.ts`
- Added `TabSettings` interface for per-tab state

#### `src/background.ts`
- Replaced global settings management with per-tab settings
- Added `tabSettings` Map for in-memory storage
- Updated message handlers to work with current tab only
- Added tab lifecycle listeners:
  - `onCreated`: Initialize new tabs as inactive
  - `onRemoved`: Clean up closed tabs
  - `onActivated`: Update badge for active tab
  - `onUpdated`: Handle navigation (reset to inactive)

#### `src/retro.css`
- Added explicit `pointer-events: auto !important` for interactive elements
- Ensures links, buttons, inputs remain clickable within styled containers

### 5. Message Flow

#### Getting Settings (Popup Opens)
1. Popup sends `GET_SETTINGS`
2. Background checks current tab's settings
3. If no settings exist, creates default (inactive)
4. Returns settings to popup

#### Updating Settings (User Changes Theme)
1. Popup sends `UPDATE_SETTINGS` with new settings
2. Background updates current tab's settings only
3. Sends `SETTINGS_UPDATED` to current tab only
4. Other tabs are unaffected

#### Toggling Extension
1. Popup sends `TOGGLE_EXTENSION`
2. Background toggles enabled state for current tab only
3. Sends `ACTIVATE` or `DEACTIVATE` to current tab
4. Updates badge for current tab

### 6. Badge Indicators

- **"ON" (green)**: Extension is active on current tab
- **Empty**: Extension is inactive on current tab
- Badge updates automatically when switching tabs

## Testing Checklist

- [x] Build completes successfully
- [ ] Open extension on Tab A, activate with theme 1
- [ ] Switch to Tab B, verify extension is inactive
- [ ] Activate extension on Tab B with theme 2
- [ ] Switch back to Tab A, verify theme 1 is still active
- [ ] Open new Tab C, verify extension is inactive
- [ ] Navigate Tab A to new URL, verify extension resets to inactive
- [ ] Close tabs, verify no memory leaks

## Benefits

1. **User Control**: Each tab is independent, no unexpected behavior
2. **Clean State**: New tabs always start fresh
3. **Memory Efficient**: Settings cleaned up when tabs close
4. **Intuitive**: Matches user expectations for tab-based browsing

## Migration Notes

- Existing users will see extension inactive on all tabs after update
- This is intentional - provides a clean slate
- Users can activate per-tab as needed

---

**Date**: December 3, 2025
**Status**: Complete
**Build**: Successful
