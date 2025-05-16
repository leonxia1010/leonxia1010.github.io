import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', //,
  server: {
    proxy: {
      '/api/words': {
        target: 'https://api.frontendexpert.io',
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(/^\/api\/words/, '/api/fe/wordle-words'),
      },
    },
  },
});
