import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  
  build: {
    target: 'esnext', // Specify target for modern browsers
  },
  
  server: {
    port: 3000, // Specify development server port
    open: true, // Open browser automatically when server starts
  },
});
