import React from 'react';

const handleClose = (e, taskState, setTaskState) => {
  e.preventDefault();
  setTaskState({
    ...taskState,
    isCreatingTask: false,
  });
};

const handleInputChange = (e, taskState, setTaskState) => {
  const { name, value } = e.target;
  setTaskState({
    ...taskState,
    taskData: {
      ...taskState.taskData,
      [name]: value,
    },
  });
};

const CreateTaskForm = ({ taskState, setTaskState, handleSubmit }) => (
  <div className="createTask-overlay">
    <div className="createTask-wrapper">
      <div className="header">
        <h2>Create Task</h2>
      </div>
      <form onSubmit={(e) => handleSubmit(e, taskState.taskData, setTaskState)}>
        <div>
          <label htmlFor="title">Task Name:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={taskState.taskData.title || ''}
            onChange={(e) => handleInputChange(e, taskState, setTaskState)}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Task Description:</label>
          <textarea
            id="description"
            name="description"
            value={taskState.taskData.description || ''}
            onChange={(e) => handleInputChange(e, taskState, setTaskState)}
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="status">Task Status:</label>
          <select
            id="status"
            name="status"
            value={taskState.taskData.status}
            onChange={(e) => handleInputChange(e, taskState, setTaskState)}
          >
            <option value="OPEN">Open</option>
          </select>
        </div>
        <button className="create-btn" type="submit">Create Task</button>
        <button className="close-btn" onClick={(e) => handleClose(e, taskState, setTaskState)}>Cancel</button>
      </form>
    </div>
  </div>
);
export default CreateTaskForm;