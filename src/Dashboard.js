// Dashboard.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import styles from './Dashboard.module.css';
import Navbar from './Navbar';
import logoImage from './image.png';

Chart.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const username = localStorage.getItem('username');
  const [projectsCount, setProjectsCount] = useState(0);
  const [employeesCount, setEmployeesCount] = useState(0);
  const [toolsCount, setToolsCount] = useState(0);

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const response = await axios.get('http://192.168.202.228:8080/projects/count');
      setProjectsCount(response.data.projectCount);
      setEmployeesCount(response.data.empCount);
      setToolsCount(response.data.toolCount);
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };

  const data = {
    labels: ['Projects', 'Employees', 'Tools'],
    datasets: [
      {
        label: '# of Items',
        data: [projectsCount, employeesCount, toolsCount],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(75, 192, 192, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  return (
    <div className={styles.dashboardWrapper}>
      <header className={styles.dashboardheader}>
        <div className={styles.dashtopBar}>
          <div className={styles.dashlogo}>
            <img src={logoImage} alt="Logo" className={styles.dashlogoImg} />
          </div>
          <div className={styles.dashuserInfo}>{username}</div>
        </div>
      </header>
      <div className={styles.dashboardContainer}>
        <Navbar />
        <div className={styles.mainContent}>
          <h1 className={styles.username}>Welcome, {username}!</h1>
          <p>Enjoy the seamless experience of our application.</p>
          <div className={styles.stats}>
            <div className={styles.statItem}>
              <h2>Projects</h2>
              <p>{projectsCount}</p>
            </div>
            <div className={styles.statItem}>
              <h2>Employees</h2>
              <p>{employeesCount}</p>
            </div>
            <div className={styles.statItem}>
              <h2>Tools</h2>
              <p>{toolsCount}</p>
            </div>
          </div>
          <div className={styles.chart}>
            <Pie data={data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
