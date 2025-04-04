import React, { useState, useEffect } from 'react';
import { Chart } from 'chart.js/auto';
import './RecordSleep.css';

const sleepCategories = [
    {
        range: "Less than 4 hours",
        pros: "None",
        cons: "Severe fatigue, impaired judgment",
        healthIssues: "Increased risk of heart disease, diabetes",
        cognitiveEffects: "Poor memory, reduced focus",
        productivityImpact: "Low efficiency, high burnout risk",
        recommendedFor: "Not recommended for anyone",
    },
    {
        range: "4–6 hours",
        pros: "Short-term productivity boost",
        cons: "Chronic sleep debt, stress",
        healthIssues: "Weakened immune system, weight gain",
        cognitiveEffects: "Slower reaction times, poor decision-making",
        productivityImpact: "Unsustainable over time",
        recommendedFor: "Emergency workers, short-term deadlines",
    },
    {
        range: "7–9 hours",
        pros: "Optimal energy, improved mood",
        cons: "None for most people",
        healthIssues: "Reduced risk of chronic diseases",
        cognitiveEffects: "Enhanced memory and focus",
        productivityImpact: "High efficiency, balanced workload",
        recommendedFor: "Students, professionals, athletes",
    },
    {
        range: "More than 9 hours",
        pros: "Recovery for sleep-deprived individuals",
        cons: "Grogginess, potential oversleeping effects",
        healthIssues: "Linked to depression, obesity",
        cognitiveEffects: "Diminished alertness",
        productivityImpact: "Reduced daytime activity",
        recommendedFor: "Recovering from illness or extreme fatigue",
    },
];

const getSleepCategory = (duration) => {
    if (duration < 4) return sleepCategories[0];
    if (duration >= 4 && duration < 7) return sleepCategories[1];
    if (duration >= 7 && duration <= 9) return sleepCategories[2];
    if (duration > 9) return sleepCategories[3];
    return null;
};

const SleepInsights = ({ duration }) => {
    const category = getSleepCategory(duration);

    if (!category) return null;

    return (
        <div className="mt-6">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Sleep Insights</h2>
            <div className="flex flex-wrap justify-center gap-6">
                <div className="box bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg w-48 h-48 flex flex-col justify-center items-center rounded-lg border border-gray-700">
                    <h3 className="font-semibold text-green-400 mb-2">Pros</h3>
                    <p className="text-gray-300 text-center">{category.pros}</p>
                </div>
                <div className="box bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg w-48 h-48 flex flex-col justify-center items-center rounded-lg border border-gray-700">
                    <h3 className="font-semibold text-red-400 mb-2">Cons</h3>
                    <p className="text-gray-300 text-center">{category.cons}</p>
                </div>
                <div className="box bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg w-48 h-48 flex flex-col justify-center items-center rounded-lg border border-gray-700">
                    <h3 className="font-semibold text-gray-400 mb-2">Health Issues</h3>
                    <p className="text-gray-300 text-center">{category.healthIssues}</p>
                </div>
                <div className="box bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg w-48 h-48 flex flex-col justify-center items-center rounded-lg border border-gray-700">
                    <h3 className="font-semibold text-gray-400 mb-2">Cognitive Effects</h3>
                    <p className="text-gray-300 text-center">{category.cognitiveEffects}</p>
                </div>
                <div className="box bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg w-48 h-48 flex flex-col justify-center items-center rounded-lg border border-gray-700">
                    <h3 className="font-semibold text-gray-400 mb-2">Productivity Impact</h3>
                    <p className="text-gray-300 text-center">{category.productivityImpact}</p>
                </div>
                <div className="box bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg w-48 h-48 flex flex-col justify-center items-center rounded-lg border border-gray-700">
                    <h3 className="font-semibold text-gray-400 mb-2">Recommended For</h3>
                    <p className="text-gray-300 text-center">{category.recommendedFor}</p>
                </div>
            </div>
        </div>
    );
};

const RecordSleep = () => {
    const [sleepChart, setSleepChart] = useState(null);
    const [sleepLineChart, setSleepLineChart] = useState(null);
    const [sleepAreaChart, setSleepAreaChart] = useState(null);
    const [sleepDate, setSleepDate] = useState('');
    const [sleepTime, setSleepTime] = useState('');
    const [wakeTime, setWakeTime] = useState('');
    const [wakeDate, setWakeDate] = useState('');
    const [taskCards, setTaskCards] = useState('');
    const [showDoneButton, setShowDoneButton] = useState(false);
    const [showFireworks, setShowFireworks] = useState(false);
    const [sleepRecords, setSleepRecords] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('durationOverTime');
    const [showSleepChart, setShowSleepChart] = useState(false); // New state to control chart visibility
    const [sleepDuration, setSleepDuration] = useState(null); // Track sleep duration
    const [showInsights, setShowInsights] = useState(false); // Control insights visibility

    useEffect(() => {
        if (taskCards) {
            initializeTaskCardListeners();
        }
    }, [taskCards]);

    useEffect(() => {
        if (isModalOpen) {
            const closeButton = document.querySelector('.close');
            const modal = document.getElementById('sleepModal');

            const handleClickOutside = (event) => {
                if (event.target === modal) {
                    closeModal();
                }
            };

            closeButton.addEventListener('click', closeModal);
            window.addEventListener('click', handleClickOutside);

            return () => {
                closeButton.removeEventListener('click', closeModal);
                window.removeEventListener('click', handleClickOutside);
            };
        }
    }, [isModalOpen]);

    useEffect(() => {
        if (sleepDate && sleepTime && wakeDate && wakeTime) {
            const sleepDateTime = new Date(`${sleepDate}T${sleepTime}:00`);
            let wakeDateTime = new Date(`${wakeDate}T${wakeTime}:00`);

            if (wakeDateTime <= sleepDateTime) {
                wakeDateTime.setDate(wakeDateTime.getDate() + 1);
            }

            const duration = (wakeDateTime - sleepDateTime) / (1000 * 60 * 60);
            if (duration >= 0) {
                setSleepDuration(duration); // Update sleep duration
            } else {
                alert("Wake date and time must be after sleep date and time.");
                setWakeDate('');
                setWakeTime('');
            }
        }
    }, [sleepDate, sleepTime, wakeDate, wakeTime]);

    const handleSleepFormSubmit = async (event) => {
        event.preventDefault();

        const sleepDateTime = new Date(`${sleepDate}T${sleepTime}:00`);
        let wakeDateTime = new Date(`${wakeDate}T${wakeTime}:00`);

        if (wakeDateTime <= sleepDateTime) {
            wakeDateTime.setDate(wakeDateTime.getDate() + 1);
        }

        const duration = (wakeDateTime - sleepDateTime) / (1000 * 60 * 60);

        const userId = localStorage.getItem("userId");
        if (!userId) {
            alert("User not logged in. Please log in to record sleep.");
            return;
        }

        const sleepTrackData = {
            sleep_time: sleepTime,
            wake_time: wakeTime,
            date: sleepDate,
            wake_date: wakeDate,
            sleep_duration: duration,
        };

        try {
            const response = await fetch(`http://localhost:8080/sleep-tracks/record_sleep_time/${userId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(sleepTrackData),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.status === "success") {
                    setTaskCards(data.task_cards);
                    setShowDoneButton(true);
                    setSleepDate('');
                    setSleepTime('');
                    setWakeTime('');
                    setWakeDate('');
                    setSleepDuration(duration); // Update sleep duration
                    setShowInsights(true); // Show insights after saving
                    setShowSleepChart(true); // Show the chart after saving a record
                } else {
                    alert("Failed to record sleep time.");
                }
            } else {
                console.error("Failed to record sleep time. Status:", response.status);
                alert("An error occurred while recording sleep time. Please try again.");
            }
        } catch (error) {
            console.error("Error recording sleep time:", error);
            alert("An error occurred while recording sleep time. Please try again.");
        }
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

    const handleTrackProgressButtonClick = async () => {
        try {
            const userId = localStorage.getItem("userId");
            if (!userId) {
                alert("User not logged in. Please log in to view sleep progress.");
                return;
            }

            const response = await fetch(`http://localhost:8080/sleep-tracks/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setSleepRecords(data);
                showModal(data);
                setIsModalOpen(true);
            } else {
                console.error("Failed to fetch sleep records. Status:", response.status);
                alert("An error occurred while fetching sleep records.");
            }
        } catch (error) {
            console.error("Error fetching sleep records:", error);
            alert("An error occurred while fetching sleep records.");
        }
    };

    const handleDeleteSleepRecord = async (trackingId) => {
        try {
            const response = await fetch(`http://localhost:8080/sleep-tracks/${trackingId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                alert("Sleep record deleted successfully.");
                setSleepRecords(sleepRecords.filter(record => record.trackingId !== trackingId));
            } else {
                console.error("Failed to delete sleep record. Status:", response.status);
                alert("An error occurred while deleting the sleep record.");
            }
        } catch (error) {
            console.error("Error deleting sleep record:", error);
            alert("An error occurred while deleting the sleep record.");
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const showModal = (records) => {
        const dates = records.map(record => record.date);
        const sleepDurations = records.map(record => Math.max(record.sleepDuration, 0));
        const sleepTimes = records.map(record => record.sleepTime);
        const wakeTimes = records.map(record => record.wakeTime);

        if (sleepChart) sleepChart.destroy();
        if (sleepLineChart) sleepLineChart.destroy();
        if (sleepAreaChart) sleepAreaChart.destroy();

        const sleepChartCanvas = document.getElementById('sleepChart');
        const sleepLineChartCanvas = document.getElementById('sleepLineChart');
        const sleepAreaChartCanvas = document.getElementById('sleepAreaChart');

        if (sleepChartCanvas) {
            const ctxBar = sleepChartCanvas.getContext('2d');
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
                options: { scales: { y: { beginAtZero: true } } }
            }));
        }

        if (sleepLineChartCanvas) {
            const ctxLine = sleepLineChartCanvas.getContext('2d');
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
                options: { scales: { y: { beginAtZero: true } } }
            }));
        }

        if (sleepAreaChartCanvas) {
            const ctxArea = sleepAreaChartCanvas.getContext('2d');
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
                options: { scales: { y: { beginAtZero: true } } }
            }));
        }

        updateReports(sleepDurations, sleepTimes, wakeTimes);
    };

    const updateReports = (sleepDurations, sleepTimes, wakeTimes) => {
        if (sleepDurations && sleepDurations.length > 0 && sleepTimes && sleepTimes.length > 0 && wakeTimes && wakeTimes.length > 0) {
            const avgSleepDuration = (sleepDurations.reduce((a, b) => a + b, 0) / sleepDurations.length).toFixed(2);
            const avgSleepTime = calculateAverageTime(sleepTimes);
            const avgWakeTime = calculateAverageTime(wakeTimes);

            if (document.getElementById('avgSleepDuration')) {
                document.getElementById('avgSleepDuration').innerText = avgSleepDuration;
            }
            if (document.getElementById('avgSleepTime')) {
                document.getElementById('avgSleepTime').innerText = avgSleepTime;
            }
            if (document.getElementById('avgWakeTime')) {
                document.getElementById('avgWakeTime').innerText = avgWakeTime;
            }
        } else {
            console.error("Sleep data arrays are empty or undefined.");
        }
    };

    const calculateAverageTime = (times) => {
        const totalMinutes = times.reduce((total, time) => {
            const [hours, minutes] = time.split(':').map(Number);
            return total + hours * 60 + minutes;
        }, 0);
        const avgMinutes = totalMinutes / times.length;
        const avgHours = Math.floor(avgMinutes / 60) % 12;
        const avgMins = Math.round(avgMinutes % 60);
        return `${String(avgHours).padStart(2, '0')}:${String(avgMins).padStart(2, '0')}`;
    };

    const initializeTaskCardListeners = () => {
        const checkboxes = document.querySelectorAll('.task-card input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                Array.from(checkboxes).every(cb => cb.checked); // Removed: const checked
            });
        });
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'durationOverTime':
                return (
                    <div className="chart-card">
                        <h3>Sleep Duration Over Time</h3>
                        <canvas id="sleepChart"></canvas>
                    </div>
                );
            case 'durationTrend':
                return (
                    <div className="chart-card">
                        <h3>Sleep Duration Trend</h3>
                        <canvas id="sleepLineChart"></canvas>
                    </div>
                );
            case 'patternOverview':
                return (
                    <div className="chart-card">
                        <h3>Sleep Pattern Overview</h3>
                        <canvas id="sleepAreaChart"></canvas>
                    </div>
                );
            case 'analysisReport':
                return (
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
                );
            case 'sleepRecords':
                return (
                    <div className="report-section">
                        <h3>Sleep Records</h3>
                        <ul>
                            {sleepRecords.map(record => (
                                <li key={record.trackingId}>
                                    <span>{record.date} - {record.sleepTime} to {record.wakeTime} ({record.sleepDuration} hours)</span>
                                    <button
                                        onClick={() => handleDeleteSleepRecord(record.trackingId)}
                                        style={{
                                            marginLeft: "10px",
                                            backgroundColor: "#e74c3c",
                                            color: "white",
                                            border: "none",
                                            padding: "5px 10px",
                                            borderRadius: "5px",
                                            cursor: "pointer"
                                        }}
                                    >
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <nav className="nav-bar">
                <div className="nav-content">
                    <a href="/landing_page" className="nav-logo">
                        <svg viewBox="0 0 24 24">
                            <path d="M19 7h-8v8H3V7H1v10h2v3c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-3h2V7h-2z" />
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
                        <div className="form-group">
                            <label htmlFor="date">Sleep Date</label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                value={sleepDate}
                                onChange={(e) => setSleepDate(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="sleep_time">Sleep Time</label>
                            <input
                                type="time"
                                id="sleep_time"
                                name="sleep_time"
                                value={sleepTime}
                                onChange={(e) => setSleepTime(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="wake_date">Wake Date</label>
                            <input
                                type="date"
                                id="wake_date"
                                name="wake_date"
                                value={wakeDate}
                                onChange={(e) => setWakeDate(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="wake_time">Wake Time</label>
                            <input
                                type="time"
                                id="wake_time"
                                name="wake_time"
                                value={wakeTime}
                                onChange={(e) => setWakeTime(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" id="save-button">Save</button>
                    </form>
                    <div id="task-cards-container" dangerouslySetInnerHTML={{ __html: taskCards }} />
                    {showDoneButton && <button id="done-button" onClick={handleDoneButtonClick}>Mark Tasks as Done</button>}
                    {showInsights && sleepDuration !== null && (
                        <SleepInsights duration={sleepDuration} />
                    )}
                </div>
            </div>

            <div id="sleepModal" className="modal" style={{ display: isModalOpen ? 'flex' : 'none' }}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h2>Sleep Analysis Dashboard</h2>
                        <span className="close" onClick={closeModal}>&times;</span>
                    </div>

                    <div className="tabs">
                        <button
                            className={`tab-button ${activeTab === 'durationOverTime' ? 'active' : ''}`}
                            onClick={() => setActiveTab('durationOverTime')}
                        >
                            Sleep Duration Over Time
                        </button>
                        <button
                            className={`tab-button ${activeTab === 'durationTrend' ? 'active' : ''}`}
                            onClick={() => setActiveTab('durationTrend')}
                        >
                            Duration Trend
                        </button>
                        <button
                            className={`tab-button ${activeTab === 'patternOverview' ? 'active' : ''}`}
                            onClick={() => setActiveTab('patternOverview')}
                        >
                            Pattern Overview
                        </button>
                        <button
                            className={`tab-button ${activeTab === 'analysisReport' ? 'active' : ''}`}
                            onClick={() => setActiveTab('analysisReport')}
                        >
                            Sleep Analysis Report
                        </button>
                        <button
                            className={`tab-button ${activeTab === 'sleepRecords' ? 'active' : ''}`}
                            onClick={() => setActiveTab('sleepRecords')}
                        >
                            Sleep Records
                        </button>
                    </div>

                    <div className="tab-content">
                        {renderTabContent()}
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
                    <div className="firework"></div>
                    <div className="firework"></div>
                    <div className="congratulations-message">Congratulations! You have completed all the activities for the day!</div>
                </div>
            )}
        </>
    );
};

export default RecordSleep;