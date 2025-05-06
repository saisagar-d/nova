import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../campusbot/static/frontend',
    emptyOutDir: true,
  },
  server: {
    port: 3000,
   
    proxy: {
      '/login': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
      '/chatbot': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
      },
      },
      
      
  },
);
