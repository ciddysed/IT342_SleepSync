import { useEffect, useState } from "react";

const SmartAlarm = () => {
    const [time, setTime] = useState(new Date());
    const [alarmTime, setAlarmTime] = useState("");
    const [alarmSet, setAlarmSet] = useState(false);

    useEffect(() => {
        const timerId = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timerId);
    }, []);

    useEffect(() => {
        if (alarmSet && time.toLocaleTimeString() === alarmTime) {
            playAlarm();
        }
    }, [time, alarmTime, alarmSet]);

    const setAlarm = (e) => {
        e.preventDefault();
        const alarm = `${e.target.hours.value}:${e.target.minutes.value}:00 ${e.target.period.value}`;
        setAlarmTime(alarm);
        setAlarmSet(true);
    };

    const playAlarm = () => {
        const audio = new Audio('/Danger Alarm Sound Effect.mp3');
        audio.play();
        setAlarmSet(true);
    };

    return (
        <div className="alarm-clock">
            <h1>Smart Alarm</h1>
            <p>Set your wake-up time and let the smart alarm help you wake up refreshed.</p>
            <form onSubmit={setAlarm}>
                <input type="number" name="hours" placeholder="HH" min="1" max="12" required />
                <input type="number" name="minutes" placeholder="MM" min="0" max="59" required />
                <select name="period">
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                </select>
                <button type="submit">Set Alarm</button>
            </form>
            {alarmSet ? <h2>Alarm set for: {alarmTime}</h2> : <h2>...</h2>}
        </div>
    );
};

export default SmartAlarm;
