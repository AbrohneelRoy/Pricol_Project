import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/login', { replace: true });
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        <li>
          <button onClick={() => navigate('/dashboard')} className={styles.navButton} activeClassName={styles.activeLink}>
            Dashboard
          </button>
        </li>
        <li>
          <button onClick={() => navigate('/projects')} className={styles.navButton} activeClassName={styles.activeLink}>
            Projects
          </button>
        </li>
        <li>
          <button onClick={() => navigate('/reports')} className={styles.navButton} activeClassName={styles.activeLink}>
            Reports
          </button>
        </li>
        {username === 'Admin' && (
          <li>
            <button onClick={handleRegister} className={styles.navButton} activeClassName={styles.activeLink}>
              Register
            </button>
          </li>
        )}
        <li>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Log Out
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
