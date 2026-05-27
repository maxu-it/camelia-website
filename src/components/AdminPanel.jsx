import React, { useState, useEffect } from 'react';
import defaultProjects from '../projects.json';
import { supabase, isSupabaseConfigured } from '../supabaseClient';

// Helper to extract Vimeo ID/Hash from any Vimeo URL
const extractVimeoDetails = (input) => {
  if (!input) return "";
  input = input.trim();
  
  if (!input.includes("vimeo.com")) {
    return input;
  }
  
  try {
    const url = new URL(input);
    const path = url.pathname.replace(/^\/+/g, ''); // Remove leading slash
    
    if (path.startsWith("cameliapictures/")) {
      return path;
    }
    
    const parts = path.split('/');
    if (parts.length >= 2 && !isNaN(parts[0])) {
      return `${parts[0]}/${parts[1]}`;
    }
    
    if (parts.length === 1 && !isNaN(parts[0])) {
      return parts[0];
    }
    
    return path;
  } catch (e) {
    return input;
  }
};

export default function AdminPanel({ projects, onUpdate, team = [], onUpdateTeam, defaultTeam }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  
  // Tab states
  const [activeTab, setActiveTab] = useState('projects'); // 'projects' or 'team'

  // Form states for Projects
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'commercial',
    vimeoLink: '',
    director: '',
    dp: '',
    year: new Date().getFullYear().toString(),
    description_it: '',
    description_en: '',
    thumbnail: '',
    visibility: 'si',
    order: '1'
  });
  const [customCredits, setCustomCredits] = useState([]);

  // Form states for Team members
  const [isTeamFormOpen, setIsTeamFormOpen] = useState(false);
  const [editingTeamMember, setEditingTeamMember] = useState(null);
  const [teamFormData, setTeamFormData] = useState({
    name: '',
    roleIt: '',
    roleEn: '',
    order: '1'
  });

  const [dbProjectsCount, setDbProjectsCount] = useState(null);
  const [userEmail, setUserEmail] = useState('');

  // User management states
  const [adminUsers, setAdminUsers] = useState([]);
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [editingAdminUser, setEditingAdminUser] = useState(null);
  const [userFormData, setUserFormData] = useState({
    username: '',
    password: '',
    isActive: true
  });

  // Define superuser check (only maxu@libero.it)
  const isSuperUser = !isSupabaseConfigured || userEmail.toLowerCase() === 'maxu@libero.it';

  // Check login state on mount
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('camelia_admin_auth');
    const sessionUser = sessionStorage.getItem('camelia_admin_user');
    if (sessionAuth === 'true' && sessionUser) {
      setIsLoggedIn(true);
      setUserEmail(sessionUser);
    }
  }, []);

  // Check if database is empty once logged in
  useEffect(() => {
    if (isSupabaseConfigured && isLoggedIn) {
      const checkDbEmpty = async () => {
        try {
          const { count, error } = await supabase
            .from('projects')
            .select('*', { count: 'exact', head: true });
          if (!error && count !== null) {
            setDbProjectsCount(count);
          }
        } catch (err) {
          console.error("Error checking db count:", err);
        }
      };
      checkDbEmpty();
    }
  }, [isLoggedIn]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const inputUsername = username.trim();
    const lowerUsername = inputUsername.toLowerCase();
    
    if (isSupabaseConfigured) {
      setLoginError('');
      try {
        if (lowerUsername === 'maxu@libero.it') {
          // Direct login for Superuser
          const { data, error } = await supabase.auth.signInWithPassword({
            email: 'maxu@libero.it',
            password
          });
          if (error) {
            console.error("Supabase Auth Error:", error);
            setLoginError(`Errore di accesso: ${error.message}`);
          } else {
            setIsLoggedIn(true);
            setUserEmail('maxu@libero.it');
            sessionStorage.setItem('camelia_admin_auth', 'true');
            sessionStorage.setItem('camelia_admin_user', 'maxu@libero.it');
            setLoginError('');
          }
        } else {
          // Standard admin login (hybrid approach)
          // 1. Authenticate standard_admin under the hood to get RLS access
          const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: 'standard_admin@cameliapictures.com',
            password: 'CameliaStandardAdmin2026!'
          });
          
          if (authError) {
            console.error("Supabase standard_admin Auth Error:", authError);
            setLoginError("Errore del server di autenticazione.");
            return;
          }
          
          // 2. Query the custom admin_users table for the specific username and password
          const { data: userData, error: dbError } = await supabase
            .from('admin_users')
            .select('*')
            .eq('username', inputUsername)
            .eq('password', password)
            .eq('is_active', true)
            .maybeSingle();
            
          if (dbError) {
            console.error("Database query error:", dbError);
            await supabase.auth.signOut();
            setLoginError("Errore durante la verifica delle credenziali.");
          } else if (!userData) {
            // No matching active user found, log out immediately
            await supabase.auth.signOut();
            setLoginError("Credenziali non corrette o account sospeso.");
          } else {
            // Success
            setIsLoggedIn(true);
            setUserEmail(userData.username);
            sessionStorage.setItem('camelia_admin_auth', 'true');
            sessionStorage.setItem('camelia_admin_user', userData.username);
            setLoginError('');
          }
        }
      } catch (err) {
        setLoginError(`Errore imprevisto: ${err.message}`);
      }
    } else {
      // Offline mode
      if (lowerUsername === 'maxu@libero.it' && password === 'Superuser2026') {
        setIsLoggedIn(true);
        setUserEmail('maxu@libero.it');
        sessionStorage.setItem('camelia_admin_auth', 'true');
        sessionStorage.setItem('camelia_admin_user', 'maxu@libero.it');
        setLoginError('');
      } else if (lowerUsername === 'cameliadm' && password === 'ToTheUniverse') {
        setIsLoggedIn(true);
        setUserEmail('cameliadm');
        sessionStorage.setItem('camelia_admin_auth', 'true');
        sessionStorage.setItem('camelia_admin_user', 'cameliadm');
        setLoginError('');
      } else {
        setLoginError('Credenziali non corrette.');
      }
    }
  };

  const handleLogout = async () => {
    setIsLoggedIn(false);
    setUserEmail('');
    sessionStorage.removeItem('camelia_admin_auth');
    sessionStorage.removeItem('camelia_admin_user');
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
  };

  const handleSeedDatabase = async () => {
    if (!window.confirm("Vuoi inizializzare il database Supabase caricando i 26 progetti di default? Questa operazione caricherà l'elenco predefinito.")) return;
    
    setSeeding(true);
    try {
      // 1. Seed Projects
      const projectsToSeed = defaultProjects.map((p, idx) => ({
        ...p,
        order: (idx + 1).toString(),
        created_at: new Date().toISOString()
      }));
      
      const { error: projectsError } = await supabase
        .from('projects')
        .insert(projectsToSeed);
        
      if (projectsError) {
        throw new Error(`Errore progetti: ${projectsError.message}`);
      }

      // 2. Seed Team
      const teamToSeed = defaultTeam.map((m, idx) => ({
        ...m,
        order: m.order || (idx + 1).toString(),
        created_at: new Date().toISOString()
      }));

      const { error: teamError } = await supabase
        .from('team')
        .insert(teamToSeed);
        
      if (teamError) {
        throw new Error(`Errore team: ${teamError.message}`);
      }

      alert("Database Supabase inizializzato con successo! Ricarica la pagina per visualizzare i dati.");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert(`Errore durante l'inizializzazione: ${err.message}`);
    } finally {
      setSeeding(false);
    }
  };

  // --- PROJECT MANAGEMENT HANDLERS ---
  const toggleVisibility = async (id) => {
    const updated = projects.map(p => {
      const currentVis = p.visibility || 'si';
      return {
        ...p,
        visibility: p.id === id ? (currentVis === 'si' ? 'no' : 'si') : currentVis,
        created_at: p.created_at || new Date().toISOString()
      };
    });

    if (isSupabaseConfigured) {
      const targetProject = updated.find(p => p.id === id);
      try {
        const { error } = await supabase
          .from('projects')
          .upsert(targetProject);
        if (error) {
          console.error("Error updating visibility on Supabase:", error);
          alert(`Errore salvataggio database: ${error.message}`);
          return;
        }
      } catch (err) {
        console.error(err);
      }
    }
    onUpdate(updated);
  };

  const handleMove = async (index, direction) => {
    const sorted = [...projects].sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
    
    if (direction === 'up' && index > 0) {
      const temp = sorted[index];
      sorted[index] = sorted[index - 1];
      sorted[index - 1] = temp;
    } else if (direction === 'down' && index < sorted.length - 1) {
      const temp = sorted[index];
      sorted[index] = sorted[index + 1];
      sorted[index + 1] = temp;
    }

    const updated = sorted.map((p, idx) => ({
      ...p,
      order: (idx + 1).toString(),
      created_at: p.created_at || new Date().toISOString()
    }));

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('projects')
          .upsert(updated);
        if (error) {
          console.error("Error updating order on Supabase:", error);
          alert(`Errore salvataggio database: ${error.message}`);
          return;
        }
      } catch (err) {
        console.error(err);
      }
    }
    onUpdate(updated);
  };

  const handleAddClick = () => {
    const nextOrder = (projects.length + 1).toString();
    setEditingProject(null);
    setFormData({
      title: '',
      category: 'commercial',
      vimeoLink: '',
      director: '',
      dp: '',
      year: new Date().getFullYear().toString(),
      description_it: '',
      description_en: '',
      thumbnail: '',
      visibility: 'si',
      order: nextOrder
    });
    setCustomCredits([]);
    setIsFormOpen(true);
  };

  const handleEditClick = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || '',
      category: project.category || 'commercial',
      vimeoLink: project.vimeoId ? (project.vimeoId.startsWith('http') ? project.vimeoId : `https://vimeo.com/${project.vimeoId}`) : '',
      director: project.director || '',
      dp: (project.credits && project.credits["Director of Photography"]) || '',
      year: project.year || '',
      description_it: project.description_it || '',
      description_en: project.description_en || '',
      thumbnail: project.thumbnail || '',
      visibility: project.visibility || 'si',
      order: project.order || '1'
    });

    const otherCredits = Object.entries(project.credits || {})
      .filter(([key]) => key !== 'Director' && key !== 'Director of Photography')
      .map(([key, value]) => ({ key, value }));

    setCustomCredits(otherCredits);
    setIsFormOpen(true);
  };

  const handleDeleteClick = async (id, title) => {
    if (window.confirm(`Sei sicuro di voler eliminare la scheda "${title}"?`)) {
      if (isSupabaseConfigured) {
        try {
          const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id);
          if (error) {
            console.error("Error deleting project from Supabase:", error);
            alert(`Errore eliminazione database: ${error.message}`);
            return;
          }
        } catch (err) {
          console.error(err);
        }
      }
      const updated = projects.filter(p => p.id !== id);
      onUpdate(updated);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        setFormData(prev => ({ ...prev, thumbnail: compressedBase64 }));
        setUploading(false);
      };
      img.onerror = () => {
        setUploading(false);
        alert("Errore durante l'elaborazione dell'immagine.");
      };
    };
    reader.onerror = () => {
      setUploading(false);
      alert("Errore durante la lettura del file.");
    };
  };

  const handleCustomCreditChange = (index, field, value) => {
    const updated = [...customCredits];
    updated[index] = { ...updated[index], [field]: value };
    setCustomCredits(updated);
  };

  const handleAddCustomCredit = () => {
    if (customCredits.length >= 12) return;
    setCustomCredits(prev => [...prev, { key: '', value: '' }]);
  };

  const handleRemoveCustomCredit = (index) => {
    setCustomCredits(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const parsedVimeoId = extractVimeoDetails(formData.vimeoLink);

    const creditsObj = {
      "Director": formData.director,
      "Director of Photography": formData.dp
    };

    customCredits.forEach(c => {
      if (c.key.trim() && c.value.trim()) {
        creditsObj[c.key.trim()] = c.value.trim();
      }
    });

    let clientVal = "";
    customCredits.forEach(c => {
      const normalizedKey = c.key.trim().toLowerCase();
      if (normalizedKey === 'client' || normalizedKey === 'cliente') {
        clientVal = c.value.trim();
      }
    });

    const projectObject = {
      id: editingProject ? editingProject.id : Date.now().toString(),
      title: formData.title,
      category: formData.category,
      vimeoId: parsedVimeoId,
      director: formData.director,
      client: clientVal,
      year: formData.year,
      description_it: formData.description_it,
      description_en: formData.description_en,
      thumbnail: formData.thumbnail || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop",
      visibility: formData.visibility,
      order: formData.order,
      created_at: editingProject && editingProject.created_at ? editingProject.created_at : new Date().toISOString(),
      credits: creditsObj
    };

    let updatedProjectsList = [];
    if (editingProject) {
      updatedProjectsList = projects.map(p => p.id === editingProject.id ? projectObject : p);
    } else {
      updatedProjectsList = [...projects, projectObject];
    }

    const sortedList = updatedProjectsList.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
    const reorderedList = sortedList.map((p, idx) => ({
      ...p,
      order: (idx + 1).toString(),
      created_at: p.created_at || new Date().toISOString()
    }));

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('projects')
          .upsert(reorderedList);
        if (error) {
          console.error("Error upserting projects to Supabase:", error);
          alert(`Errore salvataggio database: ${error.message}`);
          return;
        }
      } catch (err) {
        console.error(err);
      }
    }

    onUpdate(reorderedList);
    setIsFormOpen(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- TEAM MANAGEMENT HANDLERS ---
  const handleTeamFormChange = (e) => {
    const { name, value } = e.target;
    setTeamFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTeamMove = async (index, direction) => {
    const sorted = [...team].sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
    
    if (direction === 'up' && index > 0) {
      const temp = sorted[index];
      sorted[index] = sorted[index - 1];
      sorted[index - 1] = temp;
    } else if (direction === 'down' && index < sorted.length - 1) {
      const temp = sorted[index];
      sorted[index] = sorted[index + 1];
      sorted[index + 1] = temp;
    }

    const updated = sorted.map((m, idx) => ({
      ...m,
      order: (idx + 1).toString(),
      created_at: m.created_at || new Date().toISOString()
    }));

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('team')
          .upsert(updated);
        if (error) {
          console.error("Error updating team order on Supabase:", error);
          alert(`Errore salvataggio database: ${error.message}`);
          return;
        }
      } catch (err) {
        console.error(err);
      }
    }
    onUpdateTeam(updated);
  };

  const handleTeamAddClick = () => {
    const nextOrder = (team.length + 1).toString();
    setEditingTeamMember(null);
    setTeamFormData({
      name: '',
      roleIt: '',
      roleEn: '',
      order: nextOrder
    });
    setIsTeamFormOpen(true);
  };

  const handleTeamEditClick = (member) => {
    setEditingTeamMember(member);
    setTeamFormData({
      name: member.name || '',
      roleIt: member.roleIt || '',
      roleEn: member.roleEn || '',
      order: member.order || '1'
    });
    setIsTeamFormOpen(true);
  };

  const handleTeamDeleteClick = async (id, name) => {
    if (window.confirm(`Sei sicuro di voler eliminare "${name}" dal team?`)) {
      if (isSupabaseConfigured) {
        try {
          const { error } = await supabase
            .from('team')
            .delete()
            .eq('id', id);
          if (error) {
            console.error("Error deleting team member from Supabase:", error);
            alert(`Errore eliminazione database: ${error.message}`);
            return;
          }
        } catch (err) {
          console.error(err);
        }
      }
      const updated = team.filter(m => m.id !== id);
      const reordered = updated
        .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))
        .map((m, idx) => ({ 
          ...m, 
          order: (idx + 1).toString(),
          created_at: m.created_at || new Date().toISOString()
        }));
      
      if (isSupabaseConfigured && reordered.length > 0) {
        try {
          await supabase.from('team').upsert(reordered);
        } catch (err) {
          console.error(err);
        }
      }
      onUpdateTeam(reordered);
    }
  };

  const handleTeamSave = async (e) => {
    e.preventDefault();
    const memberObject = {
      id: editingTeamMember ? editingTeamMember.id : Date.now().toString(),
      name: teamFormData.name,
      roleIt: teamFormData.roleIt,
      roleEn: teamFormData.roleEn,
      order: teamFormData.order,
      created_at: editingTeamMember && editingTeamMember.created_at ? editingTeamMember.created_at : new Date().toISOString()
    };

    let updatedList = [];
    if (editingTeamMember) {
      updatedList = team.map(m => m.id === editingTeamMember.id ? memberObject : m);
    } else {
      updatedList = [...team, memberObject];
    }

    const sortedList = updatedList.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
    const reorderedList = sortedList.map((m, idx) => ({
      ...m,
      order: (idx + 1).toString(),
      created_at: m.created_at || new Date().toISOString()
    }));

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('team')
          .upsert(reorderedList);
        if (error) {
          console.error("Error upserting team to Supabase:", error);
          alert(`Errore salvataggio database: ${error.message}`);
          return;
        }
      } catch (err) {
        console.error(err);
      }
    }

    onUpdateTeam(reorderedList);
    setIsTeamFormOpen(false);
  };

  const handleResetTeamToDefaults = async () => {
    if (window.confirm("Attenzione: questa azione cancellerà tutte le modifiche salvate per il team e ripristinerà i membri originali. Procedere?")) {
      if (isSupabaseConfigured) {
        try {
          const { error: deleteError } = await supabase
            .from('team')
            .delete()
            .neq('id', '0');
          
          if (deleteError) {
            console.error("Error clearing team in Supabase:", deleteError);
            alert(`Errore durante il reset del database: ${deleteError.message}`);
            return;
          }

          const { error: insertError } = await supabase
            .from('team')
            .insert(defaultTeam);
          
          if (insertError) {
            console.error("Error inserting default team in Supabase:", insertError);
            alert(`Errore durante il reinserimento: ${insertError.message}`);
            return;
          }
        } catch (err) {
          console.error(err);
        }
      }
      onUpdateTeam(defaultTeam);
    }
  };

  // --- USER MANAGEMENT HANDLERS ---
  const fetchAdminUsers = async () => {
    if (isSupabaseConfigured && isSuperUser) {
      try {
        const { data, error } = await supabase
          .from('admin_users')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) {
          console.error("Error fetching admin users:", error);
        } else if (data) {
          setAdminUsers(data);
        }
      } catch (err) {
        console.error("Error in fetchAdminUsers:", err);
      }
    } else if (!isSupabaseConfigured && isSuperUser) {
      // Mock local storage for offline admin users
      const stored = localStorage.getItem('camelia_mock_admin_users');
      if (stored) {
        setAdminUsers(JSON.parse(stored));
      } else {
        const defaultMock = [
          { id: '1', username: 'cameliadm', password: 'ToTheUniverse', is_active: true, created_at: new Date().toISOString() }
        ];
        localStorage.setItem('camelia_mock_admin_users', JSON.stringify(defaultMock));
        setAdminUsers(defaultMock);
      }
    }
  };

  useEffect(() => {
    if (isLoggedIn && isSuperUser && activeTab === 'users') {
      fetchAdminUsers();
    }
  }, [isLoggedIn, isSuperUser, activeTab]);

  const handleUserFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleUserAddClick = () => {
    setEditingAdminUser(null);
    setUserFormData({
      username: '',
      password: '',
      isActive: true
    });
    setIsUserFormOpen(true);
  };

  const handleUserEditClick = (user) => {
    setEditingAdminUser(user);
    setUserFormData({
      username: user.username,
      password: user.password,
      isActive: user.is_active
    });
    setIsUserFormOpen(true);
  };

  const handleUserDeleteClick = async (id, usernameToDelete) => {
    if (usernameToDelete.toLowerCase() === 'maxu@libero.it') {
      alert("Non è possibile eliminare il superuser principale.");
      return;
    }
    if (window.confirm(`Sei sicuro di voler eliminare l'utente "${usernameToDelete}"?`)) {
      if (isSupabaseConfigured) {
        try {
          const { error } = await supabase
            .from('admin_users')
            .delete()
            .eq('id', id);
          if (error) {
            console.error("Error deleting user:", error);
            alert(`Errore eliminazione: ${error.message}`);
            return;
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        // Offline delete
        const stored = localStorage.getItem('camelia_mock_admin_users');
        if (stored) {
          const list = JSON.parse(stored);
          const updated = list.filter(u => u.id !== id);
          localStorage.setItem('camelia_mock_admin_users', JSON.stringify(updated));
        }
      }
      fetchAdminUsers();
    }
  };

  const handleUserToggleActive = async (user) => {
    if (user.username.toLowerCase() === 'maxu@libero.it') {
      alert("Non è possibile disattivare il superuser principale.");
      return;
    }
    const nextActive = !user.is_active;
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('admin_users')
          .update({ is_active: nextActive })
          .eq('id', user.id);
        if (error) {
          console.error("Error updating user status:", error);
          alert(`Errore modifica stato: ${error.message}`);
          return;
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      // Offline update
      const stored = localStorage.getItem('camelia_mock_admin_users');
      if (stored) {
        const list = JSON.parse(stored);
        const updated = list.map(u => u.id === user.id ? { ...u, is_active: nextActive } : u);
        localStorage.setItem('camelia_mock_admin_users', JSON.stringify(updated));
      }
    }
    fetchAdminUsers();
  };

  const handleUserSave = async (e) => {
    e.preventDefault();
    const targetUsername = userFormData.username.trim();
    if (!targetUsername) return;

    if (targetUsername.toLowerCase() === 'maxu@libero.it') {
      alert("Non è consentito creare o modificare utenti con l'email del superuser principale.");
      return;
    }

    if (isSupabaseConfigured) {
      try {
        if (editingAdminUser) {
          // Check if username is being changed to something else that already exists
          if (targetUsername !== editingAdminUser.username) {
            const { data: exists } = await supabase
              .from('admin_users')
              .select('id')
              .eq('username', targetUsername)
              .maybeSingle();
            if (exists) {
              alert(`L'utente "${targetUsername}" esiste già.`);
              return;
            }
          }
          // Edit existing
          const { error } = await supabase
            .from('admin_users')
            .update({
              username: targetUsername,
              password: userFormData.password,
              is_active: userFormData.isActive
            })
            .eq('id', editingAdminUser.id);
          if (error) {
            alert(`Errore modifica utente: ${error.message}`);
            return;
          }
        } else {
          // Add new
          // Check if username already exists
          const { data: exists } = await supabase
            .from('admin_users')
            .select('id')
            .eq('username', targetUsername)
            .maybeSingle();
          if (exists) {
            alert(`L'utente "${targetUsername}" esiste già.`);
            return;
          }

          const newUser = {
            id: Date.now().toString(),
            username: targetUsername,
            password: userFormData.password,
            is_active: userFormData.isActive,
            created_at: new Date().toISOString()
          };
          const { error } = await supabase
            .from('admin_users')
            .insert(newUser);
          if (error) {
            alert(`Errore inserimento utente: ${error.message}`);
            return;
          }
        }
      } catch (err) {
        console.error(err);
        alert(`Errore: ${err.message}`);
        return;
      }
    } else {
      // Offline CRUD
      const stored = localStorage.getItem('camelia_mock_admin_users') || '[]';
      const list = JSON.parse(stored);
      
      if (editingAdminUser) {
        if (targetUsername !== editingAdminUser.username && list.some(u => u.username.toLowerCase() === targetUsername.toLowerCase())) {
          alert(`L'utente "${targetUsername}" esiste già.`);
          return;
        }
        const updated = list.map(u => u.id === editingAdminUser.id ? {
          ...u,
          username: targetUsername,
          password: userFormData.password,
          is_active: userFormData.isActive
        } : u);
        localStorage.setItem('camelia_mock_admin_users', JSON.stringify(updated));
      } else {
        if (list.some(u => u.username.toLowerCase() === targetUsername.toLowerCase())) {
          alert(`L'utente "${targetUsername}" esiste già.`);
          return;
        }
        const newUser = {
          id: Date.now().toString(),
          username: targetUsername,
          password: userFormData.password,
          is_active: userFormData.isActive,
          created_at: new Date().toISOString()
        };
        list.push(newUser);
        localStorage.setItem('camelia_mock_admin_users', JSON.stringify(list));
      }
    }

    setIsUserFormOpen(false);
    fetchAdminUsers();
  };

  // Sorting items for display
  const sortedProjects = [...projects].sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
  const sortedTeam = [...team].sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

  if (!isLoggedIn) {
    return (
      <div className="admin-login-container">
        <form className="admin-login-form" onSubmit={handleLogin}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <img src="/logo_white.png" alt="CAMELIA Logo" style={{ height: '35px', marginBottom: '1rem' }} />
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-primary)' }}>Admin Login</h2>
          </div>
          
          {loginError && <div style={{ color: '#ff4a4a', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }}>{loginError}</div>}
          
          <div className="admin-form-group">
            <label htmlFor="username">Username</label>
            <input 
              type="text" 
              id="username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          
          <div className="admin-form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          
          <button type="submit" className="admin-btn admin-btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Accedi
          </button>
          
          <button 
            type="button" 
            onClick={() => window.history.pushState({}, '', '/')} 
            className="admin-btn" 
            style={{ width: '100%', marginTop: '1rem', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)' }}
          >
            Torna al Sito
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-dashboard" style={{ background: 'var(--bg-color)', minHeight: '100vh', padding: '3rem 0' }}>
      <div className="container">
        
        {/* Admin Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', borderBottom: '1px solid var(--accent-muted)', paddingBottom: '2rem' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-primary)' }}>Pannello Amministrazione</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.4rem' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Gestione del sito web CAMELIA</p>
              <span style={{ color: 'var(--accent-muted)', fontSize: '0.9rem' }}>|</span>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Connesso come: <strong style={{ color: 'var(--text-primary)' }}>{userEmail}</strong>
                {isSuperUser && <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', background: 'rgba(255, 193, 7, 0.15)', color: '#ffc107', padding: '2px 6px', borderRadius: '3px', border: '1px solid rgba(255, 193, 7, 0.3)' }}>Superuser</span>}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={() => {
                window.history.pushState({}, '', '/');
                window.dispatchEvent(new Event('popstate'));
              }} 
              className="admin-btn"
              style={{ border: '1px solid var(--text-primary)' }}
            >
              Visualizza Sito
            </button>
            <button onClick={handleLogout} className="admin-btn" style={{ border: '1px solid var(--text-muted)', color: 'var(--text-muted)' }}>
              Esci
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="admin-tabs">
          <button 
            className={`admin-tab ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            Progetti ({projects.length})
          </button>
          <button 
            className={`admin-tab ${activeTab === 'team' ? 'active' : ''}`}
            onClick={() => setActiveTab('team')}
          >
            Team ({team.length})
          </button>
          {isSuperUser && (
            <button 
              className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              Utenti ({adminUsers.length})
            </button>
          )}
        </div>

        {/* --- PROJECTS TAB CONTENT --- */}
        {activeTab === 'projects' && (
          <>
            {isSupabaseConfigured && isSuperUser && dbProjectsCount === 0 && (
              <div style={{ background: 'rgba(255, 193, 7, 0.1)', border: '1px solid rgba(255, 193, 7, 0.3)', borderRadius: '4px', padding: '1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ color: '#ffc107', fontFamily: 'var(--font-display)', marginBottom: '0.2rem' }}>Database Supabase Vuoto</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Non sono presenti progetti nel database cloud di Supabase. Puoi inizializzarlo con i progetti e i membri del team di default.</p>
                </div>
                <button 
                  onClick={handleSeedDatabase} 
                  disabled={seeding}
                  className="admin-btn" 
                  style={{ background: '#ffc107', color: '#000', fontWeight: 'bold' }}
                >
                  {seeding ? 'Inizializzazione...' : 'Inizializza con Default'}
                </button>
              </div>
            )}

            {/* Dashboard Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <button onClick={handleAddClick} className="admin-btn admin-btn-primary">
                + Aggiungi Scheda Progetto
              </button>
            </div>

            {/* Table List */}
            <div style={{ overflowX: 'auto', background: 'var(--bg-card)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.03)', marginBottom: '3rem' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>Ord</th>
                    <th style={{ width: '80px' }}>Cover</th>
                    <th>Titolo</th>
                    <th>Categoria</th>
                    <th>Link Vimeo</th>
                    <th>Regia / Cliente</th>
                    <th style={{ width: '100px', textAlign: 'center' }}>Visibile</th>
                    <th style={{ width: '150px', textAlign: 'center' }}>Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedProjects.map((project, index) => {
                    const isVisible = project.visibility !== 'no';
                    return (
                      <tr key={project.id}>
                        {/* Order Controls */}
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                            <button 
                              onClick={() => handleMove(index, 'up')} 
                              disabled={index === 0}
                              style={{ opacity: index === 0 ? 0.2 : 0.7, cursor: index === 0 ? 'default' : 'pointer' }}
                            >
                              ▲
                            </button>
                            <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{project.order}</span>
                            <button 
                              onClick={() => handleMove(index, 'down')} 
                              disabled={index === sortedProjects.length - 1}
                              style={{ opacity: index === sortedProjects.length - 1 ? 0.2 : 0.7, cursor: index === sortedProjects.length - 1 ? 'default' : 'pointer' }}
                            >
                              ▼
                            </button>
                          </div>
                        </td>
                        
                        {/* Cover Preview */}
                        <td>
                          <img 
                            src={project.thumbnail} 
                            alt="" 
                            style={{ width: '60px', height: '38px', objectFit: 'cover', borderRadius: '2px', display: 'block' }} 
                          />
                        </td>
                        
                        {/* Title */}
                        <td>
                          <strong style={{ color: 'var(--text-primary)' }}>{project.title}</strong>
                          <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Anno: {project.year}</span>
                        </td>
                        
                        {/* Category */}
                        <td style={{ textTransform: 'capitalize', fontSize: '0.85rem' }}>{project.category.replace("-", " ")}</td>
                        
                        {/* Vimeo ID / Link */}
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          <code>{project.vimeoId}</code>
                        </td>
                        
                        {/* Director / Client */}
                        <td style={{ fontSize: '0.85rem' }}>
                          <div>Regia: {project.director}</div>
                          {project.client && <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Client: {project.client}</div>}
                        </td>
                        
                        {/* Visibility Toggle */}
                        <td style={{ textAlign: 'center' }}>
                          <button 
                            onClick={() => toggleVisibility(project.id)}
                            className={`visible-badge ${isVisible ? 'vis-yes' : 'vis-no'}`}
                          >
                            {isVisible ? 'SI' : 'NO'}
                          </button>
                        </td>
                        
                        {/* Action Buttons */}
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                            <button onClick={() => handleEditClick(project)} className="admin-btn admin-btn-action" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                              Modifica
                            </button>
                            <button onClick={() => handleDeleteClick(project.id, project.title)} className="admin-btn admin-btn-action" style={{ background: '#301313', color: '#ff8a8a' }}>
                              Elimina
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* --- TEAM TAB CONTENT --- */}
        {activeTab === 'team' && (
          <>
            {/* Dashboard Controls for Team */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <button onClick={handleTeamAddClick} className="admin-btn admin-btn-primary">
                + Aggiungi Membro Team
              </button>
              {isSuperUser && (
                <button onClick={handleResetTeamToDefaults} className="admin-btn" style={{ background: '#4a1515', color: '#ff9a9a' }}>
                  Ripristina Membri Predefiniti
                </button>
              )}
            </div>

            {/* Table List for Team */}
            <div style={{ overflowX: 'auto', background: 'var(--bg-card)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.03)', marginBottom: '3rem' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>Ord</th>
                    <th>Nome</th>
                    <th>Mansione / Ruolo (Italiano)</th>
                    <th>Mansione / Ruolo (Inglese)</th>
                    <th style={{ width: '150px', textAlign: 'center' }}>Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTeam.map((member, index) => (
                    <tr key={member.id}>
                      {/* Order Controls */}
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                          <button 
                            onClick={() => handleTeamMove(index, 'up')} 
                            disabled={index === 0}
                            style={{ opacity: index === 0 ? 0.2 : 0.7, cursor: index === 0 ? 'default' : 'pointer' }}
                          >
                            ▲
                          </button>
                          <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{member.order}</span>
                          <button 
                            onClick={() => handleTeamMove(index, 'down')} 
                            disabled={index === sortedTeam.length - 1}
                            style={{ opacity: index === sortedTeam.length - 1 ? 0.2 : 0.7, cursor: index === sortedTeam.length - 1 ? 'default' : 'pointer' }}
                          >
                            ▼
                          </button>
                        </div>
                      </td>
                      
                      {/* Name */}
                      <td>
                        <strong style={{ color: 'var(--text-primary)' }}>{member.name}</strong>
                      </td>
                      
                      {/* Role IT */}
                      <td>{member.roleIt}</td>

                      {/* Role EN */}
                      <td>{member.roleEn}</td>
                      
                      {/* Action Buttons */}
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                          <button onClick={() => handleTeamEditClick(member)} className="admin-btn admin-btn-action" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                            Modifica
                          </button>
                          <button onClick={() => handleTeamDeleteClick(member.id, member.name)} className="admin-btn admin-btn-action" style={{ background: '#301313', color: '#ff8a8a' }}>
                            Elimina
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* --- USERS TAB CONTENT --- */}
        {activeTab === 'users' && isSuperUser && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <button onClick={handleUserAddClick} className="admin-btn admin-btn-primary">
                + Aggiungi Utente Admin
              </button>
            </div>

            <div style={{ overflowX: 'auto', background: 'var(--bg-card)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.03)', marginBottom: '3rem' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Password</th>
                    <th style={{ width: '150px', textAlign: 'center' }}>Stato Accesso</th>
                    <th style={{ width: '200px', textAlign: 'center' }}>Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {adminUsers.map((user) => {
                    const isActive = user.is_active !== false;
                    return (
                      <tr key={user.id}>
                        <td>
                          <strong style={{ color: 'var(--text-primary)' }}>{user.username}</strong>
                        </td>
                        <td>
                          <span style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{user.password}</span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button 
                            onClick={() => handleUserToggleActive(user)}
                            className={`visible-badge ${isActive ? 'vis-yes' : 'vis-no'}`}
                            style={{ textTransform: 'uppercase', minWidth: '90px' }}
                          >
                            {isActive ? 'Attivo' : 'Sospeso'}
                          </button>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                            <button onClick={() => handleUserEditClick(user)} className="admin-btn admin-btn-action" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                              Modifica
                            </button>
                            <button onClick={() => handleUserDeleteClick(user.id, user.username)} className="admin-btn admin-btn-action" style={{ background: '#301313', color: '#ff8a8a' }}>
                              Elimina
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {adminUsers.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                        Nessun utente amministratore configurato.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* --- MODAL FORMS --- */}

        {/* Modal Form Overlay for Projects */}
        {isFormOpen && (
          <div className="admin-form-modal">
            <div className="admin-form-content">
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
                {editingProject ? `Modifica Scheda: ${editingProject.title}` : 'Aggiungi Nuova Scheda Progetto'}
              </h3>
              
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div className="admin-form-group">
                    <label>Titolo Progetto *</label>
                    <input 
                      type="text" 
                      name="title" 
                      value={formData.title} 
                      onChange={handleFormChange} 
                      required 
                    />
                  </div>
                  
                  <div className="admin-form-group">
                    <label>Categoria *</label>
                    <select 
                      name="category" 
                      value={formData.category} 
                      onChange={handleFormChange}
                    >
                      <option value="commercial">Commercial</option>
                      <option value="entertainment">Entertainment</option>
                      <option value="cinema">Cinema</option>
                      <option value="ai-visuals">AI Visuals</option>
                      <option value="social-media">Social Media</option>
                      <option value="web-development">Web Development</option>
                      <option value="podcast">Podcast</option>
                      <option value="event">Event</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                  <div className="admin-form-group">
                    <label>Link Vimeo o URL Esterno (es. https://vimeo.com/... o https://mio-sito.com)</label>
                    <input 
                      type="text" 
                      name="vimeoLink" 
                      value={formData.vimeoLink} 
                      onChange={handleFormChange}
                      placeholder="Inserisci link Vimeo o URL esterno (opzionale)"
                    />
                  </div>
                  
                  <div className="admin-form-group">
                    <label>Anno *</label>
                    <input 
                      type="text" 
                      name="year" 
                      value={formData.year} 
                      onChange={handleFormChange} 
                      required 
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div className="admin-form-group">
                    <label>Regista (Regia) *</label>
                    <input 
                      type="text" 
                      name="director" 
                      value={formData.director} 
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  
                  <div className="admin-form-group">
                    <label>Direttore della Fotografia (D.P.) *</label>
                    <input 
                      type="text" 
                      name="dp" 
                      value={formData.dp} 
                      onChange={handleFormChange} 
                      required
                    />
                  </div>
                </div>

                <div className="admin-form-group" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
                  <label style={{ fontWeight: 'bold', marginBottom: '1rem', display: 'block' }}>Ruoli Autoriali Personalizzati (Max 12)</label>
                  
                  {customCredits.map((credit, idx) => (
                    <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 40px', gap: '1rem', alignItems: 'center', marginBottom: '0.8rem' }}>
                      <input 
                        type="text" 
                        placeholder="es. Montaggio, Attore Principale, Produttore" 
                        value={credit.key}
                        onChange={(e) => handleCustomCreditChange(idx, 'key', e.target.value)}
                        required
                      />
                      <input 
                        type="text" 
                        placeholder="Nome del collaboratore" 
                        value={credit.value}
                        onChange={(e) => handleCustomCreditChange(idx, 'value', e.target.value)}
                        required
                      />
                      <button 
                        type="button" 
                        onClick={() => handleRemoveCustomCredit(idx)} 
                        className="admin-btn"
                        style={{ padding: '0.5rem', background: '#3a1313', color: '#ff8a8a', width: '35px', height: '35px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  
                  {customCredits.length < 12 && (
                    <button 
                      type="button" 
                      onClick={handleAddCustomCredit} 
                      className="admin-btn"
                      style={{ border: '1px solid rgba(255,255,255,0.15)', marginTop: '0.5rem', display: 'inline-flex', gap: '8px' }}
                    >
                      + Aggiungi Ruolo Autoriale
                    </button>
                  )}
                </div>

                <div className="admin-form-group" style={{ border: '1px solid rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '4px', background: 'rgba(0,0,0,0.1)', marginTop: '0.5rem' }}>
                  <label style={{ marginBottom: '1rem', display: 'block', fontWeight: 'bold' }}>Immagine di Copertina (Thumbnail) *</label>
                  
                  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{ flexGrow: 1 }}>
                      <input 
                        type="file" 
                        id="thumbnail-file"
                        accept="image/*" 
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                      />
                      <label 
                        htmlFor="thumbnail-file" 
                        className="admin-btn" 
                        style={{ 
                          border: '1px dashed rgba(255,255,255,0.2)', 
                          width: '100%', 
                          padding: '1.2rem', 
                          textAlign: 'center', 
                          display: 'block', 
                          borderRadius: '4px', 
                          cursor: 'pointer',
                          background: 'rgba(255,255,255,0.01)',
                          transition: 'var(--transition-fast)'
                        }}
                      >
                        📁 {uploading ? 'Compressione in corso...' : 'Carica foto da computer'}
                      </label>
                    </div>
                    
                    {formData.thumbnail && (
                      <div style={{ position: 'relative', width: '80px', height: '50px', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
                        <img src={formData.thumbnail} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button 
                          type="button" 
                          onClick={() => setFormData(prev => ({ ...prev, thumbnail: '' }))}
                          style={{ 
                            position: 'absolute', 
                            top: '2px', 
                            right: '2px', 
                            background: 'rgba(0,0,0,0.8)', 
                            border: 'none', 
                            color: '#fff', 
                            borderRadius: '50%', 
                            width: '16px', 
                            height: '16px', 
                            fontSize: '9px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            cursor: 'pointer' 
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div style={{ marginTop: '1rem' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem', display: 'block' }}>Oppure incolla un URL esterno:</label>
                    <input 
                      type="text" 
                      name="thumbnail" 
                      value={formData.thumbnail.startsWith("data:image/") ? "" : formData.thumbnail} 
                      onChange={handleFormChange} 
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label>Sinossi (Italiano)</label>
                  <textarea 
                    name="description_it" 
                    value={formData.description_it} 
                    onChange={handleFormChange}
                    rows="3"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Sinossi (Inglese)</label>
                  <textarea 
                    name="description_en" 
                    value={formData.description_en} 
                    onChange={handleFormChange}
                    rows="3"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div className="admin-form-group">
                    <label>Visibilità *</label>
                    <select 
                      name="visibility" 
                      value={formData.visibility} 
                      onChange={handleFormChange}
                    >
                      <option value="si">Visibile (SI)</option>
                      <option value="no">Nascosto (NO)</option>
                    </select>
                  </div>
                  
                  <div className="admin-form-group">
                    <label>Ordine di presentazione *</label>
                    <input 
                      type="number" 
                      name="order" 
                      value={formData.order} 
                      onChange={handleFormChange}
                      required 
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
                  <button type="button" onClick={() => setIsFormOpen(false)} className="admin-btn" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                    Annulla
                  </button>
                  <button type="submit" className="admin-btn admin-btn-primary" disabled={uploading}>
                    Salva Scheda
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Form Overlay for Team */}
        {isTeamFormOpen && (
          <div className="admin-form-modal">
            <div className="admin-form-content">
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
                {editingTeamMember ? `Modifica Membro Team: ${editingTeamMember.name}` : 'Aggiungi Nuovo Membro Team'}
              </h3>
              
              <form onSubmit={handleTeamSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div className="admin-form-group">
                  <label>Nome Completo *</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={teamFormData.name} 
                    onChange={handleTeamFormChange} 
                    required 
                  />
                </div>
                
                <div className="admin-form-group">
                  <label>Mansione / Ruolo (Italiano) *</label>
                  <input 
                    type="text" 
                    name="roleIt" 
                    value={teamFormData.roleIt} 
                    onChange={handleTeamFormChange} 
                    required 
                  />
                </div>

                <div className="admin-form-group">
                  <label>Mansione / Ruolo (Inglese) *</label>
                  <input 
                    type="text" 
                    name="roleEn" 
                    value={teamFormData.roleEn} 
                    onChange={handleTeamFormChange} 
                    required 
                  />
                </div>

                <div className="admin-form-group">
                  <label>Ordine di Presentazione *</label>
                  <input 
                    type="number" 
                    name="order" 
                    value={teamFormData.order} 
                    onChange={handleTeamFormChange}
                    required 
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
                  <button type="button" onClick={() => setIsTeamFormOpen(false)} className="admin-btn" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                    Annulla
                  </button>
                  <button type="submit" className="admin-btn admin-btn-primary">
                    Salva Membro
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Form Overlay for Admin Users */}
        {isUserFormOpen && (
          <div className="admin-form-modal">
            <div className="admin-form-content">
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
                {editingAdminUser ? `Modifica Utente: ${editingAdminUser.username}` : 'Aggiungi Nuovo Utente Admin'}
              </h3>
              
              <form onSubmit={handleUserSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div className="admin-form-group">
                  <label>Username / Email *</label>
                  <input 
                    type="text" 
                    name="username" 
                    value={userFormData.username} 
                    onChange={handleUserFormChange} 
                    required 
                    disabled={!!editingAdminUser}
                    placeholder="es. cameliadm"
                  />
                </div>
                
                <div className="admin-form-group">
                  <label>Password *</label>
                  <input 
                    type="text" 
                    name="password" 
                    value={userFormData.password} 
                    onChange={handleUserFormChange} 
                    required 
                    placeholder="Imposta password"
                  />
                </div>

                <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginTop: '0.5rem' }}>
                  <input 
                    type="checkbox" 
                    id="isActiveCheck"
                    name="isActive" 
                    checked={userFormData.isActive} 
                    onChange={handleUserFormChange} 
                    style={{ width: 'auto', margin: 0 }}
                  />
                  <label htmlFor="isActiveCheck" style={{ margin: 0, cursor: 'pointer' }}>Account Attivo (Consente l'accesso)</label>
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
                  <button type="button" onClick={() => setIsUserFormOpen(false)} className="admin-btn" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                    Annulla
                  </button>
                  <button type="submit" className="admin-btn admin-btn-primary">
                    Salva Utente
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
