# PrivatePDF

A privacy-focused, client-side PDF toolkit that runs entirely in your browser. Process, merge, split, compress, convert, and reorder your PDF files securely without ever uploading them to a server. Built with React and WebAssembly for lightning-fast performance and ultimate privacy.

## Privacy-First Approach

All PDF processing happens directly in your browser:

-   PDF files are never uploaded to any server
-   WebAssembly (WASM) is used for fast and secure processing
-   When you close your browser, all data is automatically cleared

## Features

-   Upload and process multiple PDF documents.
-   Merge multiple PDFs into a single file.
-   Split a PDF into individual pages.
-   Compress PDFs to reduce file size with multiple quality levels.
-   Delete specific pages from a PDF.
-   Page reordering and rotation
-   100% client-side processing using WebAssembly for speed and security.
-   No file uploads, no servers, no data collection.
-   Modern, responsive UI for desktop and mobile.

## Technology Stack

-   **React + Vite**: For a fast and modern frontend.
-   **pdf-lib**: For creating and modifying PDF documents in JavaScript.
-   **pdf.js**: For rendering PDFs in the browser.
-   **Web Workers**: To run PDF processing in the background without freezing the UI.
-   **WebAssembly (WASM)**: For performance-intensive operations like compression.
-   **Lucide React**: For beautiful and consistent icons.
-   **Plain CSS**: For custom styling and a lightweight footprint.

## Development

### Prerequisites

-   Node.js 16.5.0 or higher
-   npm 8.1.4 or higher

### Running Locally

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open your browser to the URL shown in the terminal (usually http://localhost:5173)

## Building for Production

```bash
npm run build
```

The output will be in the `dist` directory and can be deployed to any static web hosting service.

## Future Enhancements

-   Text extraction and editing
-   Support for password protected PDFs
-   Advanced annotation tools (highlight, underline, notes)
-   Digital signatures
-   PDF form filling

## License

This project is open source and licensed under the MIT License.
