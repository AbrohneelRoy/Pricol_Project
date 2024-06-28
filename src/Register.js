import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.css'; // Define your Register component styles
import Navbar from './Navbar';
import logoImage from './image.png'; // Import your image

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const loggedInUser = localStorage.getItem('username');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        navigate('/login');
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
          <div className={styles['register-userInfo']}>{loggedInUser}</div>
        </div>
      </header>
      <div className={styles['register-container']}>
        <Navbar /> {/* Include the Navbar */}
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
              <button type="submit" className={styles['register-button']}>Register</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
