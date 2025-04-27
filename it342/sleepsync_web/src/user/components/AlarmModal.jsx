import React from 'react';

const AlarmModal = ({ alarm, onStop, onSnooze }) => {
    return (
        <div className="alarm-modal">
            <div className="alarm-modal-content">
                <h2>{alarm.label}</h2>
                <p>{alarm.time}</p>
                <div className="alarm-modal-actions">
                    <button onClick={onSnooze} className="snooze-btn">Snooze</button>
                    <button onClick={onStop} className="stop-btn">Stop</button>
                </div>
            </div>
        </div>
    );
};

export default AlarmModal;
