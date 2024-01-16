import React from 'react';

  const RegisterForm = ({ handleRegisterSubmit, handleRegisterChange, registerData, handleLoginLinkClick, showRegisterForm }) => (
    <form id="register-form" onSubmit={handleRegisterSubmit} style={{ display: showRegisterForm ? 'block' : 'none' }}>
      <h1>Arasaka Team</h1>
      <div className="input-box">
        <input
          type="text"
          placeholder="UserName"
          name="username"
          value={registerData.username}
          onChange={handleRegisterChange}
          required
        />
        <i className='bx bxs-user'></i>
      </div>
      <div className="input-box">
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={registerData.password}
          onChange={handleRegisterChange}
          required
        />
        <i className='bx bxs-lock-alt'></i>
      </div>
      <button type="submit" className="btn">
        Register
      </button>
      <div className="login-link">
        <p>
          Already have an account?{' '}
          <span className="login-link2" onClick={handleLoginLinkClick}>
          Login here
          </span>{' '}
        </p>
      </div>
    </form>
  );

export default RegisterForm;