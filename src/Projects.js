import React from 'react';
import Navbar from './Navbar';
import styles from './Projects.module.css';
import logoImage from './image.png'; // Import your image

const Projects = () => {
  const username = localStorage.getItem('username');

  return (
    <div className={styles['projects-container']}>
      <header className={styles['projects-header']}>
        <div className={styles['projects-topBar']}>
          <div className={styles['projects-logo']}>
            <img src={logoImage} alt="Logo" className={styles['projects-logoImg']} />
          </div>
          <div className={styles['projects-userInfo']}>{username}</div>
        </div>
      </header>
      <div className={styles['projects-mainContent']}>
        <Navbar />
        <div className={styles['projects-content']}>
          <h1>Projects</h1>
          <p>This is the Projects page. Here you will find information about various projects.</p>
        </div>
      </div>
    </div>
  );
};

export default Projects;
