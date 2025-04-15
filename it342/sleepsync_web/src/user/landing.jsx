import React from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../utils/auth";

const Landing = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser(navigate); // Use the logout utility
    };

    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <div style={{
            fontFamily: "'Inter', sans-serif",
            minHeight: "100vh",
            margin: 0,
            position: "relative",
            overflow: "hidden",
            background: "linear-gradient(135deg, rgba(44, 24, 48, 0.9) 0%, rgba(107, 78, 113, 0.9) 100%)",
            color: "white",
            display: "flex",
            flexDirection: "column"
        }}>
            {/* Navigation Bar */}
            <nav style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                zIndex: 1000,
                padding: "1rem 0",
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
            }}>
                <div style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0 2rem"
                }}>
                    <button onClick={() => handleNavigate("/user/landing")} style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        color: "white",
                        textDecoration: "none",
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        transition: "transform 0.3s ease"
                    }}>
                        <svg viewBox="0 0 24 24" style={{ width: "24px", height: "24px", fill: "white" }}>
                            <path d="M19 7h-8v8H3V7H1v10h2v3c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-3h2V7h-2zM7 19h10v-6H7v6z"/>
                        </svg>
                        SleepSync
                    </button>
                    <div style={{
                        display: "flex",
                        gap: "1.5rem"
                    }}>
                        <button onClick={() => handleNavigate("/user/landing")} style={{
                            color: "white",
                            textDecoration: "none",
                            fontWeight: 500,
                            padding: "0.5rem 1rem",
                            borderRadius: "8px",
                            transition: "all 0.3s ease",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            background: "none",
                            border: "none",
                            cursor: "pointer"
                        }}>
                            <i className="fas fa-home"></i> Home
                        </button>
                        <button onClick={handleLogout} style={{
                            color: "white",
                            background: "none",
                            border: "none",
                            fontWeight: 500,
                            padding: "0.5rem 1rem",
                            borderRadius: "8px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem"
                        }}>
                            <i className="fas fa-sign-out-alt"></i> Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Background Elements */}
            <div style={{
                position: "fixed",
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                background: `
                    radial-gradient(2px 2px at 20px 30px, white, rgba(0,0,0,0)),
                    radial-gradient(2px 2px at 40px 70px, white, rgba(0,0,0,0)),
                    radial-gradient(2px 2px at 50px 160px, white, rgba(0,0,0,0)),
                    radial-gradient(2px 2px at 90px 40px, white, rgba(0,0,0,0)),
                    radial-gradient(2px 2px at 130px 80px, white, rgba(0,0,0,0)),
                    radial-gradient(2px 2px at 160px 120px, white, rgba(0,0,0,0))`,
                animation: "twinkle 5s infinite",
                zIndex: 0
            }}></div>

            <div style={{
                position: "fixed",
                top: "85px",
                right: "15px",
                width: "100px",
                height: "100px",
                background: "radial-gradient(circle at 30% 30%, #ffffff, #f4f4f4)",
                borderRadius: "50%",
                boxShadow: "0 0 50px rgba(255, 255, 255, 0.5)",
                animation: "moonGlow 4s infinite ease-in-out",
                zIndex: 0
            }}></div>

            <style>
                {`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes twinkle {
                    0%, 100% { opacity: 0.8; }
                    50% { opacity: 0.5; }
                }
                @keyframes moonGlow {
                    0%, 100% { box-shadow: 0 0 50px rgba(255, 255, 255, 0.5); }
                    50% { box-shadow: 0 0 70px rgba(255, 255, 255, 0.7); }
                }
                `}
            </style>

            {/* Main Content */}
            <div style={{
                marginTop: "80px",
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "2rem",
                position: "relative",
                zIndex: 1
            }}>
                <div style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "20px",
                    padding: "3rem",
                    maxWidth: "1000px",
                    width: "100%",
                    animation: "fadeIn 1s ease-out"
                }}>
                    <h1 style={{
                        fontSize: "3rem",
                        marginBottom: "1.5rem",
                        color: "white",
                        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)"
                    }}>Welcome to SleepSync</h1>
                    
                    <p style={{
                        fontSize: "1.2rem",
                        marginBottom: "2rem",
                        color: "rgba(255, 255, 255, 0.9)",
                        lineHeight: 1.6
                    }}>Your journey to better sleep starts here. Navigate to your personalized dashboard to manage your sleep schedule efficiently.</p>

                    {/* Button Container */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: "1.5rem",
                        marginTop: "2rem"
                    }}>
                        <button
                            onClick={() => handleNavigate("/user/sleep-schedule")}
                            style={{
                                background: "rgba(255, 255, 255, 0.1)",
                                color: "white",
                                textDecoration: "none",
                                padding: "2rem",
                                borderRadius: "20px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "1rem",
                                transition: "all 0.3s ease",
                                backdropFilter: "blur(5px)",
                                fontWeight: 500,
                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                width: "100%",
                                height: "100%",
                                border: "none",
                                cursor: "pointer"
                            }}
                        >
                            <i className="fas fa-calendar-alt" style={{ fontSize: "1.5rem" }}></i> Sleep Schedule
                        </button>

                        <button
                            onClick={() => handleNavigate("/user/record-sleep")}
                            style={{
                                background: "rgba(255, 255, 255, 0.1)",
                                color: "white",
                                textDecoration: "none",
                                padding: "2rem",
                                borderRadius: "20px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "1rem",
                                transition: "all 0.3s ease",
                                backdropFilter: "blur(5px)",
                                fontWeight: 500,
                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                width: "100%",
                                height: "100%",
                                border: "none",
                                cursor: "pointer"
                            }}
                        >
                            <i className="fas fa-bed" style={{ fontSize: "1.5rem" }}></i> Record Sleep
                        </button>

                        <button
                            onClick={() => handleNavigate("/user/sleep-progress")}
                            style={{
                                background: "rgba(255, 255, 255, 0.1)",
                                color: "white",
                                textDecoration: "none",
                                padding: "2rem",
                                borderRadius: "20px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "1rem",
                                transition: "all 0.3s ease",
                                backdropFilter: "blur(5px)",
                                fontWeight: 500,
                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                width: "100%",
                                height: "100%",
                                border: "none",
                                cursor: "pointer"
                            }}
                        >
                            <i className="fas fa-chart-line" style={{ fontSize: "1.5rem" }}></i> Sleep Progress
                        </button>

                        <button
                            onClick={() => handleNavigate("/sleep-tips")}
                            style={{
                                background: "rgba(255, 255, 255, 0.1)",
                                color: "white",
                                textDecoration: "none",
                                padding: "2rem",
                                borderRadius: "20px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "1rem",
                                transition: "all 0.3s ease",
                                backdropFilter: "blur(5px)",
                                fontWeight: 500,
                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                width: "100%",
                                height: "100%",
                                border: "none",
                                cursor: "pointer"
                            }}
                        >
                            <i className="fas fa-lightbulb" style={{ fontSize: "1.5rem" }}></i> Sleep Tips
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer style={{
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                padding: "1.5rem",
                textAlign: "center",
                position: "relative",
                zIndex: 1,
                borderTop: "1px solid rgba(255, 255, 255, 0.1)"
            }}>
                <p>
                    © 2025 SleepSync. All rights reserved.
                </p>
            </footer>
        </div>
    );
};

export default Landing;