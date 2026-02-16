import React from "react";
import { useTranslation } from "react-i18next";
import Footer from "./Footer";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeSwitcher from "./ThemeSwitcher";
import {
    FileText,
    ArrowRight,
    Upload,
    Shuffle,
    Minimize2,
    Users,
    Award,
    TrendingUp,
} from "lucide-react";

const LandingPage = ({ onFileSelect, isLoading }) => {
    const { t } = useTranslation();
    const steps = [
        {
            icon: <Upload className="w-6 h-6" />,
            title: t('landing.steps.upload.title'),
            description: t('landing.steps.upload.description'),
        },
        {
            icon: <Shuffle className="w-6 h-6" />,
            title: t('landing.steps.choose.title'),
            description: t('landing.steps.choose.description'),
        },
        {
            icon: <Minimize2 className="w-6 h-6" />,
            title: t('landing.steps.process.title'),
            description: t('landing.steps.process.description'),
        },
    ];

    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files);
        const pdfFiles = files.filter(
            (file) => file.type === "application/pdf"
        );

        if (pdfFiles.length > 0) {
            onFileSelect(pdfFiles);
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (event.dataTransfer.files) {
            const files = Array.from(event.dataTransfer.files);
            const pdfFiles = files.filter(
                (file) => file.type === "application/pdf"
            );

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
        <div className="landing-page visible">
            {/* Navigation Header */}
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
                        <span className="brand-text">{t('nav.brand')}</span>
                    </div>
                    <div className="nav-links">
                        <ThemeSwitcher />
                        <LanguageSwitcher />
                        <a href="#features" className="nav-link">
                            {t('nav.features')}
                        </a>
                        <a href="#how-it-works" className="nav-link">
                            {t('nav.howItWorks')}
                        </a>
                        <button
                            className="nav-cta-button"
                            onClick={() =>
                                document.querySelector(".file-input").click()
                            }
                        >
                            {t('nav.getStarted')}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section-new">
                <div className="hero-container">
                    <div className="hero-content-center">
                        <h1 className="hero-title-new">
                            {t('landing.hero.title')}
                            <br />
                            <span className="gradient-text-new">
                                {t('landing.hero.title_low')}
                            </span>
                        </h1>

                        <p className="hero-description-new">
                            {t('landing.hero.subtitle')}
                        </p>

                        <div className="hero-buttons">
                            <button
                                className="primary-cta-button"
                                onClick={() =>
                                    document
                                        .querySelector(".file-input")
                                        .click()
                                }
                                disabled={isLoading}
                            >
                                {isLoading ? t('landing.hero.processing') : t('landing.hero.uploadButton')}
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="hero-upload-section">
                            <div
                                className="upload-dropzone-new"
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                            >
                                <div className="upload-icon-new">
                                    <Upload className="w-8 h-8 text-purple-600" />
                                </div>
                                <h3>{t('landing.dropzone.title')}</h3>
                                <p>{t('landing.dropzone.subtitle')}</p>
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    multiple
                                    onChange={handleFileUpload}
                                    disabled={isLoading}
                                    className="file-input"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section - Updated Design */}
            <section id="features" className="features-section-updated">
                <div className="features-container-updated">
                    <div className="features-header-updated">
                        <h2>{t('landing.features.heading')}</h2>
                        <p>
                            {t('landing.features.description')}
                        </p>
                    </div>

                    <div className="features-grid-updated">
                        <div className="feature-card-updated">
                            <div className="feature-icon-updated">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                                </svg>
                            </div>
                            <h3>{t('landing.features.private.title')}</h3>
                            <p>
                                {t('landing.features.private.description')}
                            </p>
                        </div>

                        <div className="feature-card-updated">
                            <div className="feature-icon-updated">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                                </svg>
                            </div>
                            <h3>{t('landing.features.fast.title')}</h3>
                            <p>
                                {t('landing.features.fast.description')}
                            </p>
                        </div>

                        <div className="feature-card-updated">
                            <div className="feature-icon-updated">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                                    <path d="M9 18c-4.51 2-5-2-7-2" />
                                </svg>
                            </div>
                            <h3>{t('landing.features.openSource.title')}</h3>
                            <p>
                                {t('landing.features.openSource.description')}
                            </p>
                        </div>

                        <div className="feature-card-updated">
                            <div className="feature-icon-updated">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32"
                                    height="32"
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
                            <h3>{t('landing.features.fullFeatured.title')}</h3>
                            <p>
                                {t('landing.features.fullFeatured.description')}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="how-it-works-section-new">
                <div className="section-container">
                    <div className="section-header-new">
                        <h2>{t('landing.howItWorks.heading')}</h2>
                        <p>{t('landing.howItWorks.description')}</p>
                    </div>

                    <div className="steps-container-new">
                        {steps.map((step, index) => (
                            <div key={index} className="step-item-new">
                                <div className="step-number-new">
                                    {String(index + 1).padStart(2, "0")}
                                </div>
                                <h3>{step.title}</h3>
                                <p>{step.description}</p>
                                {index < steps.length - 1 && (
                                    <div className="step-arrow">
                                        <ArrowRight className="w-6 h-6" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section-new">
                <div className="cta-container">
                    <div className="cta-content-new">
                        <h2>{t('landing.cta.heading')}</h2>
                        <p>
                            {t('landing.cta.description')}
                        </p>
                        <div className="cta-buttons-new">
                            <button
                                className="cta-primary-button"
                                onClick={() =>
                                    document
                                        .querySelector(".file-input")
                                        .click()
                                }
                                disabled={isLoading}
                            >
                                {t('landing.cta.button')}
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default LandingPage;
