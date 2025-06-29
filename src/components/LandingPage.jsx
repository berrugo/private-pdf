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
    Play
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
            icon: <Lock className="w-8 h-8" />,
            title: "Secure by Design",
            description: "End-to-end encryption ensures your sensitive documents remain completely confidential.",
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
                        <FileText className="w-8 h-8 text-purple-600" />
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
                            <button className="secondary-cta-button">
                                Watch Demo
                                <Play className="w-4 h-4" />
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
                                <p>or click to browse • Max 10MB • 100% Private</p>
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
                <div class="features-container-updated">
                    <div className="features-header-updated">
                        <h2>Why Choose PrivatePDF?</h2>
                        <p>Built from the ground up with privacy and security as core principles</p>
                    </div>

                    <div className="features-grid-updated">
                        <div className="feature-card-updated">
                            <div className="feature-icon-updated">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                            <h3>100% Private</h3>
                            <p>All processing happens in your browser. No files ever leave your device or touch our servers.</p>
                        </div>

                        <div className="feature-card-updated">
                            <div className="feature-icon-updated">
                                <Zap className="w-8 h-8 text-white" />
                            </div>
                            <h3>Lightning Fast</h3>
                            <p>Instant PDF processing with no upload wait times. Convert, merge, and edit PDFs in seconds.</p>
                        </div>

                        <div className="feature-card-updated">
                            <div className="feature-icon-updated">
                                <Lock className="w-8 h-8 text-white" />
                            </div>
                            <h3>Secure by Design</h3>
                            <p>End-to-end encryption ensures your sensitive documents remain completely confidential.</p>
                        </div>

                        <div className="feature-card-updated">
                            <div className="feature-icon-updated">
                                <FileText className="w-8 h-8 text-white" />
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
                            <button className="cta-secondary-button">
                                Learn More
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
                                <FileText className="w-6 h-6 text-purple-600" />
                                <span>PrivatePDF</span>
                            </div>
                            <p>Secure, private PDF processing that never compromises your data.</p>
                        </div>
                        
                        <div className="footer-links">
                            <div className="footer-column">
                                <h4>Product</h4>
                                <a href="#features">Features</a>
                                <a href="#security">Security</a>
                                <a href="#pricing">Pricing</a>
                            </div>
                            <div className="footer-column">
                                <h4>Company</h4>
                                <a href="#about">About</a>
                                <a href="#blog">Blog</a>
                                <a href="#contact">Contact</a>
                            </div>
                            <div className="footer-column">
                                <h4>Legal</h4>
                                <a href="#privacy">Privacy Policy</a>
                                <a href="#terms">Terms of Service</a>
                            </div>
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