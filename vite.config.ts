import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import path from 'node:path'
import { chromeExtension } from 'vite-plugin-chrome-extension'
import autoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    rollupOptions: {
      input: 'src/manifest.json',
    },
    minify: false,
    sourcemap: true,
    assetsInlineLimit: 10096,
  },
  plugins: [
    preact(),
    chromeExtension(),
    autoImport({
      imports: [
        {
          'webextension-polyfill': [['*', 'browser']],
        },
      ],
      dts: false,
    }),
  ] as any,
  optimizeDeps: {
    exclude: ['node-fetch'],
    include: ['webextension-polyfill'],
  },
})
