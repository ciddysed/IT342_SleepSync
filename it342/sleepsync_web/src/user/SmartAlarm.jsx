import React, { useState } from 'react';
import AlarmClock from './components/AlarmClock';

const SmartAlarm = () => {
    const [wakeTime, setWakeTime] = useState('07:00');
    const [wakeDate, setWakeDate] = useState(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    });

    return (
        <div className="smart-alarm-container">
            <h1>Smart Alarm</h1>
            <p>Set your wake-up time and let the smart alarm help you wake up refreshed.</p>
            <AlarmClock wakeTime={wakeTime} wakeDate={wakeDate} />
        </div>
    );
};

export default SmartAlarm;
