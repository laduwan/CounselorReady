import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// ── Build guard: the React entry must stay a React entry ──────────────────────
// client/index.html is Vite's build entry and is emitted as the deployed
// /index.html, which _redirects maps the course-builder (and other SPA routes)
// to. It has been overwritten with the marketing homepage 3x; when that happens
// the build ships marketing as /index.html and /admin/course-builder serves the
// "Sign in" page instead of the React app. This plugin FAILS the build (on every
// `vite build`, however it's invoked) if the entry loses its React mount or
// bootstrap, so a broken entry can never deploy. The marketing homepage is a
// separate file: client/public/index.html. See CLAUDE.md ("Two index.html files").
function verifyReactEntry() {
  return {
    name: 'verify-react-entry',
    apply: 'build',
    buildStart() {
      const entryPath = resolve(__dirname, 'index.html')
      const html = readFileSync(entryPath, 'utf8')
      const missing = []
      if (!html.includes('id="root"')) missing.push('<div id="root"></div> (React mount point)')
      if (!html.includes('/src/main.jsx')) missing.push('<script type="module" src="/src/main.jsx"> (app bootstrap)')
      if (missing.length) {
        this.error(
          'client/index.html is not a valid Vite React entry — missing:\n  - ' +
          missing.join('\n  - ') +
          '\n\nThis file is the React SPA entry (course-builder, etc.). It looks like it was ' +
          'overwritten with marketing/static HTML.\nThe marketing homepage belongs in ' +
          'client/public/index.html — restore the React shell here.\nSee CLAUDE.md ("Two index.html files").'
        )
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), verifyReactEntry()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: true,
  }
})
