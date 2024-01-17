import React, { useEffect, useState } from 'react';
import './App.css';
import Dashboard from './parts/Dashboard';
import { RefreshContext } from './RefreshContext';
import { fetchTasks } from './utils/utils';
import Navigation, {handleNavigationClick}from './parts/Navigation';
import CreateTaskForm from './parts/CreateTaskForm';
// import DetailedForm from './parts/DetailedForm';
import History from './parts/History';
import RegisterForm from './parts/Register';
import { handleDeleteTask, handleSubmit} from './parts/Task';
import LoginForm, { handleLoginSubmit, handleLoginChange, handleRegisterLinkClick, handleRegisterSubmit, handleRegisterChange, handleLoginLinkClick, handleLogout } from './parts/Login';


function App() {
  const [refreshDashboard, setRefreshDashboard] = useState(false);
  const [userState, setUserState] = useState({
    historyTasks: [],
    loginData: {
      username: '',
      password: '',
    },
    registerData: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    userId: null,
    role: null,
    isLoggedIn: false,
  });
  
  const [taskState, setTaskState] = useState({
    tasks: [],
    isCreatingTask: false,
    taskData: {
      title: '',
      description: '',
      status: 'open',
      allocatedToUserId: 3,
      createdByUserId: 3,
    },
    isDetailedFormOpen: false,
  });
  
  const [uiState, setUiState] = useState({
    selectedSection: 'dashboard',
    selectedName: '',
    isLoading: false,
    selectedTaskIndex: null,
    showRegisterForm: false,
    showLoginForm: true,
  });


  useEffect(() => {
    if (userState.isLoggedIn) {
      fetchTasks(userState.userId, setUiState, setTaskState);
    }
  }, [userState.isLoggedIn, userState.userId]);


  return (
    <div>
      <RefreshContext.Provider value={{ refreshDashboard, setRefreshDashboard }}>
        {userState.isLoggedIn ? (
          <div className="homepage">
            <header>
              <h1>Arasaka Team</h1>
              <Navigation handleNavigationClick={(section) => handleNavigationClick(section, setUiState)} handleLogout={() => handleLogout(setUserState)} setTaskState={setTaskState} />
            </header>

            <main className="main-content">
              <Dashboard 
                taskState={taskState} 
                setTaskState={setTaskState} 
                handleDeleteTask={(index) => handleDeleteTask(userState.userId, index, setTaskState)} 
                uiState={uiState} 
                setUiState={setUiState} 
                userId={userState.userId}
                refreshDashboard={refreshDashboard}
                setRefreshDashboard={setRefreshDashboard}
              />
              {taskState.isCreatingTask && 
                <CreateTaskForm 
                  taskState={taskState} 
                  setTaskState={setTaskState} 
                  handleSubmit={(e) => handleSubmit(e, taskState.taskData, setTaskState, setUiState, setRefreshDashboard)} 
                  refreshDashboard={refreshDashboard} 
                  setRefreshDashboard={setRefreshDashboard} 
                />
              }

            {uiState.selectedSection === 'history' && (
              <History
                tasks={taskState.tasks}
              />
            )}
            </main>
            
          </div>
        ) : (
          <div className="wrapper">
            <LoginForm 
              handleLoginSubmit={(e) => handleLoginSubmit(e, userState, setUserState)} 
              handleLoginChange={(e) => handleLoginChange(e, setUserState)} 
              loginData={userState.loginData} 
              handleRegisterLinkClick={() => handleRegisterLinkClick(setUiState)} 
              showLoginForm={uiState.showLoginForm} 
            />

            <RegisterForm 
              handleRegisterSubmit={(e) => handleRegisterSubmit(e, userState, setUserState, setUiState)} 
              handleRegisterChange={(e) => handleRegisterChange(e, setUserState)} 
              registerData={userState.registerData} 
              handleLoginLinkClick={() => handleLoginLinkClick(setUiState)} 
              showRegisterForm={uiState.showRegisterForm} 
            />
          </div>
        )}
      </RefreshContext.Provider>
    </div>
  )};
export default App;
