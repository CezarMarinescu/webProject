import React from 'react';

export const handleDeleteTask = async (userId, index, setTaskState) => {
  try {
    const responseGet = await fetch(`http://localhost:3001/get-task/${userId}/${index}`, {
      method: 'GET',
    });
    const data = await responseGet.json();
    const taskId = data.id; 
    console.log(data);
    const response = await fetch(`http://localhost:3001/delete-task/${taskId}`, {
      method: 'DELETE',
    });
    console.log(response);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    setTaskState(prevState => {
      const updatedTasks = [...prevState.tasks];
      updatedTasks.splice(index, 1);
      return { ...prevState, tasks: updatedTasks };
    });
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
};

export const handleSubmit = async (event, taskData, setTaskState, setUiState, setRefreshDashboard) => {
  event.preventDefault();
  const completeTaskData = {
    title: taskData.title,
    description: taskData.description,
    status: taskData.status || 'open', 
    allocatedToUserId: taskData.allocatedToUserId, 
    createdByUserId: taskData.createdByUserId || 3, 
  };
  try {
    const response = await fetch('http://localhost:3001/create-task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(completeTaskData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const message = await response.text();
    console.log(message);

    setTaskState(prevState => ({ ...prevState, taskData: {} }));

    setUiState(prevState => ({ ...prevState, isCreatingTask: false }));

    setRefreshDashboard(prevState => !prevState);
  } catch (error) {
    console.error('Error creating task:', error);
  }
};


const Task = React.memo(({ userId, task, index, handleDeleteTask, handleUpdateTask }) => {
  const handleStatusClick = () => {
    if (task.status === 'open') {
      handleUpdateTask(userId, task.id, 'pending');
    } else if (task.status === 'pending') {
      handleUpdateTask(userId, task.id, 'completed');
    } else if (task.status === 'completed') {
      handleUpdateTask(userId, task.id, 'history');
    }
  };

  return (
    <li key={index}>
      <strong>{task.title}</strong>
      <p>{task.description}</p>
      {task.allocatedToUserId && <p>Allocated to: {task.allocatedToUserId}</p>}
      <button
        className={`status-button ${task.status.toLowerCase()}`}
        onClick={handleStatusClick}
      >
        {task.status}
      </button>
      <button onClick={() => handleDeleteTask(index)}>Delete</button>
    </li>
  );
});

export default Task;