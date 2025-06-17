import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['./src/cli.ts'],
  format: ['cjs'],
  minify: true,
  clean: true,
  dts: false,
  watch: false,
  platform: 'node',
  target: 'node20',
})