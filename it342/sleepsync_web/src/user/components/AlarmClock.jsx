import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BellRing, BellOff, Clock, Volume2, Calendar, Edit, Settings, ChevronDown, Music } from 'lucide-react';
import './AlarmClock.css';

const AlarmClock = ({ wakeTime, wakeDate, tasksCompleted }) => {
    const [alarms, setAlarms] = useState(() => {
        const savedAlarms = localStorage.getItem('sleepSyncAlarms');
        return savedAlarms ? JSON.parse(savedAlarms) : [];
    });
    const [showForm, setShowForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editingAlarmId, setEditingAlarmId] = useState(null);
    const [newAlarmTime, setNewAlarmTime] = useState(wakeTime || '07:00');
    const [newAlarmDate, setNewAlarmDate] = useState(wakeDate || new Date().toISOString().split('T')[0]);
    const [alarmLabel, setAlarmLabel] = useState('Wake Up');
    const [repeatDays, setRepeatDays] = useState([]);
    const [volume, setVolume] = useState(80);
    const [alarmDuration, setAlarmDuration] = useState(5); // Duration in minutes
    const [selectedSound, setSelectedSound] = useState('alarm-clock');
    const [activeAlarm, setActiveAlarm] = useState(null);
    const [isSnoozing, setIsSnoozing] = useState(false);
    const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
    
    // References
    const audioRef = useRef(null);
    const alarmCheckIntervalRef = useRef(null);
    const alarmDurationTimeoutRef = useRef(null);
    const prevTasksCompletedRef = useRef(false);

    // Days of the week for repeat functionality
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    // Available alarm sounds
    const alarmSounds = [
        { id: 'iphone-radar', name: 'iPhone Radar', url: '/assets/sounds/iPhone Radar AlarmRingtone Apple Sound Sound Effect for Editing.mp3' }, 
        { id: 'nokia-6280', name: 'Nokia 6280 Ringtone Sound Effect', url: '/assets/sounds/Nokia 6280 Ringtone Sound Effect.mp3' },
        { id: 'classic-alarm', name: 'Classic Alarm', url: '/assets/sounds/Classic Alarm Sound.mp3' },
        { id: 'digital-beep', name: 'Digital Beep', url: '/assets/sounds/Digital Beep Alarm.mp3' },
        { id: 'danger-alarm', name: 'Danger Alarm', url: '/assets/sounds/Danger Alarm Sound Effect.mp3' }
    ];

    // Get current alarm sound URL
    const getCurrentSoundUrl = useCallback(() => {
        const sound = alarmSounds.find(s => s.id === selectedSound);
        return sound ? sound.url : alarmSounds[0].url;
    }, [selectedSound]);

    // Initialize audio
    const initializeAudio = useCallback(() => {
        try {
            // Create new Audio object with the selected alarm sound
            audioRef.current = new Audio(getCurrentSoundUrl());
            audioRef.current.loop = true;
            audioRef.current.volume = volume / 100;
            audioRef.current.preload = "auto";
            
            // Force preload of the audio file
            audioRef.current.load();
            
            console.log("Audio system initialized successfully with selected alarm sound");
        } catch (error) {
            console.error("Error initializing audio system:", error);
        }
    }, [volume, getCurrentSoundUrl]);

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

    // Play sound with better error handling and fallback options
    const playSound = useCallback(() => {
        console.log("Attempting to play alarm sound");
        
        if (audioRef.current) {
            // Need to update the audio source if the selected sound has changed
            if (audioRef.current.src !== getCurrentSoundUrl()) {
                audioRef.current.src = getCurrentSoundUrl();
                audioRef.current.load();
            }
            
            // Reset the audio to the beginning
            audioRef.current.currentTime = 0;
            audioRef.current.volume = volume / 100;
            
            const playPromise = audioRef.current.play();
            
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        console.log("Alarm sound playing successfully");
                        
                        // Set a timeout to automatically stop the alarm after the specified duration
                        if (alarmDurationTimeoutRef.current) {
                            clearTimeout(alarmDurationTimeoutRef.current);
                        }
                        
                        const durationMs = alarmDuration * 60 * 1000;
                        alarmDurationTimeoutRef.current = setTimeout(() => {
                            console.log(`Auto-stopping alarm after ${alarmDuration} minutes`);
                            stopAlarm();
                        }, durationMs);
                    })
                    .catch(error => {
                        console.error("Error playing alarm sound:", error);
                        
                        // Try with a different approach on error
                        console.log("Trying alternative alarm sound method...");
                        
                        // Create a temporary audio element to try a different approach
                        const tempAudio = new Audio(getCurrentSoundUrl());
                        tempAudio.volume = volume / 100;
                        
                        // Try to play with user interaction simulation
                        tempAudio.play()
                            .then(() => {
                                console.log("Alternative alarm sound playing successfully");
                                // Replace original audio with this working one
                                audioRef.current = tempAudio;
                                
                                // Set auto-stop timeout
                                if (alarmDurationTimeoutRef.current) {
                                    clearTimeout(alarmDurationTimeoutRef.current);
                                }
                                
                                const durationMs = alarmDuration * 60 * 1000;
                                alarmDurationTimeoutRef.current = setTimeout(() => {
                                    console.log(`Auto-stopping alarm after ${alarmDuration} minutes`);
                                    stopAlarm();
                                }, durationMs);
                            })
                            .catch(err => {
                                console.error("Alternative method also failed:", err);
                                alert("Alarm triggered! But sound couldn't be played. Click the 'Play Alarm Sound' button to hear it.");
                            });
                    });
            }
        } else {
            // If audioRef is not initialized, try to create and play directly
            try {
                const tempAudio = new Audio(getCurrentSoundUrl());
                tempAudio.volume = volume / 100;
                tempAudio.play()
                    .then(() => {
                        audioRef.current = tempAudio;
                        console.log("Direct play alarm sound successful");
                        
                        // Set auto-stop timeout
                        if (alarmDurationTimeoutRef.current) {
                            clearTimeout(alarmDurationTimeoutRef.current);
                        }
                        
                        const durationMs = alarmDuration * 60 * 1000;
                        alarmDurationTimeoutRef.current = setTimeout(() => {
                            console.log(`Auto-stopping alarm after ${alarmDuration} minutes`);
                            stopAlarm();
                        }, durationMs);
                    })
                    .catch(err => {
                        console.error("Direct play failed:", err);
                        alert("Alarm triggered! Click the 'Play Alarm Sound' button to hear it.");
                    });
            } catch (e) {
                console.error("Critical audio error:", e);
            }
        }
    }, [volume, alarmDuration, getCurrentSoundUrl]);

    // Trigger alarm with enhanced error handling
    const triggerAlarm = useCallback((alarm) => {
        // Mark the alarm as triggered
        setAlarms(prevAlarms => prevAlarms.map(a => 
            a.id === alarm.id ? { ...a, triggered: true } : a
        ));
        
        // Set the active alarm and play sound
        setActiveAlarm(alarm);
        
        // Use the alarm's specific sound and volume if available
        if (alarm.sound) {
            setSelectedSound(alarm.sound);
        }
        
        if (alarm.volume !== undefined) {
            setVolume(alarm.volume);
        }
        
        if (alarm.duration) {
            setAlarmDuration(alarm.duration);
        }
        
        // Play sound after setting the alarm specific settings
        setTimeout(() => playSound(), 50);
        
        // Show notification if available
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('SleepSync Alarm', {
                body: alarm.label,
                icon: '/logo.png'
            });
        }
    }, [playSound]);

    // Set up form for creating a new alarm or editing an existing one
    const setupForm = useCallback((alarm = null) => {
        if (alarm) {
            // We're editing an existing alarm
            setEditMode(true);
            setEditingAlarmId(alarm.id);
            setNewAlarmTime(alarm.time);
            setNewAlarmDate(alarm.date);
            setAlarmLabel(alarm.label);
            setRepeatDays(alarm.repeatDays || []);
            setVolume(alarm.volume !== undefined ? alarm.volume : 80);
            setAlarmDuration(alarm.duration || 5);
            setSelectedSound(alarm.sound || 'alarm-clock');
        } else {
            // We're creating a new alarm
            setEditMode(false);
            setEditingAlarmId(null);
            setNewAlarmTime(wakeTime || '07:00');
            setNewAlarmDate(wakeDate || new Date().toISOString().split('T')[0]);
            setAlarmLabel('Wake Up');
            setRepeatDays([]);
            setVolume(80);
            setAlarmDuration(5);
            setSelectedSound('alarm-clock');
        }
        
        setShowForm(true);
    }, [wakeTime, wakeDate]);

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
                    sound: selectedSound,
                    volume: volume,
                    duration: alarmDuration,
                    active: true,
                    triggered: false
                };
                
                setAlarms(prevAlarms => [...prevAlarms, newAlarm]);
            }
        }
    }, [wakeTime, wakeDate, alarms, selectedSound, volume, alarmDuration]);

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
            
            if (alarmDurationTimeoutRef.current) {
                clearTimeout(alarmDurationTimeoutRef.current);
            }
            
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = '';
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
    }, [volume]);

    // Update audio src when selected sound changes
    useEffect(() => {
        if (audioRef.current && audioRef.current.src !== getCurrentSoundUrl()) {
            audioRef.current.src = getCurrentSoundUrl();
            audioRef.current.load();
        }
    }, [selectedSound, getCurrentSoundUrl]);

    // Auto-set alarm when tasks are completed
    useEffect(() => {
        if (tasksCompleted && !prevTasksCompletedRef.current) {
            setAlarmFromWakeTime();
        }
        prevTasksCompletedRef.current = tasksCompleted;
    }, [tasksCompleted, setAlarmFromWakeTime]);

    // Make alarms editable when tasks are completed
    useEffect(() => {
        if (tasksCompleted) {
            // Update alarms to include editable flag
            setAlarms(prevAlarms => prevAlarms.map(alarm => ({
                ...alarm,
                editable: true
            })));
        }
    }, [tasksCompleted]);

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
        
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        
        if (alarmDurationTimeoutRef.current) {
            clearTimeout(alarmDurationTimeoutRef.current);
            alarmDurationTimeoutRef.current = null;
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
        
        // Clear any auto-stop timeout
        if (alarmDurationTimeoutRef.current) {
            clearTimeout(alarmDurationTimeoutRef.current);
            alarmDurationTimeoutRef.current = null;
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

    // Force play alarm sound (for use with direct user interaction)
    const forcePlaySound = () => {
        // This function is called directly by user interaction, which should bypass
        // autoplay restrictions
        if (audioRef.current) {
            // Make sure we're using the current selected sound
            if (audioRef.current.src !== getCurrentSoundUrl()) {
                audioRef.current.src = getCurrentSoundUrl();
                audioRef.current.load();
            }
            
            audioRef.current.currentTime = 0;
            audioRef.current.volume = volume / 100;
            audioRef.current.play()
                .then(() => console.log("Force play successful"))
                .catch(err => console.error("Force play failed:", err));
        } else {
            // Create a new audio element on demand
            const newAudio = new Audio(getCurrentSoundUrl());
            newAudio.volume = volume / 100;
            newAudio.play()
                .then(() => {
                    audioRef.current = newAudio;
                    console.log("New audio created and playing");
                })
                .catch(err => console.error("New audio play failed:", err));
        }
    };

    // Handle add or update alarm
    const handleSaveAlarm = () => {
        if (editMode && editingAlarmId) {
            // Update existing alarm
            setAlarms(prevAlarms => prevAlarms.map(alarm => 
                alarm.id === editingAlarmId 
                    ? {
                        ...alarm,
                        time: newAlarmTime,
                        date: newAlarmDate,
                        label: alarmLabel,
                        repeatDays: [...repeatDays],
                        sound: selectedSound,
                        volume: volume,
                        duration: alarmDuration,
                        triggered: false
                    } 
                    : alarm
            ));
        } else {
            // Add new alarm
            const newAlarm = {
                id: Date.now(),
                time: newAlarmTime,
                date: newAlarmDate,
                label: alarmLabel,
                repeatDays: [...repeatDays],
                sound: selectedSound,
                volume: volume,
                duration: alarmDuration,
                editable: tasksCompleted, // Make editable if tasks are completed
                active: true,
                triggered: false
            };
            
            setAlarms(prevAlarms => [...prevAlarms, newAlarm]);
        }
        
        setShowForm(false);
        setEditMode(false);
        setEditingAlarmId(null);
        setShowAdvancedSettings(false);
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

    // Edit alarm
    const editAlarm = (alarm) => {
        setupForm(alarm);
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

    // Test sound functionality
    const testSound = () => {
        try {
            const testAudio = new Audio(alarmSounds.find(s => s.id === 'nokia-6280').url); // Default to 'nokia-6280'
            testAudio.volume = volume / 100;

            // Ensure the audio file is loaded before playing
            testAudio.addEventListener('canplaythrough', () => {
                testAudio.play()
                    .then(() => alert("Sound test successful!"))
                    .catch(err => {
                        console.error("Sound test failed during playback:", err);
                        alert("Sound test failed. Check console for details.");
                    });
            });

            testAudio.addEventListener('error', (e) => {
                console.error("Sound test failed to load audio:", e);
                alert("Sound test failed to load the audio file. Check console for details.");
            });

            testAudio.load(); // Explicitly load the audio file
        } catch (e) {
            console.error("Sound test error:", e);
            alert("Sound test error: " + e.message);
        }
    };

    return (
        <div className="alarm-clock-container">
            <div className="alarm-header">
                <h2>Alarm Clock</h2>
                <div className="alarm-actions">
                    <button className="add-alarm-btn" onClick={() => setupForm()}>
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
                    <button onClick={testSound} className="test-sound-btn">
                        <Volume2 size={20} />
                        Test Sound
                    </button>
                </div>
            </div>
            
            {showForm && (
                <div className="alarm-form">
                    <h3>{editMode ? 'Edit Alarm' : 'Add New Alarm'}</h3>
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
                    
                    <div className="advanced-settings-toggle">
                        <button 
                            className="toggle-advanced-btn"
                            type="button"
                            onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                        >
                            <Settings size={16} />
                            Advanced Settings
                            <ChevronDown size={16} className={showAdvancedSettings ? 'rotate-180' : ''} />
                        </button>
                    </div>
                    
                    {showAdvancedSettings && (
                        <div className="advanced-settings">
                            <div className="form-group">
                                <label>Alarm Sound:</label>
                                <select 
                                    value={selectedSound}
                                    onChange={(e) => setSelectedSound(e.target.value)}
                                    className="sound-selector"
                                >
                                    {alarmSounds.map(sound => (
                                        <option key={sound.id} value={sound.id}>
                                            {sound.name}
                                        </option>
                                    ))}
                                </select>
                                <button 
                                    type="button" 
                                    onClick={testSound} 
                                    className="preview-sound-btn"
                                >
                                    <Music size={16} />
                                    Preview
                                </button>
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
                                <label>Auto-Stop After (minutes):</label>
                                <select 
                                    value={alarmDuration}
                                    onChange={(e) => setAlarmDuration(parseInt(e.target.value))}
                                    className="duration-selector"
                                >
                                    <option value="1">1 minute</option>
                                    <option value="3">3 minutes</option>
                                    <option value="5">5 minutes</option>
                                    <option value="10">10 minutes</option>
                                    <option value="15">15 minutes</option>
                                    <option value="30">30 minutes</option>
                                </select>
                            </div>
                        </div>
                    )}
                    
                    <div className="form-actions">
                        <button onClick={handleSaveAlarm} className="save-btn" type="button">
                            {editMode ? 'Update Alarm' : 'Save Alarm'}
                        </button>
                        <button onClick={() => {
                            setShowForm(false);
                            setEditMode(false);
                            setEditingAlarmId(null);
                            setShowAdvancedSettings(false);
                        }} className="cancel-btn" type="button">
                            Cancel
                        </button>
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
                                {alarm.sound && (
                                    <div className="alarm-sound">
                                        <Music size={14} />
                                        {alarmSounds.find(s => s.id === alarm.sound)?.name || 'Default Sound'}
                                    </div>
                                )}
                            </div>
                            <div className="alarm-controls">
                                {(tasksCompleted || alarm.editable) && (
                                    <button
                                        className="edit-btn"
                                        onClick={() => editAlarm(alarm)}
                                        type="button"
                                    >
                                        <Edit size={20} />
                                    </button>
                                )}
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
                            
                            {activeAlarm.sound && (
                                <p className="alarm-sound-info">
                                    <Music size={16} />
                                    {alarmSounds.find(s => s.id === activeAlarm.sound)?.name || 'Default Sound'}
                                </p>
                            )}
                            
                            {/* Sound control panel */}
                            <div className="alarm-sound-controls">
                                <div className="volume-control">
                                    <label>Volume:</label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={volume}
                                        onChange={(e) => setVolume(parseInt(e.target.value))}
                                    />
                                </div>
                                
                                {/* Add direct sound button for user interaction */}
                                <button 
                                    onClick={forcePlaySound}
                                    className="play-sound-btn"
                                    type="button"
                                >
                                    Play Alarm Sound
                                </button>
                            </div>
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