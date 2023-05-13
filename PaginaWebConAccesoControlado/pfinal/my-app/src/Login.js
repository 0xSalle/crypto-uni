import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import argon2 from 'argon2';

function Login(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function handleUsernameChange(event) {
    setUsername(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await fetch('https://localhost:3003/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/home');
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('An error occurred while logging in. Please try again later.');
      console.error(error);
    }
  }

  return (
    <div className="App">
      <div>
        {error && <p>{error}</p>}
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Username:
            <input type="text" value={username} onChange={handleUsernameChange} required />
          </label>
          <br />
          <label>
            Password:
            <input type="password" value={password} onChange={handlePasswordChange} required />
          </label>
          <br />
          <button type="submit">Submit</button>
        </form>
        <br />
        <a href="/register">Register</a>
      </div>
    </div>
  );
}

export default Login;

