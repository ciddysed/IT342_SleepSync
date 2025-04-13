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
import { fetchSleepRecords, recordSleepTime, deleteSleepRecord } from './utils/sleepApi';
import { renderCharts, calculateAverageTime } from './utils/chartHelpers';

const RecordSleep = () => {
    const [sleepDate, setSleepDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [wakeDate, setWakeDate] = useState(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    });
    const [sleepTime, setSleepTime] = useState('22:00');
    const [wakeTime, setWakeTime] = useState('07:00');
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

    const sleepChartRef = useRef(null);
    const sleepLineChartRef = useRef(null);
    const sleepAreaChartRef = useRef(null);

    useEffect(() => {
        if (taskCards) initializeTaskCardListeners();
    }, [taskCards]);

    useEffect(() => {
        return () => {
            [sleepChartRef, sleepLineChartRef, sleepAreaChartRef].forEach(ref => ref.current?.destroy());
        };
    }, []);

    useEffect(() => {
        if (isModalOpen && sleepRecords.length > 0) renderCharts(sleepRecords, sleepChartRef, sleepLineChartRef, sleepAreaChartRef);
    }, [sleepRecords, activeTab, isModalOpen]);

    const handleSleepFormSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setErrorMessage('');
        const userId = localStorage.getItem("userId");
        if (!userId) {
            setErrorMessage("User not logged in. Please log in to record sleep.");
            setIsLoading(false);
            return;
        }
        const result = await recordSleepTime({ sleepDate, wakeDate, sleepTime, wakeTime, userId });
        if (result.success) {
            setTaskCards(result.taskCards);
            setShowDoneButton(true);
            setSleepDuration(result.duration);
            setShowInsights(true);
        } else {
            setErrorMessage(result.errorMessage);
        }
        setIsLoading(false);
    };

    const handleTrackProgressButtonClick = async () => {
        setIsLoading(true);
        setErrorMessage('');
        const userId = localStorage.getItem("userId");
        if (!userId) {
            setErrorMessage("User not logged in. Please log in to view sleep progress.");
            setIsLoading(false);
            return;
        }
        const result = await fetchSleepRecords(userId);
        if (result.success) {
            setSleepRecords(result.records);
            setIsModalOpen(true);
        } else {
            setErrorMessage(result.errorMessage);
        }
        setIsLoading(false);
    };

    const handleDoneButtonClick = () => {
        const allChecked = Array.from(document.querySelectorAll('.task-card input[type="checkbox"]')).every(cb => cb.checked);
        if (allChecked) {
            setShowFireworks(true);
            setTimeout(() => {
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
        const result = await deleteSleepRecord(recordId);
        if (result.success) {
            setSleepRecords(prev => prev.filter(record => record.trackingId !== recordId));
        } else {
            setErrorMessage(result.errorMessage);
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'durationOverTime':
                return <canvas id="sleepChart"></canvas>;
            case 'durationTrend':
                return <canvas id="sleepLineChart"></canvas>;
            case 'patternOverview':
                return <canvas id="sleepAreaChart"></canvas>;
            case 'analysisReport':
                return (
                    <div className="analysis-report">
                        <div className="report-grid">
                            <div className="report-item">
                                <span>Average Sleep Duration</span>
                                <span>{sleepRecords.length > 0 ? (sleepRecords.reduce((sum, r) => sum + parseFloat(r.sleepDuration), 0) / sleepRecords.length).toFixed(1) : 0} hours</span>
                            </div>
                            <div className="report-item">
                                <span>Optimal Days</span>
                                <span>{sleepRecords.filter(r => parseFloat(r.sleepDuration) >= 7 && parseFloat(r.sleepDuration) <= 9).length}</span>
                            </div>
                            {/* ...other report items... */}
                        </div>
                    </div>
                );
            case 'sleepRecords':
                return (
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
                            {sleepRecords.map(record => (
                                <tr key={record.trackingId}>
                                    <td>{record.date}</td>
                                    <td>{record.sleepTime}</td>
                                    <td>{record.wakeTime}</td>
                                    <td>{record.sleepDuration} hours</td>
                                    <td>
                                        <button onClick={() => handleDeleteRecord(record.trackingId)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <nav className="nav-bar">
                <div className="nav-content">
                    <a href="/user/landing" className="nav-logo">
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
                        <button onClick={handleTrackProgressButtonClick} disabled={isLoading}>
                            {isLoading ? 'Loading...' : 'Track Sleep Progress'}
                        </button>
                    </div>
                    {errorMessage && <div className="error-message"><p>{errorMessage}</p></div>}
                    <SleepForm {...{ sleepDate, setSleepDate, sleepTime, setSleepTime, wakeDate, setWakeDate, wakeTime, setWakeTime, handleSleepFormSubmit }} />
                    {isLoading && <div className="loading-spinner"><p>Processing your sleep data...</p></div>}
                    {showInsights && sleepDuration !== null && <SleepInsights duration={sleepDuration} getSleepCategory={getSleepCategory} />}
                    {taskCards && <TaskCards taskCards={taskCards} handleDoneButtonClick={handleDoneButtonClick} />}
                    <AlarmClock wakeTime={wakeTime} wakeDate={wakeDate} />
                </div>
            </div>
            <SleepModal {...{ isModalOpen, closeModal: () => setIsModalOpen(false), activeTab, setActiveTab, renderTabContent }} />
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