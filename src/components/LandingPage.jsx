import React, { useState, useEffect } from 'react';
import { 
    Shield, 
    Zap, 
    Download, 
    FileText, 
    Lock, 
    Eye, 
    Star,
    CheckCircle,
    ArrowRight,
    Upload,
    Shuffle,
    Minimize2,
    Users,
    Award,
    TrendingUp,
    Github
} from 'lucide-react';

const LandingPage = ({ onFileSelect, isLoading }) => {
    const [activeFeature, setActiveFeature] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const features = [
        {
            icon: <Shield className="w-8 h-8" />,
            title: "100% Private",
            description: "All processing happens in your browser. No files ever leave your device or touch our servers.",
            color: "from-blue-500 to-purple-600"
        },
        {
            icon: <Zap className="w-8 h-8" />,
            title: "Lightning Fast",
            description: "Instant PDF processing with no upload wait times. Convert, merge, and edit PDFs in seconds.",
            color: "from-purple-500 to-pink-600"
        },
        {
            icon: <Github className="w-8 h-8" />,
            title: "Open Source",
            description: "Fully transparent and community-driven. Inspect the code, contribute improvements, and trust in complete openness.",
            color: "from-pink-500 to-red-600"
        },
        {
            icon: <FileText className="w-8 h-8" />,
            title: "Full-Featured",
            description: "Complete PDF toolkit: merge, split, compress, convert, annotate, and password protect.",
            color: "from-red-500 to-orange-600"
        }
    ];

    const steps = [
        {
            icon: <Upload className="w-6 h-6" />,
            title: "Upload Your PDF",
            description: "Drag and drop or click to select your PDF files. Everything stays local to your device."
        },
        {
            icon: <Shuffle className="w-6 h-6" />,
            title: "Choose Your Action",
            description: "Select from our comprehensive suite of PDF tools - merge, split, compress, or convert."
        },
        {
            icon: <Minimize2 className="w-6 h-6" />,
            title: "Process & Download",
            description: "Your PDF is processed instantly in your browser and ready for immediate download."
        }
    ];

    const testimonials = [
        {
            name: "Sarah Chen",
            role: "Legal Professional",
            content: "Finally, a PDF tool I can trust with confidential client documents. The privacy-first approach is exactly what our firm needed.",
            rating: 5
        },
        {
            name: "Marcus Rodriguez",
            role: "Financial Advisor",
            content: "The speed and security are unmatched. I process dozens of financial PDFs daily without any privacy concerns.",
            rating: 5
        },
        {
            name: "Emma Thompson",
            role: "Healthcare Manager",
            content: "HIPAA compliance made simple. This tool lets us handle patient documents with complete confidence.",
            rating: 5
        }
    ];

    const stats = [
        { icon: <Users className="w-6 h-6" />, value: "50K+", label: "Users Trust Us" },
        { icon: <FileText className="w-6 h-6" />, value: "2M+", label: "PDFs Processed" },
        { icon: <Award className="w-6 h-6" />, value: "99.9%", label: "Uptime" },
        { icon: <TrendingUp className="w-6 h-6" />, value: "4.9/5", label: "User Rating" }
    ];

    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files);
        const pdfFiles = files.filter(file => file.type === "application/pdf");
        
        if (pdfFiles.length > 0) {
            onFileSelect(pdfFiles);
        }
    };

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
        <div className={`landing-page ${isVisible ? 'visible' : ''}`}>
            {/* Navigation Header */}
            <nav className="nav-header">
                <div className="nav-container">
                    <div className="nav-brand">
                        <div className="nav-brand-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
                                <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
                                <path d="M10 9H8"/>
                                <path d="M16 13H8"/>
                                <path d="M16 17H8"/>
                            </svg>
                        </div>
                        <span className="brand-text">PrivatePDF</span>
                    </div>
                    <div className="nav-links">
                        <a href="#features" className="nav-link">Features</a>
                        <a href="#how-it-works" className="nav-link">How it Works</a>
                        <a href="#reviews" className="nav-link">Reviews</a>
                        <button 
                            className="nav-cta-button"
                            onClick={() => document.querySelector('.file-input').click()}
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section-new">
                <div className="hero-container">
                    <div className="hero-content-center">
                        <h1 className="hero-title-new">
                            Private PDF Processing
                            <br />
                            <span className="gradient-text-new">That Actually Protects You</span>
                        </h1>
                        
                        <p className="hero-description-new">
                            Process PDFs with complete privacy. No uploads, no servers, no data collection.
                            <br />
                            Everything happens securely in your browser with enterprise-grade tools.
                        </p>

                        <div className="hero-buttons">
                            <button 
                                className="primary-cta-button"
                                onClick={() => document.querySelector('.file-input').click()}
                                disabled={isLoading}
                            >
                                Start Processing PDFs
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
                                <h3>Drop your PDF files here</h3>
                                <p>or click to browse • 100% Private</p>
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
                        <h2>Why Choose PrivatePDF?</h2>
                        <p>Built from the ground up with privacy and security as core principles</p>
                    </div>

                    <div className="features-grid-updated">
                        <div className="feature-card-updated">
                            <div className="feature-icon-updated">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
                                </svg>
                            </div>
                            <h3>100% Private</h3>
                            <p>All processing happens in your browser. No files ever leave your device or touch our servers.</p>
                        </div>

                        <div className="feature-card-updated">
                            <div className="feature-icon-updated">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                                </svg>
                            </div>
                            <h3>Lightning Fast</h3>
                            <p>Instant PDF processing with no upload wait times. Convert, merge, and edit PDFs in seconds.</p>
                        </div>

                        <div className="feature-card-updated">
                            <div className="feature-icon-updated">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
                                    <path d="M9 18c-4.51 2-5-2-7-2"/>
                                </svg>
                            </div>
                            <h3>Open Source</h3>
                            <p>Fully transparent and community-driven. Inspect the code, contribute improvements, and trust in complete openness.</p>
                        </div>

                        <div className="feature-card-updated">
                            <div className="feature-icon-updated">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
                                    <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
                                    <path d="M10 9H8"/>
                                    <path d="M16 13H8"/>
                                    <path d="M16 17H8"/>
                                </svg>
                            </div>
                            <h3>Full-Featured</h3>
                            <p>Complete PDF toolkit: merge, split, compress, convert, annotate, and password protect.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="how-it-works-section-new">
                <div className="section-container">
                    <div className="section-header-new">
                        <h2>How It Works</h2>
                        <p>Three simple steps to secure PDF processing</p>
                    </div>

                    <div className="steps-container-new">
                        {steps.map((step, index) => (
                            <div key={index} className="step-item-new">
                                <div className="step-number-new">{String(index + 1).padStart(2, '0')}</div>
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

            {/* Testimonials Section */}
            <section id="reviews" className="testimonials-section-new">
                <div className="section-container">
                    <div className="section-header-new">
                        <h2>Trusted by Professionals</h2>
                        <p>See what industry leaders say about our privacy-first approach</p>
                    </div>

                    <div className="testimonials-grid-new">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="testimonial-card-new">
                                <div className="testimonial-rating-new">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 filled" />
                                    ))}
                                </div>
                                <p>"{testimonial.content}"</p>
                                <div className="testimonial-author-new">
                                    <div className="author-avatar-new">
                                        {testimonial.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="author-name-new">{testimonial.name}</div>
                                        <div className="author-role-new">{testimonial.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section-new">
                <div className="cta-container">
                    <div className="cta-content-new">
                        <h2>Ready to Process PDFs Privately?</h2>
                        <p>Join thousands of professionals who trust PrivatePDF for secure document processing</p>
                        <div className="cta-buttons-new">
                            <button 
                                className="cta-primary-button"
                                onClick={() => document.querySelector('.file-input').click()}
                                disabled={isLoading}
                            >
                                Start Processing Now
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer-new">
                <div className="footer-container">
                    <div className="footer-content">
                        <div className="footer-brand">
                            <div className="footer-logo">
                                <div className="footer-brand-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
                                        <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
                                        <path d="M10 9H8"/>
                                        <path d="M16 13H8"/>
                                        <path d="M16 17H8"/>
                                    </svg>
                                </div>
                                <span>PrivatePDF</span>
                            </div>
                            <p>All PDF processing happens in your browser. No files are uploaded or stored on any server.</p>
                        </div>
                    </div>
                    
                    <div className="footer-bottom">
                        <p>© 2025 PrivatePDF. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;