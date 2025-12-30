import React, { useRef } from "react";
import { useTranslation } from "react-i18next";

/**
 * Component for uploading PDF files
 * Supports multiple file uploads
 */
const FileUploader = ({ onFileSelect, isLoading }) => {
    const { t } = useTranslation();
    const fileInputRef = useRef(null);

    // Handler for file input change
    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        const pdfFiles = files.filter(file => file.type === "application/pdf");
        
        if (pdfFiles.length > 0) {
            onFileSelect(pdfFiles);
        }
    };

    // Handler for the drop zone
    const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (event.dataTransfer.files) {
            const files = Array.from(event.dataTransfer.files);
            const pdfFiles = files.filter(file => file.type === "application/pdf");
            
            if (pdfFiles.length > 0) {
                onFileSelect(pdfFiles);
            }
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };

    return (
        <div className="file-uploader">
            <div
                className="dropzone"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current.click()}
            >
                <div className="dropzone-content">
                    <p className="dropzone-title">{t('fileUploader.dropzone.title')}</p>
                    <p className="dropzone-subtitle">
                        {t('fileUploader.dropzone.subtitle')}
                    </p>
                    <button
                        className="select-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            fileInputRef.current.click();
                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? t('fileUploader.button.loading') : t('fileUploader.button.select')}
                    </button>
                </div>
            </div>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="application/pdf"
                onChange={handleFileChange}
                disabled={isLoading}
                multiple
            />
            <p className="privacy-note">
                {t('fileUploader.privacy')}
            </p>
        </div>
    );
};

export default FileUploader;
