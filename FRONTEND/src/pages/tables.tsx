import React, { useState, useEffect, useMemo, useCallback, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/AdminSideBar';
import Modal from '../components/Modal';
import '../styles/adminDashboard.css';

interface PatientDTO { id?: number; firstName: string; lastName: string; cin: string; phoneNumber: string; }
interface MedecinDTO { id?: number; matricule: string; firstname: string; lastname: string; specialty: string; }

type FormDataType = Partial<PatientDTO & MedecinDTO>;

const Tables: React.FC = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<PatientDTO[]>([]);
  const [medecins, setMedecins] = useState<MedecinDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // États de recherche
  const [patientSearch, setPatientSearch] = useState('');
  const [medecinSearch, setMedecinSearch] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'patient' | 'medecin'>('patient');
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormDataType>({});

  const username = sessionStorage.getItem('username') || '';
  const password = sessionStorage.getItem('password') || '';
  
  const headers = useMemo(() => ({
    'Authorization': `Basic ${btoa(`${username}:${password}`)}`,
    'Content-Type': 'application/json',
  }), [username, password]);

  // Filtrage dynamique des patients
  const filteredPatients = useMemo(() => {
    if (!patientSearch.trim()) return patients;
    
    const searchLower = patientSearch.toLowerCase().trim();
    return patients.filter(p => 
      p.firstName.toLowerCase().includes(searchLower) ||
      p.lastName.toLowerCase().includes(searchLower) ||
      p.cin.toLowerCase().includes(searchLower)
    );
  }, [patients, patientSearch]);

  // Filtrage dynamique des médecins
  const filteredMedecins = useMemo(() => {
    if (!medecinSearch.trim()) return medecins;
    
    const searchLower = medecinSearch.toLowerCase().trim();
    return medecins.filter(m => 
      m.matricule.toLowerCase().includes(searchLower) ||
      m.firstname.toLowerCase().includes(searchLower) ||
      m.lastname.toLowerCase().includes(searchLower)
    );
  }, [medecins, medecinSearch]);

  const refreshPatients = useCallback(async () => {
    const res = await fetch('http://localhost:8888/patients/', { headers });
    if (res.ok) setPatients(await res.json());
  }, [headers]);

  const refreshMedecins = useCallback(async () => {
    const res = await fetch('http://localhost:8888/medecins/', { headers });
    if (res.ok) setMedecins(await res.json());
  }, [headers]);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [resP, resM] = await Promise.all([
          fetch('http://localhost:8888/patients/', { headers }),
          fetch('http://localhost:8888/medecins/', { headers })
        ]);

        if (!isMounted) return;

        if (resP.ok) setPatients(await resP.json());
        if (resM.ok) setMedecins(await resM.json());
      } catch {
        if (isMounted) setMessage("Erreur de connexion au serveur");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    document.body.classList.add('admin-body');

    return () => {
      isMounted = false;
      document.body.classList.remove('admin-body');
    };
  }, [headers]);

  const openCreateModal = (type: 'patient' | 'medecin') => {
    setModalType(type);
    setIsEditing(false);
    setFormData(type === 'patient' 
      ? { firstName: '', lastName: '', cin: '', phoneNumber: '' }
      : { matricule: '', firstname: '', lastname: '', specialty: '' }
    );
    setIsModalOpen(true);
  };

  const openEditModal = (type: 'patient' | 'medecin', data: FormDataType) => {
    setModalType(type);
    setIsEditing(true);
    setCurrentId(data.id || null);
    setFormData({ ...data });
    setIsModalOpen(true);
  };

  const handleDelete = async (type: 'patients' | 'medecins', id: number) => {
    if (window.confirm('Voulez-vous vraiment supprimer cet élément ?')) {
      try {
        const res = await fetch(`http://localhost:8888/${type}/delete/${id}`, { 
          method: 'DELETE', 
          headers 
        });
        if (res.ok) {
          setMessage('Suppression réussie');
          if (type === 'patients') await refreshPatients();
          else await refreshMedecins();
        }
      } catch {
        setMessage('Erreur lors de la suppression');
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const endpoint = `http://localhost:8888/${modalType}s/${isEditing ? `update/${currentId}` : 'add'}`;
    const method = isEditing ? 'PATCH' : 'POST';

    try {
      const res = await fetch(endpoint, {
        method,
        headers,
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        if (modalType === 'patient') await refreshPatients();
        else await refreshMedecins();
        setMessage(`${modalType === 'patient' ? 'Patient' : 'Médecin'} enregistré avec succès !`);
      }
    } catch {
      setMessage("Erreur lors de l'enregistrement");
    }
  };

  return (
    <div className="admin-dashboard-container">
      <Sidebar />
      <div className="admin-container">
        <h1 className="title">Gestion Médicale</h1>
        
        {message && <div className="message success">{message}</div>}

        {loading ? (
          <div className="loading">Chargement des données en cours...</div>
        ) : (
          <>
            {/* Section Patients */}
            <button className="btn btn-submit" onClick={() => openCreateModal('patient')} style={{ marginBottom: '1rem' }}>
              + Add Patient
            </button>
            
            <input
              type="search"
              placeholder="Rechercher par prénom, nom ou CIN..."
              value={patientSearch}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPatientSearch(e.target.value)}
              className="search-input"
              style={{ marginBottom: '1rem' }}
            />

            <section className="card table-card">
              <div className="card-header">
                <h2>Patients</h2>
              </div>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr><th>Prénom</th><th>Nom</th><th>CIN</th><th>Téléphone</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {filteredPatients.length > 0 ? filteredPatients.map(p => (
                      <tr key={p.id}>
                        <td>{p.firstName}</td>
                        <td>{p.lastName}</td>
                        <td>{p.cin}</td>
                        <td>{p.phoneNumber}</td>
                        <td className="actions">
                          <button className="btn btn-edit" onClick={() => openEditModal('patient', p)}>Edit</button>
                          <button className="btn btn-delete" onClick={() => handleDelete('patients', p.id!)}>Delete</button>
                          <button 
                            className="btn btn-submit" 
                            onClick={() => navigate(`/tables/details/${p.id}`)}
                            style={{ backgroundColor: '#10b981' }}
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5} style={{textAlign:'center', padding: '2rem', color: '#999'}}>
                          {patientSearch ? 'Aucun patient trouvé pour cette recherche' : 'Aucun patient trouvé'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section Médecins */}
            <button className="btn btn-submit" onClick={() => openCreateModal('medecin')} style={{ marginBottom: '1rem', marginTop: '2rem' }}>
              + Add Medecin
            </button>
            
            <input
              type="search"
              placeholder="Rechercher par matricule, prénom ou nom..."
              value={medecinSearch}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setMedecinSearch(e.target.value)}
              className="search-input"
              style={{ marginBottom: '1rem' }}
            />

            <section className="card table-card">
              <div className="card-header">
                <h2>Médecins</h2>
              </div>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr><th>Matricule</th><th>Prénom</th><th>Nom</th><th>Spécialité</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {filteredMedecins.length > 0 ? filteredMedecins.map(m => (
                      <tr key={m.id}>
                        <td>{m.matricule}</td>
                        <td>{m.firstname}</td>
                        <td>{m.lastname}</td>
                        <td>{m.specialty}</td>
                        <td className="actions">
                          <button className="btn btn-edit" onClick={() => openEditModal('medecin', m)}>Edit</button>
                          <button className="btn btn-delete" onClick={() => handleDelete('medecins', m.id!)}>Delete</button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5} style={{textAlign:'center', padding: '2rem', color: '#999'}}>
                          {medecinSearch ? 'Aucun médecin trouvé pour cette recherche' : 'Aucun médecin trouvé'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {/* Modal Dynamique */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2>{isEditing ? 'Modifier' : 'Ajouter'} {modalType === 'patient' ? 'un Patient' : 'un Médecin'}</h2>
          <form onSubmit={handleSubmit} className="form">
            {modalType === 'patient' ? (
              <>
                <input placeholder="Prénom" value={formData.firstName || ''} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, firstName: e.target.value})} required />
                <input placeholder="Nom" value={formData.lastName || ''} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, lastName: e.target.value})} required />
                <input placeholder="CIN" value={formData.cin || ''} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, cin: e.target.value})} required />
                <input placeholder="Téléphone" value={formData.phoneNumber || ''} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, phoneNumber: e.target.value})} required />
              </>
            ) : (
              <>
                <input placeholder="Matricule" value={formData.matricule || ''} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, matricule: e.target.value})} required />
                <input placeholder="Prénom" value={formData.firstname || ''} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, firstname: e.target.value})} required />
                <input placeholder="Nom" value={formData.lastname || ''} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, lastname: e.target.value})} required />
                <input placeholder="Spécialité" value={formData.specialty || ''} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, specialty: e.target.value})} required />
              </>
            )}
            <div className="form-actions">
              <button type="button" className="btn btn-cancel" onClick={() => setIsModalOpen(false)}>Annuler</button>
              <button type="submit" className="btn btn-submit">{isEditing ? 'Mettre à jour' : 'Enregistrer'}</button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default Tables;