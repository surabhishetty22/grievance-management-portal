import React, { useState } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email.toLowerCase().endsWith('kar.in')) {
      setErrorMessage('Sign in declined');
      return;
    }

    // Check if the password meets the minimum length requirement (e.g., 8 characters)
    if (password.length < 8) {
      setErrorMessage('Password should be at least 8 characters long');
      return;
    }

    Axios.post('http://localhost:3000/insert-data', { name, email, password })
      .then((response) => {
        console.log(response.data);

        navigate('/');

      })
      .catch((error) => {
        console.error('Error:', error);
        if (error.response && error.response.data && error.response.data.error) {
          setErrorMessage(error.response.data.error);
        }
      });
  };

  return (
    <div className="signup-container">
      <h2>Sign in</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <button type="submit">Sign in</button>
      </form>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
};

export default Signup;
