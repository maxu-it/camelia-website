import React from 'react';
import { translations } from '../translations';

export default function Footer({ language }) {
  const currentYear = new Date().getFullYear();
  const t = translations[language];

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

        {/* Column 2: Main Offices */}
        <div className="bugiardino-col">
          <div className="bugiardino-title">{language === 'it' ? 'SEDI PRINCIPALI' : 'MAIN OFFICES'}</div>
          <p>
            <strong>{t.locationRome}</strong><br />
            Via Giuseppe Vaccari 39 — Roma
          </p>
          <p style={{ marginTop: '0.8rem' }}>
            <strong>{t.locationMilan}</strong><br />
            Via Giacomo Pinaroli 3 — Milano
          </p>
        </div>

        {/* Column 3: Auxiliary Facilities */}
        <div className="bugiardino-col">
          <div className="bugiardino-title">{language === 'it' ? 'ALTRE SEDI' : 'OTHER FACILITIES'}</div>
          <p>
            <strong>{t.locationHeadOffice}</strong><br />
            Via Antonio Bertoloni 27<br />
            00197 Roma (RM)
          </p>
          <p style={{ marginTop: '0.6rem' }}>
            <strong>{t.locationPostProd}</strong><br />
            Piazzale Clodio, 10 — Roma
          </p>
          <p style={{ marginTop: '0.6rem' }}>
            <strong>{t.locationRental}</strong><br />
            Via Di Sant’Alessandro, 287 — Roma
          </p>
        </div>

        {/* Column 4: Contact/Mail */}
        <div className="bugiardino-col">
          <div className="bugiardino-title">{language === 'it' ? 'INFORMAZIONI' : 'INQUIRIES'}</div>
          <p>
            <a href="mailto:info@cameliapictures.com" className="bugiardino-email">
              info@cameliapictures.com
            </a>
          </p>
        </div>

        {/* Column 5: Socials */}
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
