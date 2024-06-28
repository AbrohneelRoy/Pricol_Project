import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/login', { replace: true });
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <nav className={styles['navbar-wrapper']}>
      <ul className={styles['navbar-navList']}>
        <li>
          <button 
            onClick={() => navigate('/dashboard')} 
            className={`${styles['navbar-navButton']} ${location.pathname === '/dashboard' ? styles['navbar-activeLink'] : ''}`}
          >
            Dashboard
          </button>
        </li>
        <li>
          <button 
            onClick={() => navigate('/projects')} 
            className={`${styles['navbar-navButton']} ${location.pathname === '/projects' ? styles['navbar-activeLink'] : ''}`}
          >
            Projects
          </button>
        </li>
        <li>
          <button 
            onClick={() => navigate('/report')} 
            className={`${styles['navbar-navButton']} ${location.pathname === '/report' ? styles['navbar-activeLink'] : ''}`}
          >
            Reports
          </button>
        </li>
        {username === 'Admin' && (
          <li>
            <button 
              onClick={handleRegister} 
              className={`${styles['navbar-navButton']} ${location.pathname === '/register' ? styles['navbar-activeLink'] : ''}`}
            >
              Register
            </button>
          </li>
        )}
        <li>
          <button 
            className={styles['navbar-logoutButton']} 
            onClick={handleLogout}
          >
            Log Out
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
