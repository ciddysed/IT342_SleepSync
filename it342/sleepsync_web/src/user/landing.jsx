import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../utils/auth";
import "./Landing.css"; // Import the CSS file

const Landing = () => {
    const navigate = useNavigate();
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleLogout = () => {
        logoutUser(navigate);
    };

    const handleNavigate = (path) => {
        navigate(path);
    };

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

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
                    <li className="sidebar-menu-item active">
                        <button 
                            onClick={() => handleNavigate("/user/landing")}
                            className="sidebar-menu-button active"
                        >
                            <i className="sidebar-menu-icon">🏠</i> Dashboard
                        </button>
                    </li>
                    <li className="sidebar-menu-item">
                        <button
                            onClick={() => handleNavigate("/user/sleep-schedule")}
                            className="sidebar-menu-button"
                        >
                            <i className="sidebar-menu-icon">📅</i> Sleep Schedule
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
                    <li className="sidebar-menu-item">
                        <button
                            onClick={() => handleNavigate("/user/sleep-progress")}
                            className="sidebar-menu-button"
                        >
                            <i className="sidebar-menu-icon">📊</i> Sleep Progress
                        </button>
                    </li>
                    <li className="sidebar-menu-item">
                        <button
                            onClick={() => handleNavigate("/sleep-tips")}
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
                    {/* Welcome Section */}
                    <div className="welcome-section">
                        <div className="welcome-card">
                            <h1 className="welcome-title">Welcome to SleepSync Dashboard</h1>
                            <p className="welcome-subtitle">Your journey to better sleep starts here. Track and improve your sleep patterns.</p>
                        </div>
                    </div>

                    {/* Statistics Section */}
                    <div className="stats-section">
                        <div className="stat-card">
                            <div className="stat-icon stat-icon-blue">😴</div>
                            <div>
                                <div className="stat-value-container">
                                    <h3 className="stat-value">7.5</h3>
                                    <span className="stat-unit">Hours</span>
                                </div>
                                <p className="stat-label">Average Sleep Time</p>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon stat-icon-red">🌙</div>
                            <div>
                                <div className="stat-value-container">
                                    <h3 className="stat-value">23:30</h3>
                                    <span className="stat-unit">PM</span>
                                </div>
                                <p className="stat-label">Average Bedtime</p>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon stat-icon-green">🌞</div>
                            <div>
                                <div className="stat-value-container">
                                    <h3 className="stat-value">7:00</h3>
                                    <span className="stat-unit">AM</span>
                                </div>
                                <p className="stat-label">Average Wake Up</p>
                            </div>
                        </div>
                    </div>

                    {/* Main Features Section */}
                    <div className="features-section">
                        {/* Sleep Schedule Card */}
                        <div className="feature-card">
                            <div className="feature-header">
                                <h3 className="feature-title">Sleep Schedule</h3>
                                <button
                                    onClick={openModal}
                                    className="feature-link"
                                >
                                    View All →
                                </button>
                            </div>
                            <div className="feature-content feature-schedule">
                                <div>
                                    <div className="schedule-date">Tonight</div>
                                    <div className="schedule-time">23:00 - 7:00</div>
                                </div>
                                <button
                                    onClick={() => handleNavigate("/user/sleep-schedule")}
                                    className="edit-button"
                                >
                                    Edit
                                </button>
                            </div>
                            <button
                                onClick={() => handleNavigate("/user/sleep-schedule")}
                                className="action-button blue-button"
                            >
                                Manage Schedule
                            </button>
                        </div>

                        {/* Record Sleep Card */}
                        <div className="feature-card">
                            <div className="feature-header">
                                <h3 className="feature-title">Record Sleep</h3>
                                <button
                                    onClick={() => handleNavigate("/user/record-sleep")}
                                    className="feature-link"
                                >
                                    View History →
                                </button>
                            </div>
                            <div className="feature-content record-sleep-content">
                                <div className="record-sleep-icon">🛌</div>
                                <div className="record-sleep-text">Record your sleep time and quality</div>
                            </div>
                            <button
                                onClick={() => handleNavigate("/user/record-sleep")}
                                className="action-button red-button"
                            >
                                Record Sleep
                            </button>
                        </div>

                        {/* Sleep Progress Card */}
                        <div className="feature-card">
                            <div className="feature-header">
                                <h3 className="feature-title">Sleep Progress</h3>
                                <button
                                    onClick={() => handleNavigate("/user/sleep-progress")}
                                    className="feature-link"
                                >
                                    Full Report →
                                </button>
                            </div>
                            <div className="feature-content">
                                <div className="progress-container">
                                    <div className="progress-header">
                                        <span className="progress-label">Weekly Goal</span>
                                        <span className="progress-value">5/7 days</span>
                                    </div>
                                    <div className="progress-bar-container">
                                        <div className="progress-bar" style={{ width: '71%' }}></div>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => handleNavigate("/user/sleep-progress")}
                                className="action-button green-button"
                            >
                                View Progress
                            </button>
                        </div>

                        {/* Sleep Tips Card */}
                        <div className="feature-card">
                            <div className="feature-header">
                                <h3 className="feature-title">Sleep Tips</h3>
                                <button
                                    onClick={() => handleNavigate("/sleep-tips")}
                                    className="feature-link"
                                >
                                    More Tips →
                                </button>
                            </div>
                            <div className="feature-content">
                                <div className="tip-item">
                                    <span className="tip-icon">💡</span>
                                    Avoid caffeine at least 6 hours before bedtime
                                </div>
                                <div className="tip-item">
                                    <span className="tip-icon">💡</span>
                                    Keep your bedroom cool, between 60-67°F
                                </div>
                            </div>
                            <button
                                onClick={() => handleNavigate("/sleep-tips")}
                                className="action-button yellow-button"
                            >
                                Explore Tips
                            </button>
                        </div>
                    </div>
                    
                    {/* Modal for Sleep Records */}
                    {isModalOpen && (
                        <div className="modal">
                            <div className="modal-overlay" onClick={closeModal}></div>
                            <div className="modal-content">
                                <button className="modal-close-btn" onClick={closeModal}>✖</button>
                                <h2 className="modal-title">All Sleep Records</h2>
                                <ul className="sleep-records-list">
                                    <li className="sleep-record-item">
                                        <span className="record-time">23:00 - 7:00</span>
                                        <span className="record-quality good">Good</span>
                                    </li>
                                    <li className="sleep-record-item">
                                        <span className="record-time">22:30 - 6:30</span>
                                        <span className="record-quality fair">Fair</span>
                                    </li>
                                    <li className="sleep-record-item">
                                        <span className="record-time">00:00 - 8:00</span>
                                        <span className="record-quality excellent">Excellent</span>
                                    </li>
                                    {/* Add more records dynamically */}
                                </ul>
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

export default Landing;