import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  // Universal relative base path: works on Netlify root domain, GitHub Pages subpath, and local preview
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
});
