import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'

export default defineConfig({
  resolve: process.env.VITEST
    ? {
      conditions: ['browser']
    }
    : undefined,
  test: {
    // If you are testing components client-side, you need to setup a DOM environment.
    // If not all your files should have this environment, you can use a
    // `// @vitest-environment jsdom` comment at the top of the test files instead.
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts'
  },
  plugins: [
    tailwindcss(),
    sveltekit(),
    monacoEditorPlugin.default({
      languageWorkers: ['editorWorkerService', 'json']
    })
  ],
  ssr: {
    noExternal: ['monaco-editor']
  },
  optimizeDeps: {
    include: ['monaco-editor', '@urql/svelte']
  }
})
