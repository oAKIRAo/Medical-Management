import React, { useEffect, useState, useMemo } from 'react';
import Sidebar from '../components/AdminSideBar';
import { FaUserInjured, FaUserMd, FaFileMedical, FaCalendarCheck } from 'react-icons/fa';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartData, 
} from 'chart.js';
import '../styles/adminDashboard.css';
import '../styles/Analytics.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface StatsCards {
  patients: number;
  medecins: number;
  dossiers: number;
  appointments: number;
}

const Analytics: React.FC = () => {
  const [stats, setStats] = useState<StatsCards | null>(null);
  const [chartData, setChartData] = useState<ChartData<'bar'> | null>(null);
  const [loading, setLoading] = useState(true);

  const username = sessionStorage.getItem('username') || '';
  const password = sessionStorage.getItem('password') || '';
  
  const headers = useMemo(() => ({
    'Authorization': `Basic ${btoa(`${username}:${password}`)}`,
    'Content-Type': 'application/json',
  }), [username, password]);

  // IMPORTANT: Active le mode plein écran via le body
  useEffect(() => {
    document.body.classList.add('admin-body');
    return () => {
      document.body.classList.remove('admin-body');
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cardsRes, chartRes] = await Promise.all([
          fetch('http://localhost:8888/analytics/cards', { headers }),
          fetch('http://localhost:8888/analytics/appointments-per-doctor', { headers })
        ]);

        if (cardsRes.ok && chartRes.ok) {
          const cardsData = await cardsRes.json();
          const perDoctorData: Record<string, number> = await chartRes.json();

          setStats(cardsData);
          setChartData({
            labels: Object.keys(perDoctorData),
            datasets: [{
              label: 'Rendez-vous',
              data: Object.values(perDoctorData),
              backgroundColor: '#9147ff', 
              borderRadius: 5,
            }],
          });
        }
      } catch (error) {
        console.error("Erreur Analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [headers]);

  return (
    <div className="admin-dashboard-container">
      <Sidebar />
      <div className="admin-container">
        <h1 className="title">Analytics</h1>

        {loading ? (
          <div className="loading">Chargement...</div>
        ) : (
          <>
            <div className="stats-grid">
              {/* Patients - Carte Bleue */}
              <div className="stat-card blue">
                <div className="stat-header">
                  <span>Patients</span>
                  <FaUserInjured className="stat-icon" />
                </div>
                <div className="stat-number">{stats?.patients}</div>
              </div>

              {/* Médecins */}
              <div className="stat-card">
                <div className="stat-header">
                  <span>Médecins</span>
                  <FaUserMd className="stat-icon orange" />
                </div>
                <div className="stat-number">{stats?.medecins}</div>
              </div>

              {/* Dossiers */}
              <div className="stat-card">
                <div className="stat-header">
                  <span>Dossiers</span>
                  <FaFileMedical className="stat-icon green" />
                </div>
                <div className="stat-number">{stats?.dossiers}</div>
              </div>

              {/* Rendez-vous */}
              <div className="stat-card">
                <div className="stat-header">
                  <span>Rendez-vous</span>
                  <FaCalendarCheck className="stat-icon gold" />
                </div>
                <div className="stat-number">{stats?.appointments}</div>
              </div>
            </div>

            <div className="chart-container-card">
              <h2>Rendez-vous par Médecin</h2>
              <div style={{ height: '350px', marginTop: '20px' }}>
                {chartData && (
                  <Bar 
                    data={chartData} 
                    options={{ 
                        responsive: true, 
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } }
                    }} 
                  />
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Analytics;