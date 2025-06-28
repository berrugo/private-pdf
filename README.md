# PDF Editor WASM

A browser-based PDF editor that processes files entirely on the client-side using WebAssembly (WASM) for privacy. This application allows users to upload PDF files, view thumbnails of each page, select pages for deletion, and save the modified PDF without sending any data to a server.

## Privacy-First Approach

All PDF processing happens directly in your browser:

- PDF files are never uploaded to any server
- WebAssembly (WASM) is used for fast and secure processing
- When you close your browser, all data is automatically cleared

## Features

- Upload PDF documents
- View thumbnails of all pages
- Select pages to delete
- Download the modified PDF with selected pages removed
- Fully responsive UI works on desktop and mobile

## Technology Stack

- **React + Vite**: Fast and modern frontend framework
- **PDF.js**: Mozilla's powerful library for rendering PDFs in the browser
- **pdf-lib**: Library for creating and modifying PDF documents in pure JavaScript
- **Web Workers**: For handling PDF processing in background threads
- **Chakra UI**: Modern component library for the user interface

## Development

### Prerequisites

- Node.js 16.5.0 or higher
- npm 8.1.4 or higher

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

- Page reordering functionality
- Text extraction and editing
- Adding annotations
- Merging multiple PDFs
- Form filling capabilities
- Signature support
