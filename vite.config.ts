import { defineConfig } from 'vite'
// import { nitro } from "nitro/vite"
import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
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
