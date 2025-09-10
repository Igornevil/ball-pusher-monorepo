import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // щоб працювало на Railway
  preview: {
    port: Number(process.env.PORT) || 4173, // Railway подставляет $PORT
    host: true,
    allowedHosts: true,
  },
});
