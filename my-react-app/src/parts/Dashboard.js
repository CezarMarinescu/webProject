import React, { useEffect } from 'react';
import TaskList from './TaskList';
import { fetchTasks, updateTask } from '../utils/utils'; // import updateTask from utils

const Dashboard = ({ taskState, setTaskState, handleDeleteTask, uiState, setUiState, refreshDashboard, setRefreshDashboard, userId }) => {

    useEffect(() => {
        fetchTasks(userId, setUiState, setTaskState).then(() => {
            setRefreshDashboard(false);
        });
    }, [refreshDashboard, setTaskState, setRefreshDashboard, userId, setUiState]);

    const memoizedHandleDeleteTask = React.useCallback((taskId, index) => handleDeleteTask(taskId, index, setTaskState), [handleDeleteTask, setTaskState]);

    const handleUpdateTask = async (taskId, newStatus) => {
        await updateTask(taskId, newStatus);
        setRefreshDashboard(true);
    };

    return (
        <section className="dashboard">
            <TaskList tasks={taskState.tasks} taskStatus='OPEN' handleDeleteTask={memoizedHandleDeleteTask} handleUpdateTask={handleUpdateTask} isLoading={uiState.isLoading} />
            <TaskList tasks={taskState.tasks} taskStatus='PENDING' handleDeleteTask={memoizedHandleDeleteTask} handleUpdateTask={handleUpdateTask} isLoading={uiState.isLoading} />
            <TaskList tasks={taskState.tasks} taskStatus='COMPLETED' handleDeleteTask={memoizedHandleDeleteTask} isLoading={uiState.isLoading} />
        </section>
    );
};

export default Dashboard;