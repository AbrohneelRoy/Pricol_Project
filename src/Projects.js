import React from 'react';
import Navbar from './Navbar';
import styles from './Projects.module.css';
import logoImage from './image.png'; // Import your image

const Projects = () => {
  const username = localStorage.getItem('username');

  return (
    <div className={styles.projectsContainer}>
      <header className={styles.header}>
        <div className={styles.topBar}>
          <div className={styles.logo}>
            <img src={logoImage} alt="Logo" className={styles.logoImg} />
          </div>
          <div className={styles.userInfo}>{username}</div>
        </div>
      </header>
      <div className={styles.projectsMainContent}>
        <Navbar />
        <div className={styles.projectsContent}>
          <h1>Projects</h1>
          <p>This is the Projects page. Here you will find information about various projects.</p>
        </div>
      </div>
    </div>
  );
};

export default Projects;
