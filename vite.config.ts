import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { fileURLToPath } from 'node:url'
import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite';
import tailwindcss from '@tailwindcss/vite'

const config = defineConfig({
  resolve: {
    alias: {
      'boneyard-js/react': fileURLToPath(
        new URL('./node_modules/boneyard-js/dist/react.js', import.meta.url),
      ),
    },
    tsconfigPaths: true,
  },
  plugins: [
    tailwindcss(),
    tanstackStart(),
    nitro(),
    viteReact()
  ],
})

export default config
