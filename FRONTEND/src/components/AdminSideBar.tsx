import React from 'react';
import { FaChartBar, FaTable, FaSignOutAlt,FaCalendarAlt } from 'react-icons/fa';
import '../styles/AdminSideBar.css';
import { useNavigate } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="sidebar">
      <h2 className="title">Admin</h2>
      <nav className="nav">
        <a href="/analytics" className="link">
          <FaChartBar className="icon" />
          Analytics
        </a>
          <a href="/tables" className="link">
          <FaTable className="icon" />
          Tables
        </a>
          <a href="/appointments" className="link">
          <FaCalendarAlt className="icon" />
          Appointments
        </a>
        <a onClick={handleLogout} className="link" style={{ cursor: 'pointer' }}>
          <FaSignOutAlt className="icon" />
          Logout
        </a>
      </nav>
    </div>
  );
};

export default Sidebar;