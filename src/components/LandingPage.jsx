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
    Compress,
    Users,
    Award,
    TrendingUp
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
            description: "All processing happens in your browser. No uploads, no tracking, no data collection.",
            color: "from-blue-500 to-purple-600"
        },
        {
            icon: <Zap className="w-8 h-8" />,
            title: "Lightning Fast",
            description: "WebAssembly-powered processing for instant results without server delays.",
            color: "from-purple-500 to-pink-600"
        },
        {
            icon: <FileText className="w-8 h-8" />,
            title: "Full Control",
            description: "Reorder, remove, merge, and compress pages with professional-grade tools.",
            color: "from-pink-500 to-red-600"
        },
        {
            icon: <Download className="w-8 h-8" />,
            title: "Instant Download",
            description: "Get your modified PDF immediately with no waiting or account required.",
            color: "from-red-500 to-orange-600"
        }
    ];

    const steps = [
        {
            icon: <Upload className="w-6 h-6" />,
            title: "Upload Your PDF",
            description: "Drag and drop or select your PDF files"
        },
        {
            icon: <Shuffle className="w-6 h-6" />,
            title: "Edit & Rearrange",
            description: "Remove pages, reorder, and customize"
        },
        {
            icon: <Compress className="w-6 h-6" />,
            title: "Optimize & Download",
            description: "Apply compression and save your result"
        }
    ];

    const testimonials = [
        {
            name: "Sarah Chen",
            role: "Legal Professional",
            content: "Finally, a PDF editor that respects privacy. Perfect for sensitive documents.",
            rating: 5
        },
        {
            name: "Marcus Rodriguez",
            role: "Freelance Designer",
            content: "The drag-and-drop interface is intuitive and the compression works great.",
            rating: 5
        },
        {
            name: "Dr. Emily Watson",
            role: "Research Scientist",
            content: "No more worrying about uploading confidential research papers online.",
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
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-badge">
                        <Lock className="w-4 h-4" />
                        <span>100% Private & Secure</span>
                    </div>
                    
                    <h1 className="hero-title">
                        Edit PDFs Privately
                        <span className="gradient-text"> in Your Browser</span>
                    </h1>
                    
                    <p className="hero-description">
                        Professional PDF editing without compromising your privacy. 
                        Reorder pages, remove content, merge documents, and compress files 
                        - all processed locally in your browser.
                    </p>

                    <div className="hero-upload-area">
                        <div 
                            className="upload-dropzone"
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                        >
                            <div className="upload-icon">
                                <FileText className="w-12 h-12" />
                            </div>
                            <h3>Drop your PDF files here</h3>
                            <p>or click to browse (multiple files supported)</p>
                            <input
                                type="file"
                                accept="application/pdf"
                                multiple
                                onChange={handleFileUpload}
                                disabled={isLoading}
                                className="file-input"
                            />
                            <button 
                                className="upload-button"
                                disabled={isLoading}
                                onClick={() => document.querySelector('.file-input').click()}
                            >
                                {isLoading ? 'Processing...' : 'Select PDF Files'}
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="privacy-indicators">
                            <div className="privacy-item">
                                <Eye className="w-4 h-4" />
                                <span>No tracking</span>
                            </div>
                            <div className="privacy-item">
                                <Shield className="w-4 h-4" />
                                <span>No uploads</span>
                            </div>
                            <div className="privacy-item">
                                <Lock className="w-4 h-4" />
                                <span>100% local</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="hero-visual">
                    <div className="floating-card card-1">
                        <FileText className="w-6 h-6" />
                        <span>document.pdf</span>
                    </div>
                    <div className="floating-card card-2">
                        <Shield className="w-6 h-6" />
                        <span>Encrypted</span>
                    </div>
                    <div className="floating-card card-3">
                        <Zap className="w-6 h-6" />
                        <span>Instant</span>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="stats-grid">
                    {stats.map((stat, index) => (
                        <div key={index} className="stat-item">
                            <div className="stat-icon">
                                {stat.icon}
                            </div>
                            <div className="stat-value">{stat.value}</div>
                            <div className="stat-label">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="section-header">
                    <h2>Why Choose Private PDF?</h2>
                    <p>Professional PDF editing with uncompromising privacy</p>
                </div>

                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div 
                            key={index} 
                            className={`feature-card ${activeFeature === index ? 'active' : ''}`}
                            onMouseEnter={() => setActiveFeature(index)}
                        >
                            <div className={`feature-icon bg-gradient-to-br ${feature.color}`}>
                                {feature.icon}
                            </div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works-section">
                <div className="section-header">
                    <h2>How It Works</h2>
                    <p>Simple, secure, and lightning-fast PDF editing</p>
                </div>

                <div className="steps-container">
                    {steps.map((step, index) => (
                        <div key={index} className="step-item">
                            <div className="step-number">{index + 1}</div>
                            <div className="step-icon">
                                {step.icon}
                            </div>
                            <h3>{step.title}</h3>
                            <p>{step.description}</p>
                            {index < steps.length - 1 && (
                                <div className="step-connector">
                                    <ArrowRight className="w-5 h-5" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="testimonials-section">
                <div className="section-header">
                    <h2>Trusted by Professionals</h2>
                    <p>See what our users say about Private PDF</p>
                </div>

                <div className="testimonials-grid">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="testimonial-card">
                            <div className="testimonial-rating">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 filled" />
                                ))}
                            </div>
                            <p>"{testimonial.content}"</p>
                            <div className="testimonial-author">
                                <div className="author-avatar">
                                    {testimonial.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="author-name">{testimonial.name}</div>
                                    <div className="author-role">{testimonial.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-content">
                    <h2>Ready to Edit Your PDFs Privately?</h2>
                    <p>Join thousands of users who trust Private PDF for secure document editing</p>
                    <button 
                        className="cta-button"
                        onClick={() => document.querySelector('.file-input').click()}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Processing...' : 'Get Started Now'}
                        <ArrowRight className="w-5 h-5" />
                    </button>
                    <div className="cta-features">
                        <div className="cta-feature">
                            <CheckCircle className="w-4 h-4" />
                            <span>No account required</span>
                        </div>
                        <div className="cta-feature">
                            <CheckCircle className="w-4 h-4" />
                            <span>100% free to use</span>
                        </div>
                        <div className="cta-feature">
                            <CheckCircle className="w-4 h-4" />
                            <span>Works offline</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;