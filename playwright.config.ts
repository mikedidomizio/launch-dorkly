import { defineConfig } from 'next/experimental/testmode/playwright'
import path from 'path'

export default defineConfig({
  webServer: {
    command: 'npm run dev -- --experimental-test-proxy',
    url: 'http://localhost:3000',
  },
})
