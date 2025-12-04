import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Page {
  id: string;
  name: string;
  slug: string;
  html: string;
  css: string;
  js: string;
  page_order: number;
}

export interface Project {
  id: string;
  name: string;
  theme: string;
  pages: Page[];
}

type ViewportSize = 'desktop' | 'tablet' | 'mobile';
type CodeTab = 'html' | 'css' | 'js';

interface StreamingCode {
  html: string;
  css: string;
  js: string;
}

interface BuilderState {
  // Project data
  project: Project | null;
  currentPageId: string | null;
  currentProjectId: string | null; // Track which project is loaded
  loading: boolean;
  error: string | null;

  // Chat state
  messages: ChatMessage[];
  isGenerating: boolean;

  // Streaming code state (for typing effect)
  streamingCode: StreamingCode | null;
  isStreamingCode: boolean;

  // UI state
  viewportSize: ViewportSize;
  activeCodeTab: CodeTab;
  showCodePanel: boolean;

  // Actions
  setProject: (project: Project) => void;
  setCurrentPage: (pageId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetForProject: (projectId: string) => void;

  // Code actions
  updatePageCode: (pageId: string, code: { html?: string; css?: string; js?: string }) => void;
  addPage: (page: Page) => void;
  setActiveCodeTab: (tab: CodeTab) => void;
  setShowCodePanel: (show: boolean) => void;

  // Streaming code actions
  setStreamingCode: (code: StreamingCode | null) => void;
  setIsStreamingCode: (streaming: boolean) => void;

  // Chat actions
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setMessages: (messages: ChatMessage[]) => void;
  setIsGenerating: (generating: boolean) => void;
  clearMessages: () => void;

  // Viewport actions
  setViewportSize: (size: ViewportSize) => void;

  // Helpers
  getCurrentPage: () => Page | null;
  isProjectLoaded: (projectId: string) => boolean;
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
  // Initial state
  project: null,
  currentPageId: null,
  currentProjectId: null,
  loading: true,
  error: null,
  messages: [],
  isGenerating: false,
  streamingCode: null,
  isStreamingCode: false,
  viewportSize: 'desktop',
  activeCodeTab: 'html',
  showCodePanel: false, // Default to preview panel

  // Project actions
  setProject: (project) => {
    set({ project, loading: false, currentProjectId: project.id });
    // Set first page as current if none selected
    if (project.pages.length > 0 && !get().currentPageId) {
      set({ currentPageId: project.pages[0].id });
    }
  },

  setCurrentPage: (pageId) => set({ currentPageId: pageId }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }),
  
  // Reset state when switching to a different project
  resetForProject: (projectId) => {
    const { currentProjectId } = get();
    if (currentProjectId !== projectId) {
      set({
        project: null,
        currentPageId: null,
        currentProjectId: null,
        messages: [],
        loading: true,
        error: null,
      });
    }
  },

  // Code actions
  updatePageCode: (pageId, code) => {
    const { project } = get();
    if (!project) return;

    const updatedPages = project.pages.map((page) =>
      page.id === pageId ? { ...page, ...code } : page
    );

    set({ project: { ...project, pages: updatedPages } });
  },

  addPage: (page) => {
    const { project } = get();
    if (!project) return;

    set({ 
      project: { 
        ...project, 
        pages: [...project.pages, page] 
      } 
    });
  },

  setActiveCodeTab: (tab) => set({ activeCodeTab: tab }),
  setShowCodePanel: (show) => set({ showCodePanel: show }),

  // Streaming code actions
  setStreamingCode: (code) => set({ streamingCode: code }),
  setIsStreamingCode: (streaming) => set({ isStreamingCode: streaming }),

  // Chat actions
  addMessage: (message) => {
    const newMessage: ChatMessage = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };
    set((state) => ({ messages: [...state.messages, newMessage] }));
  },

  setMessages: (messages) => set({ messages }),
  setIsGenerating: (generating) => set({ isGenerating: generating }),
  clearMessages: () => set({ messages: [] }),

  // Viewport actions
  setViewportSize: (size) => set({ viewportSize: size }),

  // Helpers
  getCurrentPage: () => {
    const { project, currentPageId } = get();
    if (!project || !currentPageId) return null;
    return project.pages.find((p) => p.id === currentPageId) || null;
  },
  
  isProjectLoaded: (projectId) => {
    const { currentProjectId, project } = get();
    return currentProjectId === projectId && project !== null;
  },
}));
