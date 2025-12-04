'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBuilderStore } from '@/stores/builderStore';
import { Button } from '@/components/ui/Button';
import { exportProjectAsZip } from '@/lib/export';
import { GitHubDeployModal } from './GitHubDeployModal';

const MAX_PROJECT_NAME_LENGTH = 50;

export function BuilderHeader() {
  const router = useRouter();
  const [isExporting, setIsExporting] = useState(false);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [isRenamingProject, setIsRenamingProject] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { project, showCodePanel, setShowCodePanel, viewportSize, setViewportSize, setProject } =
    useBuilderStore();

  const handleExport = async () => {
    if (!project || isExporting) return;
    
    setIsExporting(true);
    try {
      await exportProjectAsZip(project);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const startEditingName = () => {
    if (!project) return;
    setEditedName(project.name);
    setIsEditingName(true);
  };

  const cancelEditingName = () => {
    setIsEditingName(false);
    setEditedName('');
  };

  const saveProjectName = async () => {
    if (!project || !editedName.trim() || editedName === project.name) {
      cancelEditingName();
      return;
    }

    const trimmedName = editedName.trim().slice(0, MAX_PROJECT_NAME_LENGTH);
    setIsRenamingProject(true);

    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmedName }),
      });

      if (res.ok) {
        const data = await res.json();
        // Update only the project name, keep existing pages
        setProject({ ...project, name: data.project.name });
        setIsEditingName(false);
      }
    } catch (error) {
      console.error('Failed to rename project:', error);
    } finally {
      setIsRenamingProject(false);
    }
  };

  useEffect(() => {
    if (isEditingName && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingName]);

  if (!project) return null;

  return (
    <header className="h-14 border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm flex items-center justify-between px-4">
      {/* Left - Back & Project Name */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/dashboard')}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          {isEditingName ? (
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value.slice(0, MAX_PROJECT_NAME_LENGTH))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveProjectName();
                  if (e.key === 'Escape') cancelEditingName();
                }}
                onBlur={saveProjectName}
                disabled={isRenamingProject}
                className="px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                style={{ width: `${Math.max(editedName.length * 8 + 20, 150)}px` }}
              />
              <span className="text-xs text-gray-500">{editedName.length}/{MAX_PROJECT_NAME_LENGTH}</span>
            </div>
          ) : (
            <button
              onClick={startEditingName}
              className="group flex items-center gap-2 hover:bg-gray-800/50 px-2 py-1 rounded transition-colors"
            >
              <h1 className="text-white font-medium">{project.name}</h1>
              <svg className="w-4 h-4 text-gray-500 group-hover:text-gray-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Center - View Toggle & Viewport Controls */}
      <div className="flex items-center gap-4">
        {/* Preview/Code Toggle */}
        <div className="flex items-center bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setShowCodePanel(false)}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              !showCodePanel
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setShowCodePanel(true)}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              showCodePanel
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Code
          </button>
        </div>

        {/* Viewport Controls - Only show when in Preview mode */}
        {!showCodePanel && (
          <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewportSize('desktop')}
              className={`p-2 rounded transition-colors ${
                viewportSize === 'desktop' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
              }`}
              title="Desktop"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewportSize('tablet')}
              className={`p-2 rounded transition-colors ${
                viewportSize === 'tablet' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
              }`}
              title="Tablet"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewportSize('mobile')}
              className={`p-2 rounded transition-colors ${
                viewportSize === 'mobile' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
              }`}
              title="Mobile"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Right - Actions */}
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={handleExport} disabled={isExporting}>
          {isExporting ? 'Exporting...' : 'Export'}
        </Button>
        <Button size="sm" onClick={() => setShowDeployModal(true)}>
          Deploy
        </Button>
      </div>

      <GitHubDeployModal isOpen={showDeployModal} onClose={() => setShowDeployModal(false)} />
    </header>
  );
}
