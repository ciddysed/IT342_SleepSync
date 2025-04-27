import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../utils/auth";
import "./Landing.css"; // Import the same CSS file as Landing

const SmartAlarm = () => {
    const [alarms, setAlarms] = useState(() => {
        const savedAlarms = localStorage.getItem("sleepSyncAlarms");
        return savedAlarms ? JSON.parse(savedAlarms) : [];
    });
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newAlarmTime, setNewAlarmTime] = useState("");
    const [editingAlarmId, setEditingAlarmId] = useState(null);
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

    const openModal = (alarmId = null) => {
        if (alarmId) {
            const alarm = alarms.find(a => a.id === alarmId);
            setNewAlarmTime(alarm.time);
            setEditingAlarmId(alarmId);
        } else {
            setNewAlarmTime("");
            setEditingAlarmId(null);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setNewAlarmTime("");
        setEditingAlarmId(null);
    };

    const saveAlarm = () => {
        if (!newAlarmTime) return;
        
        if (editingAlarmId) {
            // Edit existing alarm
            setAlarms(prevAlarms => 
                prevAlarms.map(alarm => 
                    alarm.id === editingAlarmId ? { ...alarm, time: newAlarmTime } : alarm
                )
            );
        } else {
            // Add new alarm
            const newAlarm = {
                id: Date.now().toString(),
                time: newAlarmTime,
                enabled: true
            };
            setAlarms(prevAlarms => [...prevAlarms, newAlarm]);
        }
        closeModal();
    };

    const deleteAlarm = (id) => {
        setAlarms((prevAlarms) => prevAlarms.filter((alarm) => alarm.id !== id));
    };

    const toggleAlarm = (id) => {
        setAlarms(prevAlarms => 
            prevAlarms.map(alarm => 
                alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
            )
        );
    };

    useEffect(() => {
        localStorage.setItem("sleepSyncAlarms", JSON.stringify(alarms));
    }, [alarms]);

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
                    <li className="sidebar-menu-item">
                        <button
                            onClick={() => handleNavigate("/user/sleep-progress")}
                            className="sidebar-menu-button"
                        >
                            <i className="sidebar-menu-icon">📊</i> Sleep Progress
                        </button>
                    </li>
                    <li className="sidebar-menu-item active">
                        <button
                            onClick={() => handleNavigate("/user/smart-alarm")}
                            className="sidebar-menu-button active"
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
            <section className={`main-wrapper ${sidebarVisible ? 'main-wrapper-with-sidebar' : 'main-wrapper-without-sidebar'}`}>
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
                            <h1 className="welcome-title">Smart Alarm Management</h1>
                            <p className="welcome-subtitle">Set up and manage your alarms to wake up at the optimal time during your sleep cycle.</p>
                        </div>
                    </div>

                    <div className="features-section">
                        {/* Main Alarm Card */}
                        <div className="feature-card">
                            <div className="feature-header">
                                <h3 className="feature-title">My Alarms</h3>
                                <button
                                    onClick={() => openModal()}
                                    className="feature-link"
                                >
                                    + Add New
                                </button>
                            </div>
                            <div className="alarm-list-container">
                                {alarms.length === 0 ? (
                                    <div className="empty-alarm-state">
                                        <div className="empty-alarm-icon">⏰</div>
                                        <p className="empty-alarm-text">No alarms set yet</p>
                                        <button 
                                            onClick={() => openModal()} 
                                            className="action-button blue-button"
                                        >
                                            Create Your First Alarm
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        {alarms.map((alarm) => (
                                            <div key={alarm.id} className="alarm-item">
                                                <div className="alarm-info">
                                                    <div className="alarm-time">{alarm.time}</div>
                                                    <div className="alarm-status">
                                                        <span className={`status-indicator ${alarm.enabled ? 'status-active' : 'status-inactive'}`}></span>
                                                        <span className="status-text">{alarm.enabled ? 'Active' : 'Inactive'}</span>
                                                    </div>
                                                </div>
                                                <div className="alarm-actions">
                                                    <button 
                                                        onClick={() => toggleAlarm(alarm.id)} 
                                                        className={`toggle-btn ${alarm.enabled ? 'toggle-on' : 'toggle-off'}`}
                                                    >
                                                        {alarm.enabled ? '✓' : '✕'}
                                                    </button>
                                                    <button 
                                                        onClick={() => openModal(alarm.id)} 
                                                        className="edit-btn"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button 
                                                        onClick={() => deleteAlarm(alarm.id)} 
                                                        className="delete-btn"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Modal for Add/Edit Alarm */}
                    {isModalOpen && (
                        <div className="modal">
                            <div className="modal-overlay" onClick={closeModal}></div>
                            <div className="modal-content">
                                <button className="modal-close-btn" onClick={closeModal}>✖</button>
                                <h2 className="modal-title">{editingAlarmId ? "Edit Alarm" : "Add New Alarm"}</h2>
                                <div className="alarm-form">
                                    <div className="form-group">
                                        <label htmlFor="alarmTime" className="form-label">Alarm Time</label>
                                        <input
                                            type="time"
                                            id="alarmTime"
                                            value={newAlarmTime}
                                            onChange={(e) => setNewAlarmTime(e.target.value)}
                                            className="form-input"
                                            required
                                        />
                                    </div>
                                    <div className="form-actions">
                                        <button onClick={closeModal} className="action-button cancel-button">Cancel</button>
                                        <button onClick={saveAlarm} className="action-button blue-button">
                                            {editingAlarmId ? "Update Alarm" : "Save Alarm"}
                                        </button>
                                    </div>
                                </div>
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

export default SmartAlarm;