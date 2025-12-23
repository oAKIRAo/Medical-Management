import React, { useState, useEffect, useMemo, useCallback, useRef, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/AdminSideBar';
import Modal from '../components/Modal';
import '../styles/adminDashboard.css';

interface AppointmentDTO {
  id?: number;
  date: string;
  heure: string;
  patientId: number;
  medecinId: number;
  patientFirstName?: string;
  patientLastName?: string;
  medecinNom?: string;
}

interface Patient { id: number; cin: string; firstName: string; lastName: string; }
interface Medecin { id: number; lastname: string; specialty: string; }

const Appointments: React.FC = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<AppointmentDTO[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [medecins, setMedecins] = useState<Medecin[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);

  const [patientInput, setPatientInput] = useState('');
  const [medecinInput, setMedecinInput] = useState('');
  const [showPatientList, setShowPatientList] = useState(false);
  const [showMedecinList, setShowMedecinList] = useState(false);

  const patientRef = useRef<HTMLDivElement>(null);
  const medecinRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<Partial<AppointmentDTO>>({
    date: '',
    heure: '',
    patientId: 0,
    medecinId: 0
  });

  const username = sessionStorage.getItem('username') || '';
  const password = sessionStorage.getItem('password') || '';
  
  const headers = useMemo(() => ({
    'Authorization': `Basic ${btoa(`${username}:${password}`)}`,
    'Content-Type': 'application/json',
  }), [username, password]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (patientRef.current && !patientRef.current.contains(event.target as Node)) {
        setShowPatientList(false);
      }
      if (medecinRef.current && !medecinRef.current.contains(event.target as Node)) {
        setShowMedecinList(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [resApp, resPat, resMed] = await Promise.all([
        fetch('http://localhost:8888/appointments/', { headers }),
        fetch('http://localhost:8888/patients/', { headers }),
        fetch('http://localhost:8888/medecins/', { headers })
      ]);
      if (resApp.status === 401) navigate('/login');
      if (resApp.ok) setAppointments(await resApp.json());
      if (resPat.ok) setPatients(await resPat.json());
      if (resMed.ok) setMedecins(await resMed.json());
    } catch {
      setMessage("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  }, [headers, navigate]);

  useEffect(() => {
    fetchData();
    document.body.classList.add('admin-body');
    return () => document.body.classList.remove('admin-body');
  }, [fetchData]);

  // Recherche améliorée avec correspondance des IDs
  const filteredAppointments = useMemo(() => {
    if (!search.trim()) return appointments;
    
    const s = search.toLowerCase().trim();
    const searchTerm = s.replace(/^dr\.?\s*/i, ''); // Enlève "Dr." de la recherche
    
    return appointments.filter(a => {
      // Recherche dans la date
      if (a.date.includes(s)) return true;
      
      // Recherche dans les infos médecin via medecinId
      const medecin = medecins.find(m => m.id === a.medecinId);
      if (medecin) {
        const medecinName = medecin.lastname.toLowerCase();
        if (medecinName.includes(searchTerm) || medecinName.includes(s)) return true;
      }
      
      // Recherche dans les infos médecin via champ existant
      if (a.medecinNom) {
        const medecinNom = a.medecinNom.toLowerCase();
        if (medecinNom.includes(searchTerm) || medecinNom.includes(s)) return true;
      }
      
      // Recherche dans les infos patient via patientId
      const patient = patients.find(p => p.id === a.patientId);
      if (patient) {
        const patientFullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
        const patientCin = patient.cin.toLowerCase();
        if (patientFullName.includes(s) || patientCin.includes(s)) return true;
      }
      
      // Recherche dans les infos patient via champs existants
      if (a.patientFirstName?.toLowerCase().includes(s)) return true;
      if (a.patientLastName?.toLowerCase().includes(s)) return true;
      
      return false;
    });
  }, [appointments, search, patients, medecins]);

  // Pagination
  const paginatedAppointments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAppointments.slice(startIndex, endIndex);
  }, [filteredAppointments, currentPage]);

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const patientSuggestions = patients.filter(p => 
    p.cin.toLowerCase().includes(patientInput.toLowerCase()) || 
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(patientInput.toLowerCase())
  );

  const medecinSuggestions = medecins.filter(m => {
    const searchValue = medecinInput.toLowerCase().replace(/^dr\.?\s*/i, '');
    return m.lastname.toLowerCase().includes(searchValue);
  });

  const openCreateModal = () => {
    setIsEditing(false);
    setFormData({ date: '', heure: '', patientId: 0, medecinId: 0 });
    setPatientInput('');
    setMedecinInput('');
    setIsModalOpen(true);
  };

  const openEditModal = (app: AppointmentDTO) => {
    setIsEditing(true);
    setCurrentId(app.id || null);
    setFormData({ 
      date: app.date, 
      heure: app.heure, 
      patientId: app.patientId, 
      medecinId: app.medecinId 
    });
    
    // Récupérer les infos complètes depuis les listes
    const patient = patients.find(p => p.id === app.patientId);
    const medecin = medecins.find(m => m.id === app.medecinId);
    
    setPatientInput(patient ? `${patient.cin} - ${patient.firstName} ${patient.lastName}` : 
                    `${app.patientFirstName || ''} ${app.patientLastName || ''}`);
    setMedecinInput(medecin ? `Dr. ${medecin.lastname}` : `Dr. ${app.medecinNom || ''}`);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validation des données
    if (!formData.patientId || formData.patientId === 0) {
      setMessage("❌ Veuillez sélectionner un patient dans la liste");
      return;
    }
    
    if (!formData.medecinId || formData.medecinId === 0) {
      setMessage("❌ Veuillez sélectionner un médecin dans la liste");
      return;
    }
    
    console.log("Données envoyées:", formData); // Pour déboguer
    
    const endpoint = isEditing 
      ? `http://localhost:8888/appointments/update/${currentId}`
      : `http://localhost:8888/appointments/create`;
    const method = isEditing ? 'PATCH' : 'POST';

    try {
      const res = await fetch(endpoint, {
        method,
        headers,
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        setIsModalOpen(false);
        fetchData();
        setMessage(`✅ Rendez-vous ${isEditing ? 'mis à jour' : 'créé'} avec succès`);
        setTimeout(() => setMessage(''), 3000);
      } else {
        const errorText = await res.text();
        console.error("Erreur serveur:", errorText);
        setMessage("❌ Erreur: " + (errorText || "Médecin ou patient introuvable"));
      }
    } catch (error) {
      console.error("Erreur:", error);
      setMessage("❌ Erreur lors de l'enregistrement");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Supprimer ce rendez-vous ?')) {
      try {
        await fetch(`http://localhost:8888/appointments/delete/${id}`, { method: 'DELETE', headers });
        fetchData();
        setMessage('✅ Rendez-vous supprimé');
        setTimeout(() => setMessage(''), 3000);
      } catch {
        setMessage('❌ Erreur de suppression');
      }
    }
  };

  // Fonction helper pour afficher les noms dans le tableau
  const getPatientName = (appointment: AppointmentDTO) => {
    if (appointment.patientFirstName && appointment.patientLastName) {
      return `${appointment.patientFirstName} ${appointment.patientLastName}`;
    }
    const patient = patients.find(p => p.id === appointment.patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Patient inconnu';
  };

  const getMedecinName = (appointment: AppointmentDTO) => {
    if (appointment.medecinNom) {
      return `Dr. ${appointment.medecinNom}`;
    }
    const medecin = medecins.find(m => m.id === appointment.medecinId);
    return medecin ? `Dr. ${medecin.lastname}` : 'Médecin inconnu';
  };

  const PaginationControls = () => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      gap: '1rem', 
      marginTop: '1rem',
      padding: '1rem'
    }}>
      <button
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="btn"
        style={{
          padding: '0.5rem 1rem',
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          opacity: currentPage === 1 ? 0.5 : 1
        }}
      >
        ← Précédent
      </button>
      
      <span style={{ fontSize: '1rem', fontWeight: '500' }}>
        Page {currentPage} sur {totalPages || 1}
      </span>
      
      <button
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="btn"
        style={{
          padding: '0.5rem 1rem',
          cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
          opacity: currentPage >= totalPages ? 0.5 : 1
        }}
      >
        Suivant →
      </button>
    </div>
  );

  return (
    <div className="admin-dashboard-container">
      <Sidebar />
      <div className="admin-container">
        <h1 className="title">Gestion des Rendez-vous</h1>
        
        {message && <div className={`message ${message.includes('Erreur') || message.includes('❌') ? 'error' : 'success'}`}>{message}</div>}

        <div style={{ display: 'flex', marginBottom: '1rem' }}>
          <button className="btn btn-submit" onClick={openCreateModal} style={{ width: 'auto' }}>
            + Nouveau Rendez-vous
          </button>
        </div>

        <input
          type="search"
          placeholder="Rechercher par patient, médecin ou date..."
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginBottom: '1rem' }}
        />

        <section className="card table-card">
          <div className="card-header">
            <h2>Liste des Rendez-vous ({filteredAppointments.length})</h2>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Heure</th>
                  <th>Patient</th>
                  <th>Médecin</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="loading">Chargement...</td></tr>
                ) : paginatedAppointments.length > 0 ? (
                  paginatedAppointments.map(a => (
                    <tr key={a.id}>
                      <td className="font-bold">{a.date}</td>
                      <td>{a.heure}</td>
                      <td>{getPatientName(a)}</td>
                      <td>{getMedecinName(a)}</td>
                      <td className="actions">
                        <button className="btn btn-edit" onClick={() => openEditModal(a)}>Modifier</button>
                        <button className="btn btn-delete" onClick={() => handleDelete(a.id!)}>Annuler</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{textAlign:'center', padding: '2rem', color: '#999'}}>
                      {search ? 'Aucun rendez-vous trouvé pour cette recherche' : 'Aucun rendez-vous trouvé'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {filteredAppointments.length > 0 && <PaginationControls />}
        </section>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2 style={{ marginBottom: '1.5rem' }}>{isEditing ? 'Modifier' : 'Créer'} un Rendez-vous</h2>
          <form onSubmit={handleSubmit} className="form" style={{ overflow: 'visible' }}>
            
            <div className="form-group">
              <label className="font-bold">Date <span className="required">*</span></label>
              <input type="date" className="custom-input" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required />
            </div>
            
            <div className="form-group">
              <label className="font-bold">Heure <span className="required">*</span></label>
              <input type="time" className="custom-input" value={formData.heure} onChange={(e) => setFormData({...formData, heure: e.target.value})} required />
            </div>

            <div className="form-group" style={{ position: 'relative' }} ref={patientRef}>
              <label className="font-bold">Patient (CIN ou Nom) <span className="required">*</span></label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text"
                  className="custom-input"
                  placeholder="Chercher par CIN ou nom..."
                  value={patientInput}
                  onChange={(e) => { 
                    setPatientInput(e.target.value); 
                    setShowPatientList(true);
                    if (formData.patientId !== 0) {
                      setFormData({...formData, patientId: 0});
                    }
                  }}
                  onFocus={() => setShowPatientList(true)}
                  style={{ paddingRight: formData.patientId !== 0 ? '2.5rem' : '1rem' }}
                  required
                />
                {formData.patientId !== 0 && (
                  <span style={{ 
                    position: 'absolute', 
                    right: '0.75rem', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    color: '#10b981',
                    fontSize: '1.25rem',
                    fontWeight: 'bold'
                  }}>
                    ✓
                  </span>
                )}
              </div>
              {showPatientList && patientInput && patientSuggestions.length > 0 && (
                <ul className="custom-dropdown">
                  {patientSuggestions.map(p => (
                    <li key={p.id} onClick={() => {
                      setPatientInput(`${p.cin} - ${p.firstName} ${p.lastName}`);
                      setFormData({...formData, patientId: p.id});
                      setShowPatientList(false);
                    }}>
                      {p.cin} - {p.firstName} {p.lastName}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="form-group" style={{ position: 'relative', marginTop: '1rem' }} ref={medecinRef}>
              <label className="font-bold">Médecin <span className="required">*</span></label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text"
                  className="custom-input"
                  placeholder="Chercher Dr..."
                  value={medecinInput}
                  onChange={(e) => { 
                    setMedecinInput(e.target.value); 
                    setShowMedecinList(true);
                    if (formData.medecinId !== 0) {
                      setFormData({...formData, medecinId: 0});
                    }
                  }}
                  onFocus={() => setShowMedecinList(true)}
                  style={{ paddingRight: formData.medecinId !== 0 ? '2.5rem' : '1rem' }}
                  required
                />
                {formData.medecinId !== 0 && (
                  <span style={{ 
                    position: 'absolute', 
                    right: '0.75rem', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    color: '#10b981',
                    fontSize: '1.25rem',
                    fontWeight: 'bold'
                  }}>
                    ✓
                  </span>
                )}
              </div>
              {showMedecinList && medecinInput && medecinSuggestions.length > 0 && (
                <ul className="custom-dropdown">
                  {medecinSuggestions.map(m => (
                    <li key={m.id} onClick={() => {
                      setMedecinInput(`Dr. ${m.lastname}`);
                      setFormData({...formData, medecinId: m.id});
                      setShowMedecinList(false);
                    }}>
                      Dr. {m.lastname} ({m.specialty})
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="form-actions" style={{ marginTop: '2rem' }}>
              <button type="button" className="btn btn-cancel" onClick={() => setIsModalOpen(false)}>Annuler</button>
              <button type="submit" className="btn btn-submit">Confirmer</button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default Appointments;