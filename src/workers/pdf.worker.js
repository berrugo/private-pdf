/*
 * PDF processing worker script using Comlink and pdf.js / pdf-lib
 * It runs in a separate thread to keep the UI responsive
 */

import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs';
import { PDFDocument } from 'pdf-lib';
import { expose } from 'comlink';

// Attempt to set workerSrc *within* the worker, pointing to the
// standard pdf.js worker file relative to this worker's location.
// This assumes a standard node_modules layout accessible via relative paths.
try {
    // Construct the URL relative to the current worker script's URL
    const pdfJsWorkerUrl = new URL(
        "../../node_modules/pdfjs-dist/build/pdf.worker.mjs",
        import.meta.url
    ).href;
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfJsWorkerUrl;
    console.log(
        '[Worker] Set pdfjsLib.GlobalWorkerOptions.workerSrc to:',
        pdfJsWorkerUrl
    );
} catch (e) {
    console.error('[Worker] Failed to construct pdf.worker.mjs URL:', e);
    // Fallback or alternative path might be needed if relative path fails
}

// We don't need the OffscreenCanvasFactory anymore as we're rendering on the main thread

// Methods exposed to the main thread
const pdfWorker = {
    /**
     * Load a PDF document from an ArrayBuffer
     * @param {ArrayBuffer} arrayBuffer - PDF file content
     * @returns {Promise<{success: boolean, numPages?: number, error?: string}>}
     */
    async loadPDF(arrayBuffer) {
        try {
            // ** Create copies immediately **
            const bufferForPdfjs = arrayBuffer.slice(0);
            const bufferForPdfLib = arrayBuffer.slice(0);

            // Log the workerSrc value *inside* the worker for debugging
            console.log(
                "[Worker] pdfjsLib.GlobalWorkerOptions.workerSrc:",
                pdfjsLib.GlobalWorkerOptions.workerSrc
            );
            console.log("[Worker] pdfjsLib version:", pdfjsLib.version);

            // Load with pdf.js for rendering, disabling nested workers
            const pdfJsDoc = await pdfjsLib.getDocument({
                data: bufferForPdfjs, // <--- Use copy
                disableWorker: true, // IMPORTANT: Prevents worker-in-worker
                verbosity: 0, // Optional: reduce console noise
            }).promise;

            // Also load with pdf-lib for editing - use its own copy
            await PDFDocument.load(bufferForPdfLib); // <--- Use copy

            // Basic PDF info
            const info = {
                numPages: pdfJsDoc.numPages,
                fingerprint: pdfJsDoc.fingerprint,
                pageInfos: [],
            };

            // Extract info for each page
            for (let i = 1; i <= pdfJsDoc.numPages; i++) {
                const page = await pdfJsDoc.getPage(i);
                const viewport = page.getViewport({ scale: 1.0 });

                info.pageInfos.push({
                    pageNumber: i,
                    width: viewport.width,
                    height: viewport.height,
                    rotation: viewport.rotation,
                });
            }

            // Calculate file size in bytes
            const fileSizeBytes = arrayBuffer.byteLength;

            return {
                success: true,
                info: {
                    numPages: pdfJsDoc.numPages,
                    pageInfos: info.pageInfos,
                    fingerprint: pdfJsDoc.fingerprint,
                    arrayBuffer: arrayBuffer,
                    fileSizeBytes: fileSizeBytes,
                },
            };
        } catch (error) {
            console.error('Error loading PDF in worker:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Create a new PDF with selected pages removed
     * @param {ArrayBuffer} arrayBuffer - The original PDF file content
     * @param {number[]} pagesToRemove - Array of page numbers to remove (1-based)
     * @returns {Promise<Object>} - Modified PDF data
     */
    async removePages(arrayBuffer, pagesToRemove) {
        try {
            // Load the PDF document
            const pdfDoc = await PDFDocument.load(arrayBuffer);

            // Sort page indices in descending order to avoid index shifting issues
            const pageIndicesToRemove = [...pagesToRemove]
                .map((pageNum) => pageNum - 1) // Convert from 1-based to 0-based
                .sort((a, b) => b - a); // Sort in descending order

            // Remove the pages
            for (const pageIndex of pageIndicesToRemove) {
                if (pageIndex >= 0 && pageIndex < pdfDoc.getPageCount()) {
                    pdfDoc.removePage(pageIndex);
                }
            }

            // Save the modified PDF
            const pdfBytes = await pdfDoc.save();

            return {
                success: true,
                data: pdfBytes,
                numPages: pdfDoc.getPageCount(),
                arrayBuffer: arrayBuffer,
            };
        } catch (error) {
            console.error('Error removing pages in worker:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Create a new empty PDF document (helper for main thread compression)
     * @returns {Promise<string>} - PDF document ID to reference in subsequent calls
     */
    async createNewPdfDocument() {
        try {
            // Create a new PDF document
            const newPdfDoc = await PDFDocument.create();
            
            // Generate a unique ID for this document
            const docId = `pdf_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
            
            // Store the document reference in memory for later use
            // We can't transfer the PDFDocument object directly, so we'll work with IDs
            this._pdfDocuments = this._pdfDocuments || {};
            this._pdfDocuments[docId] = newPdfDoc;
            
            return docId;
        } catch (error) {
            console.error('Error creating new PDF document:', error);
            throw error;
        }
    },
    
    /**
     * Add a JPEG image as a page to a PDF document
     * @param {string} docId - The PDF document ID
     * @param {ArrayBuffer} jpegData - The JPEG image data
     * @param {number} width - The width of the page
     * @param {number} height - The height of the page
     * @returns {Promise<boolean>} - Success indicator
     */
    async addJpegToPdf(docId, jpegData, width, height) {
        try {
            // Get the document from the stored references
            const pdfDoc = this._pdfDocuments && this._pdfDocuments[docId];
            if (!pdfDoc) {
                throw new Error(`PDF document with ID ${docId} not found`);
            }
            
            // Embed the JPEG image in the PDF
            const image = await pdfDoc.embedJpg(jpegData);
            
            // Add a page with the specified dimensions
            const page = pdfDoc.addPage([width, height]);
            
            // Draw the image to fill the page
            page.drawImage(image, {
                x: 0,
                y: 0,
                width: page.getWidth(),
                height: page.getHeight(),
            });
            
            return true;
        } catch (error) {
            console.error('Error adding JPEG to PDF:', error);
            throw error;
        }
    },
    
    /**
     * Save a PDF document and remove it from memory
     * @param {string} docId - The PDF document ID
     * @param {number} originalSize - The original file size for reporting
     * @returns {Promise<Object>} - The saved PDF data
     */
    async savePdfDocument(docId, originalSize) {
        try {
            // Get the document from the stored references
            const pdfDoc = this._pdfDocuments && this._pdfDocuments[docId];
            if (!pdfDoc) {
                return { success: false, error: `PDF document with ID ${docId} not found` };
            }
            
            // Save the PDF
            const pdfBytes = await pdfDoc.save();
            
            // Clean up the reference
            delete this._pdfDocuments[docId];
            
            return {
                success: true,
                data: pdfBytes,
                originalSize: originalSize,
                compressedSize: pdfBytes.byteLength,
            };
        } catch (error) {
            console.error('Error saving PDF document:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Create a new PDF with pages in the specified order
     * @param {ArrayBuffer} arrayBuffer - The original PDF file content
     * @param {number[]} pageOrder - Array of page numbers in the desired order (1-based)
     * @returns {Promise<Object>} - Modified PDF data
     */
    async createPdfWithPageOrder(arrayBuffer, pageOrder) {
        try {
            // Load the original PDF document
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            // Create a new PDF document
            const newPdfDoc = await PDFDocument.create();

            // Copy each page in the specified order
            for (const pageNumber of pageOrder) {
                const pageIndex = pageNumber - 1; // Convert to 0-based index

                if (pageIndex >= 0 && pageIndex < pdfDoc.getPageCount()) {
                    // Copy the page from source to new document
                    const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [
                        pageIndex,
                    ]);
                    // Add the copied page to the new document
                    newPdfDoc.addPage(copiedPage);
                } else {
                    console.warn(
                        `Page ${pageNumber} is out of range and will be skipped`
                    );
                }
            }

            // Save the new PDF
            const pdfBytes = await newPdfDoc.save();

            return {
                success: true,
                data: pdfBytes,
                numPages: newPdfDoc.getPageCount(),
                originalOrder: pageOrder,
            };
        } catch (error) {
            console.error(
                'Error creating PDF with page order in worker:',
                error
            );
            return { success: false, error: error.message };
        }
    },

    /**
     * Merge multiple PDF documents into a single document
     * @param {ArrayBuffer[]} arrayBuffers - Array of PDF file contents
     * @returns {Promise<Object>} - Merged PDF data and information
     */
    async mergePdfs(arrayBuffers) {
        try {
            if (!arrayBuffers || arrayBuffers.length === 0) {
                return { success: false, error: 'No PDF buffers provided' };
            }

            // Create a new PDF document that will contain all pages
            const mergedPdf = await PDFDocument.create();
            
            // Store information about each page's source document
            const pageInfos = [];
            
            // Total size for reporting
            let totalSize = 0;
            
            // Track the page offset as we process each document
            let pageOffset = 0;
            
            // Process each PDF buffer
            for (let i = 0; i < arrayBuffers.length; i++) {
                const buffer = arrayBuffers[i];
                totalSize += buffer.byteLength;
                
                try {
                    // Load the PDF document
                    const pdfDoc = await PDFDocument.load(buffer);
                    const pdfJsDoc = await pdfjsLib.getDocument({
                        data: buffer.slice(0),
                        disableWorker: true,
                    }).promise;
                    
                    // Get all pages from the source document
                    const pageCount = pdfDoc.getPageCount();
                    const pageIndices = Array.from(Array(pageCount).keys());
                    
                    // Copy all pages to the merged document
                    const copiedPages = await mergedPdf.copyPages(pdfDoc, pageIndices);
                    copiedPages.forEach(page => {
                        mergedPdf.addPage(page);
                    });
                    
                    // Collect page info for each page
                    for (let j = 1; j <= pdfJsDoc.numPages; j++) {
                        const page = await pdfJsDoc.getPage(j);
                        const viewport = page.getViewport({ scale: 1.0 });
                        
                        pageInfos.push({
                            pageNumber: pageOffset + j,
                            width: viewport.width,
                            height: viewport.height,
                            rotation: viewport.rotation,
                            originalDocument: i, // Track which document this page came from
                            originalPage: j      // Original page number in source document
                        });
                    }
                    
                    // Update page offset for the next document
                    pageOffset += pageCount;
                    
                } catch (err) {
                    console.error(`Error processing PDF at index ${i}:`, err);
                    // Continue with other PDFs even if one fails
                }
            }
            
            // Save the merged PDF
            const mergedPdfBytes = await mergedPdf.save();
            
            return {
                success: true,
                data: mergedPdfBytes,
                info: {
                    numPages: mergedPdf.getPageCount(),
                    pageInfos: pageInfos,
                    fileSizeBytes: mergedPdfBytes.byteLength,
                    originalSize: totalSize,
                    documentCount: arrayBuffers.length
                }
            };
            
        } catch (error) {
            console.error('Error merging PDFs in worker:', error);
            return { success: false, error: error.message };
        }
    },
};

// Expose the worker functions to the main thread
expose(pdfWorker);
