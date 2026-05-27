import React from 'react';
import { translations } from '../translations';

export default function AboutContact({ language, team = [] }) {
  const currentYear = new Date().getFullYear();
  const t = translations[language];

  // Fallback default team if none provided
  const defaultTeamBackup = [
    { name: "Riccardo Meli", roleIt: "Chief Executive Officer", roleEn: "Chief Executive Officer" },
    { name: "Ivan Gatti", roleIt: "General Manager", roleEn: "General Manager" },
    { name: "Antonello Antonelli", roleIt: "Business Development Manager", roleEn: "Business Development Manager" },
    { name: "Massimiliano Uccelletti", roleIt: "Chief AI Officer", roleEn: "Chief AI Officer" },
    { name: "Carlo Cozzi", roleIt: "Produttore Esecutivo", roleEn: "Executive Producer" },
    { name: "Marco Cassese", roleIt: "Consulente Strategico", roleEn: "Strategist Consultant" }
  ];

  const teamMembers = team && team.length > 0 ? team : defaultTeamBackup;

  return (
    <>
      {/* Team, Partnerships & Contacts Section */}
      <section id="team-contact" className="team-contact-section" style={{ padding: '6rem 0 0 0', backgroundColor: 'var(--bg-color)' }}>
        <div className="container">
          
          {/* Partnerships Logos Section */}
          <div style={{ marginBottom: '6rem' }}>
            <h3 className="team-section-title">Partnerships</h3>
            <div className="partnerships-grid">
              <div className="partner-card">
                <img src="/partner_leagas.png" alt="Leagas Delaney" className="partner-logo-img partner-logo-leagas" />
              </div>
              <div className="partner-card">
                <img src="/partner_arena.png" alt="The ARENA" className="partner-logo-img" />
              </div>
              <div className="partner-card">
                <img src="/partner_wb.png" alt="Warner Bros" className="partner-logo-img" />
              </div>
              <div className="partner-card">
                <img src="/partner_white.png" alt="White" className="partner-logo-img" />
              </div>
            </div>
          </div>

          {/* Management Grid */}
          <div style={{ marginBottom: '6rem' }}>
            <h3 className="team-section-title">{t.teamTitle}</h3>
            
            <div className="team-grid">
              {teamMembers.map((member, idx) => (
                <div key={member.id || idx} className="team-card">
                  <h4 className="team-name">{member.name}</h4>
                  <p className="team-role">
                    {language === 'it' ? member.roleIt : member.roleEn}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Contacts Section */}
          <div className="contact-details-grid" id="contact">
            {/* Left Column: Title, Email, Socials */}
            <div className="contact-brand-col">
              <h2 className="section-title" style={{ marginBottom: '2.5rem' }}>{t.contactTitle}</h2>
              
              <div className="contact-item">
                <h4>{t.contactInquiries}</h4>
                <p className="massive-email">
                  <a href="mailto:info@cameliapictures.com">
                    info@cameliapictures.com
                  </a>
                </p>
              </div>

              <div className="contact-item" style={{ marginTop: '2.5rem' }}>
                <h4>{t.contactFollow}</h4>
                <div className="social-links">
                  <a href="https://vimeo.com/cameliapictures" target="_blank" rel="noopener noreferrer" className="social-link">Vimeo</a>
                  <a href="https://www.instagram.com/camelia.pictures" target="_blank" rel="noopener noreferrer" className="social-link">Instagram</a>
                  <a href="https://www.linkedin.com/company/cameliapictures" target="_blank" rel="noopener noreferrer" className="social-link">LinkedIn</a>
                </div>
              </div>
            </div>

            {/* Right Column: Office Grid */}
            <div className="contact-offices-col">
              {/* Primary Offices */}
              <div className="primary-offices-grid">
                <div className="office-card primary-office">
                  <div className="office-card-header">
                    <span className="pin-icon">📍</span>
                    <h4>{t.locationRome}</h4>
                  </div>
                  <p>Via Giuseppe Vaccari 39 — Roma</p>
                </div>

                <div className="office-card primary-office">
                  <div className="office-card-header">
                    <span className="pin-icon">📍</span>
                    <h4>{t.locationMilan}</h4>
                  </div>
                  <p>Via Giacomo Pinaroli 3 — Milano</p>
                </div>
              </div>

              <div className="offices-separator"></div>

              {/* Auxiliary Locations */}
              <div className="auxiliary-offices-grid">
                <div className="office-card aux-office">
                  <h4>🏢 {t.locationHeadOffice}</h4>
                  <p>Via Antonio Bertoloni 27<br />00197 Roma (RM)</p>
                </div>

                <div className="office-card aux-office">
                  <h4>🎬 {t.locationPostProd}</h4>
                  <p>Piazzale Clodio, 10<br />00195 Roma (RM), Italy</p>
                </div>

                <div className="office-card aux-office">
                  <h4>🎥 {t.locationRental}</h4>
                  <p>Via Di Sant’Alessandro, 287<br />00131 Roma (RM), Italy</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>© {currentYear} CAMELIA Pictures. All rights reserved.</p>
          <p style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '0.4rem', lineHeight: '1.5' }}>
            P.IVA 18334201003 &nbsp;•&nbsp; Iscr. REA RM-1778755
          </p>
          <p style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '0.4rem' }}>Designed & Developed by CAMELIA</p>
        </div>
      </footer>
    </>
  );
}
