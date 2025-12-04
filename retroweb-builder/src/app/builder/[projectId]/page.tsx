'use client';

import { useEffect, use, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useBuilderStore, ChatMessage } from '@/stores/builderStore';
import { ChatPanel } from '@/components/builder/ChatPanel';
import { PreviewPanel } from '@/components/builder/PreviewPanel';
import { CodePanel } from '@/components/builder/CodePanel';
import { BuilderHeader } from '@/components/builder/BuilderHeader';
import { ResizablePanels } from '@/components/builder/ResizablePanels';

interface BuilderPageProps {
  params: Promise<{ projectId: string }>;
}

export default function BuilderPage({ params }: BuilderPageProps) {
  const { projectId } = use(params);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const fetchedRef = useRef(false);
  const { 
    project, 
    loading, 
    error, 
    setProject, 
    setError, 
    setLoading, 
    setMessages,
    showCodePanel,
    isProjectLoaded,
    resetForProject,
  } = useBuilderStore();
  const rightPanelView = showCodePanel ? 'code' : 'preview';

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchProject = async () => {
      if (!user || !projectId) return;
      
      // Skip if already loaded this project
      if (isProjectLoaded(projectId)) {
        return;
      }
      
      // Prevent duplicate fetches
      if (fetchedRef.current) return;
      fetchedRef.current = true;

      // Reset state if switching projects
      resetForProject(projectId);
      setLoading(true);
      
      try {
        const res = await fetch(`/api/projects/${projectId}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'Failed to load project');
          return;
        }

        setProject({
          id: data.project.id,
          name: data.project.name,
          theme: data.project.theme,
          pages: data.project.pages || [],
        });

        // Load chat messages
        if (data.chatMessages && data.chatMessages.length > 0) {
          const messages: ChatMessage[] = data.chatMessages.map((msg: { id: string; role: 'user' | 'assistant'; content: string; created_at: string }) => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
            timestamp: new Date(msg.created_at),
          }));
          setMessages(messages);
        }
      } catch (err) {
        setError('Failed to load project');
      }
    };

    fetchProject();
    
    // Reset ref when projectId changes
    return () => {
      fetchedRef.current = false;
    };
  }, [user, projectId, setProject, setError, setLoading, setMessages, isProjectLoaded, resetForProject]);

  if (authLoading || loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading builder...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-purple-400 hover:text-purple-300"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-950 overflow-hidden">
      <BuilderHeader />

      <ResizablePanels
        leftPanel={<ChatPanel />}
        rightPanel={rightPanelView === 'preview' ? <PreviewPanel /> : <CodePanel />}
        defaultLeftWidth={420}
        minLeftWidth={320}
        maxLeftWidth={800}
      />
    </div>
  );
}
