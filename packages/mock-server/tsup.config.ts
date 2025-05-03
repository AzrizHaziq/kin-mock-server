import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['./index.ts'],
  format: ['cjs', 'esm'],
  minify: true,
  clean: true,
  dts: true,
  watch: false
})