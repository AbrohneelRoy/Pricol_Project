import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';
import logoImage from './image.png';

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
  
      // Find the user object that matches the logged-in username
      const currentUser = response.data.find(user => user.username === loggedInUser);
  
      if (currentUser) {
        setUsername(currentUser.username);
        setRole(currentUser.role);
      } else {
        console.error('User not found in API response');
        // Optionally handle case where user is not found
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
        borderWidth: 1,
      },
    ],
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
          <div className={`${styles.dashuserInfo} ${dropdownOpen ? styles.dropdownOpen : ''}`} onClick={toggleDropdown}>
            {username}
            <div className={styles.dropdownContent}>
              {role === 'admin' && <button onClick={handleRegister}>Register</button>}
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      </header>
      <div className={styles.dashboardContainer}>
        <div className={styles.mainContent}>
          <h1 className={styles.username}>Welcome, {username}!</h1>
          <p>Enjoy the seamless experience of our application.</p>
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
            <Bar data={phaseData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
