import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  // GitHub Pages repository subpath
  base: '/Harivansh_portfolio/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
});
