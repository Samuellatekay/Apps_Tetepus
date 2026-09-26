import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  resolve: {
    alias: {
      "@": import.meta.dirname ? `${import.meta.dirname}/src` : new URL("./src", import.meta.url).pathname,
    },
  },
})


