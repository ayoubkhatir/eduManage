import { defineConfig } from 'vite'
// import { nitro } from "nitro/vite"
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { fileURLToPath } from 'node:url'

import viteReact from '@vitejs/plugin-react'
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
    // devtools(),
    tailwindcss(),
    tanstackStart(
      //   spa: {
      //     enabled: true,
      //     prerender: {
      //       enabled: false
      //     }
      //   }
    ),
    // nitro({ preset: "bun" }),
    viteReact()],
})

export default config
