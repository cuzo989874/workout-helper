import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import sassDts from 'vite-plugin-sass-dts';
import path from 'path';
import svgr from "vite-plugin-svgr"; 

export default defineConfig({
  plugins: [
    react(),
    sassDts(),
    svgr(),
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
