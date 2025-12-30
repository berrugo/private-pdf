import { useTranslation } from 'react-i18next';

const Footer = () => {
	const { t } = useTranslation();

	return (
		<footer className="footer-new">
			<div className="footer-container">
				<div className="footer-content">
					<div className="footer-brand">
						<div className="footer-logo">
							<div className="footer-brand-icon">
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
							<span>{t('nav.brand')}</span>
						</div>
						<p>
							{t('footer.privacy')}
						</p>

						{/* GitHub Repository Link */}
						<div style={{ marginTop: "1rem" }}>
							<a
								href="https://github.com/berrugo/private-pdf"
								target="_blank"
								rel="noopener noreferrer"
								style={{
									display: "inline-flex",
									alignItems: "center",
									gap: "0.5rem",
									color: "#9ca3af",
									textDecoration: "none",
									fontSize: "0.875rem",
									transition: "color 0.3s ease",
								}}
								onMouseEnter={(e) =>
									(e.target.style.color = "#ffffff")
								}
								onMouseLeave={(e) =>
									(e.target.style.color = "#9ca3af")
								}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="lucide lucide-github-icon lucide-github"
								>
									<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
									<path d="M9 18c-4.51 2-5-2-7-2" />
								</svg>
								{t('footer.github')}
							</a>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;