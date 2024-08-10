import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  return {
    base: mode === 'production' ? '/mkanuradhi.github.io/' : '/',
    plugins: [react()],
    css: {
      preprocessorOptions: {
        scss: {
          quietDeps: true
        }
      }
    },
    server: {
      host: '0.0.0.0',
    },
  };
})
