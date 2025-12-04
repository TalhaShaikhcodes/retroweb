'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { templates as templateData } from '@/lib/templates';

const templates = [
  { id: 'geocities-chaos', name: '🌈 Geocities Chaos', description: 'Maximum 90s homepage energy', color: '#ff00ff' },
  { id: 'neon-cyber-2001', name: '💻 Neon Cyber', description: 'Matrix hacker aesthetic', color: '#00ff00' },
  { id: 'pixel-arcade', name: '🎮 Pixel Arcade', description: '8-bit retro gaming', color: '#ff6600' },
  { id: 'vhs-glitch', name: '📼 VHS Glitch', description: 'Analog tracking errors', color: '#ff00ff' },
  { id: 'vaporwave', name: '🌴 Vaporwave', description: 'A E S T H E T I C dreamscape', color: '#ff69b4' },
  { id: 'windows-95', name: '🖥️ Windows 95', description: 'Classic desktop nostalgia', color: '#c0c0c0' },
];

function getTemplatePreview(themeId: string): string {
  // Get the actual template data and extract body content
  const template = templateData[themeId];
  if (template) {
    // Extract content between <body> tags
    const bodyMatch = template.html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    if (bodyMatch) {
      return bodyMatch[1];
    }
  }
  
  // Fallback to old previews if template not found
  const previews: Record<string, string> = {
    'geocities-chaos': `
      <center>
        <img src="https://web.archive.org/web/20091027053802/http://geocities.com/heartland/hills/9154/construction.gif" alt="Under Construction" width="100">
        <h1 style="background: linear-gradient(to right, red, orange, yellow, green, blue, violet); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 42px; margin: 20px 0;">🎉 WELCOME TO MY HOMEPAGE! 🎉</h1>
        <div style="background: #ffff00; padding: 10px; border: 3px ridge #ff00ff; font-weight: bold; margin: 20px 0;"><marquee>★ Welcome to my awesome page! ★ Sign my guestbook! ★ Check out my cool links! ★</marquee></div>
        
        <table border="0" cellpadding="5" width="90%" style="margin: 20px auto;">
          <tr>
            <td align="center"><a href="#home" style="color: #0000ff; font-size: 18px; text-decoration: underline;">🏠 HOME</a></td>
            <td align="center"><a href="#about" style="color: #0000ff; font-size: 18px; text-decoration: underline;">📝 ABOUT</a></td>
            <td align="center"><a href="#links" style="color: #0000ff; font-size: 18px; text-decoration: underline;">🔗 LINKS</a></td>
            <td align="center"><a href="#guestbook" style="color: #0000ff; font-size: 18px; text-decoration: underline;">📖 GUESTBOOK</a></td>
          </tr>
        </table>
        
        <hr width="80%" size="5" color="#ff00ff">
        
        <table border="3" cellpadding="15" bgcolor="#ffff00" width="80%" style="margin: 20px auto;">
          <tr><td>
            <h2 style="color: #ff0000;">📝 About Me</h2>
            <p><font color="red" size="4"><b>Hi! I'm a webmaster and this is my personal homepage!</b></font></p>
            <p><font size="3">I love making websites, collecting animated GIFs, and surfing the information superhighway! This site is best viewed in Netscape Navigator 4.0 at 800x600 resolution.</font></p>
            <p><font color="blue" size="3">My hobbies include: HTML coding, GIF hunting, and chatting on IRC!</font></p>
          </td></tr>
        </table>
        
        <table border="3" cellpadding="15" bgcolor="#00ffff" width="80%" style="margin: 20px auto;">
          <tr><td>
            <h2 style="color: #0000ff;">🔥 COOL STUFF</h2>
            <ul align="left">
              <li><font size="3">My favorite bands</font></li>
              <li><font size="3">Cool websites I found</font></li>
              <li><font size="3">My pet hamster photos</font></li>
              <li><font size="3">Download my screensavers!</font></li>
            </ul>
          </td></tr>
        </table>
        
        <p><img src="https://web.archive.org/web/20091027053802/http://geocities.com/heartland/hills/9154/email.gif" alt="Email" width="30"> <a href="mailto:webmaster@example.com" style="color: #0000ff;">Email me!</a></p>
        
        <hr width="80%" size="3" color="#00ff00">
        
        <p><font size="2">You are visitor number: <b style="background: #000; color: #0f0; padding: 2px 8px; font-family: monospace;">000042</font></p>
        <p><font size="1" color="#808080">Last updated: Never | © 1999 | Best viewed in Netscape Navigator 4.0</font></p>
      </center>
    `,
    'neon-cyber-2001': `
      <div style="max-width: 900px; margin: 0 auto; padding: 20px;">
        <pre style="color: #00ff00; font-size: 10px; text-align: center; line-height: 1.2;">
 ██████╗██╗   ██╗██████╗ ███████╗██████╗ 
██╔════╝╚██╗ ██╔╝██╔══██╗██╔════╝██╔══██╗
██║      ╚████╔╝ ██████╔╝█████╗  ██████╔╝
██║       ╚██╔╝  ██╔══██╗██╔══╝  ██╔══██╗
╚██████╗   ██║   ██████╔╝███████╗██║  ██║
 ╚═════╝   ╚═╝   ╚═════╝ ╚══════╝╚═╝  ╚═╝
        </pre>
        <h1 style="text-align: center; font-size: 36px; color: #00ff00; margin: 20px 0;">[ ACCESS GRANTED ]</h1>
        
        <div style="border: 1px solid #00ff00; padding: 15px; margin: 20px 0;">
          <p style="text-align: center; color: #00ff00;">&gt;&gt; NAVIGATION &lt;&lt;</p>
          <p style="text-align: center;">
            <a href="#home" style="color: #00ff00; margin: 0 15px; text-decoration: none; border: 1px solid #00ff00; padding: 5px 15px; display: inline-block;">[HOME]</a>
            <a href="#about" style="color: #00ff00; margin: 0 15px; text-decoration: none; border: 1px solid #00ff00; padding: 5px 15px; display: inline-block;">[ABOUT]</a>
            <a href="#projects" style="color: #00ff00; margin: 0 15px; text-decoration: none; border: 1px solid #00ff00; padding: 5px 15px; display: inline-block;">[PROJECTS]</a>
            <a href="#contact" style="color: #00ff00; margin: 0 15px; text-decoration: none; border: 1px solid #00ff00; padding: 5px 15px; display: inline-block;">[CONTACT]</a>
          </p>
        </div>
        
        <div style="background: rgba(0, 20, 0, 0.8); border: 2px solid #00ff00; padding: 25px; box-shadow: 0 0 20px rgba(0, 255, 0, 0.3); margin: 20px 0;">
          <p><span style="color: #00ff00; font-weight: bold;">root@cyberspace:~$</span> cat welcome.txt</p>
          <p style="color: #00cc00; margin: 10px 0;">Welcome to the mainframe...</p>
          <p style="color: #00cc00; margin: 10px 0;">System status: ONLINE</p>
          <p style="color: #00cc00; margin: 10px 0;">Security level: MAXIMUM</p>
          <p style="color: #00cc00; margin: 10px 0;">Authorized users only. All activity is monitored.</p>
          <p style="margin-top: 20px;"><span style="color: #00ff00; font-weight: bold;">root@cyberspace:~$</span> ls -la</p>
          <p style="color: #00cc00; margin: 5px 0;">drwxr-xr-x  5 root root 4096 Jan 01 00:00 projects/</p>
          <p style="color: #00cc00; margin: 5px 0;">drwxr-xr-x  3 root root 4096 Jan 01 00:00 data/</p>
          <p style="color: #00cc00; margin: 5px 0;">-rw-r--r--  1 root root  256 Jan 01 00:00 readme.txt</p>
          <p style="margin-top: 20px;"><span style="color: #00ff00; font-weight: bold;">root@cyberspace:~$</span> <span style="animation: blink 1s step-end infinite;">_</span></p>
        </div>
        
        <div style="border: 1px solid #00ff00; padding: 20px; margin: 20px 0;">
          <h2 style="color: #00ff00; text-align: center;">&gt;&gt; SYSTEM INFO &lt;&lt;</h2>
          <p style="color: #00cc00;">CONNECTION: SECURE</p>
          <p style="color: #00cc00;">UPTIME: 99.9%</p>
          <p style="color: #00cc00;">ENCRYPTION: AES-256</p>
          <p style="color: #00cc00;">STATUS: ALL SYSTEMS OPERATIONAL</p>
        </div>
        
        <p style="text-align: center; color: #00cc00; font-size: 12px; margin-top: 40px;">[ CONNECTION SECURE ] | UPTIME: 00:00:00</p>
      </div>
    `,
    'pixel-arcade': `
      <div style="text-align: center; padding: 20px;">
        <h1 style="font-family: 'Courier New', monospace; color: #ff00ff; font-size: 36px; text-shadow: 4px 4px #000;">🎮 PIXEL ARCADE 🎮</h1>
        <p style="font-family: 'Courier New', monospace; color: #ffff00; font-size: 14px;">EST. 1985 - RETRO GAMING PARADISE</p>
        
        <div style="background: #000000; border: 4px solid #ff00ff; padding: 25px; display: inline-block; margin: 20px 0; box-shadow: 0 0 20px #ff00ff;">
          <p style="font-family: 'Courier New', monospace; color: #00ff00; font-size: 28px; margin: 15px 0;">█ █ █ GAME START █ █ █</p>
          <p style="font-family: 'Courier New', monospace; color: #ffff00; font-size: 18px; margin: 10px 0;">SCORE: 9999</p>
          <p style="font-family: 'Courier New', monospace; color: #ff0000; font-size: 18px; margin: 10px 0;">LIVES: ♥ ♥ ♥</p>
          <p style="font-family: 'Courier New', monospace; color: #00ffff; font-size: 18px; margin: 10px 0;">LEVEL: 01</p>
          <div style="border: 2px solid #ffffff; padding: 20px; margin: 20px 0;">
            <p style="font-family: 'Courier New', monospace; color: #ffffff; font-size: 14px;">████████████████████</p>
            <p style="font-family: 'Courier New', monospace; color: #ffffff; font-size: 14px;">█░░░░░░░░░░░░░░░░░░█</p>
            <p style="font-family: 'Courier New', monospace; color: #ffffff; font-size: 14px;">█░░░░░▲░░░░░░░░░░░█</p>
            <p style="font-family: 'Courier New', monospace; color: #ffffff; font-size: 14px;">█░░░░░░░░░░●░░░░░░█</p>
            <p style="font-family: 'Courier New', monospace; color: #ffffff; font-size: 14px;">████████████████████</p>
          </div>
        </div>
        
        <div style="margin: 30px 0;">
          <p style="font-family: 'Courier New', monospace; color: #ff00ff; font-size: 20px; margin: 10px 0;">▼ GAME MENU ▼</p>
          <p style="font-family: 'Courier New', monospace; color: #00ff00; font-size: 16px; margin: 8px 0;">[1] NEW GAME</p>
          <p style="font-family: 'Courier New', monospace; color: #00ff00; font-size: 16px; margin: 8px 0;">[2] HIGH SCORES</p>
          <p style="font-family: 'Courier New', monospace; color: #00ff00; font-size: 16px; margin: 8px 0;">[3] OPTIONS</p>
          <p style="font-family: 'Courier New', monospace; color: #00ff00; font-size: 16px; margin: 8px 0;">[4] CREDITS</p>
        </div>
        
        <div style="background: #000000; border: 2px solid #ffff00; padding: 15px; display: inline-block; margin: 20px 0;">
          <p style="font-family: 'Courier New', monospace; color: #ffff00; font-size: 14px;">HIGH SCORES</p>
          <p style="font-family: 'Courier New', monospace; color: #ffffff; font-size: 12px; margin: 5px 0;">1. AAA ... 99999</p>
          <p style="font-family: 'Courier New', monospace; color: #ffffff; font-size: 12px; margin: 5px 0;">2. BBB ... 88888</p>
          <p style="font-family: 'Courier New', monospace; color: #ffffff; font-size: 12px; margin: 5px 0;">3. CCC ... 77777</p>
        </div>
        
        <p style="font-family: 'Courier New', monospace; color: #00ffff; font-size: 18px; margin-top: 30px;">INSERT COIN TO CONTINUE</p>
        <p style="font-family: 'Courier New', monospace; color: #808080; font-size: 12px; margin-top: 20px;">© 1985 PIXEL ARCADE INC.</p>
      </div>
    `,
    'vhs-glitch': `
      <div style="position: relative; padding: 20px;">
        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: repeating-linear-gradient(0deg, rgba(255,255,255,0.03), rgba(255,255,255,0.03) 2px, transparent 2px, transparent 4px); pointer-events: none;"></div>
        
        <div style="text-align: center; margin: 20px 0;">
          <h1 style="font-family: Arial; color: #ff00ff; text-shadow: 3px 0 #00ffff, -3px 0 #ff0000; font-size: 42px;">📼 VHS MEMORIES 📼</h1>
          <p style="color: #ffffff; font-family: Arial; font-size: 16px; text-shadow: 1px 0 #00ffff, -1px 0 #ff0000;">REWIND • PLAY • FAST FORWARD</p>
        </div>
        
        <div style="background: rgba(0,0,0,0.9); border: 3px solid #808080; padding: 25px; margin: 20px auto; max-width: 700px; box-shadow: 0 0 30px rgba(255,0,255,0.3);">
          <div style="border-bottom: 2px solid #404040; padding-bottom: 15px; margin-bottom: 15px;">
            <p style="color: #ffffff; font-family: Arial; font-size: 14px; margin: 5px 0;">TRACKING: ▓▓▓▓▓▓▓░░░</p>
            <p style="color: #ff00ff; font-family: Arial; font-size: 14px; margin: 5px 0;">REC ● 12:00:00</p>
            <p style="color: #00ffff; font-family: Arial; font-size: 14px; margin: 5px 0;">PLAY ▶ | PAUSE ⏸ | STOP ⏹</p>
          </div>
          
          <div style="padding: 20px; background: rgba(255,255,255,0.05);">
            <h2 style="color: #ff00ff; font-family: Arial; text-shadow: 2px 0 #00ffff, -2px 0 #ff0000;">NOW PLAYING</h2>
            <p style="color: #ffffff; font-family: Arial; margin: 10px 0;">Title: Summer Vacation 1995</p>
            <p style="color: #ffffff; font-family: Arial; margin: 10px 0;">Duration: 02:34:56</p>
            <p style="color: #ffffff; font-family: Arial; margin: 10px 0;">Quality: SP Mode</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; border: 1px solid #404040;">
            <p style="color: #00ffff; font-family: Arial; font-size: 12px; margin: 5px 0;">▶ HOME VIDEOS</p>
            <p style="color: #808080; font-family: Arial; font-size: 12px; margin: 5px 0;">  Birthday Party 1994</p>
            <p style="color: #808080; font-family: Arial; font-size: 12px; margin: 5px 0;">  Christmas Morning 1993</p>
            <p style="color: #808080; font-family: Arial; font-size: 12px; margin: 5px 0;">  Beach Trip 1992</p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #808080; font-family: Arial; font-size: 12px;">⚠ PLEASE BE KIND, REWIND ⚠</p>
          <p style="color: #606060; font-family: Arial; font-size: 10px; margin-top: 10px;">Recorded in EP mode | Dolby Stereo</p>
        </div>
      </div>
    `,
    'vaporwave': `
      <div style="background: linear-gradient(180deg, #ff6ec7 0%, #7873f5 50%, #4facfe 100%); padding: 40px 20px; min-height: 600px;">
        <div style="text-align: center;">
          <h1 style="font-size: 56px; color: #ffffff; text-shadow: 0 0 10px #ff00ff, 0 0 20px #ff00ff, 3px 3px 0 #00ffff; letter-spacing: 15px; margin: 30px 0;">Ａ Ｅ Ｓ Ｔ Ｈ Ｅ Ｔ Ｉ Ｃ</h1>
          <h2 style="font-size: 24px; color: #ffff00; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); margin: 20px 0;">リラックス • 夢 • 未来</h2>
        </div>
        
        <div style="background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); border: 2px solid rgba(255, 255, 255, 0.3); border-radius: 15px; padding: 40px; margin: 30px auto; max-width: 600px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);">
          <p style="color: #ffffff; font-size: 20px; line-height: 1.8; margin: 15px 0;">Welcome to the digital paradise...</p>
          <p style="color: #ffffff; font-size: 18px; line-height: 1.8; margin: 15px 0;">Where dreams meet reality in perfect harmony.</p>
          <p style="color: #ffff00; font-size: 16px; line-height: 1.8; margin: 15px 0;">Relax. Enjoy. Feel the vibes.</p>
        </div>
        
        <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; margin: 40px 0;">
          <div style="background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); border: 2px solid rgba(255, 255, 255, 0.3); border-radius: 10px; padding: 25px; text-align: center; min-width: 150px;">
            <div style="font-size: 40px; margin-bottom: 10px;">🌴</div>
            <p style="color: #ffffff; font-size: 16px;">Home</p>
          </div>
          <div style="background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); border: 2px solid rgba(255, 255, 255, 0.3); border-radius: 10px; padding: 25px; text-align: center; min-width: 150px;">
            <div style="font-size: 40px; margin-bottom: 10px;">💎</div>
            <p style="color: #ffffff; font-size: 16px;">About</p>
          </div>
          <div style="background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); border: 2px solid rgba(255, 255, 255, 0.3); border-radius: 10px; padding: 25px; text-align: center; min-width: 150px;">
            <div style="font-size: 40px; margin-bottom: 10px;">🌊</div>
            <p style="color: #ffffff; font-size: 16px;">Gallery</p>
          </div>
          <div style="background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); border: 2px solid rgba(255, 255, 255, 0.3); border-radius: 10px; padding: 25px; text-align: center; min-width: 150px;">
            <div style="font-size: 40px; margin-bottom: 10px;">✨</div>
            <p style="color: #ffffff; font-size: 16px;">Contact</p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 50px;">
          <p style="color: rgba(255, 255, 255, 0.8); font-size: 14px;">© 1995-2024 • Forever in the moment</p>
          <p style="color: rgba(255, 255, 255, 0.6); font-size: 12px; margin-top: 10px;">夢の中で会いましょう</p>
        </div>
      </div>
    `,
    'windows-95': `
      <div style="background: #008080; padding: 20px; min-height: 600px;">
        <div style="background: #c0c0c0; box-shadow: inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf; max-width: 800px; margin: 0 auto;">
          <div style="background: linear-gradient(90deg, #000080, #1084d0); padding: 3px 5px; display: flex; justify-content: space-between; align-items: center;">
            <span style="color: white; font-weight: bold; font-family: 'MS Sans Serif', Arial; font-size: 11px;">Welcome - Microsoft Internet Explorer</span>
            <div style="display: flex; gap: 2px;">
              <button style="width: 16px; height: 14px; background: #c0c0c0; border: none; box-shadow: inset -1px -1px #0a0a0a, inset 1px 1px #ffffff;">_</button>
              <button style="width: 16px; height: 14px; background: #c0c0c0; border: none; box-shadow: inset -1px -1px #0a0a0a, inset 1px 1px #ffffff;">□</button>
              <button style="width: 16px; height: 14px; background: #c0c0c0; border: none; box-shadow: inset -1px -1px #0a0a0a, inset 1px 1px #ffffff;">×</button>
            </div>
          </div>
          
          <div style="background: #ffffff; padding: 25px; font-family: 'MS Sans Serif', Arial; font-size: 11px;">
            <h1 style="font-size: 20px; margin: 10px 0; color: #000080;">Welcome to My Website</h1>
            <p style="margin: 15px 0;">You are now browsing the World Wide Web using Microsoft Internet Explorer!</p>
            
            <fieldset style="border: 2px groove #c0c0c0; padding: 15px; margin: 20px 0;">
              <legend style="font-weight: bold; padding: 0 5px;">Navigation</legend>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li style="margin: 5px 0;"><a href="#home" style="color: #0000ff; text-decoration: underline;">Home</a></li>
                <li style="margin: 5px 0;"><a href="#about" style="color: #0000ff; text-decoration: underline;">About Me</a></li>
                <li style="margin: 5px 0;"><a href="#projects" style="color: #0000ff; text-decoration: underline;">My Projects</a></li>
                <li style="margin: 5px 0;"><a href="#links" style="color: #0000ff; text-decoration: underline;">Favorite Links</a></li>
              </ul>
            </fieldset>
            
            <fieldset style="border: 2px groove #c0c0c0; padding: 15px; margin: 20px 0;">
              <legend style="font-weight: bold; padding: 0 5px;">About This Site</legend>
              <p style="margin: 10px 0;">This website was created using Microsoft FrontPage 98.</p>
              <p style="margin: 10px 0;">Best viewed with Internet Explorer 4.0 or higher.</p>
              <p style="margin: 10px 0;">Screen resolution: 800x600 or higher recommended.</p>
              <p style="margin: 10px 0;">Last updated: January 1, 1999</p>
            </fieldset>
            
            <fieldset style="border: 2px groove #c0c0c0; padding: 15px; margin: 20px 0;">
              <legend style="font-weight: bold; padding: 0 5px;">System Information</legend>
              <table style="width: 100%; font-size: 11px;">
                <tr><td style="padding: 3px;">Operating System:</td><td style="padding: 3px;"><b>Windows 95</b></td></tr>
                <tr><td style="padding: 3px;">Browser:</td><td style="padding: 3px;"><b>Internet Explorer 4.0</b></td></tr>
                <tr><td style="padding: 3px;">Resolution:</td><td style="padding: 3px;"><b>800 x 600</b></td></tr>
              </table>
            </fieldset>
          </div>
          
          <div style="display: flex; gap: 1px; background: #c0c0c0; padding: 2px;">
            <div style="box-shadow: inset -1px -1px #dfdfdf, inset 1px 1px #808080; padding: 2px 5px; flex: 1; font-family: 'MS Sans Serif', Arial; font-size: 11px;">Ready</div>
            <div style="box-shadow: inset -1px -1px #dfdfdf, inset 1px 1px #808080; padding: 2px 5px; font-family: 'MS Sans Serif', Arial; font-size: 11px;">Visitors: 1337</div>
          </div>
        </div>
      </div>
    `,
  };
  return previews[themeId] || '<h1>Preview not available</h1>';
}

function getTemplateStyles(themeId: string): string {
  // Get the actual template CSS
  const template = templateData[themeId];
  if (template) {
    return template.css;
  }
  
  // Fallback to old styles if template not found
  const styles: Record<string, string> = {
    'geocities-chaos': 'body { background: #ffffff; font-family: "Comic Sans MS", cursive; padding: 20px; } marquee { display: block; }',
    'neon-cyber-2001': 'body { background: #000000; color: #00ff00; font-family: "Courier New", monospace; padding: 20px; text-shadow: 0 0 5px #00ff00; } @keyframes blink { 50% { opacity: 0; } }',
    'pixel-arcade': 'body { background: #1a1a2e; color: #ffffff; font-family: "Courier New", monospace; padding: 20px; image-rendering: pixelated; }',
    'vhs-glitch': 'body { background: #000000; color: #ffffff; font-family: Arial; padding: 0; margin: 0; }',
    'vaporwave': 'body { margin: 0; padding: 0; font-family: Arial; }',
    'windows-95': 'body { margin: 0; padding: 0; font-family: "MS Sans Serif", Arial; font-size: 11px; }',
  };
  return styles[themeId] || 'body { margin: 20px; }';
}

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<typeof templates[0] | null>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);

  const handleCreate = async (templateId?: string, templateName?: string) => {
    // Check if user is authenticated
    if (!user) {
      // Save prompt to sessionStorage so we can use it after login
      if (prompt) {
        sessionStorage.setItem('pendingPrompt', prompt);
      }
      router.push('/login');
      return;
    }
    
    setIsCreating(true);
    try {
      // Use template name if provided, otherwise use prompt or default
      const projectName = templateName || prompt || 'My Retro Website';
      
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: projectName,
          template: templateId || 'blank',
          theme: templateId || 'geocities-chaos', // Set theme to match template
          initialPrompt: prompt,
        }),
      });
      
      if (res.ok) {
        const data = await res.json();
        // API returns { project: {...} }
        // Store prompt in sessionStorage to pass to builder
        if (prompt && !templateId) {
          sessionStorage.setItem('builderInitialPrompt', prompt);
        }
        router.push(`/builder/${data.project.id}`);
      } else {
        const error = await res.json();
        // Check if it's a project limit error
        if (error.error && error.error.includes('Maximum of 3 projects')) {
          setShowLimitModal(true);
        } else {
          console.error('Failed to create project:', error);
        }
      }
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="retro-landing">
      {/* Starfield background */}
      <div className="stars-bg" />
      
      {/* Navbar */}
      <nav className="retro-navbar">
        <table width="100%" cellPadding={0} cellSpacing={0}>
          <tbody>
            <tr>
              <td className="nav-left">
                <span className="logo-text">
                  <span className="rainbow-text">⭐ RetroWeb Builder ⭐</span>
                </span>
              </td>
              <td className="nav-right">
                {loading ? (
                  <span className="blink">Loading...</span>
                ) : user ? (
                  <>
                    <Link href="/dashboard" className="nav-link">📁 My Sites</Link>
                    <span className="nav-separator">|</span>
                    <span className="nav-user">👤 {user.email?.split('@')[0]}</span>
                  </>
                ) : (
                  <div className="nav-buttons">
                    <Link href="/login" className="nav-btn login-btn">
                      <span className="btn-icon">🔑</span>
                      <span className="btn-text">Login</span>
                    </Link>
                    <Link href="/signup" className="nav-btn signup-btn">
                      <span className="btn-icon">✨</span>
                      <span className="btn-text">Sign Up FREE!</span>
                    </Link>
                  </div>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </nav>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="hero-section">
          <table width="100%" cellPadding={10} cellSpacing={0} className="hero-table">
            <tbody>
              <tr>
                <td colSpan={3} align="center">
                  <div className="construction-gif">🚧</div>
                  <h1 className="hero-title">
                    <span className="rainbow-animated">Build Your Own</span>
                    <br />
                    <span className="glow-text">90s Website!</span>
                  </h1>
                  <p className="hero-subtitle">
                    <span className="marquee-text">
                      ★ No coding required! ★ AI-powered! ★ Totally radical! ★ Free to use! ★
                    </span>
                  </p>
                </td>
              </tr>
              <tr>
                <td colSpan={3} align="center">
                  <div className="prompt-container">
                    <table className="prompt-table" cellPadding={0} cellSpacing={0}>
                      <tbody>
                        <tr>
                          <td className="prompt-cell">
                            <input
                              type="text"
                              value={prompt}
                              onChange={(e) => setPrompt(e.target.value)}
                              placeholder="Describe your dream 90s website..."
                              className="retro-input"
                              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                            />
                          </td>
                          <td className="button-cell">
                            <button
                              onClick={() => handleCreate()}
                              disabled={isCreating}
                              className="retro-button create-btn"
                            >
                              {isCreating ? '⏳ Creating...' : '🚀 Create My Site!'}
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Chrome Extension Promo */}
        <section className="extension-promo">
          <div className="extension-banner">
            <div className="extension-content">
              <div className="extension-icon">🌐</div>
              <div className="extension-text">
                <h3 className="extension-title">
                  <span className="blink">NEW!</span> RetroWeb Chrome Extension
                </h3>
                <p className="extension-desc">Transform ANY website into a 90s masterpiece instantly!</p>
              </div>
              <a 
                href="https://chrome.google.com/webstore/detail/retroweb-extension/PLACEHOLDER_ID" 
                target="_blank" 
                rel="noopener noreferrer"
                className="extension-btn"
              >
                <span className="chrome-icon">🔌</span>
                <span>Add to Chrome - FREE!</span>
              </a>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="retro-divider">
          <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="" className="divider-line" />
          <span>✦ OR START FROM A TEMPLATE ✦</span>
          <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="" className="divider-line" />
        </div>

        {/* Templates Section */}
        <section className="templates-section">
          <table className="templates-table" cellPadding={5} cellSpacing={10} align="center">
            <tbody>
              <tr>
                {templates.slice(0, 3).map((template) => (
                  <td key={template.id} className="template-cell">
                    <div 
                      className="template-card"
                      style={{ borderColor: template.color }}
                    >
                      <div className="template-icon">{template.name.split(' ')[0]}</div>
                      <h3 className="template-name" style={{ color: template.color }}>
                        {template.name.split(' ').slice(1).join(' ')}
                      </h3>
                      <p className="template-desc">{template.description}</p>
                      <div className="template-actions">
                        <button 
                          className="template-btn preview-btn"
                          onClick={() => setPreviewTemplate(template)}
                        >
                          👁️ Preview
                        </button>
                        <button 
                          className="template-btn use-btn"
                          onClick={() => handleCreate(template.id, `${template.name.split(' ').slice(1).join(' ')} Site`)}
                        >
                          Use Template
                        </button>
                      </div>
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                {templates.slice(3, 6).map((template) => (
                  <td key={template.id} className="template-cell">
                    <div 
                      className="template-card"
                      style={{ borderColor: template.color }}
                    >
                      <div className="template-icon">{template.name.split(' ')[0]}</div>
                      <h3 className="template-name" style={{ color: template.color }}>
                        {template.name.split(' ').slice(1).join(' ')}
                      </h3>
                      <p className="template-desc">{template.description}</p>
                      <div className="template-actions">
                        <button 
                          className="template-btn preview-btn"
                          onClick={() => setPreviewTemplate(template)}
                        >
                          👁️ Preview
                        </button>
                        <button 
                          className="template-btn use-btn"
                          onClick={() => handleCreate(template.id, `${template.name.split(' ').slice(1).join(' ')} Site`)}
                        >
                          Use Template
                        </button>
                      </div>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <h2 className="section-title blink">⚡ FEATURES ⚡</h2>
          <table className="features-table" cellPadding={10} cellSpacing={5} align="center">
            <tbody>
              <tr>
                <td className="feature-cell">
                  <div className="feature-icon">🤖</div>
                  <h3>AI-Powered</h3>
                  <p>Just describe what you want!</p>
                </td>
                <td className="feature-cell">
                  <div className="feature-icon">🎨</div>
                  <h3>Retro Themes</h3>
                  <p>Geocities, Angelfire & more!</p>
                </td>
                <td className="feature-cell">
                  <div className="feature-icon">📱</div>
                  <h3>Live Preview</h3>
                  <p>See changes instantly!</p>
                </td>
                <td className="feature-cell">
                  <div className="feature-icon">🚀</div>
                  <h3>One-Click Deploy</h3>
                  <p>Publish to GitHub Pages!</p>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>

      {/* Template Preview Modal */}
      {previewTemplate && (
        <div className="modal-overlay" onClick={() => setPreviewTemplate(null)}>
          <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{previewTemplate.name} Preview</h2>
              <button className="close-btn" onClick={() => setPreviewTemplate(null)}>✕</button>
            </div>
            <div className="modal-body">
              <iframe
                srcDoc={`
                  <!DOCTYPE html>
                  <html>
                  <head>
                    <base href="about:blank" target="_self">
                    <style>
                      ${getTemplateStyles(previewTemplate.id)}
                      a { cursor: default; pointer-events: none; }
                    </style>
                  </head>
                  <body>
                    ${getTemplatePreview(previewTemplate.id)}
                  </body>
                  </html>
                `}
                className="preview-iframe"
                title="Template Preview"
                sandbox="allow-same-origin"
              />
            </div>
            <div className="modal-footer">
              <button className="modal-btn cancel-btn" onClick={() => setPreviewTemplate(null)}>Close</button>
              <button 
                className="modal-btn use-btn"
                onClick={() => {
                  setPreviewTemplate(null);
                  handleCreate(previewTemplate.id, `${previewTemplate.name.split(' ').slice(1).join(' ')} Site`);
                }}
              >
                Use This Template
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Limit Modal */}
      {showLimitModal && (
        <div className="modal-overlay" onClick={() => setShowLimitModal(false)}>
          <div className="preview-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h2>⚠️ Project Limit Reached</h2>
              <button className="close-btn" onClick={() => setShowLimitModal(false)}>✕</button>
            </div>
            <div style={{ padding: '30px', textAlign: 'center' }}>
              <div style={{ fontSize: '64px', margin: '20px 0' }}>🚧</div>
              <h3 style={{ color: '#ffff00', fontSize: '24px', margin: '20px 0' }}>Maximum Projects Reached!</h3>
              <p style={{ color: '#ffffff', fontSize: '16px', lineHeight: '1.6', margin: '20px 0' }}>
                You already have 3 projects. You can only have 3 projects at a time.
              </p>
              <p style={{ color: '#00ffff', fontSize: '16px', lineHeight: '1.6', margin: '20px 0' }}>
                Please delete one of your existing projects from the dashboard and come back to create a new one.
              </p>
            </div>
            <div className="modal-footer">
              <button className="modal-btn cancel-btn" onClick={() => setShowLimitModal(false)}>Close</button>
              <button 
                className="modal-btn use-btn"
                onClick={() => router.push('/dashboard')}
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="retro-footer">
        <table width="100%" cellPadding={10} cellSpacing={0}>
          <tbody>
            <tr>
              <td align="center">
                <div className="footer-badges">
                  <span className="badge kiro-badge">🎃 Built for Kiroween 2024</span>
                  <span className="badge aws-badge">☁️ Powered by Kiro IDE (AWS)</span>
                  <span className="badge gemini-badge">✨ Gemini AI</span>
                </div>
                <hr className="footer-hr" />
                <p className="footer-text">
                  <span className="blink">★</span> Best viewed in Netscape Navigator 4.0 <span className="blink">★</span>
                </p>
                <p className="visitor-counter">
                  You are visitor #<span className="counter-num">000{Math.floor(Math.random() * 9000) + 1000}</span>
                </p>
                <p className="copyright">© 2024 RetroWeb Builder | Made with 💜 and nostalgia</p>
              </td>
            </tr>
          </tbody>
        </table>
      </footer>

      <style jsx>{`
  
      .retro-landing {
          min-height: 100vh;
          background: linear-gradient(180deg, #000033 0%, #000066 50%, #000033 100%);
          font-family: 'Comic Sans MS', 'Trebuchet MS', Arial, sans-serif;
          color: #ffffff;
          position: relative;
          overflow-x: hidden;
        }

        .stars-bg {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            radial-gradient(2px 2px at 20px 30px, #fff, transparent),
            radial-gradient(2px 2px at 40px 70px, #fff, transparent),
            radial-gradient(1px 1px at 90px 40px, #fff, transparent),
            radial-gradient(2px 2px at 160px 120px, #fff, transparent),
            radial-gradient(1px 1px at 230px 80px, #fff, transparent),
            radial-gradient(2px 2px at 300px 150px, #fff, transparent),
            radial-gradient(1px 1px at 370px 50px, #fff, transparent),
            radial-gradient(2px 2px at 450px 180px, #fff, transparent);
          background-size: 500px 200px;
          animation: twinkle 4s ease-in-out infinite;
          pointer-events: none;
          z-index: 0;
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }

        /* Marquee animation */
        .marquee-text {
          display: inline-block;
          animation: marquee 15s linear infinite;
          white-space: nowrap;
        }

        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }

        /* Navbar */
        .retro-navbar {
          background: linear-gradient(180deg, #000080 0%, #0000aa 100%);
          border-bottom: 3px ridge #c0c0c0;
          padding: 10px 20px;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .nav-left {
          text-align: left;
        }

        .nav-right {
          text-align: right;
        }

        .logo-text {
          font-size: 24px;
          font-weight: bold;
          text-shadow: 2px 2px #ff00ff, -2px -2px #00ffff;
        }

        .rainbow-text {
          background: linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #8b00ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .nav-link {
          color: #ffff00;
          text-decoration: none;
          margin: 0 10px;
          font-size: 16px;
        }

        .nav-link:hover {
          color: #00ffff;
          text-decoration: underline;
        }

        .nav-buttons {
          display: flex;
          gap: 15px;
          align-items: center;
        }

        .nav-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          font-size: 16px;
          font-weight: bold;
          font-family: 'Comic Sans MS', Arial, sans-serif;
          text-decoration: none;
          border-radius: 0;
          cursor: pointer;
          transition: all 0.15s ease;
          position: relative;
        }

        .btn-icon {
          font-size: 18px;
        }

        .btn-text {
          letter-spacing: 0.5px;
        }

        .login-btn {
          background: linear-gradient(180deg, #4a90d9 0%, #357abd 50%, #2868a8 100%);
          color: #ffffff !important;
          border: 3px outset #6ab0f3;
          box-shadow: 
            0 4px 0 #1a4a7a,
            0 6px 10px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
        }

        .login-btn:hover {
          background: linear-gradient(180deg, #5aa0e9 0%, #4589cd 50%, #3878b8 100%);
          transform: translateY(-2px);
          box-shadow: 
            0 6px 0 #1a4a7a,
            0 8px 15px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .login-btn:active {
          transform: translateY(2px);
          box-shadow: 
            0 2px 0 #1a4a7a,
            0 3px 5px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .signup-btn {
          background: linear-gradient(180deg, #ff6b35 0%, #f7931e 50%, #e67e22 100%);
          color: #ffffff !important;
          border: 3px outset #ffaa66;
          box-shadow: 
            0 4px 0 #b35500,
            0 6px 10px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.4);
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .signup-btn:hover {
          background: linear-gradient(180deg, #ff7b45 0%, #ffa32e 50%, #f68e32 100%);
          transform: translateY(-2px) scale(1.02);
          box-shadow: 
            0 6px 0 #b35500,
            0 8px 15px rgba(0, 0, 0, 0.4),
            0 0 20px rgba(255, 107, 53, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.4);
        }

        .signup-btn:active {
          transform: translateY(2px) scale(1);
          box-shadow: 
            0 2px 0 #b35500,
            0 3px 5px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.4);
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 
              0 4px 0 #b35500,
              0 6px 10px rgba(0, 0, 0, 0.3),
              0 0 10px rgba(255, 107, 53, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.4);
          }
          50% {
            box-shadow: 
              0 4px 0 #b35500,
              0 6px 10px rgba(0, 0, 0, 0.3),
              0 0 25px rgba(255, 107, 53, 0.6),
              inset 0 1px 0 rgba(255, 255, 255, 0.4);
          }
        }

        .nav-separator {
          color: #808080;
          margin: 0 5px;
        }

        .nav-user {
          color: #00ff00;
        }

        /* Hero Section */
        .hero-section {
          padding: 40px 20px;
          position: relative;
          z-index: 1;
        }

        .hero-table {
          max-width: 900px;
          margin: 0 auto;
        }

        .construction-gif {
          font-size: 48px;
          animation: bounce 0.5s ease-in-out infinite alternate;
        }

        @keyframes bounce {
          from { transform: translateY(0); }
          to { transform: translateY(-10px); }
        }

        .hero-title {
          font-size: 48px;
          margin: 20px 0;
          text-shadow: 3px 3px #ff00ff, -3px -3px #00ffff;
        }

        .rainbow-animated {
          background: linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #8b00ff, #ff0000);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: rainbow 3s linear infinite;
        }

        @keyframes rainbow {
          to { background-position: 200% center; }
        }

        .glow-text {
          color: #00ffff;
          text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff;
        }

        .hero-subtitle {
          font-size: 18px;
          color: #ffff00;
          max-width: 600px;
          margin: 0 auto;
        }

        /* Prompt Box */
        .prompt-container {
          margin-top: 30px;
          max-width: 700px;
        }

        .prompt-table {
          width: 100%;
          background: #c0c0c0;
          border: 3px outset #ffffff;
          padding: 15px;
        }

        .prompt-cell {
          width: 70%;
        }

        .button-cell {
          width: 30%;
          padding-left: 10px;
        }

        .retro-input {
          width: 100%;
          padding: 15px;
          font-size: 16px;
          font-family: 'Comic Sans MS', Arial, sans-serif;
          border: 2px inset #808080;
          background: #ffffff;
          color: #000000;
        }

        .retro-input:focus {
          outline: none;
          border-color: #0000ff;
        }

        .retro-button {
          padding: 15px 25px;
          font-size: 16px;
          font-family: 'Comic Sans MS', Arial, sans-serif;
          font-weight: bold;
          cursor: pointer;
          border: 3px outset #ffffff;
          transition: all 0.1s;
        }

        .retro-button:hover {
          border: 3px inset #ffffff;
        }

        .retro-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .create-btn {
          background: linear-gradient(180deg, #00cc00 0%, #009900 100%);
          color: #ffffff;
          white-space: nowrap;
        }

        /* Extension Promo */
        .extension-promo {
          padding: 30px 20px;
          max-width: 900px;
          margin: 0 auto;
        }

        .extension-banner {
          background: linear-gradient(135deg, #ff00ff 0%, #00ffff 100%);
          border: 4px solid #ffff00;
          border-radius: 15px;
          padding: 4px;
          box-shadow: 0 0 20px rgba(255, 255, 0, 0.5);
          animation: pulse-border 2s ease-in-out infinite;
        }

        @keyframes pulse-border {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 255, 0, 0.5); }
          50% { box-shadow: 0 0 30px rgba(255, 255, 0, 0.8); }
        }

        .extension-content {
          background: #000033;
          border-radius: 12px;
          padding: 25px;
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .extension-icon {
          font-size: 48px;
          animation: spin 3s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .extension-text {
          flex: 1;
          min-width: 250px;
        }

        .extension-title {
          font-size: 24px;
          color: #ffff00;
          margin: 0 0 8px 0;
          text-shadow: 2px 2px #ff00ff;
        }

        .extension-desc {
          font-size: 16px;
          color: #00ffff;
          margin: 0;
        }

        .extension-btn {
          background: linear-gradient(180deg, #ff6600 0%, #cc5200 100%);
          color: #ffffff;
          padding: 15px 30px;
          font-size: 18px;
          font-weight: bold;
          font-family: 'Comic Sans MS', Arial, sans-serif;
          border: 3px outset #ffffff;
          border-radius: 8px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .extension-btn:hover {
          border: 3px inset #ffffff;
          transform: scale(1.05);
        }

        .chrome-icon {
          font-size: 24px;
        }

        @media (max-width: 768px) {
          .extension-content {
            flex-direction: column;
            text-align: center;
          }
          
          .extension-text {
            min-width: 100%;
          }
        }

        /* Divider */
        .retro-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          padding: 30px 0;
          color: #ffff00;
          font-size: 18px;
          font-weight: bold;
          position: relative;
          z-index: 1;
        }

        .divider-line {
          width: 100px;
          height: 3px;
          background: linear-gradient(90deg, transparent, #ffff00, transparent);
        }

        /* Templates */
        .templates-section {
          padding: 20px;
          position: relative;
          z-index: 1;
          display: flex;
          justify-content: center;
        }

        .templates-table {
          max-width: 900px;
          margin: 0 auto;
        }

        .template-cell {
          width: 33%;
          vertical-align: top;
        }

        .template-card {
          background: linear-gradient(180deg, #1a1a4e 0%, #0d0d2b 100%);
          border: 3px ridge;
          padding: 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          min-height: 180px;
        }

        .template-card:hover {
          transform: scale(1.05);
          box-shadow: 0 0 20px currentColor;
        }

        .template-icon {
          font-size: 40px;
          margin-bottom: 10px;
        }

        .template-name {
          font-size: 18px;
          margin: 10px 0;
          font-weight: bold;
        }

        .template-desc {
          font-size: 14px;
          color: #c0c0c0;
          margin-bottom: 15px;
        }

        .template-actions {
          display: flex;
          gap: 8px;
        }

        .template-btn {
          flex: 1;
          background: #c0c0c0;
          color: #000080;
          border: 2px outset #ffffff;
          padding: 8px 12px;
          font-family: 'Comic Sans MS', Arial, sans-serif;
          font-size: 13px;
          font-weight: bold;
          cursor: pointer;
        }

        .template-btn:hover {
          border: 2px inset #ffffff;
        }

        .preview-btn {
          background: linear-gradient(180deg, #4a90d9 0%, #2868a8 100%);
          color: #ffffff;
        }

        .use-btn {
          background: linear-gradient(180deg, #00cc00 0%, #009900 100%);
          color: #ffffff;
        }

        /* Features */
        .features-section {
          padding: 40px 20px;
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .section-title {
          text-align: center;
          font-size: 28px;
          color: #ffff00;
          margin-bottom: 30px;
          text-shadow: 2px 2px #ff0000;
        }

        .features-table {
          max-width: 900px;
          margin: 0 auto;
          background: rgba(0, 0, 128, 0.5);
          border: 3px ridge #c0c0c0;
        }

        .feature-cell {
          text-align: center;
          padding: 20px;
          width: 25%;
          border: 1px solid #404080;
        }

        .feature-icon {
          font-size: 40px;
          margin-bottom: 10px;
        }

        .feature-cell h3 {
          color: #00ffff;
          margin: 10px 0;
        }

        .feature-cell p {
          color: #c0c0c0;
          font-size: 14px;
        }

        /* Footer */
        .retro-footer {
          background: linear-gradient(180deg, #000080 0%, #000040 100%);
          border-top: 3px ridge #c0c0c0;
          padding: 20px;
          margin-top: 40px;
          position: relative;
          z-index: 1;
        }

        .footer-badges {
          display: flex;
          justify-content: center;
          gap: 15px;
          flex-wrap: wrap;
          margin-bottom: 15px;
        }

        .badge {
          padding: 8px 16px;
          border: 2px outset #ffffff;
          font-size: 14px;
          font-weight: bold;
        }

        .kiro-badge {
          background: linear-gradient(180deg, #ff6600 0%, #cc3300 100%);
          color: #ffffff;
        }

        .aws-badge {
          background: linear-gradient(180deg, #ff9900 0%, #cc7700 100%);
          color: #000000;
        }

        .gemini-badge {
          background: linear-gradient(180deg, #4285f4 0%, #2962ff 100%);
          color: #ffffff;
        }

        .footer-hr {
          border: none;
          height: 2px;
          background: linear-gradient(90deg, transparent, #c0c0c0, transparent);
          margin: 20px 0;
        }

        .footer-text {
          color: #c0c0c0;
          font-size: 14px;
        }

        .visitor-counter {
          margin: 15px 0;
          font-size: 14px;
        }

        .counter-num {
          background: #000000;
          color: #00ff00;
          padding: 2px 8px;
          font-family: 'Courier New', monospace;
          border: 1px inset #808080;
        }

        .copyright {
          color: #808080;
          font-size: 12px;
        }

        /* Animations */
        .blink {
          animation: blink 1s step-end infinite;
        }

        @keyframes blink {
          50% { opacity: 0; }
        }

        /* Preview Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .preview-modal {
          background: linear-gradient(180deg, #1a1a4e 0%, #0d0d2b 100%);
          border: 4px ridge #c0c0c0;
          max-width: 900px;
          width: 100%;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 0 30px rgba(0, 0, 255, 0.5);
        }

        .modal-header {
          background: linear-gradient(180deg, #000080 0%, #0000aa 100%);
          padding: 15px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px ridge #c0c0c0;
        }

        .modal-header h2 {
          color: #ffff00;
          margin: 0;
          font-size: 20px;
          text-shadow: 2px 2px #ff00ff;
        }

        .close-btn {
          background: #c0c0c0;
          border: 2px outset #ffffff;
          width: 30px;
          height: 30px;
          cursor: pointer;
          font-size: 18px;
          font-weight: bold;
          color: #000080;
        }

        .close-btn:hover {
          border: 2px inset #ffffff;
        }

        .modal-body {
          flex: 1;
          overflow: hidden;
          background: #ffffff;
        }

        .preview-iframe {
          width: 100%;
          height: 100%;
          border: none;
          min-height: 400px;
        }

        .modal-footer {
          padding: 15px 20px;
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          border-top: 2px ridge #c0c0c0;
        }

        .modal-btn {
          padding: 10px 20px;
          font-family: 'Comic Sans MS', Arial, sans-serif;
          font-size: 14px;
          font-weight: bold;
          cursor: pointer;
          border: 3px outset #ffffff;
        }

        .modal-btn:hover {
          border: 3px inset #ffffff;
        }

        .cancel-btn {
          background: #c0c0c0;
          color: #000080;
        }

        .modal-btn.use-btn {
          background: linear-gradient(180deg, #00cc00 0%, #009900 100%);
          color: #ffffff;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .hero-title {
            font-size: 32px;
          }

          .template-cell {
            display: block;
            width: 100%;
          }

          .feature-cell {
            display: block;
            width: 100%;
          }

          .footer-badges {
            flex-direction: column;
            align-items: center;
          }

          .prompt-table {
            display: block;
          }

          .prompt-cell, .button-cell {
            display: block;
            width: 100%;
            padding: 5px 0;
          }
        }
      `}</style>
    </div>
  );
}
