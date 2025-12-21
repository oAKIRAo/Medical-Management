import React, { useState, useEffect, useMemo, useCallback, type FormEvent } from 'react';
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

const Appointments: React.FC = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<AppointmentDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<AppointmentDTO>>({
    date: '',
    heure: '',
    patientId: undefined,
    medecinId: undefined
  });

  const username = sessionStorage.getItem('username') || '';
  const password = sessionStorage.getItem('password') || '';
  
  const headers = useMemo(() => ({
    'Authorization': `Basic ${btoa(`${username}:${password}`)}`,
    'Content-Type': 'application/json',
  }), [username, password]);

  const fetchAppointments = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:8888/appointments/', { headers });
      if (res.status === 401) navigate('/login');
      if (res.ok) setAppointments(await res.json());
    } catch {
      setMessage("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  }, [headers, navigate]);

  useEffect(() => {
    fetchAppointments();
    document.body.classList.add('admin-body');
    return () => document.body.classList.remove('admin-body');
  }, [fetchAppointments]);

  const filteredAppointments = useMemo(() => {
    const s = search.toLowerCase();
    return appointments.filter(a => 
      a.patientLastName?.toLowerCase().includes(s) || 
      a.medecinNom?.toLowerCase().includes(s) ||
      a.date.includes(s)
    );
  }, [appointments, search]);

  const openCreateModal = () => {
    setIsEditing(false);
    setFormData({ date: '', heure: '', patientId: 0, medecinId: 0 });
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
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
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
        fetchAppointments();
        setMessage(`Rendez-vous ${isEditing ? 'mis à jour' : 'créé'} avec succès`);
        setTimeout(() => setMessage(''), 3000);
      }
    } catch {
      setMessage("Erreur lors de l'enregistrement");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Supprimer ce rendez-vous ?')) {
      try {
        await fetch(`http://localhost:8888/appointments/delete/${id}`, { method: 'DELETE', headers });
        fetchAppointments();
        setMessage('Rendez-vous supprimé');
      } catch {
        setMessage('Erreur de suppression');
      }
    }
  };

  return (
    <div className="admin-dashboard-container">
      <Sidebar />
      <div className="admin-container">
        <h1 className="title">Gestion des Rendez-vous</h1>
        
        {message && <div className={`message ${message.includes('Erreur') ? 'error' : 'success'}`}>{message}</div>}

        <button className="btn btn-submit" onClick={openCreateModal} style={{ marginBottom: '1rem' }}>
          + Nouveau Rendez-vous
        </button>

        <input
          type="search"
          placeholder="Rechercher par patient, médecin ou date..."
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <section className="card table-card">
          <div className="card-header">
            <h2>Liste des Rendez-vous</h2>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Heure</th>
                  <th>Patient</th>
                  <th>Médecin Nom</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="loading">Chargement...</td></tr>
                ) : filteredAppointments.length > 0 ? (
                  filteredAppointments.map(a => (
                    <tr key={a.id}>
                      <td className="font-bold">{a.date}</td>
                      <td>{a.heure}</td>
                      <td>{a.patientFirstName} {a.patientLastName}</td>
                      <td>Dr. {a.medecinNom}</td>
                      <td className="actions">
                        <button className="btn btn-edit" onClick={() => openEditModal(a)}>Modifier</button>
                        <button className="btn btn-delete" onClick={() => handleDelete(a.id!)}>Annuler</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={5} className="no-data">Aucun rendez-vous trouvé</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2>{isEditing ? 'Modifier' : 'Créer'} un Rendez-vous</h2>
          <form onSubmit={handleSubmit} className="form">
            <label className="font-bold">Date</label>
            <input 
              type="date" 
              value={formData.date} 
              onChange={(e) => setFormData({...formData, date: e.target.value})} 
              required 
            />
            
            <label className="font-bold">Heure</label>
            <input 
              type="time" 
              value={formData.heure} 
              onChange={(e) => setFormData({...formData, heure: e.target.value})} 
              required 
            />

            <label className="font-bold">ID Patient</label>
            <input 
              type="number" 
              placeholder="Ex: 1"
              value={formData.patientId || ''} 
              onChange={(e) => setFormData({...formData, patientId: parseInt(e.target.value)})} 
              required 
            />

            <label className="font-bold">ID Médecin</label>
            <input 
              type="number" 
              placeholder="Ex: 5"
              value={formData.medecinId || ''} 
              onChange={(e) => setFormData({...formData, medecinId: parseInt(e.target.value)})} 
              required 
            />

            <div className="form-actions">
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