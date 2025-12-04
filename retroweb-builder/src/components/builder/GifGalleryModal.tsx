'use client';

import { useState, useMemo } from 'react';
import { gifLibrary, getGifsByCategory, getGifsByTheme } from '@/lib/gifRegistry';
import { getGifUrl } from '@/lib/gifCdn';
import { useUserGifs } from '@/hooks/useUserGifs';

interface GifGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (gifUrl: string, gifName: string) => void;
  projectId?: string;
  currentTheme?: string;
}

type FilterCategory = 'all' | 'animation' | 'button' | 'decoration' | 'custom';
type FilterTheme = 'all' | 'geocities-chaos' | 'neon-cyber-2001' | 'pixel-arcade' | 'vhs-glitch' | 'vaporwave' | 'windows-95';

export function GifGalleryModal({ isOpen, onClose, onSelect, projectId, currentTheme }: GifGalleryModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all');
  const [filterTheme, setFilterTheme] = useState<FilterTheme>('all');
  const { userGifs, deleteGif, loading: gifsLoading } = useUserGifs(projectId);

  // Filter GIFs based on search and filters
  const filteredGifs = useMemo(() => {
    let gifs = [...gifLibrary];

    // Apply category filter
    if (filterCategory !== 'all' && filterCategory !== 'custom') {
      gifs = getGifsByCategory(filterCategory);
    }

    // Apply theme filter
    if (filterTheme !== 'all') {
      gifs = gifs.filter(g => g.themes.includes(filterTheme) || g.themes.includes('all'));
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      gifs = gifs.filter(g =>
        g.name.toLowerCase().includes(query) ||
        g.tags.some(tag => tag.toLowerCase().includes(query)) ||
        g.description?.toLowerCase().includes(query)
      );
    }

    return gifs;
  }, [searchQuery, filterCategory, filterTheme]);

  // Determine what to show
  const showLibraryGifs = filterCategory !== 'custom';
  const showUserGifs = filterCategory === 'all' || filterCategory === 'custom';

  if (!isOpen) return null;

  const handleGifSelect = (url: string, name: string) => {
    onSelect(url, name);
    onClose();
  };

  const handleDeleteUserGif = async (gifId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this GIF from your collection?')) {
      await deleteGif(gifId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col border border-gray-700">
        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">🎨 Retro GIF Gallery</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search GIFs by name or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <svg className="w-5 h-5 text-gray-500 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Filters */}
          <div className="flex gap-4 flex-wrap">
            {/* Category Filter */}
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value as FilterCategory)}
                className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All ({gifLibrary.length})</option>
                <option value="animation">Animations ({getGifsByCategory('animation').length})</option>
                <option value="button">Buttons ({getGifsByCategory('button').length})</option>
                <option value="decoration">Decorations ({getGifsByCategory('decoration').length})</option>
                <option value="custom">My GIFs ({userGifs.length})</option>
              </select>
            </div>

            {/* Theme Filter */}
            {!showUserGifs && (
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Theme</label>
                <select
                  value={filterTheme}
                  onChange={(e) => setFilterTheme(e.target.value as FilterTheme)}
                  className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Themes</option>
                  <option value="geocities-chaos">🌈 Geocities Chaos</option>
                  <option value="neon-cyber-2001">💻 Neon Cyber</option>
                  <option value="pixel-arcade">🎮 Pixel Arcade</option>
                  <option value="vhs-glitch">📼 VHS Glitch</option>
                  <option value="vaporwave">🌴 Vaporwave</option>
                  <option value="windows-95">🖥️ Windows 95</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* GIF Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* User's Custom GIFs (show in All and Custom categories) */}
            {showUserGifs && userGifs.length > 0 && (
              <div>
                <h3 className="text-white font-medium mb-3 px-1">Your Custom GIFs</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {userGifs.map((gif) => (
                    <div
                      key={`user-${gif.id}`}
                      className="group relative bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-purple-500 transition-all cursor-pointer"
                      onClick={() => handleGifSelect(gif.url, gif.name)}
                    >
                      <div className="aspect-square flex items-center justify-center p-2 bg-gray-900">
                        <img
                          src={gif.url}
                          alt={gif.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <div className="p-2 bg-gray-800">
                        <p className="text-white text-xs truncate">{gif.name}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-purple-400 text-xs font-medium">Custom</span>
                          <button
                            onClick={(e) => handleDeleteUserGif(gif.id, e)}
                            className="text-red-400 hover:text-red-300 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Show message if only custom filter and no GIFs */}
            {filterCategory === 'custom' && userGifs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-2">No custom GIFs uploaded yet</p>
                <p className="text-gray-600 text-sm">Upload GIFs using the file button in chat (max 5, 1MB each)</p>
              </div>
            )}

            {/* Library GIFs (show unless custom-only filter) */}
            {filterCategory !== 'custom' && (
              <div>
                {filterCategory === 'all' && userGifs.length > 0 && (
                  <h3 className="text-white font-medium mb-3 px-1">Library GIFs</h3>
                )}
                {filteredGifs.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No library GIFs found matching your filters</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {filteredGifs.map((gif) => {
                      const gifUrl = getGifUrl(gif.path);
                      return (
                        <div
                          key={`lib-${gif.id}`}
                          className="group bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-purple-500 transition-all cursor-pointer"
                          onClick={() => handleGifSelect(gifUrl, gif.name)}
                        >
                          <div className="aspect-square flex items-center justify-center p-2 bg-gray-900">
                            <img
                              src={gifUrl}
                              alt={gif.name}
                              className="max-w-full max-h-full object-contain"
                              loading="lazy"
                            />
                          </div>
                          <div className="p-2 bg-gray-800">
                            <p className="text-white text-xs truncate" title={gif.name}>
                              {gif.name}
                            </p>
                            <div className="flex items-center gap-1 mt-1 flex-wrap">
                              <span className="text-gray-500 text-xs capitalize">{gif.category}</span>
                              {gif.tags.slice(0, 2).map((tag) => (
                                <span key={tag} className="text-purple-400 text-xs">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 bg-gray-900/50">
          <p className="text-gray-500 text-sm text-center">
            Click any GIF to insert it into your message • {showUserGifs ? `${userGifs.length}/5 custom GIFs` : `${filteredGifs.length} GIFs shown`}
          </p>
        </div>
      </div>
    </div>
  );
}
