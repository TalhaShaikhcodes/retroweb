'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useBuilderStore } from '@/stores/builderStore';
import { useAuth } from '@/contexts/AuthContext';
import { deployToGitHub } from '@/lib/github';

interface GitHubDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Helper to get/set deployment info from localStorage
const getDeploymentKey = (projectId: string) => `retroweb_deploy_${projectId}`;

interface DeploymentInfo {
  repoName: string;
  repoUrl: string;
  pagesUrl: string;
  deployedAt: string;
}

export function GitHubDeployModal({ isOpen, onClose }: GitHubDeployModalProps) {
  const { project } = useBuilderStore();
  const { user, githubToken, connectGithubForDeploy } = useAuth();
  const [repoName, setRepoName] = useState('');
  const [isNewRepo, setIsNewRepo] = useState(true);
  const [isDeploying, setIsDeploying] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ url: string; repoUrl: string } | null>(null);
  const [previousDeployment, setPreviousDeployment] = useState<DeploymentInfo | null>(null);

  // Check if user signed in with GitHub
  const isGitHubUser = user?.app_metadata?.provider === 'github';
  const hasGitHubToken = !!githubToken;

  // Load previous deployment info and set defaults
  useEffect(() => {
    if (project?.id) {
      const saved = localStorage.getItem(getDeploymentKey(project.id));
      if (saved) {
        try {
          const info: DeploymentInfo = JSON.parse(saved);
          setPreviousDeployment(info);
          setRepoName(info.repoName);
          setIsNewRepo(false); // Default to update if previously deployed
        } catch {
          // Invalid saved data, use defaults
          setRepoName(project.name.toLowerCase().replace(/[^a-z0-9-]/g, '-'));
          setIsNewRepo(true);
        }
      } else {
        setRepoName(project.name.toLowerCase().replace(/[^a-z0-9-]/g, '-'));
        setIsNewRepo(true);
      }
    }
  }, [project?.id, project?.name]);

  const handleConnectGitHub = async () => {
    setIsConnecting(true);
    setError(null);
    const { error } = await connectGithubForDeploy();
    if (error) {
      setError(error.message);
      setIsConnecting(false);
    }
    // If successful, user will be redirected to GitHub OAuth
  };

  const handleDeploy = async () => {
    if (!githubToken || !repoName.trim() || !project) return;
    
    setIsDeploying(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await deployToGitHub({
        token: githubToken,
        repoName: repoName.trim(),
        project,
        isNewRepo,
      });
      
      // Save deployment info for future updates
      const deploymentInfo: DeploymentInfo = {
        repoName: repoName.trim(),
        repoUrl: result.repoUrl,
        pagesUrl: result.url,
        deployedAt: new Date().toISOString(),
      };
      localStorage.setItem(getDeploymentKey(project.id), JSON.stringify(deploymentInfo));
      setPreviousDeployment(deploymentInfo);
      
      setSuccess(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Deployment failed';
      
      // If repo already exists and user tried to create new, auto-switch to update mode
      if (errorMessage.includes('already exists') && isNewRepo) {
        setIsNewRepo(false);
        setError('Repository exists. Switched to update mode - click the button again to update.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsDeploying(false);
    }
  };

  if (!isOpen) return null;


  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto py-8">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-md mx-4 my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </div>
          <div>
            <h2 className="text-white font-semibold text-lg">Deploy to GitHub</h2>
            <p className="text-gray-400 text-sm">Publish to GitHub Pages</p>
          </div>
        </div>

        {success ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-green-400 font-medium mb-2">🎉 Deployed successfully!</p>
              <p className="text-gray-400 text-sm mb-3">Your site is being published. It may take a few minutes to go live.</p>
              <div className="space-y-2">
                <a href={success.url} target="_blank" rel="noopener noreferrer" className="block text-purple-400 hover:text-purple-300 text-sm truncate">
                  🌐 {success.url}
                </a>
                <a href={success.repoUrl} target="_blank" rel="noopener noreferrer" className="block text-gray-400 hover:text-gray-300 text-sm truncate">
                  📁 {success.repoUrl}
                </a>
              </div>
            </div>
            <button onClick={onClose} className="w-full py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
              Close
            </button>
          </div>
        ) : !hasGitHubToken ? (
          <div className="space-y-4">
            <div className="p-4 bg-gray-800 rounded-lg">
              <p className="text-gray-300 text-sm mb-3">
                {isGitHubUser 
                  ? "Your GitHub session has expired. Please reconnect to deploy."
                  : "Connect your GitHub account to deploy your project directly to GitHub Pages."}
              </p>
              <button
                onClick={handleConnectGitHub}
                disabled={isConnecting}
                className="w-full py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {isConnecting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Connecting...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    Connect GitHub
                  </>
                )}
              </button>
            </div>
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-2">
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-green-400 text-sm">GitHub connected</span>
            </div>

            {/* Show previous deployment info */}
            {previousDeployment && (
              <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <p className="text-purple-400 text-sm font-medium mb-1">Previously deployed</p>
                <a href={previousDeployment.pagesUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-300 text-xs truncate block">
                  🌐 {previousDeployment.pagesUrl}
                </a>
              </div>
            )}

            <div>
              <label className="block text-gray-300 text-sm mb-2">Repository Name</label>
              <input
                type="text"
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
                placeholder="my-retro-site"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={isNewRepo} onChange={() => setIsNewRepo(true)} className="text-purple-500" />
                <span className="text-gray-300 text-sm">Create new repo</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={!isNewRepo} onChange={() => setIsNewRepo(false)} className="text-purple-500" />
                <span className="text-gray-300 text-sm">Update existing</span>
              </label>
            </div>

            {error && (
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-yellow-400 text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handleDeploy}
              disabled={!repoName.trim() || isDeploying}
              className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isDeploying ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {isNewRepo ? 'Creating...' : 'Updating...'}
                </>
              ) : (
                isNewRepo ? 'Deploy to New Repo' : 'Update Existing Site'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body);
  }
  return modalContent;
}
