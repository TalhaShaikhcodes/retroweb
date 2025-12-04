// AI Integration Types

export interface PageInfo {
  name: string;
  slug: string;
  isEmpty?: boolean;
}

export interface FileAttachment {
  type: 'image' | 'document';
  name: string;
  mimeType: string;
  data: string; // base64 encoded
  size: number;
}

export interface GifInfo {
  id: string;
  name: string;
  url: string;
  tags: string[];
  category: string;
  isCustom?: boolean;
}

export interface AIContext {
  systemPrompt: string;
  themeCSS: string;
  currentCode: {
    html: string;
    css: string;
    js: string;
  };
  recentMessages: AIMessage[];
  pageList: PageInfo[];
  currentPageName?: string;
  currentPageSlug?: string;
  attachments?: FileAttachment[];
  availableGifs?: {
    library: GifInfo[];
    userGifs: GifInfo[];
  };
}

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  attachments?: FileAttachment[];
}

export interface NewPageRequest {
  slug: string;
  name: string;
}

export interface AIResponse {
  message: string;
  code?: {
    html?: string;
    css?: string;
    js?: string;
  };
  newPages?: NewPageRequest[];
  error?: string;
}

export interface GenerateOptions {
  apiKey: string;
  userMessage: string;
  context: AIContext;
}
