import React from 'react';

const TaskCards = ({ taskCards, handleDoneButtonClick }) => {
    if (!Array.isArray(taskCards)) {
        console.error("Invalid taskCards data:", taskCards);
        return <p>Error: Invalid task data</p>;
    }

    return (
        <div className="task-cards-container">
            {taskCards.map((task, index) => (
                <div key={index} className="task-card">
                    <input
                        type="checkbox"
                        id={`task-${index}`}
                        defaultChecked={task.completed}
                    />
                    <label htmlFor={`task-${index}`} className="task-item">
                        {task.description}
                    </label>
                </div>
            ))}
            <button id="done-button" onClick={handleDoneButtonClick}>
                Done
            </button>
        </div>
    );
};

export default TaskCards;