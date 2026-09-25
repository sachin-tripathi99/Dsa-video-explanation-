import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' keeps the build fully relative, so it runs from any static host or sub-folder.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: { chunkSizeWarningLimit: 900 },
});
