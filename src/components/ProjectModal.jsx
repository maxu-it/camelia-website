import React, { useEffect } from 'react';

// Helper to translate credit row labels dynamically
const translateCreditKey = (key, lang) => {
  if (lang === 'it') {
    switch(key) {
      case 'Director': return 'Regia';
      case 'Executive Producer': return 'Produttore Esecutivo';
      case 'Director of Photography': return 'Direzione della Fotografia';
      case 'Editor': return 'Montaggio';
      case 'Sound Design': return 'Design del Suono';
      case 'Colorist': return 'Color Grading';
      case 'Client': return 'Cliente';
      case 'Agency': return 'Agenzia';
      case 'Artist': return 'Artista';
      case 'Label': return 'Etichetta';
      case 'Broadcaster': return 'Emittente';
      case 'Production Designer': return 'Scenografia';
      case 'Composer': return 'Colonna Sonora';
      case 'Set Designer': return 'Scenografia';
      case 'Drone Pilot': return 'Pilota Drone';
      case 'Choreographer': return 'Coreografia';
      case 'Stylist': return 'Styling';
      case 'Writer': return 'Sceneggiatore';
      case 'Screenplay': return 'Sceneggiatore';
      case 'Screenwriter': return 'Sceneggiatore';
      default: return key;
    }
  }
  return key;
};

// Robust helper to format the Vimeo embed URL correctly
const getVimeoEmbedUrl = (vimeoId) => {
  if (vimeoId.includes('/')) {
    const parts = vimeoId.split('/');
    // Check if the first part is a number (e.g., "1156906237/6500af3c71")
    if (!isNaN(parts[0])) {
      return `https://player.vimeo.com/video/${parts[0]}?h=${parts[1]}&autoplay=1&color=ffffff&title=0&byline=0&portrait=0`;
    } else {
      // It's a channel slug path (e.g., "cameliapictures/auslcamelia")
      return `https://player.vimeo.com/video/${vimeoId}?autoplay=1&color=ffffff&title=0&byline=0&portrait=0`;
    }
  }
  // Standard simple ID or alias
  return `https://player.vimeo.com/video/${vimeoId}?autoplay=1&color=ffffff&title=0&byline=0&portrait=0`;
};

export default function ProjectModal({ project, onClose, language }) {
  
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (project) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [project, onClose]);

  if (!project) return null;

  // Selected bilingual description
  const description = language === 'it' ? project.description_it : project.description_en;

  const getCreditWeight = (key) => {
    const k = key.toLowerCase();
    
    // 1. Cliente / Client
    if (['client', 'cliente', 'agency', 'agenzia', 'artist', 'artista', 'label', 'etichetta'].includes(k)) return 1;
    
    // 2. Regia / Director
    if (['director', 'regia', 'regista'].includes(k)) return 2;
    
    // 3. Sceneggiatore / Writer / Screenplay
    if (['writer', 'screenplay', 'screenwriter', 'sceneggiatore', 'sceneggiatura'].includes(k)) return 3;
    
    // 4. Direttore della Fotografia / DOP
    if (['director of photography', 'dop', 'direttore della fotografia', 'direzione della fotografia', 'direttore di fotografia'].includes(k)) return 4;
    
    // 6. Produttore Esecutivo / Executive Producer
    if (['executive producer', 'produttore esecutivo', 'produttore'].includes(k)) return 6;
    
    // 7. Montaggio / Editor
    if (['editor', 'montaggio', 'montatore'].includes(k)) return 7;
    
    // 8. Colorist / Color Grading
    if (['colorist', 'color grading', 'color'].includes(k)) return 8;
    
    // 9. Colonna Sonora / Composer / Music
    if (['composer', 'music', 'colonna sonora', 'musica'].includes(k)) return 9;
    
    // 10. Scenografia / Production Designer / Set Designer
    if (['production designer', 'set designer', 'scenografia', 'scenografo', 'scenografa'].includes(k)) return 10;
    
    // 5. Altri ruoli / Default (qualsiasi altro ruolo non specificato va in posizione 5)
    return 5;
  };

  const sortedCredits = project.credits
    ? Object.entries(project.credits).sort((a, b) => {
        const weightA = getCreditWeight(a[0]);
        const weightB = getCreditWeight(b[0]);
        if (weightA !== weightB) {
          return weightA - weightB;
        }
        return a[0].localeCompare(b[0]);
      })
    : [];

  return (
    <div className={`modal-overlay ${project ? 'active' : ''}`} onClick={onClose}>
      <button className="modal-close-btn" onClick={onClose} aria-label={language === 'it' ? 'Chiudi' : 'Close'}>
        ✕
      </button>
      
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Media Display: Vimeo Embed or Cover Image Banner */}
        {(() => {
          const vId = project.vimeoId ? project.vimeoId.trim() : '';
          const isVideo = vId && (vId.includes('vimeo') || !vId.startsWith('http'));
          const isExternalLink = vId && vId.startsWith('http') && !vId.includes('vimeo');
          
          if (isVideo) {
            return (
              <div className="video-wrapper">
                <iframe
                  src={getVimeoEmbedUrl(vId)}
                  title={project.title}
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            );
          } else {
            return (
              <div 
                className="image-banner-wrapper" 
                style={{ backgroundImage: `url(${project.thumbnail})` }}
              >
                {isExternalLink && (
                  <a 
                    href={vId} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="modal-visit-btn"
                  >
                    {language === 'it' ? 'Visita il Sito' : 'Visit Website'}
                  </a>
                )}
              </div>
            );
          }
        })()}
        
        {/* Project Details & Credits */}
        <div className="modal-details">
          <div className="modal-meta-grid">
            <div className="modal-info-col">
              <h3>{project.title}</h3>
              <p className="modal-desc">{description}</p>
            </div>
            
            <div className="modal-credits-col">
              {sortedCredits.map(([key, val]) => (
                <div className="credit-row" key={key}>
                  <span className="credit-label">{translateCreditKey(key, language)}</span>
                  <span className="credit-value">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
