import React, { useState } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password.length < 8) {
      alert('Password should be at least 8 characters long');
      return; 
    }

    Axios.post('http://localhost:3000/login', { email, password })
      .then((response) => {
        console.log(response.data);

        if (response.data.department === 'Unknown Department') {
          navigate(`/dashboard/${response.data.userId}`);
        } else {
          navigate(`/complaint-list/${response.data.department}`);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const goToSignup = () => {
    navigate('/signup');
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p className="redirect-link" onClick={goToSignup}>
        Not a user? Sign up here.
      </p>
    </div>
  );
};

export default Login;
