/**
 * Background Service Worker
 * Manages extension lifecycle, message passing, and per-tab settings coordination
 */

import { Settings, TabSettings, createDefaultSettings } from './types';

// Storage keys
const SETTINGS_KEY = 'settings';
const SETTINGS_VERSION_KEY = 'settingsVersion';
const CURRENT_VERSION = '1.0.0';

// Per-tab settings storage (in-memory)
const tabSettings = new Map<number, TabSettings>();

/**
 * Load global default settings from chrome.storage.sync
 */
async function loadSettings(): Promise<Settings> {
  return new Promise((resolve) => {
    chrome.storage.sync.get(SETTINGS_KEY, (data) => {
      resolve(data[SETTINGS_KEY] || createDefaultSettings());
    });
  });
}

/**
 * Save global default settings to chrome.storage.sync
 */
async function saveSettings(settings: Settings): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ [SETTINGS_KEY]: settings }, () => {
      resolve();
    });
  });
}

/**
 * Get settings for a specific tab
 */
function getTabSettings(tabId: number): TabSettings | null {
  return tabSettings.get(tabId) || null;
}

/**
 * Set settings for a specific tab
 */
function setTabSettings(tabId: number, settings: TabSettings): void {
  tabSettings.set(tabId, settings);
  updateBadge(tabId, settings.enabled);
}

/**
 * Remove settings for a specific tab
 */
function removeTabSettings(tabId: number): void {
  tabSettings.delete(tabId);
}

/**
 * Create default tab settings (inactive by default)
 */
async function createDefaultTabSettings(url: string): Promise<TabSettings> {
  const globalSettings = await loadSettings();
  return {
    enabled: false, // Always start inactive
    currentTheme: globalSettings.currentTheme,
    customSettings: globalSettings.customSettings,
    url,
    timestamp: Date.now()
  };
}

/**
 * Update extension icon badge based on active state
 */
async function updateBadge(tabId: number, enabled: boolean): Promise<void> {
  if (enabled) {
    await chrome.action.setBadgeText({ text: 'ON', tabId });
    await chrome.action.setBadgeBackgroundColor({ color: '#00ff00', tabId });
  } else {
    await chrome.action.setBadgeText({ text: '', tabId });
  }
}

// Initialize default settings on installation
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    const defaultSettings = createDefaultSettings();
    await saveSettings(defaultSettings);
    await chrome.storage.sync.set({ [SETTINGS_VERSION_KEY]: CURRENT_VERSION });
    console.log('RetroWeb: Default settings initialized');
  } else if (details.reason === 'update') {
    await migrateSettings(details.previousVersion || '1.0.0');
  }
});

// Store incompatibility notifications per tab
const tabIncompatibilities = new Map<number, any>();

// Message passing between popup and content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_SETTINGS') {
    // Get settings for current tab
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs[0]?.id) {
        let settings = getTabSettings(tabs[0].id);
        
        // If no tab settings exist, create default (inactive)
        if (!settings && tabs[0].url) {
          settings = await createDefaultTabSettings(tabs[0].url);
          setTabSettings(tabs[0].id, settings);
        }
        
        // Convert TabSettings to Settings format for popup
        const globalSettings = await loadSettings();
        const responseSettings: Settings = {
          enabled: settings?.enabled || false,
          currentTheme: settings?.currentTheme || globalSettings.currentTheme,
          customSettings: settings?.customSettings || globalSettings.customSettings,
          perDomainSettings: globalSettings.perDomainSettings
        };
        
        sendResponse({ settings: responseSettings });
      } else {
        const globalSettings = await loadSettings();
        sendResponse({ settings: globalSettings });
      }
    });
    return true;
  }

  if (message.type === 'UPDATE_SETTINGS') {
    const settings = message.settings as Settings;
    
    // Update settings for current tab only
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs[0]?.id && tabs[0].url) {
        const tabId = tabs[0].id;
        
        // Update tab-specific settings
        const tabSetting: TabSettings = {
          enabled: settings.enabled,
          currentTheme: settings.currentTheme,
          customSettings: settings.customSettings,
          url: tabs[0].url,
          timestamp: Date.now()
        };
        
        setTabSettings(tabId, tabSetting);
        
        // Send update to this tab only
        chrome.tabs.sendMessage(tabId, {
          type: 'SETTINGS_UPDATED',
          settings
        }).catch((error) => {
          console.debug('RetroWeb: Could not send message to tab', tabId, error.message);
        });
        
        sendResponse({ success: true });
      } else {
        sendResponse({ success: false });
      }
    });
    return true;
  }

  if (message.type === 'TOGGLE_EXTENSION') {
    // Toggle for current tab only
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs[0]?.id && tabs[0].url) {
        const tabId = tabs[0].id;
        let currentSettings = getTabSettings(tabId);
        
        // If no settings exist, create default
        if (!currentSettings) {
          currentSettings = await createDefaultTabSettings(tabs[0].url);
        }
        
        // Toggle enabled state
        currentSettings.enabled = !currentSettings.enabled;
        currentSettings.timestamp = Date.now();
        
        setTabSettings(tabId, currentSettings);
        
        // Send activation/deactivation message to tab
        chrome.tabs.sendMessage(tabId, {
          type: currentSettings.enabled ? 'ACTIVATE' : 'DEACTIVATE'
        }).catch((error) => {
          console.debug('RetroWeb: Could not send toggle message:', error.message);
        });
        
        sendResponse({ enabled: currentSettings.enabled });
      } else {
        sendResponse({ enabled: false });
      }
    });
    return true;
  }

  if (message.type === 'INCOMPATIBILITY_DETECTED') {
    // Store incompatibility information for the tab
    if (sender.tab?.id) {
      tabIncompatibilities.set(sender.tab.id, message.incompatibilities);
      console.log('RetroWeb: Incompatibility stored for tab', sender.tab.id, message.incompatibilities);
    }
    sendResponse({ success: true });
    return true;
  }

  if (message.type === 'GET_INCOMPATIBILITIES') {
    // Get incompatibilities for current tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        const incompatibilities = tabIncompatibilities.get(tabs[0].id) || null;
        sendResponse({ incompatibilities });
      } else {
        sendResponse({ incompatibilities: null });
      }
    });
    return true;
  }

  if (message.type === 'CLEAR_INCOMPATIBILITIES') {
    // Clear incompatibilities for current tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        tabIncompatibilities.delete(tabs[0].id);
      }
    });
    sendResponse({ success: true });
    return true;
  }
});

// Clean up data when tabs are closed
chrome.tabs.onRemoved.addListener((tabId) => {
  tabIncompatibilities.delete(tabId);
  removeTabSettings(tabId);
  console.log(`RetroWeb: Cleaned up tab ${tabId}`);
});

// Initialize new tabs with default (inactive) settings
chrome.tabs.onCreated.addListener(async (newTab) => {
  if (newTab.id && newTab.url && (newTab.url.startsWith('http://') || newTab.url.startsWith('https://'))) {
    const defaultSettings = await createDefaultTabSettings(newTab.url);
    setTabSettings(newTab.id, defaultSettings);
    console.log(`RetroWeb: Initialized new tab ${newTab.id} (inactive by default)`);
  }
});

// Update badge when tab is activated
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const settings = getTabSettings(activeInfo.tabId);
  if (settings) {
    await updateBadge(activeInfo.tabId, settings.enabled);
  } else {
    // No settings yet, show as inactive
    await updateBadge(activeInfo.tabId, false);
  }
});

// Handle tab URL changes (navigation)
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (changeInfo.url && (changeInfo.url.startsWith('http://') || changeInfo.url.startsWith('https://'))) {
    // URL changed - reset to inactive
    const defaultSettings = await createDefaultTabSettings(changeInfo.url);
    setTabSettings(tabId, defaultSettings);
    console.log(`RetroWeb: Tab ${tabId} navigated to new URL, reset to inactive`);
  }
  
  if (changeInfo.status === 'complete') {
    const settings = getTabSettings(tabId);
    if (settings) {
      await updateBadge(tabId, settings.enabled);
    }
  }
});

/**
 * Migrate settings from previous versions
 */
async function migrateSettings(previousVersion: string): Promise<void> {
  console.log(`RetroWeb: Migrating settings from version ${previousVersion} to ${CURRENT_VERSION}`);
  
  const settings = await loadSettings();
  
  // Ensure all required fields exist with defaults
  const defaultSettings = createDefaultSettings();
  
  // Merge with defaults to add any missing fields
  const migratedSettings: Settings = {
    enabled: settings.enabled ?? defaultSettings.enabled,
    currentTheme: settings.currentTheme || defaultSettings.currentTheme,
    customSettings: {
      background: {
        enabled: settings.customSettings?.background?.enabled ?? defaultSettings.customSettings.background.enabled,
        pattern: settings.customSettings?.background?.pattern || defaultSettings.customSettings.background.pattern
      },
      fonts: {
        enabled: settings.customSettings?.fonts?.enabled ?? defaultSettings.customSettings.fonts.enabled,
        style: settings.customSettings?.fonts?.style || defaultSettings.customSettings.fonts.style
      },
      cursor: {
        enabled: settings.customSettings?.cursor?.enabled ?? defaultSettings.customSettings.cursor.enabled,
        type: settings.customSettings?.cursor?.type || defaultSettings.customSettings.cursor.type,
        trail: settings.customSettings?.cursor?.trail ?? defaultSettings.customSettings.cursor.trail
      },
      vintage: {
        counter: settings.customSettings?.vintage?.counter ?? defaultSettings.customSettings.vintage.counter,
        stickers: settings.customSettings?.vintage?.stickers ?? defaultSettings.customSettings.vintage.stickers,
        sounds: settings.customSettings?.vintage?.sounds ?? defaultSettings.customSettings.vintage.sounds
      }
    },
    perDomainSettings: settings.perDomainSettings || {}
  };
  
  await saveSettings(migratedSettings);
  await chrome.storage.sync.set({ [SETTINGS_VERSION_KEY]: CURRENT_VERSION });
  
  console.log('RetroWeb: Settings migration complete');
}
