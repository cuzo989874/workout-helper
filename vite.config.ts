import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import react from '@vitejs/plugin-react';
import sassDts from 'vite-plugin-sass-dts';
import path from 'path';
import svgr from "vite-plugin-svgr"; 

export default defineConfig({
  plugins: [
    react(),
    sassDts(),
    svgr(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
  
      pwaAssets: {
        disabled: false,
        config: true,
      },
  
      manifest: {
        name: 'temp-app',
        short_name: 'temp-app',
        description: 'temp app for react proejct',
        theme_color: '#e06161',
      },
  
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
      },
  
      devOptions: {
        enabled: false,
        navigateFallback: 'index.html',
        suppressWarnings: true,
        type: 'module',
      },
    })
  ],
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1024,
    target: 'esnext',
    minify: false,
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern',
      },
    },
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
    },
  },
});
