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
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);
  const [selectedName, setSelectedName] = useState('');
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isCreatingTask, setCreatingTask] = useState(false);
  const [taskData, setTaskData] = useState({
    taskName: '',
    taskDescription: '',
    taskStatus: 'OPEN',
    selectedName: '',
  });
  const [tasks, setTasks] = useState([]);


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
    // Perform logic to save the task data
    const newTask = {
      taskName: taskData.taskName,
      taskDescription: taskData.taskDescription,
      taskStatus: taskData.taskStatus,
      taskAllocatedUser: taskData.selectedName,
    };

    setTasks((prevTasks) => [...prevTasks, newTask]); // Add the new task to the list
    setCreatingTask(false);
    // Additional logic to save the task data (e.g., API call, state update)
  };

  const handleCloseTaskForm = () => {
    setCreatingTask(false);
  };

  const handleDeleteTask = (index) => {
    // Create a copy of the tasks array
    const updatedTasks = [...tasks];
  
    // Remove the task at the specified index
    updatedTasks.splice(index, 1);
  
    // Update the state with the new tasks array
    setTasks(updatedTasks);
  };

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
                <h2>Dashboard</h2>
                <ul>
                  {tasks.map((task, index) => (
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
                        <option value="COMPLETED">Completed</option>
                        <option value="PENDING">Pending</option>
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
        </div>
      )}
    </div>
  );
}

export default App;
