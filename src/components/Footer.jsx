import React from 'react';

export default function Footer({ language }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bugiardino-footer" id="contact-footer">
      <div className="container bugiardino-container">
        
        {/* Column 1: Brand & Copyright */}
        <div className="bugiardino-col">
          <div className="bugiardino-title">CAMELIA PICTURES</div>
          <p>© {currentYear} CAMELIA. All rights reserved.</p>
          <p style={{ marginTop: '0.4rem', fontSize: '0.75rem', opacity: 0.8, lineHeight: '1.5' }}>
            P.IVA 18334201003<br />
            Iscr. REA RM-1778755
          </p>
          <p className="bugiardino-subtext">Designed & Developed by CAMELIA</p>
        </div>

        {/* Column 2: Legal & Policy */}
        <div className="bugiardino-col">
          <div className="bugiardino-title">POLICY</div>
          <p>
            <a href="#privacy" className="bugiardino-email" onClick={(e) => e.preventDefault()}>
              Privacy Policy
            </a>
          </p>
          <p style={{ marginTop: '0.6rem' }}>
            <a href="#cookie" className="bugiardino-email" onClick={(e) => e.preventDefault()}>
              Cookie Policy
            </a>
          </p>
        </div>

        {/* Column 3: Socials */}
        <div className="bugiardino-col">
          <div className="bugiardino-title">FOLLOW</div>
          <div className="bugiardino-socials">
            <a href="https://vimeo.com/cameliapictures" target="_blank" rel="noopener noreferrer">Vimeo</a>
            <a href="https://www.instagram.com/camelia.pictures" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://www.linkedin.com/company/cameliapictures" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
