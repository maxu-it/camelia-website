import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import Services from './components/Services';
import ContactSection from './components/ContactSection';
import WorkGrid from './components/WorkGrid';
import Footer from './components/Footer';
import ProjectModal from './components/ProjectModal';
import AdminPanel from './components/AdminPanel';
import CustomCursor from './components/CustomCursor';
import LegalOverlay from './components/LegalOverlay';
import defaultProjects from './projects.json';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const defaultTeam = [
  { id: "1", name: "Riccardo Meli", roleIt: "Chief Executive Officer", roleEn: "Chief Executive Officer", order: "1" },
  { id: "2", name: "Ivan Gatti", roleIt: "General Manager", roleEn: "General Manager", order: "2" },
  { id: "3", name: "Antonello Antonelli", roleIt: "Business Development Manager", roleEn: "Business Development Manager", order: "3" },
  { id: "4", name: "Massimiliano Uccelletti", roleIt: "Chief AI Officer", roleEn: "Chief AI Officer", order: "4" },
  { id: "5", name: "Carlo Cozzi", roleIt: "Produttore Esecutivo", roleEn: "Executive Producer", order: "5" },
  { id: "6", name: "Marco Cassese", roleIt: "Consulente Strategico", roleEn: "Strategist Consultant", order: "6" }
];

const mapLegacyCategory = (cat) => {
  if (!cat) return 'commercial';
  const c = cat.toLowerCase().trim();
  switch (c) {
    case 'tv-cinema': return 'cinema';
    case 'commercials': return 'commercial';
    case 'music-videos': return 'entertainment';
    case 'branded-content': return 'social-media';
    default: return c; // e.g. event, web-development, ai-visuals, commercial, etc.
  }
};

export default function App() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeFilter, setActiveFilter] = useState('commercial');
  const [language, setLanguage] = useState('it');
  const [activeOverlay, setActiveOverlay] = useState(null); // null, 'about', 'services'
  const [activeLegal, setActiveLegal] = useState(null); // null, 'privacy', 'cookie'
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lastOpenedProjectIdRef = useRef(null);

  // Disable scroll when overlay, project modal, or hamburger menu is active
  useEffect(() => {
    const shouldLock = activeOverlay || selectedProject || isMenuOpen || activeLegal;
    if (shouldLock) {
      document.documentElement.classList.add('scroll-locked');
      document.body.classList.add('scroll-locked');
    } else {
      document.documentElement.classList.remove('scroll-locked');
      document.body.classList.remove('scroll-locked');
    }
    return () => {
      document.documentElement.classList.remove('scroll-locked');
      document.body.classList.remove('scroll-locked');
    };
  }, [activeOverlay, selectedProject, isMenuOpen, activeLegal]);

  // Return focus to the project card that opened the modal once the modal is closed
  useEffect(() => {
    if (!selectedProject && lastOpenedProjectIdRef.current) {
      const cardEl = document.getElementById(`project-card-${lastOpenedProjectIdRef.current}`);
      if (cardEl) {
        setTimeout(() => {
          cardEl.focus({ preventScroll: true });
          cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      }
    }
  }, [selectedProject]);
  
  // Custom router, global projects, and team states
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [projects, setProjects] = useState([]);
  const [team, setTeam] = useState([]);

  useEffect(() => {
    // Check if we are on the admin path
    const checkPath = () => {
      setIsAdminRoute(window.location.pathname === '/piropiru');
    };
    checkPath();
    
    // Listen to history changes (for client-side routing)
    window.addEventListener('popstate', checkPath);

    // 1. Synchronously load from Cache (localStorage) or static defaults first
    const storedProjects = localStorage.getItem('camelia_projects');
    let initialProjects = [];
    if (storedProjects) {
      const parsed = JSON.parse(storedProjects);
      initialProjects = parsed.map((p, idx) => ({
        ...p,
        category: mapLegacyCategory(p.category),
        order: p.order || (idx + 1).toString(),
        created_at: p.created_at || new Date().toISOString()
      }));
    } else {
      initialProjects = defaultProjects.map((p, idx) => ({
        ...p,
        category: mapLegacyCategory(p.category),
        order: (idx + 1).toString(),
        created_at: new Date().toISOString()
      }));
    }
    setProjects(initialProjects);

    const storedTeam = localStorage.getItem('camelia_team');
    let initialTeam = [];
    if (storedTeam) {
      const parsed = JSON.parse(storedTeam);
      initialTeam = parsed.map((m, idx) => ({
        ...m,
        order: m.order || (idx + 1).toString(),
        created_at: m.created_at || new Date().toISOString()
      }));
    } else {
      initialTeam = defaultTeam.map((m, idx) => ({
        ...m,
        order: m.order || (idx + 1).toString(),
        created_at: m.created_at || new Date().toISOString()
      }));
    }
    setTeam(initialTeam);

    // 2. Asynchronously load from Supabase database if configured
    if (isSupabaseConfigured) {
      const fetchDatabaseData = async () => {
        try {
          // Fetch projects
          const { data: dbProjects, error: projectsError } = await supabase
            .from('projects')
            .select('*');
          
          if (projectsError) {
            console.error('Error fetching projects from Supabase:', projectsError);
          } else if (dbProjects && dbProjects.length > 0) {
            const mappedProjects = dbProjects.map(p => ({
              ...p,
              category: mapLegacyCategory(p.category)
            }));
            const sortedProjects = mappedProjects.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
            setProjects(sortedProjects);
            localStorage.setItem('camelia_projects', JSON.stringify(sortedProjects));
          }

          // Fetch team
          const { data: dbTeam, error: teamError } = await supabase
            .from('team')
            .select('*');

          if (teamError) {
            console.error('Error fetching team from Supabase:', teamError);
          } else if (dbTeam && dbTeam.length > 0) {
            const sortedTeam = dbTeam.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
            setTeam(sortedTeam);
            localStorage.setItem('camelia_team', JSON.stringify(sortedTeam));
          }
        } catch (err) {
          console.error('Database connection error:', err);
        }
      };

      fetchDatabaseData();
    }

    return () => window.removeEventListener('popstate', checkPath);
  }, []);

  const handleUpdateProjects = (newProjects) => {
    setProjects(newProjects);
    localStorage.setItem('camelia_projects', JSON.stringify(newProjects));
  };

  const handleUpdateTeam = (newTeam) => {
    setTeam(newTeam);
    localStorage.setItem('camelia_team', JSON.stringify(newTeam));
  };

  // Render Admin Panel Route
  if (isAdminRoute) {
    return (
      <AdminPanel 
        projects={projects} 
        onUpdate={handleUpdateProjects} 
        team={team} 
        onUpdateTeam={handleUpdateTeam} 
        defaultTeam={defaultTeam}
      />
    );
  }

  // Render Public Website Route
  return (
    <>
      <CustomCursor />
      {/* Navigation Header with Language Switcher & Overlay Triggers */}
      <Header 
        language={language} 
        setLanguage={setLanguage} 
        onOpenAbout={() => setActiveOverlay('about')}
        onOpenServices={() => setActiveOverlay('services')}
        onOpenContact={() => setActiveOverlay('contact')}
        onMenuStateChange={setIsMenuOpen}
      />
      
      {/* Cinematic Hero Section */}
      <Hero language={language} onDiscoverClick={() => setActiveOverlay('about')} />
      
      <main>
        {/* Work Grid */}
        <WorkGrid 
          language={language}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          onProjectSelect={(project) => {
            setSelectedProject(project);
            if (project) {
              lastOpenedProjectIdRef.current = project.id;
            }
          }}
          projects={projects}
        />
      </main>

      {/* Redesigned minimal medicine-insert style Footer */}
      <Footer 
        language={language} 
        onOpenPrivacy={() => setActiveLegal('privacy')}
        onOpenCookie={() => setActiveLegal('cookie')}
      />
      
      {/* Chi Siamo Overlay Panel */}
      {activeOverlay === 'about' && (
        <AboutSection 
          language={language} 
          onClose={() => setActiveOverlay(null)} 
          team={team}
        />
      )}

      {/* Servizi Overlay Panel */}
      {activeOverlay === 'services' && (
        <Services 
          language={language} 
          onClose={() => setActiveOverlay(null)} 
        />
      )}
      
      {/* Contatti Overlay Panel */}
      {activeOverlay === 'contact' && (
        <ContactSection 
          language={language} 
          onClose={() => setActiveOverlay(null)} 
        />
      )}
      
      {/* Project Lightbox Modal */}
      <ProjectModal 
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        language={language}
      />

      {/* Privacy / Cookie Legal Overlay */}
      {activeLegal && (
        <LegalOverlay 
          type={activeLegal} 
          language={language} 
          onClose={() => setActiveLegal(null)} 
        />
      )}
    </>
  );
}
