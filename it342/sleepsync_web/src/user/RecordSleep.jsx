import React, { useState, useEffect } from 'react';
import { Chart } from 'chart.js/auto';

const RecordSleep = () => {
    const [sleepDurations, setSleepDurations] = useState([]);
    const [dates, setDates] = useState([]);
    const [sleepTimes, setSleepTimes] = useState([]);
    const [wakeTimes, setWakeTimes] = useState([]);
    const [sleepChart, setSleepChart] = useState(null);
    const [sleepLineChart, setSleepLineChart] = useState(null);
    const [sleepAreaChart, setSleepAreaChart] = useState(null);
    const [sleepDate, setSleepDate] = useState('');
    const [sleepTime, setSleepTime] = useState('');
    const [wakeTime, setWakeTime] = useState('');
    const [taskCards, setTaskCards] = useState('');
    const [showDoneButton, setShowDoneButton] = useState(false);
    const [showFireworks, setShowFireworks] = useState(false);
    const [allTasksChecked, setAllTasksChecked] = useState(false);

    const prompts = [
        "Great job! Keep tracking your sleep.",
        "Sleep data saved! You're doing awesome.",
        "Another night recorded! Keep it up.",
        "Well done! Your sleep data is valuable.",
        "Sleep time recorded! Stay consistent.",
        "Good work! Tracking sleep helps improve it.",
        "Sleep data saved! Keep monitoring your patterns."
    ];

    useEffect(() => {
        if (taskCards) {
            initializeTaskCardListeners();
        }
    }, [taskCards]);

    const handleSleepFormSubmit = (event) => {
        event.preventDefault();
        const sleepDateTime = new Date(`${sleepDate}T${sleepTime}:00`);
        const wakeDateTime = new Date(`${sleepDate}T${wakeTime}:00`);
        if (wakeDateTime < sleepDateTime) {
            wakeDateTime.setDate(wakeDateTime.getDate() + 1);
        }
        const sleepDuration = (wakeDateTime - sleepDateTime) / (1000 * 60 * 60);

        fetch("http://localhost:8080/sleep-tracks/record_sleep_time", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sleep_time: sleepTime,
                wake_time: wakeTime,
                date: sleepDate,
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                setTaskCards(data.task_cards);
                setShowDoneButton(true);
                setSleepDate('');
                setSleepTime('');
                setWakeTime('');
            } else {
                alert('Failed to record sleep time.');
            }
        })
        .catch(error => {
            console.error("Error during POST request:", error);
            alert("An error occurred while recording sleep time. Please try again.");
        });
    };

    const handleDoneButtonClick = () => {
        const checkboxes = document.querySelectorAll('.task-card input[type="checkbox"]');
        const allChecked = Array.from(checkboxes).every(cb => cb.checked);
        if (allChecked) {
            setShowFireworks(true);
            setTimeout(() => {
                setShowFireworks(false);
                setTaskCards('');
                setShowDoneButton(false);
            }, 3000);
        } else {
            alert("Please complete all tasks before proceeding.");
        }
    };

    const handleTrackProgressButtonClick = () => {
        showModal();
    };

    const showModal = () => {
        const modal = document.getElementById('sleepModal');
        modal.style.display = 'flex';

        const closeModal = () => {
            modal.style.display = 'none';
        };

        document.querySelector('.close').addEventListener('click', closeModal);
        window.onclick = (event) => {
            if (event.target === modal) {
                closeModal();
            }
        };

        if (sleepChart) {
            sleepChart.destroy();
        }
        if (sleepLineChart) {
            sleepLineChart.destroy();
        }
        if (sleepAreaChart) {
            sleepAreaChart.destroy();
        }

        const ctxBar = document.getElementById('sleepChart').getContext('2d');
        setSleepChart(new Chart(ctxBar, {
            type: 'bar',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Sleep Duration (hours)',
                    data: sleepDurations,
                    backgroundColor: 'rgba(107, 78, 113, 0.6)',
                    borderColor: 'rgba(107, 78, 113, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        }));

        const ctxLine = document.getElementById('sleepLineChart').getContext('2d');
        setSleepLineChart(new Chart(ctxLine, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Sleep Duration (hours)',
                    data: sleepDurations,
                    backgroundColor: 'rgba(107, 78, 113, 0.2)',
                    borderColor: 'rgba(107, 78, 113, 1)',
                    borderWidth: 1,
                    fill: true
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        }));

        const ctxArea = document.getElementById('sleepAreaChart').getContext('2d');
        setSleepAreaChart(new Chart(ctxArea, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Sleep Duration (hours)',
                    data: sleepDurations,
                    backgroundColor: 'rgba(107, 78, 113, 0.4)',
                    borderColor: 'rgba(107, 78, 113, 1)',
                    borderWidth: 1,
                    fill: true
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        }));

        updateReports();
    };

    const updateReports = () => {
        const avgSleepDuration = (sleepDurations.reduce((a, b) => a + b, 0) / sleepDurations.length).toFixed(2);
        const avgSleepTime = calculateAverageTime(sleepTimes);
        const avgWakeTime = calculateAverageTime(wakeTimes);

        document.getElementById('avgSleepDuration').innerText = avgSleepDuration;
        document.getElementById('avgSleepTime').innerText = avgSleepTime;
        document.getElementById('avgWakeTime').innerText = avgWakeTime;
    };

    const calculateAverageTime = (times) => {
        const totalMinutes = times.reduce((total, time) => {
            const [hours, minutes] = time.split(':').map(Number);
            return total + hours * 60 + minutes;
        }, 0);
        const avgMinutes = totalMinutes / times.length;
        const avgHours = Math.floor(avgMinutes / 60);
        const avgMins = Math.round(avgMinutes % 60);
        return `${String(avgHours).padStart(2, '0')}:${String(avgMins).padStart(2, '0')}`;
    };

    const initializeTaskCardListeners = () => {
        const checkboxes = document.querySelectorAll('.task-card input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const checked = Array.from(checkboxes).every(cb => cb.checked);
                setAllTasksChecked(checked);
            });
        });
    };

    return (
        <>
            <nav className="nav-bar">
                <div className="nav-content">
                    <a href="/landing_page" className="nav-logo">
                        <svg viewBox="0 0 24 24">
                            <path d="M19 7h-8v8H3V7H1v10h2v3c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-3h2V7h-2zM7 19h10v-6H7v6z"/>
                        </svg>
                        <span>SleepSync</span>
                    </a>
                </div>
            </nav>

            <div className="stars"></div>
            <div className="moon"></div>

            <div className="main-content">
                <div className="container">
                    <div className="header-section">
                        <h1>Record Your Sleep</h1>
                        <button id="track-progress-button" onClick={handleTrackProgressButtonClick}>Track Sleep Progress</button>
                    </div>
                    <form id="sleep-form" onSubmit={handleSleepFormSubmit}>
                        <label htmlFor="date">Date</label>
                        <input type="date" id="date" name="date" value={sleepDate} onChange={(e) => setSleepDate(e.target.value)} required />

                        <label htmlFor="sleep_time">Sleep Time</label>
                        <input type="time" id="sleep_time" name="sleep_time" value={sleepTime} onChange={(e) => setSleepTime(e.target.value)} required />

                        <label htmlFor="wake_time">Wake Time</label>
                        <input type="time" id="wake_time" name="wake_time" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} required />

                        <button type="submit" id="save-button">Save</button>
                    </form>
                    <div id="task-cards-container" dangerouslySetInnerHTML={{ __html: taskCards }} />
                    {showDoneButton && <button id="done-button" onClick={handleDoneButtonClick}>Mark Tasks as Done</button>}
                </div>
            </div>

            <div id="sleepModal" className="modal">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2>Sleep Analysis Dashboard</h2>
                        <span className="close">&times;</span>
                    </div>

                    <div className="charts-grid">
                        <div className="chart-card">
                            <h3>Sleep Duration Over Time</h3>
                            <canvas id="sleepChart"></canvas>
                        </div>

                        <div className="chart-card">
                            <h3>Sleep Duration Trend</h3>
                            <canvas id="sleepLineChart"></canvas>
                        </div>

                        <div className="chart-card">
                            <h3>Sleep Pattern Overview</h3>
                            <canvas id="sleepAreaChart"></canvas>
                        </div>
                    </div>

                    <div className="report-section">
                        <h3>Sleep Analysis Report</h3>
                        <div className="report-grid">
                            <div className="report-item">
                                <span className="report-label">Average Sleep Duration</span>
                                <span className="report-value"><span id="avgSleepDuration"></span> hours</span>
                            </div>
                            <div className="report-item">
                                <span className="report-label">Average Sleep Time</span>
                                <span className="report-value"><span id="avgSleepTime"></span></span>
                            </div>
                            <div className="report-item">
                                <span className="report-label">Average Wake Time</span>
                                <span className="report-value"><span id="avgWakeTime"></span></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showFireworks && (
                <div id="fireworks-container" className="fireworks-container">
                    <div className="firework"></div>
                    <div className="firework"></div>
                    <div className="firework"></div>
                    <div className="firework"></div>
                    <div className="firework"></div>
                    <div className="congratulations-message">Congratulations! You have completed all the activities for the day!</div>
                </div>
            )}
        </>
    );
};

export default RecordSleep;
