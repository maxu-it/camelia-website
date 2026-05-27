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

      <div className="container skills-container">
        {/* Spacing for layout alignment */}
        <div style={{ height: '4rem' }}></div>

        <div className="skills-grid">
          {/* Skill 1: PRODUCTION */}
          <div className="skill-col">
            <svg viewBox="0 0 320 60" className="skill-text-svg">
              <text x="50%" y="42" textAnchor="middle" className="skill-text-path">
                {t.skill1Title}
              </text>
            </svg>
            <p className="skill-desc">{t.skill1Desc}</p>
          </div>

          {/* Skill 2: CREATIVE */}
          <div className="skill-col">
            <svg viewBox="0 0 320 60" className="skill-text-svg">
              <text x="50%" y="42" textAnchor="middle" className="skill-text-path">
                {t.skill2Title}
              </text>
            </svg>
            <p className="skill-desc">{t.skill2Desc}</p>
          </div>

          {/* Skill 3: AI STUDIO */}
          <div className="skill-col">
            <svg viewBox="0 0 320 60" className="skill-text-svg">
              <text x="50%" y="42" textAnchor="middle" className="skill-text-path">
                {t.skill3Title}
              </text>
            </svg>
            <p className="skill-desc">{t.skill3Desc}</p>
          </div>

          {/* Skill 4: TECH */}
          <div className="skill-col">
            <svg viewBox="0 0 320 60" className="skill-text-svg">
              <text x="50%" y="42" textAnchor="middle" className="skill-text-path">
                {t.skill4Title}
              </text>
            </svg>
            <p className="skill-desc">{t.skill4Desc}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
