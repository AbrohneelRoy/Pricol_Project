import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css'; 
import loginImage from './image.png';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://192.168.202.228:8080/login/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          alert('Login failed: Invalid username or password.');
        } else {
          alert(`Login failed: Server responded with status ${response.status}.`);
        }
        return;
      }

      const result = await response.json();
      if (result.success) {
        localStorage.setItem('username', username);
        navigate('/dashboard');
      } else {
        alert('Login failed: ' + result.message);
      }
    } catch (error) {
      console.error('Error during fetch:', error);
      alert('Login failed: Network error or server not responding.');
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginContainer}>
        <div className={styles.loginLeftSide}>
          <img src={loginImage} alt="Login" className={styles.loginImage} />
        </div>
        <div className={styles.loginRightSide}>
          <div className={styles.loginBox}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.loginFormGroup}>
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={styles.loginInput}
                  required
                />
              </div>
              <div className={styles.loginFormGroup}>
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.loginInput}
                  required
                />
              </div>
              <button type="submit" className={styles.loginButton}>Login</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
