import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import Services from './components/Services';
import WorkGrid from './components/WorkGrid';
import Footer from './components/Footer';
import ProjectModal from './components/ProjectModal';
import AdminPanel from './components/AdminPanel';
import CustomCursor from './components/CustomCursor';
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

  // Disable scroll when overlay is active
  useEffect(() => {
    if (activeOverlay) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [activeOverlay]);
  
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
      />
      
      {/* Cinematic Hero Section */}
      <Hero language={language} onDiscoverClick={() => setActiveOverlay('about')} />
      
      <main>
        {/* Work Grid */}
        <WorkGrid 
          language={language}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          onProjectSelect={setSelectedProject}
          projects={projects}
        />
      </main>

      {/* Redesigned minimal medicine-insert style Footer */}
      <Footer language={language} />
      
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
      
      {/* Project Lightbox Modal */}
      <ProjectModal 
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        language={language}
      />
    </>
  );
}
