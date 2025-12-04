// Type definitions for RetroWeb extension

export interface ThemeConfig {
  name: string;
  gifs: string[];
  background: string;
  fonts: {
    heading: string;
    body: string;
  };
  cursor: string;
  colors: {
    neonBorder: string;
    textGlow: string;
  };
  vintage: {
    counter: boolean;
    stickers: string[];
    sounds: boolean;
  };
}

export interface AssetInfo {
  url?: string;  // For image-based assets
  css?: string;  // For CSS-generated backgrounds
  cssSize?: string;  // Optional size for CSS backgrounds
  cssPosition?: string;  // Optional position for CSS backgrounds
  width?: number;
  height?: number;
  tileSize?: number;
  hotspot?: [number, number];
}

export interface AssetRegistry {
  gifs: Record<string, AssetInfo>;
  backgrounds: Record<string, AssetInfo>;
  cursors: Record<string, AssetInfo>;
  stickers: Record<string, AssetInfo>;
}

export interface CustomSettings {
  background: {
    enabled: boolean;
    pattern: string;
  };
  fonts: {
    enabled: boolean;
    style: string;
  };
  cursor: {
    enabled: boolean;
    type: string;
    trail: boolean;
  };
  vintage: {
    counter: boolean;
    stickers: boolean;
    sounds: boolean;
  };
}

export interface PerDomainSettings {
  enabled: boolean;
  theme: string;
  customSettings: CustomSettings;
}

export interface TabSettings {
  enabled: boolean;
  currentTheme: string;
  customSettings: CustomSettings;
  url: string;
  timestamp: number;
}

export interface Settings {
  enabled: boolean;
  currentTheme: string;
  customSettings: CustomSettings;
  perDomainSettings: Record<string, PerDomainSettings>;
}

// Default settings factory function
export function createDefaultCustomSettings(): CustomSettings {
  return {
    background: {
      enabled: true,
      pattern: 'stars'
    },
    fonts: {
      enabled: true,
      style: 'comic-sans'
    },
    cursor: {
      enabled: true,
      type: 'sparkle',
      trail: true
    },
    vintage: {
      counter: true,
      stickers: true,
      sounds: false
    }
  };
}

export function createDefaultSettings(): Settings {
  return {
    enabled: false,
    currentTheme: 'geocities-chaos',
    customSettings: createDefaultCustomSettings(),
    perDomainSettings: {}
  };
}
