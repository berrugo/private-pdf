import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

/**
 * Component to display PDF page thumbnails and allow selection for deletion
 */
const ThumbnailGallery = ({
    pdfInfo,
    pagesToKeep,
    onPagesToKeepChange,
    generateThumbnailMainThread,
}) => {
    // State to hold generated thumbnail data URLs { [pageNumber]: dataUrl }
    const [thumbnailDataUrls, setThumbnailDataUrls] = useState({});
    const [loadingThumbnails, setLoadingThumbnails] = useState([]);
    // State to track thumbnail size - desktop: 150-500px, mobile: 120-300px
    const [thumbnailSize, setThumbnailSize] = useState(150);
    // State to track drag-and-drop operations
    const [draggedPage, setDraggedPage] = useState(null);

    // Constants for thumbnail size limits
    const DESKTOP_MIN = 150;
    const DESKTOP_MAX = 500;
    const MOBILE_MIN = 120;
    const MOBILE_MAX = 300;
    const SIZE_STEP = 50; // Step size for zoom

    // Detect if mobile view based on window width
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    // Update mobile state on window resize
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // Load all thumbnails when PDF info changes or generate function is available
    useEffect(() => {
        // Reset state when pdfInfo changes
        setThumbnailDataUrls({});
        setLoadingThumbnails([]);
        console.log("[ThumbnailGallery] useEffect running. pdfInfo:", pdfInfo);
        console.log(
            "[ThumbnailGallery] generateThumbnailMainThread prop value:",
            generateThumbnailMainThread
        );

        // Correct the condition to check pdfInfo.info.numPages
        if (pdfInfo?.info?.numPages && generateThumbnailMainThread) {
            console.log(
                "[ThumbnailGallery] Conditions met, starting thumbnail load."
            );
            // Use the correct path for numPages here too
            const pageNumbers = Array.from(
                { length: pdfInfo.info.numPages },
                (_, i) => i + 1
            );
            setLoadingThumbnails(pageNumbers); // Set loading state for all pages

            // Generate thumbnails for all pages using the main thread function
            const loadThumbnails = async () => {
                console.log(
                    "[ThumbnailGallery] loadThumbnails called for pages:",
                    pageNumbers
                );
                for (const pageNumber of pageNumbers) {
                    // No need to check thumbnailDataUrls here, as we reset it above
                    console.log(
                        `[ThumbnailGallery] Calling generateThumbnailMainThread for page ${pageNumber}`
                    );
                    const result = await generateThumbnailMainThread(
                        pageNumber
                    );
                    console.log(
                        `[ThumbnailGallery] Result for page ${pageNumber}:`,
                        result
                    );
                    if (result.success) {
                        // Update state progressively
                        setThumbnailDataUrls((prev) => {
                            console.log(
                                `[ThumbnailGallery] Setting dataUrl for page ${pageNumber}`
                            );
                            return {
                                ...prev,
                                [pageNumber]: result.dataUrl,
                            };
                        });
                    } else {
                        console.error(
                            `Failed to generate thumbnail (main thread) for page ${pageNumber}:`,
                            result.error
                        );
                        // Optionally set an error state for this specific thumbnail
                    }
                    setLoadingThumbnails((prev) => {
                        const nextLoading = prev.filter(
                            (num) => num !== pageNumber
                        );
                        console.log(
                            `[ThumbnailGallery] Updating loading state. Remaining: ${
                                nextLoading.length > 0
                                    ? nextLoading.join(", ")
                                    : "None"
                            }`
                        );
                        return nextLoading;
                    });
                }
                console.log("[ThumbnailGallery] loadThumbnails finished.");
            };

            loadThumbnails();
        }
    }, [pdfInfo, generateThumbnailMainThread]); // Rerun when pdfInfo or the function changes

    // Handle page removal - remove from pagesToKeep
    const handleCheckboxChange = (pageNumber) => {
        console.log("removing page", pageNumber);
        // We now only have removal functionality - remove the page from pagesToKeep
        if (pagesToKeep.includes(pageNumber) && pagesToKeep.length > 1) {
            // Remove it only if more than one page would remain
            onPagesToKeepChange(pagesToKeep.filter((p) => p !== pageNumber));
        } else if (pagesToKeep.length <= 1) {
            console.log("Cannot remove the last page");
        }
    };

    // Handle drag start - set the dragged page
    const handleDragStart = (e, pageNumber) => {
        console.log("Drag start:", pageNumber);

        // Only allow dragging selected pages (now all visible thumbnails)
        if (!pagesToKeep.includes(pageNumber)) {
            e.preventDefault();
            return false;
        }

        // Clean up any previous drag state
        const allThumbnails = document.querySelectorAll(".thumbnail-item");
        allThumbnails.forEach((el) => {
            el.classList.remove(
                "dragging",
                "drop-target",
                "drop-before",
                "drop-after"
            );
        });

        setDraggedPage(pageNumber);

        // Set drag ghost image appearance
        e.dataTransfer.effectAllowed = "move";

        // Required for Firefox and Safari compatibility
        e.dataTransfer.setData("text/plain", String(pageNumber));

        // Create a custom ghost image for better visual feedback
        if (e.currentTarget) {
            try {
                // Create a clone of the current element for the drag image
                const ghostElement = e.currentTarget.cloneNode(true);
                ghostElement.classList.add("thumbnail-ghost");
                ghostElement.style.width = "150px";
                ghostElement.style.height = "auto";
                ghostElement.style.transform = "rotate(3deg)";
                ghostElement.style.opacity = "0.9";

                // Add to DOM temporarily (hidden)
                ghostElement.style.position = "absolute";
                ghostElement.style.top = "-9999px";
                document.body.appendChild(ghostElement);

                // Set as drag image
                e.dataTransfer.setDragImage(ghostElement, 75, 75);

                // Remove after a delay
                setTimeout(() => {
                    document.body.removeChild(ghostElement);
                }, 100);
            } catch (err) {
                console.log("Error creating custom drag image:", err);
                // Fall back to default drag image if error occurs
            }

            // Add dragging class for styling
            setTimeout(() => {
                if (e.currentTarget) {
                    e.currentTarget.classList.add("dragging");
                }
            }, 0);
        }

        return true;
    };

    // Handle drag over - prevent default to allow drop and show visual cues
    const handleDragOver = (e, targetPageNumber) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";

        // Only process if we have a dragged page and it's not the same as target
        if (draggedPage && draggedPage !== targetPageNumber) {
            // Clear previous drop target indicators
            document
                .querySelectorAll(".drop-target, .drop-before, .drop-after")
                .forEach((el) => {
                    el.classList.remove(
                        "drop-target",
                        "drop-before",
                        "drop-after"
                    );
                });

            // Add visual indicators for the current drop target
            if (e.currentTarget) {
                e.currentTarget.classList.add("drop-target");

                // Determine if we're dropping before or after based on mouse position
                const rect = e.currentTarget.getBoundingClientRect();
                const mouseX = e.clientX;
                const elementCenterX = rect.left + rect.width / 2;

                if (mouseX < elementCenterX) {
                    e.currentTarget.classList.add("drop-before");
                } else {
                    e.currentTarget.classList.add("drop-after");
                }
            }
        }
    };

    // Handle drop - reorder pages
    const handleDrop = (e, targetPageNumber) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent event bubbling

        console.log("Drop event:", { draggedPage, targetPageNumber });

        // Do nothing if we're not dragging or dropping onto ourselves
        if (!draggedPage || draggedPage === targetPageNumber) {
            return;
        }

        console.log(
            "Reordering pages from",
            draggedPage,
            "to",
            targetPageNumber
        );

        // Create a copy of the current order
        const currentOrder = [...pagesToKeep];

        // If the dragged page isn't in the kept pages (shouldn't happen due to draggable check, but just in case)
        if (!currentOrder.includes(draggedPage)) {
            console.warn(
                "Tried to reorder a page that is not selected for keeping"
            );
            return;
        }

        // Clear all visual indicators
        document
            .querySelectorAll(".drop-target, .drop-before, .drop-after")
            .forEach((el) => {
                el.classList.remove("drop-target", "drop-before", "drop-after");
            });

        // Determine if we're dropping before or after based on mouse position
        let insertBeforeTarget = true;
        if (e.currentTarget) {
            const rect = e.currentTarget.getBoundingClientRect();
            const mouseX = e.clientX;
            const elementCenterX = rect.left + rect.width / 2;
            insertBeforeTarget = mouseX < elementCenterX;
        }

        // Remove the dragged page from the current position
        const draggedIndex = currentOrder.indexOf(draggedPage);
        currentOrder.splice(draggedIndex, 1);

        // Calculate the new index for insertion
        let insertIndex;

        if (currentOrder.includes(targetPageNumber)) {
            // If the target page is in the kept pages
            insertIndex = currentOrder.indexOf(targetPageNumber);
            // If dropping after and not before, adjust index
            if (!insertBeforeTarget) {
                insertIndex += 1;
            }
        } else {
            // If target is not in kept pages, insert at the end
            insertIndex = currentOrder.length;
        }

        // Insert at the new position
        currentOrder.splice(insertIndex, 0, draggedPage);

        console.log("New page order:", currentOrder);

        // Update the pages to keep with the new order
        onPagesToKeepChange(currentOrder);

        // Reset dragged page state
        setDraggedPage(null);
    };

    // Handle drag end - clean up
    const handleDragEnd = (e) => {
        console.log("Drag end");

        // Remove all drag-related classes from all thumbnails
        document.querySelectorAll(".thumbnail-item").forEach((el) => {
            el.classList.remove(
                "dragging",
                "drop-target",
                "drop-before",
                "drop-after"
            );
        });

        // Safely remove the class from the current element if it exists
        if (e && e.currentTarget) {
            e.currentTarget.classList.remove("dragging");
        }

        // Reset the dragged page state
        setDraggedPage(null);
    };

    // No theming variables needed with plain CSS

    // Handlers for zoom control
    const handleZoomIn = () => {
        setThumbnailSize((prev) => {
            const max = isMobile ? MOBILE_MAX : DESKTOP_MAX;
            return Math.min(prev + SIZE_STEP, max);
        });
    };

    const handleZoomOut = () => {
        setThumbnailSize((prev) => {
            const min = isMobile ? MOBILE_MIN : DESKTOP_MIN;
            return Math.max(prev - SIZE_STEP, min);
        });
    };

    // Use pdfInfo.info?.numPages for the map iteration as well
    if (!pdfInfo?.info?.numPages) return null;

    // Get current min and max values based on device type
    const minSize = isMobile ? MOBILE_MIN : DESKTOP_MIN;
    const maxSize = isMobile ? MOBILE_MAX : DESKTOP_MAX;

    return (
        <div>
            <div className="thumbnail-controls">
                <button
                    className="small-button"
                    onClick={handleZoomOut}
                    disabled={thumbnailSize <= minSize}
                    aria-label="Zoom out thumbnails"
                >
                    <span>-</span>
                </button>
                <span className="thumbnail-zoom-label">Size</span>
                <button
                    className="small-button"
                    onClick={handleZoomIn}
                    disabled={thumbnailSize >= maxSize}
                    aria-label="Zoom in thumbnails"
                >
                    <span>+</span>
                </button>
            </div>
            <div
                className="thumbnail-grid"
                style={{
                    gridTemplateColumns: `repeat(auto-fill, minmax(${thumbnailSize}px, 1fr))`,
                }}
            >
                {/* Render selected pages first in their custom order, then unselected pages */}
                {(() => {
                    // Get all pages
                    const allPages = Array.from(
                        { length: pdfInfo.info.numPages },
                        (_, i) => i + 1
                    );

                    // First render selected pages in their custom order
                    const orderedPages = [...pagesToKeep];

                    // Then add unselected pages
                    allPages.forEach((page) => {
                        if (!pagesToKeep.includes(page)) {
                            orderedPages.push(page);
                        }
                    });

                    return orderedPages;
                })().map((pageNumber) => {
                    const dataUrl = thumbnailDataUrls[pageNumber]; // Get dataUrl from local state
                    const isLoading = loadingThumbnails.includes(pageNumber);
                    // Checkbox is checked if the page is in the pagesToKeep array
                    const isSelected = pagesToKeep.includes(pageNumber);

                    // Skip rendering thumbnails that are not in pagesToKeep
                    if (!isSelected) {
                        return null;
                    }

                    return (
                        <div
                            key={pageNumber}
                            id="thumbnail-item"
                            className={`thumbnail-item selected ${
                                draggedPage === pageNumber ? "dragging" : ""
                            }`}
                            draggable={true}
                            onDragStart={(e) => handleDragStart(e, pageNumber)}
                            onDragOver={(e) => handleDragOver(e, pageNumber)}
                            onDragEnter={(e) =>
                                e.currentTarget.classList.add("drop-target")
                            }
                            onDragLeave={(e) =>
                                e.currentTarget.classList.remove(
                                    "drop-target",
                                    "drop-before",
                                    "drop-after"
                                )
                            }
                            onDrop={(e) => handleDrop(e, pageNumber)}
                            onDragEnd={(e) => handleDragEnd(e)}
                        >
                            {/* Add a dedicated remove button that floats in the top-right corner - only if more than 1 page would remain */}
                            {pagesToKeep.length > 1 && (
                                <button
                                    type="button"
                                    className="thumbnail-remove-btn"
                                    onClick={() => {
                                        console.log('Remove button clicked for page', pageNumber);
                                        handleCheckboxChange(pageNumber);
                                    }}
                                    aria-label="Remove page"
                                >
                                    ×
                                </button>
                            )}
                            <div
                                className={`thumbnail-image-container ${
                                    isLoading ? "loading" : ""
                                }`}
                            >
                                {isLoading ? (
                                    <div className="thumbnail-skeleton"></div>
                                ) : (
                                    dataUrl && (
                                        <div className="thumbnail-image-wrapper">
                                            <img
                                                src={dataUrl} // Use dataUrl
                                                alt={`Page ${pageNumber}`}
                                                className="thumbnail-image"
                                            />
                                        </div>
                                    )
                                )}
                            </div>

                            <div className="thumbnail-info">
                                <p>Page {pageNumber}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

ThumbnailGallery.propTypes = {
    pdfInfo: PropTypes.object,
    // Updated prop types
    pagesToKeep: PropTypes.arrayOf(PropTypes.number).isRequired,
    onPagesToKeepChange: PropTypes.func.isRequired,
    generateThumbnailMainThread: PropTypes.func.isRequired,
};

export default ThumbnailGallery;
