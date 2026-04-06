import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path';

import { cloudflare } from "@cloudflare/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), cloudflare()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use '${path.resolve('./src/styles/variables').replace(/\\/g, '/')}' as *;
        @use '${path.resolve('./src/styles/mixins').replace(/\\/g, '/')}' as *;`,
      },
    },
  },
})