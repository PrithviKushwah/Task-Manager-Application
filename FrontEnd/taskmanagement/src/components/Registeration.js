import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../CSS/register.css'; 

const Registration = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Default role
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://task-manager-application-1tfu.onrender.com/api/auth/register', {
        email,
        password,
        role,
      });

      if (response.status === 400) {
        setError('User already exists');
      } else {
        localStorage.setItem('token', response.data.token);
        navigate('/');
      }
    } catch (error) {
      console.error(error.response.data);
      setError('Server error. Please try again.'); 
       }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Register</h2>
        {error && <p style={{color:"red"}} className="error-message">{error}</p>} 
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
        <div>
          <label>Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit">Register</button>
        <div className="register-link">
          <Link to="/">Already have an account? Login</Link>
        </div>
      </form>
    </div>
    
  );
};

export default Registration;
