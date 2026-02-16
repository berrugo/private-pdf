# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Vite dev server at http://localhost:5173
npm run build     # Production build → dist/
npm run lint      # ESLint
npm run preview   # Preview production build
```

No test framework is configured.

## Architecture

PrivatePDF is a privacy-first, client-side PDF toolkit. All PDF processing happens in the browser — never suggest server-side solutions or external API calls for PDF operations.

### Worker / Main Thread Split

This is the core architectural pattern. Heavy PDF operations run in a Web Worker to keep the UI responsive.

- **Worker** (`src/workers/pdf.worker.js`): Uses `pdf-lib` for document modification (merge, compress, page manipulation). Uses `pdfjs-dist` with `disableWorker: true` to avoid nested workers. Exposed via Comlink.
- **Hook** (`src/hooks/usePdfProcessor.js`): Wraps worker communication via Comlink proxy (`comlinkApiRef.current.methodName()`). Manages worker lifecycle. Renders thumbnails on main thread using `pdfjs-dist`.
- **App** (`src/App.jsx`): Main coordinator component. Manages all state with React hooks (no Redux/Zustand).

### Adding New PDF Operations

1. Add method to `pdf.worker.js` (use pdf-lib)
2. Expose via Comlink's `expose()` at bottom of worker
3. Add corresponding method in `usePdfProcessor.js`
4. Handle result in `App.jsx`

### Critical Patterns

**ArrayBuffer copying**: Always `.slice(0)` before passing to/from the worker to prevent detachment errors.

**PDF.js worker path**: Must be set in both `App.jsx` and `pdf.worker.js` using `.mjs` extension:
```javascript
const workerSrcUrl = new URL('../node_modules/pdfjs-dist/build/pdf.worker.mjs', import.meta.url).href;
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrcUrl;
```

### Key State (`App.jsx`)

- `pdfFiles` — Array of File objects (supports multiple for merging)
- `pdfInfo` — Nested metadata from worker: access as `pdfInfo.info.numPages` (not `pdfInfo.numPages`)
- `pdfDoc` — Main thread PDFDocumentProxy for thumbnail rendering
- `pagesToKeep` — 1-based page numbers for final output
- `compressionLevel` — `"low"` | `"medium"` | `"high"`

## Internationalization

Uses `react-i18next`. Translations in `src/locales/{en,es}/translation.json`. All user-facing strings must use `t('key.path')` — never hardcode. Language detection: localStorage → browser settings, fallback English. See `docs/I18N_GUIDE.md` for adding languages.

## Styling

Plain CSS (`src/App.css`, `src/index.css`) plus Chakra UI components. CSS variables defined in `:root` (primary `#6366f1`, secondary `#8b5cf6`, accent `#ec4899`). Responsive breakpoint at 768px. No CSS-in-JS outside Chakra/Emotion.

## Stack

React 19, Vite, pdf-lib, pdfjs-dist, Comlink, Chakra UI v3, Framer Motion, Lucide React, i18next. ESM modules only (`import.meta.url`, not `__dirname`).
