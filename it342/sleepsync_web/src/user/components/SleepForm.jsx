// SleepForm.jsx
import React from 'react';

const SleepForm = ({
    sleepDate,
    setSleepDate,
    sleepTime,
    setSleepTime,
    wakeDate,
    setWakeDate,
    wakeTime,
    setWakeTime,
    handleSleepFormSubmit
}) => {
    return (
        <form id="sleep-form" onSubmit={handleSleepFormSubmit}>
            <div className="form-column">
                <h3>When did you fall asleep?</h3>
                <div className="form-group">
                    <label htmlFor="sleep-date">Sleep Date</label>
                    <input
                        type="date"
                        id="sleep-date"
                        value={sleepDate}
                        onChange={(e) => setSleepDate(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="sleep-time">Sleep Time</label>
                    <input
                        type="time"
                        id="sleep-time"
                        value={sleepTime}
                        onChange={(e) => setSleepTime(e.target.value)}
                        required
                    />
                </div>
            </div>
            
            <div className="form-column">
                <h3>When did you wake up?</h3>
                <div className="form-group">
                    <label htmlFor="wake-date">Wake Date</label>
                    <input
                        type="date"
                        id="wake-date"
                        value={wakeDate}
                        onChange={(e) => setWakeDate(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="wake-time">Wake Time</label>
                    <input
                        type="time"
                        id="wake-time"
                        value={wakeTime}
                        onChange={(e) => setWakeTime(e.target.value)}
                        required
                    />
                </div>
            </div>
            
            <div className="form-actions">
                <button type="submit" id="save-button">
                    <span className="button-icon">📝</span>
                    Record Sleep
                </button>
            </div>
        </form>
    );
};

export default SleepForm;

