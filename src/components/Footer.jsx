import React from 'react';

export default function Footer({ language, onOpenPrivacy, onOpenCookie }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bugiardino-footer" id="contact-footer">
      <div className="container bugiardino-container">
        
        {/* Row 1: Brand Title */}
        <div className="footer-brand-title">
          CAMELIA PICTURES
        </div>
        
        {/* Row 2: Navigation & Social Links */}
        <div className="footer-links-row">
          <a href="#privacy" className="footer-link" onClick={(e) => { e.preventDefault(); onOpenPrivacy(); }}>
            Privacy Policy
          </a>
          <span className="footer-bullet">•</span>
          <a href="#cookie" className="footer-link" onClick={(e) => { e.preventDefault(); onOpenCookie(); }}>
            Cookie Policy
          </a>
          <span className="footer-bullet">•</span>
          <a href="https://vimeo.com/cameliapictures" target="_blank" rel="noopener noreferrer" className="footer-link">
            Vimeo
          </a>
          <span className="footer-bullet">•</span>
          <a href="https://www.instagram.com/camelia.pictures" target="_blank" rel="noopener noreferrer" className="footer-link">
            Instagram
          </a>
          <span className="footer-bullet">•</span>
          <a href="https://www.linkedin.com/company/cameliapictures" target="_blank" rel="noopener noreferrer" className="footer-link">
            LinkedIn
          </a>
        </div>

        {/* Row 3: Copyright & VAT */}
        <div className="footer-legal-row">
          <p>© {currentYear} CAMELIA. All rights reserved.</p>
          <span className="footer-divider-pipe">|</span>
          <p>P.IVA 18334201003 — Iscr. REA RM-1778755</p>
          <span className="footer-divider-pipe">|</span>
          <p className="footer-author">Designed & Developed by CAMELIA</p>
        </div>

      </div>
    </footer>
  );
}
