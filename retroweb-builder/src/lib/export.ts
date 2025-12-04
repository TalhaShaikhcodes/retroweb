import JSZip from 'jszip';
import type { Project } from '@/stores/builderStore';

export async function exportProjectAsZip(project: Project): Promise<void> {
  const zip = new JSZip();

  // Add each page's files
  for (const page of project.pages) {
    const isIndex = page.slug === 'index' || page.slug === '/';
    const baseName = isIndex ? 'index' : page.slug;

    // Add HTML file
    if (page.html) {
      zip.file(`${baseName}.html`, page.html);
    }

    // Add CSS file (if page has custom CSS)
    if (page.css && page.css.trim()) {
      zip.file(`css/${baseName}.css`, page.css);
    }

    // Add JS file (if page has custom JS)
    if (page.js && page.js.trim()) {
      zip.file(`js/${baseName}.js`, page.js);
    }
  }

  // Generate the zip file
  const blob = await zip.generateAsync({ type: 'blob' });

  // Create download link and trigger download
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${project.name.toLowerCase().replace(/\s+/g, '-')}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
