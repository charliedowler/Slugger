import { defineConfig } from 'vite';

// Slugger is a static canvas game with no backend.
// Assets live in /public (served at the site root, copied verbatim into dist).
export default defineConfig({
  base: './',
  build: {
    target: 'es2022',
    outDir: 'dist',
  },
});
