// Theme types
export type ThemeName =
  | 'geocities-chaos'
  | 'neon-cyber-2001'
  | 'pixel-arcade'
  | 'vhs-glitch'
  | 'vaporwave'
  | 'windows-95';

// User types
export interface User {
  id: string;
  email: string;
  githubUsername?: string;
  hasGithubAuth: boolean;
}

// Project types
export interface Project {
  id: string;
  userId: string;
  name: string;
  theme: ThemeName;
  createdAt: Date;
  updatedAt: Date;
  pages?: Page[];
}

// Page types
export interface Page {
  id: string;
  projectId: string;
  name: string;
  slug: string;
  html: string;
  css: string;
  js: string;
  order: number;
}

// Chat types
export interface ChatMessage {
  id: string;
  projectId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

// Asset types
export type AssetType = 'gif' | 'image' | 'audio' | 'cursor';

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  category: string;
  url: string;
  tags: string[];
}

export interface UserAsset extends Asset {
  userId: string;
  projectId: string;
  storagePath: string;
  sizeBytes: number;
}

// Preview types
export interface PreviewLink {
  id: string;
  projectId: string;
  token: string;
  expiresAt: Date;
}

// AI types
export interface AIContext {
  systemPrompt: string;
  themeCSS: string;
  currentCode: {
    html: string;
    css: string;
    js: string;
  };
  recentMessages: ChatMessage[];
  assetLibrary: Asset[];
}

export interface AIResponse {
  message: string;
  code?: {
    html?: string;
    css?: string;
    js?: string;
  };
  suggestedAssets?: string[];
}

// Deployment types
export interface DeployRequest {
  projectId: string;
  repoName: string;
}

export interface DeployResponse {
  success: boolean;
  repoUrl: string;
  pagesUrl: string;
}

// Viewport types
export type ViewportSize = 'desktop' | 'tablet' | 'mobile';

export const VIEWPORT_DIMENSIONS: Record<ViewportSize, { width: number; height: number }> = {
  desktop: { width: 1200, height: 800 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 667 },
};
