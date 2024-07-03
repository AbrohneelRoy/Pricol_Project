import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = ({ isAdmin }) => {
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

  const handleAdd = () => {
    navigate('/projects/add');
  };

  const handleModify = () => {
    navigate('/projects/modify');
  };

  const handleDelete = () => {
    navigate('/projects/delete');
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
            onClick={handleAdd} 
            className={`${styles['navbar-navButton']} ${location.pathname === '/projects/add' ? styles['navbar-activeLink'] : ''}`}
          >
            Add
          </button>
        </li>
        <li>
          <button 
            onClick={handleModify} 
            className={`${styles['navbar-navButton']} ${location.pathname === '/projects/modify' ? styles['navbar-activeLink'] : ''}`}
          >
            Modify
          </button>
        </li>
        {username === 'Admin' && (
          <li>
            <button 
              onClick={handleDelete} 
              className={`${styles['navbar-navButton']} ${location.pathname === '/projects/delete' ? styles['navbar-activeLink'] : ''}`}
            >
              Delete
            </button>
          </li>
        )}
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
