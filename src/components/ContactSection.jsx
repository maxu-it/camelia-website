import React from 'react';
import { translations } from '../translations';

export default function ContactSection({ language, onClose }) {
  const t = translations[language];

  return (
    <section className="overlay-view contact-overlay" style={{ borderTop: '4px solid var(--accent-yellow)' }}>
      {/* Fullscreen Overlay Close Button */}
      <button className="overlay-close-btn" onClick={onClose} aria-label="Close">
        ✕
      </button>

      {/* McCann Style Scrolling Typographic Background Marquees */}
      <div className="about-marquee-container-dual">
        <div className="about-marquee-wrapper marquee-left">
          <div className="about-marquee-content">
            <span>CONTACT INQUIRIES OFFICES SEDI &nbsp;&nbsp;&nbsp;&nbsp;</span>
            <span>CONTACT INQUIRIES OFFICES SEDI &nbsp;&nbsp;&nbsp;&nbsp;</span>
          </div>
        </div>
        <div className="about-marquee-wrapper marquee-right">
          <div className="about-marquee-content">
            <span>CAMELIA PICTURES ROMA MILANO &nbsp;&nbsp;&nbsp;&nbsp;</span>
            <span>CAMELIA PICTURES ROMA MILANO &nbsp;&nbsp;&nbsp;&nbsp;</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        
        {/* Spacing for layout alignment */}
        <div style={{ height: '4rem' }}></div>

        {/* Contact Layout Grid */}
        <div className="contact-details-grid" style={{ borderTop: 'none', paddingTop: 0 }}>
          
          {/* Left Column: Title, Email, Socials, P.IVA */}
          <div className="contact-brand-col">
            <h2 
              className="section-title" 
              style={{ 
                marginBottom: '2.5rem',
                fontFamily: "'Bricolage Grotesque', sans-serif",
                color: 'var(--text-primary)'
              }}
            >
              {t.contactTitle}
            </h2>
            
            <div className="contact-item">
              <h4 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", color: 'var(--accent-pink)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                {t.contactInquiries}
              </h4>
              <p className="massive-email">
                <a href="mailto:info@cameliapictures.com">
                  info@cameliapictures.com
                </a>
              </p>
            </div>

            <div className="contact-item" style={{ marginTop: '3rem' }}>
              <h4 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", color: 'var(--accent-yellow)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                {t.contactFollow}
              </h4>
              <div className="social-links" style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
                <a 
                  href="https://vimeo.com/cameliapictures" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="social-link"
                  style={{
                    fontSize: '1.1rem',
                    color: 'var(--text-primary)',
                    textDecoration: 'none',
                    borderBottom: '1px solid transparent',
                    transition: 'var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => e.target.style.borderBottomColor = 'var(--accent-pink)'}
                  onMouseLeave={(e) => e.target.style.borderBottomColor = 'transparent'}
                >
                  Vimeo
                </a>
                <a 
                  href="https://www.instagram.com/camelia.pictures" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="social-link"
                  style={{
                    fontSize: '1.1rem',
                    color: 'var(--text-primary)',
                    textDecoration: 'none',
                    borderBottom: '1px solid transparent',
                    transition: 'var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => e.target.style.borderBottomColor = 'var(--accent-pink)'}
                  onMouseLeave={(e) => e.target.style.borderBottomColor = 'transparent'}
                >
                  Instagram
                </a>
                <a 
                  href="https://www.linkedin.com/company/cameliapictures" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="social-link"
                  style={{
                    fontSize: '1.1rem',
                    color: 'var(--text-primary)',
                    textDecoration: 'none',
                    borderBottom: '1px solid transparent',
                    transition: 'var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => e.target.style.borderBottomColor = 'var(--accent-pink)'}
                  onMouseLeave={(e) => e.target.style.borderBottomColor = 'transparent'}
                >
                  LinkedIn
                </a>
              </div>
            </div>

            <div className="contact-item" style={{ marginTop: '3.5rem', opacity: 0.6, fontSize: '0.85rem', lineHeight: '1.6' }}>
              <p>CAMELIA PICTURES S.r.l.</p>
              <p>P.IVA 18334201003 &nbsp;•&nbsp; Iscr. REA RM-1778755</p>
            </div>
          </div>

          {/* Right Column: Office Grid */}
          <div className="contact-offices-col">
            {/* Primary Offices */}
            <div>
              <h3 
                className="team-section-title" 
                style={{ 
                  color: 'var(--text-primary)', 
                  borderBottomColor: 'var(--accent-muted)',
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: '1.4rem',
                  marginBottom: '2rem'
                }}
              >
                {language === 'it' ? 'SEDI PRINCIPALI' : 'MAIN OFFICES'}
              </h3>
              <div className="primary-offices-grid">
                <div className="office-card primary-office">
                  <div className="office-card-header">
                    <h4 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>{t.locationRome}</h4>
                  </div>
                  <p style={{ fontFamily: "var(--font-body)" }}>Via Giuseppe Vaccari 39 — Roma</p>
                </div>

                <div className="office-card primary-office">
                  <div className="office-card-header">
                    <h4 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>{t.locationMilan}</h4>
                  </div>
                  <p style={{ fontFamily: "var(--font-body)" }}>Via Giacomo Pinaroli 3 — Milano</p>
                </div>
              </div>
            </div>

            <div className="offices-separator"></div>

            {/* Auxiliary Locations */}
            <div>
              <h3 
                className="team-section-title" 
                style={{ 
                  color: 'var(--text-primary)', 
                  borderBottomColor: 'var(--accent-muted)',
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: '1.4rem',
                  marginBottom: '2rem'
                }}
              >
                {language === 'it' ? 'ALTRE SEDI' : 'OTHER FACILITIES'}
              </h3>
              <div className="auxiliary-offices-grid">
                <div className="office-card aux-office">
                  <h4 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: '0.85rem' }}>{t.locationHeadOffice}</h4>
                  <p style={{ fontFamily: "var(--font-body)" }}>Via Antonio Bertoloni 27<br />00197 Roma (RM)</p>
                </div>

                <div className="office-card aux-office">
                  <h4 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: '0.85rem' }}>{t.locationPostProd}</h4>
                  <p style={{ fontFamily: "var(--font-body)" }}>Piazzale Clodio, 10<br />00195 Roma (RM)</p>
                </div>

                <div className="office-card aux-office">
                  <h4 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: '0.85rem' }}>{t.locationRental}</h4>
                  <p style={{ fontFamily: "var(--font-body)" }}>Via Di Sant’Alessandro, 287<br />00131 Roma (RM)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Close Button */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem', marginBottom: '4rem' }}>
          <button 
            onClick={onClose} 
            className="bottom-close-x"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

      </div>
    </section>
  );
}
