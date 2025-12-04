'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useBuilderStore } from '@/stores/builderStore';
import { useApiKey } from '@/hooks/useApiKey';
import { useUserGifs } from '@/hooks/useUserGifs';
import { generateWithGemini, AIContext } from '@/lib/ai';
import { ApiKeyModal } from './ApiKeyModal';
import { GifGalleryModal } from './GifGalleryModal';

const THEMES = [
  { 
    id: 'geocities-chaos', 
    name: 'Geocities Chaos', 
    emoji: '🌈',
    description: 'Maximum 90s homepage energy',
    colors: ['#FF00FF', '#00FF00', '#FFFF00']
  },
  { 
    id: 'neon-cyber-2001', 
    name: 'Neon Cyber', 
    emoji: '💻',
    description: 'Matrix hacker aesthetic',
    colors: ['#00FF00', '#003300', '#000000']
  },
  { 
    id: 'pixel-arcade', 
    name: 'Pixel Arcade', 
    emoji: '🎮',
    description: '8-bit retro gaming',
    colors: ['#FF0000', '#0000FF', '#FFFF00']
  },
  { 
    id: 'vhs-glitch', 
    name: 'VHS Glitch', 
    emoji: '📼',
    description: 'Analog distortion vibes',
    colors: ['#4a5568', '#2d3748', '#FF0000']
  },
  { 
    id: 'vaporwave', 
    name: 'Vaporwave', 
    emoji: '🌴',
    description: 'A E S T H E T I C dreamscape',
    colors: ['#FF71CE', '#01CDFE', '#B967FF']
  },
  { 
    id: 'windows-95', 
    name: 'Windows 95', 
    emoji: '🖥️',
    description: 'Classic desktop nostalgia',
    colors: ['#C0C0C0', '#000080', '#FFFFFF']
  },
];

interface FileAttachment {
  type: 'image' | 'document';
  name: string;
  mimeType: string;
  data: string;
  size: number;
  preview?: string;
}

/**
 * Detect if user is asking to work on a specific page
 */
function detectExistingPageRequest(
  userMessage: string, 
  pages: Array<{ name: string; slug: string; html: string }>
): { name: string; slug: string } | null {
  const lowerMessage = userMessage.toLowerCase();
  
  // Keywords that indicate page work (creation, editing, updating)
  const pageWorkKeywords = ['create', 'build', 'make', 'add', 'populate', 'fill', 'update', 'edit', 'change', 'modify'];
  const hasPageWorkIntent = pageWorkKeywords.some(keyword => lowerMessage.includes(keyword));
  
  if (!hasPageWorkIntent) return null;
  
  // Check if message mentions any existing page
  for (const page of pages) {
    const pageNameLower = page.name.toLowerCase();
    const pageSlugLower = page.slug.toLowerCase();
    
    // Check if page is mentioned
    const isPageMentioned = lowerMessage.includes(pageNameLower) || lowerMessage.includes(pageSlugLower);
    
    if (isPageMentioned) {
      return { name: page.name, slug: page.slug };
    }
  }
  
  return null;
}

export function ChatPanel() {
  const [input, setInput] = useState('');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showGifGallery, setShowGifGallery] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamingMessage, setStreamingMessage] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [selectedGif, setSelectedGif] = useState<{ url: string; name: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { 
    messages, 
    isGenerating, 
    project,
    addMessage, 
    setIsGenerating,
    getCurrentPage,
    updatePageCode,
    addPage,
    setShowCodePanel,
    setStreamingCode,
    setIsStreamingCode,
    setProject,
    setCurrentPage,
  } = useBuilderStore();
  
  const { apiKey, hasApiKey, isLoaded } = useApiKey();
  const { userGifs, uploadGif, deleteGif, loading: gifsLoading } = useUserGifs(project?.id);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  // Show API key modal if no key is set
  useEffect(() => {
    if (isLoaded && !hasApiKey) {
      setShowApiKeyModal(true);
    }
  }, [isLoaded, hasApiKey]);

  // Check for initial prompt from landing page
  useEffect(() => {
    const initialPrompt = sessionStorage.getItem('builderInitialPrompt');
    if (initialPrompt && messages.length === 0) {
      setInput(initialPrompt);
      sessionStorage.removeItem('builderInitialPrompt');
      // Focus the input so user can see it
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [messages.length]);

  // Save message to database
  const saveMessageToDb = async (role: 'user' | 'assistant', content: string) => {
    if (!project?.id) return;
    
    try {
      await fetch(`/api/projects/${project.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, content }),
      });
    } catch (err) {
      console.error('Failed to save message:', err);
    }
  };

  // Save page code to database
  const savePageCodeToDb = async (pageId: string, code: { html?: string; css?: string; js?: string }) => {
    if (!project?.id) return;
    
    try {
      await fetch(`/api/projects/${project.id}/pages/${pageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(code),
      });
    } catch (err) {
      console.error('Failed to save page code:', err);
    }
  };

  // Create a new page in the database
  const createNewPage = async (slug: string, name: string): Promise<{ id: string } | null> => {
    if (!project?.id) return null;
    
    // Check if page already exists
    const existingPage = project.pages.find(p => p.slug === slug);
    if (existingPage) return null;
    
    try {
      const response = await fetch(`/api/projects/${project.id}/pages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          slug,
          html: `<!-- ${name} page - coming soon! -->`,
          css: '',
          js: '',
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        // Add to local store
        addPage(data.page);
        return data.page;
      }
    } catch (err) {
      console.error('Failed to create page:', err);
    }
    return null;
  };

  // Update project theme in database
  const updateProjectTheme = async (theme: string) => {
    if (!project?.id) return;
    
    try {
      await fetch(`/api/projects/${project.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme }),
      });
      
      // Update local state
      setProject({ ...project, theme });
    } catch (err) {
      console.error('Failed to update theme:', err);
    }
  };

  // Handle theme selection
  const handleThemeSelect = (themeId: string) => {
    setSelectedTheme(themeId);
    updateProjectTheme(themeId);
  };

  // Typing effect for streaming message
  const typeMessage = useCallback((fullMessage: string, onComplete: () => void) => {
    let currentIndex = 0;
    const chunkSize = 2; // Characters per tick (slower)
    const interval = 25; // ms between chunks (slower)
    
    const typeNextChunk = () => {
      if (currentIndex < fullMessage.length) {
        currentIndex = Math.min(currentIndex + chunkSize, fullMessage.length);
        setStreamingMessage(fullMessage.slice(0, currentIndex));
        setTimeout(typeNextChunk, interval);
      } else {
        onComplete();
      }
    };
    
    typeNextChunk();
  }, []);

  // Typing effect for code
  const typeCode = useCallback((
    code: { html?: string; css?: string; js?: string },
    currentPage: { html: string; css: string; js: string },
    onComplete: () => void
  ) => {
    const targetCode = {
      html: code.html ?? currentPage.html,
      css: code.css ?? currentPage.css,
      js: code.js ?? currentPage.js,
    };
    
    const totalChars = targetCode.html.length + targetCode.css.length + targetCode.js.length;
    let currentChar = 0;
    const chunkSize = 15; // Characters per tick (fast)
    const interval = 5; // ms between chunks (fast)
    
    setIsStreamingCode(true);
    
    const typeNextChunk = () => {
      if (currentChar < totalChars) {
        currentChar = Math.min(currentChar + chunkSize, totalChars);
        
        let remaining = currentChar;
        const htmlLen = Math.min(remaining, targetCode.html.length);
        remaining -= htmlLen;
        const cssLen = Math.min(remaining, targetCode.css.length);
        remaining -= cssLen;
        const jsLen = Math.min(remaining, targetCode.js.length);
        
        setStreamingCode({
          html: targetCode.html.slice(0, htmlLen),
          css: targetCode.css.slice(0, cssLen),
          js: targetCode.js.slice(0, jsLen),
        });
        
        setTimeout(typeNextChunk, interval);
      } else {
        setIsStreamingCode(false);
        setStreamingCode(null);
        onComplete();
      }
    };
    
    typeNextChunk();
  }, [setStreamingCode, setIsStreamingCode]);

  // Handle file selection
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newAttachments: FileAttachment[] = [];
    
    for (const file of Array.from(files)) {
      // Special handling for GIF uploads
      if (file.type === 'image/gif') {
        // Check GIF size limit (1MB)
        if (file.size > 1024 * 1024) {
          setError(`GIF ${file.name} is too large. Max size is 1MB for GIFs.`);
          continue;
        }

        // Upload GIF to user's collection
        const uploadedGif = await uploadGif(file);
        if (uploadedGif) {
          // Add a message about the uploaded GIF
          const gifMessage = `I've uploaded your GIF "${uploadedGif.name}". You can now ask me to use it in your webpage!`;
          addMessage({ role: 'assistant', content: gifMessage });
          await saveMessageToDb('assistant', gifMessage);
        }
        continue; // Don't add to attachments, it's now in user's GIF library
      }

      // Check file size (max 4MB for images)
      if (file.size > 4 * 1024 * 1024) {
        setError(`File ${file.name} is too large. Max size is 4MB.`);
        continue;
      }

      const isImage = file.type.startsWith('image/');
      const isDocument = file.type === 'text/plain' || 
                         file.type === 'application/pdf' ||
                         file.type === 'text/markdown' ||
                         file.name.endsWith('.md') ||
                         file.name.endsWith('.txt');

      if (!isImage && !isDocument) {
        setError(`File ${file.name} is not supported. Use images or text files.`);
        continue;
      }

      // Read file as base64
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // Remove data URL prefix for API
          resolve(result.split(',')[1]);
        };
        reader.readAsDataURL(file);
      });

      const attachment: FileAttachment = {
        type: isImage ? 'image' : 'document',
        name: file.name,
        mimeType: file.type || 'application/octet-stream',
        data: base64,
        size: file.size,
      };

      // Create preview URL for images
      if (isImage) {
        attachment.preview = URL.createObjectURL(file);
      }

      newAttachments.push(attachment);
    }

    setAttachments(prev => [...prev, ...newAttachments]);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Remove attachment
  const removeAttachment = (index: number) => {
    setAttachments(prev => {
      const newAttachments = [...prev];
      // Revoke preview URL if exists
      if (newAttachments[index].preview) {
        URL.revokeObjectURL(newAttachments[index].preview!);
      }
      newAttachments.splice(index, 1);
      return newAttachments;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && attachments.length === 0 && !selectedGif) || isGenerating) return;

    if (!apiKey) {
      setShowApiKeyModal(true);
      return;
    }

    // Build user message with GIF instruction if selected
    let userMessage = input.trim() || (attachments.length > 0 ? `[Attached ${attachments.length} file(s)]` : '');
    if (selectedGif) {
      userMessage += `${userMessage ? '\n\n' : ''}Use this GIF: ${selectedGif.url} (${selectedGif.name})`;
    }
    
    const currentAttachments = [...attachments];
    const currentSelectedGif = selectedGif;
    setInput('');
    setAttachments([]);
    setSelectedGif(null);
    setError(null);
    
    // Build display message with attachment and GIF info
    let displayMessage = input.trim();
    if (attachments.length > 0) {
      displayMessage += `${displayMessage ? '\n' : ''}📎 ${attachments.map(a => a.name).join(', ')}`;
    }
    if (currentSelectedGif) {
      displayMessage += `${displayMessage ? '\n' : ''}🎨 ${currentSelectedGif.name}`;
    }
    if (!displayMessage) {
      displayMessage = '[Attached files]';
    }
    
    addMessage({ role: 'user', content: displayMessage });
    saveMessageToDb('user', displayMessage);
    
    setIsGenerating(true);
    setStreamingMessage('');

    try {
      const currentPage = getCurrentPage();
      const activeTheme = selectedTheme || project?.theme || 'geocities-chaos';
      
      // Detect if user is asking about a different page
      const targetPage = detectExistingPageRequest(userMessage, project?.pages || []);
      const pageToEdit = targetPage && targetPage.slug !== currentPage?.slug 
        ? project?.pages.find(p => p.slug === targetPage.slug)
        : currentPage;
      
      // Build GIF context
      const { gifLibrary, getGifsByTheme } = await import('@/lib/gifRegistry');
      const { getGifUrl } = await import('@/lib/gifCdn');
      
      const themeGifs = getGifsByTheme(activeTheme).slice(0, 20); // Top 20 for theme
      const availableGifs = {
        library: themeGifs.map(g => ({
          id: g.id,
          name: g.name,
          url: getGifUrl(g.path),
          tags: g.tags,
          category: g.category,
        })),
        userGifs: userGifs.map(g => ({
          id: g.id,
          name: g.name,
          url: g.url,
          tags: ['custom'],
          category: 'custom' as const,
          isCustom: true,
        })),
      };

      const context: AIContext = {
        systemPrompt: activeTheme,
        themeCSS: '',
        currentCode: {
          html: pageToEdit?.html || '',
          css: pageToEdit?.css || '',
          js: pageToEdit?.js || '',
        },
        recentMessages: messages.map(m => ({
          role: m.role,
          content: m.content,
        })),
        pageList: project?.pages.map(p => ({ 
          name: p.name, 
          slug: p.slug,
          isEmpty: !p.html || p.html.trim().length === 0
        })) || [],
        currentPageName: pageToEdit?.name,
        currentPageSlug: pageToEdit?.slug,
        attachments: currentAttachments,
        availableGifs,
      };

      const response = await generateWithGemini(apiKey, userMessage, context);

      if (response.error) {
        setError(response.error);
        const errorMessage = `Sorry, I encountered an error: ${response.error}`;
        setStreamingMessage(null);
        addMessage({ role: 'assistant', content: errorMessage });
        saveMessageToDb('assistant', errorMessage);
        setIsGenerating(false);
      } else {
        // Check if user is asking to create/populate a page that already exists
        const existingEmptyPage = detectExistingPageRequest(userMessage, project?.pages || []);
        
        // Check if AI generated code with NEW_PAGE marker for an existing page
        if (response.newPages && response.newPages.length > 0) {
          for (const newPage of response.newPages) {
            const existingPage = project?.pages.find(p => p.slug === newPage.slug);
            
            if (existingPage) {
              // Page already exists - guide user to switch to it
              const helpMessage = `The "${newPage.name}" page already exists in your project. Please switch to that page using the file explorer on the left, then ask me to populate it with content.`;
              setStreamingMessage(null);
              addMessage({ role: 'assistant', content: helpMessage });
              saveMessageToDb('assistant', helpMessage);
              setIsGenerating(false);
              return;
            } else {
              // Create the new page
              await createNewPage(newPage.slug, newPage.name);
            }
          }
        }
        
        // Determine which page to apply code to
        const finalTargetPage = pageToEdit || currentPage;
        
        // If we're applying code to a different page, switch to it FIRST
        if (finalTargetPage && currentPage && finalTargetPage.id !== currentPage.id) {
          console.log('[ChatPanel] Switching from', currentPage.name, 'to', finalTargetPage.name);
          setCurrentPage(finalTargetPage.id);
        }

        typeMessage(response.message, () => {
          setStreamingMessage(null);
          addMessage({ role: 'assistant', content: response.message });
          saveMessageToDb('assistant', response.message);
          
          if (response.code && finalTargetPage) {
            const newCode = {
              html: response.code.html ?? finalTargetPage.html,
              css: response.code.css ?? finalTargetPage.css,
              js: response.code.js ?? finalTargetPage.js,
            };
            
            // Apply code to the correct page (finalTargetPage, not currentPage)
            typeCode(response.code, finalTargetPage, () => {
              updatePageCode(finalTargetPage.id, newCode);
              savePageCodeToDb(finalTargetPage.id, newCode);
              setShowCodePanel(false);
              setIsGenerating(false);
              inputRef.current?.focus();
            });
          } else {
            setIsGenerating(false);
            inputRef.current?.focus();
          }
        });
      }
    } catch (err) {
      console.error('Chat error:', err);
      setError('An unexpected error occurred');
      const errorMessage = 'Sorry, something went wrong. Please try again.';
      setStreamingMessage(null);
      addMessage({ role: 'assistant', content: errorMessage });
      saveMessageToDb('assistant', errorMessage);
      setIsGenerating(false);
      inputRef.current?.focus();
    }
  };

  const isNewProject = messages.length === 0 && !streamingMessage;
  const currentTheme = selectedTheme || project?.theme;

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <div>
          <h2 className="text-white font-medium">AI Assistant</h2>
          <p className="text-gray-500 text-sm">Describe what you want to build</p>
        </div>
        <button
          onClick={() => setShowApiKeyModal(true)}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          title="API Settings"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      {/* API Key Status */}
      {isLoaded && !hasApiKey && (
        <div className="px-4 py-2 bg-yellow-500/10 border-b border-yellow-500/20">
          <p className="text-yellow-400 text-sm">
            ⚠️ No API key set.{' '}
            <button 
              onClick={() => setShowApiKeyModal(true)}
              className="underline hover:no-underline"
            >
              Add your Gemini API key
            </button>
          </p>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="px-4 py-2 bg-red-500/10 border-b border-red-500/20">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {isNewProject ? (
          <div className="space-y-6">
            {/* Welcome */}
            <div className="text-center py-4">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-purple-500/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-white font-medium mb-1">Welcome to RetroWeb Builder!</p>
              <p className="text-gray-500 text-sm">Choose a theme or just start chatting</p>
            </div>

            {/* Theme Selection */}
            <div className="space-y-3">
              <p className="text-gray-400 text-xs uppercase tracking-wide text-center">Select a Theme (Optional)</p>
              <div className="grid grid-cols-2 gap-2">
                {THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => handleThemeSelect(theme.id)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      currentTheme === theme.id
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{theme.emoji}</span>
                      <span className="text-white text-sm font-medium">{theme.name}</span>
                    </div>
                    <p className="text-gray-500 text-xs">{theme.description}</p>
                    <div className="flex gap-1 mt-2">
                      {theme.colors.map((color, i) => (
                        <div
                          key={i}
                          className="w-4 h-4 rounded-full border border-gray-600"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Suggestions */}
            <div className="pt-4 border-t border-gray-800">
              <p className="text-gray-500 text-xs mb-3 text-center">Try saying:</p>
              <div className="space-y-2">
                {[
                  "Create a 90s style homepage with a visitor counter",
                  "Build me a personal website about cats",
                  "Make a guestbook page with sparkles",
                ].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(suggestion)}
                    className="w-full p-2 text-left text-sm text-gray-400 bg-gray-800/50 rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
                  >
                    &quot;{suggestion}&quot;
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-200'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
          </>
        )}

        {/* Streaming message */}
        {streamingMessage !== null && (
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-lg px-4 py-2 bg-gray-800 text-gray-200">
              <p className="text-sm whitespace-pre-wrap">
                {streamingMessage}
                <span className="inline-block w-2 h-4 ml-1 bg-purple-400 animate-pulse" />
              </p>
            </div>
          </div>
        )}

        {/* Loading indicator */}
        {isGenerating && streamingMessage === '' && (
          <div className="flex justify-start">
            <div className="bg-gray-800 rounded-lg px-4 py-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-800">
        {currentTheme && isNewProject && (
          <div className="px-4 pt-3 pb-2 flex items-center gap-2 text-xs text-gray-500">
            <span>Theme:</span>
            <span className="text-purple-400">
              {THEMES.find(t => t.id === currentTheme)?.emoji} {THEMES.find(t => t.id === currentTheme)?.name}
            </span>
          </div>
        )}

        {/* Attachment & GIF Buttons (Sticky above input) */}
        <div className="px-4 py-2 flex items-center gap-2 border-b border-gray-800 bg-gray-900">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.txt,.md,.pdf"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          
          {/* Attachment button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isGenerating || !hasApiKey}
            className="flex-shrink-0 p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Attach image or document"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>

          {/* GIF Gallery button */}
          <button
            type="button"
            onClick={() => setShowGifGallery(true)}
            disabled={isGenerating || !hasApiKey}
            className="flex-shrink-0 p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg leading-none"
            title="Browse GIF gallery"
          >
            🎨
          </button>

          <span className="text-gray-600 text-xs">Attach files or select GIFs</span>
        </div>
        
        {/* Attachment Preview */}
        {attachments.length > 0 && (
          <div className="px-4 py-2 flex flex-wrap gap-2 bg-gray-900/50">
            {attachments.map((attachment, index) => (
              <div key={index} className="relative group">
                {attachment.type === 'image' && attachment.preview ? (
                  <img 
                    src={attachment.preview} 
                    alt={attachment.name}
                    className="w-16 h-16 object-cover rounded-lg border border-gray-700"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-800 rounded-lg border border-gray-700 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeAttachment(index)}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <p className="text-xs text-gray-500 truncate w-16 mt-1">{attachment.name}</p>
              </div>
            ))}
          </div>
        )}

        {/* Selected GIF Preview */}
        {selectedGif && (
          <div className="px-4 py-2 bg-gray-900/50 border-b border-gray-800">
            <div className="flex items-center gap-3 bg-gray-800 rounded-lg p-2">
              <img 
                src={selectedGif.url} 
                alt={selectedGif.name}
                className="w-12 h-12 object-contain rounded border border-gray-700"
              />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm truncate">{selectedGif.name}</p>
                <p className="text-gray-500 text-xs">Selected GIF</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedGif(null)}
                className="flex-shrink-0 p-1 text-gray-400 hover:text-red-400 transition-colors"
                title="Remove GIF"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
        
        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-4 flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder={hasApiKey ? "Describe your website... (Shift+Enter for new line)" : "Add API key to start..."}
            disabled={isGenerating || !hasApiKey}
            maxLength={2000}
            rows={1}
            className="flex-1 min-w-0 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 resize-none overflow-hidden"
            style={{
              minHeight: '40px',
              maxHeight: '200px',
              height: 'auto',
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = Math.min(target.scrollHeight, 200) + 'px';
            }}
          />
          <button
            type="submit"
            disabled={(!input.trim() && attachments.length === 0 && !selectedGif) || isGenerating || !hasApiKey}
            className="flex-shrink-0 p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors self-end"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>

      {/* API Key Modal */}
      <ApiKeyModal 
        isOpen={showApiKeyModal} 
        onClose={() => setShowApiKeyModal(false)} 
      />

      {/* GIF Gallery Modal */}
      <GifGalleryModal
        isOpen={showGifGallery}
        onClose={() => setShowGifGallery(false)}
        onSelect={(gifUrl, gifName) => {
          // Set selected GIF (will be shown above input)
          setSelectedGif({ url: gifUrl, name: gifName });
          inputRef.current?.focus();
        }}
        projectId={project?.id}
        currentTheme={currentTheme || undefined}
      />
    </div>
  );
}
