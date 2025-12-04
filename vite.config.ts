import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'manifest.json',
          dest: '.'
        },
        {
          src: 'assets/*',
          dest: 'assets'
        },
        {
          src: 'src/retro.css',
          dest: '.'
        }
      ]
    })
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'popup/index.html'),
        background: resolve(__dirname, 'src/background.ts'),
        content: resolve(__dirname, 'src/content.ts')
      },
      output: {
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name === 'popup' 
            ? 'popup/[name].js' 
            : '[name].js';
        },
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'popup.css') {
            return 'popup/[name][extname]';
          }
          return '[name][extname]';
        }
      }
    }
  }
});
