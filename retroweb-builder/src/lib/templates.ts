// Pre-built retro website templates

export interface Template {
  id: string;
  name: string;
  description: string;
  color: string;
  html: string;
  css: string;
  js: string;
}

const blankTemplate: Template = {
  id: 'blank',
  name: '✨ Blank Canvas',
  description: 'Start from scratch',
  color: '#ff00ff',
  html: '<!DOCTYPE html>\n<html>\n<head>\n  <title>My Retro Website</title>\n  <link rel="stylesheet" href="styles.css">\n</head>\n<body>\n  <h1>Welcome to My Website!</h1>\n  <p>Start building your retro masterpiece here...</p>\n</body>\n</html>',
  css: 'body {\n  font-family: Arial, sans-serif;\n  margin: 20px;\n  background: #ffffff;\n  color: #000000;\n}\n\nh1 {\n  color: #0000ff;\n}',
  js: '// Add your JavaScript here\nconsole.log("Welcome to your retro website!");',
};

const geocitiesTemplate: Template = {
  id: 'geocities',
  name: '🌐 Geocities Classic',
  description: 'Rainbow text & GIFs galore',
  color: '#00ff00',
  html: `<!DOCTYPE html>
<html>
<head>
  <title>🌟 Welcome to My Geocities Page! 🌟</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <center>
    <img src="https://xsuxxzzsqfvyvqyxswme.supabase.co/storage/v1/object/public/retro-gifs/animations/welcome-geocities.gif" alt="Welcome" width="400">
    <h1 class="rainbow">🎉 WELCOME TO MY HOMEPAGE! 🎉</h1>
    <marquee behavior="scroll" direction="left">★ Welcome to my awesome page! ★ Sign my guestbook! ★ Under construction! ★</marquee>
    
    <table border="5" cellpadding="15" bgcolor="#ffff00" width="90%">
      <tr>
        <td colspan="2" bgcolor="#ff00ff">
          <h2><font color="white">📝 About Me</font></h2>
        </td>
      </tr>
      <tr>
        <td width="50%" bgcolor="#00ffff">
          <p><font color="red" size="4"><b>Hi! I'm a webmaster!</b></font></p>
          <p>I love making websites and collecting GIFs!</p>
          <p><img src="https://xsuxxzzsqfvyvqyxswme.supabase.co/storage/v1/object/public/retro-gifs/animations/new2.gif" alt="New" width="50"> Check out my cool links below!</p>
        </td>
        <td width="50%" bgcolor="#ffff00">
          <h3>🔗 Cool Links</h3>
          <ul>
            <li><img src="https://xsuxxzzsqfvyvqyxswme.supabase.co/storage/v1/object/public/retro-gifs/animations/right-arrow.gif" alt="Arrow" width="20"> <a href="about.html">About Me</a></li>
            <li><img src="https://xsuxxzzsqfvyvqyxswme.supabase.co/storage/v1/object/public/retro-gifs/animations/right-arrow.gif" alt="Arrow" width="20"> <a href="gallery.html">My Gallery</a></li>
            <li><img src="https://xsuxxzzsqfvyvqyxswme.supabase.co/storage/v1/object/public/retro-gifs/animations/right-arrow.gif" alt="Arrow" width="20"> <a href="guestbook.html">Sign Guestbook</a></li>
          </ul>
        </td>
      </tr>
    </table>
    
    <p><img src="https://xsuxxzzsqfvyvqyxswme.supabase.co/storage/v1/object/public/retro-gifs/animations/under-construction.gif" alt="Under Construction" width="150"></p>
    <p><font size="5" color="blue">⭐ Latest Updates ⭐</font></p>
    <table border="3" cellpadding="10" width="80%" bgcolor="#ffffff">
      <tr>
        <td>
          <p><b>12/01/2025:</b> Added new GIFs to gallery!</p>
          <p><b>11/30/2025:</b> Updated my favorite links!</p>
        </td>
      </tr>
    </table>
    
    <p><img src="https://xsuxxzzsqfvyvqyxswme.supabase.co/storage/v1/object/public/retro-gifs/animations/email.gif" alt="Email" width="30"> <a href="mailto:webmaster@example.com">Email Me!</a></p>
    <p><font size="2">You are visitor #<b id="counter">000042</b> 🎊</font></p>
    <p><font size="1">Best viewed in Netscape Navigator 4.0</font></p>
  </center>
</body>
</html>`,
  css: `body {
  background: #ffffff;
  font-family: "Comic Sans MS", cursive;
  margin: 0;
  padding: 20px;
}

.rainbow {
  background: linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 42px;
  animation: rainbow-shift 3s linear infinite;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

@keyframes rainbow-shift {
  0% { filter: hue-rotate(0deg); }
  100% { filter: hue-rotate(360deg); }
}

marquee {
  background: linear-gradient(90deg, #ff00ff, #00ffff, #ffff00);
  padding: 15px;
  border: 5px ridge #ff00ff;
  font-weight: bold;
  font-size: 18px;
  margin: 20px 0;
}

table {
  margin: 20px auto;
  box-shadow: 5px 5px 0px rgba(0,0,0,0.3);
}

td {
  border: 2px solid #000000;
}

a {
  color: #0000ff;
  text-decoration: underline;
  font-weight: bold;
}

a:visited {
  color: #800080;
}

blink {
  animation: blink-animation 1s steps(2, start) infinite;
}

@keyframes blink-animation {
  to { visibility: hidden; }
}`,
  js: `let count = 42;
setInterval(() => {
  count++;
  const counter = document.getElementById('counter');
  if (counter) {
    counter.textContent = String(count).padStart(6, '0');
  }
}, 3000);

console.log('🌟 Geocities page loaded!');`,
};

const cyberTemplate: Template = {
  id: 'cyber',
  name: '💻 Cyber Hacker',
  description: 'Matrix-style green on black',
  color: '#00ff00',
  html: `<!DOCTYPE html>
<html>
<head>
  <title>[ CYBER TERMINAL ]</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="scanlines"></div>
  <div class="container">
    <div style="text-align: center;">
      <img src="https://xsuxxzzsqfvyvqyxswme.supabase.co/storage/v1/object/public/retro-gifs/animations/loading-vhs.gif" alt="Loading" width="50">
    </div>
    <h1>[ ACCESS GRANTED ]</h1>
    <div class="terminal">
      <p><span class="prompt">root@cyber:~$</span> cat welcome.txt</p>
      <p class="output">╔═══════════════════════════════════╗</p>
      <p class="output">║  WELCOME TO THE MAINFRAME        ║</p>
      <p class="output">║  System Status: ONLINE           ║</p>
      <p class="output">║  Security Level: MAXIMUM         ║</p>
      <p class="output">╚═══════════════════════════════════╝</p>
      <p><span class="prompt">root@cyber:~$</span> ls -la</p>
      <p class="output">drwxr-xr-x  5 root root  4096 Dec  1 00:00 .</p>
      <p class="output">drwxr-xr-x  3 root root  4096 Dec  1 00:00 ..</p>
      <p class="output">-rw-r--r--  1 root root   220 Dec  1 00:00 about.html</p>
      <p class="output">-rw-r--r--  1 root root   807 Dec  1 00:00 projects.html</p>
      <p class="output">-rw-r--r--  1 root root  3771 Dec  1 00:00 contact.html</p>
      <p><span class="prompt">root@cyber:~$</span> <span class="cursor">_</span></p>
    </div>
    <div class="info-panel">
      <h2>[ SYSTEM INFO ]</h2>
      <p><img src="https://xsuxxzzsqfvyvqyxswme.supabase.co/storage/v1/object/public/retro-gifs/animations/updated-neoncyber.gif" alt="Updated" width="60"></p>
      <p>CPU: <span class="value">98%</span></p>
      <p>RAM: <span class="value">2048 MB</span></p>
      <p>NETWORK: <span class="value">SECURE</span></p>
      <p>UPTIME: <span class="value" id="uptime">0</span> seconds</p>
    </div>
  </div>
</body>
</html>`,
  css: `body {
  background: #000000;
  color: #00ff00;
  font-family: "Courier New", monospace;
  padding: 20px;
  margin: 0;
  overflow-x: hidden;
}

.scanlines {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 255, 0, 0.03),
    rgba(0, 255, 0, 0.03) 1px,
    transparent 1px,
    transparent 2px
  );
  pointer-events: none;
  z-index: 1000;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  text-shadow: 0 0 5px #00ff00;
  position: relative;
  z-index: 1;
}

h1 {
  text-align: center;
  font-size: 36px;
  letter-spacing: 4px;
  animation: glow 2s ease-in-out infinite alternate;
  margin-bottom: 30px;
}

@keyframes glow {
  from { text-shadow: 0 0 5px #00ff00, 0 0 10px #00ff00; }
  to { text-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00; }
}

.terminal {
  background: rgba(0, 20, 0, 0.9);
  border: 2px solid #00ff00;
  padding: 20px;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.5), inset 0 0 20px rgba(0, 255, 0, 0.1);
  margin-bottom: 20px;
  font-size: 14px;
  line-height: 1.6;
}

.prompt {
  color: #00ff00;
  font-weight: bold;
}

.output {
  color: #00cc00;
  margin: 5px 0;
  padding-left: 20px;
}

.cursor {
  animation: blink 1s step-end infinite;
  background: #00ff00;
  padding: 0 4px;
}

@keyframes blink {
  50% { opacity: 0; }
}

.info-panel {
  background: rgba(0, 20, 0, 0.9);
  border: 2px solid #00ff00;
  padding: 20px;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
}

.info-panel h2 {
  margin-top: 0;
  font-size: 20px;
  letter-spacing: 2px;
}

.info-panel p {
  margin: 10px 0;
  font-size: 16px;
}

.value {
  color: #00ffff;
  font-weight: bold;
  float: right;
}`,
  js: `let uptime = 0;
setInterval(() => {
  uptime++;
  const uptimeEl = document.getElementById('uptime');
  if (uptimeEl) {
    uptimeEl.textContent = uptime;
  }
}, 1000);

console.log('[SYSTEM] Terminal initialized');
console.log('[SYSTEM] All systems operational');`,
};

const pixelArcadeTemplate: Template = {
  id: 'pixel-arcade',
  name: '🎮 Pixel Arcade',
  description: '8-bit retro gaming vibes',
  color: '#ff6b9d',
  html: `<!DOCTYPE html>
<html>
<head>
  <title>🎮 PIXEL ARCADE 🎮</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    <h1 class="pixel-title">PIXEL ARCADE</h1>
    <div class="game-screen">
      <div class="score-bar">
        <span>SCORE: <span id="score">0000</span></span>
        <span>LIVES: ❤️❤️❤️</span>
        <span>LEVEL: <span id="level">1</span></span>
      </div>
      <div class="game-area">
        <div class="pixel-character">▲</div>
        <p class="game-text">PRESS START</p>
      </div>
    </div>
    <div class="menu-buttons">
      <button class="pixel-btn">🎮 PLAY</button>
      <button class="pixel-btn">📊 HIGH SCORES</button>
      <button class="pixel-btn">⚙️ OPTIONS</button>
      <button class="pixel-btn">ℹ️ ABOUT</button>
    </div>
    <div class="info-box">
      <h2>🏆 HIGH SCORES 🏆</h2>
      <p>1. AAA ......... 9999</p>
      <p>2. BBB ......... 8888</p>
      <p>3. CCC ......... 7777</p>
      <p style="text-align: center; margin-top: 20px;">
        <img src="https://xsuxxzzsqfvyvqyxswme.supabase.co/storage/v1/object/public/retro-gifs/animations/winner2.gif" alt="Winner" width="80">
      </p>
    </div>
  </div>
</body>
</html>`,
  css: `body {
  background: #000000;
  color: #ffffff;
  font-family: 'Press Start 2P', 'Courier New', monospace;
  padding: 20px;
  margin: 0;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

.pixel-title {
  text-align: center;
  font-size: 32px;
  color: #ff6b9d;
  text-shadow: 4px 4px 0px #000000, 8px 8px 0px #4ecdc4;
  margin-bottom: 30px;
  animation: pixel-float 2s ease-in-out infinite;
}

@keyframes pixel-float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.game-screen {
  background: #1a1a2e;
  border: 8px solid #ff6b9d;
  box-shadow: 0 0 0 4px #000000, 0 0 0 8px #4ecdc4;
  margin-bottom: 20px;
}

.score-bar {
  background: #0f0f1e;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  border-bottom: 4px solid #ff6b9d;
}

.game-area {
  padding: 40px;
  text-align: center;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.pixel-character {
  font-size: 48px;
  color: #4ecdc4;
  animation: bounce 0.5s ease-in-out infinite alternate;
}

@keyframes bounce {
  from { transform: translateY(0); }
  to { transform: translateY(-20px); }
}

.game-text {
  font-size: 16px;
  color: #ffff00;
  margin-top: 20px;
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  50% { opacity: 0; }
}

.menu-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 20px;
}

.pixel-btn {
  background: #ff6b9d;
  color: #ffffff;
  border: 4px solid #000000;
  padding: 15px;
  font-family: inherit;
  font-size: 12px;
  cursor: pointer;
  box-shadow: 4px 4px 0px #000000;
  transition: all 0.1s;
}

.pixel-btn:hover {
  background: #4ecdc4;
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px #000000;
}

.info-box {
  background: #1a1a2e;
  border: 4px solid #4ecdc4;
  padding: 20px;
  font-size: 12px;
}

.info-box h2 {
  text-align: center;
  color: #ffff00;
  margin-top: 0;
}

.info-box p {
  margin: 10px 0;
  color: #ffffff;
}`,
  js: `let score = 0;
let level = 1;

setInterval(() => {
  score += 10;
  const scoreEl = document.getElementById('score');
  if (scoreEl) {
    scoreEl.textContent = String(score).padStart(4, '0');
  }
  
  if (score % 100 === 0) {
    level++;
    const levelEl = document.getElementById('level');
    if (levelEl) {
      levelEl.textContent = level;
    }
  }
}, 2000);

console.log('🎮 Pixel Arcade loaded!');`,
};

const vhsGlitchTemplate: Template = {
  id: 'vhs-glitch',
  name: '📼 VHS Glitch',
  description: 'Analog tracking errors',
  color: '#ff00ff',
  html: `<!DOCTYPE html>
<html>
<head>
  <title>📼 VHS MEMORIES 📼</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="vhs-overlay"></div>
  <div class="container">
    <div class="timestamp">REC ● 12/01/2025 00:00:00</div>
    <h1 class="glitch" data-text="VHS MEMORIES">VHS MEMORIES</h1>
    <div class="content-box">
      <h2>📹 HOME VIDEO COLLECTION</h2>
      <div class="video-list">
        <p>▶️ SUMMER_VACATION_1999.avi</p>
        <p>▶️ BIRTHDAY_PARTY_2000.avi</p>
        <p>▶️ FAMILY_REUNION_2001.avi</p>
        <p>▶️ SCHOOL_PLAY_2002.avi</p>
      </div>
    </div>
    <div class="info-panel">
      <h3>📼 TAPE INFO</h3>
      <p>Format: VHS</p>
      <p>Quality: SP</p>
      <p>Tracking: <span class="tracking-bar">||||||||||||</span></p>
      <p>Status: <span class="rec-indicator">● REC</span></p>
    </div>
    <div class="controls">
      <button class="vhs-btn">◀◀</button>
      <button class="vhs-btn">▶</button>
      <button class="vhs-btn">■</button>
      <button class="vhs-btn">▶▶</button>
    </div>
    <div style="text-align: center; margin-top: 20px;">
      <img src="https://xsuxxzzsqfvyvqyxswme.supabase.co/storage/v1/object/public/retro-gifs/buttons/playback-button.gif" alt="Playback" width="100">
    </div>
  </div>
</body>
</html>`,
  css: `body {
  background: #000000;
  color: #ffffff;
  font-family: 'Courier New', monospace;
  padding: 20px;
  margin: 0;
  min-height: 100vh;
}

.vhs-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    0deg,
    rgba(255, 255, 255, 0.03),
    rgba(255, 255, 255, 0.03) 2px,
    transparent 2px,
    transparent 4px
  );
  pointer-events: none;
  z-index: 1000;
  animation: vhs-scan 0.1s linear infinite;
}

@keyframes vhs-scan {
  0% { transform: translateY(0); }
  100% { transform: translateY(4px); }
}

.container {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  filter: contrast(1.2) saturate(1.3);
}

.timestamp {
  position: absolute;
  top: 10px;
  right: 10px;
  color: #ff0000;
  font-size: 14px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  z-index: 10;
}

h1 {
  text-align: center;
  font-size: 48px;
  margin: 40px 0;
  position: relative;
}

.glitch {
  color: #ffffff;
  text-shadow: 
    2px 0 #ff00ff,
    -2px 0 #00ffff,
    0 0 20px rgba(255, 255, 255, 0.5);
  animation: glitch 3s infinite;
}

@keyframes glitch {
  0%, 90%, 100% {
    transform: translate(0);
  }
  92% {
    transform: translate(-2px, 2px);
  }
  94% {
    transform: translate(2px, -2px);
  }
  96% {
    transform: translate(-2px, -2px);
  }
}

.content-box {
  background: rgba(20, 20, 40, 0.8);
  border: 3px solid #ff00ff;
  padding: 25px;
  margin-bottom: 20px;
  box-shadow: 0 0 20px rgba(255, 0, 255, 0.3);
}

.content-box h2 {
  color: #ff00ff;
  margin-top: 0;
  font-size: 20px;
}

.video-list p {
  margin: 12px 0;
  padding: 10px;
  background: rgba(0, 0, 0, 0.5);
  border-left: 4px solid #00ffff;
  font-size: 14px;
}

.info-panel {
  background: rgba(20, 20, 40, 0.8);
  border: 3px solid #00ffff;
  padding: 20px;
  margin-bottom: 20px;
}

.info-panel h3 {
  color: #00ffff;
  margin-top: 0;
}

.tracking-bar {
  color: #00ff00;
  letter-spacing: 2px;
}

.rec-indicator {
  color: #ff0000;
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  50% { opacity: 0; }
}

.controls {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.vhs-btn {
  background: #333333;
  color: #ffffff;
  border: 2px solid #666666;
  padding: 15px 25px;
  font-size: 20px;
  cursor: pointer;
  font-family: inherit;
  box-shadow: 0 4px 0 #111111;
  transition: all 0.1s;
}

.vhs-btn:hover {
  background: #555555;
  transform: translateY(2px);
  box-shadow: 0 2px 0 #111111;
}`,
  js: `function updateTimestamp() {
  const now = new Date();
  const timestamp = document.querySelector('.timestamp');
  if (timestamp) {
    const formatted = now.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    timestamp.textContent = 'REC ● ' + formatted;
  }
}

setInterval(updateTimestamp, 1000);
updateTimestamp();

console.log('📼 VHS system initialized');`,
};

const vaporwaveTemplate: Template = {
  id: 'vaporwave',
  name: '🌴 Vaporwave',
  description: 'A E S T H E T I C vibes',
  color: '#ff71ce',
  html: `<!DOCTYPE html>
<html>
<head>
  <title>🌴 Ａ Ｅ Ｓ Ｔ Ｈ Ｅ Ｔ Ｉ Ｃ 🌴</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    <h1 class="aesthetic-title">Ａ Ｅ Ｓ Ｔ Ｈ Ｅ Ｔ Ｉ Ｃ</h1>
    <div class="grid-container">
      <div class="content-card">
        <h2>🌸 ＷＥＬＣＯＭＥ 🌸</h2>
        <p>ｅｎｊｏｙ ｙｏｕｒ ｓｔａｙ</p>
        <p>ｉｎ ｔｈｅ ｄｉｇｉｔａｌ ｐａｒａｄｉｓｅ</p>
      </div>
      <div class="content-card">
        <h2>🌊 ＶＩＢＥＳ 🌊</h2>
        <ul class="vibe-list">
          <li>☁️ Ｃｈｉｌｌ</li>
          <li>🌙 Ｒｅｌａｘ</li>
          <li>✨ Ｄｒｅａｍ</li>
          <li>🎵 Ｍｕｓｉｃ</li>
        </ul>
      </div>
    </div>
    <div class="statue-section">
      <p class="aesthetic-text">リラックス</p>
      <p class="time" id="time">00:00:00</p>
    </div>
    <div class="footer">
      <p><img src="https://xsuxxzzsqfvyvqyxswme.supabase.co/storage/v1/object/public/retro-gifs/animations/welcome-vaporwave.gif" alt="Welcome" width="200"></p>
      <p>🌴 Ｅｓｔ． １９８５ 🌴</p>
      <p><img src="https://xsuxxzzsqfvyvqyxswme.supabase.co/storage/v1/object/public/retro-gifs/decorations/flower-vaporwave.gif" alt="Flower" width="50"></p>
    </div>
  </div>
</body>
</html>`,
  css: `body {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%);
  background-size: 400% 400%;
  animation: gradient-shift 15s ease infinite;
  color: #ffffff;
  font-family: 'Arial', sans-serif;
  padding: 20px;
  margin: 0;
  min-height: 100vh;
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.container {
  max-width: 900px;
  margin: 0 auto;
}

.aesthetic-title {
  text-align: center;
  font-size: 48px;
  letter-spacing: 8px;
  text-shadow: 
    0 0 10px #ff71ce,
    0 0 20px #ff71ce,
    0 0 30px #01cdfe,
    0 0 40px #01cdfe,
    4px 4px 0px rgba(0, 0, 0, 0.3);
  margin: 40px 0;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
}

.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.content-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.content-card h2 {
  color: #ff71ce;
  text-align: center;
  font-size: 24px;
  margin-top: 0;
  text-shadow: 0 0 10px #ff71ce;
}

.content-card p {
  text-align: center;
  font-size: 16px;
  letter-spacing: 2px;
  margin: 10px 0;
}

.vibe-list {
  list-style: none;
  padding: 0;
  text-align: center;
}

.vibe-list li {
  margin: 12px 0;
  font-size: 18px;
  letter-spacing: 3px;
  text-shadow: 0 0 5px #01cdfe;
}

.statue-section {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 15px;
  padding: 40px;
  text-align: center;
  margin-bottom: 30px;
}

.aesthetic-text {
  font-size: 36px;
  color: #ff71ce;
  text-shadow: 0 0 20px #ff71ce;
  margin: 0 0 20px 0;
}

.time {
  font-size: 28px;
  color: #01cdfe;
  text-shadow: 0 0 10px #01cdfe;
  font-family: 'Courier New', monospace;
  letter-spacing: 4px;
}

.footer {
  text-align: center;
  font-size: 20px;
  letter-spacing: 4px;
  text-shadow: 0 0 10px #ffffff;
}`,
  js: `function updateTime() {
  const now = new Date();
  const timeEl = document.getElementById('time');
  if (timeEl) {
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    timeEl.textContent = hours + ':' + minutes + ':' + seconds;
  }
}

setInterval(updateTime, 1000);
updateTime();

console.log('🌴 Ａ Ｅ Ｓ Ｔ Ｈ Ｅ Ｔ Ｉ Ｃ loaded');`,
};

const windows95Template: Template = {
  id: 'windows-95',
  name: '🪟 Windows 95',
  description: 'Classic desktop nostalgia',
  color: '#008080',
  html: `<!DOCTYPE html>
<html>
<head>
  <title>My Computer</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="desktop">
    <div class="window">
      <div class="title-bar">
        <span class="title-text">📁 My Computer</span>
        <div class="title-buttons">
          <button class="title-btn">_</button>
          <button class="title-btn">□</button>
          <button class="title-btn">✕</button>
        </div>
      </div>
      <div class="menu-bar">
        <span>File</span>
        <span>Edit</span>
        <span>View</span>
        <span>Help</span>
      </div>
      <div class="toolbar">
        <button class="tool-btn">◀</button>
        <button class="tool-btn">▶</button>
        <button class="tool-btn">🔼</button>
        <button class="tool-btn">✂️</button>
        <button class="tool-btn">📋</button>
      </div>
      <div class="window-content">
        <div class="icon-grid">
          <div class="desktop-icon">
            <div class="icon">💾</div>
            <div class="icon-label">My Documents</div>
          </div>
          <div class="desktop-icon">
            <div class="icon">🖥️</div>
            <div class="icon-label">My Computer</div>
          </div>
          <div class="desktop-icon">
            <div class="icon">🌐</div>
            <div class="icon-label">Internet</div>
          </div>
          <div class="desktop-icon">
            <div class="icon">📁</div>
            <div class="icon-label">Projects</div>
          </div>
          <div class="desktop-icon">
            <div class="icon">🗑️</div>
            <div class="icon-label">Recycle Bin</div>
          </div>
        </div>
        <div style="text-align: center; margin-top: 20px;">
          <img src="https://xsuxxzzsqfvyvqyxswme.supabase.co/storage/v1/object/public/retro-gifs/animations/loading-windowstheme.gif" alt="Loading" width="40">
        </div>
      </div>
      <div class="status-bar">
        <span>5 object(s)</span>
        <span>My Computer</span>
      </div>
    </div>
  </div>
  <div class="taskbar">
    <button class="start-button">
      <span class="start-icon">🪟</span>
      <span>Start</span>
    </button>
    <div class="taskbar-items">
      <div class="taskbar-item active">📁 My Computer</div>
    </div>
    <div class="system-tray">
      <span id="clock">12:00 PM</span>
    </div>
  </div>
</body>
</html>`,
  css: `body {
  background: #008080;
  margin: 0;
  padding: 0;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  min-height: 100vh;
}

.desktop {
  height: calc(100vh - 28px);
  padding: 20px;
}

.window {
  background: #c0c0c0;
  border: 2px solid;
  border-color: #ffffff #000000 #000000 #ffffff;
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);
  max-width: 600px;
  margin: 0 auto;
}

.title-bar {
  background: linear-gradient(90deg, #000080, #1084d0);
  color: #ffffff;
  padding: 3px 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}

.title-buttons {
  display: flex;
  gap: 2px;
}

.title-btn {
  background: #c0c0c0;
  border: 1px solid;
  border-color: #ffffff #000000 #000000 #ffffff;
  width: 16px;
  height: 14px;
  font-size: 10px;
  padding: 0;
  cursor: pointer;
}

.title-btn:active {
  border-color: #000000 #ffffff #ffffff #000000;
}

.menu-bar {
  background: #c0c0c0;
  padding: 3px 5px;
  border-bottom: 1px solid #808080;
}

.menu-bar span {
  padding: 3px 8px;
  cursor: pointer;
}

.menu-bar span:hover {
  background: #000080;
  color: #ffffff;
}

.toolbar {
  background: #c0c0c0;
  padding: 5px;
  border-bottom: 1px solid #808080;
  display: flex;
  gap: 3px;
}

.tool-btn {
  background: #c0c0c0;
  border: 2px solid;
  border-color: #ffffff #000000 #000000 #ffffff;
  padding: 3px 8px;
  cursor: pointer;
}

.tool-btn:active {
  border-color: #000000 #ffffff #ffffff #000000;
}

.window-content {
  background: #ffffff;
  padding: 20px;
  min-height: 300px;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 80px);
  gap: 20px;
}

.desktop-icon {
  text-align: center;
  cursor: pointer;
  padding: 5px;
}

.desktop-icon:hover {
  background: rgba(0, 0, 128, 0.1);
}

.icon {
  font-size: 32px;
  margin-bottom: 5px;
}

.icon-label {
  font-size: 11px;
  word-wrap: break-word;
}

.status-bar {
  background: #c0c0c0;
  border-top: 1px solid #ffffff;
  padding: 3px 5px;
  display: flex;
  justify-content: space-between;
  font-size: 10px;
}

.taskbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 28px;
  background: #c0c0c0;
  border-top: 2px solid #ffffff;
  display: flex;
  align-items: center;
  padding: 2px;
}

.start-button {
  background: #c0c0c0;
  border: 2px solid;
  border-color: #ffffff #000000 #000000 #ffffff;
  padding: 2px 5px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}

.start-button:active {
  border-color: #000000 #ffffff #ffffff #000000;
}

.start-icon {
  font-size: 16px;
}

.taskbar-items {
  flex: 1;
  display: flex;
  gap: 2px;
  margin-left: 5px;
}

.taskbar-item {
  background: #c0c0c0;
  border: 2px solid;
  border-color: #000000 #ffffff #ffffff #000000;
  padding: 3px 8px;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.taskbar-item.active {
  border-color: #ffffff #000000 #000000 #ffffff;
}

.system-tray {
  border-left: 1px solid #808080;
  padding: 0 8px;
  display: flex;
  align-items: center;
}`,
  js: `function updateClock() {
  const now = new Date();
  const clockEl = document.getElementById('clock');
  if (clockEl) {
    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    clockEl.textContent = displayHours + ':' + minutes + ' ' + ampm;
  }
}

setInterval(updateClock, 1000);
updateClock();

console.log('Windows 95 system loaded');`,
};

export const templates: Record<string, Template> = {
  'blank': blankTemplate,
  'geocities-chaos': geocitiesTemplate,
  'neon-cyber-2001': cyberTemplate,
  'pixel-arcade': pixelArcadeTemplate,
  'vhs-glitch': vhsGlitchTemplate,
  'vaporwave': vaporwaveTemplate,
  'windows-95': windows95Template,
};

export function getTemplate(id: string): Template | null {
  return templates[id] || templates['blank'] || null;
}

export function getTemplateIds(): string[] {
  return Object.keys(templates);
}
