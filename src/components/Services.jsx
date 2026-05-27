import React from 'react';
import { translations } from '../translations';

export default function Services({ language, onClose }) {
  const t = translations[language];

  return (
    <section className="overlay-view services-overlay">
      {/* Close Button */}
      <button className="overlay-close-btn" onClick={onClose} aria-label="Close">
        ✕
      </button>

      <div className="container skills-container-giant">
        <div className="skills-giant-list">
          <div className="skills-giant-item">
            <span className="skills-giant-text">{t.skill1Title}</span>
          </div>
          <div className="skills-giant-item">
            <span className="skills-giant-text">{t.skill2Title}</span>
          </div>
          <div className="skills-giant-item">
            <span className="skills-giant-text">{t.skill3Title}</span>
          </div>
          <div className="skills-giant-item">
            <span className="skills-giant-text">{t.skill4Title}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
