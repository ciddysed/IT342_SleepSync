export const initializeAudio = (audioRef, volume) => {
    audioRef.current = new Audio('/Danger Alarm Sound Effect.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = volume / 100;
};

export const checkAlarms = (alarms, setAlarms, triggerAlarm, setActiveAlarm, audioRef) => {
    const now = new Date();
    alarms.forEach(alarm => {
        if (alarm.active && !alarm.triggered) {
            const [hours, minutes] = alarm.time.split(':').map(Number);
            if (now.getHours() === hours && now.getMinutes() === minutes) {
                triggerAlarm(alarm, setAlarms, setActiveAlarm, audioRef);
            }
        }
    });
};

export const triggerAlarm = (alarm, setAlarms, setActiveAlarm, audioRef) => {
    setAlarms(prev => prev.map(a => (a.id === alarm.id ? { ...a, triggered: true } : a)));
    setActiveAlarm(alarm);
    audioRef.current.play();
};
