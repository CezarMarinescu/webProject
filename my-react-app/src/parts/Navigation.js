import React from 'react';

export const handleNavigationClick = (section, setUiState) => {
  setUiState(prevState => ({ ...prevState, selectedSection: section }));
};

const Navigation = ({ handleNavigationClick, handleLogout, setTaskState }) => (
  <nav>
    <ul>
      <li onClick={() => handleNavigationClick('dashboard')}>Dashboard</li>
      <li onClick={() => handleNavigationClick('history')}>History</li>
      <li onClick={() => setTaskState(prevState => ({ ...prevState, isCreatingTask: true }))}> Create Task</li>
      <li onClick={handleLogout}>Logout</li>
    </ul>
  </nav>
);

export default Navigation;