import React from 'react';
import { translations } from '../translations';

export default function AboutSection({ language, onClose, team = [] }) {
  const t = translations[language];

  // Backup team if none provided
  const defaultTeamBackup = [
    { name: "Riccardo Meli", roleIt: "Chief Executive Officer", roleEn: "Chief Executive Officer" },
    { name: "Ivan Gatti", roleIt: "General Manager", roleEn: "General Manager" },
    { name: "Antonello Antonelli", roleIt: "Business Development Manager", roleEn: "Business Development Manager" },
    { name: "Massimiliano Uccelletti", roleIt: "Chief AI Officer", roleEn: "Chief AI Officer" },
    { name: "Carlo Cozzi", roleIt: "Produttore Esecutivo", roleEn: "Executive Producer" },
    { name: "Marco Cassese", roleIt: "Consulente Strategico", roleEn: "Strategist Consultant" }
  ];

  const teamMembers = team && team.length > 0 ? team : defaultTeamBackup;

  // Render text with highlight spans for a premium McCann style look
  const renderHighlightedNarrative = () => {
    if (language === 'it') {
      return (
        <p className="about-narrative-text">
          Nata come <span className="highlight-pink">Production Company</span> cinematografica, televisiva e pubblicitaria, CAMELIA segue ogni fase del processo produttivo: dall'idea alla scrittura, fino alla regia, alle riprese e alla post-produzione, grazie a sale montaggio e a un rental interno di attrezzatura cinematografica di alto livello. Negli anni ci siamo evoluti in un <span className="highlight-yellow">Creative Hub</span> orientato alla comunicazione strategica, dove scrittori, strategist, web developer, social media manager ed event manager collaborano per dare ai brand una direzione chiara e riconoscibile. A questa struttura si integra il nostro <span className="highlight-pink">AI Studio</span>, guidato da esperti tecnici con background in grandi realtà industriali, che utilizza le più avanzate tecnologie di intelligenza artificiale generativa per sviluppare contenuti video, eventi e format innovativi, ottimizzando tempi e costi senza mai rinunciare all'eccellenza creativa. Completano la nostra offerta le soluzioni di <span className="highlight-yellow">Sviluppo IT</span>, nate per risolvere problematiche informatiche complesse con risposte semplici, complete e moderne: dai siti aziendali e vetrina agli e-commerce, fino al posizionamento SEO e GEO. Diverse anime riunite in un unico fiore, dove immagini, idee e tecnologie fioriscono insieme.
        </p>
      );
    } else {
      return (
        <p className="about-narrative-text">
          Born as a film, television, and advertising <span className="highlight-pink">Production Company</span>, CAMELIA manages every stage of the production process: from initial concept and writing to directing, filming, and post-production, powered by internal editing suites and a high-level cinema equipment rental. Over the years, we have evolved into a <span className="highlight-yellow">Creative Hub</span> focused on brand positioning and communication, where writers, strategists, web developers, social media managers, and event managers collaborate to give brands a clear and recognizable direction. Integrated into this structure is our <span className="highlight-pink">AI Studio</span>, led by technical experts with backgrounds in major industrial fields, leveraging cutting-edge generative AI to develop video content, events, and innovative formats, reducing time and costs while amplifying creative excellence. Finally, our <span className="highlight-yellow">IT Development</span> unit offers simple, modern, and comprehensive solutions to complex computational problems: from corporate and showcase websites to e-commerce, SEO, and GEO positioning. Diverse souls united in a single flower, where images, ideas, and technologies flourish together.
        </p>
      );
    }
  };

  return (
    <section className="overlay-view about-overlay">
      {/* Fullscreen Overlay Close Button */}
      <button className="overlay-close-btn" onClick={onClose} aria-label="Close">
        ✕
      </button>

      {/* McCann Style Scrolling Typographic Background Marquees */}
      <div className="about-marquee-container-dual">
        <div className="about-marquee-wrapper marquee-left">
          <div className="about-marquee-content">
            <span>PRODUCTION CREATIVITY STRATEGY TECH &nbsp;&nbsp;&nbsp;&nbsp;</span>
            <span>PRODUCTION CREATIVITY STRATEGY TECH &nbsp;&nbsp;&nbsp;&nbsp;</span>
          </div>
        </div>
        <div className="about-marquee-wrapper marquee-right">
          <div className="about-marquee-content">
            <span>CAMELIA CREATIVE HUB AI STUDIO &nbsp;&nbsp;&nbsp;&nbsp;</span>
            <span>CAMELIA CREATIVE HUB AI STUDIO &nbsp;&nbsp;&nbsp;&nbsp;</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        
        {/* Spacing for layout alignment */}
        <div style={{ height: '4rem' }}></div>

        {/* Unified Continuous Narrative Prose */}
        <div className="about-narrative-container">
          {renderHighlightedNarrative()}
        </div>

        {/* Partnerships Logos Section (Moved here from homepage) */}
        <div className="about-partnerships-section" style={{ marginTop: '8rem', marginBottom: '6rem' }}>
          <h3 className="team-section-title" style={{ color: 'var(--text-primary)', borderBottomColor: 'var(--accent-muted)' }}>
            Partnerships
          </h3>
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

        {/* Management Grid (Moved here from homepage) */}
        <div className="about-management-section" style={{ marginBottom: '4rem' }}>
          <h3 className="team-section-title" style={{ color: 'var(--text-primary)', borderBottomColor: 'var(--accent-muted)' }}>
            {t.teamTitle}
          </h3>
          
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

        {/* Bottom Close Button */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '6rem', marginBottom: '6rem' }}>
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
