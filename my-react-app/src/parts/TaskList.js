import React from 'react';
import Task from './Task';
import { arePropsEqual } from '../utils/utils';
  
const TaskList = React.memo(({ tasks, taskStatus, handleDeleteTask, handleUpdateTask, userId, isLoading }) => {
    const filteredTasks = tasks.filter((task) => task.status === taskStatus.toLowerCase());
  
    console.log(`Filtered tasks for status ${taskStatus}:`, filteredTasks);
  
    return (
      <div className='dashboard-container' id={`${taskStatus.toLowerCase()}-container`}>
        <h3>{taskStatus}</h3>
        <ul>
          {isLoading ? (
            <p>Loading tasks...</p>
          ) : (
            filteredTasks.map((task, index) => (
              <Task
                userId={userId}
                key={index}
                task={task}
                index={index}
                handleDeleteTask={handleDeleteTask}
                handleUpdateTask={handleUpdateTask} 
              />
            ))
          )}
        </ul>
      </div>
    );
  }, arePropsEqual);

export default TaskList;