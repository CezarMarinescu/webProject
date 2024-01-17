import React from 'react';

const History = ({ tasks }) => {
    const filteredTasks = tasks.filter((task) => task.status === 'history');
    console.log('completedTasks:', filteredTasks);

    const styles = {
        color: 'white', // Change this to the color you want
        // Add other styles as needed
    };

    return (
        <div>
            <h2>Completed Tasks</h2>
            <div className="history" style={styles}>
            {filteredTasks.length === 0 ? (
                <p>No completed tasks.</p>
            ) : (
                <ul>
                    {filteredTasks.map((task, index) => (
                        <li key={index}>
                            {task.title} - {task.description}
                        </li>
                    ))}
                </ul>
            )}
        </div>
        </div>
       
    );
};

export default History;