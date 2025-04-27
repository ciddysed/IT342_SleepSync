import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BellRing, BellOff, Clock, Volume2, Calendar } from 'lucide-react';
import './AlarmClock.css';

const AlarmClock = ({ wakeTime, wakeDate, tasksCompleted }) => {
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
    
    // References
    const audioRef = useRef(null);
    const audioContextRef = useRef(null);
    const oscillatorRef = useRef(null);
    const gainNodeRef = useRef(null);
    const alarmCheckIntervalRef = useRef(null);
    const prevTasksCompletedRef = useRef(false);

    // Days of the week for repeat functionality
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    // Initialize audio systems - both HTML5 Audio and Web Audio API for fallback
    const initializeAudio = useCallback(() => {
        try {
            // Standard HTML5 Audio
            audioRef.current = new Audio('/Danger Alarm Sound Effect.mp3');
            audioRef.current.loop = true;
            audioRef.current.volume = volume / 100;
            audioRef.current.preload = "auto";
            
            // Initialize Web Audio API as fallback
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            audioContextRef.current = new AudioContext();
            
            // Create oscillator for fallback beep
            oscillatorRef.current = audioContextRef.current.createOscillator();
            oscillatorRef.current.type = 'triangle';
            oscillatorRef.current.frequency.setValueAtTime(440, audioContextRef.current.currentTime);
            
            // Create gain node for volume control
            gainNodeRef.current = audioContextRef.current.createGain();
            gainNodeRef.current.gain.setValueAtTime(0, audioContextRef.current.currentTime);
            
            // Connect the nodes
            oscillatorRef.current.connect(gainNodeRef.current);
            gainNodeRef.current.connect(audioContextRef.current.destination);
            
            // Start the oscillator (it will be silent until gain is increased)
            oscillatorRef.current.start();
            
            console.log("Audio systems initialized successfully");
        } catch (error) {
            console.error("Error initializing audio systems:", error);
        }
    }, [volume]);

    // Check alarms function with improved logging
    const checkAlarms = useCallback(() => {
        const now = new Date();
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();
        const currentDay = now.getDay() === 0 ? 6 : now.getDay() - 1; // Convert to 0-6 where 0 is Monday
        
        alarms.forEach(alarm => {
            if (alarm.active && !alarm.triggered) {
                const alarmHours = parseInt(alarm.time.split(':')[0]);
                const alarmMinutes = parseInt(alarm.time.split(':')[1]);
                const isTimeMatch = (currentHours === alarmHours && currentMinutes === alarmMinutes);
                
                // Check if the alarm date matches today's date
                const alarmDate = new Date(alarm.date);
                const isDateMatch = alarmDate.toDateString() === now.toDateString();
                
                // Check if any repeat days match today
                const isDayMatch = alarm.repeatDays.length === 0 
                    ? isDateMatch 
                    : alarm.repeatDays.includes(currentDay);
                
                if (isDayMatch && isTimeMatch) {
                    console.log("ALARM TRIGGERED:", alarm);
                    triggerAlarm(alarm);
                }
            }
        });
    }, [alarms]);

    // Play sound using multiple methods to ensure it works
    const playSound = useCallback(() => {
        console.log("Attempting to play alarm sound");
        
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.volume = volume / 100;
            
            const playPromise = audioRef.current.play();
            
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        console.log("Alarm sound playing successfully");
                    })
                    .catch(error => {
                        console.error("Error playing alarm sound:", error);
                        alert("Alarm triggered! But sound couldn't be played.");
                    });
            }
        }
    }, [volume]);

    // Trigger alarm with enhanced error handling
    const triggerAlarm = useCallback((alarm) => {
        // Mark the alarm as triggered
        setAlarms(prevAlarms => prevAlarms.map(a => 
            a.id === alarm.id ? { ...a, triggered: true } : a
        ));
        
        // Set the active alarm and play sound
        setActiveAlarm(alarm);
        playSound();
        
        // Show notification if available
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('SleepSync Alarm', {
                body: alarm.label,
                icon: '/logo.png'
            });
        }
    }, [playSound]);

    // Automatically set an alarm from wake time
    const setAlarmFromWakeTime = useCallback(() => {
        if (wakeTime && wakeDate) {
            console.log("Setting alarm from wake time:", wakeTime, wakeDate);
            
            // Check if the same alarm already exists to avoid duplicates
            const alarmExists = alarms.some(alarm => 
                alarm.time === wakeTime && 
                alarm.date === wakeDate && 
                alarm.label === 'Based on your sleep schedule'
            );
            
            if (!alarmExists) {
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
        }
    }, [wakeTime, wakeDate, alarms]);

    // Component mounting and cleanup
    useEffect(() => {
        // Initialize audio systems
        initializeAudio();
        
        // Check for alarms every 10 seconds
        alarmCheckIntervalRef.current = setInterval(checkAlarms, 10000);
        
        // Check alarms immediately on component mount
        checkAlarms();
        
        // Clean up on component unmount
        return () => {
            clearInterval(alarmCheckIntervalRef.current);
            
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = '';
            }
            
            // Clean up Web Audio API resources
            if (oscillatorRef.current && oscillatorRef.current.stop) {
                try {
                    oscillatorRef.current.stop();
                } catch (e) {
                    console.log("Oscillator already stopped");
                }
            }
            
            if (audioContextRef.current && audioContextRef.current.close) {
                audioContextRef.current.close();
            }
        };
    }, [checkAlarms, initializeAudio]);

    // Save alarms to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('sleepSyncAlarms', JSON.stringify(alarms));
    }, [alarms]);

    // Update volume when it changes
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume / 100;
        }
        
        if (gainNodeRef.current && audioContextRef.current) {
            gainNodeRef.current.gain.setValueAtTime(
                activeAlarm ? volume / 100 : 0, 
                audioContextRef.current.currentTime
            );
        }
    }, [volume, activeAlarm]);

    // Auto-set alarm when tasks are completed
    useEffect(() => {
        if (tasksCompleted && !prevTasksCompletedRef.current) {
            setAlarmFromWakeTime();
        }
        prevTasksCompletedRef.current = tasksCompleted;
    }, [tasksCompleted, setAlarmFromWakeTime]);

    // Reset triggered flag at midnight for repeating alarms
    useEffect(() => {
        const midnightReset = () => {
            const now = new Date();
            const midnight = new Date(now);
            midnight.setHours(24, 0, 0, 0);
            const timeUntilMidnight = midnight - now;

            const resetTriggeredStatus = () => {
                setAlarms(prevAlarms => prevAlarms.map(alarm => {
                    // Only reset triggered status for repeating alarms
                    if (alarm.repeatDays.length > 0) {
                        return { ...alarm, triggered: false };
                    }
                    return alarm;
                }));
            };

            const midnightTimer = setTimeout(resetTriggeredStatus, timeUntilMidnight);
            return () => clearTimeout(midnightTimer);
        };

        const resetTimer = midnightReset();
        return () => resetTimer();
    }, []);

    // Stop alarm and clean up audio
    const stopAlarm = () => {
        console.log("Stopping all alarm sounds");
        
        // Stop regular audio
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        
        // Stop Web Audio API sound
        if (gainNodeRef.current && audioContextRef.current) {
            gainNodeRef.current.gain.cancelScheduledValues(audioContextRef.current.currentTime);
            gainNodeRef.current.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + 0.1);
        }
        
        setActiveAlarm(null);
        setIsSnoozing(false);
    };

    // Snooze alarm functionality
    const snoozeAlarm = () => {
        // Stop sounds temporarily
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        
        if (gainNodeRef.current && audioContextRef.current) {
            gainNodeRef.current.gain.cancelScheduledValues(audioContextRef.current.currentTime);
            gainNodeRef.current.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + 0.1);
        }
        
        setIsSnoozing(true);
        
        // Set a 5-minute snooze
        setTimeout(() => {
            if (isSnoozing && activeAlarm) {
                playSound();
                setIsSnoozing(false);
            }
        }, 5 * 60 * 1000);
    };

    // Handle add alarm
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

    // Toggle alarm active state
    const toggleAlarm = (id) => {
        setAlarms(prevAlarms => prevAlarms.map(alarm => 
            alarm.id === id ? { ...alarm, active: !alarm.active, triggered: false } : alarm
        ));
    };

    // Delete alarm
    const deleteAlarm = (id) => {
        setAlarms(prevAlarms => prevAlarms.filter(alarm => alarm.id !== id));
    };

    // Toggle repeat day
    const toggleRepeatDay = (day) => {
        setRepeatDays(prevDays => 
            prevDays.includes(day) 
                ? prevDays.filter(d => d !== day) 
                : [...prevDays, day]
        );
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
                    <button className="wake-alarm-btn" onClick={setAlarmFromWakeTime}>
                        <Clock size={20} />
                        Set Alarm from Wake Time
                    </button>
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
                                    type="button"
                                >
                                    {day}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="form-actions">
                        <button onClick={handleAddAlarm} className="save-btn" type="button">Save Alarm</button>
                        <button onClick={() => setShowForm(false)} className="cancel-btn" type="button">Cancel</button>
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
                                    type="button"
                                >
                                    {alarm.active ? <BellRing size={20} /> : <BellOff size={20} />}
                                </button>
                                <button className="delete-btn" onClick={() => deleteAlarm(alarm.id)} type="button">
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
                            
                            {/* Add direct sound button for user interaction */}
                            <button 
                                onClick={playSound}
                                className="play-sound-btn"
                                style={{
                                    margin: '15px 0',
                                    padding: '10px 15px',
                                    background: '#e74c3c',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    fontSize: '16px'
                                }}
                                type="button"
                            >
                                Play Alarm Sound
                            </button>
                        </div>
                        <div className="alarm-modal-actions">
                            <button onClick={snoozeAlarm} className="snooze-btn" type="button">
                                Snooze (5 min)
                            </button>
                            <button onClick={stopAlarm} className="stop-btn" type="button">
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