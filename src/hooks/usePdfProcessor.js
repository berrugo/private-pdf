import { useState, useEffect, useRef, useCallback } from 'react';
import { wrap } from 'comlink';
import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs'; // Import for main thread use

/**
 * Hook for processing PDF files using the worker thread
 */
export function usePdfProcessor() {
    const [pdfFile, setPdfFile] = useState(null); // Keep this, will use below
    const [pdfInfo, setPdfInfo] = useState(null); // numPages, fingerprint etc.
    const [pdfDoc, setPdfDoc] = useState(null); // State for main-thread PDFDocumentProxy
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const workerRef = useRef(null);
    const comlinkApiRef = useRef(null);

    // Initialize worker on mount
    useEffect(() => {
        // Use Vite's new Worker constructor with URL
        const worker = new Worker(
            new URL('../workers/pdf.worker.js', import.meta.url),
            {
                type: 'module',
            }
        );
        workerRef.current = worker;
        comlinkApiRef.current = wrap(worker);

        // Cleanup worker on unmount
        return () => {
            worker.terminate();
            workerRef.current = null;
            comlinkApiRef.current = null;
        };
    }, []);

    /**
     * Merge multiple PDF files into a single document
     * @param {File[]} files - Array of PDF files to merge
     */
    const mergePdfFiles = useCallback(async (files) => {
        setIsLoading(true);
        setError(null);
        setPdfFile(files[0]); // Store first file for reference/name
        setPdfInfo(null);
        setPdfDoc(null); // Clear previous main-thread doc
        
        try {
            // Convert all files to array buffers
            const fileBuffers = await Promise.all(
                files.map(file => file.arrayBuffer())
            );
            
            // Call the worker to merge the PDFs
            const mergeResult = await comlinkApiRef.current.mergePdfs(fileBuffers);
            
            if (!mergeResult || !mergeResult.success) {
                throw new Error(mergeResult?.error || 'Failed to merge PDFs');
            }
            
            // Create a copy of the buffer to prevent detachment issues
            const dataCopy = mergeResult.data.slice(0);
            
            // Set the merged PDF info
            setPdfInfo({
                success: true,
                info: {
                    ...mergeResult.info,
                    arrayBuffer: dataCopy, // Use copy instead of original
                    isMerged: true,
                    sourceFiles: files.map(f => f.name)
                }
            });
            
            // Also load the merged PDF on the main thread for rendering
            try {
                // Use another copy for the main thread to prevent detachment issues
                const mainThreadDoc = await pdfjsLib.getDocument({
                    data: mergeResult.data.slice(0) // Use a fresh copy
                }).promise;
                setPdfDoc(mainThreadDoc);
                console.log('Merged PDF document loaded on main thread:', mainThreadDoc);
            } catch (mainThreadError) {
                console.error('Error loading merged PDF on main thread:', mainThreadError);
                setError(`Main Thread Error: ${mainThreadError.message}`);
                // Keep the worker info even if main thread loading fails
            }
            
            setIsLoading(false);
            return true;
        } catch (err) {
            console.error('Error merging PDFs:', err);
            setError(`Failed to merge PDFs: ${err.message}`);
            setIsLoading(false);
            return false;
        }
    }, []);

    /**
     * Load a PDF file
     * @param {File} file - The PDF file to load
     */
    const uploadPdf = useCallback(async (file) => {
        setIsLoading(true);
        setError(null);
        setPdfFile(file); // <-- Store the file object
        setPdfInfo(null);
        setPdfDoc(null); // Clear previous main-thread doc

        const arrayBuffer = await file.arrayBuffer();

        // 1. Call Worker to perform initial load/validation and get basic info
        let workerInfo = null;
        try {
            workerInfo = await comlinkApiRef.current.loadPDF(
                arrayBuffer.slice(0)
            ); // Send copy to worker
            if (!workerInfo || !workerInfo.success) {
                throw new Error(
                    workerInfo?.error || 'Failed to load PDF in worker'
                );
            }
            setPdfInfo(workerInfo); // Contains numPages from worker
            console.log('Worker loadPDF successful:', workerInfo);
        } catch (workerError) {
            console.error('Error calling worker loadPDF:', workerError);
            setError(`Worker Error: ${workerError.message}`);
            setIsLoading(false);
            return; // Stop if worker fails
        }

        // 2. Load PDF on Main Thread using pdfjs-dist to get PDFDocumentProxy for rendering
        try {
            console.log('Loading PDF on main thread...');
            const mainThreadDoc = await pdfjsLib.getDocument({
                data: arrayBuffer.slice(0),
            }).promise; // Use copy
            setPdfDoc(mainThreadDoc);
            console.log('Main thread PDF document loaded:', mainThreadDoc);
        } catch (mainThreadError) {
            console.error('Error loading PDF on main thread:', mainThreadError);
            setError(`Main Thread Error: ${mainThreadError.message}`);
            // Allow continuing if worker succeeded? Or fail here too?
            // For now, let's set the error but maybe keep worker info?
        }

        setIsLoading(false);
    }, []); // Dependencies: workerRef setup handled in useEffect

    // Function to generate thumbnail ON THE MAIN THREAD
    const generateThumbnailMainThread = useCallback(
        async (pageNumber, scale = 0.7) => {
            if (!pdfDoc) {
                console.error('generateThumbnailMainThread: pdfDoc not loaded');
                return {
                    success: false,
                    error: 'PDF document not loaded on main thread',
                };
            }

            console.log(
                `Generating thumbnail for page ${pageNumber} on main thread...`
            );
            try {
                const page = await pdfDoc.getPage(pageNumber);
                const viewport = page.getViewport({ scale });

                // Use a standard canvas on the main thread
                const canvas = document.createElement('canvas');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                const context = canvas.getContext('2d');

                const renderContext = {
                    canvasContext: context,
                    viewport: viewport,
                };

                await page.render(renderContext).promise;

                const dataUrl = canvas.toDataURL('image/png');

                return {
                    success: true,
                    dataUrl: dataUrl,
                    width: viewport.width,
                    height: viewport.height,
                    pageNumber,
                };
            } catch (thumbError) {
                console.error(
                    `Error generating thumbnail for page ${pageNumber} on main thread:`,
                    thumbError
                );
                return { success: false, error: thumbError.message };
            }
        },
        [pdfDoc]
    ); // Depends on pdfDoc state

    // Function to remove pages (uses worker)
    const removePages = useCallback(
        async (pagesToRemove) => {
            // Check for the buffer within the nested info object
            if (!pdfInfo?.info?.arrayBuffer || !comlinkApiRef.current) {
                setError(
                    "No PDF loaded (missing buffer in info) or worker not initialized"
                );
                console.error('removePages check failed:', {
                    pdfInfo,
                    comlinkExists: !!comlinkApiRef.current,
                });
                return null;
            }

            setIsLoading(true);

            try {
                // Pass the buffer from the correct location
                const result = await comlinkApiRef.current.removePages(
                    pdfInfo.info.arrayBuffer,
                    pagesToRemove
                );

                setIsLoading(false);

                if (result.success) {
                    // Potentially update pdfInfo or pdfDoc here if the worker returns new info/buffer?
                    // For now, just return the resulting bytes
                    return result.data;
                } else {
                    setError(result.error || "Failed to remove pages");
                    return null;
                }
            } catch (err) {
                console.error("Error removing pages:", err);
                setError(err.message || "An unexpected error occurred");
                setIsLoading(false);
                return null;
            }
        },
        [pdfInfo, comlinkApiRef]
    );

    // Function to compress PDF by converting to JPEGs (runs on main thread)
    const compressPdf = useCallback(
        async (compressionLevel, customArrayBuffer = null, progressCallback = null) => {
            // Use provided buffer if available, otherwise use original PDF buffer
            const bufferToUse = customArrayBuffer || pdfInfo?.info?.arrayBuffer;

            // Check if we have a buffer and pdfDoc is initialized
            if (!bufferToUse || !pdfDoc) {
                setError("No PDF data available or PDF document not loaded");
                console.error("compressPdf check failed:", {
                    hasCustomBuffer: !!customArrayBuffer,
                    hasPdfInfoBuffer: !!pdfInfo?.info?.arrayBuffer,
                    pdfDocExists: !!pdfDoc,
                });
                return null;
            }

            setIsLoading(true);

            try {
                // Map compression level to JPEG quality
                const qualityMap = {
                    low: 0.9, // 90% quality - minimal compression
                    medium: 0.7, // 70% quality - balanced compression
                    high: 0.5, // 50% quality - maximum compression
                };
                const jpegQuality = qualityMap[compressionLevel] || 0.7; // Default to medium if invalid
                
                // If we're compressing a custom buffer, we need to load it first
                let documentToCompress = pdfDoc;
                if (customArrayBuffer) {
                    documentToCompress = await pdfjsLib.getDocument({data: customArrayBuffer}).promise;
                }
                
                // Create a new PDF document using pdf-lib (directly via worker)
                const PDFDoc = await comlinkApiRef.current.createNewPdfDocument();
                
                // Process each page
                const totalPages = documentToCompress.numPages;
                
                for (let i = 1; i <= totalPages; i++) {
                    // Report progress if callback provided
                    if (progressCallback && typeof progressCallback === 'function') {
                        progressCallback(i, totalPages);
                    }
                    
                    // Get the page from PDF.js
                    const page = await documentToCompress.getPage(i);
                    const viewport = page.getViewport({ scale: 2 }); // Higher scale for better quality
                    
                    // Create a canvas in the main thread for rendering
                    const canvas = document.createElement('canvas');
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;
                    const context = canvas.getContext('2d');
                    
                    // Render PDF page to canvas
                    await page.render({
                        canvasContext: context,
                        viewport: viewport,
                    }).promise;
                    
                    // Convert to JPEG with compression
                    const jpegDataUrl = canvas.toDataURL('image/jpeg', jpegQuality);
                    
                    // Convert data URL to array buffer for the worker
                    const jpegData = await fetch(jpegDataUrl).then(res => res.arrayBuffer());
                    
                    // Add page to PDF in the worker
                    await comlinkApiRef.current.addJpegToPdf(PDFDoc, jpegData, viewport.width/2, viewport.height/2);
                }
                
                // Save the PDF in the worker
                const result = await comlinkApiRef.current.savePdfDocument(PDFDoc, bufferToUse.byteLength);
                
                setIsLoading(false);
                
                if (result.success) {
                    console.log(
                        `PDF compressed with ${compressionLevel} level. Original: ${result.originalSize} bytes, Compressed: ${result.compressedSize} bytes`
                    );
                    return result.data;
                } else {
                    setError(result.error || "Failed to compress PDF");
                    return null;
                }
            } catch (err) {
                console.error("Error compressing PDF:", err);
                setError(
                    err.message ||
                        "An unexpected error occurred during compression"
                );
                setIsLoading(false);
                return null;
            }
        },
        [pdfInfo, pdfDoc, comlinkApiRef]
    );

    // Function to create PDF with pages in specific order (uses worker)
    const createPdfWithPageOrder = useCallback(
        async (pageOrder) => {
            if (!pdfInfo?.info?.arrayBuffer || !comlinkApiRef.current) {
                setError(
                    "No PDF loaded (missing buffer in info) or worker not initialized"
                );
                console.error("createPdfWithPageOrder check failed:", {
                    pdfInfo,
                    comlinkExists: !!comlinkApiRef.current,
                });
                return null;
            }

            setIsLoading(true);

            try {
                // Pass the buffer and page order to the worker
                const result =
                    await comlinkApiRef.current.createPdfWithPageOrder(
                        pdfInfo.info.arrayBuffer,
                        pageOrder
                    );

                setIsLoading(false);

                if (result.success) {
                    console.log(
                        `Created PDF with ${result.numPages} pages in specified order`
                    );
                    return result.data;
                } else {
                    setError(
                        result.error ||
                            "Failed to create PDF with specified page order"
                    );
                    return null;
                }
            } catch (err) {
                console.error("Error creating PDF with page order:", err);
                setError(err.message || "An unexpected error occurred");
                setIsLoading(false);
                return null;
            }
        },
        [pdfInfo, comlinkApiRef]
    );

    return {
        pdfFile,
        pdfInfo,
        setPdfInfo, // Expose setPdfInfo to allow resetting state when needed
        error,
        isLoading,
        uploadPdf,
        mergePdfFiles, // Add the new merge function
        generateThumbnailMainThread,
        removePages,
        compressPdf,
        createPdfWithPageOrder,
    };
}
