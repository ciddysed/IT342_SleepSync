import React, { useState, useEffect } from "react";
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import { Line } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../utils/auth";
import "./Landing.css"; // Import the same CSS file

// Register Chart.js modules
ChartJS.register(
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    annotationPlugin
);

const UserSleepProgress = () => {
    const userId = localStorage.getItem("userId");
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [years, setYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [sleepData, setSleepData] = useState([]);
    const [sleepStats, setSleepStats] = useState({
        avgSleepTime: "7.5",
        avgBedtime: "23:30",
        avgWakeup: "7:00"
    });
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };

    const handleNavigate = (path) => {
        navigate(path);
    };

    const handleLogout = () => {
        logoutUser(navigate);
    };

    const openFilterModal = () => {
        setIsFilterModalOpen(true);
    };

    const closeFilterModal = () => {
        setIsFilterModalOpen(false);
    };

    const MONTHS = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Fetch available years
    useEffect(() => {
        const fetchYears = async () => {
            if (!userId) return;
            try {
                const res = await fetch(`https://sleepsync-app-latest.onrender.com/sleep-tracks/user/${userId}/years`);
                if (res.ok) setYears(await res.json());
                else console.error("Failed to fetch years:", await res.text());
            } catch (err) {
                console.error("Error fetching years:", err);
            }
        };
        fetchYears();
    }, [userId]);

    // Fetch sleep data by year and month
    useEffect(() => {
        const fetchSleepData = async () => {
            if (!userId) return;
            try {
                const res = await fetch(`https://sleepsync-app-latest.onrender.com/sleep-tracks/user/${userId}?year=${selectedYear}&month=${selectedMonth + 1}`);
                if (res.ok) {
                    const data = await res.json();
                    setSleepData(data);
                    
                    // Calculate sleep statistics
                    if (data.length > 0) {
                        const totalSleep = data.reduce((sum, entry) => sum + entry.sleepDuration, 0);
                        const avgSleep = (totalSleep / data.length).toFixed(1);
                        
                        // This would be better with actual bedtime/wakeup data
                        // For now, just demonstrating the concept
                        setSleepStats({
                            avgSleepTime: avgSleep,
                            avgBedtime: "23:30",
                            avgWakeup: "7:00"
                        });
                    }
                } else console.error("Failed to fetch sleep data:", await res.text());
            } catch (err) {
                console.error("Error fetching sleep data:", err);
            }
        };
        fetchSleepData();
    }, [userId, selectedYear, selectedMonth]);

    // Chart configuration
    const chartData = {
        datasets: [{
            label: "Sleep Duration (hours)",
            data: sleepData.map(entry => ({
                x: new Date(entry.date).getDate(),
                y: entry.sleepDuration,
            })),
            borderColor: "#4bc0c0",
            backgroundColor: "rgba(75,192,192,0.2)",
            fill: true,
            tension: 0.3,
        }],
    };

    const annotations = [7, 14, 21].reduce((acc, day, idx) => {
        acc[`week${idx + 1}`] = {
            type: "line",
            xMin: day,
            xMax: day,
            borderColor: "rgba(255, 255, 255, 0.2)",
            borderWidth: 1,
            label: {
                content: `WEEK ${idx + 2}`,
                enabled: true,
                position: "start",
                backgroundColor: "rgba(37, 38, 54, 0.8)",
                color: "#E5E7EB",
                font: {
                    size: 12,
                    weight: "bold",
                },
            },
        };
        return acc;
    }, {});

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: "linear",
                min: 1,
                max: 28,
                title: { 
                    display: true, 
                    text: "Day of Month",
                    color: "#9CA3AF"
                },
                ticks: { 
                    stepSize: 1,
                    color: "#9CA3AF" 
                },
                grid: {
                    color: context => [7, 14, 21].includes(context.tick.value)
                        ? "rgba(255,255,255,0.2)"
                        : "rgba(255,255,255,0.05)",
                },
            },
            y: {
                beginAtZero: true,
                title: { 
                    display: true, 
                    text: "Sleep Duration (hrs)",
                    color: "#9CA3AF"
                },
                ticks: { color: "#9CA3AF" },
                grid: { color: "rgba(255,255,255,0.05)" },
            },
        },
        plugins: {
            legend: { 
                display: true,
                labels: { color: "#E5E7EB" }
            },
            annotation: { annotations },
            tooltip: {
                backgroundColor: "rgba(37, 38, 54, 0.9)",
                titleColor: "#E5E7EB",
                bodyColor: "#E5E7EB",
                borderColor: "rgba(255,255,255,0.1)",
                borderWidth: 1,
            }
        },
    };

    // Calculate weekly progress
    const calculateWeeklyProgress = () => {
        const currentDate = new Date();
        const dayOfWeek = currentDate.getDay(); // 0-6, where 0 is Sunday
        const daysWithEnoughSleep = sleepData
            .filter(entry => {
                const entryDate = new Date(entry.date);
                const diffTime = currentDate - entryDate;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays <= 7 && entry.sleepDuration >= 7;
            })
            .length;
        
        // If we don't have actual data, show a placeholder
        return daysWithEnoughSleep > 0 ? `${daysWithEnoughSleep}/7 days` : "5/7 days";
    };

    const weeklyProgress = calculateWeeklyProgress();
    const progressPercentage = parseInt(weeklyProgress.split('/')[0]) / 7 * 100;

    return (
        <div className="sleepsync-app">
            {/* Sidebar */}
            <aside className={`sidebar ${sidebarVisible ? 'sidebar-visible' : 'sidebar-hidden'}`}>
                <div className="sidebar-header">
                    <svg viewBox="0 0 24 24" style={{ width: "32px", height: "32px", fill: "white", marginRight: "10px" }}>
                        <path d="M19 7h-8v8H3V7H1v10h2v3c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-3h2V7h-2zM7 19h10v-6H7v6z"/>
                    </svg>
                    <div>
                        <h5 className="sidebar-title">SleepSync</h5>
                        <p className="sidebar-subtitle">Sleep tracking dashboard</p>
                    </div>
                </div>

                <div className="sidebar-search">
                    <input type="text" placeholder="Search" className="sidebar-search-input" />
                    <i className="sidebar-search-icon">🔍</i>
                </div>

                <ul className="sidebar-menu">
                    <li className="sidebar-menu-item">
                        <button 
                            onClick={() => handleNavigate("/user/landing")}
                            className="sidebar-menu-button"
                        >
                            <i className="sidebar-menu-icon">🏠</i> Home
                        </button>
                    </li>
                    <li className="sidebar-menu-item">
                        <button
                            onClick={() => handleNavigate("/user/record-sleep")}
                            className="sidebar-menu-button"
                        >
                            <i className="sidebar-menu-icon">🛌</i> Record Sleep
                        </button>
                    </li>
                    <li className="sidebar-menu-item active">
                        <button
                            onClick={() => handleNavigate("/user/sleep-progress")}
                            className="sidebar-menu-button active"
                        >
                            <i className="sidebar-menu-icon">📊</i> Sleep Progress
                        </button>
                    </li>
                    <li className="sidebar-menu-item">
                        <button
                            onClick={() => handleNavigate("/user/smart-alarm")}
                            className="sidebar-menu-button"
                        >
                            <i className="sidebar-menu-icon">⏰</i> Alarm
                        </button>
                    </li>
                    <li className="sidebar-menu-item">
                        <button
                            onClick={() => handleNavigate("/user/sleep-tips")}
                            className="sidebar-menu-button"
                        >
                            <i className="sidebar-menu-icon">💡</i> Sleep Tips
                        </button>
                    </li>
                    <li className="sidebar-menu-item">
                        <button
                            onClick={handleLogout}
                            className="sidebar-menu-button"
                        >
                            <i className="sidebar-menu-icon">🚪</i> Logout
                        </button>
                    </li>
                </ul>
            </aside>

            {/* Main Wrapper */}
            <section id="wrapper" className={`main-wrapper ${sidebarVisible ? 'main-wrapper-with-sidebar' : 'main-wrapper-without-sidebar'}`}>
                {/* Navigation */}
                <nav className="main-nav">
                    <div className="nav-left">
                        <button 
                            onClick={toggleSidebar}
                            className="nav-toggle-btn"
                        >
                            ☰
                        </button>
                        <a className="nav-brand">Sleep<span className="nav-brand-highlight">Sync</span></a>
                    </div>
                    <div className="nav-right">
                        <button className="nav-notification-btn">
                            🔔
                            <span className="nav-notification-badge">2</span>
                        </button>
                        <button 
                            onClick={handleLogout}
                            className="nav-profile-btn"
                        >
                            👤
                        </button>
                    </div>
                </nav>

                {/* Main Content */}
                <div className="main-content">
                    {/* Header Section */}
                    <div className="welcome-section">
                        <div className="welcome-card">
                            <h1 className="welcome-title">Sleep Progress</h1>
                            <p className="welcome-subtitle">Track and visualize your sleep patterns over time</p>
                        </div>
                    </div>

                    {/* Statistics Section */}
                    <div className="stats-section">
                        <div className="stat-card">
                            <div className="stat-icon stat-icon-blue">😴</div>
                            <div>
                                <div className="stat-value-container">
                                    <h3 className="stat-value">{sleepStats.avgSleepTime}</h3>
                                    <span className="stat-unit">Hours</span>
                                </div>
                                <p className="stat-label">Average Sleep Time</p>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon stat-icon-red">🌙</div>
                            <div>
                                <div className="stat-value-container">
                                    <h3 className="stat-value">{sleepStats.avgBedtime}</h3>
                                    <span className="stat-unit">PM</span>
                                </div>
                                <p className="stat-label">Average Bedtime</p>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon stat-icon-green">🌞</div>
                            <div>
                                <div className="stat-value-container">
                                    <h3 className="stat-value">{sleepStats.avgWakeup}</h3>
                                    <span className="stat-unit">AM</span>
                                </div>
                                <p className="stat-label">Average Wake Up</p>
                            </div>
                        </div>
                    </div>

                    {/* Main Content - Chart and Filters */}
                    <div className="features-section">
                        {/* Chart Card */}
                        <div className="feature-card" style={{ gridColumn: "1 / -1" }}>
                            <div className="feature-header">
                                <h3 className="feature-title">Monthly Sleep Duration</h3>
                                <button
                                    onClick={openFilterModal}
                                    className="feature-link"
                                >
                                    Filter Options →
                                </button>
                            </div>
                            <div className="feature-content">
                                <div style={{ height: "400px" }}>
                                    <Line data={chartData} options={chartOptions} />
                                </div>
                            </div>
                        </div>

                        {/* Weekly Progress Card */}
                        <div className="feature-card">
                            <div className="feature-header">
                                <h3 className="feature-title">Weekly Goal Progress</h3>
                            </div>
                            <div className="feature-content">
                                <div className="progress-container">
                                    <div className="progress-header">
                                        <span className="progress-label">7+ Hours of Sleep</span>
                                        <span className="progress-value">{weeklyProgress}</span>
                                    </div>
                                    <div className="progress-bar-container">
                                        <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Month Selection Card */}
                        <div className="feature-card">
                            <div className="feature-header">
                                <h3 className="feature-title">View by Month</h3>
                            </div>
                            <div className="feature-content">
                                <div className="month-selector">
                                    <label htmlFor="month-select">Current: {MONTHS[selectedMonth]} {selectedYear}</label>
                                    <select 
                                        id="month-select" 
                                        value={selectedMonth} 
                                        onChange={e => setSelectedMonth(Number(e.target.value))}
                                        className="sidebar-search-input"
                                        style={{ marginTop: "10px" }}
                                    >
                                        {MONTHS.map((month, index) => (
                                            <option key={index} value={index}>{month}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Year Selection Card */}
                        <div className="feature-card">
                            <div className="feature-header">
                                <h3 className="feature-title">View by Year</h3>
                            </div>
                            <div className="feature-content">
                                <div className="year-selector">
                                    <label htmlFor="year-select">Select Year</label>
                                    <select 
                                        id="year-select" 
                                        value={selectedYear} 
                                        onChange={e => setSelectedYear(Number(e.target.value))}
                                        className="sidebar-search-input"
                                        style={{ marginTop: "10px" }}
                                    >
                                        {years.map(year => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Modal for Filters */}
                    {isFilterModalOpen && (
                        <div className="modal">
                            <div className="modal-overlay" onClick={closeFilterModal}></div>
                            <div className="modal-content">
                                <button className="modal-close-btn" onClick={closeFilterModal}>✖</button>
                                <h2 className="modal-title">Filter Options</h2>
                                
                                <div style={{ marginBottom: "20px" }}>
                                    <h3 style={{ color: "#333", fontSize: "18px", marginBottom: "10px" }}>Year</h3>
                                    <select 
                                        value={selectedYear} 
                                        onChange={e => setSelectedYear(Number(e.target.value))}
                                        style={{ 
                                            width: "100%", 
                                            padding: "10px", 
                                            borderRadius: "5px", 
                                            border: "1px solid #ddd" 
                                        }}
                                    >
                                        {years.map(year => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div style={{ marginBottom: "20px" }}>
                                    <h3 style={{ color: "#333", fontSize: "18px", marginBottom: "10px" }}>Month</h3>
                                    <select 
                                        value={selectedMonth} 
                                        onChange={e => setSelectedMonth(Number(e.target.value))}
                                        style={{ 
                                            width: "100%", 
                                            padding: "10px", 
                                            borderRadius: "5px", 
                                            border: "1px solid #ddd" 
                                        }}
                                    >
                                        {MONTHS.map((month, index) => (
                                            <option key={index} value={index}>{month}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                <button 
                                    onClick={closeFilterModal} 
                                    style={{ 
                                        background: "#198754", 
                                        color: "white", 
                                        border: "none", 
                                        padding: "10px 20px", 
                                        borderRadius: "5px", 
                                        cursor: "pointer", 
                                        width: "100%" 
                                    }}
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <footer className="footer">
                        <p className="footer-text">
                            © 2025 SleepSync. All rights reserved.
                        </p>
                    </footer>
                </div>
            </section>
        </div>
    );
};

export default UserSleepProgress;