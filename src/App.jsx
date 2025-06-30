import { useState, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist/build/pdf.mjs";
import { usePdfProcessor } from "./hooks/usePdfProcessor";
import LandingPage from "./components/LandingPage";
import Footer from "./components/Footer";
import FileUploader from "./components/FileUploader";
import ThumbnailGallery from "./components/ThumbnailGallery";
import "./App.css";

try {
    // Use import.meta.url to resolve the path relative to the current module
    const workerSrcUrl = new URL(
        "../node_modules/pdfjs-dist/build/pdf.worker.mjs",
        import.meta.url
    ).href;
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrcUrl;
    console.log(
        "[App] Set pdfjsLib.GlobalWorkerOptions.workerSrc to:",
        workerSrcUrl
    );
} catch (e) {
    console.error("[App] Failed to set pdf.worker.mjs URL:", e);
    // Handle the error appropriately, maybe show a message to the user
}

// Helper function to format file size in KB or MB
const formatFileSize = (bytes) => {
    if (!bytes) return "";

    // Convert to KB for files less than 1MB
    if (bytes < 1024 * 1024) {
        const kb = (bytes / 1024).toFixed(1);
        return `${kb} KB`;
    }

    // Convert to MB for larger files
    const mb = (bytes / (1024 * 1024)).toFixed(1);
    return `${mb} MB`;
};

function App() {
    // State for managing multiple files
    const [pdfFiles, setPdfFiles] = useState([]);
    // Rename state: pages to remove -> pages to keep
    const [pagesToKeep, setPagesToKeep] = useState([]);
    // Add state for compression level
    const [compressionLevel, setCompressionLevel] = useState("medium");
    const [processingStatus, setProcessingStatus] = useState(null);
    const [processingProgress, setProcessingProgress] = useState(0);
    // Add state to control landing page visibility
    const [showLandingPage, setShowLandingPage] = useState(true);

    // Use our custom PDF processor hook
    const {
        pdfFile,
        pdfInfo,
        setPdfInfo,
        error,
        isLoading,
        uploadPdf,
        mergePdfFiles, // Use the new merge function
        generateThumbnailMainThread,
        compressPdf,
        createPdfWithPageOrder,
    } = usePdfProcessor();

    // Reset selected pages when PDF changes - now select ALL pages initially
    useEffect(() => {
        if (pdfInfo?.info?.numPages) {
            const allPages = Array.from(
                { length: pdfInfo.info.numPages },
                (_, i) => i + 1
            );
            setPagesToKeep(allPages);
        } else {
            setPagesToKeep([]);
        }
    }, [pdfInfo]);

    // Handle file selection for multiple files
    const handleFileSelect = async (files) => {
        if (!files || files.length === 0) return;

        // Hide landing page when files are selected
        setShowLandingPage(false);

        // Store the list of files for reference
        setPdfFiles(files);

        // If only one file, use normal upload function
        if (files.length === 1) {
            try {
                await uploadPdf(files[0]);
                console.log("PDF loaded successfully!");
            } catch (err) {
                console.error("Error caught in App during uploadPdf:", err);
            }
            return;
        }

        // For multiple files, merge them into one document
        try {
            await mergePdfFiles(files);
            console.log(`${files.length} PDFs merged successfully!`);
        } catch (err) {
            console.error("Error caught in App during mergePdfFiles:", err);
        }
    };

    // Handle page selection for deletion -> keeping
    const handlePagesToKeepChange = (newPagesToKeep) => {
        setPagesToKeep(newPagesToKeep);
    };

    // Handle saving the modified PDF
    const handleSavePdf = async () => {
        // Check if trying to keep zero pages
        if (!pdfInfo || pagesToKeep.length === 0) {
            console.log("Must keep at least one page"); // Updated message
            return;
        }

        // Initialize progress tracking
        setProcessingStatus("Starting PDF processing...");
        setProcessingProgress(5);
        let resultPdfBytes;

        try {
            // Create a new PDF with pages in the order specified by pagesToKeep
            console.log("Creating PDF with pages in this order:", pagesToKeep);
            setProcessingStatus(`Reordering ${pagesToKeep.length} pages...`);
            setProcessingProgress(15);

            // Use the new createPdfWithPageOrder function instead of removePages
            // This will create a PDF with only the kept pages in the exact order specified
            resultPdfBytes = await createPdfWithPageOrder(pagesToKeep);

            setProcessingProgress(35);

            // If we don't get resultPdfBytes back from the worker, log and return
            if (!resultPdfBytes) {
                console.error("Failed to create PDF with specified page order");
                setProcessingStatus(
                    "Error: Failed to create PDF with specified page order"
                );
                setProcessingProgress(0);
                return;
            }

            // Always make a defensive copy of the resultPdfBytes to prevent detachment issues
            resultPdfBytes = resultPdfBytes.slice(0);
            setProcessingProgress(40);

            // Now apply compression through PDF to JPEG to PDF conversion on the modified PDF
            setProcessingStatus(`Applying ${compressionLevel} compression...`);
            console.log(
                `Applying ${compressionLevel} compression to modified PDF...`
            );

            // Create a fresh copy of the buffer for compression
            const modifiedArrayBuffer = resultPdfBytes.slice(0);
            setProcessingProgress(50);

            // Progress callback for compression
            const compressionProgressCallback = (page, totalPages) => {
                const baseProgress = 50;
                const progressPerPage = 40 / totalPages;
                const currentProgress = baseProgress + progressPerPage * page;
                setProcessingStatus(
                    `Compressing page ${page} of ${totalPages}...`
                );
                setProcessingProgress(Math.min(90, currentProgress));
            };

            // Pass the modified PDF bytes to compression instead of the original
            const compressedPdfBytes = await compressPdf(
                compressionLevel,
                modifiedArrayBuffer,
                compressionProgressCallback
            );

            if (compressedPdfBytes) {
                // Make a defensive copy of the compressed bytes to prevent detachment
                resultPdfBytes = compressedPdfBytes.slice(0);
                setProcessingProgress(92);
                setProcessingStatus("Preparing download...");
            } else {
                console.warn("Compression failed, using uncompressed PDF");
                setProcessingStatus(
                    "Compression failed, using uncompressed PDF"
                );
                // Continue with the uncompressed PDF if compression fails
            }

            if (resultPdfBytes) {
                setProcessingProgress(95);
                setProcessingStatus("Creating download link...");

                // Create a Blob from the PDF data
                const blob = new Blob([resultPdfBytes], {
                    type: "application/pdf",
                });

                // Create a download link
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);

                // Set a filename using the pdfFile state
                const originalName = pdfFile?.name || "document.pdf"; // Use pdfFile state
                const extension = originalName.includes(".")
                    ? originalName.slice(originalName.lastIndexOf("."))
                    : ".pdf"; // Default extension if none found
                const baseName = originalName.slice(
                    0,
                    originalName.lastIndexOf(".")
                );
                link.download = `${baseName}-modified${extension}`;

                // Trigger the download
                document.body.appendChild(link);

                setProcessingProgress(100);
                setProcessingStatus("Download ready!");

                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(link.href); // Clean up

                console.log("PDF saved successfully");

                // Reset progress after a short delay
                setTimeout(() => {
                    setProcessingProgress(0);
                    setProcessingStatus(null);
                }, 2000);
            }
        } catch (err) {
            console.error("Error saving PDF:", err);
            setProcessingStatus(
                `Error: ${err.message || "Failed to process PDF"}`
            );
            setProcessingProgress(0);

            // Reset error state after a delay
            setTimeout(() => {
                setProcessingStatus(null);
            }, 5000);
        }
    };

    // Handle returning to landing page
    const handleReturnToLanding = () => {
        setShowLandingPage(true);
        setPdfFiles([]);
        setPdfInfo(null);
        setPagesToKeep([]);
        setProcessingStatus(null);
        setProcessingProgress(0);
    };

    // Show landing page if no PDF is loaded or if explicitly requested
    if (showLandingPage && !pdfInfo) {
        return (
            <LandingPage
                onFileSelect={handleFileSelect}
                isLoading={isLoading}
            />
        );
    }

    return (
        <>
            <nav className="nav-header">
                <div className="nav-container">
                    <div className="nav-brand">
                        <div className="nav-brand-icon">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                                <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                                <path d="M10 9H8" />
                                <path d="M16 13H8" />
                                <path d="M16 17H8" />
                            </svg>
                        </div>
                        <span className="brand-text">PrivatePDF</span>
                    </div>
                </div>
            </nav>
            <div className="app-container">
                <div className="content-container">
                    <div className="header">
                        <p className="subtitle"></p>
                    </div>

                    {!pdfInfo ? (
                        <FileUploader
                            onFileSelect={handleFileSelect}
                            isLoading={isLoading}
                        />
                    ) : (
                        <div className="editor-container">
                            {pdfFiles.length > 1 && pdfInfo?.info?.isMerged && (
                                <div className="file-selector-container">
                                    <h3>Merged PDFs ({pdfFiles.length})</h3>
                                    <div className="merged-files-list">
                                        {pdfFiles.map((file, index) => (
                                            /* Display file item with tooltip showing full filename on hover */
                                            <div
                                                key={`file-${index}`}
                                                className="merged-file-item"
                                                data-tooltip={file.name}
                                            >
                                                <span className="file-icon">
                                                    📄
                                                </span>
                                                <span className="file-name">
                                                    {file.name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="merge-note">
                                        All pages from these PDFs have been
                                        merged into a single document. Rearrange
                                        pages as needed.
                                    </p>
                                </div>
                            )}
                            <div className="editor-header">
                                <div>
                                    <h2>
                                        {pdfInfo?.info?.isMerged
                                            ? "Merged Document"
                                            : pdfFile?.name || "PDF Document"}
                                    </h2>
                                    <p className="page-count">
                                        {pdfInfo.info.numPages} page
                                        {pdfInfo.info.numPages !== 1 ? "s" : ""}
                                        {pdfInfo.info.fileSizeBytes && (
                                            <span
                                                style={{
                                                    display: "inline-block",
                                                    marginLeft: "5px",
                                                    color: "var(--text-secondary, #666)",
                                                    fontSize: "0.9rem",
                                                }}
                                            >
                                                {" • "}
                                                {formatFileSize(
                                                    pdfInfo.info.fileSizeBytes
                                                )}
                                            </span>
                                        )}
                                    </p>
                                </div>

                                <div className="compression-options">
                                    <p className="option-label">
                                        Compression Level:
                                    </p>
                                    <div className="compression-controls">
                                        <label className="compression-option">
                                            <input
                                                type="radio"
                                                name="compressionLevel"
                                                value="low"
                                                checked={
                                                    compressionLevel === "low"
                                                }
                                                onChange={(e) =>
                                                    setCompressionLevel(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            Low{" "}
                                            <span className="compression-hint">
                                                (Better Quality)
                                            </span>
                                        </label>
                                        <label className="compression-option">
                                            <input
                                                type="radio"
                                                name="compressionLevel"
                                                value="medium"
                                                checked={
                                                    compressionLevel ===
                                                    "medium"
                                                }
                                                onChange={(e) =>
                                                    setCompressionLevel(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            Medium{" "}
                                            <span className="compression-hint">
                                                (Balanced)
                                            </span>
                                        </label>
                                        <label className="compression-option">
                                            <input
                                                type="radio"
                                                name="compressionLevel"
                                                value="high"
                                                checked={
                                                    compressionLevel === "high"
                                                }
                                                onChange={(e) =>
                                                    setCompressionLevel(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            High{" "}
                                            <span className="compression-hint">
                                                (Smaller Files)
                                            </span>
                                        </label>
                                    </div>
                                    <p className="compression-description">
                                        Higher compression reduces file size but
                                        may lower image quality. The PDF will be
                                        converted to JPEG images and back to PDF
                                        for compression.
                                    </p>
                                </div>

                                {/* Progress bar for PDF processing */}
                                {processingProgress > 0 && (
                                    <div className="progress-container">
                                        <div
                                            className="progress-bar"
                                            style={{
                                                width: `${processingProgress}%`,
                                            }}
                                        ></div>
                                        <div className="progress-status">
                                            {processingStatus}
                                        </div>
                                    </div>
                                )}

                                <div className="button-group">
                                    <button
                                        className="primary-button"
                                        onClick={handleSavePdf}
                                        disabled={processingProgress > 0}
                                    >
                                        {processingProgress > 0
                                            ? `${
                                                  processingStatus ||
                                                  "Processing..."
                                              }`
                                            : isLoading
                                            ? "Processing..."
                                            : "Save Modified PDF"}
                                    </button>
                                    <button
                                        className="outline-button"
                                        onClick={() => {
                                            // Reset now means selecting all pages again
                                            if (pdfInfo.info.numPages) {
                                                const allPages = Array.from(
                                                    {
                                                        length: pdfInfo.info
                                                            .numPages,
                                                    },
                                                    (_, i) => i + 1
                                                );
                                                setPagesToKeep(allPages);
                                            }
                                        }}
                                    >
                                        Reset PDF
                                    </button>
                                    <button
                                        className="outline-button"
                                        onClick={handleReturnToLanding}
                                    >
                                        Upload New Files
                                    </button>
                                </div>
                            </div>

                            <hr className="divider" />

                            <div className="thumbnail-section">
                                <div className="thumbnail-header">
                                    <p className="selection-info">
                                        Drag and drop pages to rearrange the
                                        document and remove pages you don't need
                                    </p>
                                </div>

                                <ThumbnailGallery
                                    pdfInfo={pdfInfo}
                                    // Pass pagesToKeep state and handler
                                    pagesToKeep={pagesToKeep}
                                    onPagesToKeepChange={
                                        handlePagesToKeepChange
                                    }
                                    generateThumbnailMainThread={
                                        generateThumbnailMainThread
                                    }
                                />
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="error-container">
                            <p>
                                <strong>Error:</strong>
                            </p>
                            <p>{error}</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}

export default App;
