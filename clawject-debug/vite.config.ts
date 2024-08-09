import { defineConfig } from "vite";
import ClawjectUnplugin from '@clawject/di/unplugin'

export default defineConfig({
  plugins: [
    ClawjectUnplugin.vite(),
  ],
  build: {
    sourcemap: true,
  },
})
