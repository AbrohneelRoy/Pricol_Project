// Dashboard.jsx

import React from 'react';
import styles from './Dashboard.module.css';
import Navbar from './Navbar';
import logoImage from './image.png'; // Import your image

const Dashboard = () => {
  const username = localStorage.getItem('username');

  return (
    <div className={styles['Dashboard-dashboardWrapper']}>
      <header className={styles['Dashboard-header']}>
        <div className={styles['Dashboard-topBar']}>
          <div className={styles['Dashboard-logo']}>
            <img src={logoImage} alt="Logo" className={styles['Dashboard-logo-img']} />
          </div>
          <div className={styles['Dashboard-userInfo']}>{username}</div>
        </div>
      </header>
      <div className={styles['Dashboard-dashboardContainer']}>
        <Navbar />
        <div className={styles['Dashboard-mainContent']}>
          <h1>Welcome, {username}!</h1>
          <p>Enjoy the seamless experience of our application.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
