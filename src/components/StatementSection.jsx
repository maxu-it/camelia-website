import React, { useEffect, useRef } from 'react';
import { translations } from '../translations';

export default function StatementSection({ language }) {
  const t = translations[language];
  const containerRef = useRef(null);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.15
    };

    const handleIntersection = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
          observer.unobserve(entry.target); // Trigger only once
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    
    if (containerRef.current) {
      const items = containerRef.current.querySelectorAll('.statement-reveal');
      items.forEach(item => observer.observe(item));
    }

    return () => {
      if (containerRef.current) {
        const items = containerRef.current.querySelectorAll('.statement-reveal');
        items.forEach(item => observer.unobserve(item));
      }
    };
  }, []);

  return (
    <section ref={containerRef} className="statement-section">
      <div className="container statement-container">
        
        <div className="statement-words">
          <h2 className="statement-word statement-reveal" style={{ transitionDelay: '100ms' }}>
            {t.statementLine1}
          </h2>
          <h2 className="statement-word statement-reveal" style={{ transitionDelay: '500ms' }}>
            {t.statementLine2}
          </h2>
          <h2 className="statement-word statement-reveal" style={{ transitionDelay: '900ms' }}>
            {t.statementLine3}
          </h2>
          <h2 className="statement-word statement-reveal" style={{ transitionDelay: '1300ms' }}>
            {t.statementLine4}
          </h2>
        </div>

        <div className="statement-subtitle-wrapper statement-reveal" style={{ transitionDelay: '1800ms' }}>
          <div className="statement-separator"></div>
          <p className="statement-subtitle">
            {t.statementSubtitle}
          </p>
        </div>

      </div>
    </section>
  );
}
