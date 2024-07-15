import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';
import droplist from './droplist.png';
import logoImage from './image.png';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [projectsCount, setProjectsCount] = useState(0);
  const [employeesCount, setEmployeesCount] = useState(0);
  const [toolsCount, setToolsCount] = useState(0);
  const [phase1, setPhase1] = useState(0);
  const [phase2, setPhase2] = useState(0);
  const [phase3, setPhase3] = useState(0);
  const [phase4, setPhase4] = useState(0);
  const [phase5, setPhase5] = useState(0);
  const [phase6, setPhase6] = useState(0);
  const [phase7, setPhase7] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get('http://192.168.202.228:8080/login');
      const loggedInUser = localStorage.getItem('username');
  
      const currentUser = response.data.find(user => user.username === loggedInUser);
  
      if (currentUser) {
        setUsername(currentUser.username);
        setRole(currentUser.role);
      } else {
        console.error('User not found in API response');
      }
  
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const fetchCounts = async () => {
    try {
      const response = await axios.get('http://192.168.202.228:8080/projects/count');
      setProjectsCount(response.data.projectCount);
      setEmployeesCount(response.data.empCount);
      setToolsCount(response.data.toolCount);
      setPhase1(response.data.phase1);
      setPhase2(response.data.phase2);
      setPhase3(response.data.phase3);
      setPhase4(response.data.phase4);
      setPhase5(response.data.phase5);
      setPhase6(response.data.phase6);
      setPhase7(response.data.phase7);
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };

  useEffect(() => {
    fetchUserInfo();
    fetchCounts();
  }, []);

  const phaseData = {
    labels: ['A100', 'B100', 'B200', 'C100', 'C200', 'D100', 'SOP'],
    datasets: [
      {
        label: 'Phase Counts',
        data: [phase1, phase2, phase3, phase4, phase5, phase6, phase7],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)', // Red
          'rgba(54, 162, 235, 0.6)', // Blue
          'rgba(255, 206, 86, 0.6)', // Yellow
          'rgba(75, 192, 192, 0.6)', // Green
          'rgba(153, 102, 255, 0.6)', // Purple
          'rgba(255, 159, 64, 0.6)', // Orange
          'rgba(50, 205, 50, 0.6)', // Lime
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(50, 205, 50, 1)',
        ],
        borderWidth: 3,
        barThickness: 110, // Adjust the bar thickness here
        borderSkipped: false,
        hoverBackgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(50, 205, 50, 0.8)',
        ],
        hoverBorderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(50, 205, 50, 1)',
        ],
      },
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeInOutBounce',
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#333',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleColor: '#fff',
        bodyColor: '#fff',
        bodyFont: {
          size: 12,
        },
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        cornerRadius: 4,
        padding: 10,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#333',
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          color: '#ccc',
        },
        ticks: {
          color: '#333',
          font: {
            size: 12,
          },
          beginAtZero: true,
          stepSize: 1,
        },
      },
    },
  };

  const handleViewProjects = () => {
    navigate('/projects');
  };

  const handleViewEmp = () => {
    navigate('/employee');
  };

  const handleViewTool = () => {
    navigate('/tool');
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    navigate('/login', { replace: true });
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className={styles.dashboardWrapper}>
      <header className={styles.dashboardheader}>
        <div className={styles.dashtopBar}>
          <div className={styles.dashlogo}>
            <img src={logoImage} alt="Logo" className={styles.dashlogoImg} />
          </div>
          <div className={styles['register-userInfo']} onClick={toggleDropdown}>
            {username}             
            <img src={droplist} alt="dropdown arrow" className={`${styles.arrow} ${dropdownOpen ? styles.rotate : ''}`} style={{ width: '25px', height: '25px', marginRight: '5px'}} />
            <div className={`${styles.dropdownContent} ${dropdownOpen ? styles.dropdownOpen : ''}`}>
              {role === 'admin' && <button onClick={handleRegister}>Register</button>}              
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      </header>
      <div className={styles.dashboardContainer}>
        <div className={styles.mainContent}>
        <h1 className={styles.username}>Welcome, {username}!</h1>
        <p className={styles.welcomeText}>
          We are thrilled to have you here. Navigate through our application seamlessly and efficiently.
          Should you need any assistance, feel free to reach out. Have a great day!
        </p>

          <div className={styles.stats}>
            <div className={styles.statItem}>
              <h2>Projects</h2>
              <p>{projectsCount}</p>
              <button className={styles.viewButton} onClick={handleViewProjects}>View</button>
            </div>
            <div className={styles.statItem}>
              <h2>Employees</h2>
              <p>{employeesCount}</p>
              <button className={styles.viewButton} onClick={handleViewEmp}>View</button>
            </div>
            <div className={styles.statItem}>
              <h2>Tools</h2>
              <p>{toolsCount}</p>
              <button className={styles.viewButton} onClick={handleViewTool}>View</button>
            </div>
          </div>
          <div className={styles.phaseDataChart}>
            <Bar data={phaseData} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;






  