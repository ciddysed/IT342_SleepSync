import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../utils/auth";
import "./SleepTips.css";

const SleepTips = () => {
  const navigate = useNavigate();
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [wakeTime, setWakeTime] = useState("");
  const [checkedTips, setCheckedTips] = useState([]);
  const [sleepTips, setSleepTips] = useState({});
  const [showTips, setShowTips] = useState(false);
  const [allCategories, setAllCategories] = useState([]);

  // SVG icons for different categories
  const categoryIcons = {
    schedule: (
      <svg viewBox="0 0 24 24" className="category-icon">
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z" />
      </svg>
    ),
    environment: (
      <svg viewBox="0 0 24 24" className="category-icon">
        <path d="M20 4v16H4V4h16m2-2H2v20h20V2zm-8 9h-2V9h2v2z" />
      </svg>
    ),
    routine: (
      <svg viewBox="0 0 24 24" className="category-icon">
        <path d="M17.66 8L12 2.35 6.34 8A8.02 8.02 0 004 13.64c0 2 .78 4.11 2.34 5.67a7.99 7.99 0 0011.32 0c1.56-1.56 2.34-3.67 2.34-5.67A8.02 8.02 0 0017.66 8zM6 14c.01-2 .62-3.27 1.76-4.4L12 5.27l4.24 4.38C17.38 10.77 17.99 12 18 14H6z" />
      </svg>
    ),
    diet: (
      <svg viewBox="0 0 24 24" className="category-icon">
        <path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z" />
      </svg>
    ),
    exercise: (
      <svg viewBox="0 0 24 24" className="category-icon">
        <path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z" />
      </svg>
    )
  };

  // Function to get tips based on wake time
  const getSleepTips = (time) => {
    if (!time) return {};
    
    // Parse the time string to get the hour
    const [hours, minutes] = time.split(":").map(Number);
    
    // Early Morning (5 AM - 9 AM)
    if (5 <= hours && hours <= 9) {
      return {
        schedule: {
          title: "Optimal Sleep Schedule",
          icon: "clock",
          tips: ["Aim to sleep early, between 9:00 PM and 10:30 PM", "Ensure 7-9 hours of quality rest"]
        },
        environment: {
          title: "Sleep Environment",
          icon: "moon",
          tips: ["Use blackout curtains", "Minimize ambient noise", "Keep room temperature cool"]
        },
        routine: {
          title: "Evening Routine",
          icon: "book",
          tips: ["Avoid bright screens an hour before bed", "Limit stimulating activities"]
        },
        diet: {
          title: "Dietary Guidelines",
          icon: "coffee",
          tips: ["Avoid caffeine after mid-afternoon", "Light dinner 2-3 hours before bed"]
        },
        exercise: {
          title: "Exercise Recommendations",
          icon: "activity",
          tips: ["Morning exercise helps regulate circadian rhythm", "Complete workouts at least 3 hours before bed"]
        }
      };
    }
    // Late Morning (11 AM - 1 PM)
    else if (11 <= hours && hours <= 13) {
      return {
        schedule: {
          title: "Sleep Schedule",
          icon: "clock",
          tips: ["Sleep between midnight and 7:00 AM", "Maintain consistent sleep times"]
        },
        environment: {
          title: "Room Setup",
          icon: "moon",
          tips: ["Keep the room dark and quiet", "Use white noise if needed"]
        },
        routine: {
          title: "Relaxation Routine",
          icon: "book",
          tips: ["Read before bed", "Practice meditation or deep breathing"]
        }
      };
    }
    // Afternoon (2 PM - 5 PM)
    else if (14 <= hours && hours <= 17) {
      return {
        schedule: {
          title: "Sleep Duration",
          icon: "clock",
          tips: ["Aim for 7-8 hours of sleep", "Start bedtime routine from midnight", "Avoid late afternoon naps"]
        },
        environment: {
          title: "Room Conditions",
          icon: "moon",
          tips: ["Maintain cool room temperature", "Ensure complete darkness"]
        },
        diet: {
          title: "Evening Diet",
          icon: "coffee",
          tips: ["Choose light meals before bed", "Avoid spicy and heavy foods"]
        }
      };
    }
    // Evening (6 PM - 9 PM)
    else if (18 <= hours && hours <= 21) {
      return {
        schedule: {
          title: "Sleep Timing",
          icon: "clock",
          tips: ["Sleep between 10:00 PM and 6:00 AM", "Follow a consistent schedule"]
        },
        environment: {
          title: "Sleep Environment",
          icon: "moon",
          tips: ["Use blackout curtains", "Implement noise reduction"]
        },
        diet: {
          title: "Evening Habits",
          icon: "coffee",
          tips: ["Avoid evening caffeine", "Stay hydrated during the day"]
        },
        routine: {
          title: "Night Routine",
          icon: "book",
          tips: ["Avoid stimulating activities", "Practice calming exercises"]
        }
      };
    }
    // Night (10 PM - 11 PM)
    else if (22 <= hours && hours <= 23) {
      return {
        schedule: {
          title: "Night Schedule",
          icon: "clock",
          tips: ["Sleep before midnight", "Plan for complete sleep cycles"]
        },
        environment: {
          title: "Bedroom Setup",
          icon: "moon",
          tips: ["Minimize light exposure", "Create a relaxing atmosphere"]
        },
        routine: {
          title: "Pre-sleep Routine",
          icon: "book",
          tips: ["Begin relaxing an hour before sleep", "Practice gentle stretching"]
        }
      };
    }
    // Default/Other Hours
    else {
      return {
        schedule: {
          title: "General Guidelines",
          icon: "clock",
          tips: ["Maintain consistent wake-up times", "Adjust sleep schedule gradually"]
        }
      };
    }
  };

  // Update tips when wake time changes
  useEffect(() => {
    if (wakeTime) {
      const tips = getSleepTips(wakeTime);
      setSleepTips(tips);
      setAllCategories(Object.keys(tips));
    }
  }, [wakeTime]);

  const handleLogout = () => {
    logoutUser(navigate);
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowTips(true);
  };

  const toggleCheck = (category) => {
    setCheckedTips((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  const allChecked = allCategories.length > 0 && 
    allCategories.every((category) => checkedTips.includes(category));

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
          <li className="sidebar-menu-item">
            <button
              onClick={() => handleNavigate("/user/smart-alarm")}
              className="sidebar-menu-button"
            >
              <i className="sidebar-menu-icon">⏰</i> Alarm
            </button>
          </li>
          <li className="sidebar-menu-item active">
            <button
              onClick={() => handleNavigate("/user/sleep-tips")}
              className="sidebar-menu-button active"
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
          <div className="welcome-section">
            <div className="welcome-card">
              <h1 className="welcome-title">Personalized Sleep Tips</h1>
              <p className="welcome-subtitle">Optimize your sleep quality with customized recommendations based on your wake-up time.</p>
            </div>
          </div>
          
          {!showTips ? (
            <div className="wake-time-form-container">
              <h2 className="section-title">What time do you usually wake up?</h2>
              <p className="section-description">
                We'll provide customized sleep tips based on your wake-up time.
              </p>
              <form onSubmit={handleSubmit} className="wake-time-form">
                <input
                  type="time"
                  value={wakeTime}
                  onChange={(e) => setWakeTime(e.target.value)}
                  className="time-input"
                  required
                />
                <button type="submit" className="submit-btn">
                  Get Personalized Tips
                </button>
              </form>
            </div>
          ) : (
            <>
              <h2 className="section-title">Sleep Tips for {wakeTime} Wake-Up</h2>
              <div className="tips-container">
                {Object.entries(sleepTips).map(([category, data]) => (
                  <div 
                    key={category}
                    className={`tip-card ${checkedTips.includes(category) ? "checked" : ""}`}
                    onClick={() => toggleCheck(category)}
                  >
                    <div className="card-header">
                      <div className="card-icon">
                        {categoryIcons[category]}
                      </div>
                      <h3 className="card-title">{data.title}</h3>
                      <div className="checkbox">
                        {checkedTips.includes(category) && <span className="checkmark">✓</span>}
                      </div>
                    </div>
                    <div className="card-content">
                      <ul className="tips-list">
                        {data.tips.map((tip, index) => (
                          <li key={index} className="tip-item">{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              {allChecked && (
                <div className="cta-container">
                  <button 
                    className="cta-button"
                    onClick={() => handleNavigate("/user/alarm-list")}
                  >
                    Continue to My Alarms
                  </button>
                </div>
              )}

              <button 
                className="reset-button"
                onClick={() => {
                  setShowTips(false);
                  setCheckedTips([]);
                }}
              >
                Change Wake-Up Time
              </button>
            </>
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

export default SleepTips;