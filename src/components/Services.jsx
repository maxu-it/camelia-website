import React from 'react';
import { translations } from '../translations';

export default function Services({ language, onClose }) {
  const t = translations[language];

  const renderFlickeringText = (text, wordIndex) => {
    return text.split('').map((char, charIndex) => {
      if (char === ' ') {
        return (
          <span key={charIndex} className="skills-giant-space">
            &nbsp;
          </span>
        );
      }
      
      // Assign asynchronous durations (loop-drift style) for chaotic flickering
      const durations = [0.37, 0.47, 0.41, 0.53, 0.31, 0.59, 0.43, 0.39, 0.49, 0.51];
      const duration = durations[(wordIndex * 13 + charIndex) % durations.length];
      const delay = (charIndex * 0.03 + wordIndex * 0.05).toFixed(2);

      return (
        <span
          key={charIndex}
          className="skills-giant-letter"
          style={{
            '--flicker-dur': `${duration}s`,
            '--flicker-delay': `${delay}s`
          }}
        >
          {char}
        </span>
      );
    });
  };

  return (
    <section className="overlay-view services-overlay">
      {/* Close Button */}
      <button className="overlay-close-btn" onClick={onClose} aria-label="Close">
        ✕
      </button>

      <div className="container skills-container-giant">
        <div className="skills-giant-list">
          
          {/* Layout A: Initial Vertical List (Flickers, turns white, then fades out at 3s) */}
          <div className="skills-intro-vertical">
            <div className="skills-giant-item">
              <span className="skills-giant-text">
                {renderFlickeringText(t.skill1Title, 0)}
              </span>
            </div>
            <div className="skills-giant-item">
              <span className="skills-giant-text">
                {renderFlickeringText(t.skill2Title, 1)}
              </span>
            </div>
            <div className="skills-giant-item">
              <span className="skills-giant-text">
                {renderFlickeringText(t.skill3Title, 2)}
              </span>
            </div>
            <div className="skills-giant-item">
              <span className="skills-giant-text">
                {renderFlickeringText(t.skill4Title, 3)}
              </span>
            </div>
          </div>

          {/* Layout B: Horizontal Scrolling Marquee (Fades in at 3s, positioned at the first word height) */}
          <div className="skills-rotator-horizontal">
            <div className="skills-marquee-track">
              <div className="skills-marquee-content">
                <span className="skills-marquee-word">{t.skill1Title}</span>
                <span className="skills-marquee-dot">·</span>
                <span className="skills-marquee-word">{t.skill2Title}</span>
                <span className="skills-marquee-dot">·</span>
                <span className="skills-marquee-word">{t.skill3Title}</span>
                <span className="skills-marquee-dot">·</span>
                <span className="skills-marquee-word">{t.skill4Title}</span>
                <span className="skills-marquee-dot">·</span>
              </div>
              <div className="skills-marquee-content" aria-hidden="true">
                <span className="skills-marquee-word">{t.skill1Title}</span>
                <span className="skills-marquee-dot">·</span>
                <span className="skills-marquee-word">{t.skill2Title}</span>
                <span className="skills-marquee-dot">·</span>
                <span className="skills-marquee-word">{t.skill3Title}</span>
                <span className="skills-marquee-dot">·</span>
                <span className="skills-marquee-word">{t.skill4Title}</span>
                <span className="skills-marquee-dot">·</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

