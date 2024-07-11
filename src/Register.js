import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.css';
import logoImage from './image.png';
import droplist from './droplist.png';


const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const loggedInUser = localStorage.getItem('username');

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleDash = () => {
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/login', { replace: true });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://192.168.202.228:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Registration failed: Network error or server not responding.');
    }
  };

  return (
    <div className={styles['register-wrapper']}>
      <header className={styles['register-header']}>
        <div className={styles['register-topBar']}>
          <div className={styles['register-logo']}>
            <img src={logoImage} alt="Logo" className={styles['register-logoImage']} />
          </div>
          <div className={styles['register-userInfo']} onClick={toggleDropdown}>
            {loggedInUser}             
            <img src={droplist} alt="dropdown arrow" className={`${styles.arrow} ${dropdownOpen ? styles.rotate : ''}`} style={{ width: '25px', height: '25px', marginRight: '5px'}} />
            <div className={`${styles.dropdownContent} ${dropdownOpen ? styles.dropdownOpen : ''}`}>
              <button onClick={handleDash}>Dashboard</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>


        </div>
      </header>
      <div className={styles['register-container']}>
        <div className={styles['register-content']}>
          <div className={styles['register-formContainer']}>
            <h2 className={styles['register-title']}>Register</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles['register-formGroup']}>
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={styles['register-input']}
                  required
                />
              </div>
              <div className={styles['register-formGroup']}>
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles['register-input']}
                  required
                />
              </div>
              <div className={styles['register-formGroup']}>
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles['register-input']}
                  required
                />
              </div>
              <div className={styles['register-formGroup']}>
                <label>Role:</label>
                <div className={styles['register-radioGroup']}>
                  <label>
                    <input
                      type="radio"
                      name="role"
                      value="admin"
                      checked={role === 'admin'}
                      onChange={(e) => setRole(e.target.value)}
                      required
                    />
                    Admin
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="role"
                      value="user"
                      checked={role === 'user'}
                      onChange={(e) => setRole(e.target.value)}
                      required
                    />
                    User
                  </label>
                </div>

              </div>
              <button type="submit" className={styles['register-button']}>Register</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
