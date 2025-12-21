import React, { useState, useEffect, useMemo, useCallback, type ChangeEvent, type FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/AdminSideBar';
import Modal from '../components/Modal';
import '../styles/adminDashboard.css';
import '../styles/PatientDetails.css';

interface PatientDTO {
  id: number;
  firstName: string;
  lastName: string;
  cin: string;
  phoneNumber: string;
}

interface DossierMedicalDTO {
  id?: number;
  logs: string;
  allergies: string;
  patient?: PatientDTO;
}

const PatientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [patient, setPatient] = useState<PatientDTO | null>(null);
  const [dossiers, setDossiers] = useState<DossierMedicalDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDossierId, setCurrentDossierId] = useState<number | null>(null);
  const [formData, setFormData] = useState<DossierMedicalDTO>({
    logs: '',
    allergies: '',
  });

  const username = sessionStorage.getItem('username') || '';
  const password = sessionStorage.getItem('password') || '';
  
  const headers = useMemo(() => ({
    'Authorization': `Basic ${btoa(`${username}:${password}`)}`,
    'Content-Type': 'application/json',
  }), [username, password]);

  useEffect(() => {
    document.body.classList.add('admin-body');
    return () => {
      document.body.classList.remove('admin-body');
    };
  }, []);

  const fetchDossiers = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:8888/patient/details/${id}/`, { headers });
      if (res.ok) {
        const data = await res.json();
        setDossiers(data);
      }
    } catch {
      console.error('Erreur lors du chargement des dossiers');
    } finally {
      setLoading(false);
    }
  }, [id, headers]);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await fetch(`http://localhost:8888/patients/${id}`, { headers });
        if (res.ok) {
          setPatient(await res.json());
        }
      } catch {
        setMessage('Erreur lors du chargement du patient');
      }
    };

    fetchPatient();
    fetchDossiers();
  }, [id, headers, fetchDossiers]);

  const openCreateModal = () => {
    setIsEditing(false);
    setFormData({ logs: '', allergies: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (dossier: DossierMedicalDTO) => {
    setIsEditing(true);
    setCurrentDossierId(dossier.id || null);
    setFormData({ logs: dossier.logs, allergies: dossier.allergies });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const endpoint = isEditing
      ? `http://localhost:8888/patient/details/${id}/update/${currentDossierId}`
      : `http://localhost:8888/patient/details/${id}/add`;
    const method = isEditing ? 'PATCH' : 'POST';

    try {
      const res = await fetch(endpoint, {
        method,
        headers,
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage(`Dossier ${isEditing ? 'mis à jour' : 'ajouté'} avec succès`);
        setIsModalOpen(false);
        fetchDossiers();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch {
      setMessage('Erreur lors de l\'enregistrement');
    }
  };

  const handleDelete = async (dossierId: number) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce dossier médical ?')) {
      try {
        await fetch(`http://localhost:8888/patient/details/${id}/delete/${dossierId}`, {
          method: 'DELETE',
          headers,
        });
        setMessage('Dossier supprimé avec succès');
        fetchDossiers();
        setTimeout(() => setMessage(''), 3000);
      } catch {
        setMessage('Erreur lors de la suppression');
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="admin-dashboard-container">
      <Sidebar />
      <div className="admin-container">
        <button 
          onClick={() => navigate('/tables')} 
          className="btn btn-cancel"
          style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          ← Retour aux patients
        </button>

        {patient && (
          <div className="patient-hero-card">
            <div className="patient-avatar-wrapper">
              <div className="patient-avatar-circle">
                <span style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
                  {patient.firstName.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>

            <div className="patient-main-info">
              <span className="patient-status-tag">Dossier Médical Actif</span>
              <h1>{patient.firstName} {patient.lastName}</h1>
              
              <div className="patient-stats-row">
                <div className="stat-item">
                  <span className="stat-label">Numéro CIN</span>
                  <span className="stat-value">{patient.cin}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Contact</span>
                  <span className="stat-value">{patient.phoneNumber}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {message && (
          <div className={`message ${message.includes('Erreur') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <div style={{ marginBottom: '1.5rem' }}>
          <button className="btn btn-submit" onClick={openCreateModal}>
            + Ajouter un dossier médical
          </button>
        </div>

        <section className="card table-card">
          <div className="card-header">
            <h2>Dossiers Médicaux</h2>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th style={{ width: '60%' }}>Logs / Notes</th>
                  <th>Allergies</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={3} className="loading">Chargement...</td></tr>
                ) : dossiers.length > 0 ? (
                  dossiers.map(dossier => (
                    <tr key={dossier.id}>
                      <td>
                        <div style={{ maxWidth: '500px', whiteSpace: 'normal', lineHeight: '1.5' }}>
                          {dossier.logs}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${dossier.allergies ? 'has-allergies' : ''}`} 
                              style={{ 
                                background: dossier.allergies ? '#fff0f0' : '#f0fdf4', 
                                color: dossier.allergies ? '#e03131' : '#16a34a', 
                                padding: '6px 12px', 
                                borderRadius: '20px', 
                                fontSize: '0.8rem',
                                fontWeight: 'bold' 
                              }}>
                          {dossier.allergies || 'Aucune'}
                        </span>
                      </td>
                      <td className="actions">
                        <button className="btn btn-edit" onClick={() => openEditModal(dossier)}>Modifier</button>
                        <button className="btn btn-delete" onClick={() => handleDelete(dossier.id!)}>Supprimer</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
                      Aucun dossier médical trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* MODAL UNIFIÉ AVEC "TABLES" */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <h2 style={{ marginBottom: '1.5rem' }}>
               {isEditing ? 'Modifier le dossier' : 'Ajouter un dossier'}
            </h2>
            <form onSubmit={handleSubmit} className="form">
              <div className="form-group">
                <label className="font-bold">Logs / Notes médicales <span className="required">*</span></label>
                <textarea
                  name="logs"
                  value={formData.logs}
                  onChange={handleChange}
                  placeholder="Saisissez les observations cliniques..."
                  className="custom-textarea"
                  rows={6}
                  required
                />
              </div>
              <div className="form-group">
                <label className="font-bold">Allergies <span className="required">*</span></label>
                <textarea
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  placeholder="Liste des allergies (ou 'Aucune')..."
                  className="custom-textarea"
                  rows={3}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-cancel" onClick={() => setIsModalOpen(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-submit">
                  {isEditing ? 'Mettre à jour' : 'Enregistrer'}
                </button>
              </div>
            </form>
        </Modal>
      </div>
    </div>
  );
};

export default PatientDetails;