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

  const [historyTasks, setHistoryTasks] = useState([]);
  const [selectedSection, setSelectedSection] = useState('dashboard');
  const [isDetailedFormOpen, setDetailedFormOpen] = useState(false);
  const [selectedName, setSelectedName] = useState('');
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isCreatingTask, setCreatingTask] = useState(false);
  const [taskData, setTaskData] = useState({
    taskName: '',
    taskDescription: '',
    taskStatus: 'OPEN',
    selectedName: '',
  });
  const [tasks, setTasks] = useState([

  ]);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(true);

  const handleLoginLinkClick = () => {
    setShowLoginForm(true);
    setShowRegisterForm(false);
  };

  const handleRegisterLinkClick = () => {
    setShowLoginForm(false);
    setShowRegisterForm(true);
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    console.log('Login submitted:', loginData);
  
    try {
      const response = await fetch('http://127.0.0.1:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      
      console.log('Login response:', data);
      // Here you can check if the user data is valid
      if (data) {
        setLoggedIn(true);
      }
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    console.log('Registration submitted:', registerData);
  
    try {
      const response = await fetch('http://127.0.0.1:3001/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(registerData)
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.ok;

      if (data) {
        setShowRegisterForm(false);
        setShowLoginForm(true);
        setLoggedIn(true);

      }
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  };


  //CREATE A TASK AND PUT IT IN THE LIST

  const handleCreateTask = () => {
    setCreatingTask(true);
  };

  const handleTaskChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  
  const handleTaskSubmit = (e) => {
    e.preventDefault();
    const newTask = {
      taskName: taskData.taskName,
      taskDescription: taskData.taskDescription,
      taskStatus: taskData.taskStatus,
      taskAllocatedUser: taskData.selectedName,
    };
    setTasks((prevTasks) => {
      // Check if a task with the same name already exists
      const existingTaskIndex = prevTasks.findIndex((task) => task.taskName === newTask.taskName);
  
      if (existingTaskIndex !== -1) {
        // If exists, update the existing task
        const updatedTasks = [...prevTasks];
        updatedTasks[existingTaskIndex] = newTask;
        return updatedTasks;
      } else {
        // If not exists, add the new task
        return [...prevTasks, newTask];
      }
    });
    setCreatingTask(false);
    
  };

  const handleCloseTaskForm = () => {
    setCreatingTask(false);
  };

  const handleDeleteTask = (index) => {

    const updatedTasks = [...tasks];

    updatedTasks.splice(index, 1);
  
    setTasks(updatedTasks);
  };

  /////////////////////////////////////////////////

  const handleOpenDetailedForm = (index) => {
    const selectedTask = tasks[index];

  if (selectedTask.taskStatus === 'PENDING') {
    
    setTasks((prevTasks) =>
      prevTasks.map((task, i) =>
        i === index ? { ...task, taskStatus: 'COMPLETED' } : task)

    );
  } 
  else if (selectedTask.taskStatus === 'COMPLETED') {
    const completedTask = tasks[index];
    setTasks((prevTasks) => prevTasks.filter((task, i) => i !== index));
    setHistoryTasks((prevHistoryTasks) => [...prevHistoryTasks, completedTask]);
  }
  else {
    setDetailedFormOpen(true);
    setSelectedTaskIndex(index);
  }
  };

  const handleDetailedFormSubmit = (e) => {
    e.preventDefault();
    setTasks((prevTasks) =>
    prevTasks.map((task, index) => {
      if (index === selectedTaskIndex) {
        const updatedTask = { ...task, taskAllocatedUser: selectedName, taskStatus: 'PENDING' };
        console.log('Updated Task:', updatedTask);
        return updatedTask;
      } else {
        return task;
      }
    })
  );
    setDetailedFormOpen(false);
  };


  const handleNavigationClick = (section) => {
    setSelectedSection(section);
  };

  

  const handleLogout = () => {
    // Perform logout logic (e.g., reset state, redirect to login page)
    setLoggedIn(false);
  };
  

  return (
    <div>
      {isLoggedIn ? (
        <div className="homepage">
          <header>
            <h1>Arasaka Team</h1>
            <nav>
              <ul>
              <li onClick={() => handleNavigationClick('dashboard')}>Dashboard</li>
              <li onClick={() => handleNavigationClick('history')}>History</li>
              <li onClick={handleCreateTask}>Create Task</li>
              <li onClick={handleLogout}>Logout</li>
              </ul>
            </nav>
          </header>
  
          <main className="main-content">
            {selectedSection === 'dashboard' && (
              <section className="dashboard">
                <div className='dashboard-container' id='open-container'>
                  <h3>OPEN</h3>
                  <ul>
                    {tasks.filter((task) => task.taskStatus === 'OPEN').map((task, index) => (      
                        <li key={index}>
                          <strong>{task.taskName}</strong>
                          <p>{task.taskDescription}</p>
                          {task.taskAllocatedUser && <p>Allocated to: {task.taskAllocatedUser}</p>}
                          <button
                            className={`status-button ${task.taskStatus.toLowerCase()}`}
                            onClick={() => handleOpenDetailedForm(index)}>   
                            {/* COD PTR A FACE PENDINGUL SA NU MEARGA */}
                            {/* onClick={() => task.taskStatus !== 'PENDING' && handleOpenDetailedForm(index)}>*/}
                          {task.taskStatus} 
                          </button>
                          
                          <button onClick={() => handleDeleteTask(index)}>Delete</button>
                        </li>
                    ))}
                  </ul>
                </div>

                <div className="dashboard-container" id="pending-container">
                  <h3>PENDING</h3>
                    <ul>
                    {tasks.filter((task) => task.taskStatus === 'PENDING').map((task, index) => (    
                      <li key={index}>
                        <strong>{task.taskName}</strong>
                        <p>{task.taskDescription}</p>
                        {task.taskAllocatedUser && <p>Allocated to: {task.taskAllocatedUser}</p>}
                        <button
                          className={`status-button ${task.taskStatus.toLowerCase()}`}
                          onClick={() => handleOpenDetailedForm(index)}>   
                          {/* COD PTR A FACE PENDINGUL SA NU MEARGA */}
                          {/* onClick={() => task.taskStatus !== 'PENDING' && handleOpenDetailedForm(index)}>*/}
                        {task.taskStatus} 
                        </button>
                        
                        <button onClick={() => handleDeleteTask(index)}>Delete</button>
                      </li>
                    ))}
                    </ul>
                </div>

                <div className="dashboard-container" id="completed-container">
                  <h3>COMPLETED</h3>
                    <ul>
                    {tasks.filter((task) => task.taskStatus === 'COMPLETED').map((task, index) => (    
                      <li key={index}>
                        <strong>{task.taskName}</strong>
                        <p>{task.taskDescription}</p>
                        {task.taskAllocatedUser && <p>Allocated to: {task.taskAllocatedUser}</p>}
                        <button
                          className={`status-button ${task.taskStatus.toLowerCase()}`}
                          onClick={() => handleOpenDetailedForm(index)}>   
                          {/* COD PTR A FACE PENDINGUL SA NU MEARGA */}
                          {/* onClick={() => task.taskStatus !== 'PENDING' && handleOpenDetailedForm(index)}>*/}
                        {task.taskStatus} 
                        </button>
                        
                        <button onClick={() => handleDeleteTask(index)}>Delete</button>
                      </li>
                    ))}
                    </ul>
                </div>
              </section>
            )}
            {isCreatingTask && (
              <div className="createTask-overlay">
                <div className = "createTask-wrapper">
                  <form onSubmit={handleTaskSubmit}>
                    <div className="header">
                      <h2>Create Task</h2>
                    </div>
                    <div>
                      <label htmlFor="taskName">Task Name:</label>
                      <input
                        type="text"
                        id="taskName"
                        name="taskName"
                        value={taskData.taskName}
                        onChange={handleTaskChange}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="taskDescription">Task Description:</label>
                      <textarea
                        id="taskDescription"
                        name="taskDescription"
                        value={taskData.taskDescription}
                        onChange={handleTaskChange}
                        required
                      ></textarea>
                    </div>
                    <div>
                      <label htmlFor="taskStatus">Task Status:</label>
                      <select
                        id="taskStatus"
                        name="taskStatus"
                        value={taskData.taskStatus}
                        onChange={handleTaskChange}
                      >
                        <option value="OPEN">Open</option>
                        
                      </select>
                    </div>
                    <button className="create-btn" type="submit">Create Task</button>
                    <button className="close-btn" onClick={handleCloseTaskForm}>Cancel</button>
                  </form>
                </div>
              </div>
            )}

            {isDetailedFormOpen && (
                <div className="detailed-form-overlay">
                  <div className="detailed-form-wrapper">
                    <form onSubmit={handleDetailedFormSubmit}>
                      <div className="header">
                        <h2>Detailed Form</h2>
                      </div>
                      <div>
                        <label htmlFor="selectedName">Select Name:</label>
                        <select
                          id="selectedName"
                          name="selectedName"
                          value={selectedName}
                          onChange={(e) => setSelectedName(e.target.value)}
                        >
                          {/* Predefined list of names */}
                          <option value="Walter">Walter</option>
                          <option value="Jade">Jade</option>
                          {/* Add more names as needed */}
                        </select>
                      </div>
                      {/* Add other detailed form content here */}
                      <button className="create-btn" type="submit">Submit</button>
                      <button className="close-btn" onClick={() => setDetailedFormOpen(false)}>Cancel</button>
                    </form>
                  </div>
                </div>
            )}
              
              {selectedSection === 'history' && (
                <section className="History">
                  <h2>History</h2>
                  <ul className="history">
                    {historyTasks.map((task, index) => (
                      <li key={index}>
                        <strong>{task.taskName}</strong>
                        <p>{task.taskDescription}</p>
                        {task.taskAllocatedUser && <p>Allocated to: {task.taskAllocatedUser}</p>}
                        {/* Add any other content you want to display for history tasks */}
                        <button className="history-button">Completed</button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
  
            <section className="Profile">
              
            </section>
           
          </main>
        </div>
      ) : (
        <div className="wrapper">
          {/* Login Form */}
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
        
          {/* Register Form */}
          <form id="register-form" onSubmit={handleRegisterSubmit} style={{ display: showRegisterForm ? 'block' : 'none'}}>
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
                <span className="login-link2" onClick={handleLoginLinkClick}>
                Login here
                </span>
              </p>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
