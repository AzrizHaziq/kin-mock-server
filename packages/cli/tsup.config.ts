import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['./src/cli.ts'],
  format: ['esm'],
  minify: true,
  clean: true,
  dts: false,
  watch: false,
  platform: 'node',
  target: 'node20',
  banner: {
    js: '#!/usr/bin/env node'
  }
})