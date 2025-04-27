import React, { useState, useEffect } from 'react';
import './TaskCards.css'; // Make sure to create this CSS file

const TaskCards = ({ taskCards, handleDoneButtonClick }) => {
    const [tasks, setTasks] = useState([]);
    const [allCompleted, setAllCompleted] = useState(false);
    
    // Function to determine task icon based on description keywords
    const getTaskIcon = (description) => {
        const lowerDesc = description.toLowerCase();
        
        if (lowerDesc.includes('drink') || lowerDesc.includes('water') || lowerDesc.includes('hydrate')) {
            return '💧';
        } else if (lowerDesc.includes('meditate') || lowerDesc.includes('breathing') || lowerDesc.includes('relax')) {
            return '🧘';
        } else if (lowerDesc.includes('exercise') || lowerDesc.includes('stretch') || lowerDesc.includes('yoga')) {
            return '🏃';
        } else if (lowerDesc.includes('read') || lowerDesc.includes('book')) {
            return '📚';
        } else if (lowerDesc.includes('phone') || lowerDesc.includes('device') || lowerDesc.includes('screen')) {
            return '📵';
        } else if (lowerDesc.includes('light') || lowerDesc.includes('dark') || lowerDesc.includes('blinds')) {
            return '💡';
        } else if (lowerDesc.includes('shower') || lowerDesc.includes('bath') || lowerDesc.includes('wash')) {
            return '🚿';
        } else if (lowerDesc.includes('journal') || lowerDesc.includes('write') || lowerDesc.includes('note')) {
            return '📝';
        } else if (lowerDesc.includes('music') || lowerDesc.includes('listen') || lowerDesc.includes('sound')) {
            return '🎵';
        } else if (lowerDesc.includes('caffeine') || lowerDesc.includes('coffee') || lowerDesc.includes('tea')) {
            return '☕';
        } else if (lowerDesc.includes('food') || lowerDesc.includes('eat') || lowerDesc.includes('meal')) {
            return '🍽️';
        } else if (lowerDesc.includes('temperature') || lowerDesc.includes('cool') || lowerDesc.includes('warm')) {
            return '🌡️';
        } else {
            return '✅'; // Default icon
        }
    };
    
    // Parse raw HTML taskCards if necessary
    useEffect(() => {
        let parsedTasks = [];
        
        if (typeof taskCards === 'string') {
            const parser = new DOMParser();
            const doc = parser.parseFromString(taskCards, 'text/html');
            parsedTasks = Array.from(doc.querySelectorAll('.task-card')).map((card) => {
                const description = card.querySelector('span')?.textContent || 'Unknown Task';
                const completed = card.querySelector('input[type="checkbox"]')?.checked || false;
                return { 
                    description, 
                    completed,
                    icon: getTaskIcon(description)
                };
            });
        } else if (Array.isArray(taskCards)) {
            parsedTasks = taskCards.map(task => ({
                ...task,
                icon: getTaskIcon(task.description)
            }));
        }
        
        setTasks(parsedTasks);
    }, [taskCards]);
    
    // Check if all tasks are completed
    useEffect(() => {
        setAllCompleted(tasks.length > 0 && tasks.every(task => task.completed));
    }, [tasks]);
    
    // Handle task completion
    const handleTaskToggle = (index) => {
        const updatedTasks = [...tasks];
        updatedTasks[index].completed = !updatedTasks[index].completed;
        setTasks(updatedTasks);
    };
    
    // Progress calculation
    const progress = tasks.length > 0 
        ? Math.round((tasks.filter(task => task.completed).length / tasks.length) * 100) 
        : 0;
    
    return (
        <div className="task-cards-container">
            <div className="task-header">
                <h3 className="task-section-title">Pre-sleep Routine</h3>
                <div className="task-progress">
                    <div className="progress-bar">
                        <div 
                            className="progress-fill" 
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <span className="progress-text">{progress}% Complete</span>
                </div>
            </div>
            
            {tasks.length === 0 ? (
                <div className="empty-tasks">No tasks available</div>
            ) : (
                <div className="tasks-list">
                    {tasks.map((task, index) => (
                        <div 
                            key={index} 
                            className={`task-card ${task.completed ? 'completed' : ''}`}
                            onClick={() => handleTaskToggle(index)}
                        >
                            <div className="task-checkbox">
                                <input
                                    type="checkbox"
                                    id={`task-${index}`}
                                    checked={task.completed}
                                    onChange={() => handleTaskToggle(index)}
                                />
                                <span className="checkmark"></span>
                            </div>
                            <div className="task-icon">{task.icon}</div>
                            <label htmlFor={`task-${index}`} className="task-item">
                                {task.description}
                            </label>
                            <div className="task-status">
                                {task.completed ? 
                                    <span className="status-complete">Done</span> : 
                                    <span className="status-pending">To do</span>
                                }
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            <div className="task-actions">
                <button 
                    id="done-button" 
                    onClick={handleDoneButtonClick}
                    className={allCompleted ? 'all-completed' : ''}
                    disabled={!allCompleted}
                >
                    <span className="button-icon">✨</span>
                    {allCompleted ? "All Tasks Complete!" : "Complete All Tasks"}
                </button>
                
                {!allCompleted && (
                    <p className="tasks-remaining">
                        Complete all tasks to prepare for optimal sleep
                    </p>
                )}
            </div>
        </div>
    );
};

export default TaskCards;