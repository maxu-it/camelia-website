import React, { useState, useEffect } from 'react';
import { translations } from '../translations';

export default function Header({ language, setLanguage, onOpenAbout, onOpenServices, onMenuStateChange }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null); // 'work', 'about', 'services', 'contact'
  
  const t = translations[language];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (onMenuStateChange) {
      onMenuStateChange(isMenuOpen);
    }
  }, [isMenuOpen, onMenuStateChange]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isMenuOpen) {
      setHoveredLink(null);
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setHoveredLink(null);
  };

  const handleLinkClick = (action) => {
    closeMenu();
    if (action === 'about') {
      onOpenAbout();
    } else if (action === 'services') {
      onOpenServices();
    } else {
      // Defer scroll target lookup to allow React state change to commit
      // and .scroll-locked class to be removed from html/body first.
      setTimeout(() => {
        if (action === 'work') {
          const el = document.getElementById('work');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        } else if (action === 'contact') {
          const el = document.getElementById('contact-footer');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <>
      <header className={`header ${isScrolled ? 'scrolled' : ''} ${isMenuOpen ? 'menu-open' : ''}`}>
        <div className="container header-container">
          
          {/* Logo (Left) */}
          <a href="#hero" className="logo" onClick={closeMenu}>
            <img src="/logo_white.png" alt="CAMELIA" />
          </a>

          {/* Controls (Right) */}
          <div className="header-controls">
            
            {/* Language Selector Desktop */}
            <div className="lang-selector">
              <button 
                onClick={() => setLanguage('it')} 
                className={`lang-btn ${language === 'it' ? 'active' : ''}`}
              >
                IT
              </button>
              <span className="lang-separator">|</span>
              <button 
                onClick={() => setLanguage('en')} 
                className={`lang-btn ${language === 'en' ? 'active' : ''}`}
              >
                EN
              </button>
            </div>

            {/* Hamburger Toggle */}
            <button 
              className={`nav-toggle ${isMenuOpen ? 'active' : ''}`} 
              onClick={toggleMenu}
              aria-label="Toggle navigation menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

          </div>
        </div>
      </header>

      {/* Fullscreen Navigation Menu Overlay */}
      <div className={`fullscreen-menu-overlay ${isMenuOpen ? 'active' : ''}`}>
        
        {/* Hover Background Image Reveals */}
        <div 
          className={`menu-bg-image bg-work ${hoveredLink === 'work' ? 'active' : ''}`}
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1200&auto=format&fit=crop')` }}
        />
        <div 
          className={`menu-bg-image bg-about ${hoveredLink === 'about' ? 'active' : ''}`}
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop')` }}
        />
        <div 
          className={`menu-bg-image bg-services ${hoveredLink === 'services' ? 'active' : ''}`}
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1478720143033-6a972678aa30?q=80&w=1200&auto=format&fit=crop')` }}
        />
        <div 
          className={`menu-bg-image bg-contact ${hoveredLink === 'contact' ? 'active' : ''}`}
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1516387938699-a93567ec168e?q=80&w=1200&auto=format&fit=crop')` }}
        />

        <nav className="fullscreen-menu-nav">
          <button 
            className="fullscreen-menu-link" 
            onClick={() => handleLinkClick('work')}
            onMouseEnter={() => setHoveredLink('work')}
            onMouseLeave={() => setHoveredLink(null)}
          >
            {t.navWork}
          </button>
          <button 
            className="fullscreen-menu-link" 
            onClick={() => handleLinkClick('about')}
            onMouseEnter={() => setHoveredLink('about')}
            onMouseLeave={() => setHoveredLink(null)}
          >
            {t.navAbout}
          </button>
          <button 
            className="fullscreen-menu-link" 
            onClick={() => handleLinkClick('services')}
            onMouseEnter={() => setHoveredLink('services')}
            onMouseLeave={() => setHoveredLink(null)}
          >
            {t.navServices}
          </button>
          <button 
            className="fullscreen-menu-link" 
            onClick={() => handleLinkClick('contact')}
            onMouseEnter={() => setHoveredLink('contact')}
            onMouseLeave={() => setHoveredLink(null)}
          >
            {t.navContact}
          </button>
          
          {/* Close button with circle and '✕' */}
          <button 
            className="fullscreen-menu-close-btn" 
            onClick={closeMenu}
            aria-label="Close menu"
          >
            ✕
          </button>
        </nav>

        {/* Info footer in overlay menu */}
        <div className="fullscreen-menu-footer">
          <p>info@cameliapictures.com</p>
          <div className="fullscreen-menu-socials">
            <a href="https://vimeo.com/cameliapictures" target="_blank" rel="noopener noreferrer">Vimeo</a>
            <a href="https://www.instagram.com/camelia.pictures" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://www.linkedin.com/company/cameliapictures" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>

      </div>
    </>
  );
}
