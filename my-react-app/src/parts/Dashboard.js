import React, { useEffect } from 'react';
import TaskList from './TaskList';
import { fetchTasks, updateTask } from '../utils/utils'; 

const Dashboard = ({ taskState, setTaskState, handleDeleteTask, uiState, setUiState, refreshDashboard, setRefreshDashboard, userId }) => {

    useEffect(() => {
        fetchTasks(userId, setUiState, setTaskState).then(() => {
            setRefreshDashboard(false);
        });
    }, [refreshDashboard, setTaskState, setRefreshDashboard, userId, setUiState]);

    const memoizedHandleDeleteTask = React.useCallback((taskId, index) => handleDeleteTask(taskId, index, setTaskState), [handleDeleteTask, setTaskState]);

    const handleUpdateTask = async (userId, taskId, newStatus) => {
  
        await updateTask(userId, taskId, newStatus);
        
        setRefreshDashboard(true);
      };

    return (
        <section className="dashboard">
            <TaskList tasks={taskState.tasks} taskStatus='OPEN' userId={userId} handleDeleteTask={memoizedHandleDeleteTask} handleUpdateTask={handleUpdateTask} isLoading={uiState.isLoading} />
            <TaskList tasks={taskState.tasks} taskStatus='PENDING' userId={userId} handleDeleteTask={memoizedHandleDeleteTask} handleUpdateTask={handleUpdateTask} isLoading={uiState.isLoading} />
            <TaskList tasks={taskState.tasks} taskStatus='COMPLETED' userId={userId} handleDeleteTask={memoizedHandleDeleteTask} handleUpdateTask={handleUpdateTask} isLoading={uiState.isLoading} />
        </section>
    );
};

export default Dashboard;