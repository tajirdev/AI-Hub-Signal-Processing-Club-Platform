

import './footer.css'


// Inline SVGs for social icons so no extra dependencies are needed
const SocialIcons = {
  LinkedIn: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
    </svg>
  ),
  X: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  Instagram: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  ),
  GitHub: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
    </svg>
  )
};

export default function Footer() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
  };

  return (
    <footer className="footer-wrapper">
      <div className="nas-footer-card">
        {/* Main Grid Content */}
        <div className="footer-main-grid">
          
          {/* Brand & Newsletter Column */}
          <div className="footer-brand-col">
            <div className="brand-logo">
              <span className="logo-badge">AI</span>
              <div className="logo-text">
                <span className="brand-title">AI &</span>
                <span className="brand-sub">Signal Processing Hub</span>
              </div>
            </div>
            <p className="brand-description">
              Pioneering the future of artificial intelligence and signal processing through innovation, collaboration, and excellence.
            </p>
            
            {/* Newsletter Subscription */}
            <div className="newsletter-box">
              <span className="column-title">Newsletter</span>
              <p className="newsletter-desc">Subscribe to our newsletter for the latest updates and events.</p>
              <form onSubmit={handleSubmit} className="subscribe-form">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  required 
                  className="subscribe-input"
                />
                <button type="submit" className="subscribe-button">Subscribe</button>
              </form>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-links-col">
            <h4 className="column-title">Quick Links</h4>
            <ul className="footer-links-list">
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#events">Events</a></li>
              <li><a href="#projects">Projects</a></li>
              <li><a href="#team">Team</a></li>
              <li><a href="#partners">Partners</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="footer-links-col">
            <h4 className="column-title">Resources</h4>
            <ul className="footer-links-list">
              <li><a href="#blog">Blog</a></li>
              <li><a href="#documentation">Documentation</a></li>
              <li><a href="#tutorials">Tutorials</a></li>
              <li><a href="#papers">Research Papers</a></li>
              <li><a href="#repository">Code Repository</a></li>
            </ul>
          </div>

          {/* Column 4: Contact & Info */}
          <div className="footer-links-col">
            <h4 className="column-title">Get in Touch</h4>
            <div className="contact-info">
              <p className="contact-label">Contact Email:</p>
              <a href="mailto:contact@aihub.org" className="contact-email">
                contact@aihub.org
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar: NAS Style */}
        <div className="footer-bottom-bar">
          
          {/* Social Icons */}
          <div className="social-links-row">
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <SocialIcons.LinkedIn />
            </a>
            <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X">
              <SocialIcons.X />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              <SocialIcons.Instagram />
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub">
              <SocialIcons.GitHub />
            </a>
          </div>

          {/* Legal Links */}
          <div className="legal-links">
            <a href="#terms">Terms of service</a>
            <a href="#privacy">Privacy</a>
          </div>

          {/* Copyright */}
          <div className="copyright-text">
            <span>Copyright © 2026 AI Hub</span>
          </div>

        </div>
      </div>
    </footer>
  );
}
