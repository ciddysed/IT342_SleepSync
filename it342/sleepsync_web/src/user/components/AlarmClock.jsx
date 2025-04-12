import React, { useState, useEffect, useRef } from 'react';
import { BellRing, BellOff, Clock, Volume2, Calendar } from 'lucide-react';
import './AlarmClock.css';

const AlarmClock = ({ wakeTime, wakeDate }) => {
    const [alarms, setAlarms] = useState(() => {
        const savedAlarms = localStorage.getItem('sleepSyncAlarms');
        return savedAlarms ? JSON.parse(savedAlarms) : [];
    });
    const [showForm, setShowForm] = useState(false);
    const [newAlarmTime, setNewAlarmTime] = useState(wakeTime || '07:00');
    const [newAlarmDate, setNewAlarmDate] = useState(wakeDate || new Date().toISOString().split('T')[0]);
    const [alarmLabel, setAlarmLabel] = useState('Wake Up');
    const [repeatDays, setRepeatDays] = useState([]);
    const [volume, setVolume] = useState(80);
    const [activeAlarm, setActiveAlarm] = useState(null);
    const [isSnoozing, setIsSnoozing] = useState(false);
    const audioRef = useRef(null);
    const alarmCheckIntervalRef = useRef(null);

    // Days of the week for repeat functionality
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    useEffect(() => {
        // Initialize audio element
        audioRef.current = new Audio('/alarm-sound.mp3');
        audioRef.current.loop = true;

        // Check for alarms every minute
        alarmCheckIntervalRef.current = setInterval(checkAlarms, 60000);

        // Clean up on component unmount
        return () => {
            clearInterval(alarmCheckIntervalRef.current);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = '';
            }
        };
    }, []);

    useEffect(() => {
        // Save alarms to localStorage whenever they change
        localStorage.setItem('sleepSyncAlarms', JSON.stringify(alarms));
    }, [alarms]);

    useEffect(() => {
        // Set volume when it changes
        if (audioRef.current) {
            audioRef.current.volume = volume / 100;
        }
    }, [volume]);

    // Check if any alarms should be triggered
    const checkAlarms = () => {
        const now = new Date();
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();
        const currentDay = now.getDay() === 0 ? 6 : now.getDay() - 1; // Convert to 0-6 where 0 is Monday
        const currentTimeStr = `${String(currentHours).padStart(2, '0')}:${String(currentMinutes).padStart(2, '0')}`;
        
        alarms.forEach(alarm => {
            if (alarm.active) {
                const isToday = new Date(alarm.date).toDateString() === now.toDateString();
                const isDayMatch = alarm.repeatDays.length === 0 ? isToday : alarm.repeatDays.includes(currentDay);
                
                if (isDayMatch && alarm.time === currentTimeStr && !alarm.triggered) {
                    triggerAlarm(alarm);
                }
            }
        });
    };

    const triggerAlarm = (alarm) => {
        // Mark the alarm as triggered
        setAlarms(prevAlarms => prevAlarms.map(a => 
            a.id === alarm.id ? { ...a, triggered: true } : a
        ));
        
        // Set the active alarm and play sound
        setActiveAlarm(alarm);
        if (audioRef.current) {
            audioRef.current.play();
        }
        
        // Show notification if available
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('SleepSync Alarm', {
                body: alarm.label,
                icon: '/logo.png'
            });
        }
    };

    const stopAlarm = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        
        setActiveAlarm(null);
        setIsSnoozing(false);
    };

    const snoozeAlarm = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        
        setIsSnoozing(true);
        
        // Set a 5-minute snooze
        setTimeout(() => {
            if (isSnoozing && activeAlarm) {
                if (audioRef.current) {
                    audioRef.current.play();
                }
                setIsSnoozing(false);
            }
        }, 5 * 60 * 1000);
    };

    const handleAddAlarm = () => {
        const newAlarm = {
            id: Date.now(),
            time: newAlarmTime,
            date: newAlarmDate,
            label: alarmLabel,
            repeatDays: [...repeatDays],
            active: true,
            triggered: false
        };
        
        setAlarms(prevAlarms => [...prevAlarms, newAlarm]);
        setShowForm(false);
        
        // Reset form fields
        setNewAlarmTime(wakeTime || '07:00');
        setNewAlarmDate(wakeDate || new Date().toISOString().split('T')[0]);
        setAlarmLabel('Wake Up');
        setRepeatDays([]);
    };

    const toggleAlarm = (id) => {
        setAlarms(prevAlarms => prevAlarms.map(alarm => 
            alarm.id === id ? { ...alarm, active: !alarm.active, triggered: false } : alarm
        ));
    };

    const deleteAlarm = (id) => {
        setAlarms(prevAlarms => prevAlarms.filter(alarm => alarm.id !== id));
    };

    const toggleRepeatDay = (day) => {
        setRepeatDays(prevDays => 
            prevDays.includes(day) 
                ? prevDays.filter(d => d !== day) 
                : [...prevDays, day]
        );
    };

    // Automatically set an alarm from wake time
    const setAlarmFromWakeTime = () => {
        if (wakeTime && wakeDate) {
            const newAlarm = {
                id: Date.now(),
                time: wakeTime,
                date: wakeDate,
                label: 'Based on your sleep schedule',
                repeatDays: [],
                active: true,
                triggered: false
            };
            
            setAlarms(prevAlarms => [...prevAlarms, newAlarm]);
        }
    };

    // Function to request notification permission
    const requestNotificationPermission = () => {
        if ('Notification' in window) {
            Notification.requestPermission();
        }
    };

    return (
        <div className="alarm-clock-container">
            <div className="alarm-header">
                <h2>Alarm Clock</h2>
                <div className="alarm-actions">
                    <button className="add-alarm-btn" onClick={() => setShowForm(true)}>
                        <BellRing size={20} />
                        Add Alarm
                    </button>
                    {wakeTime && wakeDate && (
                        <button className="wake-alarm-btn" onClick={setAlarmFromWakeTime}>
                            <Clock size={20} />
                            Set Alarm from Wake Time
                        </button>
                    )}
                    <button onClick={requestNotificationPermission} className="notification-btn">
                        Enable Notifications
                    </button>
                </div>
            </div>
            
            {showForm && (
                <div className="alarm-form">
                    <h3>Add New Alarm</h3>
                    <div className="form-group">
                        <label>Time:</label>
                        <input
                            type="time"
                            value={newAlarmTime}
                            onChange={(e) => setNewAlarmTime(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Date:</label>
                        <input
                            type="date"
                            value={newAlarmDate}
                            onChange={(e) => setNewAlarmDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Label:</label>
                        <input
                            type="text"
                            value={alarmLabel}
                            onChange={(e) => setAlarmLabel(e.target.value)}
                            maxLength={20}
                            placeholder="Alarm label"
                        />
                    </div>
                    <div className="form-group">
                        <label>Volume:</label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={volume}
                            onChange={(e) => setVolume(parseInt(e.target.value))}
                        />
                        <span>{volume}%</span>
                    </div>
                    <div className="form-group">
                        <label>Repeat:</label>
                        <div className="day-selector">
                            {daysOfWeek.map((day, index) => (
                                <button
                                    key={day}
                                    className={`day-btn ${repeatDays.includes(index) ? 'active' : ''}`}
                                    onClick={() => toggleRepeatDay(index)}
                                >
                                    {day}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="form-actions">
                        <button onClick={handleAddAlarm} className="save-btn">Save Alarm</button>
                        <button onClick={() => setShowForm(false)} className="cancel-btn">Cancel</button>
                    </div>
                </div>
            )}
            
            <div className="alarms-list">
                {alarms.length === 0 ? (
                    <p className="no-alarms">No alarms set. Add an alarm to get started.</p>
                ) : (
                    alarms.map(alarm => (
                        <div key={alarm.id} className={`alarm-item ${alarm.active ? 'active' : 'inactive'}`}>
                            <div className="alarm-info">
                                <div className="alarm-time-date">
                                    <span className="alarm-time">{alarm.time}</span>
                                    <span className="alarm-date">
                                        <Calendar size={16} />
                                        {alarm.repeatDays.length > 0 
                                            ? alarm.repeatDays.map(day => daysOfWeek[day]).join(', ')
                                            : new Date(alarm.date).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="alarm-label">{alarm.label}</div>
                            </div>
                            <div className="alarm-controls">
                                <button 
                                    className={`toggle-btn ${alarm.active ? 'active' : ''}`} 
                                    onClick={() => toggleAlarm(alarm.id)}
                                >
                                    {alarm.active ? <BellRing size={20} /> : <BellOff size={20} />}
                                </button>
                                <button className="delete-btn" onClick={() => deleteAlarm(alarm.id)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
            
            {activeAlarm && (
                <div className="alarm-modal">
                    <div className="alarm-modal-content">
                        <div className="alarm-ringing">
                            <div className="ringing-icon">
                                <Volume2 size={48} className="pulsating" />
                            </div>
                            <h2>{activeAlarm.label}</h2>
                            <p className="alarm-time-large">{activeAlarm.time}</p>
                        </div>
                        <div className="alarm-modal-actions">
                            <button onClick={snoozeAlarm} className="snooze-btn">
                                Snooze (5 min)
                            </button>
                            <button onClick={stopAlarm} className="stop-btn">
                                Stop
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AlarmClock;