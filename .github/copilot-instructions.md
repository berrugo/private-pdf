# PrivatePDF Copilot Instructions

## Project Overview
This is a **privacy-first, client-side PDF toolkit** that processes PDFs entirely in the browser using WebAssembly. No files are ever uploaded to servers. Built with React + Vite, pdf-lib, and pdf.js with Web Workers for performance.

## Privacy-First Architecture (CRITICAL)
**Never suggest server-side PDF processing.** All operations must happen client-side:
- PDF files stay in the browser (ArrayBuffer/Blob only)
- No external API calls for PDF operations
- No tracking/analytics that shares document data
- Memory-conscious: large PDFs can exhaust browser memory

## Tech Stack & Key Dependencies
- **React 19** + **Vite 6**: Modern frontend with ESM modules
- **pdf-lib**: Creating/modifying PDFs (in worker)
- **pdfjs-dist**: Rendering PDFs to canvas (main thread + worker)
- **Comlink**: Worker communication with proxy-based API
- **Chakra UI v3**: Component library (with Emotion)
- **react-i18next**: Internationalization (English, Spanish support)
- **Plain CSS**: Custom styling in `*.css` files

## Worker/Main Thread Architecture
Critical pattern: **PDF operations split between worker and main thread** to keep UI responsive.

### Worker Thread (`src/workers/pdf.worker.js`)
- Heavy processing: merge, compress, page manipulation
- Uses `pdf-lib` (PDFDocument) for document modification
- Uses `pdfjs-dist` with `disableWorker: true` to avoid nested workers
- Exposed via Comlink: `comlinkApiRef.current.methodName()`
- **Always copy ArrayBuffers** before passing to avoid detachment: `arrayBuffer.slice(0)`

### Main Thread (`src/hooks/usePdfProcessor.js`)
- Thumbnail rendering using `pdfjs-dist` (PDFDocumentProxy)
- Maintains `pdfDoc` state for canvas rendering
- Hook manages worker lifecycle and Comlink wrapper

### Example Pattern
```javascript
// In usePdfProcessor.js hook:
const workerResult = await comlinkApiRef.current.processPdf(data.slice(0));
const mainThreadDoc = await pdfjsLib.getDocument({ data: data.slice(0) }).promise;
setPdfDoc(mainThreadDoc); // For rendering
```

## PDF.js Worker Setup (Critical)
**Worker path must be set in both App.jsx AND pdf.worker.js:**
```javascript
const workerSrcUrl = new URL('../node_modules/pdfjs-dist/build/pdf.worker.mjs', import.meta.url).href;
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrcUrl;
```
Use `.mjs` extension (not `.js`). Vite resolves via `import.meta.url`.

## Component Structure
- `App.jsx`: Main coordinator, manages file state and operations
- `LandingPage.jsx`: Initial view, hidden after file upload
- `FileUploader.jsx`: Drag-and-drop + file input (supports multiple files)
- `ThumbnailGallery.jsx`: Page thumbnails with drag-to-reorder, selection, rotation
- `LanguageSwitcher.jsx`: Toggle between supported languages (EN/ES)
- `usePdfProcessor.js`: Custom hook wrapping worker operations

## Internationalization (i18n)
Uses **react-i18next** for multi-language support:
- Translation files in `src/locales/{lang}/translation.json`
- Language detection: localStorage → browser settings
- Use `const { t } = useTranslation()` hook in components
- All user-facing strings must use `t('key.path')` - never hardcode
- See `docs/I18N_GUIDE.md` for adding new languages

## State Management Patterns
No Redux/Zustand. Use React hooks:
- `pdfFiles`: Array of File objects (multiple upload support)
- `pdfInfo`: Metadata from worker (numPages, pageInfos, arrayBuffer, etc.)
- `pdfDoc`: Main thread PDFDocumentProxy for rendering
- `pagesToKeep`: Array of page numbers (initially all pages selected)
- `compressionLevel`: "low" | "medium" | "high"

## Development Workflow
```bash
npm run dev      # Start Vite dev server (http://localhost:5173)
npm run build    # Production build → dist/
npm run lint     # ESLint check
npm run preview  # Preview production build
```

## Coding Conventions
- **ESM modules**: Use `import.meta.url` (not `__dirname`)
- **ESLint config**: Flat config (`eslint.config.js`), React Hooks rules enforced
- **CSS**: Plain CSS files, no CSS-in-JS (except Emotion via Chakra)
- **Unused vars**: Ignored if uppercase (e.g., `_UnusedComponent`)
- **PropTypes**: Used for component prop validation

## Common Pitfalls
1. **ArrayBuffer Detachment**: Always `.slice(0)` before sending to worker
2. **Nested Workers**: Use `disableWorker: true` in worker's pdfjs-dist calls
3. **Worker Termination**: Hook cleans up worker on unmount
4. **Memory Leaks**: Large PDFs can OOM - consider chunking/streaming for future features
5. **File Object Storage**: Store original File object for name/metadata, not full buffer

## Adding New PDF Operations
1. Add method to `pdf.worker.js` (use pdf-lib for document mods)
2. Expose via Comlink's `expose()` call at bottom of worker
3. Add corresponding method in `usePdfProcessor.js` hook
4. Handle result in `App.jsx` or relevant component
5. Test with large files (memory usage!)

## Future Enhancements (from README)
- Text extraction/editing
- Password-protected PDF support
- Annotation tools (highlight, underline, notes)
- Digital signatures
- PDF form filling

## Deployment
Static site (Vercel/Netlify compatible). `dist/` contains production build.
