
import React from 'react';


export const handleLogout = (setUserState) => {
    setUserState(prevState => ({ ...prevState, isLoggedIn: false }));
  };
  
  export const handleLoginLinkClick = (setUiState) => {
    setUiState(prevState => ({ ...prevState, showLoginForm: true, showRegisterForm: false }));
  };
  
  export const handleRegisterLinkClick = (setUiState) => {
    setUiState(prevState => ({ ...prevState, showLoginForm: false, showRegisterForm: true }));
  };
  
  export const handleLoginChange = (e, setUserState) => {
    const { name, value } = e.target;
    setUserState(prevState => ({
      ...prevState,
      loginData: {
        ...prevState.loginData,
        [name]: value,
      },
    }));
  };
  
  export const handleLoginSubmit = async (e, userState, setUserState) => {
    e.preventDefault();
    console.log('Login submitted:', userState.loginData);
  
    try {
      const response = await fetch('http://127.0.0.1:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userState.loginData)
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      
      console.log('Login response:', data);
      setUserState(prevState => ({ ...prevState, userId: data.id, role:data.role ,isLoggedIn: true }));
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  };
  
  export const handleRegisterChange = (e, setUserState) => {
    const { name, value } = e.target;
    setUserState(prevState => ({
      ...prevState,
      registerData: {
        ...prevState.registerData,
        [name]: value,
      },
    }));
  };
  
  export const handleRegisterSubmit = async (e, userState, setUserState, setUiState) => {
    e.preventDefault();
    console.log('Registration submitted:', userState.registerData);
  
    try {
      const response = await fetch('http://127.0.0.1:3001/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userState.registerData)
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.ok;
  
      if (data) {
        setUiState(prevState => ({ ...prevState, showRegisterForm: false, showLoginForm: true }));
        setUserState(prevState => ({ ...prevState, isLoggedIn: true }));
      }
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  };

  const LoginForm = ({ handleLoginSubmit, handleLoginChange, loginData, handleRegisterLinkClick, showLoginForm }) => (
    <form id="login-form" onSubmit={handleLoginSubmit} style={{ display: showLoginForm ? 'block' : 'none' }}>
      <h1>Arasaka Team</h1>
      <div className="input-box">
        <input
          type="text"
          placeholder="UserName"
          name="username"
          value={loginData.username}
          onChange={handleLoginChange}
          required
        />
        <i className='bx bxs-user'></i>
      </div>
      <div className="input-box">
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={loginData.password}
          onChange={handleLoginChange}
          required
        />
        <i className='bx bxs-lock-alt'></i>
      </div>
      <button type="submit" className="btn">
        Login
      </button>
      <div className="register-link">
        <p>
          Don't have an account?{' '}
          <span className="register-link2" onClick={handleRegisterLinkClick}>
          Register here
          </span>{' '}
        </p>
      </div>
    </form>
  );

export default LoginForm;
  