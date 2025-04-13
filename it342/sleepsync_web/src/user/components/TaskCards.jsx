import React from 'react';

const TaskCards = ({ taskCards, handleDoneButtonClick }) => {
    let parsedTaskCards = [];

    // Parse raw HTML taskCards if necessary
    if (typeof taskCards === 'string') {
        const parser = new DOMParser();
        const doc = parser.parseFromString(taskCards, 'text/html');
        parsedTaskCards = Array.from(doc.querySelectorAll('.task-card')).map((card) => {
            const description = card.querySelector('span')?.textContent || 'Unknown Task';
            const completed = card.querySelector('input[type="checkbox"]')?.checked || false;
            return { description, completed };
        });
    } else if (Array.isArray(taskCards)) {
        parsedTaskCards = taskCards;
    } else {
        console.error("Invalid taskCards data:", taskCards);
        return <p>Error: Invalid task data</p>;
    }

    return (
        <div className="task-cards-container">
            {parsedTaskCards.map((task, index) => (
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