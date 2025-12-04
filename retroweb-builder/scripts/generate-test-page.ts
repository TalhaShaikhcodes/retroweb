/**
 * Generate test page with all GIFs from the registry
 */
import { config } from 'dotenv';
import { gifLibrary } from '../src/lib/gifRegistry';
import * as fs from 'fs';

config({ path: '.env.local' });

const CDN_BASE = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/retro-gifs/`;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GIF Library Test - ${gifLibrary.length} Retro GIFs</title>
  <style>
    body {
      font-family: 'Comic Sans MS', cursive;
      background: #000080;
      color: #ffffff;
      padding: 20px;
      margin: 0;
    }
    
    .container {
      max-width: 1400px;
      margin: 0 auto;
    }
    
    h1 {
      text-align: center;
      background: linear-gradient(to right, red, orange, yellow, green, blue, violet);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-size: 48px;
      margin-bottom: 10px;
    }
    
    .stats {
      text-align: center;
      background: #ffff00;
      color: #000000;
      padding: 15px;
      margin: 20px 0;
      border: 3px ridge #ff00ff;
      font-weight: bold;
    }
    
    .category {
      background: rgba(255, 255, 255, 0.1);
      border: 3px solid #00ffff;
      padding: 20px;
      margin: 30px 0;
      border-radius: 10px;
    }
    
    .category h2 {
      color: #00ffff;
      margin-top: 0;
      font-size: 32px;
    }
    
    .gif-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    
    .gif-card {
      background: #ffffff;
      border: 3px solid #000000;
      padding: 15px;
      text-align: center;
      box-shadow: 5px 5px 0px rgba(0, 0, 0, 0.5);
    }
    
    .gif-card img {
      max-width: 100%;
      height: auto;
      border: 2px solid #000000;
      background: #f0f0f0;
      padding: 10px;
    }
    
    .gif-name {
      color: #000000;
      font-weight: bold;
      margin: 10px 0 5px 0;
      font-size: 14px;
    }
    
    .gif-tags {
      color: #666666;
      font-size: 11px;
      margin: 5px 0;
    }
    
    .gif-size {
      color: #999999;
      font-size: 10px;
    }
    
    .filter-bar {
      background: #ff00ff;
      padding: 15px;
      margin: 20px 0;
      border: 3px ridge #ffff00;
      text-align: center;
    }
    
    .filter-bar button {
      background: #00ffff;
      border: 2px solid #000000;
      padding: 10px 20px;
      margin: 5px;
      cursor: pointer;
      font-family: inherit;
      font-weight: bold;
      font-size: 14px;
    }
    
    .filter-bar button:hover {
      background: #ffff00;
    }
    
    .filter-bar button.active {
      background: #00ff00;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🎨 RETRO GIF LIBRARY TEST 🎨</h1>
    
    <div class="stats">
      <div>✨ Total GIFs: <span id="total">${gifLibrary.length}</span> ✨</div>
      <div>📦 Animations: <span id="animations">${gifLibrary.filter(g => g.category === 'animation').length}</span> | 🔘 Buttons: <span id="buttons">${gifLibrary.filter(g => g.category === 'button').length}</span> | 🎭 Decorations: <span id="decorations">${gifLibrary.filter(g => g.category === 'decoration').length}</span></div>
    </div>
    
    <div class="filter-bar">
      <strong>Filter by Theme:</strong><br><br>
      <button onclick="filterTheme('all')" class="active">All (${gifLibrary.length})</button>
      <button onclick="filterTheme('geocities-chaos')">🌈 Geocities</button>
      <button onclick="filterTheme('neon-cyber-2001')">💻 Neon Cyber</button>
      <button onclick="filterTheme('vaporwave')">🌴 Vaporwave</button>
      <button onclick="filterTheme('vhs-glitch')">📼 VHS Glitch</button>
      <button onclick="filterTheme('windows-95')">🪟 Windows 95</button>
    </div>
    
    <div id="content"></div>
  </div>

  <script>
    const CDN_BASE = '${CDN_BASE}';
    
    const gifs = ${JSON.stringify(gifLibrary.map(g => ({
      id: g.id,
      name: g.name,
      category: g.category,
      themes: g.themes,
      tags: g.tags,
      path: g.path,
      size: g.fileSize
    })), null, 2)};
    
    let currentTheme = 'all';
    
    function formatSize(bytes) {
      return bytes < 1024 ? bytes + ' B' : (bytes / 1024).toFixed(1) + ' KB';
    }
    
    function filterTheme(theme) {
      currentTheme = theme;
      
      // Update button states
      document.querySelectorAll('.filter-bar button').forEach(btn => {
        btn.classList.remove('active');
      });
      event.target.classList.add('active');
      
      renderGifs();
    }
    
    function renderGifs() {
      const filtered = currentTheme === 'all' 
        ? gifs 
        : gifs.filter(g => g.themes.includes(currentTheme));
      
      const byCategory = {
        animation: filtered.filter(g => g.category === 'animation'),
        button: filtered.filter(g => g.category === 'button'),
        decoration: filtered.filter(g => g.category === 'decoration'),
      };
      
      let html = '';
      
      for (const [category, items] of Object.entries(byCategory)) {
        if (items.length === 0) continue;
        
        const emoji = category === 'animation' ? '📦' : category === 'button' ? '🔘' : '🎭';
        html += \`
          <div class="category">
            <h2>\${emoji} \${category.toUpperCase()} (\${items.length})</h2>
            <div class="gif-grid">
              \${items.map(gif => \`
                <div class="gif-card">
                  <img src="\${CDN_BASE}\${gif.path}" alt="\${gif.name}" loading="lazy" onerror="this.style.border='3px solid red'">
                  <div class="gif-name">\${gif.name}</div>
                  <div class="gif-tags">\${gif.tags.join(', ')}</div>
                  <div class="gif-size">\${formatSize(gif.size)}</div>
                </div>
              \`).join('')}
            </div>
          </div>
        \`;
      }
      
      document.getElementById('content').innerHTML = html;
    }
    
    // Initial render
    renderGifs();
  </script>
</body>
</html>`;

fs.writeFileSync('public/test-gifs.html', html);
console.log(`✅ Generated test page with ${gifLibrary.length} GIFs`);
console.log('📂 File: public/test-gifs.html');
console.log('🌐 Open: http://localhost:3000/test-gifs.html');
