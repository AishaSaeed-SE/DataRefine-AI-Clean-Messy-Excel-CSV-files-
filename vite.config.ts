
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // This replaces all occurrences of process.env.API_KEY in the code with the literal value
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ''),
    // This handles cases where code might access the whole process.env object
    'process.env': {
      API_KEY: JSON.stringify(process.env.API_KEY || '')
    }
  },
  server: {
    port: 3000,
  },
});
