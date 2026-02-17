
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Ensure process.env.API_KEY is replaced during build
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ''),
    // Provide a global process object to prevent "process is not defined" errors
    'process.env': {
      API_KEY: JSON.stringify(process.env.API_KEY || '')
    }
  },
  server: {
    port: 3000,
  },
});
