
export const updateTask = async (userId, taskId, newStatus) => {
  console.log("USERID", userId)
    try {
      const response = await fetch(`http://localhost:3001/update-task/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus, userid: userId }),
      });
  
      if (!response.ok) {
        alert('You are not authorized to update this task');
      }
  
      const message = await response.text();
      console.log(message);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  
export const fetchTasks = async (userId, setUiState, setTaskState) => {
    console.log('Fetching tasks for user:', userId);

    setUiState(prevState => ({ ...prevState, isLoading: true })); 

    try {
        const response = await fetch(`http://localhost:3001/tasks?userId=${userId}`); 

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const text = await response.json();
        console.log('Tasks:', text)
        setTaskState(prevState => ({ ...prevState, tasks: text }));
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    } finally {
        setUiState(prevState => ({ ...prevState, isLoading: false })); 
    }
};

export const arePropsEqual = (prevProps, nextProps) => {
    return prevProps.tasks === nextProps.tasks &&
      prevProps.taskStatus === nextProps.taskStatus &&
      prevProps.isLoading === nextProps.isLoading;
  }
