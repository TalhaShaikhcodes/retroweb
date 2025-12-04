'use client';

import { useEffect, useRef, useState } from 'react';
import { useBuilderStore } from '@/stores/builderStore';
import Prism from 'prismjs';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';

const TABS = [
  { id: 'html' as const, label: 'HTML', lang: 'markup', icon: '📄' },
  { id: 'css' as const, label: 'CSS', lang: 'css', icon: '🎨' },
  { id: 'js' as const, label: 'JS', lang: 'javascript', icon: '⚡' },
];

const FILE_ICONS: Record<string, string> = {
  html: '📄',
  css: '🎨',
  js: '⚡',
  folder: '📁',
  folderOpen: '📂',
};

export function CodePanel() {
  const { 
    activeCodeTab, 
    setActiveCodeTab, 
    getCurrentPage,
    project,
    currentPageId,
    setCurrentPage,
    streamingCode,
    isStreamingCode,
  } = useBuilderStore();
  const currentPage = getCurrentPage();
  const codeRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['pages']));

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const getCode = () => {
    // Show streaming code if available
    if (isStreamingCode && streamingCode) {
      switch (activeCodeTab) {
        case 'html':
          return streamingCode.html || '';
        case 'css':
          return streamingCode.css || '';
        case 'js':
          return streamingCode.js || '';
        default:
          return '';
      }
    }
    
    // Otherwise show saved code
    if (!currentPage) return '';
    switch (activeCodeTab) {
      case 'html':
        return currentPage.html || '';
      case 'css':
        return currentPage.css || '';
      case 'js':
        return currentPage.js || '';
      default:
        return '';
    }
  };

  const code = getCode();
  const currentTab = TABS.find(t => t.id === activeCodeTab);

  // Highlight code when it changes
  useEffect(() => {
    if (codeRef.current && code) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code, activeCodeTab]);

  const handleCopy = async () => {
    if (code) {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="h-full flex bg-[#1e1e1e]">
      {/* File Explorer Sidebar */}
      <div className="w-56 border-r border-gray-800 bg-[#252526] flex flex-col">
        <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-800">
          Explorer
        </div>
        <div className="flex-1 overflow-y-auto py-1 custom-scrollbar">
          {/* Project Root */}
          <div className="px-2">
            <button
              onClick={() => toggleFolder('project')}
              className="w-full flex items-center gap-1 px-2 py-1 text-sm text-gray-300 hover:bg-[#2d2d2d] rounded"
            >
              <span className="text-xs">{expandedFolders.has('project') || expandedFolders.has('pages') ? FILE_ICONS.folderOpen : FILE_ICONS.folder}</span>
              <span className="font-medium">{project?.name || 'Project'}</span>
            </button>
            
            {/* All files flat - directly under project */}
            {(expandedFolders.has('project') || expandedFolders.has('pages')) && project?.pages && (
              <div className="ml-3 border-l border-gray-700 pl-2">
                {project.pages.flatMap((page) => 
                  TABS.map((tab) => (
                    <button
                      key={`${page.id}-${tab.id}`}
                      onClick={() => {
                        setCurrentPage(page.id);
                        setActiveCodeTab(tab.id);
                      }}
                      className={`w-full flex items-center gap-2 px-2 py-1 text-sm rounded ${
                        currentPageId === page.id && activeCodeTab === tab.id
                          ? 'text-white bg-[#094771]'
                          : 'text-gray-400 hover:bg-[#2d2d2d] hover:text-gray-300'
                      }`}
                    >
                      <span className="text-xs">{tab.icon}</span>
                      <span className="truncate">{page.slug}.{tab.id}</span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* File count footer */}
        <div className="px-3 py-2 text-xs text-gray-600 border-t border-gray-800">
          {project?.pages.length || 0} page{(project?.pages.length || 0) !== 1 ? 's' : ''} • {(project?.pages.length || 0) * 3} files
        </div>
      </div>

      {/* Main Code Area */}
      <div className="flex-1 flex flex-col">
        {/* Tabs */}
        <div className="flex border-b border-gray-800 bg-[#252526]">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCodeTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium transition-colors relative flex items-center gap-2 ${
                activeCodeTab === tab.id
                  ? 'text-white bg-[#1e1e1e]'
                  : 'text-gray-400 hover:text-white hover:bg-[#2d2d2d]'
              }`}
            >
              <span className="text-xs">{tab.icon}</span>
              {currentPage?.slug || 'index'}.{tab.id}
              {activeCodeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-purple-500" />
              )}
            </button>
          ))}
          
          {/* Streaming indicator */}
          {isStreamingCode && (
            <div className="flex items-center ml-auto mr-4 text-xs text-purple-400">
              <span className="inline-block w-2 h-2 mr-2 bg-purple-400 rounded-full animate-pulse" />
              Generating...
            </div>
          )}
        </div>

        {/* Code Display */}
        <div className="flex-1 overflow-auto code-editor custom-scrollbar">
        {code ? (
          <div className="relative inline-block min-w-full">
            {/* Line numbers */}
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-[#1e1e1e] border-r border-gray-800 select-none">
              <div className="p-4 text-right">
                {code.split('\n').map((_, i) => (
                  <div key={i} className="text-sm text-gray-600 leading-7 font-mono">
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Code content */}
            <pre className="p-4 pl-16 text-sm leading-7 font-mono inline-block min-w-full">
              <code 
                ref={codeRef}
                className={`language-${currentTab?.lang || 'markup'}`}
                style={{ whiteSpace: 'pre', display: 'block' }}
              >
                {code}
              </code>
              {isStreamingCode && (
                <span className="inline-block w-2 h-4 ml-1 bg-purple-400 animate-pulse" />
              )}
            </pre>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            <div className="text-center">
              <svg
                className="w-8 h-8 mx-auto mb-2 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
              <p>No {activeCodeTab.toUpperCase()} code yet</p>
              <p className="text-xs text-gray-600 mt-1">
                Use the chat to generate code
              </p>
            </div>
          </div>
        )}
      </div>

        {/* Footer */}
        <div className="h-8 border-t border-gray-800 bg-[#252526] flex items-center justify-between px-4 text-xs text-gray-500">
          <span>{currentPage?.slug || 'index'}.{activeCodeTab} • {code.split('\n').length} lines</span>
          <button
            onClick={handleCopy}
            disabled={!code}
            className="hover:text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            {copied ? (
              <>
                <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Prism.js theme styles */}
      <style jsx global>{`
        .code-editor {
          background: #1e1e1e;
        }
        
        .code-editor pre {
          background: transparent;
          margin: 0;
        }
        
        .code-editor code {
          font-family: 'Fira Code', 'Consolas', 'Monaco', 'Andale Mono', monospace;
          font-size: 14px;
          line-height: 1.7;
        }
        
        /* VS Code Dark+ inspired theme */
        .token.comment,
        .token.prolog,
        .token.doctype,
        .token.cdata {
          color: #6a9955;
        }
        
        .token.punctuation {
          color: #d4d4d4;
        }
        
        .token.property,
        .token.tag,
        .token.boolean,
        .token.number,
        .token.constant,
        .token.symbol,
        .token.deleted {
          color: #b5cea8;
        }
        
        .token.selector,
        .token.attr-name,
        .token.string,
        .token.char,
        .token.builtin,
        .token.inserted {
          color: #ce9178;
        }
        
        .token.operator,
        .token.entity,
        .token.url,
        .language-css .token.string,
        .style .token.string {
          color: #d4d4d4;
        }
        
        .token.atrule,
        .token.attr-value,
        .token.keyword {
          color: #569cd6;
        }
        
        .token.function,
        .token.class-name {
          color: #dcdcaa;
        }
        
        .token.regex,
        .token.important,
        .token.variable {
          color: #d16969;
        }
        
        .token.tag {
          color: #569cd6;
        }
        
        .token.attr-name {
          color: #9cdcfe;
        }
        
        .token.attr-value {
          color: #ce9178;
        }
      `}</style>
    </div>
  );
}
