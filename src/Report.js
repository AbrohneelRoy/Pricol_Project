import React from 'react';
import Navbar from './Navbar';
import styles from './Report.module.css';
import logoImage from './image.png'; // Import your logo image here

const Report = () => {
  const username = localStorage.getItem('username');

  return (
    <div className={styles['report-wrapper']}>
      <header className={styles['report-header']}>
        <div className={styles['report-logo']}>
          <img src={logoImage} alt="Logo" className={styles['report-logoImage']} />
        </div>
        <div className={styles['report-userInfo']}>{username}</div>
      </header>
      <div className={styles['report-main']}>
        <Navbar />
        <div className={styles['report-content']}>
          <h1 className={styles['report-title']}>Reports</h1>
          <p>This is the Reports page. Here you will find various reports and related information.</p>
        </div>
      </div>
    </div>
  );
};

export default Report;
