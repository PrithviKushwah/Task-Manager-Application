import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../CSS/login.css'; // Import the CSS file

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { token, role } = response.data;
      localStorage.setItem('token', token);

      if (role === 'admin') {
        navigate('/admin/tasks');
      } else {
        navigate('/user/tasks');
      }

    } catch (error) {
      console.error('Login failed:', error);
      alert('Invalid credentials or server error');
    }
  };

  return (
    <div className="login-container">
      <div style={{marginRight: '5%'}} className="login-form-section">
        <form className="login-form" onSubmit={handleLogin}>
          <h2>Login</h2>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
          <div className="register-link">
            <Link to='/register'>Don't have an account? Register</Link>
          </div>
        </form>
      </div>

      <div className="benefits-section">
        <h3>Welcome to Task Management</h3>
        <p>Our application helps you to:</p>
        <ul>
          <li>Efficiently manage and assign tasks</li>
          <li>Track task progress and completion status</li>
          <li>Set priorities and deadlines to ensure timely delivery</li>
          <li>Collaborate seamlessly with your team</li>
          <li>Receive updates on tasks assigned to you</li>
        </ul>
        <p>Whether you're an admin or a user, login now to streamline your work and stay organized!</p>
      </div>
    </div>
  );
};

export default Login;
