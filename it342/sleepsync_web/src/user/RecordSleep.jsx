import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './RecordSleep.css';
import SleepInsights from './components/SleepInsights';
import SleepForm from './components/SleepForm';
import SleepModal from './components/SleepModal';
import TaskCards from './components/TaskCards';
import AlarmClock from './components/AlarmClock';
import { initializeTaskCardListeners } from './utils/taskCardListeners';
import { getSleepCategory } from './utils/sleepCategories';

const RecordSleep = () => {
    const [sleepDate, setSleepDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    });
    const [sleepTime, setSleepTime] = useState('22:00');
    const [wakeTime, setWakeTime] = useState('07:00');
    const [wakeDate, setWakeDate] = useState(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    });
    const [taskCards, setTaskCards] = useState('');
    const [showDoneButton, setShowDoneButton] = useState(false);
    const [showFireworks, setShowFireworks] = useState(false);
    const [sleepRecords, setSleepRecords] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('durationOverTime');
    const [sleepDuration, setSleepDuration] = useState(null);
    const [showInsights, setShowInsights] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    
    // Chart references
    const sleepChartRef = useRef(null);
    const sleepLineChartRef = useRef(null);
    const sleepAreaChartRef = useRef(null);
    
    useEffect(() => {
        if (taskCards) {
            initializeTaskCardListeners();
        }
    }, [taskCards]);
    
    // Clean up charts when component unmounts
    useEffect(() => {
        return () => {
            if (sleepChartRef.current) {
                sleepChartRef.current.destroy();
            }
            if (sleepLineChartRef.current) {
                sleepLineChartRef.current.destroy();
            }
            if (sleepAreaChartRef.current) {
                sleepAreaChartRef.current.destroy();
            }
        };
    }, []);
    
    // Update charts when sleep records or active tab changes
    useEffect(() => {
        if (isModalOpen && sleepRecords.length > 0) {
            renderCharts();
        }
    }, [sleepRecords, activeTab, isModalOpen]);

    const handleSleepFormSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setErrorMessage('');
    
        const sleepDateTime = new Date(`${sleepDate}T${sleepTime}:00`);
        let wakeDateTime = new Date(`${wakeDate}T${wakeTime}:00`);
    
        if (wakeDateTime <= sleepDateTime) {
            wakeDateTime.setDate(wakeDateTime.getDate() + 1);
        }
    
        const duration = (wakeDateTime - sleepDateTime) / (1000 * 60 * 60);
    
        const userId = localStorage.getItem("userId");
        if (!userId) {
            setErrorMessage("User not logged in. Please log in to record sleep.");
            setIsLoading(false);
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
                    // Validate and parse taskCards
                    if (Array.isArray(data.task_cards)) {
                        setTaskCards(data.task_cards);
                    } else if (typeof data.task_cards === 'string') {
                        // Parse raw HTML into structured data
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(data.task_cards, 'text/html');
                        const tasks = Array.from(doc.querySelectorAll('.task-card')).map((card) => {
                            const description = card.querySelector('span')?.textContent || 'Unknown Task';
                            const completed = card.querySelector('input[type="checkbox"]')?.checked || false;
                            return { description, completed };
                        });
                        setTaskCards(tasks);
                    } else {
                        console.error("Invalid taskCards data received:", data.task_cards);
                        setTaskCards([]);
                    }
                    setShowDoneButton(true);
                    setSleepDuration(duration);
                    setShowInsights(true);
                } else {
                    setErrorMessage("Failed to record sleep time.");
                }
            } else {
                console.error("Failed to record sleep time. Status:", response.status);
                setErrorMessage("An error occurred while recording sleep time. Please try again.");
            }
        } catch (error) {
            console.error("Error recording sleep time:", error);
            setErrorMessage("An error occurred while recording sleep time. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleTrackProgressButtonClick = async () => {
        setIsLoading(true);
        setErrorMessage('');
        
        try {
            const userId = localStorage.getItem("userId");
            if (!userId) {
                setErrorMessage("User not logged in. Please log in to view sleep progress.");
                setIsLoading(false);
                return;
            }

            const response = await fetch(`http://localhost:8080/sleep-tracks/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setSleepRecords(data);
                setIsModalOpen(true);
            } else {
                console.error("Failed to fetch sleep records. Status:", response.status);
                setErrorMessage("An error occurred while fetching sleep records.");
            }
        } catch (error) {
            console.error("Error fetching sleep records:", error);
            setErrorMessage("An error occurred while fetching sleep records.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDoneButtonClick = () => {
        const checkboxes = document.querySelectorAll('.task-card input[type="checkbox"]');
        const allChecked = Array.from(checkboxes).every(cb => cb.checked);
        if (allChecked) {
            setShowFireworks(true);
            
            // Create actual fireworks
            const fireworksContainer = document.createElement('div');
            fireworksContainer.className = 'fireworks-container';
            
            // Add congratulations message
            const congratsMessage = document.createElement('div');
            congratsMessage.className = 'congratulations-message';
            congratsMessage.textContent = 'Great job improving your sleep habits!';
            fireworksContainer.appendChild(congratsMessage);
            
            // Create fireworks
            for (let i = 0; i < 20; i++) {
                const firework = document.createElement('div');
                firework.className = 'firework';
                firework.style.left = `${Math.random() * 100}%`;
                firework.style.top = `${Math.random() * 100}%`;
                firework.style.animationDelay = `${Math.random() * 2}s`;
                fireworksContainer.appendChild(firework);
            }
            
            document.body.appendChild(fireworksContainer);
            
            setTimeout(() => {
                document.body.removeChild(fireworksContainer);
                setShowFireworks(false);
                setTaskCards('');
                setShowDoneButton(false);
                setShowInsights(false);
            }, 3000);
        } else {
            setErrorMessage("Please complete all tasks before proceeding.");
        }
    };

    const handleDeleteRecord = async (recordId) => {
        try {
            const response = await fetch(`http://localhost:8080/sleep-tracks/${recordId}`, {
                method: "DELETE",
            });
    
            if (response.ok) {
                // Remove the deleted record from the state in real-time
                setSleepRecords((prevRecords) => prevRecords.filter((record) => record.trackingId !== recordId));
            } else {
                console.error("Failed to delete sleep record. Status:", response.status);
                setErrorMessage("An error occurred while deleting the record.");
            }
        } catch (error) {
            console.error("Error deleting sleep record:", error);
            setErrorMessage("An error occurred while deleting the record.");
        }
    };
    
    const renderCharts = () => {
        const dates = sleepRecords.map(record => record.date);
        const durations = sleepRecords.map(record => Number(record.sleepDuration).toFixed(1));
        const sleepTimes = sleepRecords.map(record => record.sleepTime);
        const wakeTimes = sleepRecords.map(record => record.wakeTime);
        
        // Destroy existing charts if they exist
        if (sleepChartRef.current) {
            sleepChartRef.current.destroy();
        }
        if (sleepLineChartRef.current) {
            sleepLineChartRef.current.destroy();
        }
        if (sleepAreaChartRef.current) {
            sleepAreaChartRef.current.destroy();
        }
        
        // Create bar chart
        const sleepChartEl = document.getElementById('sleepChart');
        if (sleepChartEl) {
            const ctx = sleepChartEl.getContext('2d');
            sleepChartRef.current = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: dates,
                    datasets: [{
                        label: 'Sleep Duration (hours)',
                        data: durations,
                        backgroundColor: 'rgba(107, 78, 113, 0.6)',
                        borderColor: 'rgba(107, 78, 113, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Hours'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Date'
                            }
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: 'Sleep Duration by Date'
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `Duration: ${context.raw} hours`;
                                }
                            }
                        }
                    }
                }
            });
        }
        
        // Create line chart
        const sleepLineChartEl = document.getElementById('sleepLineChart');
        if (sleepLineChartEl) {
            const ctx = sleepLineChartEl.getContext('2d');
            sleepLineChartRef.current = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: dates,
                    datasets: [{
                        label: 'Sleep Duration Trend',
                        data: durations,
                        backgroundColor: 'rgba(107, 78, 113, 0.2)',
                        borderColor: 'rgba(107, 78, 113, 1)',
                        borderWidth: 2,
                        tension: 0.3,
                        pointBackgroundColor: 'rgba(107, 78, 113, 1)',
                        pointRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Hours'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Date'
                            }
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: 'Sleep Duration Trend Over Time'
                        }
                    }
                }
            });
        }
        
        // Create area chart
        const sleepAreaChartEl = document.getElementById('sleepAreaChart');
        if (sleepAreaChartEl) {
            const ctx = sleepAreaChartEl.getContext('2d');
            
            // Create color-coded datasets based on sleep quality
            const optimalData = durations.map((duration, index) => {
                const durationNum = parseFloat(duration);
                return durationNum >= 7 && durationNum <= 9 ? durationNum : null;
            });
            
            const lowData = durations.map((duration, index) => {
                const durationNum = parseFloat(duration);
                return durationNum < 7 ? durationNum : null;
            });
            
            const highData = durations.map((duration, index) => {
                const durationNum = parseFloat(duration);
                return durationNum > 9 ? durationNum : null;
            });
            
            sleepAreaChartRef.current = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: dates,
                    datasets: [
                        {
                            label: 'Optimal Sleep (7-9h)',
                            data: optimalData,
                            backgroundColor: 'rgba(75, 192, 192, 0.4)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 2,
                            pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                            pointRadius: 4,
                            fill: true
                        },
                        {
                            label: 'Sleep Deficit (<7h)',
                            data: lowData,
                            backgroundColor: 'rgba(255, 99, 132, 0.4)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 2,
                            pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                            pointRadius: 4,
                            fill: true
                        },
                        {
                            label: 'Oversleep (>9h)',
                            data: highData,
                            backgroundColor: 'rgba(54, 162, 235, 0.4)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 2,
                            pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                            pointRadius: 4,
                            fill: true
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Hours'
                            },
                            suggestedMin: 4,
                            suggestedMax: 12
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Date'
                            }
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: 'Sleep Quality Overview'
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    if (context.raw === null) return '';
                                    const durationNum = parseFloat(context.raw);
                                    let quality = '';
                                    if (durationNum >= 7 && durationNum <= 9) {
                                        quality = 'Optimal';
                                    } else if (durationNum < 7) {
                                        quality = 'Deficit';
                                    } else {
                                        quality = 'Oversleep';
                                    }
                                    return `${quality}: ${context.raw} hours`;
                                }
                            }
                        }
                    }
                }
            });
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'durationOverTime':
                return (
                    <div className="chart-container">
                        <h3>Sleep Duration Over Time</h3>
                        <div style={{ height: '350px', width: '100%' }}>
                            <canvas id="sleepChart"></canvas>
                        </div>
                    </div>
                );
            case 'durationTrend':
                return (
                    <div className="chart-container">
                        <h3>Sleep Duration Trend</h3>
                        <div style={{ height: '350px', width: '100%' }}>
                            <canvas id="sleepLineChart"></canvas>
                        </div>
                    </div>
                );
            case 'patternOverview':
                return (
                    <div className="chart-container">
                        <h3>Sleep Pattern Overview</h3>
                        <div style={{ height: '350px', width: '100%' }}>
                            <canvas id="sleepAreaChart"></canvas>
                        </div>
                    </div>
                );
            case 'analysisReport':
                return (
                    <div className="analysis-report">
                        <h3>Sleep Analysis Report</h3>
                        <div className="report-grid">
                            <div className="report-item">
                                <span className="report-label">Average Sleep Duration</span>
                                <span className="report-value">
                                    {sleepRecords.length > 0 
                                        ? (sleepRecords.reduce((sum, record) => sum + parseFloat(record.sleepDuration), 0) / sleepRecords.length).toFixed(1) 
                                        : 0} hours
                                </span>
                            </div>
                            <div className="report-item">
                                <span className="report-label">Optimal Days</span>
                                <span className="report-value">
                                    {sleepRecords.filter(record => parseFloat(record.sleepDuration) >= 7 && parseFloat(record.sleepDuration) <= 9).length}
                                </span>
                            </div>
                            <div className="report-item">
                                <span className="report-label">Sleep Deficit Days</span>
                                <span className="report-value">
                                    {sleepRecords.filter(record => parseFloat(record.sleepDuration) < 7).length}
                                </span>
                            </div>
                            <div className="report-item">
                                <span className="report-label">Oversleep Days</span>
                                <span className="report-value">
                                    {sleepRecords.filter(record => parseFloat(record.sleepDuration) > 9).length}
                                </span>
                            </div>
                            <div className="report-item">
                                <span className="report-label">Average Sleep Time</span>
                                <span className="report-value">
                                    {sleepRecords.length > 0 
                                        ? calculateAverageTime(sleepRecords.map(record => record.sleepTime))
                                        : "N/A"}
                                </span>
                            </div>
                            <div className="report-item">
                                <span className="report-label">Average Wake Time</span>
                                <span className="report-value">
                                    {sleepRecords.length > 0 
                                        ? calculateAverageTime(sleepRecords.map(record => record.wakeTime))
                                        : "N/A"}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            case 'sleepRecords':
                return (
                    <div className="sleep-records">
                        <h3>Your Sleep Records</h3>
                        {sleepRecords.length > 0 ? (
                            <div className="records-table-container">
                                <table className="records-table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Sleep Time</th>
                                            <th>Wake Time</th>
                                            <th>Duration</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sleepRecords.map((record) => (
                                            <tr key={record.trackingId}>
                                                <td>{record.date}</td>
                                                <td>{record.sleepTime}</td>
                                                <td>{record.wakeTime}</td>
                                                <td>{record.sleepDuration} hours</td>
                                                <td>
                                                    <button
                                                        className="delete-button"
                                                        onClick={() => {
                                                            if (record.trackingId) {
                                                                const confirmDelete = window.confirm("Are you sure you want to delete this record?");
                                                                if (confirmDelete) {
                                                                    handleDeleteRecord(record.trackingId);
                                                                }
                                                            } else {
                                                                console.error("Record ID is undefined:", record);
                                                            }
                                                        }}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="no-records">No sleep records found. Start recording your sleep to see data here.</p>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };
    
    const calculateAverageTime = (times) => {
        if (!times || times.length === 0) return "N/A";
        
        const totalMinutes = times.reduce((total, time) => {
            const [hours, minutes] = time.split(':').map(Number);
            return total + hours * 60 + minutes;
        }, 0);
        
        const avgMinutes = totalMinutes / times.length;
        const avgHours = Math.floor(avgMinutes / 60) % 24;
        const avgMins = Math.round(avgMinutes % 60);
        
        return `${String(avgHours).padStart(2, '0')}:${String(avgMins).padStart(2, '0')}`;
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
                    <div className="nav-links">
                        <a href="/dashboard" className="nav-link">Dashboard</a>
                        <a href="/records" className="nav-link">Records</a>
                        <a href="/profile" className="nav-link">Profile</a>
                    </div>
                </div>
            </nav>

            <div className="main-content">
                <div className="container">
                    <div className="header-section">
                        <h1>Record Your Sleep</h1>
                        <p>Keep track of your sleep patterns to improve your health and wellbeing</p>
                        <button id="track-progress-button" onClick={handleTrackProgressButtonClick} disabled={isLoading}>
                            {isLoading ? 'Loading...' : 'Track Sleep Progress'}
                        </button>
                    </div>
                    
                    {errorMessage && (
                        <div className="error-message">
                            <p>{errorMessage}</p>
                        </div>
                    )}
                    
                    <SleepForm
                        sleepDate={sleepDate}
                        setSleepDate={setSleepDate}
                        sleepTime={sleepTime}
                        setSleepTime={setSleepTime}
                        wakeDate={wakeDate}
                        setWakeDate={setWakeDate}
                        wakeTime={wakeTime}
                        setWakeTime={setWakeTime}
                        handleSleepFormSubmit={handleSleepFormSubmit}
                    />
                    
                    {isLoading && (
                        <div className="loading-spinner">
                            <div className="spinner"></div>
                            <p>Processing your sleep data...</p>
                        </div>
                    )}
                    
                    {showInsights && sleepDuration !== null && (
                        <SleepInsights duration={sleepDuration} getSleepCategory={getSleepCategory} />
                    )}
                    
                    {taskCards && (
                        <TaskCards taskCards={taskCards} handleDoneButtonClick={handleDoneButtonClick} />
                    )}
                    
                    <AlarmClock wakeTime={wakeTime} wakeDate={wakeDate} />
                </div>
            </div>

            <SleepModal
                isModalOpen={isModalOpen}
                closeModal={() => setIsModalOpen(false)}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                renderTabContent={renderTabContent}
            />

            <footer className="site-footer">
                <div className="footer-content">
                    <p>&copy; 2025 SleepSync. All rights reserved.</p>
                    <div className="footer-links">
                        <a href="/privacy">Privacy Policy</a>
                        <a href="/terms">Terms of Service</a>
                        <a href="/support">Support</a>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default RecordSleep;