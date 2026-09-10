import { defineConfig } from 'vite';

// `base: './'` => chemins relatifs dans le build, indispensable pour un
// déploiement GitHub Pages sous /<repo>/ (ou n'importe quel sous-dossier).
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    target: 'es2020',
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.js'],
  },
});
