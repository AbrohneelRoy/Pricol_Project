import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.css'; // Define your Register component styles

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

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

      if (response.ok) {
        alert('Registration successful!');
        navigate('/login');
      } else {
        alert('Registration failed.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Registration failed: Network error or server not responding.');
    }
  };

  return (
    <div className={styles.registerWrapper}>
      <div className={styles.registerContainer}>
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.registerFormGroup}>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.registerInput}
              required
            />
          </div>
          <div className={styles.registerFormGroup}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.registerInput}
              required
            />
          </div>
          <div className={styles.registerFormGroup}>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.registerInput}
              required
            />
          </div>
          <button type="submit" className={styles.registerButton}>Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
