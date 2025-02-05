import { defineConfig } from 'next/experimental/testmode/playwright'
import path from 'path'

export default defineConfig({
  testDir: path.join(__dirname, "tests"),
  testMatch: /.*\.ts/,
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
  },
})
