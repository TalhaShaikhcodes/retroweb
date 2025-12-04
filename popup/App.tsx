import React, { useState, useEffect } from 'react';
import './popup.css';
import { Settings, CustomSettings } from '../src/types';

const App: React.FC = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [incompatibilities, setIncompatibilities] = useState<any>(null);

  useEffect(() => {
    // Load settings on mount
    chrome.runtime.sendMessage({ type: 'GET_SETTINGS' }, (response) => {
      if (response?.settings) {
        setSettings(response.settings);
      }
    });

    // Load incompatibilities for current tab
    chrome.runtime.sendMessage({ type: 'GET_INCOMPATIBILITIES' }, (response) => {
      if (response?.incompatibilities) {
        setIncompatibilities(response.incompatibilities);
      }
    });
  }, []);

  const toggleExtension = () => {
    chrome.runtime.sendMessage({ type: 'TOGGLE_EXTENSION' }, (response) => {
      if (response && settings) {
        setSettings({ ...settings, enabled: response.enabled });
      }
    });
  };

  const updateTheme = (theme: string) => {
    if (!settings) return;
    const newSettings = { ...settings, currentTheme: theme };
    setSettings(newSettings);
    chrome.runtime.sendMessage({ type: 'UPDATE_SETTINGS', settings: newSettings });
  };



  const toggleElement = (category: keyof CustomSettings, property: string, value: boolean) => {
    if (!settings) return;
    const newSettings = {
      ...settings,
      customSettings: {
        ...settings.customSettings,
        [category]: {
          ...settings.customSettings[category],
          [property]: value
        }
      }
    };
    setSettings(newSettings);
    chrome.runtime.sendMessage({ type: 'UPDATE_SETTINGS', settings: newSettings });
  };

  if (!settings) {
    return <div className="retro-container">Loading...</div>;
  }

  return (
    <div className="retro-container">
      {/* Header */}
      <div className="retro-header">
        <h1>🌟 RetroWeb 🌟</h1>
        <div className="under-construction">
          <span>⚠️ WELCOME TO MY PAGE ⚠️</span>
        </div>
      </div>

      {/* Status */}
      <div className="status-section">
        <div className="status-badge" style={{ 
          borderColor: settings.enabled ? '#00ff00' : '#ff0000',
          boxShadow: settings.enabled ? '0 0 10px rgba(0, 255, 0, 0.5)' : '0 0 10px rgba(255, 0, 0, 0.5)'
        }}>
          <span style={{ color: settings.enabled ? '#00ff00' : '#ff0000' }}>
            {settings.enabled ? '● ACTIVE ●' : '○ INACTIVE ○'}
          </span>
        </div>
        <button onClick={toggleExtension} className="retro-button">
          {settings.enabled ? '⚡ Deactivate RetroWeb ⚡' : '✨ Activate RetroWeb ✨'}
        </button>
      </div>

      {/* Incompatibility Warnings */}
      {incompatibilities && incompatibilities.hasIssues && (
        <div className="section" style={{ 
          backgroundColor: '#ffff00', 
          color: '#000000',
          border: '3px solid #ff0000',
          padding: '10px',
          marginTop: '10px'
        }}>
          <h2 style={{ color: '#ff0000', margin: '0 0 10px 0' }}>⚠️ Compatibility Issues ⚠️</h2>
          {incompatibilities.critical && (
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
              Critical issues detected!
            </div>
          )}
          {incompatibilities.issues && incompatibilities.issues.length > 0 && (
            <div style={{ marginBottom: '10px' }}>
              <strong>Issues:</strong>
              <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                {incompatibilities.issues.map((issue: string, index: number) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </div>
          )}
          {incompatibilities.warnings && incompatibilities.warnings.length > 0 && (
            <div>
              <strong>Warnings:</strong>
              <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                {incompatibilities.warnings.map((warning: string, index: number) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </div>
          )}
          <button 
            onClick={() => {
              chrome.runtime.sendMessage({ type: 'CLEAR_INCOMPATIBILITIES' });
              setIncompatibilities(null);
            }}
            className="retro-button"
            style={{ marginTop: '10px', fontSize: '12px' }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Theme Selection */}
      <div className="section">
        <h2>🎨 Choose Your Vibe 🎨</h2>
        <select 
          value={settings.currentTheme} 
          onChange={(e) => updateTheme(e.target.value)}
          className="retro-select"
        >
          <option value="geocities-chaos">Geocities Chaos Mode</option>
          <option value="neon-cyber-2001">Neon Cyber 2001</option>
          <option value="pixel-arcade">Pixel Arcade</option>
          <option value="vhs-glitch">VHS Analog Glitch</option>
          <option value="vaporwave">Vaporwave A E S T H E T I C</option>
          <option value="windows-95">Windows 95/98</option>
        </select>
      </div>

      {/* Element Toggles */}
      <div className="section">
        <h2>✨ Customize Elements ✨</h2>
        <div className="toggle-group">
          <label className="retro-checkbox">
            <input 
              type="checkbox" 
              checked={settings.customSettings.background.enabled}
              onChange={(e) => toggleElement('background', 'enabled', e.target.checked)}
            />
            <span>Tiled Backgrounds</span>
          </label>
          <label className="retro-checkbox">
            <input 
              type="checkbox" 
              checked={settings.customSettings.fonts.enabled}
              onChange={(e) => toggleElement('fonts', 'enabled', e.target.checked)}
            />
            <span>Retro Fonts</span>
          </label>
          <label className="retro-checkbox">
            <input 
              type="checkbox" 
              checked={settings.customSettings.cursor.enabled}
              onChange={(e) => toggleElement('cursor', 'enabled', e.target.checked)}
            />
            <span>Custom Cursors</span>
          </label>
          <label className="retro-checkbox">
            <input 
              type="checkbox" 
              checked={settings.customSettings.vintage.counter}
              onChange={(e) => {
                toggleElement('vintage', 'counter', e.target.checked);
                toggleElement('vintage', 'stickers', e.target.checked);
              }}
            />
            <span>Vintage Elements</span>
          </label>
        </div>
      </div>

      {/* RetroWeb Builder Promo */}
      <div className="section" style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        border: '3px solid #ffd700',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#ffffff', margin: '0 0 10px 0' }}>🚀 Build Your Own! 🚀</h2>
        <p style={{ color: '#ffffff', margin: '0 0 10px 0', fontSize: '13px' }}>
          Want to create your own retro website?
        </p>
        <button 
          onClick={() => chrome.tabs.create({ url: 'https://retroweb-builder.vercel.app/' })}
          className="retro-button"
          style={{ 
            background: '#ffd700',
            color: '#000000',
            fontWeight: 'bold',
            border: '2px solid #ffffff',
            boxShadow: '0 0 15px rgba(255, 215, 0, 0.5)'
          }}
        >
          🌐 Visit RetroWeb Builder 🌐
        </button>
      </div>

      {/* Footer */}
      <div className="footer">
        <div className="visitor-counter">
          <span>Visitor #</span>
          <span className="counter-digits">000042</span>
        </div>
        <div className="footer-text">
          <span>✨ RetroWeb Extension ✨</span>
        </div>
      </div>
    </div>
  );
};

export default App;
