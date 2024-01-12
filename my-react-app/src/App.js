import React, { useEffect, useState } from 'react';
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
    title: '',
    description: '',
    status: 'open',
    allocatedToUserId: 3,
    createdByUserId:3,
  });
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchTasks();
    }
  }, [isLoggedIn, userId]);

  
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(true);
  const arePropsEqual = (prevProps, nextProps) => {
    // Only re-render if tasks, taskStatus, or isLoading changes
    return prevProps.tasks === nextProps.tasks &&
      prevProps.taskStatus === nextProps.taskStatus &&
      prevProps.isLoading === nextProps.isLoading;
  }


  const fetchTasks = async () => {
    console.log('Fetching tasks for user:', userId);
  
    setIsLoading(true); // Set isLoading to true before starting the fetch request
  
    try {
      const response = await fetch(`http://localhost:3001/tasks?userId=${userId}`); // use userId state variable
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const text = await response.json();
      console.log('Tasks:', text)
      setTasks(text);
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    } finally {
      setIsLoading(false); // Set isLoading to false after the fetch request is complete
    }
  };

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
      setUserId(data.id);

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

  const handleDeleteTask = async (taskId, index) => {
    try {
      const response = await fetch(`http://localhost:3001/delete-task/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const updatedTasks = [...tasks];
      updatedTasks.splice(index, 1);
      setTasks(updatedTasks);
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
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

  const handleNavigationClick = (section) => {
    setSelectedSection(section);
  };

  

  const handleLogout = () => {
    setLoggedIn(false);
  };
  
  const TaskList = React.memo(({ tasks, taskStatus, handleOpenDetailedForm, handleDeleteTask, isLoading }) => {
    const filteredTasks = tasks.filter((task) => task.status === taskStatus.toLowerCase());
    console.log("Tasks", tasks)
  
    console.log(`Filtered tasks for status ${taskStatus}:`, filteredTasks);
  
    return (
      <div className='dashboard-container' id={`${taskStatus.toLowerCase()}-container`}>
        <h3>{taskStatus}</h3>
        <ul>
          {isLoading ? (
            <p>Loading tasks...</p>
          ) : (
            filteredTasks.map((task, index) => (
              <li key={index}>
                <strong>{task.title}</strong>
                <p>{task.description}</p>
                {task.allocatedToUserId && <p>Allocated to: {task.allocatedToUserId}</p>}
                <button
                  className={`status-button ${task.status.toLowerCase()}`}
                  onClick={() => task.status !== 'PENDING' && handleOpenDetailedForm(index)}
                >
                  {task.status}
                </button>
                <button onClick={() => handleDeleteTask(index)}>Delete</button>
              </li>
            ))
          )}
        </ul>
      </div>
    );
  }, arePropsEqual);
  
  const Dashboard = ({ tasks, handleOpenDetailedForm, handleDeleteTask, isLoading }) => (
    <section className="dashboard">
      <TaskList tasks={tasks} taskStatus='OPEN' handleOpenDetailedForm={handleOpenDetailedForm} handleDeleteTask={handleDeleteTask} isLoading={isLoading} />
      <TaskList tasks={tasks} taskStatus='PENDING' handleOpenDetailedForm={handleOpenDetailedForm} handleDeleteTask={handleDeleteTask} isLoading={isLoading} />
      <TaskList tasks={tasks} taskStatus='COMPLETED' handleOpenDetailedForm={handleOpenDetailedForm} handleDeleteTask={handleDeleteTask} isLoading={isLoading} />
    </section>
  );
  
  const Navigation = ({ handleNavigationClick, handleLogout }) => (
    <nav>
      <ul>
        <li onClick={() => handleNavigationClick('dashboard')}>Dashboard</li>
        <li onClick={() => handleNavigationClick('history')}>History</li>
        <li onClick={() => setCreatingTask(true)}> Create Task</li>
        <li onClick={handleLogout}>Logout</li>
      </ul>
    </nav>
  );

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

  const DetailedForm = ({ isDetailedFormOpen, selectedName, setSelectedName, setDetailedFormOpen }) => {
    if (!isDetailedFormOpen) {
      return null;
    }
  
    return (
      <div className="detailed-form-overlay">
        <div className="detailed-form-wrapper">
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
              <option value="Walter">Wasslter</option>
              <option value="Jade">Jade</option>
              {/* Add more names as needed */}
            </select>
          </div>
          {/* Add other detailed form content here */}
          <button className="create-btn" type="submit">Submit</button>
          <button className="close-btn" onClick={() => setDetailedFormOpen(false)}>Cancel</button>
        </div>
      </div>
    );
  };
  const handleInputChange = (event) => {
    const { name, value } = event.target;
  
    setTaskData((prevTaskData) => ({
      ...prevTaskData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const response = await fetch('http://localhost:3001/create-task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const message = await response.text();
      console.log(message);
  
      // Reset the taskData state to clear the form fields.
      setTaskData({});
  
      // Close the form.
      setCreatingTask(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };
  
  const handleClose = () => {
    // Close the form.
    setCreatingTask(false);
  
    // Optionally, you can also reset the taskData state to clear the form fields.
    setTaskData({});
  };

  const CreateTaskForm = ({ taskData, handleInputChange, handleSubmit, handleClose }) => (
    <div className="createTask-overlay">
      <div className="createTask-wrapper">
        <div className="header">
          <h2>Create Task</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">Task Name:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={taskData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="description">Task Description:</label>
            <textarea
              id="description"
              name="description"
              value={taskData.description}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>
          <div>
            <label htmlFor="status">Task Status:</label>
            <select
              id="status"
              name="status"
              value={taskData.status}
              onChange={handleInputChange}
            >
              <option value="OPEN">Open</option>
              {/* Add more options as needed */}
            </select>
          </div>
          <button className="create-btn" type="submit">Create Task</button>
          <button className="close-btn" onClick={handleClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
  return (
    <div>
      {isLoggedIn ? (
        <div className="homepage">
          <header>
          <h1>Arasaka Team</h1>
          <Navigation handleNavigationClick={handleNavigationClick} handleLogout={handleLogout} />
        </header>
  
          <main className="main-content">
          <Dashboard tasks={tasks} handleOpenDetailedForm={handleOpenDetailedForm} handleDeleteTask={handleDeleteTask} isLoading={isLoading} />
            
          {isCreatingTask && <CreateTaskForm taskData={taskData} handleInputChange={handleInputChange} handleSubmit={handleSubmit} handleClose={handleClose} />}
          {/* {isCreatingTask && <CreateTaskForm taskData={taskData}/>} */}
          <DetailedForm isDetailedFormOpen={isDetailedFormOpen} selectedName={selectedName} setSelectedName={setSelectedName} setDetailedFormOpen={setDetailedFormOpen} />
              
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
          <LoginForm handleLoginSubmit={handleLoginSubmit} handleLoginChange={handleLoginChange} loginData={loginData} handleRegisterLinkClick={handleRegisterLinkClick} showLoginForm={showLoginForm} />
        <RegisterForm handleRegisterSubmit={handleRegisterSubmit} handleRegisterChange={handleRegisterChange} registerData={registerData} handleLoginLinkClick={handleLoginLinkClick} showRegisterForm={showRegisterForm} />
      </div>
      )}
    </div>
  );
}

export default App;
