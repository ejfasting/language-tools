import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      path: 'path-browserify'
    }
  },
  server: {
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['../..'],
    },
  }
});