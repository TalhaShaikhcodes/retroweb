import type { Project } from '@/stores/builderStore';

interface GitHubDeployOptions {
  token: string;
  repoName: string;
  project: Project;
  isNewRepo: boolean;
}

interface GitHubFile {
  path: string;
  content: string;
}

// Convert project pages to GitHub file structure
function projectToFiles(project: Project): GitHubFile[] {
  const files: GitHubFile[] = [];

  for (const page of project.pages) {
    const isIndex = page.slug === 'index' || page.slug === '/';
    const baseName = isIndex ? 'index' : page.slug;

    if (page.html) {
      files.push({ path: `${baseName}.html`, content: page.html });
    }
    if (page.css && page.css.trim()) {
      files.push({ path: `css/${baseName}.css`, content: page.css });
    }
    if (page.js && page.js.trim()) {
      files.push({ path: `js/${baseName}.js`, content: page.js });
    }
  }

  return files;
}

// Get authenticated user
async function getUser(token: string): Promise<{ login: string }> {
  const res = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
    },
  });
  if (!res.ok) throw new Error('Invalid GitHub token');
  return res.json();
}

// Check if repo exists
async function repoExists(token: string, owner: string, repo: string): Promise<boolean> {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
    },
  });
  return res.ok;
}


// Create a new repository
async function createRepo(token: string, name: string, description: string): Promise<void> {
  const res = await fetch('https://api.github.com/user/repos', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      description,
      auto_init: true,
      private: false,
    }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to create repository');
  }
  // Wait for repo to be ready
  await new Promise(resolve => setTimeout(resolve, 2000));
}

// Get the default branch SHA
async function getDefaultBranchSha(token: string, owner: string, repo: string): Promise<string> {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs/heads/main`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
    },
  });
  if (!res.ok) {
    // Try 'master' branch
    const masterRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs/heads/master`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
      },
    });
    if (!masterRes.ok) throw new Error('Could not find default branch');
    const data = await masterRes.json();
    return data.object.sha;
  }
  const data = await res.json();
  return data.object.sha;
}

// Create a blob for file content
async function createBlob(token: string, owner: string, repo: string, content: string): Promise<string> {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/blobs`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content: btoa(unescape(encodeURIComponent(content))),
      encoding: 'base64',
    }),
  });
  if (!res.ok) throw new Error('Failed to create blob');
  const data = await res.json();
  return data.sha;
}


// Create a tree with all files
async function createTree(
  token: string,
  owner: string,
  repo: string,
  baseSha: string,
  files: GitHubFile[]
): Promise<string> {
  const tree = await Promise.all(
    files.map(async (file) => ({
      path: file.path,
      mode: '100644' as const,
      type: 'blob' as const,
      sha: await createBlob(token, owner, repo, file.content),
    }))
  );

  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ base_tree: baseSha, tree }),
  });
  if (!res.ok) throw new Error('Failed to create tree');
  const data = await res.json();
  return data.sha;
}

// Create a commit
async function createCommit(
  token: string,
  owner: string,
  repo: string,
  treeSha: string,
  parentSha: string,
  message: string
): Promise<string> {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/commits`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      tree: treeSha,
      parents: [parentSha],
    }),
  });
  if (!res.ok) throw new Error('Failed to create commit');
  const data = await res.json();
  return data.sha;
}

// Update branch reference
async function updateRef(token: string, owner: string, repo: string, commitSha: string): Promise<void> {
  // Try main first, then master
  let branch = 'main';
  const mainRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs/heads/main`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
  });
  if (!mainRes.ok) branch = 'master';

  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branch}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sha: commitSha, force: true }),
  });
  if (!res.ok) throw new Error('Failed to update branch');
}


// Enable GitHub Pages
async function enableGitHubPages(token: string, owner: string, repo: string): Promise<string> {
  // First check if pages is already enabled
  const checkRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/pages`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
    },
  });
  
  if (checkRes.ok) {
    const data = await checkRes.json();
    return data.html_url;
  }

  // Enable pages from main branch root
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/pages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      source: { branch: 'main', path: '/' },
    }),
  });
  
  if (!res.ok) {
    // Try with master branch
    const masterRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/pages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: { branch: 'master', path: '/' },
      }),
    });
    if (!masterRes.ok) {
      console.warn('Could not enable GitHub Pages automatically');
      return `https://${owner}.github.io/${repo}`;
    }
    const data = await masterRes.json();
    return data.html_url || `https://${owner}.github.io/${repo}`;
  }
  
  const data = await res.json();
  return data.html_url || `https://${owner}.github.io/${repo}`;
}

// Main deploy function
export async function deployToGitHub(options: GitHubDeployOptions): Promise<{ url: string; repoUrl: string }> {
  const { token, repoName, project, isNewRepo } = options;
  
  // Get user info
  const user = await getUser(token);
  const owner = user.login;
  
  // Create repo if needed
  if (isNewRepo) {
    const exists = await repoExists(token, owner, repoName);
    if (exists) {
      throw new Error(`Repository "${repoName}" already exists`);
    }
    await createRepo(token, repoName, `${project.name} - Built with RetroWeb Builder`);
  }
  
  // Convert project to files
  const files = projectToFiles(project);
  if (files.length === 0) {
    throw new Error('No files to deploy');
  }
  
  // Get current branch SHA
  const baseSha = await getDefaultBranchSha(token, owner, repoName);
  
  // Create tree with all files
  const treeSha = await createTree(token, owner, repoName, baseSha, files);
  
  // Create commit
  const commitSha = await createCommit(
    token, owner, repoName, treeSha, baseSha,
    `Deploy ${project.name} from RetroWeb Builder`
  );
  
  // Update branch
  await updateRef(token, owner, repoName, commitSha);
  
  // Enable GitHub Pages
  const pagesUrl = await enableGitHubPages(token, owner, repoName);
  
  return {
    url: pagesUrl,
    repoUrl: `https://github.com/${owner}/${repoName}`,
  };
}
