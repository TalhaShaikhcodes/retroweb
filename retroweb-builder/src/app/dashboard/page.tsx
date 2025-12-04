'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface Project {
  id: string;
  name: string;
  theme: string;
  created_at: string;
  updated_at: string;
}

const MAX_PROJECT_NAME_LENGTH = 50;

export default function DashboardPage() {
  const { user, signOut, loading } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<Project | null>(null);
  const [showRenameModal, setShowRenameModal] = useState<Project | null>(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [renameProjectName, setRenameProjectName] = useState('');
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (data.projects) {
        setProjects(data.projects);
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    } finally {
      setLoadingProjects(false);
    }
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user, fetchProjects]);

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
    router.push('/login');
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      setError('Project name is required');
      return;
    }
    setCreating(true);
    setError(null);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newProjectName }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to create project');
        setCreating(false);
        return;
      }
      router.push(`/builder/${data.project.id}`);
    } catch {
      setError('Failed to create project');
      setCreating(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!showDeleteModal) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/projects/${showDeleteModal.id}`, { method: 'DELETE' });
      if (res.ok) {
        setProjects(projects.filter((p) => p.id !== showDeleteModal.id));
        setShowDeleteModal(null);
      }
    } catch (err) {
      console.error('Failed to delete project:', err);
    } finally {
      setDeleting(false);
    }
  };

  const handleRenameProject = async () => {
    if (!showRenameModal || !renameProjectName.trim()) return;
    setRenaming(true);
    try {
      const res = await fetch(`/api/projects/${showRenameModal.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: renameProjectName.trim().slice(0, MAX_PROJECT_NAME_LENGTH) }),
      });
      if (res.ok) {
        const data = await res.json();
        setProjects(projects.map((p) => (p.id === showRenameModal.id ? data.project : p)));
        setShowRenameModal(null);
        setRenameProjectName('');
      }
    } catch (err) {
      console.error('Failed to rename project:', err);
    } finally {
      setRenaming(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  };

  const canCreateProject = projects.length < 3;

  if (loading || signingOut) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">{signingOut ? 'Signing out...' : 'Loading...'}</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-white">RetroWeb Builder</h1>
              <p className="text-gray-400 text-sm">{user.email}</p>
            </div>
            <Button onClick={handleSignOut} variant="ghost" size="sm">Sign Out</Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-1">Your Projects</h2>
            <p className="text-gray-400">{projects.length} of 3 projects used</p>
          </div>
          {canCreateProject && (
            <Button onClick={() => setShowCreateModal(true)}>+ New Project</Button>
          )}
        </div>

        {/* Projects Grid */}
        {loadingProjects ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : projects.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No projects yet</h3>
            <p className="text-gray-400 mb-6">Create your first retro website and let AI help you build it!</p>
            <Button onClick={() => setShowCreateModal(true)}>Create Your First Project</Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="group p-0 overflow-hidden hover:border-purple-500/50 transition-all duration-200 cursor-pointer" onClick={() => router.push(`/builder/${project.id}`)}>
                <div className="h-32 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 relative">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2 py-1 bg-black/30 backdrop-blur-sm rounded text-xs text-white">Retro Website</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-purple-300 transition-colors">{project.name}</h3>
                  <p className="text-gray-500 text-sm mb-4">Created {formatDate(project.created_at)}</p>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1" onClick={(e) => { e.stopPropagation(); router.push(`/builder/${project.id}`); }}>Open Builder</Button>
                    <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); setShowRenameModal(project); setRenameProjectName(project.name); }} className="text-gray-400 hover:text-blue-400 hover:bg-blue-400/10" title="Rename">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </Button>
                    <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); setShowDeleteModal(project); }} className="text-gray-400 hover:text-red-400 hover:bg-red-400/10" title="Delete">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            {canCreateProject && (
              <Card className="p-6 border-dashed border-2 border-gray-600 hover:border-purple-500/50 transition-colors cursor-pointer flex items-center justify-center min-h-[200px]" onClick={() => setShowCreateModal(true)}>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-800 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <p className="text-gray-400 text-sm">New Project</p>
                </div>
              </Card>
            )}
          </div>
        )}
      </main>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Create New Project</h3>
              <button onClick={() => { setShowCreateModal(false); setNewProjectName(''); setError(null); }} className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>
            )}
            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-medium mb-2">Project Name</label>
              <input type="text" value={newProjectName} onChange={(e) => setNewProjectName(e.target.value.slice(0, MAX_PROJECT_NAME_LENGTH))} onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()} placeholder="My Awesome Retro Site" autoFocus className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" />
              <p className="text-gray-500 text-xs mt-2">{newProjectName.length}/{MAX_PROJECT_NAME_LENGTH} characters • You can customize the style with AI in the builder</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => { setShowCreateModal(false); setNewProjectName(''); setError(null); }} className="flex-1" disabled={creating}>Cancel</Button>
              <Button onClick={handleCreateProject} disabled={creating || !newProjectName.trim()} className="flex-1">
                {creating ? <span className="flex items-center gap-2"><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>Creating...</span> : 'Create & Open Builder'}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Rename Project Modal */}
      {showRenameModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Rename Project</h3>
              <button onClick={() => { setShowRenameModal(null); setRenameProjectName(''); }} className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-medium mb-2">Project Name</label>
              <input
                type="text"
                value={renameProjectName}
                onChange={(e) => setRenameProjectName(e.target.value.slice(0, MAX_PROJECT_NAME_LENGTH))}
                onKeyDown={(e) => e.key === 'Enter' && handleRenameProject()}
                placeholder="Enter new project name"
                autoFocus
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
              <p className="text-gray-500 text-xs mt-2">{renameProjectName.length}/{MAX_PROJECT_NAME_LENGTH} characters</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => { setShowRenameModal(null); setRenameProjectName(''); }} className="flex-1" disabled={renaming}>Cancel</Button>
              <Button onClick={handleRenameProject} disabled={renaming || !renameProjectName.trim()} className="flex-1">
                {renaming ? <span className="flex items-center gap-2"><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>Renaming...</span> : 'Rename Project'}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center mb-6">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Delete Project?</h3>
              <p className="text-gray-400 text-sm">Are you sure you want to delete <span className="text-white font-medium">{showDeleteModal.name}</span>? This action cannot be undone.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowDeleteModal(null)} className="flex-1" disabled={deleting}>Cancel</Button>
              <Button onClick={handleDeleteProject} disabled={deleting} className="flex-1 bg-red-600 hover:bg-red-700">
                {deleting ? <span className="flex items-center gap-2"><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>Deleting...</span> : 'Delete Project'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
