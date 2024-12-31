import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'proven-dapp-toolkit',
    },
  },
  define: { 'process.env.NODE_ENV': '"production"' },
})
