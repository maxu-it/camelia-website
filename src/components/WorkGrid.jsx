import React, { useRef } from 'react';
import { translations } from '../translations';

// High-quality cinematic loops for hover previews (cycled by project ID)
const HOVER_VIDEOS = [
  "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c02cba73d1e3d077d70cfafce9ebc574&profile_id=139", // Mountains
  "https://player.vimeo.com/external/435674703.sd.mp4?s=7fdf41a6b0c512fb94ec06915dfbdf55998a69a9&profile_id=139", // Car driving
  "https://player.vimeo.com/external/549552631.sd.mp4?s=07e774f74d081f9b3ec704944b05a6396e952671&profile_id=139", // Aesthetic flowers/material
  "https://player.vimeo.com/external/517602120.sd.mp4?s=4a3d6ebef15b81a8f9a2fb3803023d51eb5d4c88&profile_id=139", // Urban lights
  "https://player.vimeo.com/external/538571068.sd.mp4?s=a0eb3f49e4d588523c14c5b36440cc247f123c52&profile_id=139"  // Concert lights
];

function WorkItem({ project, onOpen, index, language }) {
  const videoRef = useRef(null);
  
  // Choose video loop based on index to distribute them evenly
  const videoUrl = HOVER_VIDEOS[index % HOVER_VIDEOS.length];

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.log("Auto-play prevented", err);
      });
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  // Convert category slug to human readable translated label
  const getCategoryLabel = (cat) => {
    const t = translations[language] || {};
    switch(cat) {
      case 'commercial': return t.filterCommercial || 'Commercial';
      case 'entertainment': return t.filterEntertainment || 'Entertainment';
      case 'cinema': return t.filterCinema || 'Cinema';
      case 'ai-visuals': return t.filterAiVisuals || 'AI Visuals';
      case 'social-media': return t.filterSocialMedia || 'Social Media';
      case 'web-development': return t.filterWebDev || 'Web Development';
      case 'podcast': return t.filterPodcast || 'Podcast';
      case 'event': return t.filterEvent || 'Event';
      default: return cat;
    }
  };

  return (
    <div 
      className="grid-item"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onOpen(project)}
      aria-label={`Project: ${project.title}`}
    >
      <div className="grid-item-media">
        <img 
          src={project.thumbnail} 
          alt={project.title} 
          className="grid-item-img"
          loading="lazy"
        />
        <video
          ref={videoRef}
          className="grid-item-video"
          src={videoUrl}
          loop
          muted
          playsInline
        />
      </div>

      <div className="grid-item-info">
        <div className="grid-item-meta">
          <span>{getCategoryLabel(project.category)}</span>
          <span>{project.year}</span>
        </div>
        <h3 className="grid-item-title">{project.title}</h3>
        <p className="grid-item-director">
          {language === 'it' 
            ? `Regia di ${project.director} ${project.client ? `per ${project.client}` : ''}`
            : `By ${project.director} ${project.client ? `for ${project.client}` : ''}`
          }
        </p>
      </div>
    </div>
  );
}

export default function WorkGrid({ language, activeFilter, setActiveFilter, onProjectSelect, projects = [] }) {
  const t = translations[language];

  const categories = [
    { slug: 'commercial', label: t.filterCommercial },
    { slug: 'entertainment', label: t.filterEntertainment },
    { slug: 'cinema', label: t.filterCinema },
    { slug: 'ai-visuals', label: t.filterAiVisuals },
    { slug: 'social-media', label: t.filterSocialMedia },
    { slug: 'web-development', label: t.filterWebDev },
    { slug: 'podcast', label: t.filterPodcast },
    { slug: 'event', label: t.filterEvent }
  ];

  // 1. Filter out invisible projects (default visibility is 'si')
  const visibleProjects = projects.filter(p => p.visibility !== 'no');

  // 2. Sort projects numerically by the order property
  const sortedProjects = visibleProjects.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

  // 3. Filter projects depending on active category filter
  const filteredProjects = sortedProjects.filter(p => p.category === activeFilter);

  return (
    <section id="work" className="work-section">
      <div className="container">
        <div className="work-header">
          <h2 className="section-title">{t.workTitle}</h2>
          
          <nav className="filters-wrapper">
            {categories.map(cat => (
              <button
                key={cat.slug}
                className={`filter-btn ${activeFilter === cat.slug ? 'active' : ''}`}
                onClick={() => setActiveFilter(cat.slug)}
              >
                {cat.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="work-grid">
          {filteredProjects.map((project, index) => (
            <WorkItem 
              key={project.id} 
              project={project} 
              onOpen={onProjectSelect}
              index={index}
              language={language}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
