import React, { useState } from 'react';
import './App.css'; // Import your CSS file

function App() {
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });

  const [registerData, setRegisterData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [isLoggedIn, setLoggedIn] = useState(false);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // Perform login logic using loginData
    console.log('Login submitted:', loginData);
    setLoggedIn(true);
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    
    console.log('Register submitted:', registerData);
    setLoggedIn(true);
  };

  return (
    <div className="wrapper">
      {isLoggedIn ? (
        <div className="homepage">
          <header>
            <h1>Arasaka Team</h1>
            <nav>
              <ul>
                <li>Dashboard</li>
                <li>Projects</li>
                <li>Issues</li>
                <li>Reports</li>
              </ul>
            </nav>
            <div className="user-info">
              <span>Welcome, User123</span>
              <button>Logout</button>
            </div>
          </header>

          <main className="main-content">
            <section className="dashboard">
              <h2>Dashboard</h2>
              {/* Add your dashboard content here */}
            </section>

            <section className="projects">
              <h2>Projects</h2>
              {/* Add your projects content here */}
            </section>

            <section className="issues">
              <h2>Issues</h2>
              {/* Add your issues content here */}
            </section>

            <section className="reports">
              <h2>Reports</h2>
              {/* Add your reports content here */}
            </section>
          </main>
        </div>
      ) : (
      <>
        {/* Login Form */}
        <form id="login-form" onSubmit={handleLoginSubmit}>
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
              <a href="#" className="register-link2">
                Register here
              </a>{' '}
            </p>
          </div>
        </form>

        {/* Register Form */}
        <form id="register-form" onSubmit={handleRegisterSubmit} style={{ display: 'none' }}>
          <h1>Welcome to Arasaka Team!</h1>
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
          <div className="input-box">
            <input
              type="password"
              placeholder="Confirm password"
              name="confirmPassword"
              value={registerData.confirmPassword}
              onChange={handleRegisterChange}
              required
            />
            <i className='bx bxs-lock-alt'></i>
          </div>
          <button type="submit" className="btn">
            Register
          </button>
          <div className="register-link">
            <p>
              Already have an account?{' '}
              <a href="#" className="login-link2">
                Login here
              </a>
            </p>
          </div>
        </form>
        </>
      )}
    </div>
  );
}

export default App;
